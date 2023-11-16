import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Pagination } from '../../../../_models/pager';
import { NotificationService } from '../../../../_toast/notification_service';
import {
  EBS_ACTIONS_SEARCH,
  EBS_ACTION_SEARCH_CODE,
  EXTEND_STEP,
  FETCH_STATUS,
  INPUT_TYPE_SEARCH_CARD_BACK,
} from '../../shared/constants/card-service-constants';
import {
  CardEbsInfo,
  CardSearchInfo,
} from '../../shared/models/card-inssuance';
import { BranchInfo } from '../../shared/models/card-service-common';
import { SearchCardExtendRequest } from '../../shared/models/card-update-phone-number';
import { CardServiceCommonService } from '../../shared/services/card-service-common.service';
import { CardServicesExtendService } from '../../shared/services/card-services-extend.service';
declare var $: any;
interface IEbsActionSearch {
  code: string;
  name: string;
  permittedCodes: string[];
}

@Component({
  selector: 'app-card-services-extend-step-search',
  templateUrl: './card-services-extend-step-search.component.html',
  styleUrls: [
    '../card-services-extend-step-send.component.scss',
    './card-services-extend-step-search.component.scss',
  ],
})
export class CardServicesExtendStepSearchComponent implements OnInit {
  @Output() evtClickSendRequest = new EventEmitter();
  @Output() eventBackStep = new EventEmitter();
  @Input() formSearch: FormGroup;
  readonly FETCH_STATUS = FETCH_STATUS;
  lstInputTypeSearch = INPUT_TYPE_SEARCH_CARD_BACK;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isFetch: number = FETCH_STATUS.IDLE;
  isShowEbsActionSearchMsg: boolean = false;
  lstCardIssuanceSearch: CardSearchInfo[] = [];
  userInfo: any;
  lstBranch: BranchInfo[] = [];

  selectedCardItem: CardSearchInfo;
  cardEbsInfo: CardEbsInfo;
  pagination: Pagination = new Pagination();

  ebsActionsSearch = EBS_ACTIONS_SEARCH;
  ebsActionSearch: IEbsActionSearch;
  extendStep = EXTEND_STEP;
  showModal = false;
  modalContents: string[] = [];

