import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SERVICE_TYPE_ARR, SERVICE_TYPE_CODE } from '../../constants/common';
import { CustomerUserInfo } from '../../models/common';

@Component({
  selector: 'app-lv24-form',
  templateUrl: './lv24-form.component.html',
  styleUrls: ['./lv24-form.component.scss', '../../styles/common.scss'],
})
export class Lv24FormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() customerUserInfo: CustomerUserInfo;
  @Input() isDetail: boolean = false;

  SERVICE_TYPE_ARR = SERVICE_TYPE_ARR;

  FORM_VAL_ERRORS = {
    REQUIRED: 'required',
    NO_EXIST: 'noExist',
  };

  constructor() {}

  ngOnInit() {
    this.form.get('serviceCode')?.valueChanges.subscribe((serviceCode) => {
      if (!serviceCode) {
        this.form.get('reason').setValue('');
        return;
      }

      if (serviceCode === SERVICE_TYPE_CODE.RESET_PASSWORD) {
        this.form.get('reason').setValue('Reset mật khẩu');
      } else {
        this.form.get('reason').setValue('KH yêu cầu');
      }
    });
  }
  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }
}
