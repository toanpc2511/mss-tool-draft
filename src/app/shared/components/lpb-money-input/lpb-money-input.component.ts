import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { PrettyMoneyPipe } from '../../pipes/prettyMoney.pipe';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-lpb-money-input',
  templateUrl: './lpb-money-input.component.html',
  styleUrls: ['./lpb-money-input.component.scss'],
})
export class LpbMoneyInputComponent implements OnInit, OnChanges {
  @Input() control: FormControl;
  @Input() class: '';
  @Input() placeholder: string;
  @Input() controlNameVi: string;
  @Input() blockComma = false;
  @Input() name: string;
  @Input() maxlength = 15;
  @Input() showErrorText = true;
  @Input() roundType: 'vnd' | 'ex' | 'unknown' = 'unknown';
  @Output() changeValue = new EventEmitter<number>();
  @Output() blurChangeValue = new EventEmitter<number>();
  @ViewChild('moneyInput', { static: true }) moneyInputEle: ElementRef;
  maxStrLength = 15;

  FORM_VAL_ERRORS = {
    REQUIRED: 'required',
    UNDER_MIN: 'underMin',
    OVER_MAX: 'overMax',
    TOO_BIG: 'tooBig',
  };

  constructor(private prettyMoneyPipe: PrettyMoneyPipe) {}

  ngOnInit(): void {
    // get maximum length of input including comma and point
    const numberOfDots = Math.ceil(this.maxlength / 3) - 1;
    this.maxStrLength =
      this.maxlength + numberOfDots + (this.roundType === 'ex' ? 1 : 0);

    // convert init value
    const initValue = this.control.value;
    this.moneyInputEle.nativeElement.value =
      this.convertControlValue(initValue);

    // watch control's value change
    this.control.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((moneyValue: string | number) => {
        // convert current value
        this.moneyInputEle.nativeElement.value =
          this.convertControlValue(moneyValue);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if maxlength change, change maximum length of input, set control value to value that fit new maxlength
    if (changes?.maxlength && !changes.maxlength.firstChange) {
      const numberOfDots = Math.ceil(this.maxlength / 3) - 1;
      this.maxStrLength =
        this.maxlength + numberOfDots + (this.roundType === 'ex' ? 1 : 0);
      this.control.setValue(
        this.toNumber(this.convertControlValue(this.control.value))
      );
    }

    // if comma is blocked, remove decimal part
    if (changes?.blockComma && !changes.blockComma.firstChange) {
      if (this.control.value && changes.blockComma.currentValue) {
        const floorNumber: number = Math.floor(this.control.value);
        this.control.setValue(floorNumber);
      }
    }
  }

  getFirstError(): string {
    const errors = this.control.errors;
    return Object.keys(errors)[0];
  }

  /**
   *
   * @param moneyValue: (string | number): Convert
   * @returns (string) Money string format (1 point after 3 number, slice string to fit maxlength)
   */
  convertControlValue(moneyValue: string | number): string {
    if (moneyValue === '' || moneyValue === null) {
      return null;
    }
    if (!isNaN(Number(moneyValue))) {
      // if moneyValue is number
      if (typeof moneyValue === 'string') {
        moneyValue = this.toNumber(moneyValue);
      }

      const sliceLength =
        this.maxlength + (moneyValue.toString().includes('.') ? 1 : 0);
      moneyValue = Number(moneyValue.toString().slice(0, sliceLength));
      return this.prettyMoneyPipe.transform(moneyValue);
    } else {
      return moneyValue?.toString().slice(0, this.maxStrLength);
    }
  }

  onInputChange(event: Event & { target: HTMLInputElement }): void {
    const newValue = event.target.value?.trim();
    const newMoneyNumber = this.toNumber(newValue);
    this.control.markAsTouched();
    const crrCursorPos = event.target.selectionStart;

    // if value contains only comma then break scope, set input value is empty, end function
    if (newValue === ',') {
      this.moneyInputEle.nativeElement.value = '';
      event.target.selectionEnd = crrCursorPos;
      return;
    }

    // First comma index in new value
    const firstCommaPos = newValue?.indexOf(',');

    //if  new value is not in number format
    if (isNaN(newMoneyNumber)) {
      // split string in two part: one that precede comma, one that follow comma

      let precedingComma = newValue.slice(0, firstCommaPos);
      precedingComma = this.toNumber(precedingComma).toString();
      precedingComma = this.prettyMoneyPipe.transform(precedingComma);

      // convert each part to money input format (one that follow comma only contain number)
      const followingComma = newValue.slice(firstCommaPos).replace(/\.|,/g, '');

      // merge two parts above with comma
      let newMoney =
        precedingComma + newValue.charAt(firstCommaPos) + followingComma;

      // trim new value to fit maximum input length
      newMoney = newMoney.slice(0, this.maxStrLength);
      this.moneyInputEle.nativeElement.value = newMoney;
      event.target.selectionEnd = crrCursorPos;
    } else {
      const lastChar = newValue.charAt(newValue.length - 1);

      //if last character of string is comma or ( 0 and string contain comma)
      if (lastChar === ',' || (lastChar === '0' && firstCommaPos >= 0)) {
        this.moneyInputEle.nativeElement.value = newValue.slice(
          0,
          this.maxStrLength
        );
      } else {
        this.control.setValue(newMoneyNumber);
        this.changeValue.emit(newMoneyNumber);
      }
    }
  }

  toNumber(s: string): number {
    if (s === null || s === '') {
      return null;
    }
    return Number(s?.trim()?.replace(/\./gi, '')?.replace(/\,/gi, '.'));
  }

  numberOnly(event): boolean {
    const key = event.key;
    const insertIndex = event.target.selectionStart;

    if (key === ',') {
      if (this.blockComma) {
        return false;
      }
      return true;
    }

    const charCode = event.which ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onPaste(event): void {
    const clipboardData = event.clipboardData;
    const pastedText: string = clipboardData.getData('text');

    try {
      if (isNaN(this.toNumber(pastedText))) {
        throw new Error();
      }
    } catch (error) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  /**
   *
   * @param crrNumber (number): value needs to be rounded
   * @returns (number) : Value get rounded based on round type
   */
  getRoundValue(crrNumber: number): number {
    if (crrNumber === null) {
      return null;
    }

    if (this.roundType === 'vnd') {
      return Math.round(crrNumber);
    } else if (this.roundType === 'ex') {
      return Number(
        Math.round(Number(crrNumber.toString() + 'e+2')).toString() + 'e-2'
      );
    }

    return crrNumber;
  }

  onBlur(event: Event & { target: HTMLInputElement }): void {
    const crrNumber = this.toNumber(event.target.value);
    const roundNumber: number = this.getRoundValue(crrNumber);
    this.control.setValue(roundNumber);
    this.blurChangeValue.emit(roundNumber);
  }
}
