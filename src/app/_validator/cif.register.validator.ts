import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import * as moment from 'moment';
import { CommonService } from '../_services/common.service';
import { Observable } from 'rxjs';

// ngày tương lai
export function futureDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const value = moment(new Date(control.value));

  const cond = value.startOf('day').diff(moment().startOf('day'), 'days');

  return cond > 0 ? { futureDate: { isFuture: true, value: control.value } } : null;
}

export function futureDate1(control: AbstractControl): ValidationErrors | null {
  const now = moment(new Date(moment().format('yyyy-MM-DD')));
  const cond = moment(new Date(control.value)).diff(now, 'day');

  return cond > 0 ? { futureDate: { isFuture: true, value: control.value } } : null;
}

// ngày quá khứ
export function pastDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const value = moment(new Date(control.value));

  const cond = value.startOf('day').diff(moment().startOf('day'), 'days');

  return cond < 0 ? { pastDate: { isPast: true, value: control.value } } : null;
}

// ngày bắt đầu phải nhỏ hơn ngày kết thúc
export function BiggerDate(startDate: string, endDate: string): (group: FormGroup) => { [key: string]: any; } {
  return (group: FormGroup): { [key: string]: any } => {
    const start = moment(new Date(group.controls[startDate].value));
    const end = moment(new Date(group.controls[endDate].value));
    return (start.diff(end, 'day') <= 0) ?
      null :
      { smallerDate: { bigger: true, value: endDate } };
  };
}

// Ngày cấp phải lớn hơn ngày sinh
export function IssueDate(dateOfBirth: string, issueDate: string): (group: FormGroup) => { [key: string]: any; } {
  return (group: FormGroup): { [key: string]: any } => {

    // const start = moment(new Date(group.controls[dateOfBirth].value));
    // const end = moment(new Date(group.controls[issueDate].value));
    let start = group.controls[dateOfBirth].value;
    let end = group.controls[issueDate].value;
    if (!start || !end) {
      return null;
    }
    start = moment(new Date(start));
    end = moment(new Date(end));
    return (start.diff(end, 'day') <= 0) ?
      null :
      { smallerDate: { bigger: true, value: dateOfBirth } };
  };
}

/**
 * startDate < middleDate < endDate
 * @example 2021-01-01 < 2021-02-02 < 2022-12-30
 */
export function Bigger3Date(startDate: string, middleDate: string, endDate: string): (group: FormGroup) => { [key: string]: any; } {
  return (group: FormGroup): { [key: string]: any } => {
    const start = moment(new Date(group.controls[startDate].value));
    const middle = moment(new Date(group.controls[middleDate].value));
    const end = moment(new Date(group.controls[endDate].value));
    if (start.diff(middle, 'day') <= 0 && middle.diff(end, 'day') <= 0) {
      return null;
    } else if (start.diff(middle, 'day') > 0 && (middle.diff(end, 'day') <= 0)) {
      return { biggerDate: { bigger: true, value: middleDate } };
    } else if (start.diff(middle, 'day') <= 0 && middle.diff(end, 'day') > 0) {
      return { biggerDate: { bigger: true, value: endDate } };
    } else if (start.diff(middle, 'day') > 0 && !end.isValid()) {
      return { biggerDate: { bigger: true, value: middleDate } };
    } else if (start.diff(end, 'day') > 0 && !middle.isValid()) {
      return { biggerDate: { bigger: true, value: endDate } };
    } else {
      return { biggerDate: { bigger: true, value: '' } };
    }
  };
}

