import { Component, OnInit } from '@angular/core';
import { CoOwnerAccount } from '../../../_models/CoOwnerAccount';
import { DetailProcess } from '../../../_models/process';
import { AccountModel } from '../../../_models/account';
import { ResponseStatus } from '../../../_models/response';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ProcessService } from '../../../_services/process.service';
import { AccountService } from '../../../_services/account.service';
import { MissionService } from '../../../services/mission.service';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { CoOwnerAccountService } from '../../../_services/co-owner-account.service';
import { PopupConfirmComponent } from '../../../_popup/popup-confirm.component';
import { DialogConfig } from '../../../_utils/_dialogConfig';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-detail-co-owner',
  templateUrl: './detail-co-owner.component.html',
  styleUrls: ['./detail-co-owner.component.css']
})
export class DetailCoOwnerComponent implements OnInit {
  processId: string;
  accountId: string;
  coOwnerId: string;
  customerId: string;
  coOwnerList: CoOwnerAccount[];
  detailProcess: DetailProcess = new DetailProcess(null);
  detailCoOwner: DetailProcess = new DetailProcess(null);
  detailAccount: AccountModel = new AccountModel();
  showLoading1: boolean;
  showLoading2: boolean;
  showLoading3: boolean;
  response: ResponseStatus;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private _LOCATION: Location,
    private route: ActivatedRoute,
    private cifService: ProcessService,
    private accountService: AccountService,
    private missionService: MissionService,
    private errorHandler: ErrorHandlerService,
    private coOwnerService: CoOwnerAccountService,
  ) { }

  ngOnInit(): void {
    $('.childName').html('Thông tin chi tiết đồng sở hữu');
    $('.click-link').addClass('active');
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    this.coOwnerId = this.route.snapshot.paramMap.get('coOwnerId');
    this.customerId = this.route.snapshot.paramMap.get('customerId');
  }


  backPage(): void {
    this._LOCATION.back();
  }
  // create(): void {
  //   this.router.navigate(['./smart-form/manager/co-owner/create', {
  //     processId: this.processId,
  //     id: this.accountId
  //   }]);
  // }
  // updateCoOwner(): void {
  //   this.router.navigate(['./smart-form/manager/co-owner/update', {
  //     processId: this.processId,
  //     accountId: this.accountId,
  //     coOwnerId: this.coOwnerId,
  //     customerId: this.customerId
  //   }]);
  // }
  // deleteCoOwner(): void {
  //   const item = { number: 16, code: '' };
  //   const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirmDeleteAccount(item));
  //   dialogRef.afterClosed().subscribe(rs => {
  //     if (rs === 1) {
  //       this.delete();
  //     }
  //   });
  // }
  // delete(): void {
  //   this.missionService.setLoading(true);
  //   this.coOwnerService.delete(this.coOwnerId).subscribe(
  //     data => {
  //       if (data) {
  //         this.response = data.responseStatus;
  //       }
  //     }
  //     , error => {
  //       this.missionService.setLoading(false);
  //       this.errorHandler.showError(error);
  //     }
  //     , () => {
  //       this.missionService.setLoading(false);
  //       if (this.response) {
  //         this.errorHandler.messageHandler(this.response, 'Xóa đồng sở hữu thành công');
  //         if (this.response.success === true) {
  //           this.router.navigate(['./smart-form/manager/co-owner', { processId: this.processId, id: this.accountId }]);
  //         }
  //       }
  //     }
  //   );
  // }
}
