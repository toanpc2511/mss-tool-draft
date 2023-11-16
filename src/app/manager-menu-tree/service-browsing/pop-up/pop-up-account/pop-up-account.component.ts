import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { ResponseStatus } from 'src/app/_models/response';
import { AccountModel } from 'src/app/_models/account';
import { DetailProcess } from 'src/app/_models/process';
import { MissionService } from 'src/app/services/mission.service';
import { AccountService } from 'src/app/_services/account.service';
import { ProcessService } from 'src/app/_services/process.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
declare var $: any;
@Component({
  selector: 'app-pop-up-account',
  templateUrl: './pop-up-account.component.html',
  styleUrls: ['./pop-up-account.component.scss']
})
export class PopUpAccountComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private location: Location,
              private missionService: MissionService, private dialog: MatDialog, private accountService: AccountService,
              private errorHandler: ErrorHandlerService, private cifService: ProcessService
  ) {
  }
  // lấy id từ bên cpn cha
  @Input() id = '';
  processId = '';
  accountId: string;
  response: ResponseStatus;
  // view
  detailAccount: AccountModel = new AccountModel();
  detailProcess: DetailProcess = new DetailProcess(null);
  roleLogin: any;
  checkButton: boolean;

  ngOnInit(): void {
    this.getDetailAccountInformation(this.id);
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
  }
  getDetailAccountInformation(accountId: any): any {
    return this.accountService.getDetailAccount({ id: accountId }).subscribe(
      data => {
        this.detailAccount = data.item;
        // console.log('aaas123', data.item);
      }, error => this.errorHandler.handleError(error)
      , () => {
        if (!this.detailAccount) {
          this.errorHandler.showError('Không lấy được thông tin chi tiết tài khoản');
          this.detailAccount = new AccountModel();
        }
      }
    );
  }
}
