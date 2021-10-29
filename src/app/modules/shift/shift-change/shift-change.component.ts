import { takeUntil, concatMap, debounceTime } from 'rxjs/operators';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { convertTimeToString } from '../../../shared/helpers/functions';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { IError } from '../../../shared/models/error.model';
import { DestroyService } from '../../../shared/services/destroy.service';
import { FilterService } from '../../../shared/services/filter.service';
import { SortService } from '../../../shared/services/sort.service';
import { SortState } from '../../../_metronic/shared/crud-table';
import {
	IDataTransfer,
	ShiftWorkConfigModalComponent
} from '../shift-work-config-modal/shift-work-config-modal.component';
import {
	EShiftChangRequestStatus,
	EShiftChangRequestType,
	IShiftConfig,
	IShiftRequestChange,
	ShiftService
} from '../shift.service';
import {
	PaginatorState,
	IPaginatorState
} from './../../../_metronic/shared/crud-table/models/paginator.model';
import { of } from 'rxjs';

@Component({
	selector: 'app-shift-change',
	templateUrl: './shift-change.component.html',
	styleUrls: ['./shift-change.component.scss'],
	providers: [SortService, FilterService, DestroyService]
})
export class ShiftChangeComponent implements OnInit {
	eShiftChangRequestType = EShiftChangRequestType;
	eShiftChangRequestStatus = EShiftChangRequestStatus;

	paginatorState = new PaginatorState();
	dataSource: Array<IShiftRequestChange> = [];
	sorting: SortState;
	searchFormGroup: FormGroup;

	constructor(
		private modalService: NgbModal,
		private toastr: ToastrService,
		private cdr: ChangeDetectorRef,
		private sortService: SortService<IShiftConfig>,
		private filterService: FilterService<IShiftConfig>,
		private destroy$: DestroyService,
		private shiftService: ShiftService,
		private router: Router,
		private fb: FormBuilder
	) {
		this.init();
	}

	init() {
		this.paginatorState.page = 1;
		this.paginatorState.pageSize = 15;
		this.paginatorState.pageSizes = [5, 10, 15, 20];
		this.paginatorState.total = 0;
		this.sorting = null;
	}

	ngOnInit(): void {
		this.searchFormGroup = this.fb.group({
			type: [''],
			status: [''],
			searchText: ['']
		});

		this.searchFormGroup.valueChanges
			.pipe(
				debounceTime(400),
				concatMap(() => {
					this.getListShiftRequestChange();
					return of();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();

		this.getListShiftRequestChange();
	}

	getListShiftRequestChange() {
		const searchData: { type: string; status: string; searchText: string } =
			this.searchFormGroup.getRawValue();
		console.log(searchData, this.searchFormGroup.getRawValue());
		

		this.shiftService
			.getShiftRequestChangeList(
				searchData.status || '',
				searchData.type || '',
				this.sorting?.column || '',
				this.sorting?.direction || '',
				searchData.searchText || '',
				this.paginatorState.page,
				this.paginatorState.pageSize
			)
			.subscribe((res) => {
				this.checkRes(res);
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
		this.getListShiftRequestChange();
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

	checkRes(res) {
		this.dataSource = res.data;
		this.paginatorState.recalculatePaginator(res.meta.total);
		this.cdr.detectChanges();
	}

	checkError(error: IError) {
		if (error.code === 'SUN-OIL-4748') {
			this.toastr.error('Ca làm việc đang được gán lịch cho nhân viên');
		}
	}

	gotoDetail(id: string) {
		this.router.navigate([`/ca-lam-viec/doi-ca/chi-tiet-doi-ca/${id}`]);
	}

	pagingChange($event: IPaginatorState) {
		this.paginatorState = $event as PaginatorState;
		this.getListShiftRequestChange();
	}
}
