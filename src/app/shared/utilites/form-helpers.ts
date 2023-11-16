import { ElementRef } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { DATE_FORMAT_VN_SIMPLE } from 'src/app/lpb-services/lpb-savings-service/shared/constants/common';
import { ValidatorHelper } from './validators.helper';
import { FormControl } from '@angular/forms';

export class FormControlWarn extends FormControl { warnings: any; }

type FormParams = {
  control: string | AbstractControl;
  errorName: string;
  message?: string;
  form?: FormGroup;
};

type ControlWarningParams = {
  control: FormControlWarn;
  warningName: string;
  message?: string;
};

export class FormHelpers {
  static clearFormControl(
    form: FormGroup,
    name: string,
    value: any = null
  ): void {
    form.controls[name]?.setValue(value);
  }

  static setFormError({ control, errorName, message, form }: FormParams): void {
    if (!control) {
      return;
    }
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
  static validTwoDate(
    date1: AbstractControl,
    date2: AbstractControl,
    {
      required,
      checkRange,
      maxDate,
      minDate,
      updateValueAndValidity,
      rejectValidate,
    }: {
      required?: boolean;
      checkRange?: boolean;
      minDate?: Date | moment.Moment | string;
      maxDate?: Date | moment.Moment | string;
      updateValueAndValidity?: boolean;
      rejectValidate?: {
        minDate?: (1 | 2)[];
        maxDate?: (1 | 2)[];
      };
    } = {}
  ): void {
    let validateDate1 = {};
    let validateDate2 = {};
    if (rejectValidate) {
      if (rejectValidate.maxDate) {
        if (!checkRejectValidate(rejectValidate.maxDate, 1)) {
          validateDate1 = { ...validateDate1, maxDate };
        }
        if (!checkRejectValidate(rejectValidate.maxDate, 2)) {
          validateDate2 = { ...validateDate2, maxDate };
        }
      } else {
        validateDate1 = { ...validateDate1, maxDate };
        validateDate2 = { ...validateDate2, maxDate };
      }

      if (rejectValidate.minDate) {
        if (!checkRejectValidate(rejectValidate.minDate, 1)) {
          validateDate1 = { ...validateDate1, minDate };
        }
        if (!checkRejectValidate(rejectValidate.minDate, 2)) {
          validateDate2 = { ...validateDate2, minDate };
        }
      } else {
        validateDate1 = { ...validateDate1, minDate };
        validateDate2 = { ...validateDate2, minDate };
      }
    } else {
      validateDate1 = { maxDate, minDate };
      validateDate2 = { maxDate, minDate };
    }

    const validatorsDate1 = [
      ValidatorHelper.dateFormat(DATE_FORMAT_VN_SIMPLE, {
        ...validateDate1,
      }),
    ];
    const validatorsDate2 = [
      ValidatorHelper.dateFormat(DATE_FORMAT_VN_SIMPLE, {
        ...validateDate2,
      }),
    ];
    if (required) {
      validatorsDate1.push(Validators.required);
      validatorsDate2.push(Validators.required);
    }
    date1.setValidators(validatorsDate1);

    if (checkRange) {
      date2.setValidators([
        ...validatorsDate2,
        ValidatorHelper.dateRangeValidator(date1),
      ]);
    } else {
      date2.setValidators([...validatorsDate2]);
    }

    [date1, date2].forEach((date, i) => {
      const otherDate = i === 0 ? date2 : date1;
      date.valueChanges.subscribe(() => {
        otherDate.updateValueAndValidity({
          onlySelf: true,
          emitEvent: false,
        });
      });
    });

    if (updateValueAndValidity) {
      [date1, date2].forEach((date) => {
        date.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      });
    }

    function checkRejectValidate(array, number): boolean {
      if (!array || array.length <= 0) {
        return false;
      }
      return array.some((e) => e === number);
    }
  }

  static requiredOneInMany(controls: AbstractControl[]) {
    controls.forEach((c) => {
      const othersControls = controls.filter((e) => e !== c);
      c.setValidators(ValidatorHelper.requiredOneInMany(othersControls));
      c.valueChanges.subscribe((e) => {
        othersControls.forEach((o) => {
          o.updateValueAndValidity({ onlySelf: true, emitEvent: false });
        });
      });
    });
  }

  static clearFormError({ control, errorName, form }: FormParams): void {
    if (typeof control === 'string') {
      control = form.get(control);
    }
    const crrErrors = control?.errors;
    if (crrErrors?.[errorName]) {
      let newErrors = {};
      Object.keys(crrErrors || {})
        .filter((key) => key !== errorName)
        .forEach((key) => {
          newErrors[key] = crrErrors[key];
        });

      if (Object.keys(newErrors).length === 0) {
        newErrors = null;
      }
      control.setErrors(newErrors);
    }
  }

  static setFormWarning({
    control,
    warningName,
    message,
  }: ControlWarningParams): void {
    if (control && warningName) {
      let newWarnings = control?.warnings ? control?.warnings : {};
      newWarnings = { ...newWarnings, [warningName]: message ? message : true };
      control.warnings = newWarnings;
    }
  }

  static clearFormWarning({
    control,
    warningName,
  }: ControlWarningParams): void {
    if (control?.warnings && warningName) {
      const newWarningNames = Object.keys(control.warnings).filter(
        (key) => key !== warningName
      );

      const newWarnings = {};
      newWarningNames.forEach((name) => {
        newWarnings[name] = control.warnings[name];
      })
      control.warnings = newWarnings;
    }
  }

  static isValidClass(control: any): string {
    if (control.errors && (control.dirty || control.touched)) {
      return 'is-invalid';
    } else {
      return '';
    }
  }

  static focusToInValidControl = debounce(
    async (
      formRef: ElementRef,
      { openAllCollapse }: { openAllCollapse?: (random: number) => void } = {}
    ): Promise<void> => {
      if (openAllCollapse) {
        openAllCollapse(Math.floor(Math.random() * 100000) + 1);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      let inValidElement = formRef.nativeElement.querySelector(
        `input.ng-invalid:not(.hidden-input-money),
        .ng-invalid:not(.form-group):not(.form-array) input,
        input.haveError,
        .ng-invalid.input-error`
      );
      if (!inValidElement) {
        const filter = Array.prototype.filter;
        const inValidElements = formRef.nativeElement.querySelectorAll(
          '.ng-invalid.form-array table td'
        );
        const filtered = filter.call(inValidElements, function (e) {
          return e.querySelector('.array-errored');
        });

        inValidElement = filtered?.[0]?.querySelector(
          `input:not(.hidden-input-money),
          .input-error`
        );
      }

      inValidElement?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
      if (openAllCollapse) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      inValidElement?.focus({ preventScroll: true });
    },
    200
  );

  static trimValues(obj): any {
    return trimValues(obj);
  }
}
function debounce(callback, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function trimValues(obj): any {
  if (!obj) {
    return obj;
  }
  // base case: if obj is a string, trim it and return it
  if (typeof obj === 'string') {
    return obj.trim();
  }
  // recursive case: if obj is an object or an array, loop through its values and trim them
  if (typeof obj === 'object') {
    let newObj = {};
    Object.entries(obj).forEach(([key, value]) => {
      // use recursion to trim the value
      newObj[key] = trimValues(value);
    });
    return newObj;
  }
  // otherwise, return obj as it is
  return obj;
}
