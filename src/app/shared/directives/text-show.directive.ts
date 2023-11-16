import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

type TextShowDirectiveOption = {
  number?: boolean;
  text?: boolean;
  specialCharacter?: boolean;
  space?: boolean;
  alowSpecialChars?: RegExp;
};

@Directive({
  selector: 'input[textShow],textarea[textShow]',
})
export class TextShowDirective {
  @Input('textShow') option: TextShowDirectiveOption;

  constructor(private elRef: ElementRef, private control: NgControl) {}

  @HostListener('input', ['$event'])
  // tslint:disable-next-line:typedef
  onInputChange(
    event: Event & { target: HTMLInputElement | HTMLTextAreaElement }
  ) {
    const value = event.target.value;

    const transformedText = this.getTransformedValue(value, this.option);
    if (transformedText !== null) {
      this.elRef.nativeElement.value = transformedText;
      if (this.control?.control) {
        this.control.control.setValue(transformedText);
      }
    }
  }

  private getTransformedValue(value: string, option: TextShowDirectiveOption): string {
    if (value === null || value === undefined) {
      return null;
    }

    if (
      option?.specialCharacter !== undefined &&
      option?.specialCharacter === false
    ) {
      value = this.toNoSpecialCharacter(value);

      if (!(option?.text !== undefined && option?.text === false)) {
        value = value.replace(/[.-]/g, '');
      }
    }

    // bỏ number
    if (option?.number !== undefined && option?.number === false) {
      value = this.toNoNumber(value);
    }

    // bỏ a-z A-Z
    if (option?.text !== undefined && option?.text === false) {
      value = this.toNoText(value);
    }

    // bỏ dấu cách
    if (option?.space !== undefined && option?.space === false) {
      value = this.toNoSpace(value);
    }

    return value;
  }

  toNoSpecialCharacter(value: string): string {
    if (!value) {
      return '';
    }
    let str = value;
    str = str.replace(/=|\+|\\|/g, '');
    str = str.replace(/~|`|!|@|#|\$|%|\^|\*|&|\(|\)|\_/g, '');
    str = str.replace(/,|<|>|"|;|'|\[|\]|\{|\}|:|\||\/|\?|/g, '');
    return str;
  }

  toNoNumber(value: string): string {
    if (!value) {
      return '';
    }
    return value.replace(/[0-9]*/g, '');
  }

  toNoText(value: string): string {
    if (!value) {
      return '';
    }
    // return value.replace(/\D/g, '');

    return value.replace(/[^\d.-]/g, '');
  }

  toNoSpace(value: string): string {
    if (!value) {
      return '';
    }
    return value.replace(/\s+/g, '');
  }
}
