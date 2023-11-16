import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { AccountModel } from 'src/app/_models/account';
import { ListAccount } from 'src/app/_models/card/Account';
import { AccountLinkListOp } from 'src/app/_models/card/accountLinkListOutputDTOUVoCaChcNngDanhSchTiKhonLinKtCaThChnhCaTiKhonLinKtCaTh';
import { AccountLinkList } from 'src/app/_models/card/AcountLinkList';
import { Branch } from 'src/app/_models/card/Branch';
import { Card } from 'src/app/_models/card/Card';
import { CardDetailOutputDTOUVoCaChcNngChiTitCaThChnh } from 'src/app/_models/card/cardDetailOutputDTOUVoCaChcNngChiTitCaThChnh';
import { CommonCard } from 'src/app/_models/card/CommonCard';
import { CifCondition } from 'src/app/_models/cif';
import { Process } from 'src/app/_models/process/Process';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { CardService } from 'src/app/_services/card/card.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { ProcessService } from 'src/app/_services/process.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { HTTPMethod } from '../../../../shared/constants/http-method';
import { HelpsService } from '../../../../shared/services/helps.service';
import { GlobalConstant } from '../../../../_utils/GlobalConstant';
import { ShareDataServiceService } from '../../../../_services/share-data-service.service';
import { docStatus } from 'src/app/shared/models/documents';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { PermissionConst } from '../../../../_utils/PermissionConst';
declare var $: any;

@Component({
  selector: 'app-card-info',
  templateUrl: './card-info.component.html',
  styleUrls: ['./card-info.component.scss']
})
export class CardInfoComponent implements OnInit {
  PermissionConst = PermissionConst;
  SERVICE_NAME = GlobalConstant.SERVICE_NAME;
  PROCESS_STATUS = GlobalConstant.PROCESS_STATUS;
  account: AccountModel[];
  card: CardDetailOutputDTOUVoCaChcNngChiTitCaThChnh[] = [];
  acc: AccountLinkList[];
  accountList: AccountLinkListOp;
  accCountName: string;
  id: string;
  index = 0;
  accountId: string;
  processId: string;
  branch: Branch[];
  process: Process = new Process();
  g: CommonCard[];
  card1: Card = new Card();
  deliveryTypeCode: string;
  deliveryChanelCode: string;
  roleLogin: any = [];
  isKSV: boolean;
  isGDV: boolean;
  isView = false;
  isFullRole = false;
  isBtnKsv = false;
  isShowPopupRequestAdd = false;
  isShowPopupApprove = false;
  isShowPopupDelete = false;
  note;
  statusCode;
  customerCode: any;
  readonly btnButton = {
    APPROVE: 'APPROVE',
    REQUEST_ADD: 'REQUEST_ADD',
    REJECT: 'REJECT'
  };
  readonly docStatus = docStatus;
  isShowMessage = false;

