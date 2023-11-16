import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, merge } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { CustomerInfo } from 'src/app/shared/models/common.interface';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { FORM_VAL_ERRORS } from '../../constants/common';
import {
  FINALIZE_METHOD_CODE,
  DEPOSIT_ACCOUNT_TYPE_CODE,
  RECEIPT_ACCOUNT_TYPE_CODE,
  SAVINGS_MONEY_TYPE_CODE,
} from '../../constants/saving';
import { SavingFormService } from '../../services/saving-form.service';
import { LpbSignatureListComponent } from 'src/app/shared/components/lpb-signature-list/lpb-signature-list.component';
import { LpbIdentityCertificationComponent } from 'src/app/shared/components/lpb-identity-certification/lpb-identity-certification.component';
import { MoneyTableComponent } from './money-table/money-table.component';
import { MoneyListComponent } from '../tabs/money-list/money-list.component';

@Component({
  selector: 'app-saving-form',
  templateUrl: './saving-form.component.html',
  styleUrls: [
    '../../styles/common.scss',
    './saving-form.component.scss',
    '../../styles/lpb-saving-form.scss',
  ],
})
export class SavingFormComponent implements OnInit {
  @Input() form: FormGroup;

  @ViewChild('tabGroup', { static: false }) tabGroup: ElementRef;
  @ViewChild('savingForm', { read: ElementRef }) formRef: ElementRef;

  @ViewChild(LpbSignatureListComponent, { static: false })
  lstSign: LpbSignatureListComponent;

  @ViewChild(LpbIdentityCertificationComponent, { static: false })
  lstIDCert: LpbIdentityCertificationComponent;

  @ViewChild(MoneyTableComponent, { static: false })
  moneyTable: MoneyTableComponent;

  @ViewChild(MoneyListComponent, { static: false })
  moneyListComp: MoneyListComponent;

  collapsed = {
    senderInfo: false,
    accountInfo: false,
    depositMoney: false,
    receiptMoney: false,
  };

  crrSenderCifObs = new BehaviorSubject<string>(null);
  crrSenderInfo: CustomerInfo;

  constructor(
    private savingFormService: SavingFormService,
    private dialog: MatDialog,
    private dialogService: LpbDialogService
  ) {
    this.dialogService.setDialog(this.dialog);
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    //#region watch change finalizeMethod
    this.form
      .get('account')
      .get('finalizeMethod')
      .valueChanges.subscribe((value) => {
        if (this.form.disabled) {
          return;
        }

        switch (value) {
          case FINALIZE_METHOD_CODE.ROLL_OVER_PRINCIPAL_INTEREST: {
            this.collapsed.receiptMoney = true;
            this.receiptFormArr.at(0).reset();
            this.receiptFormArr.disable();
            break;
          }

          case FINALIZE_METHOD_CODE.ROLL_OVER_PRINCIPAL: {
            this.collapsed.receiptMoney = false;
            this.receiptFormArr.clear();
            const defaultForm = this.savingFormService.createReceiptRowForm();
            defaultForm
              .get('amountType')
              .setValue(SAVINGS_MONEY_TYPE_CODE.INTEREST, { emitEvent: false });
            defaultForm.get('amountType').disable({ emitEvent: false });
            this.receiptFormArr.push(defaultForm);
            break;
          }

          default: {
          }
        }
      });
    //#endregion

    // watch change curCode
    this.watchValidateCurCodeAndFormArr(this.depositFormArr);
    this.watchValidateCurCodeAndFormArr(this.receiptFormArr);

    this.form
      .get('account')
      .get('curCode')
      .valueChanges.subscribe((curCode) => {
        this.depositFormArr.controls.forEach((formGroup: FormGroup) => {
          if (
            formGroup.get('accType').value === DEPOSIT_ACCOUNT_TYPE_CODE.CASH
          ) {
            formGroup.get('curCode').setValue(curCode);
          }
        });

        this.receiptFormArr.controls.forEach((formGroup: FormGroup) => {
          if (formGroup.get('accType').value === RECEIPT_ACCOUNT_TYPE_CODE.GL) {
            formGroup.get('curCode').setValue(curCode);
          }
        });
      });
    //#endregion
  }

