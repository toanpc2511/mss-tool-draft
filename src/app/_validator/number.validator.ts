import {AbstractControl, ValidationErrors} from "@angular/forms";

// la so hay khong
export function isNumeric(control: AbstractControl) : ValidationErrors | null {
  return (typeof parseInt(control.value) == 'number' && !isNaN(control.value)) ? null :
    { 'isNumeric' : { isNumeric : true, value: control.value} }
}
