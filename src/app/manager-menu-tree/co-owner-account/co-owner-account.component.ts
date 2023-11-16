import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessService } from '../../_services/process.service';
import { ErrorHandlerService } from '../../_services/error-handler.service';
import { MissionService } from '../../services/mission.service';
import { Location } from '@angular/common';
import { CoOwnerAccountService } from '../../_services/co-owner-account.service';
import { ResponseStatus } from '../../_models/response';
import { PopupConfirmComponent } from '../../_popup/popup-confirm.component';
import { DialogConfig } from '../../_utils/_dialogConfig';
import { MatDialog } from '@angular/material/dialog';
import { ProcessItem } from '../../_models/process/ProcessItem';
import { ProcessItemCustomer } from '../../_models/process/ProcessItemCustomer';

declare var $: any;

@Component({
  selector: 'app-co-owner-account',
  templateUrl: './co-owner-account.component.html',
  styleUrls: ['./co-owner-account.component.css']
})
export class CoOwnerAccountComponent implements OnInit {
  processId: string;
  accountId: string;
  coOwnerList: ProcessItemCustomer[];
  processItem = new ProcessItem();
  response: ResponseStatus;
  show: any = { process: false, coOwner: false };
  isKSV: boolean;
  isGDV: boolean;
  roleLogin: any = [];
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private _LOCATION: Location,
    private route: ActivatedRoute,
    private cifService: ProcessService,
    private missionService: MissionService,
    private errorHandler: ErrorHandlerService,
    private coOwnerService: CoOwnerAccountService,
  ) {
  }

  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    $('.childName').html('Tài khoản chung');
    $('.click-link').addClass('active');
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.route.paramMap.subscribe(paramMap => this.getProcessInformation(paramMap.get('processId')));
    this.getCoOwnerList();
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
    // console.log(processId);
    if (processId) {
      this.missionService.setProcessId(processId);
      this.processId = processId;
      this.cifService.detailProcess(processId).subscribe(data => {
        // console.log(data);
        this.processItem = data.item;
        // console.log(this.processItem);
        this.show.process = true;
        if (!this.processItem) {
          this.errorHandler.showError('Không lấy được thông tin hồ sơ');
        }
      },
        error => {
          this.errorHandler.showError(error);
        });
    }
  }

  getCoOwnerList(): void {
    this.coOwnerService.list(this.accountId, this.processId).subscribe(
      data => {
        if (data) {
          this.coOwnerList = data.items;
          this.response = data.responseStatus;
          this.show.coOwner = true;
          if (this.response && this.response.success === false) {
            this.coOwnerList = [];
          }
        }
      }, error => {
        this.errorHandler.showError(error);
      });
  }

  getDetailCoOwner(coOwnerId: string): void {
    this.router.navigate(['./smart-form/manager/co-owner/view', {
      processId: this.processId,
      accountId: this.accountId,
      // tslint:disable-next-line:object-literal-shorthand
      coOwnerId: coOwnerId,
      customerId: coOwnerId
    }]);
  }

  // checkLoading() {
  //   if (this.show.process == true && this.show.coOwner == true) {
  //     this.missionService.setLoading(false)
  //   }
  // }
  backPage(): void {
    this._LOCATION.back();
  }

  create(): void {
    this.router.navigate(['./smart-form/manager/co-owner/create', {
      processId: this.processId,
      accountId: this.accountId,
    }]);
  }

  deleteCoOwner(coOwnerId: string): void {
    const item = { number: 16, code: '' };
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirmDeleteAccount(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.delete(coOwnerId);
      }
    });
  }

  delete(coOwnerId: string): void {
    this.coOwnerService.delete(coOwnerId).subscribe(
      data => {
        if (data) {
          this.response = data.responseStatus;
        }
      }, error => {
        this.errorHandler.showError(error);
      }, () => {
        if (this.response) {
          this.errorHandler.messageHandler(this.response, 'Xóa đồng sở hữu thành công');
          if (this.response.success === true) {
            this.getCoOwnerList();
          }
        }
      });
  }
}
