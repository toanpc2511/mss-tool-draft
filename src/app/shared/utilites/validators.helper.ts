import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';
import { DATE_FORMAT_VN_SIMPLE } from 'src/app/lpb-services/lpb-savings-service/shared/constants/common';

export class ValidatorHelper {
  ///This is the guts of Angulars minLength, added a trim for the validation
  static required(control: AbstractControl): ValidationErrors | null {
    return isEmptyInputValue(control.value) ? { required: true } : null;
  }
  static requiredOneInTwo(control1: AbstractControl): ValidatorFn {
    // return a function that takes another control as an argument
    return (control2: AbstractControl): ValidationErrors | null => {
      return isEmptyInputValue(control1.value) &&
        isEmptyInputValue(control2.value)
        ? { requiredOneInTwo: true }
        : null;
    };
  }
  static requiredOneInMany(
    controls: AbstractControl[]
  ): ValidatorFn | ValidatorFn[] {
    return (control: AbstractControl): ValidationErrors | null => {
      const allCtrl = controls.concat(control);
      const checkEmpty = allCtrl.every((c) => {
        return isEmptyInputValue(c.value);
      });
      return checkEmpty ? { requiredOneInMany: true } : null;
    };
  }

  static dateFormat(
    format: string,
    {
      minDate,
      maxDate,
    }: {
      minDate?: Date | moment.Moment | string;
      maxDate?: Date | moment.Moment | string;
    } = {}
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control?.value) {
        return null;
      }

      const date = getDate(control.value, format);
      if (!date.isValid()) {
        return { inValidDate: true };
      }

      if (maxDate) {
        const maxDateMoment = getDate(maxDate, format);
        if (date.isAfter(maxDateMoment)) {
          return {
            maxDate: {
              currentDate: date.format(format),
              maxDate: maxDateMoment.format(format),
            },
          };
        }
      }
      if (minDate) {
        const minDateMoment = getDate(minDate, format);
        if (date.isBefore(minDateMoment)) {
          return {
            minDate: {
              currentDate: date.format(format),
              minDate: minDateMoment.format(format),
            },
          };
        }
      }

      return null;
    };
  }

  // Extracted method

  static dateRangeValidator(
    fromDateControl: AbstractControl
  ): ValidatorFn | null {
    return (toDateControl: AbstractControl): ValidationErrors | null => {
      const fromDate = fromDateControl.value;
      const toDate = toDateControl.value;
      if (fromDate && toDate) {
        if (
          moment(fromDate, DATE_FORMAT_VN_SIMPLE).isAfter(
            moment(toDate, DATE_FORMAT_VN_SIMPLE)
          )
        ) {
          return { dateRangeError: true };
        }
      }
      return null;
    };
  }
}

export class NumberValidatorHelper {
  static required(control: AbstractControl): ValidationErrors | null {
    return isEmptyNumberValue(control.value) ? { required: true } : null;
  }
}

function isEmptyInputValue(value: any): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return !value?.replaceAll(/^\s+|\s+$|\s+(?=\s)/g, '');
}
function isEmptyNumberValue(value: any): boolean {
  if (value === null) {
    return true;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }

  if (isNaN(value) || value === 0) {
    return true;
  }

  return false;
}

function getDate(value: any, format: string): moment.Moment {
  if (moment.isMoment(value)) {
    return value;
  } else if (value instanceof Date) {
    return moment(value);
  } else {
    return moment(value, format, true);
  }
}

export function viRegStr(): string {
  const reg1 =
    'á|à|ạ|ả|ã|â|ấ|ầ|ậ|ẩ|ẫ|ă|ắ|ằ|ặ|ẳ|ẵ|Á|À|Ạ|Ả|Ã|Â|Ấ|Ầ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ';
  const reg2 = 'é|è|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ể|ễ|É|È|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ';
  const reg3 = 'í|ì|ị|ỉ|ĩ|Í|Ì|Ị|Ỉ|Ĩ';
  const reg4 =
    'ó|ò|ọ|ỏ|õ|ô|ố|ồ|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ|Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ';
  const reg5 = 'ú|ù|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ|Ú|Ù|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ';
  const reg6 = 'ý|ỳ|ỵ|ỷ|ỹ|Ý|Ỳ|Ỵ|Ỷ|Ỹ';
  const reg7 = 'Đ|đ';

  const regLst = [reg1, reg2, reg3, reg4, reg5, reg6, reg7];
  const viRegexStr = regLst.reduce((acc, crr, index) => {
    if (index === regLst.length - 1) {
      return acc + crr;
    }

    return acc + crr + '|';
  }, '');
  return viRegexStr;
}
