import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { ISortData } from '../../contract/contract.service';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { IAttachment, IExchangePoint } from '../models/exchange-point.interface';
import * as moment from 'moment';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { ExchangePointManagementService } from '../exchange-point-management.service';
import { DataResponse } from '../../../shared/models/data-response.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-exchange-point-history',
  templateUrl: './exchange-point-history.component.html',
  styleUrls: ['./exchange-point-history.component.scss']
})
export class ExchangePointHistoryComponent extends BaseComponent implements OnInit {
  searchForm: FormGroup;
  today: string;
  startOfMonth: string;
  listExchangePointHistory: IExchangePoint[];
  paginatorState = new PaginatorState();
  sortData: ISortData;
  detailImage: IAttachment;

  constructor(private toastr: ToastrService,
              private fb: FormBuilder,
              private epmService: ExchangePointManagementService,
              private modalService: NgbModal,
              private cdr: ChangeDetectorRef) {
    super();
    this.today = moment().format('DD/MM/YYYY');
    this.startOfMonth = moment().startOf('month').format('DD/MM/YYYY');
    this.initSearchForm();
    this.initDate();
  }

  ngOnInit(): void {
    this.getAll();
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      startAt: [null],
      endAt: [null],
      driverName: [''],
      phone: ['']
    })
  }

  initDate(): void {
    this.searchForm.get('startAt').patchValue(this.startOfMonth);
    this.searchForm.get('endAt').patchValue(this.today);
  }

  onSearch(): void {
    this.validateDate();
    if (!this.searchForm.invalid) {
      this.getAll();
    }
  }

  onReset(): void {
    this.searchForm.reset();
    this.initDate();
    this.getAll();
  }

  pagingChange($event: IPaginatorState): void {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }

  validateDate(): void {
    const timeStart = new Date(
      moment(this.searchForm.get('startAt').value, 'DD/MM/YYYY').format('MM/DD/YYYY')
    );
    const timeEnd = new Date(
      moment(this.searchForm.get('endAt').value, 'DD/MM/YYYY').format('MM/DD/YYYY')
    );

    if (timeStart > timeEnd) {
      this.searchForm.get('startAt').setErrors({ errorDateStart: true });
      this.searchForm.get('endAt').setErrors({ errorDateEnd: true });
    } else {
      this.searchForm.get('startAt').setErrors(null);
      this.searchForm.get('endAt').setErrors(null);
    }
  }

  getAll(): void {
    const params = {
      page: this.paginatorState.page,
      size: this.paginatorState.pageSize,
      filter: this.searchForm.value
    }
    this.epmService.getAll(params).subscribe((res: DataResponse<IExchangePoint[]>) => {
      this.listExchangePointHistory = res.data;
      this.paginatorState.recalculatePaginator(res.meta.total);
      this.cdr.detectChanges();
    });
  }

  viewImages(content, item: IExchangePoint): void {
    this.modalService.open(content, { size: 'sm' });
    this.detailImage = item.attachment !== null ? item.attachment[0] : null;
  }

  checkError(err: IError) {
    this.toastr.error(`err`);
  }

  formatTime(timeString: string) {
    return timeString.split('-').reverse().join(' - ');
  }

}
