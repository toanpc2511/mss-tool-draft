import {
	AfterViewInit,
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
	ChangeDetectorRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { filter, pluck, switchMap, takeUntil, tap, catchError } from 'rxjs/operators';
import { IError } from '../../../shared/models/error.model';
import { DestroyService } from '../../../shared/services/destroy.service';
import { FilterService } from '../../../shared/services/filter.service';
import { SortService } from '../../../shared/services/sort.service';
import { ShiftService } from '../shift.service';
import { TValidators } from './../../../shared/validators';
import { SubheaderService } from './../../../_metronic/partials/layout/subheader/_services/subheader.service';
import {
	IShiftRequestChange,
	EShiftChangRequestStatus,
	EShiftChangRequestType
} from './../shift.service';
import { of } from 'rxjs';

@Component({
	selector: 'app-shift-change-detail',
	templateUrl: './shift-change-detail.component.html',
	styleUrls: ['./shift-change-detail.component.scss'],
	providers: [SortService, FilterService, DestroyService, NgbActiveModal]
})
export class ShiftChangeDetailComponent implements OnInit, AfterViewInit {
	@ViewChild('approveRequest') approveRequest: TemplateRef<any>;
	@ViewChild('rejectRequest') rejectRequest: TemplateRef<any>;

	eShiftChangeRequestStatus = EShiftChangRequestStatus;
	eShiftChangRequestType = EShiftChangRequestType;
	shiftChangeRequestData: IShiftRequestChange;

	activeModal: NgbActiveModal;

	reasonControl = new FormControl(null, [TValidators.required]);

	constructor(
		private modalService: NgbModal,
		private toastr: ToastrService,
		private destroy$: DestroyService,
		private shiftService: ShiftService,
		private subheader: SubheaderService,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private cdr: ChangeDetectorRef
	) {
		this.modalService.activeInstances
			.pipe(
				tap((modalRefs) => (this.activeModal = modalRefs[0])),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	ngOnInit(): void {
		this.activatedRoute.params
			.pipe(
				pluck('id'),
				switchMap((id: string) => this.shiftService.getDetailShiftRequestChange(id)),
				tap((res) => {
					this.shiftChangeRequestData = res.data;
					console.log(this.shiftChangeRequestData);

					this.cdr.detectChanges();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	ngAfterViewInit(): void {
		this.setBreadcumb();
	}

	setBreadcumb() {
		setTimeout(() => {
			this.subheader.setBreadcrumbs([
				{
					title: 'Quản lý ca làm việc',
					linkText: 'Quản lý ca làm việc',
					linkPath: '/ca-lam-viec'
				},
				{
					title: 'Danh sách yêu cầu đổi ca',
					linkText: 'Danh sách yêu cầu đổi ca',
					linkPath: '/ca-lam-viec/doi-ca'
				},
				{
					title: 'Chi tiết yêu cầu đổi ca',
					linkText: 'Chi tiết yêu cầu đổi ca',
					linkPath: null
				}
			]);
		}, 1);
	}

	checkError(error: IError) {
		if (error.code === 'SUN-OIL-4893' || error.code === 'SUN-OIL-4909') {
			this.toastr.error('Lịch/ca làm việc không tồn tại');
		}
	}

	openRejectRequestModal() {
		this.reasonControl.reset();

		const modalRef = this.modalService.open(this.rejectRequest, {
			size: 'xs',
			backdrop: 'static'
		});

		modalRef.closed
			.pipe(
				filter((res) => res),
				switchMap(() => {
					return this.shiftService.rejectShiftRequestChange(
						this.shiftChangeRequestData.id,
						this.reasonControl.value,
						this.shiftChangeRequestData.type
					);
				}),
				tap((res) => {
					if (res.data) {
						this.toastr.success('Đã từ chối yêu cầu thay ca/đổi ca!');
					}
					this.goBack();
				}),
				catchError((error: IError) => {
					this.checkError(error);
					return of();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	openApproveRequestModal() {
		const modalRef = this.modalService.open(this.approveRequest, {
			size: 'xs',
			backdrop: 'static'
		});

		modalRef.closed
			.pipe(
				filter((res) => res),
				switchMap(() => {
					return this.shiftService.approveShiftRequestChange(this.shiftChangeRequestData.id, this.shiftChangeRequestData.type);
				}),
				tap((res) => {
					if (res.data) {
						this.toastr.success('Đã phê duyệt yêu cầu thay ca/đổi ca!');
					}
					this.goBack();
				}),
				catchError((error: IError) => {
					this.checkError(error);
					return of();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	goBack() {
		this.router.navigate(['/ca-lam-viec/doi-ca']);
	}

	rejectRequestShiftChange() {
		this.reasonControl.markAsTouched();
		if (this.reasonControl.invalid) {
			return;
		}
		this.activeModal.close(true);
	}
}
