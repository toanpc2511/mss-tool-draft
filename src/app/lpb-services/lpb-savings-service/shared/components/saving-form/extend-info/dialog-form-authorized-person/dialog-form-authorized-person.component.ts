import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { CustomerInfo } from 'src/app/shared/models/common.interface';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { ValidatorHelper } from 'src/app/shared/utilites/validators.helper';

import { DateHelper } from 'src/app/shared/utilites/date-helper';
import {
  DATE_FORMAT_VN_SIMPLE,
  DOC_TYPES,
  DOC_TYPES_VI,
  NO_EMIT,
  RESIDENTS,
} from '../../../../constants/common';
import { AUTHORIZED_PERSON } from '../../../../models/saving-basic';
import { ExtendInfoService } from '../../../../services/extend-info.service';
import { FormSavingHelpers } from '../../../../utilites/form-saving-helpers';
import {
  OCCUPATIONS,
  AUTHORIZATION_SCOPE,
  AUTHORIZATION_SCOPES,
  AUTHORIZATION_DURATION,
  AUTHORIZATION_DURATIONS,
} from '../../../../constants/saving-basic';

@Component({
  selector: 'app-dialog-form-authorized-person',
  templateUrl: './dialog-form-authorized-person.component.html',
  styleUrls: [
    '../../../../styles/common.scss',
    '../../../../styles/dialog.scss',
    './dialog-form-authorized-person.component.scss',
  ],
})
export class DialogFormAuthorizedPersonComponent implements OnInit {
  isFullScreen = false;
  FORM_VAL_ERRORS = {
    REQUIRED: 'required',
    DATE_RANGE_ERROR: 'dateRangeError',
    DATE_FORMAT_ERROR: 'inValidDate',
    MAX_DATE: 'maxDate',
  };
  DOC_TYPES_VI = DOC_TYPES_VI;
  DOC_TYPES = [];
  RESIDENTS = RESIDENTS;
  OCCUPATIONS = OCCUPATIONS;
  AUTHORIZATION_SCOPE = AUTHORIZATION_SCOPE;
  AUTHORIZATION_SCOPES = AUTHORIZATION_SCOPES;
  AUTHORIZATION_DURATION = AUTHORIZATION_DURATION;
  AUTHORIZATION_DURATIONS = AUTHORIZATION_DURATIONS;

  form: FormGroup;
  maxDate = new Date();

  isSameCurrentAddress: boolean = false;
  addresses: {
    current: AbstractControl;
    permanent: AbstractControl;
  }[];
  @ViewChild('formAddDialogAddAuthorizedPerson')
  formAddDialogAddAuthorizedPerson: ElementRef;

  isRequiredEndDate = true;
  issuePlaceValue = '';

  isPatchValueDoc = false;

  collapsed = {
    basicInfo: false,
    content: false,
  };

  @ViewChild('addAuthorizedPersonRef') addAuthorizedPersonRef: ElementRef;
  authorizedPersons: AUTHORIZED_PERSON[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private lpbDialogService: LpbDialogService,
    private extendInfoService: ExtendInfoService,
    public dialogRef: MatDialogRef<DialogFormAuthorizedPersonComponent>
  ) {
    this.DOC_TYPES = DOC_TYPES_VI.map((docType) => ({
      key: docType.code,
      value: docType.radioTxt,
    }));
  }
  ngOnInit(): void {
    this.extendInfoService.authorizedPersons.subscribe((authorizedPersons) => {
      this.authorizedPersons = [...authorizedPersons];
    });
    this.form = this.fb.group({
      //Thông tin cơ bản
      cifNo: [null],
      fullName: [null, ValidatorHelper.required],
      phoneNumber: [null, ValidatorHelper.required],
      docNum: [null, ValidatorHelper.required],
      docType: [DOC_TYPES.CCCD, ValidatorHelper.required],
      docIssueDate: [
        null,
        [
          ValidatorHelper.required,
          ValidatorHelper.dateFormat(DATE_FORMAT_VN_SIMPLE),
        ],
      ],
      docIssuePlace: [null, ValidatorHelper.required],
      address: [null, ValidatorHelper.required],

      // Nội dung ủy quyền
      authorizationScope: [AUTHORIZATION_SCOPE.withdrawPrincipal],
      authorizationDuration: [AUTHORIZATION_DURATION.limited],
      authorizationStartDate: [null],
      authorizationEndDate: [null],
    });

    const durationControl = this.control('authorizationDuration');
    const startDateControl = this.control('authorizationStartDate');
    const endDateControl = this.control('authorizationEndDate');

    FormHelpers.validTwoDate(startDateControl, endDateControl, {
      checkRange: true,
      required: true,
      maxDate: new Date(),
      rejectValidate: {
        maxDate: [2],
      },
    });

    this.onDurationChange({
      durationControl,
      startDateControl,
      endDateControl,
    });

    FormSavingHelpers.setPlaceByDoc({
      docTypeControl: this.control('docType'),
      issueDateControl: this.control('docIssueDate'),
      issuePlaceControl: this.control('docIssuePlace'),
    });

    if (this.authorizedPersonDetail) {
      this.searchCustomerInfo(this.authorizedPersonDetail);
    }
    if (this.isView) {
      this.form.disable(NO_EMIT);
    }
  }

