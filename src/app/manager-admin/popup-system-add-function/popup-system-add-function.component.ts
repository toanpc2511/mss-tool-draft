import {Component, ElementRef, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {TitleService} from '../../_services/title.service';
import {NotificationService} from '../../_toast/notification_service';
import {PopupConfirmComponent} from '../../_popup/popup-confirm.component';
import {DialogConfig} from '../../_utils/_dialogConfig';
import {FunctionService} from '../../_services/function.service';

@Component({
  selector: 'app-popup-system-add-function',
  templateUrl: './popup-system-add-function.component.html',
  styleUrls: ['./popup-system-add-function.component.css']
})
export class PopupSystemAddFunctionComponent implements OnInit {
  functionForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<PopupSystemAddFunctionComponent>,
              private functionService: FunctionService,
              private notificationService: NotificationService,
              private _el: ElementRef) { }

  ngOnInit(): void {
    this.functionForm = new FormGroup({
      id: new FormControl(''),
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', Validators.required)
    });
    // console.log(this.data.data.item);
    if (this.data.data && this.data.data.item) {
      this.functionForm.patchValue({
        id: this.data.data.item.id,
        code: this.data.data.item.code,
        name: this.data.data.item.name
      });
    }
  }

  get f() {
    return this.functionForm.controls;
  }

  closeDialog(index: any): void {
    this.dialogRef.close(index);
  }

  onSave(index: any): void {

    if (!this.functionForm.invalid) {
      const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(0));
      dialogRef.afterClosed().subscribe(rs => {
        if (rs === 1) {
          this.functionService.createOrUpdate(this.functionForm.value).subscribe(rs => {
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
}
