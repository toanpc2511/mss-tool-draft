import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardUpdatePhoneService} from '../../shared/services/card-update-phone.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../../_toast/notification_service';
import {CustomerInfo, SendApproveRequest} from '../../shared/models/card-update-phone-number';
import {debounceTime} from 'rxjs/operators';
import {PREFIX_MOBILE_NUMBER} from '../../../../shared/constants/constants';

@Component({
  selector: 'app-card-request-update-phone-number-step-send',
  templateUrl: './card-request-update-phone-number-step-send.component.html',
  styleUrls: ['./card-request-update-phone-number-step-send.component.scss']
})
export class CardRequestUpdatePhoneNumberStepSendComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isShowLoading = false;
  formCustomerInfo: FormGroup;
  @Input() selectedCustomer: CustomerInfo;
  @Output() eventBackStep = new EventEmitter();

  constructor(
    private cardUpdatePhoneService: CardUpdatePhoneService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {
    this.initFormCustomerInfo();
  }

  ngOnInit(): void {
    if (this.selectedCustomer) {
      this.formCustomerInfo.patchValue(this.selectedCustomer);
    }
    this.formCustomerInfo.controls.cbStatus.valueChanges.subscribe((val) => {
      this.evtCheckboxSelectPhoneChange(val);
    });
    this.svboPhoneChange();
  }

  initFormCustomerInfo(): void {
    this.formCustomerInfo = this.fb.group({
      CUSTOMER_NO: [{value: '', disabled: true}],
      TEL_NO: [{value: '', disabled: true}],
      UID_NAME: [{value: '', disabled: true}],
      UID_VALUE: [{value: '', disabled: true}],
      NOI_CAP: [{value: '', disabled: true}],
      NGAY_CAP: [{value: '', disabled: true}],
      FULL_NAME: [{value: '', disabled: true}],
      GENDER: [{value: '', disabled: true}],
      DATEOFBIRTH: [{value: '', disabled: true}],
      BRANCH_CODE: [{value: '', disabled: true}],
      BRANCH_NAME: [{value: '', disabled: true}],
      RECORD_STAT: [{value: '', disabled: true}],
      BRANCH_STAT: [{value: '', disabled: true}],
      MARK: [{value: '', disabled: true}],
      NATION: [{value: '', disabled: true}],
      PHONE_SVBO: ['', [Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern('^[0-9]*$')]],
      cbStatus: [false]
    });
  }

  get PHONE_SVBO(): FormControl { return this.formCustomerInfo.get('PHONE_SVBO') as FormControl; }

  evtCheckboxSelectPhoneChange(val): void {
    if (val) {
      this.formCustomerInfo.controls.PHONE_SVBO.setValue(this.formCustomerInfo.controls.TEL_NO.value);
    }
  }

  sendApprove(): void {
    this.formCustomerInfo.markAllAsTouched();
    if (this.formCustomerInfo.invalid) {
      return;
    }
    const request: SendApproveRequest = {
      mobilePhone: this.PHONE_SVBO.value.trim(),
      customerCode: this.selectedCustomer.CUSTOMER_NO,
      fullName: this.selectedCustomer.FULL_NAME,
      uidValue: this.selectedCustomer.UID_VALUE
    };
    this.isShowLoading = true;
    this.cardUpdatePhoneService.sendApproveUpdatePhoneSVBO(request).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.notificationService.showSuccess('Gửi duyệt thành công', 'Thông báo');
        this.eventBackStep.emit();
      } else {
        this.notificationService.showError('Gửi duyệt thất bại. Vui lòng thử lại.', 'Thông báo');
      }
    }, error => {
      this.isShowLoading = false;
      this.notificationService.showError('Đã có lỗi xảy ra. Vui lòng thử lại.', 'Thông báo');
    });
  }

  backToSearch(evt): void {
    this.eventBackStep.emit(evt);
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formCustomerInfo.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  svboPhoneChange(): void {
    this.PHONE_SVBO.valueChanges.pipe(
      debounceTime(50)
    ).subscribe(value => {
      if (this.PHONE_SVBO.invalid) {
        return;
      } else {
        const prefixMobile = this.PHONE_SVBO.value.toString().substring(0, 3);
        if (!PREFIX_MOBILE_NUMBER.includes(prefixMobile)) {
          this.PHONE_SVBO.setErrors({ prefixMobileNotExist: true });
        } else {
          this.PHONE_SVBO.setErrors(null);
        }
      }
    });
  }
}
