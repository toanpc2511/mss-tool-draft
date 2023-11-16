import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';

import { BasicSavingService } from '../../../../services/basic-saving.service';
import { Category } from '../../../../models/saving-basic';
import { UDF_FIELDS_NAME } from '../../../../constants/saving-basic';

@Component({
  selector: 'app-dialog-udf',
  templateUrl: './dialog-udf.component.html',
  styleUrls: [
    '../../../../styles/common.scss',
    '../../../../styles/dialog.scss',
    './dialog-udf.component.scss',
  ],
})
export class DialogUDFComponent implements OnInit {
  FORM_VAL_ERRORS = {
    REQUIRED: 'required',
    NO_EXIST: 'noExist',
  };

  //tooltip
  depositAmountsToolTip = '';
  depositMoneyToolTip = '';
  mechanismToolTip = '';

  udfCategoryData: { [key: string]: Category[] } = {};

  @ViewChild('formAddUdf') formAddUdf: ElementRef;
  // @ViewChild('depositAmounts') depositAmountsRef: ElementRef;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogUDFComponent>,
    private basicSavingService: BasicSavingService
  ) {
    Object.values(UDF_FIELDS_NAME).forEach((fieldName) => {
      this.udfCategoryData[fieldName] = [];
    });

    this.basicSavingService.getCategoryList().subscribe(
      (res) => {
        const categoryDict = {};
        res.data.forEach((record) => {
          const category = record.category;
          let crrCategoryList = categoryDict?.[UDF_FIELDS_NAME?.[category]];

          if (crrCategoryList) {
            categoryDict[UDF_FIELDS_NAME?.[category]].push(record);
          } else {
            categoryDict[UDF_FIELDS_NAME?.[category]] = [record];
          }
        });
        this.udfCategoryData = categoryDict;
      },
      (error) => {}
    );
  }

  get isDetail(): boolean {
    return this.data?.isDetail;
  }
  get form(): FormGroup {
    return this.data?.form;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  closeDialog(): void {
    this.dialogRef.close({ type: 'dismiss' });
  }
  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      FormHelpers.focusToInValidControl(this.formAddUdf);
      return;
    }
    this.dialogRef.close({
      type: 'submit',
      data: FormHelpers.trimValues(this.form.getRawValue()),
    });
  }

  changePGDBD(event: { target: HTMLInputElement }) {
    const pgdbd = event.target.value;
    if (!pgdbd) {
      return;
    }

    if (pgdbd?.length === 3) {
      this.basicSavingService.getPGDBD(pgdbd).subscribe((res) => {
        if (res && res.data) {
          this.form.get('pgdbd').setValue(res.data.poOldBranchCode);
        } else {
          FormHelpers.setFormError({
            control: this.form.get('pgdbd'),
            errorName: this.FORM_VAL_ERRORS.NO_EXIST,
          });
        }
      });
    } else if (pgdbd?.length === 6) {
    } else {
      FormHelpers.setFormError({
        control: this.form.get('pgdbd'),
        errorName: this.FORM_VAL_ERRORS.NO_EXIST,
      });
    }
  }

  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }
}

export class IDataConfirmDialog {
  constructor(public form: FormGroup, public isDetail: boolean) {}
}
