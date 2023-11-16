import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { merge } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { LpbIdentityCertificationComponent } from 'src/app/shared/components/lpb-identity-certification/lpb-identity-certification.component';
import { LpbSignatureListComponent } from 'src/app/shared/components/lpb-signature-list/lpb-signature-list.component';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { FORM_VAL_ERRORS, NO_EMIT } from '../../constants/common';
import { SETTLEMENT_TYPE, SETTLEMENT_TYPES } from '../../constants/finalize';
import { AcnValidatorHelper } from '../../helpers/acn-validator.helper';
import { SavingValidatorHelper } from '../../helpers/saving-validator.helper';
import { ArrayFormService } from '../../services/array-form.service';
import { BasicSavingService } from '../../services/basic-saving.service';
import { EnumInputType, IBuilder } from '../form-array/form-array.component';

export interface TYPE_SETTLEMENT_DEPOSITS {
  sourceOfMoney: { value: string; disabled: boolean };
  accountNumber: any;
  amountPercent: { value: string; disabled: boolean };
  amount: string;
}
@Component({
  selector: 'app-finalize-form',
  templateUrl: './finalize-form.component.html',
  styleUrls: ['../../styles/common.scss', './finalize-form.component.scss'],
})
export class FinalizeFormComponent implements OnInit, OnChanges, AfterViewInit {
  builder: IBuilder;
  SETTLEMENT_TYPES = SETTLEMENT_TYPES;
  maxDate = new Date();

  FORM_VAL_ERRORS = {
    ...FORM_VAL_ERRORS,
    INVALID_AMOUNT_RECEIVED: 'inValidAmountReceived',
    INVALID_AMOUNT_RECEIVED_COUNT: 'inValidAmountReceivedCount',
    INVALID_AMOUNT_PERCENT_RECEIVED: 'inValidAmountPercentReceived',
  };

  defaultSettlementDeposits: TYPE_SETTLEMENT_DEPOSITS = {
    sourceOfMoney: { value: null, disabled: true },
    accountNumber: [
      null,
      Validators.compose([Validators.required, Validators.minLength(12)]),
      AcnValidatorHelper.valid(this.basicSavingService, 'credit'),
    ],
    amountPercent: { value: null, disabled: true },
    amount: null,
  };
  formArrayButtons = [];
  formArrayActions = [];

  storeSourceOfMoney = '';

  id: string;

  @Input() isDetail = false;
  @Input() form: FormGroup;
  @Input() settlementDepositsData: any;

  @ViewChild('tabGroup', { static: false }) tabGroup: ElementRef;

