import {FormGroup, ValidatorFn} from '@angular/forms';
import * as moment from 'moment';

export class DateUtilValidator {
  public validateDate1(): ValidatorFn {
    return (formGroup: FormGroup) => {
      const dateOfBirth = formGroup.get('dateOfBirth');
      const identifyDate = formGroup.get('identifyDate');

      if (!dateOfBirth || !identifyDate) {
        return null;
      }
      // const now = moment(new Date(moment().format('yyyy-MM-DD')))
      // let cond = moment(new Date(control.value)).diff(now, 'day')
      // return cond > 0 ? {'futureDate': {isFuture: true, value: control.value}} : null;
      const dateOfBirthValue = dateOfBirth.value;
      const identifyDateValue = identifyDate.value;
      const dayDif = moment(dateOfBirthValue).diff(identifyDateValue, 'day');

      // console.log(dayDif);
      if (dayDif >= 0) {
        // console.log('test');
        return { roomOnlyWith18: true }; // This is our error!
      }
      return null;

    };
  }
}
