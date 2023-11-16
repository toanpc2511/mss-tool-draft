import { Directive, Input, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { TextHelper } from '../utilites/text';

type TextEncodeDirectiveOption =  'vi' | 'latin';

@Directive({
  selector: 'input[textEncode],textarea[textEncode]',
})
export class TextEncodeDirective {
  @Input('textEncode') option: TextEncodeDirectiveOption;

  constructor(private elRef: ElementRef, private control: NgControl) {}

  @HostListener('blur', ['$event'])
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

  getTransformedValue(value: string, option: TextEncodeDirectiveOption): string {
    if (value === null || value === undefined) {
      return null;
    }
    switch (option) {
      case 'latin':
        return TextHelper.latinNormalize(value);
      default:
        return value;
    }
  }
}
