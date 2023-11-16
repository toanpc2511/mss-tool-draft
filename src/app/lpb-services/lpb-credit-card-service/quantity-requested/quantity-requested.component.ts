import {Component, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {compareDate} from '../../../shared/constants/utils';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditCardService} from '../shared/services/credit-card-issue.service';
import {IError} from '../../../system-configuration/shared/models/error.model';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {FileService} from '../../../shared/services/file.service';
import {ultis} from '../../../shared/utilites/function';
import {Pagination} from '../../../_models/pager';
declare var $: any;

@Component({
  selector: 'app-quantity-requested',
  templateUrl: './quantity-requested.component.html',
  styleUrls: ['./quantity-requested.component.scss']
})
export class QuantityRequestedComponent implements OnInit {
  @ViewChild('dpDateFrom', {static: false}) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', {static: false}) dpDateTo: LpbDatePickerComponent;
  formSearch: FormGroup;
  records: any[] = [];
  pagination: Pagination = new Pagination();
  pageIndex = 1;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private notify: CustomNotificationService,
    private creditCardService: CreditCardService,
    private fileService: FileService
  ) {
    this.formSearch = this.fb.group(
      {
        productCode: [''],
        branchCode: [''],
      }
    );
  }

  ngOnInit(): void {
    $('.parentName').html('Thẻ tín dụng');
    $('.childName').html('Lịch sử giao dịch');
    this.setDefaultDate();
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }

  setDefaultDate(): void {
    const curDate = new Date();
    setTimeout(() => {
      this.dpDateFrom.setValue(ultis.dateToString(curDate));
      this.dpDateTo.setValue(ultis.dateToString(curDate));
    });
  }

  getFromDate(): any {
    this.dpDateFrom.getValue();
    this.dpDateFrom.focus();
  }

  getToDate(): any {
    this.dpDateTo.getValue();
    this.dpDateTo.focus();
  }

  dateToChanged(): any {
    this.validateToDate();
    this.validateFromDate();
  }

  dateFromChanged(): any {
    this.validateFromDate();
    this.validateToDate();
  }

  validateFromDate(): void{
    if (this.dpDateFrom.haveValue() && !this.dpDateFrom.isValid) {
      this.dpDateFrom.setErrorMsg('Từ ngày không hợp lệ');
    }
    else if (!this.dpDateFrom.haveValue()) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được để trống');
    }
    else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
    }
    else {
      this.dpDateFrom.setErrorMsg('');
    }
  }

  validateToDate(): void {
    if (this.dpDateTo.haveValue() && !this.dpDateTo.isValid) {
      this.dpDateTo.setErrorMsg('Đến ngày không hợp lệ');
    }
    else if (!this.dpDateTo.haveValue()) {
      return this.dpDateTo.setErrorMsg('Đến ngày không được để trống');
    }
    else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateTo.setErrorMsg('Đến ngày không được nhỏ hơn Từ ngày');
    }
    else {
      this.dpDateTo.setErrorMsg('');
    }
  }

  search(): void {
    this.formSearch.markAllAsTouched();
    this.validateFromDate();
    this.validateToDate();
    if (this.formSearch.invalid) {
      return;
    }

    const frmValue = this.formSearch.getRawValue();
    const request = {
      branchCode: frmValue.branchCode,
      customerCode: frmValue.customerCode,
      issueValue: frmValue.issueValue,
      productCode: frmValue.productCode,
      status: frmValue.status,
      fromDate: moment(this.dpDateFrom.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00',
      toDate: moment(this.dpDateTo.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59',
    };
    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '') {
      this.creditCardService.getSumary(request).subscribe(res => {
        if (res) {
          this.itemsPerPage(res.data);
        }
      }, (error: IError) => this.checkError(error));
    }
  }

  checkError(error: IError): void {
    if (error.message) {
      this.notify.error('Lỗi', error.message);
    } else {
      this.notify.error('Lỗi hệ thống', 'Vui lòng thử lại sau');
    }
  }

  exportSummary(): void {
    this.formSearch.markAllAsTouched();
    this.validateFromDate();
    this.validateToDate();
    if (this.formSearch.invalid) {
      return;
    }
    const frmValue = this.formSearch.getRawValue();
    const request = {
      branchCode: frmValue.branchCode,
      productCode: frmValue.productCode,
      fromDate: moment(this.dpDateFrom.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00',
      toDate: moment(this.dpDateTo.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59',
    };
    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '') {
      const url = 'credit-card-service/credit-card-report/summary';
      this.fileService.downloadFile(url, request, 'Danh sách số lượng đăng ký');

    }
  }

  changePageSize(pageSize: number): void {
    if (this.pageSize < 0) {
      return;
    }
    this.pageIndex = 1;
    this.pageSize = pageSize;
    this.search();
  }

  setPage(pageIndex: number): void {
    if (pageIndex < 1 || pageIndex > this.pagination.pager.totalPages) {
      return;
    }
    this.pageIndex = pageIndex;
    this.search();
  }

  itemsPerPage(data: any): void{
    this.pagination = new Pagination(data.length, this.pageIndex, this.pageSize);
    const pager = this.pagination.getPager(data.length, this.pageIndex, this.pageSize);

    if (this.pageIndex >= 2) {
      this.records = data.slice(pager.startIndex, pager.startIndex + Number(this.pageSize));
    } else {
      this.records = data.slice(pager.startIndex, pager.endIndex + 1);
    }
    this.pageIndex = 1;
  }
}
