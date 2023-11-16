import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { FeeCalculationData } from 'src/app/shared/models/common.interface';
import { FEE_CATEGORY } from '../../models/common';
import { CURRENCIES } from 'src/app/shared/constants/finance';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { CalculationHelper } from '../../helpers/calculation.helper';
import { PrettyMoneyPipe } from 'src/app/shared/pipes/prettyMoney.pipe';

export interface OnUpdateFeeTableEmitParams {
  value: number;
  category: FEE_CATEGORY;
}

@Component({
  selector: 'app-fee-table',
  templateUrl: './fee-table.component.html',
  styleUrls: ['./fee-table.component.scss'],
})
export class FeeTableComponent implements OnInit {
  VND_FeeCtrl: AbstractControl;
  VND_FeeVATCtrl: AbstractControl;
  EX_FeeCtrl: AbstractControl;
  EX_FeeVATCtrl: AbstractControl;
  @Input() feeCalData: FeeCalculationData;
  @Output() onUpdate = new EventEmitter<OnUpdateFeeTableEmitParams>();

  @Input() curCode : string;
  @Input() VND_FeeCtrlName: string;
  @Input() VND_FeeVATCtrlName: string;
  @Input() EX_FeeCtrlName: string;
  @Input() EX_FeeVATCtrlName: string;
  @Input() form: FormGroup;

  FORM_VAL_ERRORS = {
    REQUIRED: 'required',
    UNDER_MIN: 'underMin',
    OVER_MAX: 'overMax',
  };

  constructor(private prettyMoneyPipe: PrettyMoneyPipe, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.VND_FeeCtrl = this.form.get(this.VND_FeeCtrlName);
    this.VND_FeeVATCtrl = this.form.get(this.VND_FeeVATCtrlName);
    this.EX_FeeCtrl =
      this.form.get(this.EX_FeeCtrlName) || new FormControl({value: null, disabled: true});
    this.EX_FeeVATCtrl =
      this.form.get(this.EX_FeeVATCtrlName) || new FormControl({value: null, disabled: true});
  }

  ngAfterViewInit(): void {
    this.updateFeeValidation('VND_Fee', this.VND_FeeCtrl.value);
    this.updateFeeValidation('VND_FeeVAT', this.VND_FeeVATCtrl.value);
    this.updateFeeValidation('EX_Fee', this.EX_FeeCtrl.value);
    this.updateFeeValidation('EX_FeeVAT', this.EX_FeeVATCtrl.value);
    this.cdr.detectChanges();
  }

  changeFee(e: number): void {
    const fee = e;
    const newFeeVAT = CalculationHelper.getRoundValue(
      CURRENCIES.VND,
      (fee * 10) / 100
    );
    this.VND_FeeVATCtrl.setValue(newFeeVAT);
    this.updateVATValidation('VND_FeeVAT', newFeeVAT);

    if (this.feeCalData?.exchangeRate) {
      const newFeeEx = CalculationHelper.getRoundValue(
        'EX',
        e / Number(this.feeCalData.exchangeRate)
      );
      const newFeeVATEx = CalculationHelper.getRoundValue(
        'EX',
        (newFeeEx * 10) / 100
      );
      this.EX_FeeVATCtrl.setValue(newFeeVATEx);
      this.EX_FeeCtrl.setValue(newFeeEx);
    }

    this.updateFeeValidation('VND_Fee', e);
    this.onUpdate.emit({ value: e, category: 'VND_Fee' });
  }

  changeFeeEx(e: number): void {
    const feeEx = e;
    const newFeeVATEx = CalculationHelper.getRoundValue(
      'EX',
      (feeEx * 10) / 100
    );
    this.EX_FeeVATCtrl.setValue(newFeeVATEx);

    if (this.feeCalData?.exchangeRate) {
      const newFee = CalculationHelper.getRoundValue(
        CURRENCIES.VND,
        e * Number(this.feeCalData.exchangeRate)
      );
      const newFeeVAT = CalculationHelper.getRoundValue(
        CURRENCIES.VND,
        (newFee * 10) / 100
      );
      this.VND_FeeVATCtrl.setValue(newFeeVAT);
      this.VND_FeeCtrl.setValue(newFee);
    }

    this.updateFeeValidation('EX_Fee', e);
    this.onUpdate.emit({ value: e, category: 'EX_Fee' });
  }

