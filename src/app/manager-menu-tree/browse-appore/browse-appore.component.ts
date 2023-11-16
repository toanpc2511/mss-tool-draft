import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { docStatus } from 'src/app/shared/models/documents';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { RegistrableService } from 'src/app/_models/registrable-service';
import { ResponseStatus } from 'src/app/_models/response';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { NotificationService } from 'src/app/_toast/notification_service';
import { GlobalConstant } from 'src/app/_utils/GlobalConstant';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { SendModifyOneComponent } from '../service-browsing/pop-up/send-modify-one/send-modify-one.component';
import { SendRejectOneComponent } from '../service-browsing/pop-up/send-reject-one/send-reject-one.component';
import { Location } from '@angular/common';
import { MissionService } from 'src/app/services/mission.service';
declare var $: any;

@Component({
  selector: 'app-browse-appore',
  templateUrl: './browse-appore.component.html',
  styleUrls: ['./browse-appore.component.scss']
})
export class BrowseApporeComponent implements OnInit {

  SERVICE_NAME = GlobalConstant.SERVICE_NAME;
  readonly docStatus = docStatus;
  processId: any;
  tableDetail: any;
  processDetail: any;
  isCustomer = false;
  tabIndex = 1;
  listSaved = [];
  listPending = [];
  listWaiting = [];
  listApproved = [];
  listRefuse = [];
  userId: string;
  listPendingCount: any;
  listSavedCount: any;
  listWaitingCount: any;
  listRefuseCount: any;
  response: ResponseStatus;
  listApprovedCount: any;
  isCustomerSelect = '';
  customerCode = '';
  isShowPopup = false;
  isHidden = false;
  accountId: any;
  note = '';
  isAuthority = false;
  authorityId: any;
  isAccount = false;
  isAttachment = false;
  attachmentId: any;
  // biến check quyền
  roleLogin: any = [];
  isKSV: boolean;
  isGDV: boolean;
  readonly btnButton = {
    MODIFY: 'MODIFY',
    APPROVE: 'APPROVE',
    REQUEST_ADD: 'REQUEST_ADD',
    REJECT: 'REJECT',
    CANCEL: 'CANCEL'
  };
  tempBtn = '';
  statusCode = '';
  userInfo: any = {};
  isMainCard = false;
  isSupCard = false;
  cardId: any;
  isAccountOwner = false;
  ownerId: any;
  isSignature = false;
  signatureId = '';
  isLienViet24 = false;
  lienViet24Id: any;

  constructor(
    private route: ActivatedRoute,
    private helpService: HelpsService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private missionService: MissionService,
    private _LOCATION: Location
  ) { }

  ngOnInit(): void {
    $('.childName').html('Duyệt dịch vụ');
    this.getRole();
    this.route.paramMap.subscribe(params => {
      this.processId = params.get('processId');
      this.missionService.setProcessId(this.processId);
      // Nếu có giá trị processId thì mới call function lấy thông tin Khách hàng
      if (this.processId) {
        this.getCustomerInfo(this.processId);
        this.getTableInfo(this.processId);
      }
    });
  }

  showDetailLienViet24(lienViet24Id): void {
    this.isLienViet24 = true;
    this.lienViet24Id = lienViet24Id;
  }

  getRole(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    const length = this.roleLogin.length;
    this.isHidden = true;
    // if (length >= 2) {
    //   this.isGDV = true;
    // } else {
    //   for (let i = 0; i < length; i++) {
    //     if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
    //       this.isGDV = true;
    //     } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
    //       this.isKSV = true;
    //     }
    //   }
    // }
    // if (this.isGDV) {

    //   this.isHidden = false;
    // }
  }
  // disableButton(): void {
  //   this.isHidden = false;
  // }
  checkIndex(num: number): void {
    this.tabIndex = num;
  }

