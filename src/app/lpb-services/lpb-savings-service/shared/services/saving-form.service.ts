import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  DEPOSIT_ACCOUNT_TYPE_CODE,
  SAVINGS_MONEY_TYPE_CODE,
  RECEIPT_ACCOUNT_TYPE_CODE
} from '../constants/saving';

type DepositRow = {
  accType: DEPOSIT_ACCOUNT_TYPE_CODE;
  acn: string;
  amount: number;
  curCode: string;
  branchCode: string;
};

type ReceiptRow = {
  accType: RECEIPT_ACCOUNT_TYPE_CODE;
  acn: string;
  amountPercent: number;
  amountType: SAVINGS_MONEY_TYPE_CODE;
  curCode: string;
  branchCode: string;
};

@Injectable({
  providedIn: 'root',
})
export class SavingFormService {
  constructor(private fb: FormBuilder) {}

  private defaultDepositRow: DepositRow = {
    accType: DEPOSIT_ACCOUNT_TYPE_CODE.CASH,
    acn: null,
    amount: null,
    curCode: null,
    branchCode: null
  };

  private defaultReceiptRow: ReceiptRow = {
    accType: RECEIPT_ACCOUNT_TYPE_CODE.SPEND,
    acn: null,
    amountPercent: 100,
    amountType: SAVINGS_MONEY_TYPE_CODE.INTEREST,
    curCode: null,
    branchCode: null
  };

  private savingAccCurCodeCtrl: AbstractControl;

  get userInfo(): any {
    try {
      return JSON.parse(localStorage.getItem('userInfo'));
    } catch (error) {
      return null;
    }
  }

  setSavingAccountCurCodeControl(control?: AbstractControl){
    this.savingAccCurCodeCtrl = control;
  }

  createDepositRowForm(depositRow?: DepositRow): FormGroup {
    if (!depositRow) {
      depositRow = this.defaultDepositRow;
    }

    let acn = depositRow.acn;
    let acnDisabled = false;
    let branchCode = depositRow.branchCode;
    if (depositRow.accType === DEPOSIT_ACCOUNT_TYPE_CODE.CASH) {
      acn = this.getDefaultAcn(depositRow.curCode);
      acnDisabled = true;
      branchCode = this.userInfo.branchCode;
    }

    const form = this.fb.group({
      accType: [depositRow.accType, Validators.required],
      acn: [
        { value: acn, disabled: acnDisabled },
        [Validators.required, Validators.minLength(12)],
      ],
      amount: [depositRow.amount, [Validators.required]],
      curCode: [{ value: depositRow.curCode, disabled: true }],
      branchCode: [{ value: branchCode, disabled: true }],
    });

    this.watchChangeAccTypeAndCurCode(form, DEPOSIT_ACCOUNT_TYPE_CODE.CASH);

    return form;
  }

  watchChangeAccTypeAndCurCode(form: FormGroup, checkType: "CASH" | "GL"){
    form.get('accType').valueChanges.subscribe((accType) => {
      if (accType === checkType) {
        form.get('curCode').setValue(this.savingAccCurCodeCtrl?.value);
        form.get('acn').disable({ emitEvent: false });
        form
          .get('branchCode')
          .setValue(this.userInfo.branchCode, { emitEvent: false });
      } else {
        form.get('curCode').setValue(null);
        form.get('acn').enable({ emitEvent: false });
        form.get('branchCode').setValue(null, { emitEvent: false });
        form.get('acn').setValue(null);
      }
    });

    form.get('curCode').valueChanges.subscribe((curCode) => {
      if (form.get('accType').value === checkType) {
        form.get('acn').setValue(this.getDefaultAcn(curCode));
      }
    })
  }

  getDefaultAcn(curCode: string) {
    switch (curCode) {
      case 'VND': {
        return '10110001';
      }

      case 'USD': {
        return '103100000';
      }

      default: {
        return null;
      }
    }
  }

  createReceiptRowForm(receiptRow?: ReceiptRow) {
    if (!receiptRow) {
      receiptRow = this.defaultReceiptRow;
    }

    let acn = receiptRow.acn;
    let acnDisabled = false;
    let branchCode = receiptRow.branchCode;
    if (receiptRow.accType === RECEIPT_ACCOUNT_TYPE_CODE.GL) {
      acn = this.getDefaultAcn(receiptRow.curCode);
      acnDisabled = true;
      branchCode = this.userInfo.branchCode;
    }

    const form = this.fb.group({
      accType: [receiptRow.accType, [Validators.required]],
      acn: [
        { value: acn, disabled: acnDisabled },
        [Validators.required, Validators.minLength(12)],
      ],
      amountPercent: [{ value: receiptRow.amountPercent, disabled: true }],
      amountType: [{ value: receiptRow.amountType, disabled: true }],
      curCode: [{ value: receiptRow.curCode, disabled: true }],
      branchCode: [{ value: branchCode, disabled: true }],
    });

    this.watchChangeAccTypeAndCurCode(form, RECEIPT_ACCOUNT_TYPE_CODE.GL);

    return form;
  }

  getDefaultDepositFormArray(): FormArray {
    const formArray = this.fb.array([]);
    Array(1)
      .fill({ ...this.defaultDepositRow })
      .forEach((row) => {
        formArray.push(this.createDepositRowForm(row));
      });
    return formArray;
  }

  getDefaultReceiptFormArray(): FormArray {
    const formArray = this.fb.array([]);
    Array(1)
      .fill({ ...this.defaultReceiptRow })
      .forEach((row) => {
        formArray.push(this.createReceiptRowForm(row));
      });
    return formArray;
  }

  depositValid() {}
}
