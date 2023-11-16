import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import * as moment from 'moment/moment';

export class LbpValidators {
  static requiredAllowEmpty(control: AbstractControl): ValidationErrors | null {
    if ([null, undefined].includes(control.value)) {
      return {required: true};
    }
    return null;
  }

  static dateRangeValidator(startDate: string, endDate: string, limitDate?: number): ValidatorFn {

    return (group: FormGroup): ValidationErrors => {
      // console.log(group.get(startDate).value, group.get(endDate).value)
      if (group.get(startDate).value && group.get(endDate).value) {
        const start = moment(group.get(startDate).value, 'DD/MM/YYYY');
        const end = moment(group.get(endDate).value, 'DD/MM/YYYY');
        const isRangeValid = (end.toDate().getTime() - start.toDate().getTime() >= 0);
        const isLimitDate = isRangeValid && end.diff(start, 'days') <= limitDate;
        if (limitDate && isLimitDate) {
          return isLimitDate ? null : {limitDate: true};
        }
        return isRangeValid ? null : {dateRange: true};

      } else {
        return null;
      }

    };
  }
}
