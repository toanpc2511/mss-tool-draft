import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MissionService } from 'src/app/services/mission.service';
import { AccountModel } from 'src/app/_models/account';
import { ResponseStatus } from 'src/app/_models/response';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { AccountService } from 'src/app/_services/account.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.css']
})
export class ListAccountComponent implements OnInit {
  processId: string;
  account: AccountModel[];
  response: ResponseStatus;
  roleLogin: any;
  isGDV: boolean;
  isKSV: boolean;
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService, private dialog: MatDialog, private errorHandler: ErrorHandlerService,
    private router: Router,
    private missionService: MissionService,
  ) { }

  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;
      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    this.missionService.setProcessId(this.processId);
    this.getAccountLinkedList();
  }
  getAccountLinkedList(): void {
    this.accountService.getAccountList({ processId: this.processId }).subscribe(
      data => {
        if (data.items) {
          this.account = data.items;
          // console.log('account', this.account);
        }
      }
    );
  }
  updateAccount(id: any): void {
    this.router.navigate(['./smart-form/manager/updateAccount', { processId: this.processId, id}]);
  }
  deleteAccount(id: any): void {
    const item = {
      code: '',
      number: 0
    };
    item.number = 14;
    item.code = '';
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirmDeleteAccount(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.delete(id);
      }
    }
    );
  }

  delete(accountId): any {
    return this.accountService.deleteAccount({ id: accountId }).subscribe(
      data => {
        if (data.responseStatus) {
          this.response = data.responseStatus;
        }
      },
      error => this.errorHandler.showError(error)
      , () => {
        if (this.response) {
          this.errorHandler.messageHandler(this.response, 'Xóa tài khoản thành công');
          if (this.response.success === true) {
            this.router.navigate(['./smart-form/manager/generalInformation', { processId: this.processId }]);
          }
        }
      }
    );
  }
}