export function compareDate(perDocNoListField: string, dateOfBirthField: string): (group: FormGroup) => { [key: string]: any; } {
  return (group: FormGroup): { [key: string]: any } => {
    if (!group.controls[dateOfBirthField].value) {
      return null;
    }
    const dateOfBirth = moment(new Date(group.controls[dateOfBirthField].value));
    const perDocNoList = group.controls[perDocNoListField].value;
    let invalid = false;
    perDocNoList.forEach((item, index) => {
      if (item.issueDate) {
        const issueDate = moment(new Date(item.issueDate));
        const dayDif = moment(dateOfBirth).diff(issueDate, 'day');
        if (dayDif >= 0) {
          invalid = true;
          return;
        }
      }
    });
    return invalid ? { invalidDateOfBirth: true } : null;
    // }
  };
}


export function Bigger3Date2(startDate: string, middleDate: string, endDate: string): (group: FormGroup) => { [key: string]: any; } {
  return (group: FormGroup): { [key: string]: any } => {
    const start = moment(new Date(group.controls[startDate].value));
    const middle = moment(new Date(group.controls[middleDate].value));
    const end = moment(new Date(group.controls[endDate].value));
    if (start.diff(middle, 'day') <= 0 && middle.diff(end, 'day') <= 0) {
      return null;
    } else if (start.diff(middle, 'day') > 0 && (middle.diff(end, 'day') <= 0)) {
      return { biggerDate2: { bigger: true, value: middleDate } };
    } else if (start.diff(middle, 'day') <= 0 && middle.diff(end, 'day') > 0) {
      return { biggerDate2: { bigger: true, value: endDate } };
    } else if (start.diff(middle, 'day') > 0 && !end.isValid()) {
      return { biggerDate2: { bigger: true, value: middleDate } };
    } else if (start.diff(end, 'day') > 0 && !middle.isValid()) {
      return { biggerDate2: { bigger: true, value: endDate } };
    } else {
      return { biggerDate2: { bigger: true, value: '' } };
    }
  };
}

export function Bigger3Date3(startDate: string, middleDate: string, endDate: string): (group: FormGroup) => { [key: string]: any; } {
  return (group: FormGroup): { [key: string]: any } => {
    const start = moment(new Date(group.controls[startDate].value));
    const middle = moment(new Date(group.controls[middleDate].value));
    const end = moment(new Date(group.controls[endDate].value));
    if (start.diff(middle, 'day') <= 0 && middle.diff(end, 'day') <= 0) {
      return null;
    } else if (start.diff(middle, 'day') > 0 && (middle.diff(end, 'day') <= 0)) {
      return { biggerDate3: { bigger: true, value: middleDate } };
    } else if (start.diff(middle, 'day') <= 0 && middle.diff(end, 'day') > 0) {
      return { biggerDate3: { bigger: true, value: endDate } };
    } else if (start.diff(middle, 'day') > 0 && !end.isValid()) {
      return { biggerDate3: { bigger: true, value: middleDate } };
    } else if (start.diff(end, 'day') > 0 && !middle.isValid()) {
      return { biggerDate3: { bigger: true, value: endDate } };
    } else {
      return { biggerDate3: { bigger: true, value: '' } };
    }
  };
}

/**
 * @example '^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$' matched string is a valid email
 */
