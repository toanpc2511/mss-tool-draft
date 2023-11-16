import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {
  INPUT_TYPE_SEARCH_CARD_BACK,
  TYPE_TRANSACTION_SEARCH_APPROVE,
} from '../../shared/constants/card-service-constants';
import { BranchInfo } from '../../shared/models/card-service-common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardServiceCommonService } from '../../shared/services/card-service-common.service';
import { CardEbsServicesApproveService } from '../../shared/services/card-ebs-services-approve.service';
import {EbsServicesApproveObject} from '../../shared/models/card-services-approve';
import { Pagination } from '../../../../_models/pager';
import {LpbDatePickerComponent} from '../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import {compareDate} from '../../../../shared/constants/utils';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {LIST_STATUS} from '../../shared/constants/card-ebs-constants';
import {ultis} from '../../../../shared/utilites/function';
import {RG_FULLNAME} from '../../../../shared/constants/regex.utils';

@Component({
  selector: 'app-card-services-approve-step-search',
  templateUrl: './card-services-approve-step-search.component.html',
  styleUrls: ['./card-services-approve-step-search.component.scss'],
})
export class CardServicesApproveStepSearchComponent implements OnInit {
  @ViewChild('dpDateFrom', {static: false}) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', {static: false}) dpDateTo: LpbDatePickerComponent;
  @Output() evtClickShowDetail = new EventEmitter();
  lstInputTypeSearch = INPUT_TYPE_SEARCH_CARD_BACK;
  isShowLoading = false;
  userInfo: any;
  userRole: any;
  lstBranch: BranchInfo [] = [];
  listStatus = LIST_STATUS;
  formSearch: FormGroup;
  typeTransaction = TYPE_TRANSACTION_SEARCH_APPROVE;
  allListDetail: EbsServicesApproveObject [] = [];
  pageIndex = 1;
  pageSize = 10;
  searched: boolean;
  pagination: Pagination = new Pagination();
  readonly view = {
    VIEW_DETAIL: 'VIEW_DETAIL',
    APPROVE: 'APPROVE'
  };

  constructor(
    private cardServiceCommonService: CardServiceCommonService,
    private cardEbsServicesApproveService: CardEbsServicesApproveService,
    private notify: CustomNotificationService,
    private fb: FormBuilder,
  ) {
    this.initFormSearch();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userRole = JSON.parse(localStorage.getItem('userRole')).code;
  }

  ngOnInit(): void {
    this.getAllBranch();
    this.checkRoleToGetData();
    const curDate = new Date();
    setTimeout(() => {
      this.dpDateFrom.setValue(ultis.dateToString(curDate));
      this.dpDateTo.setValue(ultis.dateToString(curDate));
    });
  }
  get branchCode(): any { return this.formSearch.get('branchCode'); }

  initFormSearch(): void {
    this.formSearch = this.fb.group(
      {
        type: ['CIF'],
        txtSearch: ['', Validators.required],
        branchCode: [''],
        ebsActionCode: [''],
        inputBy: [''],
        displayStatus: ['']
      }
    );
  }

  getAllBranch(): void {
    this.cardServiceCommonService.getAllBranch().subscribe(res => {
      if (this.userInfo.branchCode !== '001' ) {
        this.branchCode.patchValue(this.userInfo.branchCode, {enable: false});
        this.branchCode.disable();
      }
      if (res && res.responseStatus.success) {
        this.lstBranch = res.items;
      } else {
        this.lstBranch = [];
      }
    }, error => {
      this.lstBranch = [];
      throw error;
    });
  }

