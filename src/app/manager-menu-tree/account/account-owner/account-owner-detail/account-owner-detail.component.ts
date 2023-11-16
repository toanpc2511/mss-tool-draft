import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { docStatus } from 'src/app/shared/models/documents';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
declare var $: any;

@Component({
  selector: 'app-account-owner-detail',
  templateUrl: './account-owner-detail.component.html',
  styleUrls: ['./account-owner-detail.component.scss']
})
export class AccountOwnerDetailComponent implements OnInit {
  readonly docStatus = docStatus;
  processId = '';
  // biến bật tắt popup
  isMis = false;
  isUdf = false;
  readonly btnButton = {
    MODIFY: 'MODIFY',
    APPROVE: 'APPROVE',
    REQUEST_ADD: 'REQUEST_ADD',
    REJECT: 'REJECT'
  };
  isShowPopupApprove = false;
  isShowSendPopupApprove = false;
  isShowConfirmPopupDelete = false;
  // biến phân quyền
  isUpdate = false;
  isDelete = false;
  isModifyCreate = false;
  isRejectCreate = false;
  isSendApproveFastCif = false;
  isSendApproveOwner = false;
  isSendApprove = false;
  isApproveCreate = false;
  isApproveUpdate = false;
  isRejectUpdate = false;
  isModifyUpdate = false;
  isReject = false;
  isModify = false;
  isApproveOwner = false;
  isApproveFastCif = false;
  isApprove = false;
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
  customerCode: any; // mã cif đồng sở hữu
  // biến check quyền
  roleLogin: any = [];
  isKSV: boolean;
  isGDV: boolean;
  statusCode = '';
  process;
  detailId: any; // id cif của khối đồng sở hữu
  detailCownerId: any; // id  của khối đồng sở hữu;
  accountId = '';
  isFullRole = false;
  statusCodeCowner = '';
  userInfo: any = {};
  customerCodeHs: any; // mã cif của hồ sơ
  branchCode: any; // chi nhánh của dịch vụ
  createdBy: any;
  statusCif: any;
  tempBtn: any;
  branchCodeHs: any; // chi nhánh của hồ sơ

  constructor(
    private helpService: HelpsService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private _LOCATION: Location,
    private missionService: MissionService,
    private authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.detailId = this.route.snapshot.paramMap.get('coOwnerId');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.missionService.setProcessId(this.processId);
    this.getDetailOwner();
    $('.childName').html('Chi tiết đồng sở hữu');
  }

