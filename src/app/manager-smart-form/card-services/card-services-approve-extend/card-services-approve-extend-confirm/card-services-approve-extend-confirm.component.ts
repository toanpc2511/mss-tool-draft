import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from '../../../../_toast/notification_service';
import { FileHelper } from '../../shared/helpers/file.helper';
import {
  EbsServicesApproveObject,
  EbsServicesApproveRequest,
  EbsServicesRejectRequest
} from '../../shared/models/card-services-approve';
import { CardEbsServicesApproveExtendService } from '../../shared/services/card-ebs-services-approve-extend.service';

@Component({
  selector: 'app-card-services-approve-extend-confirm',
  templateUrl: './card-services-approve-extend-confirm.component.html',
  styleUrls: ['./card-services-approve-extend-confirm.component.scss']
})
export class CardServicesApproveExtendConfirmComponent implements OnInit {
  @Input() cardEbsServiceSelected: EbsServicesApproveObject;
  formEbsServiceInfo: FormGroup;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isShowLoading = false;
  isShowModal = false;
  isShowModalErr = false;
  errorsDetail = [];
  modalContent = '';
  modalHeader = '';
  requestType = '';
  errTextReason = '';
  txtReason = '';
  readonly ACTION = {
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    CONFIRM_YES: 'CONFIRM YES',
    CANCEL: 'CANCEL'
  };
  modalHeaderError = '';
  @Output() eventBackStep = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    private cardEbsServicesApproveExtendService: CardEbsServicesApproveExtendService
  ) {
    this.initFormEbsService();
  }

  ngOnInit(): void {
    this.formEbsServiceInfo.patchValue(this.cardEbsServiceSelected);
  }

  initFormEbsService(): void {
    this.formEbsServiceInfo = this.fb.group({
      customerCode: [{value: '', disabled: true}],
      uidValue: [{value: '', disabled: true}],
      fullName: [{value: '', disabled: true}],
      phoneNumber: [{value: '', disabled: true}],
      branchCode: [{value: '', disabled: true}],
      cardCategoryName: [{value: '', disabled: true}],
      cardProductCode: [{value: '', disabled: true}],
      cardNumber: [{value: '', disabled: true}],
      defaultAccount: [{value: '', disabled: true}],
      releaseDate: [{value: '', disabled: true}],
      branchCodeDo: [{value: '', disabled: true}],
      sendNote: [{value: '', disabled: true}],
      actionName: [{value: '', disabled: true}],
      fileType: [''],
      fileName: [{value: '', disabled: true}],
      fileContent: [''],
    });
  }

  backToSearch(evt): void {
    this.eventBackStep.emit(evt);
  }

  approve(): void {
    this.isShowLoading = true;
    this.isShowModal = false;
    const request: EbsServicesApproveRequest = {
      id: this.cardEbsServiceSelected.id
    };
    this.cardEbsServicesApproveExtendService.approveEbsServices(request).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.notificationService.showSuccess('Phê duyệt ' + this.cardEbsServiceSelected.actionName + ' thành công', 'Thông báo');
        this.eventBackStep.emit();
      } else {
        this.errorsDetail = res.responseStatus.codes;
        this.modalHeaderError = 'Phê duyệt yêu cầu thất bại';
        this.isShowModalErr = true;
      }
    }, error => {
      this.isShowLoading = false;
      this.notificationService.showError('Đã có lỗi xảy ra. Vui lòng thử lại.', 'Thông báo');
    });
  }

  reject(): void {
    this.isShowLoading = true;
    this.isShowModal = false;
    const request: EbsServicesRejectRequest = {
      id: this.cardEbsServiceSelected.id,
      approveNote: this.txtReason
    };
    this.cardEbsServicesApproveExtendService.rejectEbsServices(request).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.notificationService.showSuccess('Từ chối ' + this.cardEbsServiceSelected.actionName + ' thành công', 'Thông báo');
        this.eventBackStep.emit();
      } else {
        this.errorsDetail = res.responseStatus.codes;
        this.modalHeaderError = 'Từ chối yêu cầu thất bại';
        this.isShowModalErr = true;
      }
    }, error => {
      this.isShowLoading = false;
      this.notificationService.showError('Đã có lỗi xảy ra. Vui lòng thử lại.', 'Thông báo');
    });
  }

  downloadFile(): void {
    if (!this.cardEbsServiceSelected.fileContent || this.cardEbsServiceSelected.fileContent === '') {
      return;
    }
    const linkSource = 'data:application/octet-stream;base64,' + this.cardEbsServiceSelected.fileContent;
    const downloadLink = document.createElement('a');
    downloadLink.href = linkSource;
    downloadLink.download = this.cardEbsServiceSelected.fileName;
    downloadLink.click();
  }

  evtBtnActionClick(actionName: string): void {
    this.modalContent = '';
    this.modalHeader = '';
    this.requestType = '';
    this.errTextReason = '';
    switch (actionName) {
      case this.ACTION.APPROVE:
        this.modalContent = 'Bạn có chắc chắn duyệt yêu cầu của khách hàng: ';
        this.modalHeader = 'Xác nhận phê duyệt yêu cầu';
        this.requestType = this.ACTION.APPROVE;
        this.isShowModal = true;
        break;
      case this.ACTION.REJECT:
        this.modalContent = 'Bạn có chắc chắn từ chối yêu cầu của khách hàng: ';
        this.modalHeader = 'Xác nhận từ chối yêu cầu';
        this.requestType = this.ACTION.REJECT;
        this.isShowModal = true;
        break;
      default:
        break;
    }
  }

  evtBtnConfirmClick(actionName: string): void {
    switch (actionName) {
      case this.ACTION.CONFIRM_YES:
        if (this.requestType === this.ACTION.APPROVE) {
          this.approve();
        } else {
          if (this.txtReason === '') {
            this.errTextReason = 'Lý do từ chối bắt buộc nhập';
          } else {
            this.reject();
          }
        }
        break;
      case this.ACTION.CANCEL:
        this.modalContent = '';
        this.modalHeader = '';
        this.requestType = '';
        this.txtReason = '';
        this.errTextReason = '';
        this.isShowModal = false;
        break;
      default:
        break;
    }
  }

  hideModal(): void {
    this.errTextReason = '';
    this.txtReason = '';
    this.isShowModal = false;
  }

  download(): void{
    const base64String = this.cardEbsServiceSelected.fileContent;
    const fileType = this.cardEbsServiceSelected.fileType;
    const fileName = this.cardEbsServiceSelected.fileName;

    try {
      FileHelper.downloadFileFromBase64(base64String, fileName, fileType);
    } catch (error) {
      console.log(error);
      this.notificationService.showError('Tải file thất bại', 'Thông báo');
    }
  }
}