  constructor(
    private cardServiceCommonService: CardServiceCommonService,
    private cardExtendService: CardServicesExtendService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    $('.childName').html(`<div class="d-flex">
                            <li class="breadcrumb-item">Danh sách dịch vụ</li>
                            <li class="breadcrumb-item">Tìm kiếm dịch vụ</li>
                          <div>`);

    this.getAllBranch();

    const frmValue = this.formSearch.getRawValue();
    if (frmValue?.txtSearch && frmValue?.ebsActionSearch) {
      this.searchCard(false);
    }
  }
  get branchCode(): any {
    return this.formSearch.get('branchCode');
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

  handleNextStep(cardInfo: any): void {
    if (
      cardInfo.pendingStatus === 'PENDING' &&
      this.ebsActionSearch.code !== EBS_ACTION_SEARCH_CODE.LOCK
    ) {
      const userProcessing = cardInfo?.userProcessing || '';
      const branchCode = cardInfo?.branchCodeProcessing || '';

      this.modalContents = [
        `Thẻ có giao dịch đang Chờ duyệt/ Pending tạo bởi ${userProcessing}`,
      ];
      this.showModal = true;

      this.cardServiceCommonService
        .getBranchInfo(branchCode)
        .subscribe((res) => {
          const info = res.item;
          this.modalContents = [
            `Thẻ có giao dịch đang Chờ duyệt/ Pending tạo bởi ${userProcessing} tại ${info?.branchFullName}`,
          ];
        });
      return;
    }

    try {
      const ignoreCheckPin = this.ebsActionSearch.code !== EBS_ACTION_SEARCH_CODE.UNLOCK_PIN;
      if (ignoreCheckPin) {
        this.cardExtendService.checkValidCardInfo(cardInfo);
      }
    } catch (error) {
      this.modalContents = [error.message];
      this.showModal = true;
      return;
    }

    this.modalContents = [];
    this.isFetch = FETCH_STATUS.LOADING;
    this.evtClickSendRequest.emit({
      cardInfo,
      step: this.ebsActionSearch?.code,
    });
    this.isFetch = FETCH_STATUS.COMPLETED;
  }

  handleStepWithoutCheckPinCount(cardInfo: any): void {
    if (
      cardInfo.pendingStatus === 'PENDING' &&
      this.ebsActionSearch.code !== EBS_ACTION_SEARCH_CODE.LOCK
    ) {
      const userProcessing = cardInfo?.userProcessing || '';
      const branchCode = cardInfo?.branchCodeProcessing || '';

      this.modalContents = [
        `Thẻ có giao dịch đang Chờ duyệt/ Pending tạo bởi ${userProcessing}`,
      ];
      this.showModal = true;

      this.cardServiceCommonService
        .getBranchInfo(branchCode)
        .subscribe((res) => {
          const info = res.item;
          this.modalContents = [
            `Thẻ có giao dịch đang Chờ duyệt/ Pending tạo bởi ${userProcessing} tại ${info?.branchFullName}`,
          ];
        });
      return;
    }
    this.modalContents = [];
    this.isFetch = FETCH_STATUS.LOADING;
    this.evtClickSendRequest.emit({
      cardInfo,
      step: this.ebsActionSearch?.code,
    });
    this.isFetch = FETCH_STATUS.COMPLETED;
  }

  nextStep(selectedItem: any): void {
    this.isFetch = FETCH_STATUS.LOADING;
    if (this.ebsActionSearch.code === 'ACCOUNT_LINK') {
      this.getDetailForAccountLink(selectedItem);
    } else if (this.ebsActionSearch.code === 'UNLOCK_PIN' || this.ebsActionSearch.code === 'CARD_END') {
      this.cardExtendService.getCardInfo(selectedItem.cardCoreId).subscribe(
        (res) => {
          this.isFetch = FETCH_STATUS.COMPLETED;
          const { responseStatus, ...cardInfo } = res;
          if (!responseStatus?.success) {
            this.handleErrorApi(responseStatus);
          }
          this.handleStepWithoutCheckPinCount({ ...selectedItem, ...cardInfo });
        },
        (error) => {
          this.handleErrorApi();
        }
      );
    } else {
      this.cardExtendService.getCardInfo(selectedItem.cardCoreId).subscribe(
        (res) => {
          this.isFetch = FETCH_STATUS.COMPLETED;
          const { responseStatus, ...cardInfo } = res;
          if (!responseStatus?.success) {
            this.handleErrorApi(responseStatus);
          }
          this.handleNextStep({ ...selectedItem, ...cardInfo });
        },
        (error) => {
          this.handleErrorApi();
        }
      );
    }
  }

  getDetailForAccountLink(selectedItem): any {
    this.cardExtendService.getCardDetail(selectedItem.cardCoreId).subscribe(
      (res) => {
        this.isFetch = FETCH_STATUS.COMPLETED;
        const { responseStatus, cardInfo, accountLinks, ...accountList } = res;
        if (!responseStatus?.success) {
          this.handleErrorApi(responseStatus);
        }
        this.handleStepWithoutCheckPinCount({
          ...selectedItem,
          ...cardInfo,
          ...accountLinks,
          ...accountList,
        });
      },
      (err) => {
        this.handleErrorApi();
      }
    );
  }

  searchCard(validateForm: boolean = true): void {
    if (validateForm) {
      this.formSearch.markAllAsTouched();

      if (this.formSearch.invalid) {
        return;
      }
    }
    // console.log(this.formSearch.getRawValue().ebsActionSearch);

    // lấy giá trị của formSearch và trim() và nếu undefine => ''
    const frmValues = this.formSearch.getRawValue();
    for (let key in frmValues) {
      frmValues[key] = frmValues[key] ? frmValues[key]?.toString()?.trim() : '';
    }

    const request: SearchCardExtendRequest = {
      branchCode: frmValues.branchCode,
      actionSearch: frmValues.ebsActionSearch,
      // khởi tạo 4 cái thuộc tính của txtSearch bằng ''
      customerCode: '',
      uidValue: '',
      phoneNumber: '',
      cardId: '',
    };

    // sử dụng một vòng lặp để gán các giá trị cho request
    for (let input of INPUT_TYPE_SEARCH_CARD_BACK) {
      if (frmValues.type === input.code) {
        request[input.control] = frmValues.txtSearch;
      }
    }

    this.isFetch = FETCH_STATUS.LOADING;
    this.cardExtendService.searchCustomerCards(request).subscribe(
      (res) => {
        this.isFetch = FETCH_STATUS.COMPLETED;
        if (res && res.responseStatus.success) {
          this.ebsActionSearch = EBS_ACTIONS_SEARCH.find(
            (e) => e.code === frmValues.ebsActionSearch
          );
          this.lstCardIssuanceSearch = res.items?.map((item) => ({
            ...item,
            viewDetailAllowance:
              this.isAllowedToViewDetail(item) ||
              this.checkThisIsDebit(item) ||
              this.checkAllowToLinkAcc(item),
          }));
        } else {
          this.lstCardIssuanceSearch = [];
        }
      },
      (error) => {
        this.lstCardIssuanceSearch = [];
        this.handleErrorApi();
      }
    );
  }

  isAllowedToViewDetail(item): boolean {
    if (this.ebsActionSearch?.permittedCodes.includes(item.cardStatusCode)) {
      if (this.ebsActionSearch.code === 'UNLOCK_PIN') {
        const pinCount = item.pinCount ? Number(item.pinCount) : 0;
        return pinCount >= 3 ? true : false;
      } else {
        return true;
      }
    }
    return false;
  }
  checkThisIsDebit(item): boolean {
    if (this.ebsActionSearch.code === 'CARD_END') {
      return !!this.ebsActionSearch?.permittedCodes.includes(item.cardTypeCode);
    }
  }
  checkAllowToLinkAcc(item): boolean {
    if (this.ebsActionSearch.code === 'ACCOUNT_LINK') {
      return (
        this.ebsActionSearch?.permittedCodes.includes(item.cardTypeCode) &&
        item.cardStatusCode === 'CSTS0000'
      );
    }
  }

  handleErrorApi(responseStatus?): void {
    this.isFetch = FETCH_STATUS.ERROR;
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

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formSearch.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  switchPage(page?: string): void {
    this.eventBackStep.emit(page);
  }
}