export function ForbiddenNameValidator(name: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const forbidden = name.test(control.value.toLowerCase());
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

/**
 * @example '^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$' matched string is a valid email
 */
export function CustomValidEmail(control: AbstractControl): ValidationErrors | null {
  const validEmailRegex = new RegExp('^[a-z][a-z0-9_.]{5,32}@[a-z0-9]{2,}(.[a-z0-9]{2,4}){1,2}$');
  const validEmail = validEmailRegex.test(control.value.toLowerCase());
  return validEmail ? null : { CustomValidEmail: { valid: false, value: control.value } };
}

export function dateValidator(form: FormGroup): ValidationErrors | null {
  const dateOfBirth = form.controls.dateOfBirth.value;
  const identifyDate = form.controls.identifyDate.value;
  const dayDif = moment(dateOfBirth).diff(identifyDate, 'day');

  return (dayDif >= 0) ? { validateDate: true } : null;
}

export function dateValidator2(form: FormGroup): ValidationErrors | null {
  const dateOfBirth = form.controls.dateOfBirth.value;
  const identifyDate = form.controls.dateOfAgreement.value;

  if (!dateOfBirth || !identifyDate) {
    return null;
  }
  const dayDif = moment(dateOfBirth).diff(identifyDate, 'day');
  return (dayDif >= 0) ? { validateDate: true } : null;
}

export function deliveryTypeCode(form: FormGroup): ValidationErrors | null {
  const deliveryChanelCode = form.controls.deliveryBranchCode.value;
  if (deliveryChanelCode === 'TAI_CHI_NHANH') {
    if (!deliveryChanelCode) {
      return { requiredBranchCode: true };
    }
  }
  return null;
}

export function existSoGTXM(commonService: CommonService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    const perDocTypeCode = control.get('perDocTypeCode').value;
    const perDocNo = control.get('perDocNo').value;
    return commonService.isExistIdentifyNumber2('1233', '4444').then(
      response => {
        return (response.items.length > 0) ? { isExist: true } : null;
      }
    );
  };
}

export function validateTaxCode(control: AbstractControl): { [key: string]: any } | null {
  // const validMSTRegex = new RegExp('^[a-zA-Z0-9\&/]*$');
  const validMSTRegex = new RegExp('^[0-9]*$');
  const validMST = validMSTRegex.test(control.value);
  if (validMST !== true) {
    return { stringInvalid: true };
  }
  if (control.value && control.value.length !== 10) {
    return { numberInvalid: true };
  }
  return null;
}

export function isDuplicate(array: FormArray, index): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    // tslint:disable-next-line:no-shadowed-variable
    let isExist = false;
    array.controls.forEach((x: FormGroup, index2) => {
      if (control.value === x.get('perDocTypeCode').value && index !== index2) {
        isExist = true;
      }
    });
    return isExist ? { isExistPerDocType: true } : null;
  };

}


export function is18YearOld(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  let value = control.value;
  if (typeof value === 'string') {
    value = moment(value);
  }
  const age = moment().diff(value, 'years');
  return age < 18 ? { is18YearOld: { isPast: true, value: control.value } } : null;
}

export function is14YearOld(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  let value = control.value;
  if (typeof value === 'string') {
    value = moment(value);
  }
  const age = moment().diff(value, 'years');
  return age < 14 ? { is14YearOld: { isPast: true, value: control.value } } : null;
}

export function is120YearOld(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  let value = control.value;
  if (typeof value === 'string') {
    value = moment(value);
  }
  const age = moment().diff(value, 'years');
  return age > 120 ? { is120YearOld: { isPast: true, value: control.value } } : null;
}

export function checkPhonesNumber(control: AbstractControl): ValidationErrors {
  const phoneNumber = control.value;
  let checkPhoneStatus = false;
  if (phoneNumber !== null) {
    const phonePreFix = JSON.parse(localStorage.getItem('listPrefixPhone'));
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < phonePreFix.length; i++) {
      const a = phoneNumber.startsWith(phonePreFix[i]);
      switch (a) {
        case true:
          checkPhoneStatus = true;
          break;
        default:
          break;
      }
    }
    return checkPhoneStatus === false ? { checkPhonesNumber: { isPast: true, value: control.value } } : null;
  }
}

export function check120YearOld(control: AbstractControl): ValidationErrors {
  const dateOfBirth = control.value;
  let check120Year = false;
  let value = control.value;
  if (typeof value === 'string') {
    value = moment(value);
  }
  const age = moment().diff(value, 'years');

  if (dateOfBirth !== null) {
    const age120YearOld = JSON.parse(localStorage.getItem('yearOldValidate'));
    let a: any;
    if (age <= age120YearOld){
      a = true;
    }
    switch (a) {
      case true:
        check120Year = true;
        break;
      default:
        break;
    }
    return check120Year === false ? { check120YearOld: { isPast: true, value: control.value } } : null;
  }
}
