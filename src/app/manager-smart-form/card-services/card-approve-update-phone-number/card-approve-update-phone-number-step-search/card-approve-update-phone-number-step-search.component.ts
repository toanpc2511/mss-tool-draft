import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CardUpdatePhoneService} from '../../shared/services/card-update-phone.service';
import {NotificationService} from '../../../../_toast/notification_service';
import {LpbDatePickerComponent} from '../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import {compareDate} from '../../../../shared/constants/utils';
import {Pagination} from '../../../../_models/pager';
import {
  ApproveOrRejectRequest,
  GetListApproveRequest,
  GetListUserByBranchRequest, SVBOUpdatePhoneRecordInfo,
  UserBranchInfo
} from '../../shared/models/card-update-phone-number';
import {CardServiceCommonService} from '../../shared/services/card-service-common.service';
import {RESPONSE_CODE_CARD_UPDATE_SVBO} from '../../shared/constants/card-service-constants';

@Component({
  selector: 'app-card-approve-update-phone-number-step-search',
  templateUrl: './card-approve-update-phone-number-step-search.component.html',
  styleUrls: ['./card-approve-update-phone-number-step-search.component.scss']
})
export class CardApproveUpdatePhoneNumberStepSearchComponent implements OnInit {
  @ViewChild('dpFromDate', { static: false }) dpFromDate: LpbDatePickerComponent; // Miễn thị từ ngày
  @ViewChild('dpToDate', { static: false }) dpToDate: LpbDatePickerComponent; // Miễn thị từ ngày
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isShowLoading = false;
  formSearch: FormGroup;
  lstSearchResults: SVBOUpdatePhoneRecordInfo [] = [];
  currentDate = moment().format('yyyy-MM-DD');
  pageIndex = 1;
  pageSize = 10;
  pagination: Pagination = new Pagination();
  userInfo: any;
  lstInputUser: UserBranchInfo [] = [];
  isShowModal = false;
  modalContent = '';
  modalHeader = '';
  requestType = '';
  selectedRecord: SVBOUpdatePhoneRecordInfo;
  txtReason = '';
  errTextReason = '';
  readonly ACTION = {
    ACCEPT: 'ACCEPT',
    DENIED: 'DENIED',
    CONFIRM_YES: 'CONFIRM YES',
    CANCEL: 'CANCEL'
  };
  constructor(
    private cardUpdatePhoneService: CardUpdatePhoneService,
    private cardServiceCommonService: CardServiceCommonService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.initFormSearch();
  }

  ngOnInit(): void {
    this.getInputUser();
  }

  initFormSearch(): void {
    this.formSearch = this.fb.group(
      {
        customerCode: [''],
        uidValue: [''],
        svboServiceStatusCode: ['W'],
        branchCode: [this.userInfo ? this.userInfo.branchCode : ''],
        inputUser: ['']
      }
    );
  }

  getInputUser(): void {
    if (this.userInfo) {
      const req: GetListUserByBranchRequest = {
        branchCode: this.userInfo.branchCode ? this.userInfo.branchCode : ''
      };
      this.cardServiceCommonService.getUserByBranch(req).subscribe(res => {
        if (res && res.responseStatus.success) {
          this.lstInputUser = res.items;
        } else {
          this.lstInputUser = [];
        }
      }, error => {
        this.lstInputUser = [];
      });
    }
  }

  dateValidator(): boolean {
    this.dpFromDate.setErrorMsg('');
    this.dpToDate.setErrorMsg('');
    if (this.dpFromDate.haveValue()) {
      if (!this.dpFromDate.isValid) {
        this.dpFromDate.setErrorMsg('Từ ngày không hợp lệ');
        return false;
      }
    }
    if (this.dpToDate.haveValue()) {
      if (!this.dpToDate.isValid) {
        this.dpToDate.setErrorMsg('Đến ngày không hợp lệ');
        return false;
      }
    }
    if ((this.dpFromDate.haveValue() && this.dpFromDate.isValid) && (this.dpToDate.haveValue() && this.dpToDate.isValid)) {
      if (compareDate(this.dpFromDate.getValue(), this.dpToDate.getValue()) === 1) {
        this.dpFromDate.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
        return false;
      }
    }
    return true;
  }

