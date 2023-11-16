import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpsService } from '../../../../shared/services/helps.service';
import { MissionService } from '../../../../services/mission.service';
import { HTTPMethod } from '../../../../shared/constants/http-method';
import { Location } from '@angular/common';
import { NotificationService } from '../../../../_toast/notification_service';
import { docStatus } from 'src/app/shared/models/documents';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
import { AuthenticationService } from 'src/app/_services/authentication.service';
declare var $: any;

@Component({
  selector: 'app-account-authority-detail',
  templateUrl: './account-authority-detail.component.html',
  styleUrls: ['./account-authority-detail.component.scss']
})
export class AccountAuthorityDetailComponent implements OnInit {

  readonly docStatus = docStatus;

  isShowSendPopupApprove = false;
  customerInfo: any;
  processId = '';
  accountId = '';
  authorityId = '';
  accountDetail: any;
  authorityDetail: any;
  userInfo: any;
  limitAmount = '';
  freeText = '';
  authorityStatusCode = '';
  isShowPopupApprove = false;
  private readonly typeCodeServiceAuthority = 'PDG';
  changeStatusCode = '';
  currentStatusCode = '';
  roleLogin: any = [];
  isFullRole = false;
  statusCode = '';
  isShowText = false;
  customerCode: any;
  isUpdate = false;
  isDelete = false;
  isSendApprove = false;
  // biến phân quyền kiểm soát viên
  isApprove = false;
  isModify = false;
  isReject = false;
  branchCode: any;
  createdBy: any;
  statusCif: any;
  processIntegrated: any;
  note = '';
  tempBtn: any;
  branchCodeHs: any; // chi nhánh của hồ sơ

  readonly btnButton = {
    MODIFY: 'MODIFY',
    APPROVE: 'APPROVE',
    REQUEST_ADD: 'REQUEST_ADD',
    REJECT: 'REJECT'
  };

  constructor(
    private route: ActivatedRoute,
    private helpService: HelpsService,
    private missionService: MissionService,
    private location: Location,
    private router: Router,
    private notificationService: NotificationService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    $('.childName').html('Chi tiết ủy quyền');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getProcessIdFromUrl();
    this.getAccountDetail();
  }

