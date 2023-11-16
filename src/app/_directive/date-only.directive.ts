import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[DateOnly]'
})
export class DateOnlyDirective {

  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initialValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initialValue.replace(/[^0-9/]*/g, '');
    if ( initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
