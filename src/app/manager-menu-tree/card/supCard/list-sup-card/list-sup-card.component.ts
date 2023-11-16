import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { CardDetailOutputDTOUVoCaChcNngChiTitCaThChnh } from 'src/app/_models/card/cardDetailOutputDTOUVoCaChcNngChiTitCaThChnh';
import { CardSubList } from 'src/app/_models/card/subCard/CardSubList';
import { CifCondition } from 'src/app/_models/cif';
import { Process } from 'src/app/_models/process/Process';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { SubCardService } from 'src/app/_services/card/sub-card.service';
import { ProcessService } from 'src/app/_services/process.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { GlobalConstant } from '../../../../_utils/GlobalConstant';
import { ShareDataServiceService } from '../../../../_services/share-data-service.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { PermissionConst } from '../../../../_utils/PermissionConst';
declare var $: any;

@Component({
  selector: 'app-list-sup-card',
  templateUrl: './list-sup-card.component.html',
  styleUrls: ['./list-sup-card.component.css']
})
export class ListSupCardComponent implements OnInit {
  PermissionConst = PermissionConst;
  PROCESS_STATUS = GlobalConstant.PROCESS_STATUS;
  SERVICE_STATUS = GlobalConstant.SERVICE_STATUS;
  processId: string;
  subCard: CardSubList[];
  divCa: any;
  process: Process = new Process();
  card: CardDetailOutputDTOUVoCaChcNngChiTitCaThChnh[];
  cardId = '';
  index: number;
  roleLogin: any;
  isKSV: boolean;
  isGDV: boolean;
  isView = false;
  customerCode: any;
  isShowMessage = false;
  constructor(
    private dialog: MatDialog,
    private _LOCATION: Location,
    private route: ActivatedRoute,
    private subCardService: SubCardService,
    private router: Router,
    private cifService: ProcessService,
    private notificationService: NotificationService,
    private missionService: MissionService,
    private shareDataService: ShareDataServiceService,
    private helpService: HelpsService,
    public authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    $('.childName').html('Danh sách thẻ phụ');
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    // this.divCa = document.querySelector('#tab') as HTMLElement;
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
      this.cardId = paramMap.get('id');
      // console.log('processId', paramMap.get('processId'));
      this.getProcessInformation(paramMap.get('processId'));
      this.missionService.setProcessId(this.processId);
    });
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;
      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
    this.getListSubCard();
    // this.detail(this.cardId)
  }
  backPage(): void {
    this._LOCATION.back();
  }

  getListSubCard(): void {
    this.subCardService.getListCard(this.cardId).subscribe(data => {
      if (data.items) {
        this.subCard = data.items;
        this.index = this.subCard.length;
        // console.log(this.subCard);
        // if (data.items.length === 0) {
        //   this.divCa.style.display = 'flex';
        // } else {
        //   this.divCa.style.display = 'none';
        // }
      }
    });
  }
  // detail(id) {
  //   const c = new Card()
  //   c.id = id
  //   // id = "4a9eb7cf-7e28-4312-8942-237c4cea9eab"
  //   this.cardService.detailCard(id).subscribe(
  //     data => {
  //       if (data.item) {
  //         this.card = data.item
  //         // this.accountId = data.item.accountId;
  //         this.cardId = data.item.id;
  //         // this.cardTypeCode = data.item.cardTypeCode;
  //         console.log(this.card);
  //         // console.log(this.accountId);
  //         // this.getDetailAccount(this.accountId)
  //       }
  //     }, error => {
  //       this.errorHandler.showError(error);
  //     }
  //   )
  // }
  getProcessInformation(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    this.cifService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.process.item = data.item;
        this.customerCode = this.process.item.customerCode;
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
            this.shareDataService.sendData(true);
          }
        }
        // console.log('Hồ sơ khách hàng', this.process.item);
      }
    }, error => {
    }, () => { }
    );
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
                this.router.navigate(['smart-form/manager/add-sup-card/' + this.cardId + '/' + this.processId]);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.router.navigate(['smart-form/manager/add-sup-card/' + this.cardId + '/' + this.processId]);
    }
  }
  actionDeleteCard(item): void {
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
        this.subCardService.deleteSubCard(item).subscribe(rs => {
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
                this.actionDeleteCard(item);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.actionDeleteCard(item);
    }
  }
}
