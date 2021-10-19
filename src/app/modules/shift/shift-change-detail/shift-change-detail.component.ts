import { TValidators } from './../../../shared/validators';
import { SubheaderService } from './../../../_metronic/partials/layout/subheader/_services/subheader.service';
import {
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
	AfterViewInit
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
	IDataTransfer,
	ShiftWorkConfigModalComponent
} from '../shift-work-config-modal/shift-work-config-modal.component';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { convertTimeToString } from '../../../shared/helpers/functions';
import { IShiftConfig, ShiftService } from '../shift.service';
import { FilterField, SortState } from '../../../_metronic/shared/crud-table';
import { SortService } from '../../../shared/services/sort.service';
import { FilterService } from '../../../shared/services/filter.service';
import { debounceTime, filter, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../shared/services/destroy.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-shift-change-detail',
	templateUrl: './shift-change-detail.component.html',
	styleUrls: ['./shift-change-detail.component.scss'],
	providers: [SortService, FilterService, DestroyService, NgbActiveModal]
})
export class ShiftChangeDetailComponent implements OnInit, AfterViewInit {
	@ViewChild('approveRequest') approveRequest: TemplateRef<any>;
	@ViewChild('rejectRequest') rejectRequest: TemplateRef<any>;

	activeModal: NgbActiveModal;

	searchFormControl: FormControl;
	dataSource: Array<IShiftConfig>;
	dataSourceTemp: Array<IShiftConfig>;
	sorting: SortState;

	filterField: FilterField<{
		name: null;
		description: null;
	}>;

	reasonControl = new FormControl(null, [TValidators.required]);

	constructor(
		private modalService: NgbModal,
		private toastr: ToastrService,
		private cdr: ChangeDetectorRef,
		private sortService: SortService<IShiftConfig>,
		private filterService: FilterService<IShiftConfig>,
		private destroy$: DestroyService,
		private shiftService: ShiftService,
		private subheader: SubheaderService
	) {
		this.dataSource = this.dataSourceTemp = [];
		this.sorting = sortService.sorting;
		this.filterField = new FilterField({
			name: null,
			description: null
		});
		this.searchFormControl = new FormControl();

		this.modalService.activeInstances
			.pipe(
				tap((modalRefs) => (this.activeModal = modalRefs[0])),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	ngOnInit(): void {
		this.getListShift();

		this.searchFormControl.valueChanges
			.pipe(debounceTime(500), takeUntil(this.destroy$))
			.subscribe((value) => {
				if (value.trim()) {
					this.filterField.setFilterFieldValue(value.trim());
				} else {
					this.filterField.setFilterFieldValue(null);
				}

				this.dataSource = this.sortService.sort(
					this.filterService.filter(this.dataSourceTemp, this.filterField.field)
				);
				this.cdr.detectChanges();
			});
	}

	ngAfterViewInit(): void {
		this.setBreadcumb();
	}

	setBreadcumb() {
		const subBreadcump = {
			title: 'Chi tiết yêu cầu đổi ca',
			linkText: 'Chi tiết yêu cầu đổi ca',
			linkPath: null
		};
		setTimeout(() => {
			this.subheader.setBreadcrumbs([
				{
					title: 'Quản lý ca làm việc',
					linkText: 'Quản lý ca làm việc',
					linkPath: '/ca-lam-viec'
				},
				subBreadcump
			]);
		}, 1);
	}

	getListShift() {
		this.shiftService.getListShiftConfig().subscribe((res) => {
			this.dataSource = this.dataSourceTemp = res.data;
			this.dataSource = this.sortService.sort(
				this.filterService.filter(this.dataSourceTemp, this.filterField.field)
			);
			this.cdr.detectChanges();
		});
	}

	sort(column: string) {
		this.dataSource = this.sortService.sort(this.dataSourceTemp, column);
	}

	formatTime(hour: number, minute: number) {
		return convertTimeToString(hour, minute);
	}

	deleteShiftConfig($event: Event, item: IShiftConfig) {
		$event.stopPropagation();
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xoá ${item.name} ?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.shiftService.deleteShiftConfg(item.id).subscribe(
					(res) => {
						if (res.data) {
							this.getListShift();
						}
					},
					(err: IError) => {
						this.checkError(err);
					}
				);
			}
		});
	}

	createModal($event?: Event, data?: IDataTransfer): void {
		if ($event) {
			$event.stopPropagation();
		}
		const modalRef = this.modalService.open(ShiftWorkConfigModalComponent, {
			backdrop: 'static',
			size: 'lg'
		});

		modalRef.componentInstance.data = {
			title: data ? 'Sửa ca' : 'Thêm ca',
			shiftConfig: data
		};

		modalRef.result.then((result) => {
			if (result) {
				this.getListShift();
			}
		});
	}

	checkError(error: IError) {
		if (error.code === 'SUN-OIL-4748') {
			this.toastr.error('Ca làm việc đang được gán lịch cho nhân viên');
		}
	}

	openRejectRequestModal() {
		const modalRef = this.modalService.open(this.rejectRequest, {
			size: 'xs',
			backdrop: 'static'
		});

		modalRef.closed
			.pipe(
				filter((res) => res),
				tap(() => {
					console.log('rejected');
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
				tap(() => {
					console.log('approved');
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}
}