  getRole(): void {
    this.disableBtnAll();
    this.isUpdate = this.authenticationService.isPermission(PermissionConst.TK_UY_QUYEN.UPDATE);
    this.isSendApprove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_AUTHOR);
    this.isDelete = this.authenticationService.isPermission(PermissionConst.TK_UY_QUYEN.DELETE);
    this.isApprove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.APPROVE_CREATE_AUTHOR);
    this.isReject = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_REJECT_CREATE_AUTHOR);
    this.isModify = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_MODIFY_CREATE_AUTHOR);
  }

  disableBtnAll(): void {
    this.isSendApprove = this.isUpdate = this.isDelete = this.isApprove = this.isReject = this.isModify = false;
  }

  getProcessIdFromUrl(): void {
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.missionService.setProcessId(this.processId);
  }
  checkActionButton(): void {
    if (this.authorityDetail.processIntegrated) {
      const stattusAuthority = this.authorityDetail.processIntegrated.statusCode;
      // check trạng thái thuộc - Đã lưu - Chờ duyệt - Chờ bổ sung - Đã duyệt
      if (stattusAuthority === this.docStatus.EDIT || stattusAuthority === this.docStatus.MODIFY ||
        stattusAuthority === this.docStatus.TEMP || stattusAuthority === this.docStatus.WAIT) {
        // show cập nhập thông tin
        this.isUpdate = this.isUpdate ? true : false;
        this.isSendApprove = this.isSendApprove ? true : false;
        this.isDelete = this.isDelete ? true : false;
      }
      if (stattusAuthority === this.docStatus.WAIT) {
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
      if ((this.currentStatusCode === 'NEW' && this.changeStatusCode === 'ACTIVE') || stattusAuthority === this.docStatus.APPROVED || stattusAuthority === this.docStatus.REJECT) {
        this.disableBtnAll();
      }
      if (stattusAuthority === this.docStatus.MODIFY) {
        this.isSendApprove = this.isApprove = this.isModify = this.isReject = false;
      }
    } else {
      if (this.currentStatusCode === 'ACTIVE') {
        this.isDelete = false;
        this.isSendApprove = false;
        this.isUpdate = this.isUpdate ? true : false;
      }
    }
  }

  modify(): void {
    if (this.authorityDetail.processIntegrated) {
      const body = {
        id: this.authorityDetail.processIntegrated.id,
        note: this.note
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/sendModifyCreateAuthor',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.getDetailAuthority();
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
    if (this.authorityDetail.processIntegrated) {
      const body = {
        id: this.authorityDetail.processIntegrated.id,
        note: this.note
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/sendRejectCreateAuthor',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.getDetailAuthority();
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
    if (this.authorityDetail.processIntegrated) {
      const body = {
        id: this.authorityDetail.processIntegrated.id
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/approveCreateAuthor',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.getDetailAuthority();
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

  actionButton(): void {
    // nếu hồ sơ đóng hoặc là cif đánh dấu
    if (this.statusCif !== 'Y' && this.statusCif !== 'C') {
      this.checkActionButton();
      this.checkProfilePending();
    } else {
      this.disableBtnAll();
    }
  }

  checkProfilePending(): void {
    // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
    // tslint:disable-next-line:max-line-length
    if (this.statusCode && (this.statusCode === docStatus.EDIT
      || this.statusCode === docStatus.WAIT
      || this.statusCode === docStatus.TEMP
      || this.statusCode === this.docStatus.MODIFY) && this.createdBy !== this.userInfo.userId) {
      // nếu là khác người tạo thì ẩn hết các nút  duyệt, xóa , cập nhập thông tin
      this.isDelete = this.isSendApprove = this.isUpdate = false;
      this.showBtnApprove();
    } else {
      //  trong hồ sơ  không pending check 2 trường hợp
      // 1. nếu là đã duyệt và từ chối thì ẩn hết button
      // 2. nếu ko phải thì check tới chi nhánh của dịch vụ
      // tslint:disable-next-line:curly
      if (this.statusCode && this.authorityDetail.processIntegrated && (this.statusCode === docStatus.APPROVED
        || this.statusCode === docStatus.SUCCESS
        // tslint:disable-next-line:semicolon
        || this.statusCode === docStatus.REJECT || this.authorityDetail.processIntegrated.statusCode === docStatus.APPROVED)) {
        this.disableBtnAll();
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
    if ((this.branchCodeHs !== this.userInfo.branchCode)
      || (this.authorityDetail.processIntegrated && this.authorityDetail.processIntegrated.statusCode !== 'W')) {
      this.isApprove = this.isReject = this.isModify = false;
    } else {
      // cùng chi nhánh
      this.isApprove = this.isApprove ? true : false;
      this.isModify = this.isModify ? true : false;
      this.isReject = this.isReject ? true : false;
    }
  }
  getAccountDetail(): void {
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    if (this.accountId !== '') {
      const body = { id: this.accountId };
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/account/account/detail',
          data: body,
          progress: false,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.accountDetail = res.item;
              this.branchCode = res.item.branchCode;
              this.getDetailAuthority();
            }
          }
        }
      );
    }
  }

  getProcessDetail(): void {
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
          // Nếu có res (có giá trị response BE trả về và success === true)
          if (res && res.responseStatus.success) {
            this.customerInfo = res.item.customer;
            this.statusCode = res.item.statusCode;
            this.customerCode = res.item.customerCode;
            this.createdBy = res.item.createdBy;
            this.statusCif = res.item.customer.statusCif;
            this.branchCodeHs = res.item.branchCode; // chi nhánh của hồ sơ
            this.getRole();
            this.actionButton();
          }
        }
      }
    );
  }

  getDetailAuthority(): void {
    this.authorityId = this.route.snapshot.paramMap.get('id');
    if (this.authorityId !== '') {
      const body = { id: this.authorityId };
      this.helpService.callApi({
        method: HTTPMethod.POST,
        url: '/account/accountAuthor/detail',
        data: body,
        process: false,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.authorityDetail = res.item;
            if (this.authorityDetail) {

              this.changeStatusCode = this.authorityDetail.changeStatusCode;
              this.currentStatusCode = this.authorityDetail.currentStatusCode;
              this.processIntegrated = this.authorityDetail.processIntegrated;
              this.getProcessDetail();
              if (this.authorityDetail.authorTypes.length > 0) {
                this.authorityDetail.authorTypes.forEach(el => {
                  if (el.authorTypeCode === 'ALL' || el.authorTypeCode === 'DEPOSIT_AND_WITHDRAW') {
                    this.limitAmount = el.limitAmount ? el.limitAmount : '';
                  }
                  if (el.authorTypeCode === 'OTHER') {
                    this.isShowText = true;
                    this.freeText = el.authorTypeFreeText;
                  }
                });

              }

            }
          }
        }
      });
    }
  }

  updateAuthority(): void {
    this.router.navigate(['./smart-form/manager/updateAuthority',
      { processId: this.processId, accountId: this.accountId, id: this.authorityId }]);
  }

  backPage(): void {
    this.location.back();
  }

  actionApprove(): void {
    const bodySendApprove = {
      note: this.note,
      typeCode: this.typeCodeServiceAuthority,
      id: this.authorityDetail.id
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendApproveCreateAuthor',
        data: bodySendApprove,
        progress: true,
        success: (resApprove) => {
          if (resApprove && resApprove.responseStatus.success) {
            this.notificationService.showSuccess('Gửi duyệt Ủy quyền thành công', 'Thành công');
            this.getDetailAuthority();
          } else {
            this.notificationService.showError('Gửi duyệt Ủy quyền thất bại', 'Thất bại');
          }
          this.isShowSendPopupApprove = false;
        }
      }
    );
  }

  showPopup(param): void {
    this.note = '';
    this.tempBtn = param;
    this.isShowPopupApprove = true;
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

  submitApprove(): void {
    if (this.customerCode) {
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
                this.actionApprove();
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.actionApprove();
    }
  }

  deleteAuthority(): void {
    const bodyDelete = {
      id: this.authorityDetail.id
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/account/accountAuthor/delete',
        data: bodyDelete,
        progress: true,
        success: (resApprove) => {
          if (resApprove && resApprove.responseStatus.success) {
            this.notificationService.showSuccess('Xóa Ủy quyền thành công', 'Thành công');
            // tslint:disable-next-line:max-line-length
            this.router.navigate(['./smart-form/manager/authority',
              { processId: this.processId, id: this.accountId }]);
          } else {
            this.notificationService.showError('Xóa Ủy quyền thất bại', 'Thất bại');
          }
        }
      }
    );
  }
}


