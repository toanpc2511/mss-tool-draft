import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {ActionModel} from '../../../shared/models/ActionModel';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CreditCardService} from '../shared/services/credit-card-issue.service';
import * as moment from 'moment/moment';
import {compareDate} from '../../../shared/constants/utils';
import {HIDE_SHOW_TABLE} from '../shared/constants/credit-card-table';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {IError} from '../../../system-configuration/shared/models/error.model';
import {UserDetails} from '../shared/models/credit-card';
import {DetailsComponent} from '../details/details.component';
import {MatDialog} from '@angular/material/dialog';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ultis} from '../../../shared/utilites/function';
import {Pagination} from '../../../_models/pager';
declare var $: any;

@Component({
  selector: 'app-approve-ksv',
  templateUrl: './approve-ksv.component.html',
  styleUrls: ['./approve-ksv.component.scss']
})
export class ApproveKsvComponent implements OnInit {
  @ViewChild('dpDateFrom', {static: false}) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', {static: false}) dpDateTo: LpbDatePickerComponent;
  isModify = false;
  note = '';
  tickTB = HIDE_SHOW_TABLE;
  allComplete = false;
  defaultColumn = true;
  allTick = false;
  listToSend = {ids: [], modifyNote: null};
  records: UserDetails [] = [];
  userInfo: any;
  urlBranchCode: string;
  actions: ActionModel[] = [
    {
      actionIcon: 'send',
      actionName: 'Gửi duyệt HO',
      hiddenType: 'disable',
      actionClick: () => this.sendApprove(),
    },
    {
      actionIcon: 'add',
      actionName: 'Y/C Bổ sung',
      hiddenType: 'disable',
      actionClick: () => this.openModal(),
    },
  ];
  formSearch: FormGroup;
  pagination: Pagination = new Pagination();
  pageIndex = 1;
  pageSize = 10;


  constructor(
    private fb: FormBuilder,
    private creditCardService: CreditCardService,
    private notify: CustomNotificationService,
    private dialog: MatDialog
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.urlBranchCode = `/lpb-common-service/branch/list-child/api/public?branchCode=${this.userInfo.parentId}`;
    this.formSearch = this.fb.group(
      {
        productCode: [''],
        branchCode: [''],
        customerCode: [''],
        issueValue: [''],
      }
    );
  }

  ngOnInit(): void {
    $('.parentName').html('Thẻ tín dụng');
    $('.childName').html('Phát hành thẻ tín dụng');
    this.firstLook();
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

  limitDate(): void {
    const dateFrom = moment(this.dpDateFrom.getValue(), 'DD.MM.YYYY');
    const dateTo = moment(this.dpDateTo.getValue(), 'DD.MM.YYYY');
    const distance = dateTo.diff(dateFrom, 'months');
    if (distance >= 3) {
      this.dpDateFrom.setErrorMsg('Phạm vi tìm kiếm tối đa trong vòng 3 tháng');
      this.dpDateTo.setErrorMsg('Phạm vi tìm kiếm tối đa trong vòng 3 tháng');
    }
  }

  openModal(): void {
    this.isModify = true;
  }

  updateAllComplete(): void {
    this.allComplete = this.tickTB != null && this.tickTB.every(t => t.ticked);
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
    this.tickTB.forEach(e => (e.ticked = false));
    this.tickTB.forEach(e => {
      if (e.default === true) {
        e.ticked = completed;
        this.allComplete = false;
      }
    });
  }
  // ----------------------------------------------
  updateAllTick(): void {
    this.allTick = this.records != null && this.records.every(e => e.completed);
    this.enableSendBtn();
  }
  someTick(): boolean {
    if (this.records == null) {
      return false;
    }
    return this.records.filter(e => e.completed).length > 0 && !this.allTick;
  }
  setTickAll(completed: boolean, event?: MatCheckboxChange): void {
    this.allTick = completed;
    if (this.records == null) {
      return;
    }
    this.listToSend.ids = [];
    this.records.forEach(e => {
      e.completed = completed;
      if (event.checked) {
        this.listToSend.ids.push(e.id);
      } else {
        this.listToSend.ids = [];
      }
    });
    this.enableSendBtn();
  }
  enableSendBtn(): void{
    if ( this.records.filter(e => e.completed).length > 0) {
      this.actions[0].hiddenType = 'none';
      this.actions[1].hiddenType = 'none';
    } else {
      this.actions[0].hiddenType = 'disable';
      this.actions[1].hiddenType = 'disable';
    }
  }

  search(): void {
    this.allTick = false;
    this.listToSend.ids = [];
    this.actions[0].hiddenType = 'disable';
    this.actions[1].hiddenType = 'disable';
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
      fromDate: moment(this.dpDateFrom.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00',
      toDate: moment(this.dpDateTo.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59',
      limitAmount: '',
      screenTypeSearch: 'KSV',
    };


    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '') {
      this.creditCardService.findAllRecords(request).subscribe(res => {
        if (res) {
          this.itemsPerPage(res.data);
        }
      }, (error: IError) => this.checkError(error));
    }
  }

  modifyRequest(): void {
    // xác nhận bổ sung
    this.listToSend.modifyNote = this.note.trim();
    this.creditCardService.sendModify(this.listToSend).subscribe(res => {
      if (res) {
        this.isModify = false;
        this.notify.success('Thông báo', 'Đã gửi yêu cầu bổ sung');
        this.search();
      }
    }, (error: IError) => this.checkError(error));

  }

  sendApprove(): any{
    delete this.listToSend.modifyNote;
    this.creditCardService.approveLv1(this.listToSend).subscribe(res => {
      if (res) {
        this.notify.success('Thông báo', 'Đã gửi yêu cầu bổ sung');
        this.search();
      }
    }, (error: IError) => this.checkError(error));

  }

  seeDetails(item?: any): void {
    const recordDetails = this.dialog.open(DetailsComponent,
      {
      data: [[item], false, 'KSV']
      });
    recordDetails.afterClosed().subscribe((res) => {
      if (res.events === 'Approved') {
        this.search();
      }
    });
  }

  checkError(error: IError): void {
    if (error.message) {
      this.notify.error('Lỗi', error.message);
    } else {
      this.notify.error('Lỗi hệ thống', 'Vui lòng thử lại sau');
    }
  }

  handleChange(event: MatCheckboxChange, id: any): any {
    if (event.checked) {
      this.listToSend.ids.push(id);
    } else {
      const index = this.listToSend.ids.indexOf(id);
      if (index > -1) {
        this.listToSend.ids.splice(index, 1);
      }
    }
  }

  changePageSize(pageSize: number): void {
    if (this.pageSize < 0) {
      return;
    }
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

}
