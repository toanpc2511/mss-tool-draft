import { AbstractControl, ValidationErrors } from '@angular/forms';

export class ValidatorHelper {
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
