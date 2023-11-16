import { Component, OnInit, Inject, ViewChild, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { AccountModel } from 'src/app/_models/account';
import { Process } from 'src/app/_models/process/Process';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ResponseStatus } from 'src/app/_models/response';
import { ListBalanceChangeComponent } from './list-balance-change/list-balance-change.component';
import { AddOrEditBalanceChangeComponent } from './add-or-edit-balance-change/add-or-edit-balance-change.component';
declare var $: any;
@Component({
  selector: 'app-balance-change',
  templateUrl: './balance-change.component.html',
  styleUrls: ['./balance-change.component.css']
})
export class BalanceChangeComponent implements OnInit {
  @ViewChild(ListBalanceChangeComponent, { static: false }) listBalanceChangeComponent: ListBalanceChangeComponent;
  @ViewChild(AddOrEditBalanceChangeComponent, { static: false }) addOrEditBalanceChangeComponent: AddOrEditBalanceChangeComponent;
  processId: string;
  obj: any;
  isKSV: boolean;
  isGDV: boolean;
  roleLogin: any = []
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }
  step = 'HOME';
  ngOnInit(): void {

    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    this.roleLogin = JSON.parse(localStorage.getItem("role"))
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === "UNIFORM.BANK.GDV") {
        this.isGDV = true;
      } else if (this.roleLogin[i] === "UNIFORM.BANK.KSV") {
        this.isKSV = true
      }
    }
  }
  backStep(): void {
    switch (this.step) {
      case 'DETAIL':
      case 'CREATE':
      case 'EDIT':
        this.step = 'HOME';
        break;
      default:
        this.router.navigate(['/smart-form/manager/fileProcessed']);
        break;
    }
  }
  showStep(step): void {
    this.step = step;
  }

  viewBCDetail(evt): void {
    // console.log('SAD', this.obj);
    this.obj = evt;
    this.showStep('DETAIL');
  }

  createEbanking(): void {
    this.step = 'CREATE';
  }

  editEbanking(evt): void {
    this.obj = evt;
    this.step = 'EDIT';
  }
  saveEbanking(): void {
  }
}