  @ViewChild(LpbSignatureListComponent, { static: false })
  lstSign: LpbSignatureListComponent;
  @ViewChild(LpbIdentityCertificationComponent, { static: false })
  lstIDCert: LpbIdentityCertificationComponent;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private arrayFormService: ArrayFormService,
    private basicSavingService: BasicSavingService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.settlementDepositsData) {
      // this.lstSign?.startFetching(
      //   changes.settlementDepositsData.currentValue?.cifNo
      // );
      // this.lstIDCert?.startFetching(
      //   changes.settlementDepositsData.currentValue?.cifNo
      // );

      if (this.builder) {
        this.builder = {
          ...this.builder,
          amount: {
            ...this.builder?.amount,
            maxlength:
              changes.settlementDepositsData.currentValue?.currency === 'VND'
                ? 13
                : 10,
          },
        };
      }
    }
  }

  ngOnInit(): void {
    this.formArrayButtons = [
      {
        label: 'Thêm mới',
        icon: 'add',
        class: 'mb-2 mat-button-no-bg',
        onClick: () => this.onAddItem(),
      },
    ];
    this.formArrayActions = [
      {
        icon: 'fa-trash-o',
        class: 'hover-error h-100',
        onClick: (data) => this.onDeleteItem(data),
      },
    ];
    this.initFormArrayBuilder();
  }
  ngAfterViewInit(): void {
    FormHelpers.validTwoDate(
      this.form.get('openingDate'),
      this.form.get('settlementDate')
    );

    this.onSettlementTypeChange();
    this.setTotalAmount();

    this.settlementDeposits.setValidators([
      SavingValidatorHelper.validAmountPercentReceived,
      SavingValidatorHelper.validAmountReceived(this.totalAmount),
    ]);

    this.onSettlementDepositsAndTotalAmountChange();

    this.cdr.detectChanges();
  }

  initFormArrayBuilder(): void {
    // Khởi tạo form array
    this.builder = {
      sourceOfMoney: {
        label: 'Nguồn tiền nhận',
        inputType: EnumInputType.select,
        selectList: {
          list: [
            { code: 'cash', label: 'Tiền mặt' },
            { code: 'payment_account', label: 'Tài khoản thanh toán' },
          ],
          labelName: 'label',
          bindValue: 'code',
        },
        class: {
          headerClass:
            'payment-account-header bg-light-blue font-weight-500 px-1 py-3 h6',
        },
      },
      accountNumber: {
        label: 'Số tài khoản nhận',
        maxlength: 20,
        inputType: EnumInputType.inputNumber,
        validatesMsg: [
          {
            type: FORM_VAL_ERRORS.FROZEN,
            message: 'Tài khoản bị chặn ghi Nợ, ghi Có',
          },
          {
            type: FORM_VAL_ERRORS.NO_CR,
            message: 'Tài khoản bị chặn ghi Có',
          },
          {
            type: FORM_VAL_ERRORS.NO_DR,
            message: 'Tài khoản bị chặn ghi Nợ',
          },
          {
            type: FORM_VAL_ERRORS.NO_EXIST,
            message: 'Tài khoản không hợp lệ',
          },
          {
            type: FORM_VAL_ERRORS.REQUIRED,
            message: 'Tài khoản không được bỏ trống',
          },
          {
            type: FORM_VAL_ERRORS.MIN_LENGTH,
            message: 'Tài khoản tổi thiểu 12 kí tự',
          },
        ],
      },
      amountPercent: {
        label: 'Số tiền nhận (%)',
        validatesMsg: [
          {
            type: this.FORM_VAL_ERRORS.INVALID_AMOUNT_PERCENT_RECEIVED,
            message: 'Tổng số % phải bằng 100%',
          },
        ],
      },
      amount: {
        label: 'Số tiền nhận',
        inputType: EnumInputType.currency,
        validatesMsg: [
          {
            type: this.FORM_VAL_ERRORS.INVALID_AMOUNT_RECEIVED,
            message: 'Số tiền không hợp lệ',
          },
          {
            type: this.FORM_VAL_ERRORS.INVALID_AMOUNT_RECEIVED_COUNT,
            message: 'Tổng số tiền nhận phải bằng Tổng số tiền',
          },
        ],
        class: {
          headerClass:
            'amount-header bg-light-blue font-weight-500 px-1 py-3 h6',
        },
      },
    };
  }

  onSettlementTypeChange(): void {
    const amountCtrl = this.form.get('amount');
    if (this.settlementType.value === SETTLEMENT_TYPE.ALL) {
      amountCtrl.disable(NO_EMIT);
    }

    this.settlementType.valueChanges.subscribe((value) => {
      if (value === SETTLEMENT_TYPE.ALL) {
        amountCtrl.disable(NO_EMIT);
        amountCtrl.patchValue(this.settlementDepositsData?.amount);
      } else {
        amountCtrl.enable(NO_EMIT);
      }
    });
  }

  setTotalAmount(): void {
    const amount = this.form.get('amount');
    const prematureInterest = this.form.get('prematureInterest');
    amount.valueChanges.subscribe((e) => {
      this.totalAmount.patchValue(
        (Number(amount.value) || 0) + (Number(prematureInterest.value) || 0)
      );
    });
  }
  onTotalAmountChange(): void {
    this.totalAmount.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((e) => {
        const amount = this.settlementDeposit_0?.get('amount');
        if (amount?.untouched) {
          amount.patchValue(e);
        }
      });
  }
  onSettlementDepositsAndTotalAmountChange(): void {
    merge(this.settlementDeposits?.valueChanges, this.totalAmount.valueChanges)
      .pipe(distinctUntilChanged())
      .subscribe(() => {
        const data = this.settlementDeposits.controls?.map(
          (e: FormGroup, i) => {
            const amountPercent = Number.parseFloat(
              (
                (Number(e.get('amount').value) /
                  Number(this.totalAmount.value)) *
                100
              ).toFixed(2)
            );

            this.resetAccountNumber(
              this.settlementDeposits.controls[i]?.get('accountNumber')
            );
            return {
              ...e.getRawValue(),
              sourceOfMoney: this.sourceOfMoney_0?.value,
              amountPercent: !isNaN(amountPercent) ? amountPercent : null,
              ...(this.sourceOfMoney_0?.value === 'cash'
                ? { accountNumber: this.cashCurrencyType }
                : {}),
            };
          }
        );

        this.settlementDeposits.patchValue(data, NO_EMIT);

        if (this.sourceOfMoney_0?.disabled) {
          this.sourceOfMoney_0?.enable(NO_EMIT);
        }

        this.storeSourceOfMoney = this.sourceOfMoney_0?.value;
      });
  }

  resetAccountNumber(currentAccountNumber: AbstractControl): void {
    if (this.sourceOfMoney_0?.value === 'cash') {
      currentAccountNumber.disable(NO_EMIT);
    } else {
      currentAccountNumber.enable(NO_EMIT);
      if (this.storeSourceOfMoney !== this.sourceOfMoney_0?.value) {
        currentAccountNumber.reset(null, NO_EMIT);
      }
    }
    currentAccountNumber.updateValueAndValidity(NO_EMIT);
  }

  onAddItem(): void {
    this.arrayFormService.addFormArray<TYPE_SETTLEMENT_DEPOSITS>({
      control: this.settlementDeposits,
      value: {
        ...this.defaultSettlementDeposits,
      },
    });
  }
  onDeleteItem({ index }): void {
    if (this.settlementDeposits.controls.length > 1) {
      this.settlementDeposits.removeAt(index);
    } else {
      this.settlementDeposits.controls[0].reset({
        ...this.defaultSettlementDeposits,
        accountNumber: null,
      });
    }
  }
  getFirstError(controlName: string): string {
    const errors = this.form.get(controlName)?.errors;
    return Object?.keys(errors || {})?.[0];
  }
  onTabChange(): void {
    const ntvEl = this.tabGroup.nativeElement;
    const myTopnav = document.getElementById('myTopnav');

    const yOffset = -((myTopnav?.offsetHeight || 120) + 10);

    if (window.pageYOffset - ntvEl.getBoundingClientRect().top <= 550) {
      const y =
        ntvEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
  navigateBack() {
    this.router
      .navigate(['../../'], { relativeTo: this.activatedRoute })
      .then(() => {})
      .catch((e) => e);
  }

  get settlementDeposits(): FormArray {
    return this.form.get('settlementDeposits') as FormArray;
  }
  get settlementDeposit_0(): FormGroup {
    return this.settlementDeposits.controls[0] as FormGroup;
  }
  get sourceOfMoney_0(): AbstractControl {
    return this.settlementDeposit_0?.get('sourceOfMoney');
  }
  get totalAmount(): AbstractControl {
    return this.form.get('totalAmount');
  }
  get cashCurrencyType(): string {
    return this.form.get('currency').value === 'VND' ? '10110001' : '103100000';
  }
  get settlementType(): AbstractControl {
    return this.form.get('settlementType');
  }
}
