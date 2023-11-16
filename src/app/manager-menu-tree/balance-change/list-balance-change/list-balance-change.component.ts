import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { AccountService } from 'src/app/_services/account.service';
import { AccountModel } from 'src/app/_models/account';
import { Process } from 'src/app/_models/process/Process';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ResponseStatus } from 'src/app/_models/response';
import { ProcessService } from 'src/app/_services/process.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { MissionService } from 'src/app/services/mission.service';
import { DetailProcess } from 'src/app/_models/process';
import { CifCondition } from 'src/app/_models/cif';
declare var $: any;

@Component({
  selector: 'app-list-balance-change',
  templateUrl: './list-balance-change.component.html',
  styleUrls: ['./list-balance-change.component.scss']
})
export class ListBalanceChangeComponent implements OnInit {
  @Output() viewDetaiBC = new EventEmitter();
  @Output() editBC = new EventEmitter();
  @Output() changeStep = new EventEmitter();
  lstAccount: AccountModel[] = [];
  processId: string;
  accountId: string;
  detailProcess: DetailProcess = new DetailProcess(null);
  hiddenAccount: boolean;
  hiddenCreateAccount: boolean;
  hiddenDetailAccount: boolean;
  roleLogin: any;
  checkButtonCreate: boolean;
  process: Process = new Process();
  response: ResponseStatus;
  listA: any[] = [{ accountName: 'TK_1', accountProductName: 'aaaaaaaa', currencyCode: 'aaaaaaaa', actionName: 'aaaaaaaa' }];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cifService: ProcessService,
    private errorHandler: ErrorHandlerService,
    private missionService: MissionService,
    private accountService: AccountService,
    private notificationService: NotificationService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    $('.childName').html('Danh sách tài khoản');
    // this.processId = this.route.snapshot.paramMap.get('processId') ;
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
      this.getProcessInformation(this.processId);
    });
    this.missionService.setProcessId(this.processId);
    this.hiddenAccount = true;
    this.hiddenCreateAccount = false;
    this.hiddenDetailAccount = false;
    if (this.roleLogin.includes('UNIFORM.BANK.GDV')) {
      this.checkButtonCreate = true;
    }
  }

  getProcessInformation(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    this.cifService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.process.item = data.item;
      }
    });
  }

  clickViewDetail(evt): void {
    // console.log(evt);
    this.viewDetaiBC.emit(evt);
    // console.log(this.listA);
  }
}
