import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { PrintedCurrentForm } from '../../models/deposit';

@Component({
  selector: 'app-current-acc-form-print',
  templateUrl: './current-acc-form-print.component.html',
  styleUrls: ['./current-acc-form-print.component.scss'],
})
export class CurrentAccFormPrintComponent implements OnInit {
  form: FormGroup;
  txtType: 'acn' | 'gtxm' = 'acn';
  maxDate = new Date();

  FORM_VAL_ERRORS = {
    REQUIRED: 'required',
    INVALID_DATE: 'inValidDate',
    MAX_DATE: 'maxDate',
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CurrentAccFormPrintComponent>
  ) {
    this.form = this.data?.form;
  }

  ngOnInit() {
    this.form.markAsUntouched();
    if (this.form.get('docNum').value) {
      this.txtType = 'gtxm';
    } else {
      this.txtType = 'acn';
    }
    this.updateForm(this.txtType);
  }

  closeDialog(): void {
    this.dialogRef.close({ type: 'dismiss' });
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if(this.form.valid){
      this.dialogRef.close({ type: 'confirm'});
    }
  }

  changeTxtType(event: { target: HTMLInputElement }) {
    this.updateForm(this.txtType);
  }

  updateForm(txtType: 'acn' | 'gtxm') {
    const gtxmFieldNames = ['docNum', 'docIssueDate', 'docIssuePlace'];
    if (txtType === 'acn') {
      gtxmFieldNames.forEach((name) => {
        this.form.get(name).disable();
        this.form.get(name).setValue('');
      });

      this.form.get('acn').enable();
    } else {
      this.form.get('acn').disable();
      this.form.get('acn').setValue('');

      gtxmFieldNames.forEach((name) => {
        this.form.get(name).enable();
      });
    }
  }

  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }
}
