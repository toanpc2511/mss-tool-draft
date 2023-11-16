import { CURRENCIES } from "src/app/shared/constants/finance";
import { FeeCalculationData } from "src/app/shared/models/common.interface";

export class CalculationHelper{
  static getRoundValue(roundType: string, value: number | string): number {
    if (value === null) {
      return null;
    }

    if (roundType === CURRENCIES.VND) {
      return Math.round(Number(value));
    } else {
      return Number(
        Math.round(Number(value.toString() + 'e+2')).toString() + 'e-2'
      );
    }
  }

  static parseNumberFeeData(feeCalData: FeeCalculationData){
    feeCalData.feeItems = feeCalData.feeItems.map((item) => ({
      curCode: item.curCode,
      feeAmount: this.getRoundValue(item.curCode, item.feeAmount),
      feeAmountMin: this.getRoundValue(item.curCode, item.feeAmountMin),
      feeAmountMax: this.getRoundValue(item.curCode, item.feeAmountMax),
      vat: this.getRoundValue(item.curCode, item.vat),
      vatMin: this.getRoundValue(item.curCode, item.vatMin),
      vatMax: this.getRoundValue(item.curCode, item.vatMax),
    }));
    feeCalData.exchangeRate = Number(feeCalData.exchangeRate);
    return feeCalData;
  }
}
