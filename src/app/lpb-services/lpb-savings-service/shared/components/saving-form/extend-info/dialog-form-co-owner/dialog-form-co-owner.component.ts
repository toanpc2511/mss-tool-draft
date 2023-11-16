import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import * as moment from 'moment';
import { CustomerInfo } from 'src/app/shared/models/common.interface';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { ValidatorHelper } from 'src/app/shared/utilites/validators.helper';
import {
  DOC_TYPES_VI,
  FORM_VAL_ERRORS,
  NO_EMIT,
  RESIDENTS,
} from '../../../../constants/common';
import { AcnValidatorHelper } from '../../../../helpers/acn-validator.helper';
import { CO_OWNER } from '../../../../models/saving-basic';
import { ExtendInfoService } from '../../../../services/extend-info.service';
import { DialogFormAuthorizedPersonComponent } from '../dialog-form-authorized-person/dialog-form-authorized-person.component';
import { DateHelper } from 'src/app/shared/utilites/date-helper';
import { GENDERS, RELATIONS } from '../../../../constants/saving-basic';

@Component({
  selector: 'app-dialog-form-co-owner',
  templateUrl: './dialog-form-co-owner.component.html',
  styleUrls: [
    '../../../../styles/common.scss',
    '../../../../styles/dialog.scss',
    './dialog-form-co-owner.component.scss',
  ],
})
export class DialogFormCoOwnerComponent implements OnInit {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  GENDERS = GENDERS;
  RESIDENTS = RESIDENTS;
  RELATIONS = RELATIONS;
  DOC_TYPES = [];

  openAllCollapse = 0;
  isFullScreen = false;

  FORM_VAL_ERRORS = FORM_VAL_ERRORS;
  form: FormGroup;
  maxDate = new Date();

  @ViewChild('formAddCoOwner')
  formAddCoOwner: ElementRef;
  coOwners: CO_OWNER[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private extendInfoService: ExtendInfoService,
    private lpbDialogService: LpbDialogService,
    private matDialog: MatDialog,
    public dialogRef: MatDialogRef<DialogFormAuthorizedPersonComponent>
  ) {
    this.DOC_TYPES = DOC_TYPES_VI.map((docType) => ({
      key: docType.code,
      value: docType.radioTxt,
    }));
    this.lpbDialogService.setDialog(this.matDialog);
  }

  ngOnInit(): void {
    this.extendInfoService.coOwners.subscribe((coOwners) => {
      this.coOwners = [...coOwners];
    });

    this.form = this.fb.group({
      cifNo: [{ value: null, disabled: true }],
      fullName: [{ value: null, disabled: true }],
      phoneNumber: [{ value: null, disabled: true }],
      docNum: [{ value: null, disabled: true }],
      docType: [{ value: null, disabled: true }],
      docIssueDate: [{ value: null, disabled: true }],
      docIssuePlace: [{ value: null, disabled: true }],
      address: [{ value: null, disabled: true }],
      ownershipRate: [
        { value: null, disabled: false },
        [ValidatorHelper.required, Validators.max(100)],
        AcnValidatorHelper.validCoOwner(
          this.extendInfoService,
          this.coOwnerDetail
        ),
      ],
      expirationDate: [
        { value: null, disabled: false },
        ValidatorHelper.required,
      ],
    });
    if (this.coOwnerDetail) {
      this.searchCustomerInfo(this.coOwnerDetail, true);
      this.collapsedChange.emit(true);
    }
    if (this.isView) {
      this.form.disable(NO_EMIT);
    }
  }

  searchCustomerInfo(cus: CustomerInfo | CO_OWNER, isDetail = false): void {
    if (!cus) {
      this.form.reset();
      return;
    }

    let docType = cus?.docType;
    if (!isDetail) {
      docType = DOC_TYPES_VI.find((doc) => doc.noneMark === cus?.docType)?.code;
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

    if (this.form.invalid || this.form.pending) {
      FormHelpers.focusToInValidControl(this.formAddCoOwner);
      return;
    }

    if (
      !this.coOwnerDetail &&
      this.coOwners?.some((e) => e.cifNo === this.control('cifNo').value)
    ) {
      const dialogParams: ILpbDialog = {
        title: 'Thông báo',
        messages: ['Thông tin ĐSH đã tồn tại'],
        buttons: {
          confirm: { display: false },
          dismiss: { display: true, label: 'Đóng' },
        },
      };
      this.lpbDialogService.openDialog(dialogParams, () => {});
      return;
    }

    this.dialogRef.close({
      type: 'submit',
      data: FormHelpers.trimValues(this.form.getRawValue()),
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
  get coOwnerDetail(): CO_OWNER {
    return this.data?.coOwner;
  }
  get isView(): boolean {
    return this.data?.isView;
  }
}
export class IDataAddCoOwner {
  constructor(public coOwner: CO_OWNER, public isView: boolean) {}
}
