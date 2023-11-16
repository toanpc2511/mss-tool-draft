import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {INPUT_TYPE_SEARCH_CARD_BACK} from '../../../shared/constants/card-service-constants';
import {CardInssuanceService} from '../../../shared/services/card-inssuance.service';
import {
  CardEbsInfo, CardProductCodeInfo, CardSearchInfo, GetCardEbsInfoRequest, SearchCardRequest
} from '../../../shared/models/card-inssuance';
import {BranchInfo} from '../../../shared/models/card-service-common';
import {CardServiceCommonService} from '../../../shared/services/card-service-common.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LpbDatePickerComponent} from '../../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import {compareDate} from '../../../../../shared/constants/utils';
import {Pagination} from '../../../../../_models/pager';
import {CustomNotificationService} from '../../../../../shared/services/custom-notification.service';
import {LIST_STATUS} from '../../../shared/constants/card-ebs-constants';
import {ultis} from '../../../../../shared/utilites/function';

@Component({
  selector: 'app-step-search',
  templateUrl: './step-search.component.html',
  styleUrls: ['./step-search.component.scss']
})
export class StepSearchComponent implements OnInit {
  @ViewChild('dpDateFrom', {static: false}) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', {static: false}) dpDateTo: LpbDatePickerComponent;
  @Output() evtClickSendRequest = new EventEmitter();
  @Output() evtClickCreateRequest = new EventEmitter();
  lstInputTypeSearch = INPUT_TYPE_SEARCH_CARD_BACK;
  isShowLoading = false;
  listDetail: CardEbsInfo [] = [];
  userInfo: any;
  lstBranch: BranchInfo [] = [];
  listStatus = LIST_STATUS;
  formSearch: FormGroup;
  cardEbsInfo: any;
  pageIndex = 1;
  pageSize = 10;
  pagination: Pagination = new Pagination();
  searched: boolean;
  errSearch: string;
  readonly acctionView = {
    DELETE: 'DELETE',
    VIEW_DETAIL: 'VIEW_DETAIL',
    REQ_APPROVE: 'REQ_APPROVE'
  };

  constructor(
    private cardInssuanceService: CardInssuanceService,
    private cardServiceCommonService: CardServiceCommonService,
    private notify: CustomNotificationService,
    private fb: FormBuilder,
  ) {
    this.initFormSearch();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    this.getAllBranch();
    this.getAllList();
  }

  get branchCode(): any { return this.formSearch.get('branchCode'); }

  initFormSearch(): void {
    this.formSearch = this.fb.group(
      {
        type: ['CIF', Validators.required],
        txtSearch: ['', Validators.required],
        branchCode: [''],
        displayStatus: ['']
      }
    );
    const curDate = new Date();
    setTimeout(() => {
      this.dpDateTo.setValue(ultis.dateToString(curDate));
      this.dpDateFrom.setValue(ultis.dateToString(curDate));
    });
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

  viewDetail(selectedItem, acctionView): void {
    const detailedList = selectedItem;
    this.evtClickSendRequest.emit({detailedList, acctionView});
  }

  CreateCard(): any {
    this.evtClickCreateRequest.emit();
  }

  clearBranchCode(): void {
    this.formSearch.controls.branchCode.setValue('');
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formSearch.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
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

  limitDate(): void {
    const dateFrom = moment(this.dpDateFrom.getValue(), 'DD.MM.YYYY');
    const dateTo = moment(this.dpDateTo.getValue(), 'DD.MM.YYYY');
    const distance = dateTo.diff(dateFrom, 'months');
    if (distance >= 3) {
      this.dpDateFrom.setErrorMsg('Phạm vi tìm kiếm tối đa trong vòng 3 tháng');
      this.dpDateTo.setErrorMsg('Phạm vi tìm kiếm tối đa trong vòng 3 tháng');
    }
  }

  setPage(pageIndex: number): void {
    if (pageIndex < 1 || pageIndex > this.pagination.pager.totalPages) {
      return;
    }
    this.pageIndex = pageIndex;
    if (this.searched) {
      this.search();
    } else {
      this.getAllList();
    }
  }

  changePageSize(pageSize: number): void {
    if (this.pageSize < 0) {
      return;
    }
    this.pageIndex = 1;
    this.pageSize = pageSize;
    if (this.searched) {
      this.search();
    } else {
      this.getAllList();
    }
  }

  defaulServiceCard(): any {
    this.formSearch.controls.actionCode.setValue('CARD_BACK');
  }

  defaulStatus(): any {
    this.formSearch.controls.displayStatus.setValue('');
  }

  getAllList(): void {
    const request = {
      page: this.pageIndex,
      size: this.pageSize,
      inputBy: this.userInfo.userName,
      fromDate: ultis.dateToString(new Date()),
      toDate: ultis.dateToString(new Date())
    };
    this.isShowLoading = true;
    this.cardInssuanceService.allListEbs(request).subscribe(rs => {
      this.isShowLoading = false;
      if (rs && rs.responseStatus.success) {
        this.listDetail = rs.items;
        this.pagination = new Pagination(rs.count, this.pageIndex, this.pageSize);
      } else {
        this.listDetail = [];
        this.pagination = new Pagination(0, this.pageIndex, this.pageSize);
        this.notify.error('Thông báo', rs.responseStatus.codes[0].msg);
      }
    }, error => {
      this.isShowLoading = false;
      this.listDetail = [];
      this.notify.error('Thông báo', 'Đã có lỗi xảy ra, vui lòng thử lại');
    });
  }

  search(): void {
    if (this.formSearch.getRawValue().txtSearch === '') {
      this.errSearch = 'Thông tin khách hàng không được bỏ trống';
    } else {
      this.errSearch = '';
    }
    this.formSearch.markAllAsTouched();
    this.validateFromDate();
    this.validateToDate();
    this.limitDate();
    if (this.formSearch.invalid) {
      return;
    }
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
    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '' && this.errSearch === '') {
      this.isShowLoading = true;
      this.searched = true;
      this.cardInssuanceService.allListEbs(request).subscribe(res => {
        this.isShowLoading = false;
        this.listDetail = res.item;
        if (res && res.responseStatus.success) {
          this.pagination = new Pagination(res.count, this.pageIndex, this.pageSize);
          this.listDetail = res.items;
        } else {
          this.listDetail = [];
          this.pagination = new Pagination(0, this.pageIndex, this.pageSize);
          this.notify.error('Thông báo', res.responseStatus.codes[0].msg);
        }
      }, error => {
        this.notify.error('Thông báo', 'Đã có lỗi xa ra, vui lòng thử lại');
        this.isShowLoading = false;
        this.pagination = new Pagination(0, this.pageIndex, this.pageSize);
        this.listDetail = [];
      });
    }
  }

}
