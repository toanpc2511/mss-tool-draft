import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CifCondition } from '../../_models/cif';
import { DetailProcess } from '../../_models/process';
import { ErrorHandlerService } from '../../_services/error-handler.service';
import { MissionService } from '../../services/mission.service';
import { ProcessService } from '../../_services/process.service';
import { AccountService } from 'src/app/_services/account.service';
import { AccountModel } from 'src/app/_models/account';
import { Process } from 'src/app/_models/process/Process';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { MatDialog } from '@angular/material/dialog';
import { ResponseStatus } from 'src/app/_models/response';
import { NotificationService } from 'src/app/_toast/notification_service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
import { docStatus } from 'src/app/shared/models/documents';
declare var $: any;
@Component({
  selector: 'app-account',
  templateUrl: './account-component.html',
  styleUrls: ['./account-component.scss']
})
export class AccountComponent implements OnInit {
  lstAccount: AccountModel[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _LOCATION: Location,
    private errorHandler: ErrorHandlerService,
    private missionService: MissionService,
    private accountService: AccountService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private helpService: HelpsService,
    private authenticationService: AuthenticationService) {
  }
  processId: string;
  accountId: string;
  detailProcess: DetailProcess = new DetailProcess(null);
  hiddenAccount: boolean;
  hiddenCreateAccount: boolean;
  hiddenDetailAccount: boolean;
  roleLogin: any;
  checkButtonCreate: boolean;
  process: Process = new Process();
  response: ResponseStatus;
  userInfo: any;
  customerCode: any;
  statusCode: any;
  createdBy: any;
  branchCode: any;
  isCreate = false;
  isDelete = false;
  statusCif: any;
  isApprove = false;
  objStatusProfile: any = {};
  isShowMessage = false;

  ngOnInit(): void {
    $('.childName').html('Danh sách tài khoản');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    this.missionService.setProcessId(this.processId);
    this.hiddenAccount = true;
    this.hiddenCreateAccount = false;
    this.hiddenDetailAccount = false;
  }

  getRole(): void {
    this.isCreate = this.authenticationService.isPermission(PermissionConst.TAI_KHOAN.CREATE);
    this.isDelete = this.authenticationService.isPermission(PermissionConst.TAI_KHOAN.DELETE);
    this.isApprove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.APPROVE_CREATE_ACCOUNT);
  }

  getDetail(event): void {

    this.statusCode = event.statusCode;
    this.customerCode = event.customerCode;
    this.createdBy = event.createdBy;
    this.statusCif = event.customer.statusCif;
    this.objStatusProfile = event;
    this.getAccountList();
  }
  getAccountList(): void {
    const body = {
      processId: this.processId
    };
    if (!body) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/account/account/list',
      data: body,
      progress: true,
      success: (res) => {
        this.getRole();
        if (this.statusCif === 'Y' || this.statusCif === 'C') {
          this.isCreate = false;
          this.isDelete = false;
        }
        if (res && res.responseStatus.success) {
          this.lstAccount = res.items;
          this.lstAccount.forEach(e => {
            e.isActive = this.isDelete ? true : false;
            // tslint:disable-next-line:max-line-length
            if ((e.currentStatusCode === 'NEW' && e.changeStatusCode === 'ACTIVE') || (e.currentStatusCode === 'ACTIVE' && e.changeStatusCode === null)) {
              e.isActive = false;
            }
            // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
            // tslint:disable-next-line:max-line-length
            if (this.checkPending()) {
              e.isActive = false;
              this.isCreate = false;
              // nếu là khác người tạo thì ẩn hết các nút xóa ,tạo mới
            } else {
              // tslint:disable-next-line:curly
              if (this.checkAproveReject()) {
                e.isActive = false;
                this.isCreate = false;
              } else {
                this.isCreate = this.isCreate ? true : false;
              }
            }
          });

        } else {
          if (this.checkPending()) {
            this.isCreate = false;
            // nếu là khác người tạo thì ẩn hết các nút xóa ,tạo mới
          } else {
            // tslint:disable-next-line:curly
            if (this.checkAproveReject()) {
              this.isCreate = false;
            } else {
              this.isCreate = this.isCreate ? true : false;
            }
          }
        }
      }
    });
  }

  checkPending(): boolean {
    if (this.statusCode && (this.statusCode === docStatus.EDIT
      || this.statusCode === docStatus.WAIT
      || this.statusCode === docStatus.TEMP
      || this.statusCode === docStatus.MODIFY) && this.createdBy !== this.userInfo.userId) {
      if (this.isApprove) {
        this.isShowMessage = false;
      } else {
        this.isShowMessage = true;
      }
      return true;
    } else {
      return false;
    }
  }
  checkAproveReject(): boolean {
    if ((this.statusCode === docStatus.APPROVED
      || this.statusCode === docStatus.SUCCESS
      // tslint:disable-next-line:semicolon
      || this.statusCode === docStatus.REJECT)) {
      return true;
    } else {
      return false;
    }
  }

  backPage(): void {
    $('.childName').html('Danh sách tài khoản');
    if (this.hiddenAccount && !this.hiddenCreateAccount && !this.hiddenDetailAccount) {
      this._LOCATION.back();
    }
  }

  createAccount(): void {
    /**
     *  kiểm tra hồ sơ ấy có phải là người tạo hay ko
     */
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
                this.router.navigate(['./smart-form/manager/createAccount', { processId: this.processId }]);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.router.navigate(['./smart-form/manager/createAccount', { processId: this.processId }]);
    }

  }
  detailAccount(item: any): void {
    this.router.navigate(['./smart-form/manager/detailAccount', { processId: this.processId, id: item.id }]);
  }

  deleteAccount(id: any): void {
    const item = {
      code: '',
      number: 0
    };
    item.number = 14;
    item.code = '';
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirmDeleteAccount(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.delete(id);
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
