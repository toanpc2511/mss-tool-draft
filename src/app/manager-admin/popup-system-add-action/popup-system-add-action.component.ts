import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FunctionService} from '../../_services/function.service';
import {NotificationService} from '../../_toast/notification_service';
import {PopupConfirmComponent} from '../../_popup/popup-confirm.component';
import {DialogConfig} from '../../_utils/_dialogConfig';
import {MainFunction} from '../../_models/mainFunction';
import {ActionService} from '../../_services/action.service';
import {Pagination} from '../../_models/pager';
import {Action, ActionRequest} from '../../_models/action';


@Component({
  selector: 'app-popup-system-add-action',
  templateUrl: './popup-system-add-action.component.html',
  styleUrls: ['./popup-system-add-action.component.css']
})
export class PopupSystemAddActionComponent implements OnInit, AfterViewInit {

  actionForm: FormGroup;
  lstAllFunction: MainFunction[] = [];
  listAction: Action[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<PopupSystemAddActionComponent>,
              private actionService: ActionService,
              private functionService: FunctionService,
              private notificationService: NotificationService,
              private _el: ElementRef) {
  }

  get functionId(): any {
    return this.actionForm.get('functionId');
  }

  ngOnInit(): void {

    this.actionForm = new FormGroup({
      id: new FormControl(''),
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      functionId: new FormControl(null, Validators.required),
      parentId: new FormControl(null),
      feUrl: new FormControl(null),
      imagePath: new FormControl(null),
      isMenu: new FormControl(false),
      method: new FormControl(null),
      tabOrder: new FormControl(null),
      description: new FormControl(null, Validators.required),
    });
    this.functionId.valueChanges.subscribe(functionId => {
      const functionCode = this.getFunctionCode(functionId);
      // console.log('functionCode',functionCode);
      const obj = new ActionRequest();
      obj.functionCode = functionCode;
      obj.page = 1;
      obj.size = 10000;
      // console.log(obj);
      this.actionService.getByFunctionCode(obj).subscribe(
        (data) => {
          // console.log(data);
          const parentIds = data.items.map((action) => {
            if (!action.parentId) {
              return action.id;
            } else {
              return null;
            }
          }).filter(item => item).join(',');
          this.listAction = data.items.filter(item => !item.parentId ||  parentIds.includes(item.parentId) || item.code.includes('DETAIL'));
          // this.listAction = this.listAction;
          // }, 2000);
        }, error => {
          setTimeout(() => {
            // this.actions = null;
            // this.displayProgressSpinnerInBlock = false;
          }, 2000);
        }
      );
    });
    this.functionService.getAll().subscribe(rs => {
      this.lstAllFunction = rs.items;
      // this.getListAllAction(index);
      // console.log(this.data.data.item);
      if (this.data.data && this.data.data.item) {
        this.actionForm.patchValue({
          id: this.data.data.item.id,
          code: this.data.data.item.code,
          name: this.data.data.item.name,
          url: this.data.data.item.url,
          functionId: this.data.data.item.functionId,
          feUrl: this.data.data.item.feUrl,
          imagePath: this.data.data.item.imagePath,
          isMenu: this.data.data.item.isMenu,
          parentId: this.data.data.item.parentId,
          method: this.data.data.item.method,
          tabOrder: this.data.data.item.tabOrder,
          description: this.data.data.item.description
        });
      }
    });


  }

  get f() {
    return this.actionForm.controls;
  }

  closeDialog(index: any): void {
    this.dialogRef.close(index);
  }

  onSave(index: any): void {

    if (!this.actionForm.invalid) {
      const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(0));
      dialogRef.afterClosed().subscribe(rs => {
        if (rs === 1) {
          this.actionService.createOrUpdate(this.actionForm.value).subscribe(rs => {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < rs.responseStatus.codes.length; i++) {
              if (rs.responseStatus.codes[i].code === '200') {
                this.notificationService.showSuccess('Cập nhập chức danh thành công', '');
                this.dialogRef.close(index);
              } else {
                if (rs.responseStatus.codes[i].code === '302' && rs.responseStatus.codes[i].detail === 'code exists') {
                  this.notificationService.showError('Mã chức danh đã tồn tại', '');
                } else if (rs.responseStatus.codes[i].code === '302' && rs.responseStatus.codes[i].detail === 'name exists') {
                  this.notificationService.showError('Tên chức danh đã tồn tại', '');
                } else {
                  this.notificationService.showError('Cập nhập chức danh thất bại', '');
                }
              }
            }
          }, err => {

          });
        }
      });
    }

  }

  getFunctionCode(functionId): any {
    let functionCode = '';
    this.lstAllFunction.forEach(functionName => {

      if (functionId === functionName.id) {
        // console.log(functionId, functionName.id, functionId === functionName.id, functionName.code);
        functionCode = functionName.code;
        return;
      }
    });
    return functionCode;
  }

  findParentName(parentId): string {
    const frontendAction = this.listAction.filter(action => action.feUrl);
    let parentName = '';
    for (const key in frontendAction) {
      if (frontendAction[key].id === parentId) {
        if (!frontendAction[key].parentId) {
          parentName = frontendAction[key].name;
        } else {
          parentName = this.findParentName(frontendAction[key].parentId) + ' - ' + frontendAction[key].name;
        }
      }
      // this.streets.push({
      //   textItem: frontendAction[key].name,
      //   pathImage: frontendAction[key].imagePath,
      //   urlRouter: frontendAction[key].feUrl
      // });
    }
    return parentName;
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}
