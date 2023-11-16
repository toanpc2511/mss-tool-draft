import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { docStatus } from 'src/app/shared/models/documents';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { MissionService } from 'src/app/services/mission.service';
declare var $: any;

@Component({
  selector: 'app-genarate-infor',
  templateUrl: './genarate-infor.component.html',
  styleUrls: ['./genarate-infor.component.css']
})
export class GenarateInforComponent implements OnInit {

  isCheckButtonClose = false;
  processId = '';
  statusCode = '';
  customerCode = null;
  createdBy: any;
  userInfo: any;
  isShowConfirmPopupDelete = false;
  dataDetail: any;

  readonly action = {
    reload: 'RELOAD',
    click: 'BTN_CLOSE'
  };

  constructor(
    private _LOCATION: Location,
    private helpService: HelpsService,
    private notificationService: NotificationService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private missionService: MissionService,
  ) { }

  ngOnInit(): void {
    $('.childName').html('Thông tin chung');
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.missionService.setProcessId(this.processId);
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.isCheckButtonClose = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.DELETE_SERVICE);
    this.getProcessInformation();
  }

  backPage(): void {
    this._LOCATION.back();
  }
  doDelete(): void { this.isShowConfirmPopupDelete = true; }
  /**
   *  kiểm tra hồ sơ ấy có phải là người tạo đúng hay ko
   */
  checkUser(param): void {
    if (this.createdBy !== this.userInfo.userId) {
      this.isCheckButtonClose = false;
    } else {
      // nếu cùng người tạo
      this.isCheckButtonClose = (this.isCheckButtonClose ? true : false);
      if (param === this.action.click) {
        this.deleteProfile();
      }
    }
  }

  confirmDeteteProcess(evt): void {
    switch (evt) {
      case 'YES':
        this.close();
        this.isShowConfirmPopupDelete = false;
        break;
      case 'NO':
        this.isShowConfirmPopupDelete = false;
        break;
    }
  }

  // lấy chi tiết hồ sơ
  getProcessInformation(): void {
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
            this.dataDetail = res.item;
            this.statusCode = this.dataDetail.statusCode ? this.dataDetail.statusCode : '';
            this.customerCode = this.dataDetail.customerCode ? this.dataDetail.customerCode : null;
            this.createdBy = this.dataDetail.createdBy;
            if (this.isCheckButtonClose) {
              if (this.statusCode !== docStatus.VIEW) {
                //  nếu là  hồ sơ pending  đùng người tạo
                this.checkUser(this.action.reload);
              } else {
                this.isCheckButtonClose = false;
              }
            }

          } else {
            this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
          }
        }
      }
    );
  }

  close(): void {
    this.checkUser(this.action.click);
  }

  deleteProfile(): void {
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
        url: '/process/process/delete',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Đóng hồ sơ thành công', 'Thành công');
            this.router.navigate(['./smart-form/fileProcessed']);
          } else {
            this.notificationService.showError('Đóng hồ sơ thất bại', 'Thất bại');
          }
        }
      }
    );
  }
}
