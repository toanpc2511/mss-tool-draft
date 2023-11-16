import { Component, OnInit } from '@angular/core';
import {PopupSystemAddActionComponent} from '../../../manager-admin/popup-system-add-action/popup-system-add-action.component';
import {DialogConfig} from '../../../_utils/_dialogConfig';
import {MatDialog} from '@angular/material/dialog';
import {Action, ActionRequest} from '../../../_models/action';
import {Pagination} from '../../../_models/pager';
import {ActionService} from '../../../_services/action.service';
import {findParentName} from '../../shared/functions/FindParentName';
import {MainFunction} from '../../../_models/mainFunction';
import {FunctionService} from '../../../_services/function.service';
import {getStatusCode} from '../../shared/functions/GetStatusCode';
import {PopupConfirmComponent} from '../../../_popup/popup-confirm.component';
import {NotificationService} from '../../../_toast/notification_service';
import {FormBuilder, FormControl} from '@angular/forms';
import {DOC_TYPES} from '../../../lpb-services/lpb-deposit-service/shared/constants/deposit-common';
@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {
  actionFormGroup = this.fb.group({
    functionCode: [''],
    parentId: [''],
    textSearch: ['']
  });
  actionCode: string;
  activePage = 1;
  pageSize = 10;
  pager: Pagination = new Pagination();
  actions: Action[] = [];
  feAction = [];
  lstAllAction: Action[] = [];
  TOTAL_COUNT: any;
  functionCode = new FormControl();
  lstAllFunction: MainFunction[] = [];
  cbActionUrl = '/admin/action/findParent';
  getStatusCode = getStatusCode;
  parentActionId = '';
  isAdmin = false;
  constructor(private dialog: MatDialog,
              private actionService: ActionService,
              private functionService: FunctionService,
              private notificationService: NotificationService,
              private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const roleCode = JSON.parse(localStorage.getItem('userRole')).code;
    this.isAdmin = roleCode === 'UNIFORM.BANK.QUANTRI' || roleCode === 'UNIFORM.BANK.SUB-ADMIN';
    this.getListAllAction();
    this.getListAllFunction();
    this.actionFormGroup.get('functionCode').valueChanges.subscribe((value) => {
      if (value) {
        this.cbActionUrl = '/admin/action/findParent?functionCode=' + value.code ;
        // this.searchAction(value.code);
      } else {
        // this.searchAction('');
      }
    });

    this.searchAction();

  }

  addAction(): void {
    // console.log(this.actionFormGroup.value);
    // this.actionFormGroup.get('functionCode').setValue('');
    const dialogRef = this.dialog.open(PopupSystemAddActionComponent, DialogConfig.configDialog(null));
    dialogRef.afterClosed().subscribe(rs => {
        if (rs === 1) {
          this.getAction();
        }
      }
    );
  }

  getAction(): any {
    const obj = new ActionRequest();
    obj.functionCode = this.actionFormGroup.value.functionCode?.code;
    obj.parentId = this.actionFormGroup.value.parentId;
    obj.page = this.activePage;
    obj.size = this.pageSize;
    obj.textSearch = this.actionFormGroup.value.textSearch;

    return this.actionService.getByFunctionCode(obj).subscribe(
      (data) => {
        // setTimeout(() => {
        // tslint:disable-next-line:no-string-literal
        this.actions = data['items'];
        this.feAction = data.items;
        this.actions.forEach(action => {

          const parentName = findParentName(action.parentId, this.lstAllAction);
          // action.name = parentName ? '[' + parentName + '] ' + action.name : action.name;
          action.parentName = parentName ? '[' + parentName + '] ' + action.name : action.name;
        });
        // this.lstAllAction = this.actions
        if (this.actions !== null && this.actions.length > 0) {
          this.TOTAL_COUNT = data.count;
          this.pager = new Pagination(this.TOTAL_COUNT, this.activePage, this.pageSize);
        } else {
          this.actions = null;
        }

        // }, 2000);
      }, error => {
        setTimeout(() => {
          this.actions = null;

        }, 2000);
      }
    );
  }

  getListAllAction(): void {
    this.actionService.getAllAction().subscribe(rs => {
      this.lstAllAction = rs.items;
    });
  }

  searchAction(): void {
    this.activePage = 1;
    this.pageSize = 10;
    this.getAction();
  }

  // tab dinh nghia quyen
  getListAllFunction(): void {
    this.functionService.getAll().subscribe(rs => {
      this.lstAllFunction = rs.items;
      this.lstAllFunction = this.lstAllFunction.sort((obj1, obj2) => {
        if (obj1.name > obj2.name) {
          return 1;
        }

        if (obj1.name < obj2.name) {
          return -1;
        }

        return 0;
      });

      // this.getListAllAction(index);
    });
  }

  editAction(item: any): void {
    const data = {
      item
    };
    // tslint:disable-next-line:no-string-literal
    const dialogRef = this.dialog.open(PopupSystemAddActionComponent, DialogConfig.configDialog(data));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getAction();
      }
    });
  }

  cloneAction(item: any): void {
    const data = {
      item
    };
    data.item.id = '';
    console.log(data);
    // tslint:disable-next-line:no-string-literal
    const dialogRef = this.dialog.open(PopupSystemAddActionComponent, DialogConfig.configDialog(data));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.getAction();
      }
    });
  }

  deleteAction(item: any): void {

    // tslint:disable-next-line:no-string-literal
    item['number'] = 5;
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        const id = {};
        // tslint:disable-next-line:no-string-literal
        id['id'] = item.id;
        // tslint:disable-next-line:no-shadowed-variable
        this.actionService.delete(item.id).subscribe(rs => {
          // tslint:disable-next-line:prefer-for-of
          for (let index = 0; index < rs.responseStatus.codes.length; index++) {
            if (rs.responseStatus.codes[index].code === '200') {
              this.notificationService.showSuccess('Chức danh xóa thành công', '');
              this.getAction();
            } else {
              this.notificationService.showError('Chức danh xóa thất bại', '');
            }
          }
        }, err => {
        });
      }
    });
  }

  setActionPage(page, index: any): void {
    this.activePage = page;

    this.getAction();

  }
  changePageSize(size: string, index: any): void {
    // tslint:disable-next-line:radix
    this.pageSize = parseInt(size);
    // tslint:disable-next-line:radix
    const pageSize = parseInt(size);
    this.activePage = 1;
    this.getAction();

  }
}
