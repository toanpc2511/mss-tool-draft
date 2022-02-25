import { BaseComponent } from '../../../shared/components/base/base.component';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
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
import { TValidators } from '../../../shared/validators';
import { SubheaderService } from '../../../_metronic/partials/layout';
import {
	IShiftRequestChange,
	EShiftChangRequestStatus,
	EShiftChangRequestType
} from '../shift.service';
import { of } from 'rxjs';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';

@Component({
	selector: 'app-shift-change-detail',
	templateUrl: './shift-change-detail.component.html',
	styleUrls: ['./shift-change-detail.component.scss'],
	providers: [SortService, FilterService, DestroyService, NgbActiveModal]
})
export class ShiftChangeDetailComponent extends BaseComponent implements OnInit, AfterViewInit {
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
		super();
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
		if (error.code === 'SUN-OIL-4909') {
			this.toastr.error('Lịch/ca làm việc không tồn tại');
		} else if(error.code === 'SUN-OIL-4901') {
			this.toastr.error(`${this.shiftChangeRequestData.employeeCodeFrom} - ${this.shiftChangeRequestData.employeeNameFrom} đã tạo yêu cầu thay ca/đổi ca quá 5 lần/tháng`)
		} else if(error.code === 'SUN-OIL-4979') {
			this.toastr.error('Yêu cầu đổi ca thay ca chưa được duyệt')
		} else if(error.code === 'SUN-OIL-4873') {
			this.toastr.error('Vui lòng chọn ca lớn hơn giờ hiện tại')
		} else if(error.code === 'SUN-OIL-4893') {
			this.toastr.error('Lịch làm việc không tồn tại hoặc đã ở quá khứ')
		} else if(error.code === 'SUN-OIL-4922') {
			this.toastr.error('Thời gian làm việc đã bắt đầu , không thể yêu cầu thay ca')
		} else if(error.code === 'SUN-OIL-4799') {
			this.toastr.error('Không được đổi ca khác trạm làm việc')
		} else if(error.code === 'SUN-OIL-4925') {
			this.toastr.error('Nhân viên bị trùng hoặc đã có lịch làm việc . Không thể hoàn duyệt')
		} else if(error.code === 'SUN-OIL-4981') {
			this.toastr.error('Không thể hoàn duyệt vì không tìm thấy lịch làm việc.')
		} else if(error.code === 'SUN-OIL-4984') {
			this.toastr.error('Ca làm việc đã bắt đầu không được hoàn duyệt.')
		} else if(error.code === 'SUN-OIL-4982') {
			this.toastr.error('Không thể phê duyệt vì không tìm thấy lịch làm việc')
		} else if(error.code === 'SUN-OIL-4980') {
			this.toastr.error(' Nhân viên bị trùng hoặc đã có lịch làm việc. Không thể hoàn duyệt')
		} else {
			this.toastr.error(`${error.code} - ${error.message}`);
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
						this.shiftChangeRequestData.type,
						this.shiftChangeRequestData.employeeIdFrom
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
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});

		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn duyệt yêu cầu ?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.closed
			.pipe(
				filter((res) => res),
				switchMap(() => {
					return this.shiftService.approveShiftRequestChange(this.shiftChangeRequestData.id, this.shiftChangeRequestData.type, this.shiftChangeRequestData.employeeIdFrom);
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

	openCompleteApproveModal() {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});

		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn hoàn duyệt yêu cầu ?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        this.shiftService
          .rollBackShift(Number(this.shiftChangeRequestData.id))
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (res) => {
              if (res.data) {
                this.toastr.success('Hoàn duyệt yêu cầu thay ca/đổi ca thành công');
                this.goBack();
              }
            },
            (err: IError) => this.checkError(err)
          );
      }
    });
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