  getDetailOwner(): void {
    const body = {
      id: this.detailId
    };
    if (!body) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/customer/detailCoowner',
      data: body,
      progress: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.objDetail = res.item;
          this.detailCownerId = this.objDetail.coowner.id;
          this.objPerson = res.item.person;
          this.objMis = this.objDetail.mis;
          this.objUdf = this.objDetail.udf;
          this.accountId = this.objDetail.accountId;
          this.customerCode = this.objDetail.customerCode;
          this.getDetailAccountInformation();
        }
      }
    });
  }

  confimApproveProcess(evt): void {
    switch (evt) {
      case 'CANCEL':
        this.isShowPopupApprove = false;
        break;
      case 'CONFIRM':
        switch (this.tempBtn) {
          case this.btnButton.REQUEST_ADD:
            this.modify();
            break;
          case this.btnButton.REJECT:
            this.reject();
            break;
          case this.btnButton.APPROVE:
            this.approve();
            break;
          default:
            break;
        }
        this.isShowPopupApprove = false;
    }
  }
  getDetailAccountInformation(): void {
    const body = {
      id: this.accountId
    };
    if (!body) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/account/account/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.branchCode = res.item.branchCode;
            this.getDetailProfile();
          } else {
            this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
          }
        }
      }
    );
  }

  /**
   * lấy trạng thái hố sơ
   */
  getDetailProfile(): void {
    if (!this.processId) { return; }
    const body = {
      id: this.processId
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.statusCode = res.item?.statusCode;
            this.createdBy = res.item?.createdBy;
            this.customerCodeHs = res.item?.customerCode;
            this.statusCif = res.item?.customer.statusCif;
            this.branchCodeHs = res.item?.branchCode;
            this.getRole();
            this.actionButton();
          }
        }
      }
    );
  }

  /**
   *  kiểm tra hồ sơ ấy có phải là người tạo hay ko
   */
  checkEditable(): void {
    const body = {
      processId: this.processId,
      customerCode: this.customerCodeHs
    };
    if (!body) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/checkEditable',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            if (res.item.editable) {
              this.router.navigate(['./smart-form/manager/co-owner/update', {
                processId: this.processId,
                coOwnerId: this.detailId
              }]);
            } else {
              this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }
  reject(): void {
    if (this.objDetail.coowner?.processIntegrated) {
      const body = {
        id: this.objDetail.coowner?.processIntegrated.id,
        note: this.note
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/sendRejectCreateCoowner',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.getDetailOwner();
              this.notificationService.showSuccess('Duyệt dịch vụ thành công', 'Thành công');
            } else {
              this.notificationService.showError('Duyệt dịch vụ thất bại', 'Thất bại');
            }
          }
        }
      );
    } else {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
    }
  }
  modify(): void {
    if (this.objDetail.coowner?.processIntegrated) {
      const body = {
        id: this.objDetail.coowner?.processIntegrated.id,
        note: this.note
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/sendModifyCreateCoowner',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.getDetailOwner();
              this.notificationService.showSuccess('Duyệt dịch vụ thành công', 'Thành công');
            } else {
              this.notificationService.showError('Duyệt dịch vụ thất bại', 'Thất bại');
            }
          }
        }
      );
    } else {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
    }
  }

  showPopup(param): void {
    this.note = '';
    this.tempBtn = param;
    this.isShowPopupApprove = true;
  }

  approveCreateCoowner(): void {
    if (this.objDetail.coowner?.processIntegrated) {
      const body = {
        id: this.objDetail.coowner?.processIntegrated.id
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/approveCreateCoowner',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.getDetailOwner();
              this.notificationService.showSuccess('Duyệt dịch vụ thành công', 'Thành công');
            } else {
              this.notificationService.showError('Duyệt dịch vụ thất bại', 'Thất bại');
            }
          }
        }
      );
    } else {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
    }
  }

  approve(): void {
    if (this.customerCode) {
      this.approveCreateCoowner();
    } else {
      this.approveCreateFastCIF();
    }
  }
  approveCreateFastCIF(): void {
    if (this.objDetail.processIntegrated) {
      const body = {
        id: this.objDetail.processIntegrated.id
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/approveCreateFastCIF',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.approveCreateCoowner();
              this.notificationService.showSuccess('Duyệt dịch vụ thành công', 'Thành công');
            } else {
              this.notificationService.showError('Duyệt dịch vụ thất bại', 'Thất bại');
            }
          }
        }
      );
    } else {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
    }
  }
  // role kiểm soát viên hay giao dịch viên
  getRole(): void {
    this.disableAllBtn();
    // tslint:disable-next-line:align
    this.isUpdate = this.authenticationService.isPermission(PermissionConst.TK_DONG_SO_HUU.UPDATE);
    this.isSendApproveFastCif = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_FAST_CIF);
    this.isSendApproveOwner = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_COOWNER);
    this.isSendApprove = (this.objDetail.customerCode ? this.isSendApproveOwner : this.isSendApproveFastCif);
    this.isDelete = this.authenticationService.isPermission(PermissionConst.TK_DONG_SO_HUU.DELETE);
    this.isApproveOwner = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.APPROVE_CREATE_OWNER);
    this.isApproveFastCif = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.APPROVE_CREATE_FAST_CIF);
    this.isApprove = (this.objDetail.customerCode ? this.isApproveOwner : this.isApproveFastCif);
    this.isReject = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_REJECT_CREATE_COOWNER);
    this.isModify = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_MODIFY_CREATE_COOWNER);

  }

  disableAllBtn(): void {
    // tslint:disable-next-line:max-line-length
    this.isApprove = this.isSendApprove = this.isApproveFastCif = this.isApproveOwner = this.isReject = this.isModify = this.isDelete = this.isUpdate = false;
  }

  actionButton(): void {
    if (this.statusCif !== 'Y' && this.statusCif !== 'C') {
      // check hiển thỉ các nút sau khi click
      this.checkActionButton();
      // hoạt động hiển thỉ các nút đối vơi hồ sơ pedding
      this.checkProfilePending();
    } else {
      this.disableAllBtn();
    }

  }

  checkActionButton(): void {
    if (this.objDetail.coowner?.processIntegrated) {
      const statusCode = this.objDetail.coowner?.processIntegrated.statusCode;
      if (statusCode === this.docStatus.EDIT || statusCode === this.docStatus.MODIFY ||
        statusCode === this.docStatus.TEMP || statusCode === this.docStatus.WAIT) {
        this.isUpdate = this.isUpdate ? true : false;
        this.isSendApprove = this.isSendApprove ? true : false;
        this.isDelete = this.isDelete ? true : false;
      }
      if (statusCode === this.docStatus.WAIT) {
        this.isSendApprove = false;
      }
      // nếu tạo mới cif cif duyệt thành công nhưng chưa gán đồng sở hữu, hoặc chưa duyệt chưa gán
      if ((this.objDetail.currentStatusCode === 'NEW' && this.objDetail.customerCode === null)
        // tslint:disable-next-line:max-line-length
        || this.objDetail.currentStatusCode === 'NEW' && this.objDetail.customerCode !== null && this.objDetail.coowner?.currentStatusCode === 'NEW' && this.objDetail.coowner?.changeStatusCode !== 'ACTIVE') {
        this.isDelete = this.isDelete ? true : false;
      }
      // nếu search về
      if ((this.objDetail.coowner?.changeStatusCode === 'ACTIVE' && this.objDetail.coowner?.currentStatusCode === 'ACTIVE') ||
        (this.objDetail.currentStatusCode === 'A' && this.objDetail.coowner?.currentStatusCode === 'ACTIVE')) {

        this.isDelete = false;
        this.isUpdate = this.isUpdate ? true : false;
      }
      // tạo mới duyệt thành công hiện tại
      if (statusCode === this.docStatus.APPROVED || statusCode === this.docStatus.REJECT) {
        this.disableAllBtn();
      }
      if (statusCode === this.docStatus.MODIFY) {
        this.isSendApprove = this.isReject = this.isApprove = this.isModify = false;
      }
    } else {
      // khi search về processIntegrated là null
      if (this.objDetail?.coowner?.currentStatusCode === 'ACTIVE') {
        this.isDelete = false;
        this.isSendApprove = false;
        this.isUpdate = this.isUpdate ? true : false;
      }
    }
  }

  checkProfilePending(): void {
    // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
    // tslint:disable-next-line:max-line-length
    if ((this.statusCode === docStatus.EDIT
      || this.statusCode === docStatus.WAIT
      || this.statusCode === docStatus.TEMP
      || this.statusCode === this.docStatus.MODIFY) && this.createdBy !== this.userInfo.userId) {
      // nếu là khác người tạo thì ẩn hết các nút  duyệt, xóa , cập nhập thông tin
      this.isDelete = this.isSendApprove = this.isUpdate = false;
      // chưa sinh dịch vụ với hồ sơ pending
      if ((this.objDetail.coowner?.processIntegrated && this.objDetail.coowner?.processIntegrated.statusCode !== 'W')) {
        this.isReject = this.isApprove = this.isModify = false;
      }
    } else {
      //  trong hồ sơ  không pending check 2 trường hợp
      // 1. nếu là đã duyệt và từ chối thì ẩn hết button
      // 2. nếu ko phải thì check tới chi nhánh của dịch vụ
      if (this.statusCode === docStatus.APPROVED
        || this.statusCode === docStatus.SUCCESS
        || this.statusCode === docStatus.REJECT) {
        this.disableAllBtn();
      } else {
        // nếu như không phải pendding thì check chi nhánh của dịch vụ
        // nếu khác chi nhanh => show cập nhập thông tin, không gửi duyệt, ko xóa
        this.isDelete = this.isDelete ? true : false;
        this.isUpdate = this.isUpdate ? true : false;
        if (this.branchCode !== this.userInfo.branchCode) {
          this.isSendApprove = false;
        } else {
          this.isSendApprove = this.isSendApprove ? true : false;
        }
      }
    }
  }
  /**
   *  trường hợp vơi kiểm soát viên có quyền duyệt
   */
  showBtnApprove(): void {
    // nếu như khác chi nhánh
    // tslint:disable-next-line:no-bitwise
    if (this.branchCodeHs.branchCode && this.branchCodeHs.branchCode !== this.userInfo.branchCode) {
      this.isApprove = this.isReject = this.isModify = false;
    } else {
      // cùng chi nhánh
      this.isApprove = this.isApprove ? true : false;
      this.isModify = this.isModify ? true : false;
      this.isReject = this.isReject ? true : false;
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
            this.notificationService.showSuccess('Gửi duyệt dịch vụ thành công', 'Thành công');
          } else {
            this.notificationService.showError('Gửi duyệt dịch vụ thất bại', 'Thất bại');
          }
          this.isShowSendPopupApprove = false;
        }
      }
    );
  }
  confimSendApproveProcess(evt): void {
    switch (evt) {
      case 'CANCEL':
        this.isShowSendPopupApprove = false;
        break;
      case 'CONFIRM':
        // kiểm tra nếu  nếu cif là duyệt thành công tạo mới nhưng chưa gán đồng sở hữu cho tài khoản
        if (this.objDetail.customerCode !== null) {
          // nếu là gửi duyệt hiện hữu
          this.sendApiApproveCoowner(this.detailCownerId, 'PCO');
        } else {
          // nếu là gửi duyệt là không hiện hữu thì duyệt cả cif
          this.sendApiApproveFastCIF(this.detailId, 'COOWNER');
        }
    }
  }

  /**
   *  api xử lý chờ duyệt tạo cif nhanh
   */
  sendApiApproveFastCIF(itemId: any, typeCode: string): void {
    const body = {
      note: this.note,
      id: itemId,
      typeCode
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendApproveCreateFastCIF',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.sendApiApproveCoowner(this.detailCownerId, 'PCO');
          } else {
            this.notificationService.showError('Gửi duyệt dịch vụ thất bại', 'Thất bại');
          }
          this.isShowSendPopupApprove = false;
        }
      }
    );
  }

  doApprove(): void {
    this.isShowSendPopupApprove = true;
  }
  backPage(): void {
    this._LOCATION.back();
  }
  update(): void {
    if (this.customerCodeHs) {
      this.checkEditable();
    } else {
      this.router.navigate(['./smart-form/manager/co-owner/update', {
        processId: this.processId,
        coOwnerId: this.detailId
      }]);
    }
  }
  /**
   * Xóa đồng chủ sở hữu
   */
  deleteCoowner(): void {
    const body = {
      id: this.detailId,
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/customer/deleteCoowner',
      data: body,
      progress: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.getDetailOwner();
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
