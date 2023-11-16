import { Injectable } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { merge } from 'rxjs';
import { DENOMINATIONS } from '../constants/common';
import { ReceiptJson } from '../interface/common';

type MoneyRow = {
  denomination: number | null;
  quantity: number | null;
  total: number | null;
};

@Injectable({
  providedIn: 'root',
})
export class MoneyListFormService {
  private defaultMoneyRow = {
    denomination: null,
    quantity: null,
    total: null,
  };
  constructor(private fb: FormBuilder) {}

  createMoneyForm(moneyRow?: MoneyRow): FormGroup {
    const rowData = moneyRow ? moneyRow : this.defaultMoneyRow;
    const form = this.fb.group(rowData);
    form.get('total').disable();
    merge(
      form.get('denomination').valueChanges,
      form.get('quantity').valueChanges
    ).subscribe(() => {
      const crrDenomination = form.get('denomination').value;
      const crrQuantity = form.get('quantity').value;
      let total = crrDenomination * crrQuantity;
      if (crrDenomination === null || crrQuantity === null) {
        total = null;
      }
      form.get('total').setValue(total);
    });
    return form;
  }

  updateMoneyList(curCode: string, moneyList: FormArray): void {
    moneyList.clear();
    let newList = Array(5).fill({ ...this.defaultMoneyRow });
    if (DENOMINATIONS[curCode]) {
      newList = DENOMINATIONS[curCode]
        .sort((a, b) => b - a)
        .map((deno) => ({
          ...this.defaultMoneyRow,
          denomination: [deno],
        }));
    }
    newList.forEach((rowData) => {
      moneyList.push(this.createMoneyForm({ ...rowData }));
    });
  }

  getDefaultMoneyList(): FormArray {
    const moneyList = this.fb.array([]);
    const paperMoneyList = Array(5).fill({ ...this.defaultMoneyRow });
    paperMoneyList.forEach((paperMoney) => {
      moneyList.push(this.createMoneyForm(paperMoney));
    });
    return moneyList;
  }

  parseMoneyListFormToReceiptJson(moneyList: MoneyRow[]): ReceiptJson {
    const receiptJson: ReceiptJson = {
      total: 0,
      receipts: [],
    };
    moneyList.forEach((till) => {
      receiptJson.total = Number(receiptJson.total) + Number(till.total);
      const { quantity, denomination, total } = till;
      if (quantity && denomination) {
        receiptJson.receipts.push({ quantity, denomination, amount: total });
      }
    });

    const emptyRows = moneyList.filter((row) => row.quantity === null);
    const isMoneyListEmpty = emptyRows?.length === moneyList?.length;
    receiptJson.total = isMoneyListEmpty ? '' : receiptJson.total;

    return receiptJson;
  }

  parseReceiptJsonToFormArray(
    receiptJson: ReceiptJson,
    curCode: string
  ): FormArray {
    const moneyList = this.fb.array([]);

    let initMoneyList = [];
    if (Object.keys(DENOMINATIONS).includes(curCode)) {
      let denoArr: number[] = DENOMINATIONS[curCode];
      denoArr = denoArr.sort((a, b) => b - a);
      denoArr.forEach((denomination) => {
        const row = receiptJson.receipts.find(
          (rec) => rec.denomination === denomination
        );
        const quantity = row ? row.quantity : null;
        initMoneyList.push({ denomination, quantity });
      });
    } else {
      initMoneyList = receiptJson.receipts;
    }
    initMoneyList = initMoneyList.map((data) => {
      let total = data.quantity * data.denomination;
      if (!(data.quantity && data.denomination)) {
        total = null;
      }
      return { ...data, total };
    });

    initMoneyList.forEach((till) => {
      const formGroup = this.createMoneyForm(till);
      formGroup.disable({ emitEvent: false });
      moneyList.push(formGroup);
    });

    return moneyList;
  }
}
