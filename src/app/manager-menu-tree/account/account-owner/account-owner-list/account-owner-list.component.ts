import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RcFatcaComponent } from 'src/app/manager-smart-form/register-cif/shared/components/rc-fatca/rc-fatca.component';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { Location } from '@angular/common';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { docStatus } from 'src/app/shared/models/documents';
declare var $: any;

@Component({
  selector: 'app-account-owner-list',
  templateUrl: './account-owner-list.component.html',
  styleUrls: ['./account-owner-list.component.scss']
})
export class AccountOwnerListComponent implements OnInit {

  @ViewChild('fatca', { static: false }) fatca: RcFatcaComponent;
  processId = '';
  accountId = '';
  nationlityFirst = { code: 'VN', name: 'Vietnam' };
  listCoowner = [];
  isDeleteRow = false;
  readonly confim = {  //  thực hiện xóa hay là hủy xóa trên bảng
    CANCEL: 'CANCEL',
    CONFIM: 'CONFIM',
  };
  ownerId = '';
  roleLogin: any;
  isDisableButton = false;
  isGDV = false;
  isKSV = false;
  customerCode: any;
  isCreate = false;
  isDelete = false;
  statusCode: any;
  createdBy: any;
  branchCode: any;
  userInfo: any;
  statusCif: any;
  isShowMessage = false;
  isApproveOwner = false;
  isApproveFastCif = false;
  objStatusProfile: any = {};
  isApprove = false;

  constructor(
    private helpService: HelpsService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private _LOCATION: Location,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    $('.childName').html('Danh sách đồng sở hữu');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('id');
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
        }
      }
    );
  }

  getRole(): void {
    this.isCreate = this.authenticationService.isPermission(PermissionConst.TK_DONG_SO_HUU.CREATE);
    this.isDelete = this.authenticationService.isPermission(PermissionConst.TK_DONG_SO_HUU.DELETE);
    this.isApproveOwner = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.APPROVE_CREATE_OWNER);
    this.isApproveFastCif = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.APPROVE_CREATE_FAST_CIF);
  }
  /**
   * get thông tin chủ sở hữu
   */
  getListCoownerInfo(): void {
    this.listCoowner = [];
    const body = {
      processId: this.processId,
      accountId: this.accountId
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/customer/listCoowner',
      data: body,
      progress: true,
      success: (res) => {
        this.getRole();
        if (this.statusCif === 'Y' || this.statusCif === 'C') {
          this.isCreate = false;
          this.isDelete = false;
        }
        if (res && res.responseStatus.success) {
          this.listCoowner = res.items;
          this.listCoowner.forEach(e => {
            e.isActive = this.isDelete ? true : false;
            // tslint:disable-next-line:max-line-length
            if ((e.coowner.currentStatusCode === 'NEW' && e.coowner.changeStatusCode === 'ACTIVE') || (e.coowner.currentStatusCode === 'ACTIVE' && e.coowner.changeStatusCode === null)) {
              e.isActive = false;
            }
            // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
            // tslint:disable-next-line:max-line-length
            if (this.checkPending()) {
              e.isActive = false;
              this.isCreate = false;
              // nếu là khác người tạo thì ẩn hết các nút
            } else {
              if (this.checkAproveReject()) {
                e.isActive = false;
                this.isCreate = false;
              } else {
                this.isCreate = this.isCreate ? true : false;
              }
            }
          });

        } else {
          // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
          // tslint:disable-next-line:max-line-length
          if (this.checkPending()) {
            this.isCreate = false;
            // nếu là khác người tạo thì ẩn hết các nút
          } else {
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
      this.isApprove = (this.customerCode ? this.isApproveOwner : this.isApproveFastCif);
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

  getDetail(event): void {
    this.customerCode = event.customerCode;
    this.statusCode = event.statusCode;
    this.customerCode = event.customerCode;
    this.createdBy = event.createdBy;
    this.statusCif = event.customer.statusCif;
    this.objStatusProfile = event;
    this.getListCoownerInfo();

  }
  // tslint:disable-next-line:typedef
  showPopupDelete(coOwnerId: string) {
    this.isDeleteRow = true;
    this.ownerId = coOwnerId;
  }
  routerDetailCoowner(coOwnerId: string): void {
    this.router.navigate(['./smart-form/manager/co-owner/view', {
      processId: this.processId,
      coOwnerId
    }]);
  }
  actionDeleteCoowner(): void {
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
          // reset list
          this.getListCoownerInfo();
          this.getDetailProfile();
        } else {
          this.notificationService.showError('Xóa đồng sở hữu thất bại', 'Thất bại');
        }
      }
    });
  }
  /**
   * Xóa đồng chủ sở hữu
   */
  deleteCoowner(): void {
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
                this.actionDeleteCoowner();
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.actionDeleteCoowner();
    }
  }
  /**
   *  quay lại
   */
  backPage(): void {
    this._LOCATION.back();
  }
  /**
   * thực hiện xóa hay hủy
   */
  confimRemoveData(param: any): void {
    switch (param) {
      case this.confim.CANCEL:
        this.isDeleteRow = false;
        break;
      case this.confim.CONFIM:
        this.deleteCoowner();
        this.isDeleteRow = false;
        break;
      default:
        break;
    }
  }
  addOwner(): void {
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
                this.router.navigate(['./smart-form/manager/co-owner/create', {
                  processId: this.processId,
                  accountId: this.accountId,
                }]);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.router.navigate(['./smart-form/manager/co-owner/create', {
        processId: this.processId,
        accountId: this.accountId,
      }]);
    }
  }
}
