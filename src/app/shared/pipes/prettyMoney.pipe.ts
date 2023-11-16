import { Pipe, PipeTransform } from '@angular/core';
import { removeComma } from 'src/app/shared/constants/utils';
@Pipe({
  name: 'prettyMoney',
})
export class PrettyMoneyPipe implements PipeTransform {
  transform(moneyInput: string | number): string {
    if (moneyInput === 0 || moneyInput === '0'){
      return moneyInput.toString();
    }
    if (!moneyInput) {
      return '';
    }

    if (!isNaN(Number(moneyInput)) && typeof moneyInput === 'number'){
      moneyInput = moneyInput?.toString().replace('.', ',');
    }

    moneyInput = moneyInput.toString().replace(/\./gi, '').trim();

    let prettyMoneys = moneyInput.toString().split(',');

    return `${this.formatMoney(prettyMoneys?.[0]) || ''}${
      prettyMoneys?.[1] ? ',' + prettyMoneys?.[1] : ''
    }`;
  }

  formatMoney(moneyInput: string): string {
    moneyInput = moneyInput.toString().replace(/\./gi, '').trim();
    let prettyMoney = '';

    if (moneyInput.length <= 3) {
      return moneyInput;
    }
    if (moneyInput.length % 3 === 0) {
      prettyMoney = moneyInput.match(/.{1,3}/g).join('.');
    } else {
      prettyMoney =
        moneyInput.substring(0, moneyInput.length % 3) +
        '.' +
        moneyInput
          .slice(moneyInput.length % 3)
          .match(/.{1,3}/g)
          .join('.');
    }
    return prettyMoney;
  }
}
