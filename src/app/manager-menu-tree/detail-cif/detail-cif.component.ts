import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { docStatus } from 'src/app/shared/models/documents';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { PermissionConst } from '../../_utils/PermissionConst';
declare var $: any;

@Component({
  selector: 'app-detail-cif',
  templateUrl: './detail-cif.component.html',
  styleUrls: ['./detail-cif.component.scss']
})
export class DetailCifComponent implements OnInit {
  readonly docStatus = docStatus;
  processId = '';
  // biến bật tắt popup
  isMis = false;
  isUdf = false;
  isReference = false;
  isLegal = false;
  isCoOwner = false;
  isGuardian = false;
  isShowPopupSendApprove = false;
  isShowConfirmPopupDelete = false;
  // biến phân quyền giao dịch viên
  isDelete = false;
  isSendApprove = false;
  isUpdate = false;
  // biến phân quyền kiểm soát viên
  isModify = false;
  isReject = false;
  isApprove = false;
  // biến hứng dữ liệu trả ra từ api
  objCifDetail: any;
  objPerson: any;
  objMis: any;
  objUdf: any;
  objCifLienQuan: any;
  objCustomerOwnerBenefit: any;
  objGuardian: any;
  objLegal: any;
  cifLienQuan = [];
  customerOwnerBenefit = [];
  guardianList = [];
  legalList = [];
  msgReference = '';
  msgGuardian = '';
  msgOwnerBenefit = '';
  msgLegal = '';
  tempBtn = '';
  inEffectReference = false;
  inEffectGudian = false;
  // biến gửbii Duyệt
  note;
  customerId = '';
  approveTypeCode;
  // biến check quyền
  roleLogin: any = [];
  statusCode;
  readonly btnButton = {
    MODIFY: 'MODIFY',
    APPROVE: 'APPROVE',
    REQUEST_ADD: 'REQUEST_ADD',
    REJECT: 'REJECT'
  };
  isShowPopupApprove = false;
  userInfo: any = {};
  objItem: any;
  customerCode: any;
  personObjLegal: any;
  actionCode: any;
  isShowMessage = false;
  isProcessIntegrated = false;

  constructor(
    private helpService: HelpsService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private _LOCATION: Location,
    private missionService: MissionService,
    private authenticationService: AuthenticationService
  ) {
    this.route.paramMap.subscribe(params => {
      this.processId = params.get('processId');
    });

  }

