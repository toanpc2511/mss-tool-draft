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

export class TrimValidatorHelper {
  ///This is the guts of Angulars minLength, added a trim for the validation
  static required(control: AbstractControl): ValidationErrors | null {
    return isEmptyInputValue(control.value) ? { required: true } : null;
  }
}

function isEmptyInputValue(value: any): boolean {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return !value?.replaceAll(/^\s+|\s+$|\s+(?=\s)/g, '');
}


