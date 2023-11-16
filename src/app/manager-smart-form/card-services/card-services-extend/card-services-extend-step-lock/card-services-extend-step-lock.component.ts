import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, of } from 'rxjs';
import { NotificationService } from '../../../../_toast/notification_service';
import { LpbUploadFileSingleComponent } from '../../../../shared/components/lpb-upload-file-single/lpb-upload-file-single.component';
import {
  LOCK_STATUSES,
  LOCK_STATUS_CODE,
} from '../../shared/constants/card-service-constants';
import { ValidatorHelper } from '../../shared/helpers/validators.helper';
import { CardSearchInfo } from '../../shared/models/card-inssuance';
import {
  CardServiceResponse,
  SendApproveDto,
  SendApproveRequest,
} from '../../shared/models/card-services-extend';
import { CardServiceCommonService } from '../../shared/services/card-service-common.service';
import { CardServicesExtendService } from '../../shared/services/card-services-extend.service';
import { finalize, switchMap } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-card-services-extend-step-lock',
  templateUrl: './card-services-extend-step-lock.component.html',
  styleUrls: [
    '../card-services-extend-step-send.component.scss',
    './card-services-extend-step-lock.component.scss',
    '../../shared/components/card-services-form/card-services-form.component.scss',
  ],
})
export class CardServicesExtendStepLockComponent implements OnInit {
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
  LOCK_STATUSES = LOCK_STATUSES;
  showModal = false;
  formType = 'LOCK';
  modalHeaderTxt = '';
  modalContents: string[] = [];
  showPendingPopup = false;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private cardServicesExtendService: CardServicesExtendService,
    private cardServiceCommonService: CardServiceCommonService
  ) {
    this.initFormCustomerInfo();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    $('.childName').html('Khóa thẻ');

    this.formCustomerInfo.patchValue(this.cardSelected);

    if (
      this.cardSelected.cardTypeCode &&
      this.cardSelected.cardTypeCode.toLocaleLowerCase().includes('debit')
    ) {
      this.LOCK_STATUSES = this.LOCK_STATUSES.filter((e) => {
        return e.code !== LOCK_STATUS_CODE.LOCK_CREDIT;
      });
    }
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
      expireDate: [{ value: '', disabled: true }],
      cardStatusCode: [{ value: '', disabled: true }],
      cardId: [{ value: '', disabled: true }],
      cardCoreId: [{ value: '', disabled: true }],
      sendNote: ['', [ValidatorHelper.required, Validators.maxLength(1000)]],
      reason: [LOCK_STATUS_CODE.LOCK_LOST, ValidatorHelper.required],
      cardCategoryName: [{ value: '', disabled: true }],
      pinCount: [{ value: '', disabled: true }],
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

  changeLockReason(event): void {
    const reason: string = event;
    if (reason === LOCK_STATUS_CODE.LOCK_LOST) {
      this.formType = 'LOCK';
    } else {
      this.formType = 'SEND_APPROVE';
    }
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formCustomerInfo.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  lockSubmit(): void {
    const frmValue = this.formCustomerInfo.getRawValue();

    const lockCardDto: SendApproveDto = {
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
      coreActionCode: frmValue.reason,
      sendNote: frmValue.sendNote.trim(),
      branchCodeDo: this.userInfo.branchCode,
      expireDate: frmValue.expireDate,
      pinCount: frmValue.pinCount,
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

    const lockCardRequest: SendApproveRequest = {
      dto: lockCardDto,
    };

    let apiCall: Observable<CardServiceResponse>;
    if (lockCardDto.coreActionCode === LOCK_STATUS_CODE.LOCK_LOST) {
      apiCall = this.cardServicesExtendService.emergencyLock(lockCardRequest);
    } else {
      apiCall = this.cardServicesExtendService.sendApprove(lockCardRequest);
    }

    const actionTxt = this.formType === 'LOCK' ? 'Khóa thẻ' : 'Gửi duyệt';
    this.isShowLoading = true;
    this.cardServicesExtendService.validCardInfo(frmValue.cardCoreId)
      .pipe(
        switchMap((response) => {
          if (response) {
            return apiCall;
          }
          return of(undefined);
        }),
        finalize(() => {
          this.isShowLoading = false;
          this.showModal = false;
        })
      )
      .subscribe(
        (res) => {
          if (res && res.responseStatus?.success) {
            this.notificationService.showSuccess(
              `${actionTxt} thành công`,
              'Thông báo'
            );
            this.eventBackStep.emit();
          } else {
            this.notificationService.showError(
              `${actionTxt} thất bại`,
              'Thông báo'
            );
          }
        },
        (error) => {
          this.notificationService.showError(
            `${actionTxt} thất bại`,
            'Thông báo'
          );
        }
      );
  }

  openModal(): void {
    this.formCustomerInfo.markAllAsTouched();
    if (this.formCustomerInfo.invalid) {
      return;
    }

    const frmValue = this.formCustomerInfo.getRawValue();
    if (
      frmValue.pendingStatus === 'PENDING' &&
      this.formType === 'SEND_APPROVE'
    ) {
      const userProcessing = frmValue?.userProcessing || '';
      const branchCode = frmValue?.branchCodeProcessing || '';

      this.modalContents = [
        `Thẻ có giao dịch đang Chờ duyệt/ Pending tạo bởi ${userProcessing}`,
      ];
      this.showModal = true;
      this.showPendingPopup = true;

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

    this.showPendingPopup = false;

    this.modalHeaderTxt =
      this.formType === 'LOCK'
        ? 'Xác nhận khóa thẻ khẩn cấp'
        : 'Xác nhận gửi duyệt khóa thẻ';

    this.modalContents = [
      `Bạn có chắc muốn  ${
        this.formType === 'LOCK'
          ? 'thực hiện Khóa thẻ khẩn cấp'
          : 'gửi duyệt giao dịch Khoá thẻ'
      } ?`,
      `Số thẻ: ${this.cardSelected?.cardNumber}`,
    ];
    this.showModal = true;
  }
}
