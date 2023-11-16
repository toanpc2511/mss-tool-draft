import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
export class FormHelpers {
  static clearFormControl(
    form: FormGroup,
    name: string,
    value: any = null
  ): void {
    form.controls[name]?.setValue(value);
  }

  static setFormError({
    control,
    errorName,
    message,
    form,
  }: {
    control: string | AbstractControl;
    errorName: string;
    message?: string;
    form?: FormGroup;
  }): void {
    if (typeof control === 'string') {
      control = form.get(control);
    }
    let newErrors = {};
    newErrors[errorName] = message ? { message } : true;

    if (control?.errors) {
      newErrors = { ...newErrors, ...control.errors };
    }
    control.setErrors(newErrors);
    control.markAsTouched();
  }

  static clearFormError(
    control: string | AbstractControl,
    errorName: string,
    form?: FormGroup
  ): void {
    if (typeof control === 'string') {
      control = form.get(control);
    }
    const crrErrors = control?.errors;
    if (crrErrors?.[errorName]) {
      const newErrors = {};
      Object.keys(crrErrors || {})
        .filter((key) => key !== errorName)
        .forEach((key) => {
          newErrors[key] = crrErrors[key];
        });
      control.setErrors(newErrors);
      if (Object.keys(newErrors || {})) {
        control.updateValueAndValidity();
      }
    }
  }
}
