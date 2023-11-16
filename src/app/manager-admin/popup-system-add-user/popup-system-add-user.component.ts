import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {ThemePalette} from '@angular/material/core';
import {TitleService} from "../../_services/title.service";
import {BranchModels} from "../../_models/branch";
import {Title} from "../../_models/title";
import {UserService} from "../../_services/user.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserFormValidator, UserInfo, UserUpdateForm} from "../../_models/user";
import {NotificationService} from "../../_toast/notification_service";
import { RoleService } from 'src/app/_services/role.service';
import { Role } from 'src/app/_models/role';
@Component({
  selector: 'app-popup-system-add-user',
  templateUrl: './popup-system-add-user.component.html',
  styleUrls: ['./popup-system-add-user.component.scss']
})
export class PopupSystemAddUserComponent implements OnInit {
  color: ThemePalette = 'primary'
  // this is hard fix data
  selectAllTitle: boolean
  selectAllRoles: boolean
  isUnlocked: boolean
  lstBranch: BranchModels[] = []
  lstTitles: Title[] = []
  lstRole:Role[] = []
  userForm: FormGroup
  userForms: string[] = [ "employeeId", "fullName", "department", "phone", "email", "branchIds", "titleIds", "userCore", "userName","roleIds"]
  userInfo: UserInfo
  errorCodes: []
  submitted: boolean
  dropdownSettings: any = {}
  selectedItems: any[]
  formValidator: UserFormValidator
  constructor(@Inject(MAT_DIALOG_DATA)public data:any,
              private dialogRef:MatDialogRef<PopupSystemAddUserComponent>,
              private titleService: TitleService,
              private userService: UserService,
              private notificationService: NotificationService,
              private _el: ElementRef,
              private rolesService:RoleService
  ) { }
  ngOnInit() {
    this.userFormConstructor()
    this.formValidatorConstructor()
    this.onUnlockedChange()
  }
  formValidatorConstructor() {
    // this.formValidator = {
    //   // userAd: false,
    //   employeeId: false,
    //   fullName: false,
    //   department: false,
    //   phone: false,
    //   email: false,
    //   branchIds: false,
    //   titleIds: false,
    //   userCore: false,
    //   userName: false,
    // }
    this.formValidator = new UserFormValidator()
  }
  userFormConstructor() {
    this.userForm = new FormGroup({
      // userAd: new FormControl({ value: '', disabled: !this.isUnlocked }, Validators.required, ),
      employeeId: new FormControl({ value: '', disabled: !this.isUnlocked }, Validators.required),
      fullName: new FormControl({ value: '', disabled: !this.isUnlocked }, Validators.required),
      department: new FormControl({ value: '', disabled: !this.isUnlocked }, Validators.required),
      phone: new FormControl({ value: '', disabled: !this.isUnlocked }, Validators.required),
      email: new FormControl({ value: '', disabled: !this.isUnlocked },[Validators.required,Validators.email]),
      validFrom: new FormControl({ value: '', disabled: true }),
      validTo: new FormControl({ value: '', disabled: true }),
      branchIds: new FormControl({ value: '', disabled: !this.isUnlocked }, Validators.required),
      titleIds: new FormControl({ value: '', disabled: !this.isUnlocked },Validators.required),
      userCore: new FormControl({ value: '', disabled: !this.isUnlocked }, Validators.required),
      userName: new FormControl({ value: '', disabled: !this.isUnlocked }, Validators.required),
      roleIds:new FormControl({ value: '', disabled: !this.isUnlocked })
    })
  }
  get f() {
    return this.userForm.controls;
  }
  closeDialog(index: any){
    // 1: add new; 0: cancel request
    this.dialogRef.close(0)

  }
  saveUser(index: any){
    if (index == true) {
      this.submitted = true;
      if (this.userForm.invalid || this.userFormValidator()) {
        return
      }
      this.userInfo = new UserInfo(this.userForm.controls);
      if(this.userInfo.titleIds.length === 0){
        this.userInfo.titleIds = []
      }
      if(this.userInfo.roleIds.length === 0){
        this.userInfo.roleIds = []
      }
      this.userService.addUser(this.userInfo).subscribe(data =>{
        this.messageHandler(data)
      },
        error => {this.notificationService.showError("Có lỗi xảy ra", "Thông báo")})
    }
  }
  onInput(controlName: string = '') {
    if (controlName == 'titleIds' || controlName == 'roleIds') {
      this.formValidator[controlName] = this.userForm.get(controlName).value.length == 0
    } else {
      this.formValidator[controlName] = this.userForm.get(controlName).value.trim() == ""
    }
  }
  keyPress(event: KeyboardEvent) {
    const initalValue = event.key
    this._el.nativeElement.value = initalValue.replace(/[a-zA-Z0-9]*/g, '');
    if (initalValue.indexOf(' ') >= 0) {
      event.preventDefault();
    }else{
      if(initalValue === this._el.nativeElement.value){
        event.preventDefault();
      }
    }
  }
  keyPressSpace(event: KeyboardEvent) {
    const initalValue = event.key
    if (initalValue.indexOf(' ') >= 0) {
      event.preventDefault();
    }
  }
  keyPressSymbol(event: KeyboardEvent) {
    const initalValue = event.key
    this._el.nativeElement.value = initalValue.replace(/[a-zA-Z0-9]*/g, '');
    if(initalValue === this._el.nativeElement.value){
      event.preventDefault();
    }
  }
  userFormValidator() {
    this.userForms.forEach(controlName => {
      this.onInput(controlName)
    })
    // return (
    //   // this.formValidator['userAd'] &&
    //   this.formValidator['employeeId'] &&
    //   this.formValidator['fullName'] &&
    //   this.formValidator['email'] &&
    //   this.formValidator['branchIds'] &&
    //   this.formValidator['titleIds'] &&
    //   this.formValidator['userCore'] &&
    //   this.formValidator['userName']
    // )
    return this.formValidator.validate()
  }
  messageHandler(data: any) {
    let resStatusSuccess = data.responseStatus.success
    if (resStatusSuccess) {
      //notice success
      this.notificationService.showSuccess("Thêm mới người dùng thành công", "Thông báo")
      this.dialogRef.close(1);
    } else {
      //notice fail
      this.errorCodes = data.responseStatus.codes
      if(this.errorCodes.length > 0){
        data.responseStatus.codes.map(code => {
          if(code.code == "204" || code.code == "201"){
            let errorMsg = code.detail + ': ' + code.msg
            this.notificationService.showError(errorMsg, "Thông báo")
          }else if(code.code == "302" && code.detail == "userCore exists"){
            this.notificationService.showError("UserCore tồn tại", "Thông báo")
          }else if(code.code == "302" && code.detail == "userName exists"){
            this.notificationService.showError("Username tồn tại", "Thông báo")
          }else if(code.code == "302" && code.detail == "employeeId exists"){
            this.notificationService.showError("Mã nhân viên tồn tại", "Thông báo")
          }
          else{
            this.notificationService.showError("Có lỗi xảy ra", "Thông báo")
          }
        })
      }else{
        this.notificationService.showError("Có lỗi xảy ra", "Thông báo")
      }
    }
  }

