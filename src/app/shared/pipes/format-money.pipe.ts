import { Pipe, PipeTransform } from '@angular/core';
import { formatPoint, removeComma } from '../constants/utils';

@Pipe({
  name: 'formatMoney'
})
export class FormatMoneyPipe implements PipeTransform {

  transform(moneyInput: any, currencyInput: string): string {
    let isVND = true;
    if (currencyInput && currencyInput !== 'VND') {
      isVND = false;
    }

    try {
      if (moneyInput === null || moneyInput === '') {
        return '';
      }
      if (!moneyInput) {
        return isVND ? '0' : '0.00';
      }
      moneyInput = moneyInput.toString().trim();
      moneyInput = removeComma(moneyInput);
      const isNegative = moneyInput.startsWith('-');
      moneyInput = moneyInput.replace('-', '');
      let haveDecimal = moneyInput.toString().indexOf('.') > -1;
      let left = moneyInput;
      let right = '';
      if (haveDecimal) {
        left = moneyInput.split('.')[0];
        right = moneyInput.split('.')[1];
      }

      left = left.replace(/[^0-9]|(^0+)/g, ''); // xóa kí tự đặc biệt và số 0 bên trái
      if (left === '') {
        left = '0';
      }
      left = formatPoint(left);

      right = right.replace(/0+$/, ''); // xóa số 0 bên phải

      if (!isVND) {
        haveDecimal = true;
        right = right.padEnd(2, '0');
      }

      moneyInput = left;
      if (haveDecimal && right.length > 0) {
        moneyInput = moneyInput + '.' + right;
      }

      if (isNegative) {
        moneyInput = '-' + moneyInput;
      }

      return moneyInput;
    } catch (e) {
      // console.log('Format money error: ', e);
      return moneyInput;
    }
  }

}
