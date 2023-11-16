import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NotificationService } from '../../../../_toast/notification_service';
import {
  LpbUploadFileSingleComponent,
} from '../../../../shared/components/lpb-upload-file-single/lpb-upload-file-single.component';
import { EBS_ACTION_SEARCH_CODE, EXTEND_STEP } from '../../shared/constants/card-service-constants';
import { FileHelper } from '../../shared/helpers/file.helper';
import { CardSearchInfo } from '../../shared/models/card-inssuance';
import { SendApproveDto, SendApproveRequest } from '../../shared/models/card-services-extend';
import { CardServicesExtendService } from '../../shared/services/card-services-extend.service';
declare var $: any;

@Component({
  selector: 'app-card-services-extend-step-pin-unlock',
  templateUrl: './card-services-extend-step-pin-unlock.component.html',
  styleUrls: [
    '../card-services-extend-step-send.component.scss',
    './card-services-extend-step-pin-unlock.component.scss',
    '../../shared/components/card-services-form/card-services-form.component.scss',
  ],
})
export class CardServicesExtendStepPinUnlockComponent implements OnInit {
  @Input() cardSelected: CardSearchInfo;
  @Output() eventBackStep = new EventEmitter();
  @ViewChild('uploadFile', { static: false })
  uploadFile: LpbUploadFileSingleComponent;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isShowLoading = false;
  formCustomerInfo: FormGroup;
  file: File;
  userInfo: any;
  showModal = false;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private cardServicesExtendService: CardServicesExtendService
  ) {
    this.initFormCustomerInfo();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    $('.childName').html('Yêu cầu Mở khóa PIN');
    this.formCustomerInfo.patchValue(this.cardSelected);
  }

  initFormCustomerInfo(): void {
    this.formCustomerInfo = this.fb.group({
      customerCode: [{ value: '', disabled: true }],
      uidValue: [{ value: '', disabled: true }],
      fullName: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }],
      branchCode: [{ value: '', disabled: true }],
      cardCategory: [{ value: '', disabled: true }],
      cardProductCode: [{ value: '', disabled: true }],
      cardNumber: [{ value: '', disabled: true }],
      cardEmbossedName: [{ value: '', disabled: true }],
      defaultAccount: [{ value: '', disabled: true }],
      releaseDate: [{ value: '', disabled: true }],
      cardStatusCode: [{ value: '', disabled: true }],
      cardId: [{ value: '', disabled: true }],
      cardCoreId: [{ value: '', disabled: true }],
      sendNote: [''],
      cardCategoryName: [{ value: '', disabled: true }],
      pinCount: [{ value: '', disabled: true }],
      expireDate: [{ value: null, disabled: true }],
      totalOutStanding: [{ value: '', disabled: true }],
      pendingStatus: [{ value: '', disabled: true }],
      userProcessing: [{ value: '', disabled: true }],
      branchCodeProcessing: [{ value: '', disabled: true }],
      clientType: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      creditLimit: [{ value: '', disabled: true }],
      cardTypeCode: [{ value: '', disabled: true }],
      accountStatus: [{ value: '', disabled: true }],
      contractType: [{ value: '', disabled: true }],
      contract: [{ value: '', disabled: true }],
      cardStateCode: [{ value: '', disabled: true }],
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

  openModal(): void {
    this.formCustomerInfo.markAllAsTouched();
    if (this.formCustomerInfo.invalid || this.uploadFile.errMessage !== '') {
      return;
    }
    this.showModal = true;
  }

  unlockPin(): void {
    const frmValue = this.formCustomerInfo.getRawValue();

    const unlockPinDto: SendApproveDto = {
      cardCoreId: frmValue.cardCoreId,
      customerCode: frmValue.customerCode,
      uidValue: frmValue.uidValue,
      fullName: frmValue.fullName,
      phoneNumber: frmValue.phoneNumber,
      branchCode: frmValue.branchCode,
      cardCategory: frmValue.cardCategory,
      cardProductCode: frmValue.cardProductCode,
      cardNumber: frmValue.cardNumber,
      cardEmbossedName: frmValue.cardEmbossedName,
      defaultAccount: frmValue.defaultAccount,
      releaseDate: frmValue.releaseDate,
      cardStatusCode: frmValue.cardStatusCode,
      coreActionCode: EBS_ACTION_SEARCH_CODE.UNLOCK_PIN,
      branchCodeDo: this.userInfo.branchCode,
      pinCount: frmValue.pinCount,
      expireDate: frmValue.expireDate,
      sendNote: '',
      totalOutStanding: frmValue.totalOutStanding,
      clientType: frmValue.clientType,
      address: frmValue.address,
      creditLimit: frmValue.creditLimit,
      cardTypeCode: frmValue.cardTypeCode,
      accountStatus: frmValue.accountStatus,
      contractType: frmValue.contractType,
      contract: frmValue.contract,
      cardStateCode: frmValue.cardStateCode,
    };

    const unlockPinRequest: SendApproveRequest = {
      dto: unlockPinDto,
      file: this.file,
    };

    this.isShowLoading = true;
    this.cardServicesExtendService.sendApprove(unlockPinRequest).subscribe(
      (res) => {
        this.isShowLoading = false;
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess(
            'Gửi duyệt yêu cầu thành công',
            'Thông báo'
          );
          this.eventBackStep.emit();
        } else {
          this.notificationService.showError(
            res.responseStatus.codes[0].detail,
            'Thông báo'
          );
        }
      },
      (error) => {
        this.isShowLoading = false;
        this.notificationService.showError(
          'Gửi duyệt yêu cầu thất bại',
          'Thông báo'
        );
      }
    );
    this.showModal = false;
  }

  changeSelectedFile(file): void {
    this.file = file;
  }
}
