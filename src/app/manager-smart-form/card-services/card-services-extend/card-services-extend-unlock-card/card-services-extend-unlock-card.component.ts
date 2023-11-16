import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LpbUploadFileSingleComponent } from 'src/app/shared/components/lpb-upload-file-single/lpb-upload-file-single.component';
import { NotificationService } from 'src/app/_toast/notification_service';
import { EBS_ACTION_SEARCH_CODE } from '../../shared/constants/card-service-constants';
import { ValidatorHelper } from '../../shared/helpers/validators.helper';
import { CardSearchInfo } from '../../shared/models/card-inssuance';
import {
  SendApproveDto,
  SendApproveRequest,
} from '../../shared/models/card-services-extend';
import { CardServicesExtendService } from '../../shared/services/card-services-extend.service';
import { forkJoin, of } from 'rxjs';
import { switchMap, finalize, take } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-card-services-extend-unlock-card',
  templateUrl: './card-services-extend-unlock-card.component.html',
  styleUrls: [
    './card-services-extend-unlock-card.component.scss',
    '../card-services-extend-step-send.component.scss',
    '../../shared/components/card-services-form/card-services-form.component.scss',
  ],
})
export class CardServicesExtendUnlockCardComponent implements OnInit {
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
    $('.childName').html('Yêu cầu Mở khóa thẻ');

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
      expireDate: [{ value: '', disabled: true }],
      cardStatusCode: [{ value: '', disabled: true }],
      cardId: [{ value: '', disabled: true }],
      cardCoreId: [{ value: '', disabled: true }],
      pinCount: [{ value: '', disabled: true }],
      sendNote: ['', [ValidatorHelper.required, Validators.maxLength(1000)]],
      cardCategoryName: [{ value: '', disabled: true }],
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

  unlockCard(): void {
    this.isShowLoading = true;
    this.showModal = false;

    const frmValue = this.formCustomerInfo.getRawValue();
    const unlockCardDto: SendApproveDto = {
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
      coreActionCode: EBS_ACTION_SEARCH_CODE.UNLOCK,
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

    const unlockRequest: SendApproveRequest = {
      dto: unlockCardDto,
      file: this.file,
    };

    this.cardServicesExtendService.validCardInfo(frmValue.cardCoreId)
      .pipe(
        switchMap((response) => {
          if (response) {
            if (this.cardSelected.cardStatusCode !== 'CSTS0015') {
              return of(true);
            }
            return this.cardServicesExtendService.checkLockCreditCard(
              frmValue.cardCoreId
            );
          }
          return of(undefined);
        }),
        switchMap((response) => {
          if (response) {
            return this.cardServicesExtendService.sendApprove(unlockRequest);
          }
          return of(undefined);
        }),
        take(1),
        finalize(() => {
          this.isShowLoading = false;
        })
      )
      .subscribe(
        (res) => {
          if (res && res.responseStatus?.success) {
            this.notificationService.showSuccess(
              'Gửi duyệt dịch vụ thành công',
              'Thông báo'
            );
            this.eventBackStep.emit();
          } else if (res) {
            this.notificationService.showError(
              res.responseStatus?.codes[0].detail,
              'Thông báo'
            );
          }
        },
        (error) => {
          this.notificationService.showError(
            'Gửi duyệt dịch vụ thất bại',
            'Thông báo'
          );
        }
      );
  }

  changeSelectedFile(file): void {
    this.file = file;
  }

  openModal(): void {
    this.formCustomerInfo.markAllAsTouched();
    if (this.formCustomerInfo.invalid || this.uploadFile.errMessage !== '') {
      return;
    }
    this.showModal = true;
  }
}
