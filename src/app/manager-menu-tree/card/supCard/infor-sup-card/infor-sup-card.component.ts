import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Card } from 'src/app/_models/card/Card';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { CardService } from 'src/app/_services/card/card.service';
import { SubCardService } from 'src/app/_services/card/sub-card.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ListAccount } from 'src/app/_models/card/Account';
import { Process } from 'src/app/_models/process/Process';
import { CifCondition } from 'src/app/_models/cif';
import { ProcessService } from 'src/app/_services/process.service';
import { CommonCard } from 'src/app/_models/card/CommonCard';
import { MissionService } from 'src/app/services/mission.service';
import { GlobalConstant } from '../../../../_utils/GlobalConstant';
import { HTTPMethod } from '../../../../shared/constants/http-method';
import { HelpsService } from '../../../../shared/services/helps.service';
import { ShareDataServiceService } from '../../../../_services/share-data-service.service';
import { docStatus } from 'src/app/shared/models/documents';
import {PermissionConst} from '../../../../_utils/PermissionConst';
import {AuthenticationService} from '../../../../_services/authentication.service';
declare var $: any;

@Component({
  selector: 'app-infor-sup-card',
  templateUrl: './infor-sup-card.component.html',
  styleUrls: ['./infor-sup-card.component.css']
})
export class InforSupCardComponent implements OnInit {
  PermissionConst = PermissionConst;
  SERVICE_STATUS = GlobalConstant.SERVICE_STATUS;
  SERVICE_NAME = GlobalConstant.SERVICE_NAME;
  PROCESS_STATUS = GlobalConstant.PROCESS_STATUS;
  card: Card[];
  card2: Card[];
  g: CommonCard[];
  accountId: string;
  id: string;
  cardTypeCode: string;
  account1: ListAccount[];
  processId: string;
  process: Process = new Process();
  cardId: string;
  contractNumber: string;
  contractNumberMain: string;
  deliveryTypeCode: string;
  deliveryChanelCode: string;
  roleLogin: any;
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
  readonly btnButton = {
    APPROVE: 'APPROVE',
    REQUEST_ADD: 'REQUEST_ADD',
    REJECT: 'REJECT'
  };
  readonly docStatus = docStatus;
  customerCode: any;