  ngOnInit(): void {
    $('.childName').html('Khách hàng');
    this.getDetailCif();
  }
  /**
   * bật tắt popup
   */
  showMis(): void { this.isMis = true; }
  showUdf(): void { this.isUdf = true; }
  showReference(): void { this.isReference = true; }
  showLegal(): void { this.isLegal = true; }
  showCoOwner(): void { this.isCoOwner = true; }
  showGuardian(): void { this.isGuardian = true; }
  closeMis(): void { this.isMis = false; }
  closeUdf(): void { this.isUdf = false; }
  closeReference(): void { this.isReference = false; }
  closeLegal(): void { this.isLegal = false; }
  closeCoOwner(): void { this.isCoOwner = false; }
  closeGuardian(): void { this.isGuardian = false; }
  /**
   * lấy chi tiết cif
   */
  getDetailCif(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
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
            this.missionService.setProcessId(this.processId);
            this.objItem = res.item;
            this.objCifDetail = res.item.customer;
            this.objPerson = res.item.customer.person;
            this.objMis = res.item.customer.mis;
            this.objUdf = res.item.customer.udf;
            this.cifLienQuan = res.item.customer.cifLienQuan;
            this.customerOwnerBenefit = res.item.customer.customerOwnerBenefit;
            this.guardianList = res.item.customer.guardianList;
            this.legalList = res.item.customer.legalList;
            this.objCifLienQuan = res.item.customer.cifLienQuan.length >= 0 ? res.item.customer.cifLienQuan[0] : '';
            // tslint:disable-next-line:max-line-length
            this.objCustomerOwnerBenefit = res.item.customer.customerOwnerBenefit.length >= 0 ? res.item.customer.customerOwnerBenefit[0] : '';
            this.objGuardian = res.item.customer.guardianList.length >= 0 ? res.item.customer.guardianList[0] : '';
            // tslint:disable-next-line:max-line-length
            this.personObjLegal = res.item.customer.legalList.length >= 0 ? res.item.customer?.legalList[0]?.customerList[0] : '';
            this.objLegal = res.item.customer.legalList.length >= 0 ? res.item.customer.legalList[0] : '';
            this.actionCode = res.item.customer.actionCode;
            // this.personObjLegal = res.item.customer.legalList[0] ? res.item.customer.legalList[0].customerList[0] : '';
            this.approveTypeCode = this.actionCode === 'C' ? 'OPEN_CIF' : 'UPDATE_CIF';
            this.customerId = res.item.customer.id;
            this.statusCode = res.item.statusCode;
            this.inEffectGudian = this.objGuardian?.inEffect;
            this.inEffectReference = this.objCifLienQuan?.inEffect;
            this.customerCode = res.item.customerCode;
            if (this.actionCode) {
              this.sendApiIntegrated();
            } else {
              this.getRole();
              this.actionButton();
            }
            this.initMsgInfoData();
          }
        }
      }
    );
  }
  /**
   *  kiểm tra user ấy có phải là người tạo hay ko
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
              this.getDetailStatusCode();
            } else {
              this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }

  // tslint:disable-next-line:ban-types
  initMsgInfoData(): void {
    const msg = 'Chưa có dữ liệu nhập vào.';
    this.msgGuardian = this.msgLegal = this.msgOwnerBenefit = this.msgReference = msg;
    if (this.cifLienQuan.length > 0) {
      this.msgReference = '';
    }
    if (this.customerOwnerBenefit.length > 0) {
      this.msgOwnerBenefit = '';
    }
    if (this.guardianList.length > 0) {
      this.msgGuardian = '';
    }
    if (this.legalList.length > 0) {
      this.msgLegal = '';
    }
  }
  /**
   * xem từng phần tử trong bảng
   */
  getObjectCifLienQuan(evt): void { this.objCifLienQuan = evt; }
  getObjectCustomerOwnerBenefit(evt): void { this.objCustomerOwnerBenefit = evt; }
  getObjectGuard(evt): void { this.objGuardian = evt; }
  getObjectLegal(evt): void { this.objLegal = evt; }
  getPerson(evt): void { this.personObjLegal = evt; }

  // hàm xử lý phân quyền
  getRole(): void {
    this.disableBtnAll();
    this.isUpdate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.UPDATE);
    this.isSendApprove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_ONE);
    this.isDelete = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.DELETE_SERVICE);
    this.isApprove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.APPROVE_ONE);
    this.isReject = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_REJECT_ONE);
    this.isModify = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_MODIFY_ONE);
  }

  disableBtnAll(): void {
    this.isSendApprove = this.isUpdate = this.isDelete = this.isApprove = this.isReject = this.isModify = false;
  }
  showPopup(params): void {
    this.tempBtn = params;
    this.note = '';
    if (this.tempBtn === this.btnButton.APPROVE) {
      this.isShowPopupApprove = false;
      this.sendApicommon();
    } else {
      this.isShowPopupApprove = true;
    }
  }
  /**
   * Lấy trạng thái dịch vụ
   */
  sendApiIntegrated(): void {
    const body = {
      dwItemId: this.customerId,
      typeCode: this.approveTypeCode
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/processIntegrated/id',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            const intergrateItem = res.items.find(obj => obj.typeCode === 'UPDATE_CIF');
            if (intergrateItem) {
              this.isProcessIntegrated = intergrateItem.statusCode === 'W' ? true : false;
            } else {
              this.isProcessIntegrated = false;
            }
            this.statusCode = res.items[0].statusCode;
            this.getRole();
            this.actionButton();
          } else {
            this.isProcessIntegrated = false;
          }
        }
      }
    );
  }
  /**
   * api tích hợp gửi duyêt, tù chối, chờ bổ sung
   */
  sendApicommon(): void {
    const body = {
      dwItemId: this.customerId,
      typeCode: this.approveTypeCode
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/processIntegrated/id',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            const id = res.items[0].id;
            switch (this.tempBtn) {
              case this.btnButton.REQUEST_ADD:
                this.sendModifyOne(id);
                break;
              case this.btnButton.REJECT:
                this.sendRejectOne(id);
                break;
              case this.btnButton.APPROVE:
                this.approveOne(id);
                break;
              default:
                break;
            }
          }
        }
      }
    );
  }
  /**
   * api chờ bổ sung
   */
  sendModifyOne(id): void {
    const body = {
      id,
      note: this.note
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendModifyOne',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.getDetailCif();
            this.notificationService.showSuccess('Duyệt dịch vụ thành công', 'Thành công');
          } else {
            this.notificationService.showError('Duyệt dịch vụ thất bại', 'Thất bại');
          }
          this.isShowPopupApprove = false;
        }
      }
    );
  }

  /**
   * api từ chối
   */
  sendRejectOne(id): void {
    const body = {
      id,
      note: this.note
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendRejectOne',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.getDetailCif();
            this.notificationService.showSuccess('Từ chối dịch vụ thành công', 'Thành công');
          } else {
            this.notificationService.showError('Từ chối dịch vụ thất bại', 'Thất bại');
          }
          this.isShowPopupApprove = false;
        }
      }
    );
  }
  /**
   * api duyệt
   */
  approveOne(id): void {
    const body = {
      id
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/approveOne',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Duyệt dịch vụ thành công', 'Thành công');
            this.getDetailCif();
          } else {
            this.notificationService.showError('Duyệt dịch vụ thất bại', 'Thất bại');
          }
        }
      }
    );
  }
  /**
   * api gửi duyệt dịch vụ
   */
  sendApproveOne(): void {
    const body = {
      note: this.note,
      id: this.objCifDetail.id,
      typeCode: this.approveTypeCode
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendApproveOne',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Gửi duyệt dịch vụ thành công', 'Thành công');
            this.getDetailCif();
          } else {
            this.notificationService.showError('Gửi duyệt dịch vụ thất bại', 'Thất bại');
          }
          this.isShowPopupSendApprove = false;
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
        this.sendApicommon();
        this.isShowPopupApprove = false;
    }
  }

  confimSendApproveProcess(evt): void {
    switch (evt) {
      case 'CANCEL':
        this.isShowPopupSendApprove = false;
        break;
      case 'CONFIRM':
        this.sendApproveOne();
    }
  }
  sendApprove(): void {
    this.isShowPopupSendApprove = true;
  }
  backPage(): void {
    this._LOCATION.back();
  }

  apiLockService(): void {
    const body = {
      id: this.customerId,
      typeCode: this.approveTypeCode
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/lockService',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.router.navigate(['/smart-form/manager/fileProcessed/' + this.processId + '/update/']);
          } else {
            this.notificationService.showError('Cập nhập thông tin thất bại', 'Thất bại');
          }
        }
      }
    );
  }

  apiDelete(): void {
    const body = {
      id: this.processId,
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/delete',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Xóa hồ sơ thành công', 'Thành công');
            this.router.navigate(['./smart-form/fileProcessed']);
          } else {
            this.notificationService.showError('Xóa hồ sơ thất bại', 'Thất bại');
          }
          this.isShowConfirmPopupDelete = false;
        }
      }
    );
  }
  confirmDeteteProcess(evt): void {
    switch (evt) {
      case 'YES':
        this.apiDelete();
        this.isShowConfirmPopupDelete = false;
        break;
      case 'NO':
        this.isShowConfirmPopupDelete = false;
        break;
    }
  }
  doDelete(): void { this.isShowConfirmPopupDelete = true; }
  // hoạt động của uniform
  checkActionButton(): void {
    // check trạng thái thuộc - Đã lưu - Chờ duyệt - Chờ bổ sung- khởi tạo
    if (this.statusCode === this.docStatus.EDIT ||
      this.statusCode === this.docStatus.MODIFY ||
      this.statusCode === this.docStatus.WAIT ||
      this.statusCode === this.docStatus.VIEW ||
      this.statusCode === this.docStatus.TEMP) {
      // show cập nhập thông tin
      this.isUpdate = this.isUpdate ? true : false;
      this.isSendApprove = this.isSendApprove ? true : false;
      this.isDelete = this.isDelete ? true : false;
      //  nếu là duyệt , chờ bổ sung, từ chối => ẩn button gửi duyêt, xóa, cập nhập thông tin
      if (this.isApprove || this.isModify || this.isReject) {
        this.isUpdate = this.isSendApprove = this.isDelete = false;
      }
    }
    if (this.statusCode === this.docStatus.WAIT) {
      // ẩn gửi duyệt
      this.isSendApprove = false;
    }
    // nếu ko hiện hữu
    if (!this.customerCode) {
      // nếu ko hiện hữu => có thể xóa
      this.isDelete = this.isDelete ? true : false;
      // nếu trạng thái là từ chối hoặc đóng
      // tslint:disable-next-line:max-line-length
      if (this.statusCode === this.docStatus.REJECT
        || this.statusCode === this.docStatus.CANCEL
        || this.statusCode === this.docStatus.DELETED) {
        // hidden  button xóa
        this.isDelete = false;
      }
    } else {
      // nếu hiện hữu => ko được xóa
      this.isDelete = false;
      if (this.statusCode === this.docStatus.EDIT) {
        this.isSendApprove = this.isSendApprove ? true : false;
      } else {
        // ẩn phê duyệt tại detail
        this.isSendApprove = false;
      }
    }
    // nếu là  đã duyêt, từ chối => ẩn button duyêt, chờ bổ sung, từ chối
    if (this.statusCode === this.docStatus.REJECT
      || this.statusCode === this.docStatus.APPROVED
      || this.statusCode === this.docStatus.SUCCESS) {
      this.isApprove = this.isReject = this.isModify = false;
    }
  }

  actionButton(): void {
    // cif đã đanh dấu và đóng
    if (this.objCifDetail.statusCif !== 'C' && this.objCifDetail.statusCif !== 'Y') {
      // check hiển thỉ các nút sau khi click
      this.checkActionButton();
      // hoạt động hiển thỉ các nút đối vơi hồ sơ pedding
      this.checkProfilePending();
    } else {
      this.disableBtnAll();
    }
  }

  checkProfilePending(): void {
    // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
    // tslint:disable-next-line:max-line-length
    if ((this.statusCode === docStatus.EDIT
      || this.statusCode === docStatus.WAIT
      || this.statusCode === docStatus.TEMP
      || this.statusCode === docStatus.MODIFY) && this.objItem.createdBy !== this.userInfo.userId) {
      // nếu là khác người tạo thì ẩn hết các nút  duyệt, xóa , cập nhập thông tin
      this.isDelete = this.isSendApprove = this.isUpdate = false;
      // show thông báo vơi hồ sơ pedding nhưng bị thao tác vơi giao dịch viên khác
      // check nếu là kiểm soát viên => không show thông báo
      if (this.isApprove) {
        this.isShowMessage = false;
      } else {
        this.isShowMessage = true;
      }
      this.showBtnApprove();
    } else {
      //  trong hồ sơ  không pending check 2 trường hợp
      // 1. nếu là đã duyệt và từ chối thì ẩn hết button
      // 2. nếu ko phải thì check tới chi nhánh của dịch vụ
      if (this.statusCode === docStatus.APPROVED
        || this.statusCode === docStatus.SUCCESS
        || this.statusCode === docStatus.REJECT) {
        this.disableBtnAll();
      } else {
        // nếu như không phải pendding thì check chi nhánh của dịch vụ
        // nếu khác chi nhanh => show cập nhập thông tin, không gửi duyệt, ko xóa
        if (this.objItem.customer.branchCode !== this.userInfo.branchCode) {
          this.showBtnUpdate();
        }
      }
    }
  }
  /**
   *  trường hợp vơi kiểm soát viên có quyền duyệt
   */
  showBtnApprove(): void {
    // nếu như khác chi nhánh hoặc chưa sinh dịch vụ với hồ sơ pending
    if ((this.objItem.branchCode !== this.userInfo.branchCode) || !this.isProcessIntegrated) {
      this.isApprove = this.isReject = this.isModify = false;
    } else {
      // cùng chi nhánh
      this.isApprove = this.isApprove ? true : false;
      this.isModify = this.isModify ? true : false;
      this.isReject = this.isReject ? true : false;
    }
  }
  showBtnUpdate(): void {
    this.isDelete = false;
    this.isSendApprove = false;
    this.isUpdate = this.isUpdate ? true : false;
  }

  getDetailStatusCode(): void {
    if (this.actionCode) {
      const body = {
        dwItemId: this.customerId,
        typeCode: this.approveTypeCode
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/processIntegrated/id',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.statusCode = res.items[0].statusCode;
              // tslint:disable-next-line:max-line-length
              if (this.statusCode === this.docStatus.WAIT) {
                this.apiLockService();
              } else {
                if (this.statusCode !== this.docStatus.SUCCESS && this.statusCode !== this.docStatus.APPROVED) {
                  this.router.navigate(['/smart-form/manager/fileProcessed/' + this.processId + '/update/']);
                }
              }
            }
          }
        }
      );
    } else {
      this.router.navigate(['/smart-form/manager/fileProcessed/' + this.processId + '/update/']);
    }
  }
  update(): void {
    if (this.customerCode) {
      // trường hợp hiện hữu
      this.checkEditable();
    } else {
      // trường hợp tạo mới
      this.getDetailStatusCode();
    }
  }
}
