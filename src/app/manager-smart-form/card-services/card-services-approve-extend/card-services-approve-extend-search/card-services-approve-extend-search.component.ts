import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Pagination } from '../../../../_models/pager';
import { NotificationService } from '../../../../_toast/notification_service';
import {
  APPROVE_STEP,
  EBS_ACTIONS_SEARCH,
  EBS_ACTION_SEARCH_CODE,
  INPUT_TYPE_SEARCH_CARD_BACK,
  LOCK_STATUSES,
} from '../../shared/constants/card-service-constants';
import { CardProductCodeInfo } from '../../shared/models/card-inssuance';
import { BranchInfo } from '../../shared/models/card-service-common';
import {
  EbsServicesApproveObject,
  SearchListEbsServicesApproveRequest,
} from '../../shared/models/card-services-approve';
import { CardEbsServicesApproveExtendService } from '../../shared/services/card-ebs-services-approve-extend.service';
import { CardServiceCommonService } from '../../shared/services/card-service-common.service';
import { CardServicesExtendService } from '../../shared/services/card-services-extend.service';

@Component({
  selector: 'app-card-services-approve-extend-search',
  templateUrl: './card-services-approve-extend-search.component.html',
  styleUrls: [
    '../../card-services-extend/card-services-extend-step-search/card-services-extend-step-search.component.scss',
    './card-services-approve-extend-search.component.scss',
  ],
})
export class CardServicesApproveExtendSearchComponent implements OnInit {
  @Input() formSearch: FormGroup;

  @Output()
  evtClickShowDetail = new EventEmitter();
  @Output() evtClickSendRequest = new EventEmitter();
  @Output() eventBackStep = new EventEmitter();

  lstInputTypeSearch = INPUT_TYPE_SEARCH_CARD_BACK;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  userInfo: any;
  lstBranch: BranchInfo[] = [];
  lstCardProductCode: CardProductCodeInfo[] = [];

  lstTypeTransactionSearch = EBS_ACTIONS_SEARCH;
  lstEbsServicesSearch: EbsServicesApproveObject[] = [];
  pageIndex = 1;
  pageSize = 10;
  pagination: Pagination = new Pagination();
  APPROVE_STEP = APPROVE_STEP;

  constructor(
    private cardServiceCommonService: CardServiceCommonService,
    private cardEbsServicesApproveExtendService: CardEbsServicesApproveExtendService,
    private cardExtendService: CardServicesExtendService,
    private notificationService: NotificationService
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    this.getAllBranch();
    this.getAllCardProductCode();
    this.searchListEbsServices(false);
  }

  getAllBranch(): void {
    this.cardServiceCommonService.getAllBranch2().subscribe(
      (res) => {
        if (res && res.responseStatus.success) {
          this.lstBranch = res.items;
        } else {
          this.lstBranch = [];
        }
      },
      (error) => {
        this.lstBranch = [];
        throw error;
      }
    );
  }

  getAllCardProductCode(): void {
    this.cardServiceCommonService.getAllCardProductCode2().subscribe(
      (res) => {
        if (res && res.responseStatus.success) {
          this.lstCardProductCode = res.items;
        } else {
          this.lstCardProductCode = [];
        }
      },
      (error) => {
        this.lstCardProductCode = [];
        throw error;
      }
    );
  }

  hasError(): boolean {
    const atLeastOneError = this.formSearch.hasError('atLeastOne');
    const controlInputBy = this.formSearch.get('inputBy');
    const controlTxtSearch = this.formSearch.get('txtSearch');
    const inputByError =
      (controlInputBy.dirty || controlInputBy.touched) && atLeastOneError;
    const txtSearchError =
      (controlTxtSearch.dirty || controlTxtSearch.touched) && atLeastOneError;
    return inputByError && txtSearchError;
  }

  submitSearchForm(): void {
    this.pageIndex = 1;
    this.pageSize = 10;
    this.searchListEbsServices();
  }

