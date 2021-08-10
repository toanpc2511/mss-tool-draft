/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FormControl, ValidationErrors, Validators } from '@angular/forms';

export class TValidators extends Validators {
  static patternNotWhiteSpace =
    (regex: RegExp) =>
    (control: FormControl): ValidationErrors | null => {
      const value = control.value;
      if (!value.trim()) {
        return { required: true };
      }
      if (!regex.test(value)) {
        return { pattern: !regex.test(value) };
      }
      return null;
    };
}
