import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { docStatus } from 'src/app/shared/models/documents';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { NotificationService } from 'src/app/_toast/notification_service';

@Component({
  selector: 'app-popup-detail-owner',
  templateUrl: './popup-detail-owner.component.html',
  styleUrls: ['./popup-detail-owner.component.scss']
})
export class PopupDetailOwnerComponent implements OnInit {
  readonly docStatus = docStatus;
  @Input() ownerId;
  processId = '';
  // biến bật tắt popup
  isMis = false;
  isUdf = false;

  isShowPopupApprove = false;
  isShowConfirmPopupDelete = false;
  // biến phân quyền
  isDeleteButton = false;
  isApproveButton = false;
  isUpdateButton = false;
  isHiddenButton = false;
  objDetail: any = {};
  // biến hứng dữ liệu trả ra từ api
  objCifDetail: any;
  objPerson: any;
  objMis: any;
  objUdf: any;
  note = '';
  customerId = '';
  approveTypeCode = ''; // phân loại gửi duyệt update and create
  customerCode = ''; // mã cif
  // biến check quyền
  roleLogin: any = [];
  isKSV: boolean;
  isGDV: boolean;
  statusCode;
  process;
  accountId = '';
  isFullRole = false;
  statusCodeCowner = '';
  userInfo: any = {};

  constructor(
    private helpService: HelpsService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private _LOCATION: Location,
    private missionService: MissionService
  ) {
  }

  ngOnInit(): void {
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getRole();
    this.getDetailOwner();
    this.missionService.setProcessId(this.processId);
  }