  onDurationChange({
    durationControl,
    startDateControl,
    endDateControl,
  }: {
    durationControl: AbstractControl;
    startDateControl: AbstractControl;
    endDateControl: AbstractControl;
  }): void {
    // #region Không bắt buộc nhập nếu chọn Thời hạn ủy quyền là
    // “Thời gian ủy quyền đến khi có thể thay đổi/bổ sung”
    const validates = [
      ValidatorHelper.dateFormat(DATE_FORMAT_VN_SIMPLE),
      ValidatorHelper.dateRangeValidator(startDateControl),
    ];
    durationControl.valueChanges.subscribe((value) => {
      if (value === AUTHORIZATION_DURATION.untilReplaced) {
        endDateControl.setValidators(validates);
        this.isRequiredEndDate = false;
      } else {
        FormHelpers.validTwoDate(startDateControl, endDateControl, {
          checkRange: true,
          required: true,
          maxDate: new Date(),
          rejectValidate: {
            maxDate: [2],
          },
        });
        this.isRequiredEndDate = true;
      }
      endDateControl.updateValueAndValidity(NO_EMIT);
    });
    // #endregion
  }

  searchCustomerInfo(cus: CustomerInfo | AUTHORIZED_PERSON): void {
    this.collapsed = { ...this.collapsed, basicInfo: false };
    const docType = DOC_TYPES_VI.find(
      (doc) => doc.noneMark === cus?.docType
    )?.code;

    if (!cus) {
      this.form.reset();
      return;
    }
    this.form.patchValue(
      {
        ...cus,
        docType,
        docIssueDate: cus?.docIssueDate
          ? moment(DateHelper.getDateFromString(cus?.docIssueDate)).format(
              'DD/MM/YYYY'
            )
          : null,
      },
      NO_EMIT
    );
  }

  closeDialog(): void {
    this.dialogRef.close({ type: 'dismiss' });
  }
  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.collapsed = { ...this.collapsed, basicInfo: false, content: false };
      FormHelpers.focusToInValidControl(this.addAuthorizedPersonRef);
      return;
    }

    if (
      this.authorizedPersons?.some(
        (e) =>
          !this.authorizedPersonDetail &&
          e.docNum === this.control('docNum').value &&
          e.docType === this.control('docType').value
      )
    ) {
      const dialogParams: ILpbDialog = {
        title: 'Thông báo',
        messages: ['Thông tin nguời đại diện pháp luật đã tồn tại'],
        buttons: {
          confirm: { display: false },
          dismiss: { display: true, label: 'Đóng' },
        },
      };
      this.lpbDialogService.openDialog(dialogParams, () => {});
      return;
    }

    const formValues = this.form.getRawValue();
    this.dialogRef.close({
      type: 'submit',
      data: FormHelpers.trimValues({
        ...formValues,
        docType: DOC_TYPES_VI.find((doc) => doc.code === formValues.docType)
          ?.noneMark,
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
  get authorizedPersonDetail(): AUTHORIZED_PERSON {
    return this.data?.authorizedPerson;
  }
  get isView(): boolean {
    return this.data?.isView;
  }
}
export class IDataAuthorizedPerson {
  constructor(
    public authorizedPerson: AUTHORIZED_PERSON,
    public isView: boolean
  ) {}
}
