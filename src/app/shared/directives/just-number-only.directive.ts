import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[JustNumberOnly]',
})
export class JustNumberOnlyDirective {
  @Input() JustNumberOnly: {
    maxlength?: number;
    dot: boolean;
  };
  constructor(private el: ElementRef, public model: NgControl) {}

  @HostListener('input', ['$event']) onEvent($event) {
    const value = this.el.nativeElement.value + '';
    if (!value) {
      return;
    }
    let value_Only_Numbers = '';
    if (this.JustNumberOnly.dot) {
      value_Only_Numbers = value.replace(/[^.\d]/g, '');
    } else {
      value_Only_Numbers = value.replace(/\D/g, '');
    }
    if (
      this.JustNumberOnly?.maxlength &&
      value_Only_Numbers.length > this.JustNumberOnly.maxlength
    ) {
      value_Only_Numbers = value_Only_Numbers.slice(
        0,
        this.JustNumberOnly.maxlength
      );
    }

    this.el.nativeElement.value = value_Only_Numbers;
    this.model.control.patchValue(value_Only_Numbers);
  }
}
