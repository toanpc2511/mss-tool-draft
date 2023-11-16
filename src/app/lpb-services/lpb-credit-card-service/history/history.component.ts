import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment/moment';
import {compareDate} from '../../../shared/constants/utils';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditCardService} from '../shared/services/credit-card-issue.service';
import {Pagination} from '../../../_models/pager';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {IError} from '../../../system-configuration/shared/models/error.model';
import {HIDE_SHOW_TABLE} from '../shared/constants/credit-card-table';
import {UserDetails} from '../shared/models/credit-card';
import {DetailsComponent} from '../details/details.component';
import {MatDialog} from '@angular/material/dialog';
import {FileService} from '../../../shared/services/file.service';
import {ultis} from '../../../shared/utilites/function';
declare var $: any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  @ViewChild('dpDateFrom', {static: false}) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', {static: false}) dpDateTo: LpbDatePickerComponent;
  formSearch: FormGroup;
  pagination: Pagination = new Pagination();
  pageIndex = 1;
  pageSize = 10;
  userInfo: any;
  userRole: any;
  isGDV: boolean;
  records: UserDetails [] = [];
  tickTB = HIDE_SHOW_TABLE;
  allComplete = false;
  defaultColumn = true;
  allowAction = true;
  urlBranchCode: string;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private creditCardService: CreditCardService,
    private notify: CustomNotificationService,
    private fileService: FileService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userRole = JSON.parse(localStorage.getItem('userRole')).code;
    this.urlBranchCode = `/lpb-common-service/branch/list-child/api/public?branchCode=${this.userInfo.parentId}`;
    this.formSearch = this.fb.group(
      {
        productCode: [''],
        branchCode: [''],
        customerCode: [''],
        issueValue: [''],
        status: [''],
      }
    );
  }

  ngOnInit(): void {
    $('.parentName').html('Thẻ tín dụng');
    $('.childName').html('Lịch sử giao dịch');
    this.checkRole();
    this.setDefaultDate();
    this.defaultBranches();
    this.firstLook();
  }
  checkRole(): void {
    this.isGDV = this.userRole === 'UNIFORM.BANK.GDV';
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

  limitDate(): void {
    const dateFrom = moment(this.dpDateFrom.getValue(), 'DD.MM.YYYY');
    const dateTo = moment(this.dpDateTo.getValue(), 'DD.MM.YYYY');
    const distance = dateTo.diff(dateFrom, 'months');
    if (distance >= 3) {
      this.dpDateFrom.setErrorMsg('Phạm vi tìm kiếm tối đa trong vòng 3 tháng');
      this.dpDateTo.setErrorMsg('Phạm vi tìm kiếm tối đa trong vòng 3 tháng');
    }
  }
  someComplete(): boolean {
    if (this.tickTB == null) {
      return false;
    }
    return this.tickTB.filter(t => t.ticked).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean): void {
    this.allComplete = completed;
    this.defaultColumn = completed;
    if (this.tickTB == null) {
      return;
    }
    this.tickTB.forEach(t => (t.ticked = completed));
  }

  // hiển thị cột ban đầu
  firstLook(): void {
    this.tickTB.forEach(t => {
      if (t.default) {
        t.ticked = true;
      }
    });
  }
  viewDefault(completed: boolean): void {
    // reset lại nếu như checkbox đã đc tick & tick về mặc định
    this.tickTB.forEach(e => (e.ticked = false));
    this.tickTB.forEach(e => {
      if (e.default === true) {
        e.ticked = completed;
        this.allComplete = false;
      }
    });
  }
  updateAllComplete(): void {
    this.allComplete = this.tickTB != null && this.tickTB.every(t => t.ticked);
  }

  seeDetails(item?: any): void {
    const recordDetails = this.dialog.open(DetailsComponent, {
      data: [[item], this.allowAction, 'onlyView']});
    recordDetails.afterClosed().subscribe((res) => {
      if (res.events === 'Approved') {
        this.search();
      }
    });
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
      inputBy : this.isGDV ? this.userInfo.userName : '',
      status: frmValue.status,
      fromDate: moment(this.dpDateFrom.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00',
      toDate: moment(this.dpDateTo.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59',
    };
    for (const [key, value] of Object.entries(request)) {
      if (value === '' || value === null) {
        delete request[key];
      }
    }

    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '') {
      this.creditCardService.getHistory(request).subscribe(res => {
        if (res) {
          this.itemsPerPage(res.data);
        }
      }, (error: IError) => this.checkError(error));
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

  checkError(error: IError): void {
    if (error.message) {
      this.notify.error('Lỗi', error.message);
    } else {
      this.notify.error('Lỗi hệ thống', 'Vui lòng thử lại sau');
    }
  }

  itemsPerPage(data: UserDetails[]): void{
    this.pagination = new Pagination(data.length, this.pageIndex, this.pageSize);
    const pager = this.pagination.getPager(data.length, this.pageIndex, this.pageSize);

    if (this.pageIndex >= 2) {
      this.records = data.slice(pager.startIndex, pager.startIndex + Number(this.pageSize));
    } else {
      this.records = data.slice(pager.startIndex, pager.endIndex + 1);
    }
    this.pageIndex = 1;
  }

  defaultBranches(): void {
    if ( this.userRole === 'UNIFORM.BANK.KSV') {
      this.formSearch.get('branchCode').enable();
    } else {
      if (this.userInfo.branchCode !== '001' && this.userInfo.branchCode !== '000') {
        this.formSearch.get('branchCode').setValue(this.userInfo.branchCode);
        this.formSearch.get('branchCode').disable();
      } else {
        this.formSearch.get('branchCode').enable();
      }
    }
  }
  exportHistory(): void {
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
      inputBy : this.isGDV ? this.userInfo.userName : '',
      status: frmValue.status,
      fromDate: moment(this.dpDateFrom.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00',
      toDate: moment(this.dpDateTo.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59',
    };
    for (const [key, value] of Object.entries(request)) {
      if (value === '' || value === null) {
        delete request[key];
      }
    }
    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '') {
      const url = 'credit-card-service/credit-card-report/history';
      this.fileService.downloadFile(url, request, 'Lịch sử giao dịch phát hành thẻ');
    }
  }
}
