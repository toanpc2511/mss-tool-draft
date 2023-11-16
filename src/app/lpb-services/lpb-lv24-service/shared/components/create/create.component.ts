import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { ValidatorHelper } from 'src/app/shared/utilites/validators.helper';
import { CustomerUserInfo } from '../../models/common';
import { ISubmit } from '../../models/lv24';
import {
  LV24_PROFILE_STATUS,
  ParseLVL24ProfileStatusCodeToVI,
} from '../../pipes/LVL24ProfileStatusVi.pipe';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';

@Component({
  selector: 'app-lv24-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss', '../../styles/common.scss'],
})
export class CreateComponent implements OnInit {
  customerUserInfo: CustomerUserInfo;
  isSearchCustomerUserInfo = false;

  createForm: FormGroup;

  @Output() sendApprove: EventEmitter<ISubmit> = new EventEmitter<ISubmit>();
  @ViewChild('createFormElement') createFormElement: ElementRef;

  actions: ActionModel[];

  sortedInfos: {
    code: string;
    title: string;
    class?: string;
    transform?: (value) => string;
  }[][];

  constructor(
    private fb: FormBuilder,
    private dialogService: LpbDialogService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private lbl24ProfileStatusViPipe: ParseLVL24ProfileStatusCodeToVI,
    private datePipe: DatePipe
  ) {
    this.dialogService.setDialog(this.dialog);

    this.actions = [
      {
        actionIcon: 'send',
        actionName: 'Gửi duyệt',
        actionClick: () => this.onSendApprove(),
      },
      {
        actionIcon: 'keyboard_backspace',
        actionName: 'Quay lại',
        actionClick: () =>
          this.router.navigate(['../'], { relativeTo: this.activatedRoute }),
      },
    ];

    this.sortedInfos = [
      [
        {
          code: 'cif',
          title: 'Mã khách hàng',
        },
        {
          code: 'cusName',
          title: 'Họ tên',
          class: 'white-space-pre',
        },
        {
          code: 'cusTypeDes',
          title: 'Loại khách hàng',
          transform: (value) => {
            return this.lbl24ProfileStatusViPipe.transform(
              value,
              LV24_PROFILE_STATUS.CUSTOMER_TYPE
            );
          },
        },
        {
          code: 'docType',
          title: 'Loại định danh',
          transform: (value) => {
            return this.lbl24ProfileStatusViPipe.transform(
              value,
              LV24_PROFILE_STATUS.DOC_TYPE
            );
          },
        },
        {
          code: 'address',
          title: 'Địa chỉ',
        },
        {
          code: 'docMethod',
          title: 'Phương thức định danh',
        },
      ],
      [
        {
          code: 'email',
          title: 'Email',
        },
        {
          code: 'userMakerId',
          title: 'Người tạo',
        },
        {
          code: 'userCreatedTime',
          title: 'Thời gian tạo',
          transform: (value) => {
            return this.datePipe.transform(value, 'dd/MM/yyyy HH:mm:ss');
          },
        },
        {
          code: 'userName',
          title: 'User name',
        },
        {
          code: 'wrongPassCount',
          title: 'Số lần nhập sai mật khẩu',
        },
        {
          code: 'userStatus',
          title: 'Trạng thái user',
          transform: (value) => {
            return this.lbl24ProfileStatusViPipe.transform(
              value,
              LV24_PROFILE_STATUS.USER_STATUS
            );
          },
        },
        {
          code: 'accountStatus',
          title: 'Trạng thái tài khoản',
          transform: (value) => {
            return this.lbl24ProfileStatusViPipe.transform(
              value,
              LV24_PROFILE_STATUS.ACCOUNT_STATUS
            );
          },
        },
        {
          code: 'cusStatus',
          title: 'Trạng thái khách hàng',
          transform: (value) => {
            return this.lbl24ProfileStatusViPipe.transform(
              value,
              LV24_PROFILE_STATUS.CUSTOMER_STATUS
            );
          },
        },
      ],
    ];
  }

  initForm() {
    this.createForm = this.fb.group({
      phoneNumber: [null],
      docNum: [null],
      serviceCode: [null, [ValidatorHelper.required]],
      reason: { value: '', disabled: true },
      note: [null],
    });

    const docNumControl = this.createForm.get('docNum');
    const phoneNumberControl = this.createForm.get('phoneNumber');

    phoneNumberControl.setValidators([
      ValidatorHelper.requiredOneInTwo(docNumControl),
      Validators.maxLength(15),
    ]);
    docNumControl.setValidators(
      ValidatorHelper.requiredOneInTwo(phoneNumberControl)
    );

    docNumControl.valueChanges.subscribe(() => {
      phoneNumberControl.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false,
      });
    });

    phoneNumberControl.valueChanges.subscribe(() => {
      docNumControl.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false,
      });
    });
  }

  ngOnInit(): void {
    this.initForm();
  }
  checkFocus() {
    this.createForm.markAllAsTouched();
  }
  onSendApprove() {
    this.createForm.markAllAsTouched();

    if (this.createForm.invalid || this.isSearchCustomerUserInfo) {
      FormHelpers.focusToInValidControl(this.createFormElement);
      return;
    }

    const frmValues = this.createForm.getRawValue();
    for (let key in frmValues) {
      if (typeof frmValues[key] === 'string') {
        frmValues[key] = frmValues[key].trim();
      }
    }

    this.sendApprove.emit({
      frmValues,
      customerUserInfo: this.customerUserInfo,
      form: this.createForm,
    });
  }

  getFirstError(controlName: string): string {
    const errors = this.createForm.get(controlName)?.errors;
    return Object.keys(errors)[0];
  }
}
