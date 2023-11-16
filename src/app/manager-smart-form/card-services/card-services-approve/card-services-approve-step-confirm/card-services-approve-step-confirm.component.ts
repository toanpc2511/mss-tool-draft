import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  EbsServicesApprove,
  EbsServicesApproveObject,
  EbsServicesApproveRequest,
  EbsServicesRejectRequest
} from '../../shared/models/card-services-approve';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CardEbsServicesApproveService} from '../../shared/services/card-ebs-services-approve.service';
import * as moment from 'moment';
import {CardInssuanceService} from '../../shared/services/card-inssuance.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';

@Component({
  selector: 'app-card-services-approve-step-confirm',
  templateUrl: './card-services-approve-step-confirm.component.html',
  styleUrls: ['./card-services-approve-step-confirm.component.scss']
})
export class CardServicesApproveStepConfirmComponent implements OnInit {
  @Input() cardEbsServiceSelected: EbsServicesApproveObject;
  @Input() view: string;
  private blob: Blob;
  userInfo: any;
  userRole: any;
  formEbsServiceInfo: FormGroup;
  isShowLoading = false;
  loadingPrint = false;
  isShowModal = false;
  isShowModalErr = false;
  errorsDetail = [];
  modalContent = '';
  modalHeader = '';
  requestType = '';
  errTextReason = '';
  txtReason = '';
  getFile: any;
  hidenBtn: string;
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
    private cardEbsServicesApproveService: CardEbsServicesApproveService,
    private cardService: CardInssuanceService,
    private notify: CustomNotificationService
  ) {
    this.initFormEbsService();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userRole = JSON.parse(localStorage.getItem('userRole')).code;
  }

  ngOnInit(): void {
    this.formEbsServiceInfo.patchValue(this.cardEbsServiceSelected);
    this.getFile = this.cardEbsServiceSelected.ebsActionCode;
    this.hidenBtn = this.cardEbsServiceSelected.displayStatus;
  }

  initFormEbsService(): void {
    this.formEbsServiceInfo = this.fb.group({
      customerCode: [{value: '', disabled: true}],
      uidValue: [{value: '', disabled: true}],
      fullName: [{value: '', disabled: true}],
      phoneNumber: [{value: '', disabled: true}],
      branchCode: [{value: '', disabled: true}],
      cardCategory: [{value: '', disabled: true}],
      cardProductCode: [{value: '', disabled: true}],
      cardNumber: [{value: '', disabled: true}],
      defaultAccount: [{value: '', disabled: true}],
      releaseDate: [{value: '', disabled: true}],
      branchCodeDo: [{value: '', disabled: true}],
      sendNote: [{value: '', disabled: true}],
      ebsActionName: [{value: '', disabled: true}],
      fileType: [''],
      fileName: [{value: '', disabled: true}],
      fileContent: [''],
      employeeId: [{value: '', disabled: true}],
      cardCoreId: [{value: '', disabled: true}],
      cardEbsStatusCode: [{value: '', disabled: true}],
      cardStatusCode: [{value: '', disabled: true}],
      cardEbsSerialNumber: [{value: '', disabled: true}],
      brokenDesc: [{value: '', disabled: true}]
    });
  }

  backToSearch(evt): void {
    this.eventBackStep.emit(evt);
  }

  approve(): void {
    this.isShowLoading = true;
    this.isShowModal = false;
    const request: EbsServicesApprove = {
      id: this.cardEbsServiceSelected.id,
      displayStatus: this.cardEbsServiceSelected.displayStatus,
      screenType: this.userRole === 'UNIFORM.BANK.KSV' ? 'KSV' : 'NHS'
    };
    this.cardEbsServicesApproveService.approveEbsServices(request).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.notify.success('Thông báo', 'Phê duyệt ' + this.cardEbsServiceSelected.ebsActionName + ' thành công');
        this.eventBackStep.emit();
      } else {
        this.errorsDetail = res.responseStatus.codes;
        // this.modalHeaderError = 'Phê duyệt yêu cầu thất bại';
        this.modalHeaderError = 'Thông báo';
        this.isShowModalErr = true;
      }
    }, error => {
      this.isShowLoading = false;
      this.notify.error('Thông báo', 'Đã có lỗi xảy ra. Vui lòng thử lại');
    });
  }

  reject(): void {
    this.isShowLoading = true;
    this.isShowModal = false;
    const request: EbsServicesRejectRequest = {
      id: this.cardEbsServiceSelected.id,
      approveNote: this.txtReason
    };
    this.cardEbsServicesApproveService.rejectEbsServices(request).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.notify.success('Thông báo', 'Từ chối ' + this.cardEbsServiceSelected.ebsActionName + ' thành công');
        this.eventBackStep.emit();
      } else {
        this.errorsDetail = res.responseStatus.codes;
        this.modalHeaderError = 'Từ chối yêu cầu thất bại';
        this.isShowModalErr = true;
      }
    }, error => {
      this.isShowLoading = false;
      this.notify.error('Thông báo', 'Đã có lỗi xảy ra, vui lòng thử lại');
    });
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

  fileBBBGT(): void {
    const frmValue = this.formEbsServiceInfo.getRawValue();
    const request = {
      customerCode: frmValue.customerCode,
      uidValue: frmValue.uidValue,
      fullName: frmValue.fullName,
      cardNumber: frmValue.cardNumber,
      branchCodeDo: this.userInfo.branchCode,
      cardProductCode: frmValue.cardProductCode,
      inputBy: this.userInfo.userCore,
      createdDate: moment().format('DD/MM/yyyy')
    };
    this.loadingPrint = true;
    this.cardService.exportBBBGT(request).subscribe(data => {
      this.loadingPrint = false;
      this.blob = new Blob([data], {type: 'application/pdf'});
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      const fileName = moment().format('yyyyMMDD');
      link.download = 'BBBGT - ' + fileName + '.pdf';
      link.click();
      this.notify.success('Thông báo', 'Tải xuống thành công');
    }, error => {
      this.loadingPrint = false;
      this.notify.error('Thông báo', 'Có lỗi, vui lòng thử lại sau');
    });
  }

  fileBBTGT(): void {
    const frmValue = this.formEbsServiceInfo.getRawValue();
    const request = {
      customerCode: frmValue.customerCode,
      uidValue: frmValue.uidValue,
      fullName: frmValue.fullName,
      cardNumber: frmValue.cardNumber,
      branchCodeDo: this.userInfo.branchCode,
    };
    this.loadingPrint = true;
    this.cardService.exportBBTGT(request).subscribe(data => {
      this.loadingPrint = false;
      this.blob = new Blob([data], {type: 'application/pdf'});
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      const fileName = moment().format('yyyyMMDD');
      link.download = 'BBTGT - ' + fileName + '.pdf';
      link.click();
      this.notify.success('Thông báo', 'Tải xuống thành công');
    }, error => {
      this.loadingPrint = false;
      this.notify.error('Thông báo', 'Có lỗi, vui lòng thử lại sau');
    });
  }

  fileYCTGKHCN(): void {
    const frmValue = this.formEbsServiceInfo.getRawValue();
    const request = {
      customerCode: frmValue.customerCode,
      uidValue: frmValue.uidValue,
      fullName: frmValue.fullName,
      cardNumber: frmValue.cardNumber,
      branchCodeDo: this.userInfo.branchCode,
      cardProductCode: frmValue.cardProductCode,
    };
    this.loadingPrint = true;
    this.cardService.exportYCTGKHCN(request).subscribe(data => {
      this.loadingPrint = false;
      this.blob = new Blob([data], {type: 'application/pdf'});
      const downloadURL = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = downloadURL;
      const fileName = moment().format('yyyyMMDD');
      link.download = 'Yêu cầu trợ giúp KHCN - ' + fileName + '.pdf';
      link.click();
      this.notify.success('Thông báo', 'Tải xuống thành công');
    }, error => {
      this.loadingPrint = false;
      this.notify.error('Thông báo', 'Có lỗi, vui lòng thử lại sau');
    });
  }

}
