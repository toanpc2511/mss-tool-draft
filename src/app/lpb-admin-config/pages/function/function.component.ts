import { Component, OnInit } from '@angular/core';
import {PopupSystemAddFunctionComponent} from '../../../manager-admin/popup-system-add-function/popup-system-add-function.component';
import {DialogConfig} from '../../../_utils/_dialogConfig';
import {MatDialog} from '@angular/material/dialog';
import {Pagination} from '../../../_models/pager';
import {FunctionService} from '../../../_services/function.service';
import {MainFunction} from '../../../_models/mainFunction';
import {getStatusCode} from '../../shared/functions/GetStatusCode';
import {PopupConfirmComponent} from '../../../_popup/popup-confirm.component';
import {NotificationService} from '../../../_toast/notification_service';
@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.scss']
})
export class FunctionComponent implements OnInit {
  activePage = 1;
  pageSize = 10;
  pager: Pagination = new Pagination();
  displayProgressSpinnerInBlock: boolean;
  // mode = 'indeterminate';
  // value = 50;
  // color = 'primary';
  functions: MainFunction[] = [];
  TOTAL_COUNT: any;
  getStatusCode = getStatusCode;
  isAdmin = false;
  constructor( private dialog: MatDialog,
               private functionService: FunctionService,
               private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const roleCode = JSON.parse(localStorage.getItem('userRole')).code;
    this.isAdmin = roleCode === 'UNIFORM.BANK.QUANTRI' || roleCode === 'UNIFORM.BANK.SUB-ADMIN';
    // this.isAdmin = JSON.parse(localStorage.getItem('userRole')).code === 'UNIFORM.BANK.QUANTRI';
    this.getAllFunction();
  }

  addFunction(): void {
    const dialogRef = this.dialog.open(PopupSystemAddFunctionComponent, DialogConfig.configDialog(null));
    dialogRef.afterClosed().subscribe(rs => {
        if (rs === 1) {
          this.getAllFunction();
        }
      }
    );
  }

  getAllFunction(): void {
    const obj = {};
    // tslint:disable-next-line:no-string-literal
    obj['page'] = this.activePage;
    // tslint:disable-next-line:no-string-literal
    obj['size'] = this.pageSize;
    this.displayProgressSpinnerInBlock = true;
    this.functionService.getAllFunction(obj).subscribe((data) => {
      // tslint:disable-next-line:no-string-literal
      this.functions = data.items;
      if (this.functions !== null && this.functions.length > 0) {
        this.TOTAL_COUNT = data.count;
        this.pager = new Pagination(this.TOTAL_COUNT, this.activePage, this.pageSize);
      } else {
        this.functions = null;
      }

    }, error => {
      setTimeout(() => {
        this.functions = null;
      }, 2000);
    });
  }

  editFunction(item: any): void {
    const data = {
      item
    };
    // tslint:disable-next-line:no-string-literal
    const dialogRef = this.dialog.open(PopupSystemAddFunctionComponent, DialogConfig.configDialog(data));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getAllFunction();
      }
    });
  }

  deleteFunction(item: any): void {
    item.number = 5;
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRef.afterClosed().subscribe(rs => {
        if (rs === 1) {

          // tslint:disable-next-line:no-shadowed-variable
          this.functionService.delete(item.id).subscribe(rs => {
            // tslint:disable-next-line:prefer-for-of
            for (let index = 0; index < rs.responseStatus.codes.length; index++) {
              if (rs.responseStatus.codes[index].code === '200') {
                this.notificationService.showSuccess('Xóa  thành công', '');
                this.getAllFunction();
              } else {
                this.notificationService.showError('Xóa  thất bại', '');
              }
            }
          }, err => {
          });
        }
      }
    );
  }

  changePageSize(size: string, index: any): void {
    // tslint:disable-next-line:radix
    this.pageSize = parseInt(size);
    // tslint:disable-next-line:radix
    const pageSize = parseInt(size);
    this.activePage = 1;
    this.getAllFunction();

  }

  setActionPage(page, index: any): void {
    this.activePage = page;
    this.getAllFunction();

  }
}
