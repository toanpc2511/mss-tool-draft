import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { formatPoint, getDecimals } from '../constants/utils';

@Directive({
  selector: '[appInputMoney]'
})
export class InputMoneyDirective {

  @Input() inputMoney;
  maxLength;
  constructor(
    private elRef: ElementRef,
    private control: NgControl) {
  }

  @HostListener('input', ['$event'])
  // tslint:disable-next-line:typedef
  onInputChange(event) {
    this.maxLength = this.inputMoney ? +this.inputMoney : 15;
    let result = event.target.value;
    if (typeof result !== 'string' && result) {
      result = result.toString();
    }
    result = result.replace(/,/g, '');
    result = result.replace(/[^0-9]|(^0+)/g, '');

    if (result.length > this.maxLength) {
      result = result.substring(0, this.maxLength);
    }
    const decimals = getDecimals(result);
    result = result.replace(decimals, '');
    const money = decimals ? formatPoint(result) : `${formatPoint(result)}${decimals}`;
    if (money.length === 1 && money === '0') {
      this.elRef.nativeElement.value = '';
      this.control.control.setValue('');
    } else {
      this.elRef.nativeElement.value = money;
      this.control.control.setValue(money);
    }
  }

  @HostListener('paste', ['$event'])
  // tslint:disable-next-line:typedef
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData
      .getData('text/plain')
      .replace(/\D/g, ''); // get a digit-only string
    document.execCommand('insertText', false, pastedInput);
  }

}
