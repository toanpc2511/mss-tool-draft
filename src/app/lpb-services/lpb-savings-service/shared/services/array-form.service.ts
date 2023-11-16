import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NO_EMIT } from '../constants/common';

@Injectable({
  providedIn: 'root',
})
export class ArrayFormService {
  constructor(private fb: FormBuilder) {}

  private create<Type>(row?: Type): FormGroup {
    const form = this.fb.group({ ...row });
    return form;
  }

  getDefaultArray<Type>(defaultRow: Type): FormArray {
    const formArray = this.fb.array([]);
    Array(1)
      .fill({ ...defaultRow })
      .forEach((row) => {
        formArray.push(this.create<Type>(row));
      });
    return formArray;
  }
  addFormArray<Type>({
    control,
    value,
    isReset,
  }: {
    control: FormArray;
    value?: Type;
    isReset?: boolean;
  }) {
    if (isReset) {
      control.reset(null, NO_EMIT);
    }
    const form = this.create<Type>(value);
    setTimeout(() => {
      control.push(form);
    });

    return form;
  }
  addMultipleFormArray<Type>({
    control,
    values,
    isReset,
  }: {
    control: FormArray;
    values?: Type[];
    isReset?: boolean;
  }) {
    if (isReset) {
      control.reset(null);
    }
    values?.forEach((form) => {
      this.addFormArray({
        control,
        value: { ...form },
      });
    });
  }
  addMultipleFromJSON<Type>({
    control,
    json,
    isReset,
  }: {
    control: FormArray;
    json?: string;
    isReset?: boolean;
  }) {
    try {
      const depositArray: Type[] = JSON.parse(json);
      this.addMultipleFormArray<Type>({
        control,
        values: depositArray,
        isReset,
      });
    } catch (error) {}
  }
}
