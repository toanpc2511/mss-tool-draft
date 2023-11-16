import { AbstractControl, ValidationErrors } from '@angular/forms';
  
export class ValidatorSpace {
    static cannotContainSpaceOTP(control: AbstractControl) : ValidationErrors | null {
        if((control.value as string).indexOf(' ') >= 0){
            return {cannotContainSpace: true}
        }
        if((control.value as string).toString() !== undefined && (control.value as string).toString() !== ""
         && (control.value as string).length >6){
            return {max7: true}
        }
        return null;
    }
    static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
        if(control.value !== null && control.value !== undefined){
            if((control.value as string).trim() === ""){
                return {cannotContainSpace: true}
            }  
        }
        return null;
    }
}