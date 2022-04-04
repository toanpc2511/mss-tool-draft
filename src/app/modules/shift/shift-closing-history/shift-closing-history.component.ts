import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LIST_STATUS_SHIFT_CLOSING } from '../../../shared/data-enum/list-status';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { Router } from '@angular/router';
import { ILockShift, IOrderOfShift, IShiftConfig, IStationActiveByToken, ShiftService } from '../shift.service';
import { convertTimeToString } from '../../../shared/helpers/functions';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from '../../../shared/services/destroy.service';

@Component({
	selector: 'app-shift-closing-history',
	templateUrl: './shift-closing-history.component.html',
	styleUrls: ['./shift-closing-history.component.scss'],
	providers: [FormBuilder, DestroyService]
})
export class ShiftClosingHistoryComponent extends BaseComponent implements OnInit {
	searchForm: FormGroup;
	today: string;
	dataSource: ILockShift[] = [];
	listStatus = LIST_STATUS_SHIFT_CLOSING;
  listStations: IStationActiveByToken[] = [];
	listShifts: IShiftConfig[] = [];
	paginatorState = new PaginatorState();
	listOrder: IOrderOfShift[] = [];

	constructor(
		private fb: FormBuilder,
		private modalService: NgbModal,
		private router: Router,
		private shiftService: ShiftService,
		private cdr: ChangeDetectorRef,
		private toastr: ToastrService,
    private destroy$: DestroyService
	) {
    super();
		this.today = moment().format('DD/MM/YYYY');

		this.paginatorState.page = 1;
		this.paginatorState.pageSize = 10;
		this.paginatorState.pageSizes = [5, 10, 15, 20];
		this.paginatorState.total = 0;
	}

	ngOnInit(): void {
		this.buildForm();
		this.initDate();

		this.getStationToken();

		this.shiftService.getListShiftConfig().subscribe((res) => {
			this.listShifts = res.data;
			this.cdr.detectChanges();
		});
		this.onSearch();
	}

	buildForm() {
		this.searchForm = this.fb.group({
			stationName: [''],
			shiftName: [''],
			startAt: [],
			endAt: []
		});
	}

	initDate() {
		this.searchForm.get('startAt').patchValue(this.today);
		this.searchForm.get('endAt').patchValue(this.today);
	}

  getStationToken() {
    this.shiftService
      .getStationByToken('NOT_DELETE', 'false')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.listStations = res.data;
        this.cdr.detectChanges();
      });
  }

	onSearch() {
		const timeStart = new Date(
			moment(this.searchForm.get('startAt').value, 'DD/MM/YYYY').format('MM/DD/YYYY')
		);
		const timeEnd = new Date(
			moment(this.searchForm.get('endAt').value, 'DD/MM/YYYY').format('MM/DD/YYYY')
		);

		if (timeStart > timeEnd) {
			this.searchForm.get('startAt').setErrors({ errorDateStart: true });
			this.searchForm.get('endAt').setErrors({ errorDateEnd: true });
			return;
		} else {
			this.searchForm.get('startAt').setErrors(null);
			this.searchForm.get('endAt').setErrors(null);
		}

		this.shiftService
			.getListLockShift(
				this.paginatorState.page,
				this.paginatorState.pageSize,
				this.searchForm.value
			)
			.subscribe((res) => {
				this.dataSource = res.data;
				this.paginatorState.recalculatePaginator(res.meta.total);
				this.cdr.detectChanges();
			});
	}

	formatTime(hour: number, minute: number) {
		return convertTimeToString(hour, minute);
	}

	pagingChange($event: IPaginatorState) {
		this.paginatorState = $event as PaginatorState;
		this.onSearch();
	}

	viewDetail(item: ILockShift) {
		if (item.status === 'OPEN') {
			return;
		}
		this.shiftService.lockShiftId = item.id;
		this.shiftService.statusLockShift = status;
		this.shiftService.stationId = item.stationId;
		this.router.navigate([`/ca-lam-viec/lich-su-chot-ca/chi-tiet/${item.id}`], {
			queryParams: { status: item.status, stationId: item.stationId, shiftId: item.shiftId, chip: item.chip }
		});
	}

	modalConfirm($event?: Event, data?: ILockShift): void {
		if ($event) {
			$event.stopPropagation();
		}
		this.shiftService.getOrdersOfShift(data.id).subscribe((res) => {
			this.listOrder = res.data;
			this.cdr.detectChanges();

			if (this.listOrder.length > 0) {
				const modalRef = this.modalService.open(ModalConfirmComponent, {
					backdrop: 'static',
					size: 'lg'
				});

				modalRef.componentInstance.data = {
					title: 'Xác nhận yêu cầu chốt ca',
					order: this.listOrder,
					lockShiftInfo: data
				};
			} else {
				const dataReq = {
					lockShiftId: data.id
				};
				this.shiftService.createFuelProductRevenue(dataReq).subscribe(
					(res) => {
						if (res.data) {
							this.router.navigate([`/ca-lam-viec/lich-su-chot-ca/chi-tiet/${data.id}`], {
								queryParams: { status: data.status, stationId: data.stationId, shiftId: data.shiftId, chip: data.chip }
							});
						}
					},
					(err: IError) => this.checkError(err)
				);
			}
		});
	}

	checkError(error: IError) {
		if (error.code === 'SUN-OIL-4874') {
			this.toastr.error('Ngày bắt đầu/kết thúc không hợp lệ');
		}
		if (error.code === 'SUN-OIL-4894') {
			this.toastr.error('Không tồn tại ca cần chốt.');
		}
	}
}