  onUnlockedChange() {
    this.toggleDisable()
    //If user has unlocked right
    if (this.isUnlocked) {
      //get list branch
      this.getLstBranch()
      //get list title
      this.getLstTitle()
      this.getLstRoles()
    }
  }
  // unlock all field
  toggleDisable() {
    this.userForms.forEach(control => {
      this.userForm.get(control).reset({ value: this.userForm.get(control).value, disabled: !this.isUnlocked });
      }
    )
  }
  getLstBranch() {
    let obj = {}
    obj["page"] = 1
    obj["size"] = 1000
    this.titleService.getAllBranch(obj).subscribe(rs => {
      this.lstBranch = rs.items
    }, err => {
      // debugger
    })
  }
  getLstTitle() {
    this.titleService.getAllTitle().subscribe(rs => {
      this.lstTitles = rs.items
      if (this.lstTitles !== null && this.lstTitles.length > 0) {
      } else {
        this.lstTitles = null
      }
    }, err => {
      this.lstTitles = null
      // debugger
    })
  }
  getLstRoles() {
    this.rolesService.getLstAllRoles().subscribe(rs => {
      this.lstRole = rs.items
    }, err => {
      this.lstRole = null
      // debugger
    })
  }
  toggleSelectAllTitle(checked: boolean) {
    return checked ?
      this.userForm.get('titleIds').reset({ value: this.lstTitles.map(title => title.id), disabled: !this.isUnlocked }) :
      this.userForm.get('titleIds').reset({ value: [], disabled: !this.isUnlocked })
  }
  toggleSelectAllRoles(checked: boolean) {
    return checked ?
      this.userForm.get('roleIds').reset({ value: this.lstRole.map(title => title.id), disabled: !this.isUnlocked }) :
      this.userForm.get('roleIds').reset({ value: [], disabled: !this.isUnlocked })
  }
}