  sendModifyAll(): void {
    if (!this.processId) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    const body = {
      note: this.note,
      id: this.processId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/sendModify',
      data: body,
      progress: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Duyệt hồ sơ thành công', 'Thành công');
        } else {
          this.notificationService.showError('Duyệt hồ sơ thất bại', 'Thất bại');
        }
        this.isHidden = false;
        this.getCustomerInfo(this.processId);
        this.getTableInfo(this.processId);
      }
    });
  }

  showPopup(prams): void {
    this.tempBtn = prams;
    this.note = '';
    if (!this.processId) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
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
            if (res.item.statusCode !== this.docStatus.EDIT) {
              if (this.tempBtn !== this.btnButton.APPROVE && this.tempBtn !== this.btnButton.CANCEL) {
                this.isShowPopup = true;
              } else {
                this.isShowPopup = false;
                if (this.tempBtn === this.btnButton.APPROVE) {
                  this.sendApproveAll();
                } else if (this.tempBtn === this.btnButton.CANCEL) {
                  this.sendCancel();
                }
              }
            } else {
              this.notificationService.showError('Dịch vụ đang bị khóa bởi ' + res.item.inputByUser.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }

  confimApproveProcess(evt): void {
    switch (evt) {
      case 'CANCEL':
        this.isShowPopup = false;
        break;
      case 'CONFIRM':
        switch (this.tempBtn) {
          case this.btnButton.REQUEST_ADD:
            this.sendModifyAll();
            break;
          case this.btnButton.REJECT:
            this.sendRejectAll();
            break;
          default:
            break;
        }
        this.isShowPopup = false;
      // tslint:disable-next-line:no-switch-case-fall-through
      default:
        break;
    }
  }

  sendRejectAll(): void {
    if (!this.processId) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    const body = {
      note: this.note,
      id: this.processId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/sendReject',
      data: body,
      progress: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Duyệt hồ sơ thành công', 'Thành công');
        } else {
          this.notificationService.showError('Duyệt hồ sơ thất bại', 'Thất bại');
        }
        this.isHidden = false;
        this.getCustomerInfo(this.processId);
        this.getTableInfo(this.processId);
      }
    });
  }

  sendApproveAll(): void {
    if (!this.processId) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    const body = {
      id: this.processId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/approveAll',
      data: body,
      progress: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Duyệt hồ sơ thành công', 'Thành công');
        } else {
          this.notificationService.showError('Duyệt hồ sơ thất bại', 'Thất bại');
        }
        this.isHidden = false;
        this.getCustomerInfo(this.processId);
        this.getTableInfo(this.processId);
      }
    });
  }

  getTableInfo(processId: any): void {
    if (!processId) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    const body = {
      processId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/processIntegrated/listAll',
      data: body,
      progress: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.tableDetail = res.items;
          this.processList(this.tableDetail);
        }
      }
    });
  }

  getCustomerInfo(processId: any): void {
    if (!processId) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const body = {
      id: processId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/detail',
      data: body,
      progress: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.processDetail = res.item;
          this.customerCode = res.item.customerCode;
          this.statusCode = res.item.statusCode;
          // tslint:disable-next-line:curly
          if (this.statusCode === this.docStatus.APPROVED ||
            this.statusCode === this.docStatus.SUCCESS ||
            this.statusCode === this.docStatus.REJECT ||
            this.statusCode === this.docStatus.MODIFY ||
            this.statusCode === this.docStatus.CANCEL ||
            this.statusCode === this.docStatus.EDIT) {
            this.isHidden = false;
          }
          if (this.processDetail.branchCode !== this.userInfo.branchCode) {
            this.isHidden = false;
          }
        }
      }
    });
  }
  processList(tableDetail): void {
    // tslint:disable-next-line:no-shadowed-variable
    this.listPending = [];
    this.listSaved = [];
    this.listWaiting = [];
    this.listRefuse = [];
    this.listApproved = [];
    this.listPendingCount = 0;
    this.listSavedCount = 0;
    this.listWaitingCount = 0;
    this.listRefuseCount = 0;
    this.listApprovedCount = 0;
    this.tableDetail.forEach((element) => {
      if (element.statusCode === 'W') {
        this.listPending.push(element);
        this.listPendingCount = this.listPending.length;
      } else if (element.statusCode === 'E') {
        this.listSaved.push(element);
        this.listSavedCount = this.listSaved.length;
      } else if (element.statusCode === 'M') {
        this.listWaiting.push(element);
        this.listWaitingCount = this.listWaiting.length;
      } else if (element.statusCode === 'R') {
        this.listRefuse.push(element);
        this.listRefuseCount = this.listRefuse.length;
      } else if (element.statusCode === 'S') {
        this.listApproved.push(element);
        this.listApprovedCount = this.listApproved.length;
      }
    });
    this.switchTab();
    this.getCustomerInfo(this.processId);
  }

  approvalOneDialog(service: RegistrableService): void {
    if (!this.processId) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
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
            if (res.item.statusCode !== this.docStatus.EDIT) {
              const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm({ number: 8 }));
              dialogRef.afterClosed().subscribe(rs => {
                if (rs === 1) {
                  this.approvalOne(service.id);
                }
              }
              );
            } else {
              this.notificationService.showError('Dịch vụ đang bị khóa bởi ' + res.item.inputByUser.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }

  approvalOne(id: string): void {
    const body = { id };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/approveOne',
      data: body,
      progress: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Duyệt hồ sơ thành công', 'Thành công');
        } else {
          this.notificationService.showError('Duyệt hồ sơ thất bại', 'Thất bại');
        }
        this.getCustomerInfo(this.processId);
        this.getTableInfo(this.processId);
      }
    });
  }

  showDetailAuthority(authorityId): void {
    this.isAuthority = true;
    this.authorityId = authorityId;
  }

  sendRejectOneDialog(service: RegistrableService): void {
    if (!this.processId) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
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
            if (res.item.statusCode !== this.docStatus.EDIT) {
              const dialogRef = this.dialog.open(SendRejectOneComponent, DialogConfig.configDialogConfirm({ number: 27 }));
              dialogRef.afterClosed().subscribe(rs => {
                if (rs.index === 1) {
                  this.sendRejectOne(service.id, rs.note);
                }
              });
            } else {
              this.notificationService.showError('Dịch vụ đang bị khóa bởi ' + res.item.inputByUser.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }

  sendRejectOne(id: string, note?: string): void {
    const body: any = {
      id,
      note
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/sendRejectOne',
      data: body,
      progress: false,
      success: (res) => {
        // console.log(res);
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Duyệt hồ sơ thành công', 'Thành công');
        } else {
          this.notificationService.showError('Duyệt hồ sơ thất bại', 'Thất bại');
        }
        this.getCustomerInfo(this.processId);
        this.getTableInfo(this.processId);
      }
    });
  }

  switchTab(): void {
    if (this.listPending.length === 0 && this.listWaiting.length === 0 && this.listApproved.length === 0 && this.listRefuse.length !== 0) {
      this.tabIndex = 4;
    } else if (this.listWaiting.length !== 0 && this.listPending.length === 0) {
      this.tabIndex = 2;
    } else if (this.listWaiting.length === 0 && this.listPending.length === 0 && this.listApproved.length !== 0) {
      this.tabIndex = 3;
    } else {
      this.tabIndex = 1;
    }
  }

  sendModifyOneDialog(service: RegistrableService): void {
    if (!this.processId) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
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
            if (res.item.statusCode !== this.docStatus.EDIT) {
              const dialogRef = this.dialog.open(SendModifyOneComponent, DialogConfig.configDialogConfirm({ number: 28 }));
              dialogRef.afterClosed().subscribe(rs => {
                if (rs.index === 1) {
                  this.sendModifyOne(service.id, rs.note);
                }
              });
            } else {
              this.notificationService.showError('Dịch vụ đang bị khóa bởi ' + res.item.inputByUser.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }

  sendModifyOne(id: string, note: string): void {
    const body: any = {
      id,
      note
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/sendModifyOne',
      data: body,
      progress: false,
      success: (res) => {
        // console.log(res);
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Duyệt hồ sơ thành công', 'Thành công');
        } else {
          this.notificationService.showError('Duyệt hồ sơ thất bại', 'Thất bại');
        }
        this.getCustomerInfo(this.processId);
        this.getTableInfo(this.processId);
      }
    });
  }

  sendCancel(): void {
    const body: any = {
      id: this.processId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/sendCancel',
      data: body,
      progress: true,
      success: (res) => {
        // console.log(res);
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Duyệt hồ sơ thành công', 'Thành công');
        } else {
          this.notificationService.showError('Duyệt hồ sơ thất bại', 'Thất bại');
        }
        this.getCustomerInfo(this.processId);
        this.getTableInfo(this.processId);
      }
    });
  }
  backPage(): void {
    this._LOCATION.back();
  }

  showDetailCustomer(processId): void {
    this.isCustomerSelect = processId;
  }

  showDetailCif(processId): void {
    this.isCustomer = true;
    this.processId = processId;
  }

  showDetailAccount(accountId): void {
    this.isAccount = true;
    this.accountId = accountId;
  }
  showAccountOwner(owner): void {
    this.isAccountOwner = true;
    if (owner.typeCode === 'PCO') {
      this.ownerId = owner.dwItemIds;
    }
    if (owner.typeCode === 'COOWNER') {
      this.ownerId = owner.dwItemId;
    }
  }
  showDetailMainCard(cardId): void {
    this.isMainCard = true;
    this.cardId = cardId;
  }
  showDetaiSubCard(cardId): void {
    this.isSupCard = true;
    this.cardId = cardId;
  }
  showDetailSignature(id): void {
    this.isSignature = true;
    this.signatureId = id;
  }
  showDetailAttachment(attachmentId): void {
    this.isAttachment = true;
    this.attachmentId = attachmentId;
  }
}