  searchRecord(): void {
    if (!this.dateValidator()) {
      return;
    }
    this.isShowLoading = true;
    const req: GetListApproveRequest = {
      branchCode: this.userInfo ? this.userInfo.branchCode : '',
      customerCode: this.formSearch.controls.customerCode.value.trim(),
      svboServiceStatusCode: this.formSearch.controls.svboServiceStatusCode.value,
      inputUser: this.formSearch.controls.inputUser.value,
      uidValue: this.formSearch.controls.uidValue.value.trim(),
      page: this.pageIndex,
      size: this.pageSize,
      fromDate: this.dpFromDate.getValue(),
      toDate: this.dpToDate.getValue()
    };
    this.cardUpdatePhoneService.getListApproveUpdatePhoneSVBO(req).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.pagination = new Pagination(res.count, this.pageIndex, this.pageSize);
        this.lstSearchResults = res.items;
      } else {
        this.lstSearchResults = [];
        this.notificationService.showError(res.responseStatus.codes[0].detail, 'Thông báo');
      }
    }, error => {
      this.notificationService.showError('Đã có lỗi xảy ra. Vui lòng thử lại', 'Thông báo');
      this.isShowLoading = false;
      this.lstSearchResults = [];
    });
  }

  evtBtnActionClick(selectedItem: SVBOUpdatePhoneRecordInfo, actionName: string): void {
    this.modalContent = '';
    this.modalHeader = '';
    this.requestType = '';
    this.errTextReason = '';
    this.selectedRecord = selectedItem;
    switch (actionName) {
      case this.ACTION.ACCEPT:
        this.modalContent = 'Bạn có chắc chắn duyệt yêu cầu của khách hàng: ';
        this.modalHeader = 'Xác nhận phê duyệt yêu cầu';
        this.requestType = this.ACTION.ACCEPT;
        this.isShowModal = true;
        break;
      case this.ACTION.DENIED:
        this.modalContent = 'Bạn có chắc chắn từ chối yêu cầu của khách hàng: ';
        this.modalHeader = 'Xác nhận từ chối yêu cầu';
        this.requestType = this.ACTION.DENIED;
        this.isShowModal = true;
        break;
      default:
        break;
    }
  }

  evtBtnConfirmClick(actionName: string): void {
    switch (actionName) {
      case this.ACTION.CONFIRM_YES:
        if (this.requestType === this.ACTION.ACCEPT) {
          this.approveRequestUpdatePhoneSVBO();
        } else {
          if (this.txtReason === '') {
            this.errTextReason = 'Lý do từ chối bắt buộc nhập';
          } else {
            this.rejectRequestUpdatePhoneSVBO();
          }
        }
        break;
      case this.ACTION.CANCEL:
        this.modalContent = '';
        this.modalHeader = '';
        this.requestType = '';
        this.txtReason = '';
        this.errTextReason = '';
        this.selectedRecord = null;
        this.isShowModal = false;
        break;
      default:
        break;
    }
  }

  hideModal(): void {
    this.errTextReason = '';
    this.txtReason = '';
    this.isShowModal = false;
  }

  approveRequestUpdatePhoneSVBO(): void {
    const req: ApproveOrRejectRequest = {
      id: this.selectedRecord.id
    };
    this.isShowLoading = true;
    this.cardUpdatePhoneService.approveRequestUpdatePhoneSVBO(req).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.notificationService.showSuccess('Phê duyệt yêu cầu thành công', 'Thông báo');
        this.searchRecord();
        this.hideModal();
      } else {
        switch (res.responseStatus.codes[0].code) {
          case RESPONSE_CODE_CARD_UPDATE_SVBO.UNI_01:
            this.notificationService.showError('Phê duyệt yêu cầu thất bại. Vui lòng thử lại', 'Thông báo');
            break;
          case RESPONSE_CODE_CARD_UPDATE_SVBO.UNI_02:
            this.notificationService.showError('Phê duyệt yêu cầu bị Timeout', 'Thông báo');
            this.searchRecord();
            this.hideModal();
            break;
          default:
            this.notificationService.showError(res.responseStatus.codes[0].detail, 'Thông báo');
            break;
        }
      }

    }, error => {
      this.isShowLoading = false;
      this.notificationService.showError('Đã có lỗi xảy ra. Vui lòng thử lại', 'Thông báo');
    });
  }

  rejectRequestUpdatePhoneSVBO(): void {
    const req: ApproveOrRejectRequest = {
      id: this.selectedRecord.id,
      approveNote: this.txtReason
    };
    this.isShowLoading = true;
    this.cardUpdatePhoneService.rejectRequestUpdatePhoneSVBO(req).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.notificationService.showSuccess('Từ chối yêu cầu thành công', 'Thông báo');
        this.searchRecord();
        this.hideModal();
      } else {
        this.notificationService.showError(res.responseStatus.codes[0].detail, 'Thông báo');
      }
    }, error => {
      this.isShowLoading = false;
      this.notificationService.showError('Đã có lỗi xảy ra. Vui lòng thử lại', 'Thông báo');
    });
  }

  setPage(pageIndex: number): void {
    if (pageIndex < 1 || pageIndex > this.pagination.pager.totalPages) {
      return;
    }
    this.pageIndex = pageIndex;
    this.searchRecord();
  }

  changePageSize(pageSize: number): void {
    if (this.pageSize < 0) {
      return;
    }
    this.pageSize = pageSize;
    this.searchRecord();
  }

}