  getAllListKSV(newRequest?: any): void {
    const page = {
      page: this.pageIndex,
      size: this.pageSize,
      branchCodeDo: this.userInfo.branchCode,
      fromDate: ultis.dateToString(new Date()),
      toDate: ultis.dateToString(new Date())
    };
    this.cardEbsServicesApproveService.searchListApproveKSV(newRequest ? newRequest : page).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.pagination = new Pagination(res.count, this.pageIndex, this.pageSize);
        this.allListDetail = res.items;
      } else {
        this.allListDetail = [];
        this.pagination = new Pagination(0, this.pageIndex, this.pageSize);
        this.notify.error('Thông báo', res.responseStatus.codes[0].msg);
      }
    }, error => {
      this.notify.error('Thông báo', 'Đã có lỗi xảy ra. Vui lòng thử lại');
      this.isShowLoading = false;
      this.pagination = new Pagination(0, this.pageIndex, this.pageSize);
      this.allListDetail = [];
    });
  }

  getAllListNHS(newRequest?: any): void {
    const page = {
      page: this.pageIndex,
      size: this.pageSize,
      fromDate: ultis.dateToString(new Date()),
      toDate: ultis.dateToString(new Date())
    };
    this.cardEbsServicesApproveService.searchListApproveNHS(newRequest ? newRequest : page).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.pagination = new Pagination(res.count, this.pageIndex, this.pageSize);
        this.allListDetail = res.items;
      } else {
        this.allListDetail = [];
        this.pagination = new Pagination(0, this.pageIndex, this.pageSize);
        this.notify.error('Thông báo', res.responseStatus.codes[0].msg);
      }
    }, error => {
      this.notify.error('Thông báo', 'Đã có lỗi xảy ra, vui lòng thử lại');
      this.isShowLoading = false;
      this.pagination = new Pagination(0, this.pageIndex, this.pageSize);
      this.allListDetail = [];
    });
  }

  searchAllList(): void {
    this.formSearch.markAllAsTouched();
    this.validateFromDate();
    this.validateToDate();
    this.limitDate();
    // if (this.formSearch.invalid) {
    //   return;
    // }
    const frmValue = this.formSearch.getRawValue();

    const request = {
      displayStatus: frmValue.displayStatus,
      branchCodeDo: frmValue.branchCode,
      customerCode: frmValue.type === 'CIF' ? frmValue.txtSearch : '',
      uidValue: frmValue.type === 'PER_DOCS_NO' ? frmValue.txtSearch : '',
      phoneNumber: frmValue.type === 'PHONE_NUMBER' ? frmValue.txtSearch : '',
      cardCoreId: frmValue.type === 'CARD_ID' ? frmValue.txtSearch : '',
      ebsActionCode: frmValue.ebsActionCode,
      inputBy: frmValue.inputBy,
      fromDate: this.dpDateFrom.getValue(),
      toDate: this.dpDateTo.getValue(),
      page: this.pageIndex,
      size: this.pageSize
    };
    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '') {
      this.isShowLoading = true;
      this.searched = true;
      if (this.userRole === 'UNIFORM.BANK.KSV') {
        // list danh sách kiểm soát viên
        this.getAllListKSV(request);
      } else {
        // list danh sách ngân hàng số
        this.getAllListNHS(request);
      }
    }
  }

  viewDetail(selectedItem: EbsServicesApproveObject, view): void {
    this.evtClickShowDetail.emit({selectedItem, view});
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formSearch.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  defaultBranch(): void {
    this.formSearch.controls.branchCode.setValue('');
  }

  defaultService(): void {
    this.formSearch.controls.ebsActionCode.setValue('');
  }

  defaultStatus(): void {
    this.formSearch.controls.displayStatus.setValue('');
  }

  setPage(pageIndex: number): void {
    if (pageIndex < 1 || pageIndex > this.pagination.pager.totalPages) {
      return;
    }
    this.pageIndex = pageIndex;
    if (this.searched) {
      this.searchAllList();
    } else {
      this.checkRoleToGetData();
    }
  }

  changePageSize(pageSize: number): void {
    if (this.pageSize < 0) {
      return;
    }
    this.pageIndex = 1;
    this.pageSize = pageSize;
    if (this.searched) {
      this.searchAllList();
    } else {
      this.checkRoleToGetData();
    }
  }

  checkRoleToGetData(): void {
    if (this.userRole === 'UNIFORM.BANK.KSV') {
      this.getAllListKSV();
    } else {
      this.getAllListNHS();
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

  getToday(): string {
    return moment().format('yyyy-MM-DD');
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

  userInputChange(evt): void {
    let content = (evt.target.value.length === 1) ? evt.target.value.trim() : evt.target.value;
    content = (content.replace(RG_FULLNAME, '')).toUpperCase();
    this.formSearch.get('inputBy').setValue(content);
  }

}
