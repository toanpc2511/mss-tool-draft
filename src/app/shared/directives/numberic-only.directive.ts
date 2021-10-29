import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'input[numbersOnly]'
})
export class NumberDirective {
	constructor(private _el: ElementRef, private control: NgControl) {}

	@HostListener('input', ['$event']) onInputChange(event: Event) {
		const initalValue = this._el.nativeElement.value;
		this.control.control.patchValue(initalValue.replace(/[^0-9]*/g, ''));
		if (initalValue !== this._el.nativeElement.value) {
			event.stopImmediatePropagation();
		}
	}
}
