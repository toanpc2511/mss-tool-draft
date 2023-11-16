import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { Card } from 'src/app/_models/card/Card';
import { CardSubList } from 'src/app/_models/card/subCard/CardSubList';
import { CifCondition } from 'src/app/_models/cif';
import { DetailProcess } from 'src/app/_models/process';
import { Process } from 'src/app/_models/process/Process';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';

import { CardService } from 'src/app/_services/card/card.service';
import { ProcessService } from 'src/app/_services/process.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { GlobalConstant } from '../../../../_utils/GlobalConstant';
import { ShareDataServiceService } from '../../../../_services/share-data-service.service';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { PermissionConst } from '../../../../_utils/PermissionConst';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';

declare var $: any;

@Component({
  selector: 'app-list-main-card',
  templateUrl: './list-main-card.component.html',
  styleUrls: ['./list-main-card.component.css']
})
export class ListMainCardComponent implements OnInit {
  PermissionConst = PermissionConst;
  PROCESS_STATUS = GlobalConstant.PROCESS_STATUS;
  SERVICE_STATUS = GlobalConstant.SERVICE_STATUS;
  card: Card[];
  subCard: CardSubList[];
  cardNumber: string;
  process: Process = new Process();
  detailProcess: DetailProcess = new DetailProcess(null);
  pro: Process[];
  processId: string;
  id: string;
  divCa: any;
  account: [];
  activePage = 1;
  accountId: '';
  index: number;
  roleLogin: any = [];
  isKSV: boolean;
  isGDV: boolean;
  addressCus: string;
  isView = false;
  customerCode: any;
  isShowMessage = false;

  constructor(
    private _LOCATION: Location,
    private cardService: CardService,
    private router: Router,
    private route: ActivatedRoute,
    private cifService: ProcessService,
    private missionService: MissionService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private shareDataService: ShareDataServiceService,
    public authenticationService: AuthenticationService,
    private helpService: HelpsService,
  ) {
  }

  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    $('.childName').html('Danh sách thẻ chính');
    this.divCa = document.querySelector('#tab') as HTMLElement;
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
      this.id = paramMap.get('id');
      this.missionService.setProcessId(this.processId);
      this.getProcessInformation(paramMap.get('processId'));
      // console.log('processId', paramMap.get('processId'));
    });
    this.getCardList();
    this.missionService.setProcessId(this.processId);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;

      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }


    }
  }

  getProcessInformation(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    this.missionService.setLoading(true);
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
            }else {
              this.isShowMessage = true;
            }
            this.shareDataService.sendData(true);
          }
        }
        // console.log('process', this.process.item);
      }
    }, error => {
      this.notificationService.showError('Lỗi server ', error);
    }, () => {
      this.missionService.setLoading(false);
    }
    );
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
        this.cardService.delete(item).subscribe(rs => {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < rs.responseStatus.codes.length; index++) {
            if (rs.responseStatus.codes[index].code === '200') {
              this.notificationService.showSuccess('Xóa thẻ thành công', '');
              setTimeout(() => {
                this.router.navigate(['./smart-form/manager/card', { processId: this.processId }]);
              }, 1000);

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

  backPage(): void {
    this._LOCATION.back();
  }

  getCardList(): void {

    this.cardService.getListCard({ processId: this.processId }).subscribe(data => {
      if (data.items) {
        this.card = data.items;
        this.index = this.card.length;
        // console.log('hh', this.card);
      }
    }, error => {

    }, () => {

    });
  }

  addNew(): void {
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
                // thêm mới
                this.router.navigate(['smart-form/manager/add-new-card', { processId: this.processId }]);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.router.navigate(['smart-form/manager/add-new-card', { processId: this.processId }]);
    }
  }

  deleteCard(item): void {
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

  detailCard(item: any): void {
    this.router.navigate(['./smart-form/manager/card-infor', { processId: this.processId, id: item.id }]);
    // this.router.navigate(['./smart-form/account/detailAccount']);
  }
}
