import { Directive, HostListener, OnInit, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[trimInput],textarea[trimInput]',
})
export class TrimInputDirective implements OnInit {

  constructor(@Optional() private ngControl: NgControl) {
  }

  ngOnInit(): void {
    if (!this.ngControl) {
      return;
    }

  }

  @HostListener('blur', [
    '$event.target',
    '$event.target.value',
  ])
  onBlur(el: any, value: string): void {
    if ('function' === typeof value.trim && value.trim() !== value) {

      el.value = value.trim();
      const event = document.createEvent('Event');
      event.initEvent('input', false, false);
      el.dispatchEvent(event);

      const eventNew = document.createEvent('Event');
      eventNew.initEvent('blur', false, false);
      el.dispatchEvent(eventNew);
    }
  }

}
