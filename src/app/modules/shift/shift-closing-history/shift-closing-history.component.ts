import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { LIST_STATUS_SHIFT_CLOSING } from '../../../shared/data-enum/list-status';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { Router } from '@angular/router';
import { ILockShift, IOrderOfShift, IShiftConfig, ShiftService } from '../shift.service';
import { GasStationResponse } from '../../gas-station/gas-station.service';
import { convertTimeToString } from '../../../shared/helpers/functions';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shift-closing-history',
  templateUrl: './shift-closing-history.component.html',
  styleUrls: ['./shift-closing-history.component.scss'],
  providers: [FormBuilder]
})
export class ShiftClosingHistoryComponent implements OnInit {
  searchForm: FormGroup;
  today: string;
  dataSource: ILockShift[] = [];
  listStatus = LIST_STATUS_SHIFT_CLOSING;
  listStations: GasStationResponse[] = [];
  listShifts: IShiftConfig[] = [];
  paginatorState = new PaginatorState();
  listOrder: IOrderOfShift[] = [];

  constructor(
    private fb : FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private shiftService : ShiftService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {
    this.today = moment().format('DD/MM/YYYY');

    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 10;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;
  }

  ngOnInit(): void {
    this.buildForm();
    this.initDate();

    this.shiftService.getStationByAccount()
      .subscribe((res) => {
        this.listStations = res.data;
        this.cdr.detectChanges();
      })

    this.shiftService.getListShiftConfig()
      .subscribe((res) => {
        this.listShifts = res.data;
        this.cdr.detectChanges();
      })
    this.onSearch();
  }

  buildForm() {
    this.searchForm = this.fb.group({
      stationName: [''],
      shiftName: [''],
      startAt: [],
      endAt: []
    })
  }

  initDate() {
    this.searchForm.get('startAt').patchValue(this.today);
    this.searchForm.get('endAt').patchValue(this.today);
  }

  onSearch() {
    const timeStart = new Date(moment(this.searchForm.get('startAt').value,'DD/MM/YYYY').format('MM/DD/YYYY'));
    const timeEnd = new Date(moment(this.searchForm.get('endAt').value,'DD/MM/YYYY').format('MM/DD/YYYY'));

    if (timeStart > timeEnd) {
      this.searchForm.get('startAt').setErrors({ errorDateStart: true });
      this.searchForm.get('endAt').setErrors({ errorDateEnd: true });
      return
    } else {
      this.searchForm.get('startAt').setErrors(null);
      this.searchForm.get('endAt').setErrors(null);
    }

    this.shiftService.getListLockShift(
      this.paginatorState.page,
      this.paginatorState.pageSize,
      this.searchForm.value
    )
      .subscribe((res) => {
        this.dataSource = res.data;
        this.paginatorState.recalculatePaginator(res.meta.total);
        this.cdr.detectChanges();
      })
  }

  formatTime(hour: number, minute: number) {
    return convertTimeToString(hour, minute);
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }


  viewDetail(id: number, status: string) {
    this.router.navigate([`/ca-lam-viec/lich-su-chot-ca/chi-tiet/${id}`], {queryParams: {status: status}});
  }

  modalConfirm($event?: Event, data?: ILockShift): void {
    if ($event) {
      $event.stopPropagation();
    }
    this.shiftService.getOrdersOfShift(data.shiftId, data.id)
      .subscribe((res) => {
        this.listOrder = res.data;
        this.cdr.detectChanges();

        if (this.listOrder.length > 0) {
          const modalRef = this.modalService.open(ModalConfirmComponent, {
            backdrop: 'static',
            size: 'lg',
          });

          modalRef.componentInstance.data = {
            title: 'Xác nhận yêu cầu chốt ca',
            order: this.listOrder,
            lockShiftInfo: data
          };
        } else {
          this.router.navigate([`/ca-lam-viec/lich-su-chot-ca/chi-tiet/${data.id}`],{queryParams: {status: data.status, stationId: data.stationId}});
        }
      })
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4874') {
      this.toastr.error('Ngày bắt đầu/kết thúc không hợp lệ');
    }
  }

}
