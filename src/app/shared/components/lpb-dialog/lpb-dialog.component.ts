import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormHelpers } from '../../utilites/form-helpers';

export enum CONTROL_TYPES {
  text,
  number,
  checkbox,
  radio,
  select,
  textarea,
}
export interface IFormControl {
  type: CONTROL_TYPES;
  name: string;
  validates?: {
    validate: ValidationErrors | null;
    message: {
      type: string;
      content: string;
    };
  }[];
  disabled: boolean;
  defaultValue: any;
  label?: string;
  placeholder?: string;
  group?: {
    // for radio group
    value: any;
    label: string;
  }[];
  maxlength?: number;
  isHorizontal?: boolean;
}

export interface IDataDialogButtons {
  dismiss?: {
    display: boolean;
    label?: string;
    text?: string;
    color?: string;
    bgColor?: string;
    useValidate?: boolean;
  };
  confirm?: {
    display: boolean;
    label?: string;
    text?: string;
    color?: string;
    bgColor?: string;
    useValidate?: boolean;
  };
  customs?: {
    label?: string;
    type: string;
    color?: string;
    bgColor?: string;
    useValidate?: boolean;
  }[];
}

@Component({
  selector: 'app-lpb-confirm-dialog',
  templateUrl: './lpb-dialog.component.html',
  styleUrls: ['./lpb-dialog.component.scss'],
})
export class LpbDialogComponent implements OnInit {
  title: string;
  form: FormGroup;
  messages: string[];
  dataForm = {};
  CONTROL_TYPES = CONTROL_TYPES;
  buttons: IDataDialogButtons;
  className: string;

  checkboxArray = {};

  constructor(
    public dialogRef: MatDialogRef<LpbDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: IDataConfirmDialog
  ) {}
  ngOnInit(): void {
    this.title = this.data?.title;
    this.messages = this.data?.messages;
    this.buttons = this.data.buttons;
    this.className = this.data.className || '';
    this.initForm();
  }

  initForm(): void {
    if (this.data?.form) {
      this.data.form.forEach((c) => {
        this.setFormData(c);
      });

      if (Object.keys(this.dataForm || {}).length !== 0) {
        this.form = this.fb.group(this.dataForm);
      }
    }
  }

  setFormData(c: IFormControl): void {
    if (c.validates) {
      this.dataForm[c.name] = [
        { value: c.defaultValue || null, disabled: c.disabled || false },
        c.validates.map((e) => e.validate),
      ];
    } else {
      this.dataForm[c.name] = [
        { value: c.defaultValue || null, disabled: c.disabled || false },
      ];
    }
  }

  inputRadioChange(controlName: string, value: any): void {
    this.form
      ?.get(controlName.replace(' ', ''))
      .setValue(value, { onlySelf: true, emitEvent: false });
  }
  inputCheckBoxChange(e: MatCheckboxChange, { controlName, value }): void {
    const checked = e.checked;
    const control = this.form?.get(controlName.replace(' ', ''));
    let values = control.value || [];

    values.filter((e) => e !== value);

    if (checked) {
      values.push(value);
    }
    control.setValue(values, { onlySelf: true, emitEvent: false });
  }

  closeDialog(): void {
    this.dialogRef.close({ type: 'dismiss' });
  }

  confirmDialog(): void {
    if (
      this.buttons?.confirm?.useValidate === undefined ||
      this.buttons?.confirm?.useValidate === true
    ) {
      this.form?.markAllAsTouched();
      if (this.form?.invalid) {
        return;
      }
    }
    this.dialogRef.close({
      type: 'confirm',
      value: FormHelpers.trimValues(this.form?.getRawValue()) || true,
    });
  }
  customDialog(type: string, useValidate?: boolean): void {
    if (useValidate === undefined || useValidate === true) {
      this.form?.markAllAsTouched();
      if (this.form?.invalid) {
        return;
      }
    }

    this.dialogRef.close({
      type,
      value: FormHelpers.trimValues(this.form?.getRawValue()) || true,
    });
  }
}

export class IDataConfirmDialog {
  constructor(
    public title: string,
    public form: IFormControl[],
    public messages: string[],
    public buttons: IDataDialogButtons,
    public className?: string
  ) {}
}