  constructor(
    private dialog: MatDialog,
    private _LOCATION: Location,
    private mainCardService: CardService,
    private cardService: SubCardService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private cifService: ProcessService,
    private missionService: MissionService,
    private helpService: HelpsService,
    private shareDataService: ShareDataServiceService,
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    $('.childName').html('Chi tiết thẻ phụ');
    this.getRole();
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.cardId = paramMap.get('cardId');
      this.processId = paramMap.get('processId');
      this.cifService.detailProcess(this.processId).subscribe(data => {
        if (data.item) {
          this.process.item = data.item;
          this.statusCode = data.item.statusCode;
          this.customerCode = this.process.item.customerCode;
          this.checkButtonKSV();
          // console.log(data.item);

        }
      }, error => {
      }, () => { }
      );
      this.getProcessInformation(paramMap.get('processId'));
      this.cardTypeCode = paramMap.get('cardTypeCode');
    });
    this.detail(this.id);
    this.detailMain();
    this.missionService.setProcessId(this.processId);
    // tslint:disable-next-line:prefer-for-of

    this.shareDataService.isView.subscribe(response => {
      this.isView = response;
      // console.log(response);  // you will receive the data from sender component here.
    });
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

  getStatusName(g): string {
    if (g === 'M') {
      return 'Nam';
    } else if (g === 'F') {
      return 'Nữ';
    } else if (g === 'P') {
      return 'Ẩn';
    } else if (g === 'O') {
      return 'Khác';
    }
  }
  update(): void {
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
                this.router.navigate(['smart-form/manager/add-sup-card/' + this.cardId + '/' + this.processId, { supCardId: this.id }]);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.router.navigate(['smart-form/manager/add-sup-card/' + this.cardId + '/' + this.processId, { supCardId: this.id }]);
    }
  }
  actionSendApprove(): void {
    const request = {
      id: this.id,
      typeCode: this.SERVICE_NAME.SUPCARD
    };
    this.helpService.callApi({
      method: HTTPMethod.POST,
      url: '/process/process/sendApproveOne',
      data: request,
      progress: true,
      success: (res) => {
        if (res && res.responseStatus.success) {
          this.notificationService.showSuccess('Gửi duyệt thẻ thành công', '');
          // this.router.navigate(['smart-form/manager/sup-card', { processId: this.processId, id: this.cardId }]);
          this.router.navigate(['smart-form/manager/infor-sup-card/' +
            this.id + '/' + this.cardId + '/' + this.processId]);
        } else {
          this.notificationService.showError('Gửi duyệt thẻ thất bại', 'Lỗi gửi duyệt thẻ`');
        }
      }
    });
    this.router.navigate(['smart-form/manager/add-sup-card/' + this.cardId + '/' + this.processId, { supCardId: this.id }]);
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
  actionDelete(item: any): void {
    const dialogConfig = {
      number: 21
    };
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDiaSupCardDelete(dialogConfig));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        const id = {};
        // tslint:disable-next-line:no-string-literal
        id['id'] = item.id;
        // console.log(item.id);
        // tslint:disable-next-line:no-shadowed-variable
        this.cardService.deleteSubCard(this.id).subscribe(rs => {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < rs.responseStatus.codes.length; index++) {
            if (rs.responseStatus.codes[index].code === '200') {
              this.notificationService.showSuccess('Xóa thẻ phụ thành công', '');
              this.router.navigate(['smart-form/manager/sup-card', { processId: this.processId, id: this.cardId }]);
            } else {
              this.notificationService.showError('Xóa thẻ thất bại', '');
            }
          }
        }, err => {
        });
      }
    }
    );
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
  getProcessInformation(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    this.cifService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.process.item = data.item;
        const name = data.item.customer.person.fullName;
        const name2 = this.toNoSign(name).toUpperCase();
        // console.log('process', this.process.item);
      }
    }, error => {
    }, () => { }
    );
  }
  backPage(): void {
    this._LOCATION.back();
  }
  getDetailAccount(id): void {
    this.mainCardService.getDetailAccount(id).subscribe(
      data => {
        if (data.item) {
          this.account1 = data.item;
          // console.log('tài khoản chi tiết liên kết thẻ', this.account1);
        }
      }
    );
  }

  // thông tin thẻ phụ
  detail(id): void {
    const c = new Card();
    c.id = id;
    this.cardService.detailSupCard(id).subscribe(
      data => {
        if (data.item) {
          this.card = data.item;
          this.accountId = data.item.accountId;
          this.contractNumber = data.item.contractNumber;
          this.deliveryTypeCode = data.item.deliveryTypeCode;
          this.deliveryChanelCode = data.item.deliveryChanelCode;
          // console.log('Thông tin thẻ phụ', this.card);

          this.getDetailAccount(this.accountId);
        }
      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }
  // thông tin thẻ chính
  detailMain(): void {
    this.mainCardService.detailCard(this.cardId).subscribe(
      data => {
        if (data.item) {
          this.card2 = data.item;
          this.contractNumberMain = data.item.contractNumber;
          // console.log('thông tin thẻ chính', this.card2);

        }
      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }
  inputLatinUppercase(event): void {
    event.target.value = this.toNoSign(event.target.value);
  }
  toNoSign(value): any {
    if (value === '') {
      return '';
    }
    let str = value;
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Í|Ì|Ị|Ỉ|Ỉ/g, 'I');
    str = str.replace(/Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ú|Ù|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    // console.log('after ', str);
    return str;
  }

  actionPopup(params): void {
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
                this.actionPopup(params);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
     this.actionPopup(params);
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
        url: '/process/process/sendModifyCreateSupCard',
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
        url: '/process/process/sendRejectCreateSupCard',
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
        url: '/process/process/approveCreateSupCard',
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
