import {Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[appDecimalOnly]'
})
export class DecimalOnlyDirective {

  constructor(private element: ElementRef) {
  }

  @HostListener('input', ['$event'])
  inputChange(): void {

    this.element.nativeElement.value = this.element.nativeElement.value
      .replace(/[^0-9\.]/g, '')
      // Replace extra dots
      .replace('.', '%FD%')
      .replace(/\./g, '')
      .replace('%FD%', '.');
  }
}
