import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

type TextAreaLimitDirectiveOpt = {
  maxLine: number;
};

@Directive({
  selector: 'textarea[textAreaLimit]'
})
export class TextAreaLimitDirective {
  @Input('textAreaLimit') textAreaLimitOpt: TextAreaLimitDirectiveOpt;

  constructor(private elRef: ElementRef, private control: NgControl) {}

  @HostListener('keypress', ['$event'])
  // tslint:disable-next-line:typedef
  onKeyPress(event): boolean {
    const crrValue: string = this.control.value;
    let rows = 1;
    for (let i = 0; i < crrValue?.length; i++) {
      if (crrValue.charCodeAt(i) === 10) {
        rows += 1;
      }
    }

    if (event.key === 'Enter'){
      rows += 1;
    }

    return rows <= this.textAreaLimitOpt.maxLine;
  }
}