  constructor(
    private _LOCATION: Location,
    private cardService: CardService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private cifService: ProcessService,
    private missionService: MissionService,
    private helpService: HelpsService,
    private shareDataService: ShareDataServiceService,
    public authenticationService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    $('.childName').html('Chi tiết thẻ chính');
    this.getRole();
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.processId = paramMap.get('processId');
      this.cifService.detailProcess(this.processId).subscribe(data => {
        if (data.item) {
          this.process.item = data.item;

          this.customerCode = this.process.item.customerCode;
          this.statusCode = data.item.statusCode;
          this.checkButtonKSV();
          // console.log(data.item);
          this.detail(this.id);
          this.missionService.setProcessId(this.processId);
          if (this.process.item.statusCode !== this.PROCESS_STATUS.DA_DUYET
            && this.process.item.statusCode !== this.PROCESS_STATUS.TU_CHOI
            && this.process.item.statusCode !== this.PROCESS_STATUS.DONG_HO_SO) {
            if (this.process.item.createdByUser.userName !== JSON.parse(localStorage.getItem('userInfo')).userName) {
              this.isView = true;
              if (this.isKSV) {
                this.isShowMessage = false;
              } else {
                this.isShowMessage = true;
              }
            }
          }
        }
      }, error => {
      }, () => { }
      );
    });


    // tslint:disable-next-line:prefer-for-of

    this.shareDataService.isView.subscribe(response => {
      this.isView = response;
      // console.log(response);  // you will receive the data from sender component here.
    });
  }

  backPage(): void {
    this.router.navigate(['smart-form/manager/card', { processId: this.processId }]);
  }

  actionDelete(item): void {
    const dialogConfig = {
      number: 20
    };
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDiaCardDelete(dialogConfig));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        const id = {};
        // tslint:disable-next-line:no-string-literal
        id['id'] = item.id;
        // tslint:disable-next-line:no-shadowed-variable
        this.cardService.delete(this.id).subscribe(rs => {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < rs.responseStatus.codes.length; index++) {
            if (rs.responseStatus.codes[index].code === '200') {
              this.notificationService.showSuccess('Xóa thẻ thành công', '');
              this.router.navigate(['./smart-form/manager/card', { processId: this.processId }]);
            } else {
              this.notificationService.showError('Xóa thẻ thất bại', '');
            }
          }
        }, err => {
        });
      }
    });
  }
  deleteCard(item: any): void {
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
                this.actionDelete(item);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.actionDelete(item);
    }
  }

  detail(id): void {
    this.cardService.detailCard(id).subscribe(
      data => {
        if (data.item) {
          this.card = data.item;
          // console.log(data.item);
        }
      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }

  update(item: any): any {
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
                // nếu là đúng
                this.router.navigate(['./smart-form/manager/add-new-card', { processId: this.processId, id: item.id }]);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.router.navigate(['./smart-form/manager/add-new-card', { processId: this.processId, id: item.id }]);
    }

  }

  addSubCard(): void {
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
                // nếu là đúng
                this.router.navigate(['smart-form/manager/add-sup-card/' + this.id + '/' + this.processId]);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.router.navigate(['smart-form/manager/add-sup-card/' + this.id + '/' + this.processId]);
    }

  }

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
  actionSendApprove(): void {
    const request = {
      id: this.id,
      typeCode: this.SERVICE_NAME.CARD
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/sendApproveOne',
      data: request,
      progress: true,
      // tslint:disable-next-line:no-shadowed-variable
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Gửi duyệt thẻ thành công', '');
          // this.router.navigate(['./smart-form/manager/card', { processId: this.processId }]);
          this.router.navigate(['./smart-form/manager/card-infor', { processId: this.processId, id: this.id }]);
        } else {
          this.notificationService.showError('Gửi duyệt thẻ thất bại', 'Lỗi gửi duyệt thẻ`');
        }
      }
    });
  }
  sendApprove(): void {
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
                // nếu là đúng
                this.actionSendApprove();
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.actionSendApprove();
    }
  }


  acctionShowPopup(params): void {
    switch (params) {
      case this.btnButton.REQUEST_ADD:
        this.isShowPopupRequestAdd = true;
        break;
      case this.btnButton.REJECT:
        this.isShowPopupDelete = true;
        break;
      case this.btnButton.APPROVE:
        this.isShowPopupApprove = true;
        break;
      default:
        break;
    }
  }
  showPopup(params): void {
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
                // nếu là đúng
                // this.params = false;
                this.acctionShowPopup(params);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.acctionShowPopup(params);
    }

  }

  confimSendRequestAdd(evt): void {
    switch (evt) {
      case 'CANCEL':
        this.isShowPopupRequestAdd = false;
        break;
      case 'CONFIRM':
        this.isShowPopupRequestAdd = false;
        this.sendRequestAdd();
    }

  }

  confimApproveProcess(evt): void {
    switch (evt) {
      case 'CANCEL':
        this.isShowPopupApprove = false;
        break;
      case 'CONFIRM':
        this.approveOne();
        this.isShowPopupApprove = false;
    }
  }

  confirmDeteteProcess(evt): void {
    switch (evt) {
      case 'YES':
        this.sendRejectOne();
        this.isShowPopupDelete = false;
        break;
      case 'NO':
        this.isShowPopupDelete = false;
        break;
    }
  }

  sendRequestAdd(): void {
    const body = {
      id: this.id,
      note: this.note
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendModifyCreateCard',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Yêu cầu bổ sung thành công', 'Thành công');
            this.checkButtonKSV();
          } else {
            this.notificationService.showError('Yêu cầu bổ sung thất bại', 'Thất bại');
          }
          this.isBtnKsv = false;
          this.isShowPopupRequestAdd = false;
        }
      }
    );
  }

  sendRejectOne(): void {
    const body = {
      id: this.id,
      note: this.note
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendRejectCreateCard',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Từ chối dịch vụ thành công', 'Thành công');
            this.checkButtonKSV();
          } else {
            this.notificationService.showError('Từ chối dịch vụ thất bại', 'Thất bại');
          }
          this.isBtnKsv = false;
          this.isShowPopupRequestAdd = false;
        }
      }
    );
  }

  approveOne(): void {
    const body = {
      id: this.id,
      note: this.note
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/approveCreateCard',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Duyệt dịch vụ thành công', 'Thành công');
            this.checkButtonKSV();
          } else {
            this.notificationService.showError('Duyệt dịch vụ thất bại', 'Thất bại');
          }
          this.isBtnKsv = false;
          this.isShowPopupRequestAdd = false;
        }
      }
    );
  }

  checkButtonKSV(): void {
    this.isBtnKsv = true;
    if (this.statusCode !== this.docStatus.WAIT) {
      this.isBtnKsv = false;
      // this.isCheckUser = false;
    }
  }
}