  getDetailOwner(): void {

    if (this.ownerId) {
      const body = {
        id: this.ownerId
      };
      this.helpService.callApi({
        method: HTTPMethod.POST,
        url: '/process/customer/detailCoowner',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.objDetail = res.item;
            this.checkButtonGDV();
            this.objPerson = res.item.person;
            this.objMis = this.objDetail.mis;
            this.objUdf = this.objDetail.udf;
            this.accountId = this.objDetail.accountId;
            this.customerCode = this.objDetail.customerCode;
          }
        }
      });
    }
  }

  disableButton(): void {
    this.isDeleteButton = false;
    this.isApproveButton = false;
    this.isUpdateButton = false;
  }

  // role kiểm soát viên hay giao dịch viên
  getRole(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    const length = this.roleLogin.length;
    if (length >= 2) {
      this.isGDV = true;
      this.isFullRole = true;
    } else {
      this.isFullRole = false;
      for (let i = 0; i < length; i++) {
        if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
          this.isGDV = true;
          if (this.isGDV) {
            this.isFullRole = true;
          }
        } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
          this.isKSV = true;
        }
      }
    }
    // tslint:disable-next-line:prefer-for-of
  }

  checkButtonGDV(): void {
    this.isUpdateButton = this.isDeleteButton = this.isApproveButton = false;
    if (this.objDetail.currentStatusCode === 'NEW' && this.objDetail.customerCode === null) {
      if (this.objDetail.coowner.processIntegrated !== null) {
        const statusCode = this.objDetail.coowner.processIntegrated.statusCode;
        if (statusCode === this.docStatus.EDIT || statusCode === this.docStatus.MODIFY ||
          statusCode === this.docStatus.TEMP || statusCode === this.docStatus.WAIT) {
          // show cập nhập thông tin
          this.isUpdateButton = true;
          this.isApproveButton = true;
          this.isDeleteButton = true;
        }
        if (statusCode === this.docStatus.WAIT) {
          this.isApproveButton = false;
        }
      }
    }
    // tslint:disable-next-line:max-line-length
    if ((this.objDetail.currentStatusCode === 'NEW' && this.objDetail.customerCode !== null)
      || (this.objDetail.currentStatusCode === 'A' && this.objDetail.coowner.currentStatusCode === 'ACTIVE')) {
      this.isDeleteButton = false;
      if (this.objDetail.coowner.currentStatusCode === 'NEW' || this.objDetail.coowner.currentStatusCode === 'ACTIVE') {
        this.isUpdateButton = true;
      }
      if (this.objDetail.coowner.processIntegrated !== null) {
        const statusCodeCoowner = this.objDetail.coowner.processIntegrated.statusCode;
        if (statusCodeCoowner === this.docStatus.EDIT || statusCodeCoowner === this.docStatus.MODIFY ||
          statusCodeCoowner === this.docStatus.TEMP || statusCodeCoowner === this.docStatus.WAIT) {
          this.isUpdateButton = true;
          this.isApproveButton = true;
        }
        if (statusCodeCoowner === this.docStatus.WAIT) {
          this.isApproveButton = false;
        }
      }
      if ((this.objDetail.currentStatusCode === 'NEW'
        && this.objDetail.coowner.currentStatusCode === 'NEW'
        && this.objDetail.coowner.changeStatusCode === 'ACTIVE'
        && this.objDetail.changeStatusCode === 'A')
        || this.isKSV) {
        this.disableButton();
      }
    }
    if ((this.objDetail.currentStatusCode === 'NEW' && this.objDetail.customerCode !== null) ||
      (this.objDetail.currentStatusCode === 'A' && this.objDetail.coowner.currentStatusCode === 'ACTIVE')) {
      if (this.objDetail.createdBy !== this.userInfo.userId) {
        this.isDeleteButton = false;
        this.isApproveButton = false;
        this.isUpdateButton = true;
      }
    } else {
      if (this.objDetail.createdBy !== this.userInfo.userId) {
        this.disableButton();
      }
    }
  }
  /**
   * bật tắt popup
   */
  showMis(): void { this.isMis = true; }
  showUdf(): void { this.isUdf = true; }
  closeMis(): void { this.isMis = false; }
  closeUdf(): void { this.isUdf = false; }

  sendApiApproveCoowner(itemId, param): void {
    const body = {
      note: this.note,
      id: itemId,
      typeCode: param
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendApproveCreateCoowner',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.getDetailOwner();
            // Tranh duyệt 2 lần show 2 thông báo
            if (param === 'PCO') {
              this.notificationService.showSuccess('Gửi duyệt dịch vụ thành công', 'Thành công');
            }
          } else {
            this.notificationService.showError('Gửi duyệt dịch vụ thất bại', 'Thất bại');
          }
          this.isShowPopupApprove = false;
        }
      }
    );
  }
  confimApproveProcess(evt): void {
    switch (evt) {
      case 'CANCEL':
        this.isShowPopupApprove = false;
        break;
      case 'CONFIRM':
        // kiểm tra nếu  nếu cif là duyệt thành công tạo mới nhưng chưa gán đồng sở hữu cho tài khoản
        if ((this.objDetail.currentStatusCode === 'NEW' && this.objDetail.customerCode !== null)
          || (this.objDetail.currentStatusCode === 'A' && this.objDetail.coowner.currentStatusCode === 'ACTIVE')) {
          // nếu là update hiện hữu
          this.sendApiApproveCoowner(this.objDetail.coowner.id, 'PCO');
        } else {
          // nếu là update là không hiện hữu
          this.integratedApiLockService();
        }
    }
  }
  /**
   *  api xử lý thiết lập lại trạng thái
   */
  integratedApiLockService(): void {
    const body = {
      id: this.ownerId,
      typeCode: 'COOWNER'
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/lockService',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            if (this.objDetail.currentStatusCode === 'NEW' && this.objDetail.customerCode !== null) {
              if ((this.objDetail.currentStatusCode === 'A' && this.objDetail.coowner.currentStatusCode === 'ACTIVE')) {
                // gửi duyệt nếu là update và hiện hữu
                this.sendApiApproveCoowner(this.objDetail.coowner.id, 'PCO');
              }
            } else {
              // gửi duyệt nếu là update và không hiện hữu
              this.sendApiApproveCoowner(this.ownerId, 'COOWNER');
              this.sendApiApproveCoowner(this.objDetail.coowner.id, 'PCO');
            }
          } else {
            this.notificationService.showError('Gửi duyệt cập nhật Ủy quyền thất bại', 'Thất bại');
          }
        }
      });
  }
  doApprove(): void {
    this.isShowPopupApprove = true;
  }
  backPage(): void {
    this._LOCATION.back();
  }
  update(): void {
    this.router.navigate(['./smart-form/manager/co-owner/update', {
      processId: this.processId,
      coOwnerId: this.ownerId
    }]);
  }

  /**
   * Xóa đồng chủ sở hữu
   */
  deleteCoowner(): void {
    const body = {
      id: this.ownerId,
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/customer/deleteCoowner',
      data: body,
      progress: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Xóa đồng sở hữu thành công', 'Thành công');
          this.router.navigate(['./smart-form/manager/co-owner', {
            processId: this.processId,
            id: this.accountId
          }]);
        } else {
          this.notificationService.showError('Xóa đồng sở hữu thất bại', 'Thất bại');
        }
      }
    });
  }

  confirmDeteteProcess(evt): void {
    switch (evt) {
      case 'YES':
        this.deleteCoowner();
        this.isShowConfirmPopupDelete = false;
        break;
      case 'NO':
        this.isShowConfirmPopupDelete = false;
        break;
    }
  }
  doDelete(): void { this.isShowConfirmPopupDelete = true; }
}
