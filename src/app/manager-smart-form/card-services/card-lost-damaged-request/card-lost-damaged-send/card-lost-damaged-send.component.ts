import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  CardEbsInfo,
  CardSearchInfo,
  SendApproveInssuanceInfo,
  SendApproveInssuanceRequest
} from '../../shared/models/card-inssuance';
import {LpbUploadFileSingleComponent} from '../../../../shared/components/lpb-upload-file-single/lpb-upload-file-single.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NotificationService} from '../../../../_toast/notification_service';
import {CardInssuanceService} from '../../shared/services/card-inssuance.service';


@Component({
  selector: 'app-card-lost-damaged-confirm',
  templateUrl: './card-lost-damaged-send.component.html',
  styleUrls: ['./card-lost-damaged-send.component.scss']
})
export class CardLostDamagedSendComponent implements OnInit {
  @Input() cardSelected: CardSearchInfo;
  @Input() cardEbsInfoSelected: CardEbsInfo;
  @Output() eventBackStep = new EventEmitter();
  @ViewChild('uploadFile', { static: false }) uploadFile: LpbUploadFileSingleComponent;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isShowLoading = false;
  formCustomerInfo: FormGroup;
  file: File;
  userInfo: any;
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private cardInssuanceService: CardInssuanceService
  ) {
    this.initFormCustomerInfo();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    this.formCustomerInfo.patchValue(this.cardSelected);
    this.formCustomerInfo.patchValue(this.cardEbsInfoSelected);
  }

  initFormCustomerInfo(): void {
    this.formCustomerInfo = this.fb.group({
      customerCode: [{value: '', disabled: true}],
      uidValue: [{value: '', disabled: true}],
      fullName: [{value: '', disabled: true}],
      phoneNumber: [{value: '', disabled: true}],
      branchCode: [{value: '', disabled: true}],
      cardCategory: [{value: '', disabled: true}],
      cardProductCode: [{value: '', disabled: true}],
      cardNumber: [{value: '', disabled: true}],
      cardEmbossedName: [{value: '', disabled: true}],
      defaultAccount: [{value: '', disabled: true}],
      releaseDate: [{value: '', disabled: true}],
      cardStatusCode: [{value: '', disabled: true}],
      cardStatusEbs: [{value: '', disabled: true}],
      cardEbsSerialNumber: [{value: '', disabled: true}],
      cardId: [{value: '', disabled: true}],
      cardCoreId: [{value: '', disabled: true}],
      sendNote: [''],
      ebsActionCode: [{value: 'CARD_BROKEN_AFTER', disabled: false}],
      checkConnectEbs: [{value: '', disabled: true}]
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
  get ebsActionCode(): any { return this.formCustomerInfo.get('ebsActionCode'); }

  sendApprove(): void {
    if (!this.uploadFile.validateFile()) {
      return;
    }
    const frmValue = this.formCustomerInfo.getRawValue();
    const rpLostBrokenInfo = {
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
      cardEbsSerialNumber: frmValue.cardEbsSerialNumber,
      cardEbsStatusCode: frmValue.cardStatusEbs,
      ebsActionCode: frmValue.ebsActionCode,
      sendNote: frmValue.sendNote.trim(),
      branchCodeDo: this.userInfo.branchCode,
      checkConnectEbs: frmValue.checkConnectEbs
    };
    const request: SendApproveInssuanceRequest = {
      dto: rpLostBrokenInfo,
      file: this.file
    };
    console.log(request);
    this.isShowLoading = true;
    this.cardInssuanceService.sendApproveInsuance(request).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.notificationService.showSuccess('Gửi duyệt yêu cầu thành công', 'Thông báo');
        this.eventBackStep.emit();
      } else {
        this.notificationService.showError(res.responseStatus.codes[0].detail, 'Thông báo');
      }
    }, error => {
      this.isShowLoading = false;
      this.notificationService.showError('Đã có lỗi xảy ra. Vui lòng thử lại', 'Thông báo');
    });
  }

  changeSelectedFile(file): void {
    this.file = file;
  }

}
