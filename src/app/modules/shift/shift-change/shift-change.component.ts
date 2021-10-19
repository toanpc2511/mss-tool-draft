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
	IShiftConfig,
	IShiftRequestChange,
	ShiftService
} from '../shift.service';
import { FilterField, SortState } from '../../../_metronic/shared/crud-table';
import { SortService } from '../../../shared/services/sort.service';
import { FilterService } from '../../../shared/services/filter.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DestroyService } from '../../../shared/services/destroy.service';

@Component({
	selector: 'app-shift-change',
	templateUrl: './shift-change.component.html',
	styleUrls: ['./shift-change.component.scss'],
	providers: [SortService, FilterService, DestroyService]
})
export class ShiftChangeComponent implements OnInit {
	eShiftChangRequestStatus = EShiftChangRequestStatus;

	searchFormControl: FormControl;
	dataSource: Array<IShiftRequestChange>;
	dataSourceTemp: Array<IShiftRequestChange>;
	sorting: SortState;

	filterField: FilterField<{
		name: null;
		description: null;
	}>;

	constructor(
		private modalService: NgbModal,
		private toastr: ToastrService,
		private cdr: ChangeDetectorRef,
		private sortService: SortService<IShiftConfig>,
		private filterService: FilterService<IShiftConfig>,
		private destroy$: DestroyService,
		private shiftService: ShiftService
	) {
		this.dataSource = this.dataSourceTemp = [];
		this.sorting = sortService.sorting;
		this.filterField = new FilterField({
			name: null,
			description: null
		});
		this.searchFormControl = new FormControl();
	}

	ngOnInit(): void {
		// this.getListShift();

		this.searchFormControl.valueChanges
			.pipe(debounceTime(500), takeUntil(this.destroy$))
			.subscribe((value) => {
				if (value.trim()) {
					this.filterField.setFilterFieldValue(value.trim());
				} else {
					this.filterField.setFilterFieldValue(null);
				}

				// this.dataSource = this.sortService.sort(
				// 	this.filterService.filter(this.dataSourceTemp, this.filterField.field)
				// );
				this.cdr.detectChanges();
			});
	}

	getListShiftRequestChange() {
		// this.shiftService.getListShiftConfig().subscribe((res) => {
		// 	this.dataSource = this.dataSourceTemp = res.data;
		// 	this.dataSource = this.sortService.sort(
		// 		this.filterService.filter(this.dataSourceTemp, this.filterField.field)
		// 	);
		// 	this.cdr.detectChanges();
		// });
	}

	sort(column: string) {
		// this.dataSource = this.sortService.sort(this.dataSourceTemp, column);
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
}
