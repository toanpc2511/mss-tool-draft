import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {
  CardEbsInfo, CardSearchInfo,
  SendApproveInssuanceInfo, SendApproveInssuanceRequest
} from '../../../shared/models/card-inssuance';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CardInssuanceService} from '../../../shared/services/card-inssuance.service';
import {LpbUploadFileSingleComponent} from '../../../../../shared/components/lpb-upload-file-single/lpb-upload-file-single.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../../manager-admin/system-partner/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment/moment';
import {CustomNotificationService} from '../../../../../shared/services/custom-notification.service';

@Component({
  selector: 'app-step-view-detail',
  templateUrl: './step-view-detail.component.html',
  styleUrls: ['./step-view-detail.component.scss']
})
export class StepViewDetailComponent implements OnInit {
  @Input() cardSelected: CardSearchInfo;
  @Input() cardEbsInfoSelected: CardEbsInfo;
  @Input() acctionView;
  @Input() acctionCode;
  @Input() detailedList;
  @Output() eventBackStep = new EventEmitter();
  @ViewChild('uploadFile', { static: false }) uploadFile: LpbUploadFileSingleComponent;
  private blob: Blob;
  isShowLoading = false;
  loadingPrint = false;
  formCustomerInfo: FormGroup;
  file: File;
  getFile: any;
  userInfo: any;
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private notify: CustomNotificationService,
    private cardService: CardInssuanceService,
    public dialog: MatDialog
  ) {
    this.initFormCustomerInfo();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }

  ngOnInit(): void {
    // console.log(this.acctionView);
    // console.log(this.acctionCode);
    switch (this.acctionView) {
      case 'DELETE':
        this.formCustomerInfo.patchValue(this.detailedList);
        this.getFile = this.detailedList.ebsActionCode;
        break;
      case 'VIEW_DETAIL':
        this.formCustomerInfo.patchValue(this.detailedList);
        this.getFile = this.detailedList.ebsActionCode;
        break;
      case 'REQ_APPROVE':
        this.formCustomerInfo.patchValue(this.cardSelected);
        if (this.cardEbsInfoSelected) {
          this.formCustomerInfo.patchValue(this.cardEbsInfoSelected);
        }
        this.formCustomerInfo.controls.employeeId.setValue(this.userInfo.employeeId);
        this.getFile = this.acctionCode;
        break;
    }
  }

  initFormCustomerInfo(): void {
    this.formCustomerInfo = this.fb.group({
      customerCode: [{value: '', disabled: true}],
      uidValue: [{value: '', disabled: true}],
      fullName: [{value: '', disabled: true}],
      phoneNumber: [{value: '', disabled: true}],
      branchCode: [{value: '', disabled: true}],
      cardCategory: [{value: '', disabled: true}],
      cardCategoryName: [{value: '', disabled: true}],
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
      checkConnectEbs: [{value: '', disabled: true}],
      employeeId: [{value: '', disabled: true}],
      cardEbsStatusCode: [{value: '', disabled: true}],
      brokenDesc: ['Thẻ hỏng trong quá trình sử dụng']
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

  sendApprove(): void {
    const frmValue = this.formCustomerInfo.getRawValue();
    const data = {
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
      ebsActionCode: this.acctionCode,
      sendNote: frmValue.sendNote.trim(),
      branchCodeDo: this.userInfo.branchCode,
      checkConnectEbs: frmValue.checkConnectEbs,
      employeeId: this.userInfo.employeeId,
      brokenDesc: this.acctionCode === 'CARD_BROKEN_AFTER' ? frmValue.brokenDesc : null
    };
    this.isShowLoading = true;
    this.cardService.sendApprove(data).subscribe(res => {
      this.isShowLoading = false;
      if (res && res.responseStatus.success) {
        this.notify.success('Thông báo', 'Gửi duyệt yêu cầu thành công');
        this.eventBackStep.emit();
      } else {
        this.isShowLoading = false;
        this.notify.error('Thông báo', res.responseStatus.codes[0].msg);
      }
    }, error => {
      this.isShowLoading = false;
      this.notify.error('Thông báo', 'Đã có lỗi xảy ra, vui lòng thử lại');
    });
  }

  deleteRequest(): any {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Xác nhận yêu cầu',
        message: 'Bạn chắc chắn muốn xóa yêu cầu này không ?'
      }
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.isShowLoading = true;
        const request = {id: this.detailedList.id};
        this.cardService.deleteRequest(request).subscribe(res => {
          this.isShowLoading = false;
          if (res && res.responseStatus.success) {
            this.notify.success('Thông báo', 'Đã xóa yêu cầu thành công');
            this.eventBackStep.emit();
          } else {
            this.isShowLoading = false;
            this.notify.error('Thông báo', res.responseStatus.codes[0].msg);
          }
        });
      }
    }, error => {
      this.notify.error('Thông báo', 'Có lỗi, vui lòng thử lại sau');
      this.eventBackStep.emit();
    });
  }

  fileBBBGT(): void {
    const frmValue = this.formCustomerInfo.getRawValue();
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
      this.notify.success('Thông báo', 'Tải xuống thành công');
      link.click();
    }, error => {
      this.loadingPrint = false;
      this.notify.error('Thông báo', 'Có lỗi, vui lòng thử lại sau');
    });
  }

  fileBBTGT(): void {
    const frmValue = this.formCustomerInfo.getRawValue();
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
      this.notify.success('Thông báo', 'Tải xuống thành công');
      link.click();
    }, error => {
      this.loadingPrint = false;
      this.notify.error('Thông báo', 'Có lỗi, vui lòng thử lại sau');
    });
  }

  fileYCTGKHCN(): void {
    const frmValue = this.formCustomerInfo.getRawValue();
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
