import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { CifCondition } from '../../_models/cif';
import { DetailProcess, Process } from '../../_models/process';
import { ErrorHandlerService } from '../../_services/error-handler.service';
import { MissionService } from '../../services/mission.service';
import { ProcessService } from '../../_services/process.service';
import { AccountService } from 'src/app/_services/account.service';
import { AccountModel } from 'src/app/_models/account';
import { AccountAuthorService } from '../../_services/account-author.service';
import { Pagination } from '../../_models/pager';
import { AccountAuthor } from '../../_models/AccountAuthor';
import { AuthorityAccountService } from 'src/app/_services/authority-account.service';
import { ResponseStatus } from 'src/app/_models/response';
import { DialogService } from '../_dialog/dialog.service';
import { DialogComponent } from '../_dialog/dialog.component';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { docStatus } from 'src/app/shared/models/documents';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { NotificationService } from 'src/app/_toast/notification_service';
declare var $: any;
@Component({
  selector: 'app-authority',
  templateUrl: './authority-component.html',
  styleUrls: ['./authority-component.scss']
})
export class AuthorityComponent implements OnInit {
  lstAccount: AccountModel[] = [];
  pagination: Pagination = new Pagination();
  processId: string;
  roleLogin: any;
  accountId: string;
  response: ResponseStatus;
  isCreate = false;
  isDelete = false;
  customerCode: any;
  statusCode: any;
  createdBy: any;
  branchCode: any;
  userInfo: any;
  statusCif: any;
  isShowMessage = false;
  isApprove = false;
  objStatusProfile: any = {};
  @ViewChild('appDialog', { static: true }) appDialog: DialogComponent;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private errorHandler: ErrorHandlerService,
    private authorityService: AuthorityAccountService,
    private dialogService: DialogService,
    private missionService: MissionService,
    private authenticationService: AuthenticationService,
    private helpService: HelpsService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.route.paramMap.subscribe(paramMap => this.processId = paramMap.get('processId'));
    this.missionService.setProcessId(this.processId);
    this.dialogService.register(this.appDialog);
    this.accountId = this.route.snapshot.paramMap.get('id');
    $('.childName').html('Danh sách ủy quyền');
  }

  getAccountAuthorList(): void {
    const body = {
      accountId: this.accountId
    };
    if (!body) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/account/accountAuthor/list',
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
    if (this.statusCode && (this.statusCode === docStatus.APPROVED
      || this.statusCode === docStatus.SUCCESS
      // tslint:disable-next-line:semicolon
      || this.statusCode === docStatus.REJECT)) {
      return true;
    } else {
      return false;
    }
  }
  getRole(): void {
    this.isCreate = this.authenticationService.isPermission(PermissionConst.TK_UY_QUYEN.CREATE);
    this.isDelete = this.authenticationService.isPermission(PermissionConst.TK_UY_QUYEN.DELETE);
    this.isApprove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.APPROVE_CREATE_AUTHOR);
  }
  showDialog(id: any): void {
    this.dialogService.show()
      .then((res) => {
        this.deleteAuthority(id);
      })
      .catch((err) => {

      });
  }
  deleteAuthority(id: any): Subscription {
    return this.authorityService.delete({ id }).subscribe(
      data => {
        if (data.responseStatus) {
          this.response = data.responseStatus;
        }
      }
      , error => this.errorHandler.showError(error)
      , () => {
        if (this.response) {
          this.errorHandler.messageHandler(this.response, 'Xóa ủy quyền thành công');
          if (this.response.success === true) {
            this.router.navigate(['./smart-form/manager/authority', { processId: this.processId, id: this.accountId }]);
          }
        } else {
          this.errorHandler.showError('Lỗi không xác định');
        }
      }
    );
  }
  getDetail(event): void {
    this.statusCode = event.statusCode;
    this.customerCode = event.customerCode;
    this.createdBy = event.createdBy;
    this.statusCif = event.customer.statusCif;
    this.objStatusProfile = event;
    this.getAccountAuthorList();

  }
  backPage(): void {
    $('.childName').html('Danh sách tài khoản');
    this.location.back();
  }
  createAuthority(): void {
    this.router.navigate(['./smart-form/manager/createAuthority', { processId: this.processId, accountId: this.accountId }]);
  }
  detailAccount(item: any): void {
    this.router.navigate(['./smart-form/manager/detailAuthority', { processId: this.processId, accountId: this.accountId, id: item.id }]);
  }
}
