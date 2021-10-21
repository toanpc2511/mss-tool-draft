import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	IDataTransfer,
	ShiftWorkConfigModalComponent
} from '../shift-work-config-modal/shift-work-config-modal.component';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { convertTimeToString } from '../../../shared/helpers/functions';
import {
	EShiftChangRequestStatus,
	EShiftChangRequestType,
	IShiftConfig,
	IShiftRequestChange,
	ShiftService
} from '../shift.service';
import { FilterField, SortState } from '../../../_metronic/shared/crud-table';
import { SortService } from '../../../shared/services/sort.service';
import { FilterService } from '../../../shared/services/filter.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DestroyService } from '../../../shared/services/destroy.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-shift-change',
	templateUrl: './shift-change.component.html',
	styleUrls: ['./shift-change.component.scss'],
	providers: [SortService, FilterService, DestroyService]
})
export class ShiftChangeComponent implements OnInit {
	eShiftChangRequestType = EShiftChangRequestType;
	eShiftChangRequestStatus = EShiftChangRequestStatus;

	searchFormControl: FormControl;
	dataSource: Array<IShiftRequestChange> = [];
	sorting: SortState;

	constructor(
		private modalService: NgbModal,
		private toastr: ToastrService,
		private cdr: ChangeDetectorRef,
		private sortService: SortService<IShiftConfig>,
		private filterService: FilterService<IShiftConfig>,
		private destroy$: DestroyService,
		private shiftService: ShiftService,
		private router: Router
	) {
		this.sorting = null;
		this.searchFormControl = new FormControl();
	}

	ngOnInit(): void {
		this.getListShiftRequestChange();

		this.searchFormControl.valueChanges
			.pipe(debounceTime(500), takeUntil(this.destroy$))
			.subscribe((value) => {
				// if (value.trim()) {
				// } else {
				// }

				// this.dataSource = this.sortService.sort(
				// 	this.filterService.filter(this.dataSourceTemp, this.filterField.field)
				// );
				this.cdr.detectChanges();
			});
	}

	getListShiftRequestChange() {
		this.shiftService.getShiftRequestChangeList('', null).subscribe((res) => {
			console.log(res);

			this.dataSource = res.data;
			this.cdr.detectChanges();
		});
	}

	sort(column: string) {
		if (this.sorting && this.sorting.column === column) {
			if (this.sorting.direction === 'ASC') {
				this.sorting = { column, direction: 'DESC' };
			} else {
				this.sorting = null;
			}
		} else {
			this.sorting = { column, direction: 'ASC' };
		}
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
							// this.getListShift();
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
				// this.getListShift();
			}
		});
	}

	checkError(error: IError) {
		if (error.code === 'SUN-OIL-4748') {
			this.toastr.error('Ca làm việc đang được gán lịch cho nhân viên');
		}
	}

	gotoDetail(id: string) {
		this.router.navigate([`ca-lam-viec/chi-tiet-doi-ca/${id}`]);
	}
}
