import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TYPE_SEARCH_CUSTOMER_UPDATE_PHONE} from '../../shared/constants/card-service-constants';
import {CardUpdatePhoneService} from '../../shared/services/card-update-phone.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../../_toast/notification_service';
import {CustomerInfo, SearchCustomerRequest} from '../../shared/models/card-update-phone-number';

@Component({
  selector: 'app-card-request-update-phone-number-step-search',
  templateUrl: './card-request-update-phone-number-step-search.component.html',
  styleUrls: ['./card-request-update-phone-number-step-search.component.scss']
})
export class CardRequestUpdatePhoneNumberStepSearchComponent implements OnInit {
  @Output() evtClickSendRequest = new EventEmitter();
  lstInputTypeSearch = TYPE_SEARCH_CUSTOMER_UPDATE_PHONE;
  lstSearchResults: CustomerInfo [] = [];
  formSearch: FormGroup;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isShowLoading = false;
  constructor(
    private cardUpdatePhoneService: CardUpdatePhoneService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {
    this.initFormSearch();
  }

  ngOnInit(): void {
  }

  initFormSearch(): void {
    this.formSearch = this.fb.group(
      {
        type: ['CIF', Validators.required],
        txtSearch: ['', Validators.required]
      }
    );
  }

  searchCustomer(): void {
    this.formSearch.markAllAsTouched();
    if (this.formSearch.invalid) {
      return;
    }
    const frmValues = this.formSearch.getRawValue();
    this.isShowLoading = true;
    this.lstSearchResults = [];
    const request: SearchCustomerRequest = {
      uidName: frmValues.type === 'CCCD' ? 'CAN CUOC CONG DAN' : (frmValues.type === 'CMND' ? 'CHUNG MINH NHAN DAN' : ''),
      uidValue: (frmValues.type === 'CCCD' || frmValues.type === 'CMND') ? frmValues.txtSearch.trim() : '',
      phone: frmValues.type === 'PHONE_NUMBER' ? frmValues.txtSearch.trim() : '',
      customerCode: frmValues.type === 'CIF' ? frmValues.txtSearch.trim() : ''
    };
    this.cardUpdatePhoneService.searchCustomerSVBO(request).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.lstSearchResults = res.items;
      } else {
        this.notificationService.showError(res.responseStatus.codes[0].detail, 'Thông báo');
        this.lstSearchResults = [];
      }
    }, error => {
      this.isShowLoading = false;
      this.lstSearchResults = [];
      this.notificationService.showError('Đã có lỗi xảy ra, vui lòng thử lại', 'Thông báo');
    });
  }

  sendRequest(selectedItem): void {
    this.evtClickSendRequest.emit(selectedItem);
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formSearch.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

}
