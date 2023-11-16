import {
  Directive,
  Input,
  HostListener,
  ElementRef,
  forwardRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';

type TextTransformDirectiveOption =
  | 'capitalize'
  | 'uppercase'
  | 'lowercase'
  | 'none';

@Directive({
  selector: 'input[textTransform],textarea[textTransform]',
})
export class TextTransformDirective {
  @Input('textTransform') option: TextTransformDirectiveOption;

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

  capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  getTransformedValue(value: string, option: TextTransformDirectiveOption): string {
    if (value === null || value === undefined) {
      return null;
    }

    switch (option) {
      case 'capitalize':
        return this.capitalizeFirstLetter(value);

      case 'uppercase':
        return value.toUpperCase();

      case 'lowercase':
        return value.toLowerCase();

      case 'none':
        return value;
      default:
        return value;
    }
  }
}
