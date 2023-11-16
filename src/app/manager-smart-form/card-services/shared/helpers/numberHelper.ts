import { AbstractControl, ValidationErrors } from '@angular/forms';

export class NumberValidatorHelper {
  static required(control: AbstractControl): ValidationErrors | null {
    return isEmptyNumberValue(control.value) ? { required: true } : null;
  }
}
function isEmptyNumberValue(value: any): boolean {
  if (value === null) {
    return true;
  }

  if (typeof value === 'string' && value.trim() === ''){
    return true;
  }

  if (isNaN(value) || value === 0){
     return true;
  }

  return false;
}