  changeFeeVAT(e: number): void {
    this.updateVATValidation('VND_FeeVAT', e);
    this.onUpdate.emit({ value: e, category: 'VND_FeeVAT' });
  }

  changeFeeVATEx(e: number): void {
    if (this.feeCalData?.exchangeRate) {
      const newFeeVAT = CalculationHelper.getRoundValue(
        CURRENCIES.VND,
        e * Number(this.feeCalData.exchangeRate)
      );
      this.VND_FeeVATCtrl.setValue(newFeeVAT);
    }
    this.updateVATValidation('EX_FeeVAT', e);
    this.onUpdate.emit({ value: e, category: 'EX_FeeVAT' });
  }

  updateFeeValidation(type: FEE_CATEGORY, crrFee: number): void {
    if (!this.feeCalData) {
      return;
    }
    const control = type === 'VND_Fee' ? this.VND_FeeCtrl : this.EX_FeeCtrl;
    const feeItem = this.feeCalData.feeItems.find((item) => {
      if (type === 'VND_Fee') {
        return item.curCode === CURRENCIES.VND;
      } else {
        return item.curCode !== CURRENCIES.VND;
      }
    });

    if (feeItem.feeAmountMin !== 0 && crrFee < Number(feeItem.feeAmountMin)) {
      this.setFormError(
        type,
        this.FORM_VAL_ERRORS.UNDER_MIN,
        `Mức phí tối thiểu là:  ${this.prettyMoneyPipe.transform(feeItem.feeAmountMin)}`
      );
      return;
    } else {
      this.clearFormError(type, this.FORM_VAL_ERRORS.UNDER_MIN);
    }

    if (feeItem.feeAmountMax !== 0 && crrFee > Number(feeItem.feeAmountMax)) {
      this.setFormError(
        type,
        this.FORM_VAL_ERRORS.OVER_MAX,
        `Mức phí tối đa là: ${this.prettyMoneyPipe.transform(feeItem.feeAmountMax)}`
      );
      return;
    } else {
      this.clearFormError(type, this.FORM_VAL_ERRORS.OVER_MAX);
    }
  }

  updateVATValidation(type: FEE_CATEGORY, crrFee: number): void {
    if (!this.feeCalData) {
      return;
    }
    const feeItem = this.feeCalData.feeItems.find((item) => {
      if (type === 'VND_FeeVAT') {
        return item.curCode === CURRENCIES.VND;
      } else {
        return item.curCode !== CURRENCIES.VND;
      }
    });

    if (feeItem.vatMin !== 0 && crrFee < Number(feeItem.vatMin)) {
      this.setFormError(
        type,
        this.FORM_VAL_ERRORS.UNDER_MIN,
        `VAT tối thiểu: ${this.prettyMoneyPipe.transform(feeItem.vatMin)}`
      );
      return;
    } else {
      this.clearFormError(type, this.FORM_VAL_ERRORS.UNDER_MIN);
    }

    if (feeItem.vatMax !== 0 && crrFee > Number(feeItem.vatMax)) {
      this.setFormError(
        type,
        this.FORM_VAL_ERRORS.OVER_MAX,
        `VAT tối đa là: ${this.prettyMoneyPipe.transform(feeItem.vatMax)}`
      );
      return;
    } else {
      this.clearFormError(type, this.FORM_VAL_ERRORS.OVER_MAX);
    }
  }

  setFormError(type: FEE_CATEGORY, errorName: string, message: string) {
    FormHelpers.setFormError({
      control: this.getControlByCategory(type),
      errorName,
      message,
    });
  }

  clearFormError(type: FEE_CATEGORY, errorName: string) {
    FormHelpers.clearFormError({
      control: this.getControlByCategory(type),
      errorName,
    });
  }

  getControlByCategory(type: FEE_CATEGORY): AbstractControl {
    switch (type) {
      case 'VND_Fee':
        return this.VND_FeeCtrl;
      case 'VND_FeeVAT':
        return this.VND_FeeVATCtrl;
      case 'EX_Fee':
        return this.EX_FeeCtrl;
      case 'EX_FeeVAT':
        return this.EX_FeeVATCtrl;
    }
  }

  ngOnDestroy(): void {
    this.VND_FeeCtrl.setErrors(null);
    this.VND_FeeVATCtrl.setErrors(null);
    this.EX_FeeCtrl.setErrors(null);
    this.EX_FeeVATCtrl.setErrors(null);
  }
}
