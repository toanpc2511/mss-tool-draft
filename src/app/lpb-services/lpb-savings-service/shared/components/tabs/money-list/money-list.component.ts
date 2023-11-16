import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { CURRENCIES } from '../../../constants/common';
import { MoneyListFormService } from '../../../services/money-list-form.service';

@Component({
  selector: 'app-money-list',
  templateUrl: './money-list.component.html',
  styleUrls: ['./money-list.component.scss'],
})
export class MoneyListComponent implements OnInit, OnChanges {
  constructor(
    private fb: FormBuilder,
    private moneyListFormService: MoneyListFormService
  ) {}

  @Input() moneyListForm: FormArray;
  @Input() curCode: string = null;

  moneyListSum: number;
  CURRENCIES = CURRENCIES;
  enableAddRow: boolean = false;

  ngOnInit() {
    this.moneyListForm.valueChanges.subscribe((crrValue) => {
      const listValues = this.moneyListForm.getRawValue();
      const sum = listValues.reduce((acc, crr) => acc + Number(crr.total), 0);
      this.moneyListSum = sum;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.curCode) {
      this.updateEnableAddRow(changes.curCode.currentValue);
      const crrCurCode = changes.curCode.currentValue;
      this.moneyListFormService.updateMoneyList(crrCurCode, this.moneyListForm);
    }
  }

  updateEnableAddRow(crrCurCode: string) {
    if (crrCurCode === CURRENCIES.VND || crrCurCode === CURRENCIES.USD) {
      this.enableAddRow = false;
    } else {
      this.enableAddRow = true;
    }
  }

  addMoneyRow() {
    this.moneyListForm.push(this.moneyListFormService.createMoneyForm());
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }
}
