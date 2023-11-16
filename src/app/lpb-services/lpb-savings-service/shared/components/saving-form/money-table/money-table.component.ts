import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { SavingFormService } from '../../../services/saving-form.service';
import {
  SAVINGS_MONEY_TYPES,
  RECEIPT_ACCOUNT_TYPES,
  DEPOSIT_ACCOUNT_TYPES,
} from '../../../constants/saving';
import { FORM_VAL_ERRORS } from '../../../constants/common';
import { FormControlWarn } from 'src/app/shared/utilites/form-helpers';

@Component({
  selector: 'app-money-table',
  templateUrl: './money-table.component.html',
  styleUrls: [
    './money-table.component.scss',
    '../../../styles/lpb-saving-form.scss',
    '../../../styles/common.scss',
  ],
})
export class MoneyTableComponent implements OnInit {
  @Input() depositFormArr: FormArray;
  @Input() receiptFormArr: FormArray;
  @Input() depositAmount: number;
  @Input() curCode: string;

  @Input() collapsedDepositMoney = false;
  @Output() collapsedDepositMoneyChange = new EventEmitter<boolean>();

  @Input() collapsedReceiptMoney = false;
  @Output() collapsedReceiptMoneyChange = new EventEmitter<boolean>();

  actionStatus = {
    deposit: {
      add: 'enabled',
      delete: 'enabled',
    },

    receipt: {
      add: 'disabled',
      delete: 'disabled',
    },
  };

  RECEIPT_ACCOUNT_TYPES = RECEIPT_ACCOUNT_TYPES;
  DEPOSIT_ACCOUNT_TYPES = DEPOSIT_ACCOUNT_TYPES;
  SAVINGS_MONEY_TYPES = SAVINGS_MONEY_TYPES;
  FORM_VAL_ERRORS = FORM_VAL_ERRORS;

  constructor(private savingFormService: SavingFormService) {}

  ngOnInit() {}

  addRow(type: 'deposit' | 'receipt') {
    if (type === 'deposit') {
      const newRowForm = this.savingFormService.createDepositRowForm();
      newRowForm.get('curCode').setValue(this.curCode);
      this.depositFormArr.push(newRowForm);
    } else {
      this.receiptFormArr.push(this.savingFormService.createReceiptRowForm());
    }
  }

  removeRow(type: 'deposit' | 'receipt', index: number) {
    if (type === 'deposit') {
      this.depositFormArr.removeAt(index);
    } else {
      this.receiptFormArr.removeAt(index);
    }
  }

  getFirstError(form: FormGroup, controlName: string): string {
    const errors = form.get(controlName)?.errors;
    if (!errors) {
      return null;
    }
    return Object.keys(errors)[0];
  }

  getFirstWarning(form: FormGroup, controlName: string): string {
    const warnings = (form.get(controlName) as FormControlWarn)?.warnings;
    if (!warnings) {
      return null;
    }
    return Object.keys(warnings)[0];
  }

  changeAction({
    moneyType,
    action,
    status,
  }: {
    moneyType: 'deposit' | 'receipt';
    action: 'add' | 'delete';
    status: 'enabled' | 'disabled' | 'hidden';
  }) {
    this.actionStatus[moneyType][action] = status;
  }
}
