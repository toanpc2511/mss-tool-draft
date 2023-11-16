import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title } from 'src/app/_models/title';
import { TitleService } from 'src/app/_services/title.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ValidatorSpace } from 'src/app/_validator/otp.validator';
@Component({
  selector: 'app-popup-system-add-title',
  templateUrl: './popup-system-add-title.component.html',
  styleUrls: ['./popup-system-add-title.component.scss']
})
export class PopupSystemAddTitleComponent implements OnInit {
  loginForm: FormGroup
  submitted = false
  validateCode = false
  validateName = false
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<PopupSystemAddTitleComponent>, private titleService: TitleService,
    private notificationService:NotificationService,private _el: ElementRef) { }
  objTitle: Title = new Title()
  ngOnInit() {
    this.loginForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
      name: new FormControl('', Validators.required),
      description: new FormControl('' )
    });
  }
  get f() {
    return this.loginForm.controls;
  }
  keyPress(event: KeyboardEvent) {
    const initalValue = event.key
    this._el.nativeElement.value = initalValue.replace(/[a-zA-Z0-9._]*/g, '');
    if (initalValue.indexOf(' ') >= 0) {
      event.preventDefault();
    }else{
      if(initalValue === this._el.nativeElement.value){
        event.preventDefault();
      }
    }
  }
  saveTitle(index: any) {
    this.submitted = true
    if(this.objTitle.code !== undefined){
      this.validateCode = this.objTitle.code.trim() === "" ? true : false
    }
    if(this.objTitle.name !== undefined){
      this.validateName = this.objTitle.name.trim() === "" ? true : false
    }
    if (this.loginForm.invalid || this.validateCode || this.validateName) {
      return;
    }
    this.titleService.addTitle(this.objTitle).subscribe(rs => {
      for (let i = 0; i < rs.responseStatus.codes.length; i++) {
        if(rs.responseStatus.codes[i].code === "200"){
          this.notificationService.showSuccess("Thêm chức danh thành công", "")
          this.dialogRef.close(index);
        }else{
          if(rs.responseStatus.codes[i].code === "302" && rs.responseStatus.codes[i].detail == "code exists"){
            this.notificationService.showError("Mã chức danh đã tồn tại", "")
          }else if(rs.responseStatus.codes[i].code === "302" && rs.responseStatus.codes[i].detail == "name exists"){
            this.notificationService.showError("Tên chức danh đã tồn tại", "")
          }else{
            this.notificationService.showError("Thêm chức danh thất bại", "")
          }
        }
      }
    }, err => {
      // console.log(err);
    })
  }
  closeDialog(index: any) {
    this.dialogRef.close(index);
  }
}
