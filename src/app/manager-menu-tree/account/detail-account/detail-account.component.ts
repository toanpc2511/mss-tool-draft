import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { MissionService } from '../../../services/mission.service';
import { AccountService } from '../../../_services/account.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { DetailProcess } from '../../../_models/process';
import { ResponseStatus } from '../../../_models/response';
import { Process } from 'src/app/_models/process/Process';
import { NotificationService } from 'src/app/_toast/notification_service';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { docStatus } from 'src/app/shared/models/documents';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PermissionConst } from 'src/app/_utils/PermissionConst';

declare var $: any;

@Component({
  selector: 'app-detail-account',
  templateUrl: './detail-account.component.html',
  styleUrls: ['./detail-account.component.scss']
})
export class DetailAccountComponent implements OnInit {

  @Output() accId = new EventEmitter();
  isShowPopupSendApprove = false;
  readonly docStatus = docStatus;
  processId: string;
  accountId: string;
  response: ResponseStatus;
  process: Process = new Process();
  statusCode = '';
  note = '';
  readonly btnButton = {
    MODIFY: 'MODIFY',
    APPROVE: 'APPROVE',
    REQUEST_ADD: 'REQUEST_ADD',
    REJECT: 'REJECT'
  };
  // view
  detailAccount: any;
  detailProcess: DetailProcess = new DetailProcess(null);
  roleLogin: any = [];
  changeStatusCode = null;
  currentStatusCode = null;
  userInfo: any = {};
  processIntegrated: any;
  customerCode: any;
  isUpdate = false;
  isDelete = false;
  isModifyCreate = false;
  isRejectCreate = false;
  isSendApproveCreate = false;
  isSendApproveUpdate = false;
  isApproveCreate = false;
  isApproveUpdate = false;
  isRejectUpdate = false;
  isModifyUpdate = false;
  actionCode = 'C';
  isApprove = false;
  isModify = false;
  isReject = false;
  isSendApprove = false;
  isShowPopupApprove = false;
  createdBy: any;
  branchCode: any; // chi nhánh của dịch vụ
  statusCif: any;
  tempBtn: any;
  isShowMessage = false;
  objStatusProfile: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private missionService: MissionService,
    private dialog: MatDialog,
    private accountService: AccountService,
    private errorHandler: ErrorHandlerService,
    private notificationService: NotificationService,
    private helpService: HelpsService,
    private authenticationService: AuthenticationService
  ) {
  }
  ngOnInit(): void {
    $('.childName').html('Chi tiết tài khoản');
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // tslint:disable-next-line:prefer-for-o
    this.missionService.setProcessId(this.processId);
    this.getDetailAccountInformation(this.accountId);
  }

  getDetailAccountInformation(accountId): void {
    const body = {
      id: accountId
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/account/account/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.detailAccount = res.item;
            this.branchCode = res.item.branchCode;
            this.processIntegrated = res.processIntegrated;
            this.changeStatusCode = this.detailAccount.changeStatusCode;
            this.currentStatusCode = this.detailAccount.currentStatusCode;
            this.actionCode = this.detailAccount.actionCode;
            this.getRole();
            this.actionButton();
          } else {
            this.errorHandler.showError('Không lấy được thông tin chi tiết tài khoản');
          }
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
  showPopup(param): void {
    this.note = '';
    this.tempBtn = param;
    this.isShowPopupApprove = true;
  }
  close(): void {

  }
  getDetail(event): void {
    this.statusCode = event?.statusCode;
    this.customerCode = event?.customerCode;
    this.createdBy = event?.createdBy;
    this.statusCif = event?.customer.statusCif;
    this.objStatusProfile = event;
    this.getRole();
    this.actionButton();
  }

  approve(): void {
    if (this.processIntegrated) {
      const body = {
        id: this.processIntegrated.id,
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: (this.actionCode === 'C' ? '/process/process/approveCreateAccount' : '/process/process/approveUpdateAccount'),
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.getDetailAccountInformation(this.accountId);
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

  reject(): void {
    if (this.processIntegrated) {
      const body = {
        id: this.processIntegrated.id,
        note: this.note,
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: (this.actionCode === 'C' ? '/process/process/sendRejectCreateAccount' : '/process/process/sendRejectUpdateAccount'),
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.getDetailAccountInformation(this.accountId);
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
    if (this.processIntegrated) {
      const body = {
        id: this.processIntegrated.id,
        note: this.note
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: (this.actionCode === 'C' ? '/process/process/sendModifyCreateAccount' : '/process/process/sendModifyUpdateAccount'),
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.getDetailAccountInformation(this.accountId);
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

  backPage(): void {
    this.location.back();
  }
  /**
   *  kiểm tra hồ sơ ấy có phải là người tạo hay ko
   */
  checkEditable(): void {
    const body = {
      processId: this.processId,
      customerCode: this.customerCode
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
              this.router.navigate(['./smart-form/manager/updateAccount', { processId: this.processId, id: this.accountId }]);
            } else {
              this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }
  createAccount(): void {
    this.router.navigate(['./smart-form/manager/createAccount', { processId: this.processId }]);
  }

  updateAccount(): void {
    if (this.customerCode) {
      this.checkEditable();
    } else {
      this.router.navigate(['./smart-form/manager/updateAccount', { processId: this.processId, id: this.accountId }]);
    }
  }
  // role phân quyền vơi user
  getRole(): void {
    this.disableAllBtn();
    this.isUpdate = this.authenticationService.isPermission(PermissionConst.TAI_KHOAN.UPDATE);
    this.isSendApproveCreate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_ACCOUNT);
    this.isSendApproveUpdate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_UPDATE_ACCOUNT);
    this.isDelete = this.authenticationService.isPermission(PermissionConst.TAI_KHOAN.DELETE);
    this.isApproveCreate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.APPROVE_CREATE_ACCOUNT);
    this.isApproveUpdate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.APPROVE_UPDATE_ACCOUNT);
    this.isRejectCreate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_REJECT_CREATE_ACCOUNT);
    this.isModifyCreate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_MODIFY_CREATE_ACCOUNT);
    this.isRejectUpdate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_REJECT_UPDATE_ACCOUNT);
    this.isModifyUpdate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_MODIFY_UPDATE_ACCOUNT);
    // tslint:disable-next-line:prefer-for-of
  }
  // check url cập nhập hay là tạo mới
  checkUrlUser(): void {
    this.isSendApprove = (this.actionCode === 'C' ? this.isSendApproveCreate : this.isSendApproveUpdate);
    this.isApprove = (this.actionCode === 'C' ? this.isApproveCreate : this.isApproveUpdate);
    this.isReject = (this.actionCode === 'C' ? this.isRejectCreate : this.isRejectUpdate);
    this.isModify = (this.actionCode === 'C' ? this.isModifyCreate : this.isModifyUpdate);
  }
  disableAllBtn(): void {
    this.isSendApprove = this.isApprove = this.isReject = this.isModify = this.isDelete = this.isUpdate = this.isShowMessage = false;
  }
  checkActionButton(): void {
    this.checkUrlUser();
    if (this.processIntegrated) {
      const statusAcc = this.processIntegrated.statusCode;
      // khởi tạo các nút ban đầu hiện thỉ
      if (statusAcc === this.docStatus.EDIT || statusAcc === this.docStatus.MODIFY ||
        statusAcc === this.docStatus.TEMP || statusAcc === this.docStatus.WAIT) {
        this.isUpdate = this.isUpdate ? true : false;
        this.isSendApprove = this.isSendApprove ? true : false;
        this.isDelete = this.isDelete ? true : false;
      }
      // nếu là  chờ duyệt thì ẩn chờ duyệt
      if (statusAcc === this.docStatus.WAIT) {
        this.isSendApprove = false;
      }
      // check không phải hiện hữu thì được xóa
      if (this.currentStatusCode === 'NEW' && this.changeStatusCode === null) {
        this.isDelete = this.isDelete ? true : false;
      }
      // nếu là hiện hữu thì không được xóa
      if (this.currentStatusCode === 'ACTIVE') {
        this.isDelete = false;
      }
      // search về hiện hữu
      if (this.currentStatusCode === 'ACTIVE' && this.changeStatusCode === 'ACTIVE') {
        this.isUpdate = this.isUpdate ? true : false;
      }
      // tạo mới duyệt thành công hiện tại
      // tslint:disable-next-line:max-line-length
      if ((this.currentStatusCode === 'NEW' && this.changeStatusCode === 'ACTIVE') || statusAcc === this.docStatus.REJECT || statusAcc === this.docStatus.APPROVED) {
        // show thông báo nếu không phải là kiểm soát viên
        this.disableAllBtn();
      }
      if (statusAcc === this.docStatus.MODIFY) {
        this.isSendApprove = this.isModify = this.isApprove = this.isReject = false;
      }
    } else {
      // khi search về processIntegrated là null
      if (this.currentStatusCode === 'ACTIVE') {
        this.isDelete = false;
        this.isSendApprove = false;
        this.isUpdate = this.isUpdate ? true : false;
      }
    }
  }

  actionButton(): void {
    // trang thái đóng hoặc là bị đánh dấu
    if (this.statusCif !== 'C' && this.statusCif !== 'Y') {
      // check hiển thỉ các nút sau khi click
      this.checkActionButton();
      // hoạt động hiển thỉ các nút đối vơi hồ sơ pedding
      this.checkProfilePending();
    } else {
      this.disableAllBtn();
    }
  }
  /**
   *  trường hợp vơi kiểm soát viên có quyền duyệt
   */
  showBtnApprove(): void {
    // nếu như khác chi nhánh hoặc chưa sinh dịch vụ với hồ sơ pending
    // tslint:disable-next-line:no-bitwise
    if ((this.objStatusProfile.branchCode && this.objStatusProfile.branchCode !== this.userInfo.branchCode)
      || (this.processIntegrated && this.processIntegrated.statusCode !== 'W')) {
      this.isApprove = this.isReject = this.isModify = false;
    } else {
      // cùng chi nhánh
      this.isApprove = this.isApprove ? true : false;
      this.isModify = this.isModify ? true : false;
      this.isReject = this.isReject ? true : false;
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
      if (this.isApprove) {
        this.isShowMessage = false;
      } else {
        this.isShowMessage = this.isShowMessage ? true : false;
      }
      this.showBtnApprove();
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
        // this.isUpdate = this.isUpdate ? true : false;
        this.isUpdate = true;
        if (this.branchCode !== this.userInfo.branchCode) {
          this.isSendApprove = false;
        } else {
          this.isSendApprove = this.isSendApprove ? true : false;
        }
      }
    }
  }

  confimSendApproveProcess(evt): void {
    switch (evt) {
      case 'CANCEL':
        this.isShowPopupSendApprove = false;
        break;
      case 'CONFIRM':
        this.sendApiApproveUpdateAccount();
    }
  }
  sendApprove(): void {
    this.isShowPopupSendApprove = true;
  }
  /**
   * api xử lý gửi duyệt tài khoản
   */
  sendApiApproveUpdateAccount(): void {
    if (this.processIntegrated !== null) {
      const body = {
        note: this.note,
        id: this.processIntegrated.id,
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: (this.actionCode !== 'C' ? '/process/process/sendApproveUpdateAccount' : '/process/process/sendApproveCreateAccount'),
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.notificationService.showSuccess('Gửi duyệt tài khoản thành công', 'Thành công');
              this.getDetailAccountInformation(this.accountId);
            } else {
              this.notificationService.showError('Gửi duyệt tài khoản thất bại', 'Thất bại');
            }
            this.isShowPopupSendApprove = false;
          }
        }
      );
    } else {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
    }
  }

  deleteAccount(): void {
    const item = {
      code: '',
      number: 0
    };
    item.number = 14;
    item.code = '';
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirmDeleteAccount(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.delete(this.accountId);
      }
    }
    );
  }

  delete(accountId): any {
    return this.accountService.deleteAccount({ id: accountId }).subscribe(
      data => {
        if (data.responseStatus) {
          this.response = data.responseStatus;
        }
      },
      error => this.errorHandler.showError(error)
      , () => {
        if (this.response) {
          this.errorHandler.messageHandler(this.response, 'Xóa tài khoản thành công');
          if (this.response.success === true) {
            this.router.navigate(['./smart-form/manager/account', { processId: this.processId }]);
          }
        }
      }
    );
  }
}
