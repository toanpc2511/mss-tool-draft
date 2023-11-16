import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/_models/role';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { RoleService } from 'src/app/_services/role.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';

@Component({
  selector: 'app-popup-system-edit-role',
  templateUrl: './popup-system-edit-role.component.html',
  styleUrls: ['./popup-system-edit-role.component.scss']
})
export class PopupSystemEditRoleComponent implements OnInit {
  objRole: Role = new Role()
  editRoleForm: FormGroup
  submitted = false
  validateCode = false
  validateName = false
  lstStatus = [
    { statusCode: 'A', name: 'Hoạt động' },
    { statusCode: 'I', name: 'Không hoạt động' },
    { statusCode: 'C', name: 'Đóng' }
  ]
  statusCode: any
  code: any
  name: any
  description: any
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private dialogRef: MatDialogRef<PopupSystemEditRoleComponent>, private roleService: RoleService,
    private notificationService: NotificationService,private _el: ElementRef) { }
  ngOnInit() {
    // this.objTitle = this.data.data
    this.code = this.data.data.code
    this.name = this.data.data.name
    this.description = this.data.data.description
    this.objRole.id = this.data.data.id
    // this.objTitle.code = this.data.data.id
    this.lstStatus.forEach(e => {
      if (e.statusCode === this.data.data.statusCode) {
        this.statusCode = e.statusCode
        this.objRole.statusCode = this.statusCode
      }
    });
    this.editRoleForm = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      statusCode: new FormControl('')
    });
  }
  get f() {
    return this.editRoleForm.controls;
  }
  selectTitle(item: any) {
    this.objRole.statusCode = item
  }
  keyPress(event: KeyboardEvent) {
    const initalValue = event.key
    this._el.nativeElement.value = initalValue.replace(/[a-zA-Z0-9|._]*/g, '');
    if (initalValue.indexOf(' ') >= 0) {
      event.preventDefault();
    }else{
      if(initalValue === this._el.nativeElement.value){
        event.preventDefault();
      }
    }
  }
  editRole(index: any) {
    this.submitted = true
    if (this.code !== undefined) {
      this.validateCode = this.code.trim() === "" ? true : false
    }
    if (this.name !== undefined) {
      this.validateName = this.name.trim() === "" ? true : false
    }
    if (this.editRoleForm.invalid || this.validateCode || this.validateName) {
      return;
    }
    this.objRole.code = this.code
    this.objRole.name = this.name
    this.objRole.description = this.description
    if (this.objRole.statusCode == this.data.data.statusCode) {
      this.callApi()
    } else {
      let data = {}
      data['number'] = 0
      let dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(data))
      dialogRef.afterClosed().subscribe(rs => {
        if (rs == 1) {
          this.callApi()
        }
      })
    }
  }
  callApi() {
    this.roleService.updateRole(this.objRole).subscribe(rs => {
      for (let index = 0; index < rs.responseStatus.codes.length; index++) {
        if (rs.responseStatus.codes[index].code === "200") {
          this.notificationService.showSuccess("Cập nhập quyền thành công", "")
          this.dialogRef.close(index);
        } else {
          if(rs.responseStatus.codes[index].code === "302"){
            this.notificationService.showError("Mã quyền đã tồn tại", "")
          }else{
            this.notificationService.showError("Cập nhập quyền thất bại", "")
          }
          
        }
      }

    }, err => {

    })
  }
  closeDialog(index: any) {
    this.dialogRef.close(index);
  }
}
