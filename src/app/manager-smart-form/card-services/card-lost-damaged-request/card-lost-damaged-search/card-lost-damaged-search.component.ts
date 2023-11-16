import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NotificationService} from '../../../../_toast/notification_service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {INPUT_TYPE_SEARCH_CARD_BACK} from '../../shared/constants/card-service-constants';
import {
  CardEbsInfo,
  CardProductCodeInfo,
  CardSearchInfo,
  GetCardEbsInfoRequest, SearchCardRequest
} from '../../shared/models/card-inssuance';
import {BranchInfo} from '../../shared/models/card-service-common';
import {CardInssuanceService} from '../../shared/services/card-inssuance.service';
import {CardServiceCommonService} from '../../shared/services/card-service-common.service';
import {Pagination} from '../../../../_models/pager';

@Component({
  selector: 'app-card-lost-damaged-search',
  templateUrl: './card-lost-damaged-search.component.html',
  styleUrls: ['./card-lost-damaged-search.component.scss']
})
export class CardLostDamagedSearchComponent implements OnInit {
  @Output() evtClickSendRequest = new EventEmitter();
  lstInputTypeSearch = INPUT_TYPE_SEARCH_CARD_BACK;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isShowLoading = false;
  lstCardIssuanceSearch: CardSearchInfo [] = [];
  userInfo: any;
  lstBranch: BranchInfo [] = [];
  isShowSelectBranch = true;
  lstCardProductCode: CardProductCodeInfo [] = [];
  formSearch: FormGroup;
  selectedCardItem: CardSearchInfo;
  cardEbsInfo: CardEbsInfo;
  pagination: Pagination = new Pagination();
  pageIndex = 1;
  pageSize = 10;
  constructor(
    private cardInssuanceService: CardInssuanceService,
    private cardServiceCommonService: CardServiceCommonService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
  ) {
    this.initFormSearch();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.isShowSelectBranch = this.userInfo.branchCode === '001' ? true : false;
  }

  ngOnInit(): void {
    if (this.isShowSelectBranch) {
      this.getAllBranch();
    }
    this.getAllCardProductCode();
  }
  get branchCode(): any { return this.formSearch.get('branchCode'); }

  initFormSearch(): void {
    this.formSearch = this.fb.group(
      {
        type: ['CIF', Validators.required],
        txtSearch: ['', Validators.required],
        cardProductCode: [''],
        branchCode: [''],
        ebsActionSearch: ['BROKEN_LOST', Validators.required]
      }
    );
  }

  getAllBranch(): void {
    this.cardServiceCommonService.getAllBranch().subscribe(res => {
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

  getAllCardProductCode(): void {
    this.cardServiceCommonService.getAllCardProductCode().subscribe(res => {
      if (res && res.responseStatus.success) {
        this.lstCardProductCode = res.items;
        this.lstCardProductCode = this.lstCardProductCode.filter(item => item.statusCode === 'A');
      } else {
        this.lstCardProductCode = [];
      }
    }, error => {
      this.lstCardProductCode = [];
      throw error;
    });
  }

  reportLostBroken(selectedItem: any): void {
  //   const req = {
  //     cardCoreId: selectedItem.cardCoreId,
  //     ebsActionSearch: 'BROKEN_LOST'
  //   };
  //   this.isShowLoading = true;
  //   this.cardInssuanceService.getCardEbsInfo(req).subscribe(res => {
  //     this.isShowLoading = false;
  //     if (res && res.responseStatus.success) {
  //       this.cardEbsInfo = res.item;
  //       this.evtClickSendRequest.emit({cardEbsInfo: this.cardEbsInfo, cardInfo: selectedItem});
  //     } else {
  //       this.notificationService.showError(res.responseStatus.codes[0].detail, 'Thông báo');
  //     }
  //   }, error => {
  //     this.isShowLoading = true;
  //     this.notificationService.showError('Đã có lỗi xảy ra. Vui lòng thử lại', 'Thông báo');
  //   });
  }

  searchCardInsuance(): void {
    // this.formSearch.markAllAsTouched();
    // if (this.formSearch.invalid) {
    //   return;
    // }
    // const frmValues = this.formSearch.getRawValue();
    // const request: SearchCardRequest = {
    //   customerCode: frmValues.type === 'CIF' ? frmValues.txtSearch.trim() : '',
    //   branchCode: this.userInfo.branchCode === '001' ? frmValues.branchCode.trim() : this.userInfo.branchCode,
    //   cardProductCode: frmValues.cardProductCode ? frmValues.cardProductCode.trim() : '',
    //   ebsActionSearch: 'BROKEN_LOST',
    //   uidValue: frmValues.type === 'PER_DOCS_NO' ? frmValues.txtSearch.trim() : '',
    //   phoneNumber: frmValues.type === 'PHONE_NUMBER' ? frmValues.txtSearch.trim() : ''
    // };
    // this.isShowLoading = true;
    // this.cardInssuanceService.searchCustomerCards(request).subscribe(res => {
    //   this.isShowLoading = false;
    //   if (res && res.responseStatus.success) {
    //     this.lstCardIssuanceSearch = res.items;
    //   } else {
    //     this.lstCardIssuanceSearch = [];
    //     this.notificationService.showError(res.responseStatus.codes[0].detail, 'Thông báo');
    //   }
    // }, error => {
    //   this.isShowLoading = false;
    //   this.lstCardIssuanceSearch = [];
    //   this.notificationService.showError('Đã có lỗi xảy ra. Vui lòng thử lại', 'Thông báo');
    // });
  }

  handleErrorApi(): void {
    this.notificationService.showError('Đã có lỗi xảy ra. Vui lòng thử lại', 'Thông báo');
    this.isShowLoading = false;
  }

  clearBranchCode(): void {
    this.formSearch.controls.branchCode.setValue('');
  }

  clearCardProductCode(): void {
    this.formSearch.controls.cardProductCode.setValue('');
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formSearch.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  changePageSize(pageSize: number): void {
    if (this.pageSize < 0) {
      return;
    }
    this.pageSize = pageSize;
    this.searchCardInsuance();
  }

  setPage(pageIndex: number): void {
    if (pageIndex < 1 || pageIndex > this.pagination.pager.totalPages) {
      return;
    }
    this.pageIndex = pageIndex;
    this.searchCardInsuance();
  }
}