  watchValidateCurCodeAndFormArr(formArr: FormArray) {
    const accCurCodeCtrl = this.form.get('account').get('curCode');

    merge(accCurCodeCtrl.valueChanges, formArr.valueChanges).subscribe(() => {
      const accCurCode = accCurCodeCtrl.value;
      formArr.controls.forEach((formGroup: FormGroup) => {
        const curCode = formGroup.get('curCode').value;
        const control = formGroup.get('acn');
        const errorName = FORM_VAL_ERRORS.NOT_MATCH_CURCODE;

        if (!curCode || !accCurCode) {
          FormHelpers.clearFormError({ control, errorName });
          return;
        }

        if (curCode !== accCurCode) {
          FormHelpers.setFormError({ control, errorName });
        } else {
          FormHelpers.clearFormError({ control, errorName });
        }
      });
    });
  }

  openAllCollapse() {
    this.collapsed.senderInfo = false;
    this.collapsed.accountInfo = false;
    this.collapsed.depositMoney = false;
    this.collapsed.receiptMoney = false;
  }

  ngAfterViewInit(): void {
    this.crrSenderCifObs.pipe(distinctUntilChanged()).subscribe((cif) => {
      this.lstSign.startFetching(cif);
      this.lstIDCert.startFetching(cif);
    });
  }

  onTabChange() {
    const ntvEl = this.tabGroup.nativeElement;
    const myTopnav = document.getElementById('myTopnav');

    const yOffset = -((myTopnav?.offsetHeight || 120) + 10);

    if (window.pageYOffset - ntvEl.getBoundingClientRect().top <= 550) {
      const y =
        ntvEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }

  changeSenderInfo(event: CustomerInfo) {
    this.crrSenderInfo = event;
    this.crrSenderCifObs.next(event?.cifNo);
  }

  get depositFormArr(): FormArray {
    return this.form.controls['depositArr'] as FormArray;
  }

  get receiptFormArr(): FormArray {
    return this.form.controls['receiptArr'] as FormArray;
  }

  get moneyList(): FormArray {
    return this.form.controls['moneyList'] as FormArray;
  }

  validateDeposit() {
    const totalAmount = this.depositFormArr.controls.reduce((acc, form) => {
      const amount = form.get('amount').value;
      return acc + amount;
    }, 0);
    const depositAmount = this.form.get('account').get('depositAmount').value;

    if (depositAmount !== totalAmount) {
      return false;
    }

    return true;
  }

  validateReceipt() {
    const totalAmountPercent = this.receiptFormArr.controls.reduce(
      (acc, form) => {
        const amountPercent = form.get('amountPercent').value;
        return acc + amountPercent;
      },
      0
    );

    if (totalAmountPercent !== 100) {
      return false;
    }

    return true;
  }

  validateMoneyList(): boolean {
    const frmValues = this.moneyList.getRawValue();
    const emptyRows = frmValues.filter((row) => row.quantity === null);
    const emptyList = emptyRows?.length === frmValues?.length;

    if (emptyList) {
      return true;
    }

    const totalCashAmount = this.depositFormArr.controls.reduce((acc, form) => {
      let amount = 0;
      if (form.get('accType').value === DEPOSIT_ACCOUNT_TYPE_CODE.CASH) {
        amount = form.get('amount').value;
      }
      return acc + amount;
    }, 0);

    const diff = Math.abs(totalCashAmount - this.moneyListComp.moneyListSum);

    if (diff >= 100) {
      return false;
    }

    return true;
  }

  validate(): boolean {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((group: FormGroup) => {
        Object.keys(group.controls)
          .filter((key) => Boolean(group.controls[key].errors))
          .forEach((key) => {
            console.log('key: ', key, group.controls[key].errors);
          });
      });

      FormHelpers.focusToInValidControl(this.formRef, {
        openAllCollapse: (random) => {
          this.openAllCollapse();
        },
      });
      return false;
    } else {
      const dialogParams: ILpbDialog = {
        messages: [],
        title: 'Thông báo',
        buttons: {
          confirm: { display: false },
          dismiss: { display: true, label: 'Đóng' },
        },
      };

      if (!this.validateDeposit()) {
        dialogParams.messages = ['Tổng tiền không khớp với số tiền gửi'];
        this.dialogService.openDialog(dialogParams, () => {});
        return false;
      }

      if (!this.validateReceipt()) {
        dialogParams.messages = ['Tổng số tiền nhận phải bằng 100%'];
        this.dialogService.openDialog(dialogParams, () => {});
        return false;
      }

      if (!this.validateMoneyList()) {
        const mess = 'Số tiền mặt gửi tiết kiệm và số tiền trên bảng kê chênh lệch hơn 100 VND.'
        dialogParams.messages = [mess];
        this.dialogService.openDialog(dialogParams, () => {});
        return false;
      }
    }

    return true;
  }
}
