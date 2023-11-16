import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { ValidatorHelper } from 'src/app/shared/utilites/validators.helper';

import {
  DOC_TYPES,
  DOC_TYPES_VI,
  FORM_VAL_ERRORS,
  NO_EMIT,
  RESIDENTS,
} from '../../../../constants/common';
import { LEGAL_REPRESENTATIVE } from '../../../../models/saving-basic';
import { FormSavingHelpers } from '../../../../utilites/form-saving-helpers';
import { GENDERS, RELATIONS } from '../../../../constants/saving-basic';

@Component({
  selector: 'app-dialog-form-legal-representative',
  templateUrl: './dialog-form-legal-representative.component.html',
  styleUrls: [
    '../../../../styles/common.scss',
    '../../../../styles/dialog.scss',
    './dialog-form-legal-representative.component.scss',
  ],
})
export class DialogFormLegalRepresentativeComponent implements OnInit {
  docTypeVI = DOC_TYPES_VI.filter((e) => e.code !== DOC_TYPES.BIRTH_CERT);
  GENDERS = GENDERS;
  RESIDENTS = RESIDENTS;
  RELATIONS = RELATIONS;
  DOC_TYPES = [];

  VISA = [
    {
      code: 'visaExemption',
      label: 'Miễn thị thực nhập cảnh',
    },
    {
      code: 'hasExpiration',
      label: 'Có thời hạn',
    },
  ];

  openAllCollapse = 0;
  isFullScreen = false;

  FORM_VAL_ERRORS = FORM_VAL_ERRORS;
  form: FormGroup;
  maxDate = new Date();

  @ViewChild('formAddLegalRepresentative')
  formAddLegalRepresentative: ElementRef;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogFormLegalRepresentativeComponent>
  ) {
    this.DOC_TYPES = this.docTypeVI.map((docType) => ({
      key: docType.code,
      value: docType.radioTxt,
    }));
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      cifNo: [null, ValidatorHelper.required],
      fullName: [null, ValidatorHelper.required],
      birthDate: [null, ValidatorHelper.required],
      docNum: [null, ValidatorHelper.required],
      docType: [null, ValidatorHelper.required],
      issueDate: [null, ValidatorHelper.required],
      issuePlace: [null, ValidatorHelper.required],
      visaExemption: [null],
      hasExpiration: [null],
      fromDate: [null],
      toDate: [null],
      currentAddress: [null, ValidatorHelper.required],
      permanentAddress: [null, ValidatorHelper.required],
      nationality: [null],
      mobilePhone: [null, ValidatorHelper.required],
      homePhone: [null],
      email: [null, Validators.email],
      occupation: [null, ValidatorHelper.required],
      position: [null, ValidatorHelper.required],
      relation: [null, ValidatorHelper.required],
      otherRelation: [null],
      legalDocument: [null],
    });

    FormSavingHelpers.setPlaceByDoc({
      docTypeControl: this.control('docType'),
      issueDateControl: this.control('issueDate'),
      issuePlaceControl: this.control('issuePlace'),
    });

    if (this.legalRepresentativeDetail) {
      this.form.patchValue(
        {
          ...this.legalRepresentativeDetail,
          docType: DOC_TYPES_VI.find(
            (doc) => doc.noneMark === this.legalRepresentativeDetail?.docType
          )?.code,
        },
        NO_EMIT
      );
    }

    if (this.isView) {
      this.form.disable(NO_EMIT);
    }

    this.validateVisaExemption(this.control('visaExemption').value);
    this.validateHasExpiration(this.control('hasExpiration').value);
    this.control('visaExemption').valueChanges.subscribe((value) => {
      this.validateVisaExemption(value);
    });
    this.control('hasExpiration').valueChanges.subscribe((value) => {
      this.validateHasExpiration(value);
    });

    this.validateRelation(this.control('relation').value === 'other');

    this.control('relation').valueChanges.subscribe((e) => {
      console.log(e);

      this.validateRelation(e === 'other');
    });
  }
  validateHasExpiration(hasExpiration: boolean) {
    if (hasExpiration) {
      FormHelpers.validTwoDate(
        this.control('fromDate'),
        this.control('toDate'),
        {
          required: true,
          updateValueAndValidity: true,
        }
      );
    } else {
      FormHelpers.validTwoDate(
        this.control('fromDate'),
        this.control('toDate'),
        {
          required: false,
          updateValueAndValidity: true,
        }
      );
    }
  }
  validateVisaExemption(visaExemption: boolean): void {
    if (visaExemption) {
      this.control('fromDate').disable(NO_EMIT);
      this.control('toDate').disable(NO_EMIT);
    } else {
      this.control('fromDate').enable(NO_EMIT);
      this.control('toDate').enable(NO_EMIT);
    }
  }
  validateRelation(check: boolean) {
    if (check) {
      this.control('otherRelation').setValidators([ValidatorHelper.required]);
    } else {
      this.control('otherRelation').setValidators([]);
    }
    this.control('otherRelation').updateValueAndValidity(NO_EMIT);
  }

  searchCustomerInfo(cus) {
    console.log('searchCustomerInfo', cus);
  }

  closeDialog(): void {
    this.dialogRef.close({ type: 'dismiss' });
  }
  onSubmit(): void {
    this.form.markAllAsTouched();

    console.log('formAddLegalRepresentative', this.form);

    if (this.form.invalid) {
      FormHelpers.focusToInValidControl(this.formAddLegalRepresentative);
      return;
    }
    const formValues = this.form.getRawValue();
    this.dialogRef.close({
      type: 'submit',
      data: FormHelpers.trimValues({
        ...formValues,
        docType: DOC_TYPES_VI.find((doc) => doc.code === formValues.docType)
          ?.noneMark,
        // ...(this.control('visaExemption').value
        //   ? {
        //       fromDate: null,
        //       toDate: null,
        //       hasExpiration: false,
        //     }
        //   : {}),
      }),
    });
  }

  resizeDialog() {
    if (this.isFullScreen) {
      this.dialogRef.updateSize('auto', 'auto');
    } else {
      this.dialogRef.updateSize('100vw', '100vw');
    }
    this.isFullScreen = !this.isFullScreen;
  }

  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }
  get control() {
    return (name: string): AbstractControl => {
      return this.form.get(name);
    };
  }
  get legalRepresentativeDetail(): LEGAL_REPRESENTATIVE {
    return this.data?.legalRepresentative;
  }
  get isView(): boolean {
    return this.data?.isView;
  }
}
export class IDataLegalRepresentative {
  constructor(public legalRepresentative: LEGAL_REPRESENTATIVE) {}
}