  searchListEbsServices(validateForm: boolean = true): void {
    if (validateForm) {
      this.formSearch.markAllAsTouched();
      if (this.formSearch.invalid) {
        return;
      }
    }

    // lấy giá trị của formSearch và trim() và nếu undefine => ''
    const frmValue = this.formSearch.getRawValue();
    for (let key in frmValue) {
      frmValue[key] = frmValue[key] ? frmValue[key]?.toString()?.trim() : '';
    }

    const request: SearchListEbsServicesApproveRequest = {
      branchCodeDo: frmValue.branchCode ? frmValue.branchCode.trim() : '',
      cardProductCode: frmValue.cardProductCode
        ? frmValue.cardProductCode.trim()
        : '',
      actionCode: frmValue.actionCode ? frmValue.actionCode.trim() : '',
      inputBy: frmValue.inputBy.trim(),
      page: this.pageIndex,
      size: this.pageSize,
      // khởi tạo 4 cái thuộc tính của txtSearch bằng ''
      customerCode: '',
      uidValue: '',
      phoneNumber: '',
      cardId: '',
    };

    // sử dụng một vòng lặp để gán các giá trị cho request
    for (let input of INPUT_TYPE_SEARCH_CARD_BACK) {
      if (frmValue.type === input.code) {
        request[input.control] = frmValue.txtSearch;
      }
    }

    this.cardEbsServicesApproveExtendService
      .searchListEbsServicesApprove(request)
      .subscribe(
        (res) => {
          if (res && res.responseStatus.success) {
            this.pagination = new Pagination(
              res.count,
              this.pageIndex,
              this.pageSize
            );
            this.lstEbsServicesSearch = res.items;
          } else {
            this.lstEbsServicesSearch = [];
            this.pagination = new Pagination(0, this.pageIndex, this.pageSize);
          }
        },
        (error) => {
          this.handleErrorApi();
          this.pagination = new Pagination(0, this.pageIndex, this.pageSize);
          this.lstEbsServicesSearch = [];
        }
      );
  }

  showDetail(selectedItem: EbsServicesApproveObject): void {
    let actionCode = selectedItem?.actionCode;
    if (LOCK_STATUSES.find((stat) => stat.code === actionCode)) {
      actionCode = EBS_ACTION_SEARCH_CODE.LOCK;
    }
    if (actionCode === 'ACCOUNT_LINK') {
      this.evtClickSendRequest.emit({ selectedItem, step: actionCode });
    } else {
      this.cardExtendService.getCardInforNew(selectedItem.id).subscribe(
        (res) => {
          const { responseStatus, ...cardInfo } = res;
          if (!responseStatus?.success) {
            this.handleErrorApi(responseStatus);
          }
          selectedItem = { ...selectedItem, ...cardInfo };
          this.evtClickSendRequest.emit({ selectedItem, step: actionCode });
        },
        (error) => {
          this.handleErrorApi();
        }
      );
    }
  }

  clearBranchCode(): void {
    this.formSearch.controls.branchCode.setValue('');
  }

  clearTransTypeSearch(): void {
    this.formSearch.controls.actionCode.setValue('');
  }

  clearCardProductCode(): void {
    this.formSearch.controls.cardProductCode.setValue(null);
  }

  setPage(pageIndex: number): void {
    if (pageIndex < 1 || pageIndex > this.pagination.pager.totalPages) {
      return;
    }
    this.pageIndex = pageIndex;
    this.searchListEbsServices();
  }

  changePageSize(pageSize: number): void {
    if (this.pageSize < 0) {
      return;
    }
    this.pageIndex = 1;
    this.pageSize = pageSize;
    this.searchListEbsServices();
  }
  switchPage(page?: string): void {
    this.evtClickSendRequest.emit({ step: page });
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formSearch.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }
  handleErrorApi(responseStatus?): void {
    if (responseStatus?.success === false) {
      if (responseStatus?.codes?.length) {
        responseStatus.codes.forEach((code) => {
          this.notificationService.showError(
            code.msg || 'Có lỗi xảy ra. Xin vui lòng thử lại',
            'Thông báo'
          );
        });
      }
      return;
    }
    this.notificationService.showError(
      'Có lỗi xảy ra. Xin vui lòng thử lại',
      'Thông báo'
    );
  }
}
