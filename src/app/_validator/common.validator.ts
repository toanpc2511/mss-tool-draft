import {FormArray, FormControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function validateNationality(): ValidatorFn {
  return (form: FormArray): ValidationErrors | null => {
    let isExist = false;
    form.controls.forEach((x, index) => {
      const value = x.get('nationalityCode').value;
      form.controls.forEach((y, index2) => {
        const value2 = y.get('nationalityCode').value;
        if (value2 && value === value2 && index !== index2) {
          isExist = true;
        }
      });
    });

    if (isExist) {
      return {isExist: true};
    }
    return null;
  };
}
