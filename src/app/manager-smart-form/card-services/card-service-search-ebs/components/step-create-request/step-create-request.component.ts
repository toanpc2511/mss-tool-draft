import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  CardEbsInfo,
  CardSearchInfo, GetCardEbsInfoRequest,
  SearchCardRequest
} from '../../../shared/models/card-inssuance';
import {INPUT_TYPE_SEARCH_CARD_BACK} from '../../../shared/constants/card-service-constants';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CardInssuanceService} from '../../../shared/services/card-inssuance.service';
import {BranchInfo} from '../../../shared/models/card-service-common';
import {CardServiceCommonService} from '../../../shared/services/card-service-common.service';
import {CustomNotificationService} from '../../../../../shared/services/custom-notification.service';
import {INVALID_CARD_LOST, VALID_CARD_BACK} from '../../../shared/constants/card-ebs-constants';

@Component({
  selector: 'app-step-create-request',
  templateUrl: './step-create-request.component.html',
  styleUrls: ['./step-create-request.component.scss']
})
export class StepCreateRequestComponent implements OnInit {
  @Input() cardSelected: CardSearchInfo;
  @Input() cardEbsInfoSelected: CardEbsInfo;
  @Output() eventBackStep = new EventEmitter();
  @Output() evtClickSendRequest = new EventEmitter();
  selectedCardItem: CardSearchInfo;
  lstBranch: BranchInfo [] = [];
  lstInputTypeSearch = INPUT_TYPE_SEARCH_CARD_BACK;
  invalidCard = INVALID_CARD_LOST;
  validCardBack = VALID_CARD_BACK;
  formSearch: FormGroup;
  cardEbsInfo: [];
  isShowSelectBranch = false;
  lstCardIssuanceSearch: CardSearchInfo [] = [];
  userInfo: any;
  isShowLoading = false;
  showModal = false;
  service: string;
  readonly acctionView = {
    DELETE: 'DELETE',
    VIEW_DETAIL: 'VIEW_DETAIL',
    REQ_APPROVE: 'REQ_APPROVE'
  };

  constructor(
    private fb: FormBuilder,
    private cardInssuanceService: CardInssuanceService,
    private notify: CustomNotificationService,
    private cardServiceCommonService: CardServiceCommonService,
  ) {
    this.initFormSearch();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.isShowSelectBranch = this.userInfo.branchCode;
  }

  ngOnInit(): void {
    this.getAllBranch();
    // this.enableBranches();
    // tìm kiếm danh sách khi thay đổi dịch vụ thẻ
    // this.formSearch.get('actionCode').valueChanges.subscribe(rs => {
    //   this.searchCardInsuance();
    // });
  }
  get branchCode(): any { return this.formSearch.get('branchCode'); }
  get typeActionCode(): any { return this.formSearch.get('actionCode'); }

  initFormSearch(): void {
    this.formSearch = this.fb.group(
      {
        type: ['CIF', Validators.required],
        txtSearch: ['', Validators.required],
        branchCode: [''],
        actionCode: ['CARD_BACK'],
      }
    );
  }
  searchCardInsuance(): void {
    this.formSearch.markAllAsTouched();
    if (this.formSearch.invalid) {
      return;
    }
    const frmValues = this.formSearch.getRawValue();
    const request: SearchCardRequest = {
      // branchCode: this.userInfo.branchCode === '001' ? frmValues.branchCode.trim() : this.userInfo.branchCode,
      branchCode: frmValues.branchCode.trim(),
      customerCode: frmValues.type === 'CIF' ? frmValues.txtSearch.trim() : '',
      uidValue: frmValues.type === 'PER_DOCS_NO' ? frmValues.txtSearch.trim() : '',
      phoneNumber: frmValues.type === 'PHONE_NUMBER' ? frmValues.txtSearch.trim() : '',
      cardId: frmValues.type === 'CARD_ID' ? frmValues.txtSearch.trim() : '',
      actionCode: frmValues.actionCode
    };
    this.service = frmValues.actionCode;
    this.isShowLoading = true;
    this.cardInssuanceService.searchCustomerCards(request).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.lstCardIssuanceSearch = res.items;
      } else {
        this.lstCardIssuanceSearch = [];
        this.notify.error('Thông báo', res.responseStatus.codes[0].msg);
      }
    }, error => {
      this.isShowLoading = false;
      this.lstCardIssuanceSearch = [];
      this.notify.error('Thông báo', 'Đã có lỗi xảy ra, vui lòng thử lại');
    });
  }

  getCardInfoEbs(selectedItem: CardSearchInfo, acctionView): void {
    this.selectedCardItem = selectedItem;
    const request: GetCardEbsInfoRequest = {
      cardCoreId: this.selectedCardItem.cardCoreId,
      cardStatusCode: this.selectedCardItem.cardStatusCode,
      actionCode: this.formSearch.getRawValue().actionCode,
      branchCode: this.selectedCardItem.branchCode
    };
    if (selectedItem.pendingStatus === 'PENDING') {
      this.openSnackBar(selectedItem);
      return;
    }
    if (request.actionCode === 'CARD_BROKEN_AFTER') {
      // tslint:disable-next-line:max-line-length
      this.evtClickSendRequest.emit({cardEbsInfo: this.cardEbsInfo, cardInfo: this.selectedCardItem, acctionView, acctionCode: this.formSearch.getRawValue().actionCode});
    } else {
      this.isShowLoading = true;
      this.cardInssuanceService.getCardEbsInfo(request).subscribe(res => {
        this.isShowLoading = false;
        if (res && res.responseStatus.success) {
          this.cardEbsInfo = res.item;
          // tslint:disable-next-line:max-line-length
          this.evtClickSendRequest.emit({cardEbsInfo: this.cardEbsInfo, cardInfo: this.selectedCardItem, acctionView, acctionCode: this.formSearch.getRawValue().actionCode});
        } else {
          this.notify.error('Thông báo', res.responseStatus.codes[0].msg);
        }
      }, error => {
        this.isShowLoading = true;
        this.notify.error('Thông báo', 'Đã có lỗi xảy ra, vui lòng thử lại');
      });
    }
  }

  getAllBranch(): void {
    this.cardServiceCommonService.getAllBranch().subscribe(res => {
      // if (this.userInfo.branchCode !== '001' ) {
      //   this.branchCode.patchValue(this.userInfo.branchCode, {enable: false});
      //   this.branchCode.disable();
      // }
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

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formSearch.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  clearBranchCode(): void {
    this.formSearch.controls.branchCode.setValue('');
  }

  backToSearch(evt): void {
    this.eventBackStep.emit(evt);
  }

  openSnackBar(item): void {
    this.notify.warning(
      'Thông báo',
      `Đã có bản ghi ${item.actionCode === 'CARD_BACK' ? 'trả thẻ' : ''} ${item.cardNumber} đang chờ xử lý`
    );
  }
  enableBranches(): any {
    if (this.typeActionCode.value === 'CARD_BACK') {
      this.branchCode.patchValue(this.userInfo.branchCode);
      this.branchCode.disable();
    } else {
      this.branchCode.enable();
    }
  }

}
