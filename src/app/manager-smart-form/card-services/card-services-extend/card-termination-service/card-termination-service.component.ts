import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CardSearchInfo} from '../../shared/models/card-inssuance';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationService} from '../../../../_toast/notification_service';
import {CardServicesExtendService} from '../../shared/services/card-services-extend.service';
import {ValidatorHelper} from '../../shared/helpers/validators.helper';
import {
  LpbUploadFileSingleComponent
} from '../../../../shared/components/lpb-upload-file-single/lpb-upload-file-single.component';
import {SendApproveDto, SendApproveRequest} from '../../shared/models/card-services-extend';
import {EBS_ACTION_SEARCH_CODE} from '../../shared/constants/card-service-constants';
declare var $: any;

@Component({
  selector: 'app-card-termination-service',
  templateUrl: './card-termination-service.component.html',
  styleUrls: ['./card-termination-service.component.scss']
})
export class CardTerminationServiceComponent implements OnInit {
  @Output() eventBackStep = new EventEmitter();
  @Input() cardSelected: CardSearchInfo;
  @ViewChild('uploadFile', { static: false })
  uploadFile: LpbUploadFileSingleComponent;
  formCustomerInfo: FormGroup;
  userInfo: any;
  isShowLoading = false;
  showModal = false;
  file: File;

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
    $('.childName').html('Yêu cầu Chấm dứt sử dụng thẻ');
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
      sendNote: ['', [ValidatorHelper.required, Validators.maxLength(1000)]],
      cardCategoryName: [{ value: '', disabled: true }],
      cardTypeCode: [{value: '', disabled: true}],
      cardStateCode: [{value: '', disabled: true}],
      clientType: [{value: '', disabled: true}],
      contract: [{value: '', disabled: true}],
      contractType: [{value: '', disabled: true}],
      totalOutStanding: [{value: '', disabled: true}],
      pinCount: [{value: '', disabled: true}],
      accountStatus: [{value: '', disabled: true}],
      address: [{value: '', disabled: true}],
      creditLimit: [{value: '', disabled: true}]
    });
  }


  openModal(): void {
    this.formCustomerInfo.markAllAsTouched();
    if (this.formCustomerInfo.invalid || this.uploadFile.errMessage !== '') {
      return;
    }
    this.showModal = true;
  }
  backToSearch(evt): void {
    this.eventBackStep.emit(evt);
  }
  changeSelectedFile(file): void {
    this.file = file;
  }
  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formCustomerInfo.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  cardTermination(): void {
    this.isShowLoading = true;

    const frmValue = this.formCustomerInfo.getRawValue();
    const unlockCardDto = {
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
      expireDate: frmValue.expireDate,
      releaseDate: frmValue.releaseDate,
      cardStatusCode: frmValue.cardStatusCode,
      coreActionCode: 'CARD_END',
      totalOutStanding: frmValue.totalOutStanding,
      clientType: frmValue.clientType,
      sendNote: frmValue.sendNote.trim(),
      address: frmValue.address,
      branchCodeDo: this.userInfo.branchCode,
      creditLimit: frmValue.creditLimit,
      pinCount: frmValue.pinCount,
      cardTypeCode: frmValue.cardTypeCode,
      accountStatus: frmValue.accountStatus,
      contractType: frmValue.contractType,
      contract: frmValue.contract,
      cardStateCode: frmValue.cardStateCode,
    };
    const unlockRequest: SendApproveRequest = {
      dto : unlockCardDto,
      file: this.file,
    };

    this.cardServicesExtendService.sendApprove(unlockRequest).subscribe(
      (res) => {
        this.isShowLoading = false;
        if (res && res.responseStatus?.success) {
          this.notificationService.showSuccess('Gửi duyệt dịch vụ thành công', 'Thông báo');
          this.eventBackStep.emit();
        } else {
          this.notificationService.showError(
            res.responseStatus?.codes[0].detail,
            'Thông báo'
          );
        }
      },
      (error) => {
        this.isShowLoading = false;
        this.notificationService.showError('Gửi duyệt dịch vụ thất bại', 'Thông báo');
      }
    );

    this.showModal = false;
  }

}
