import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'input[numbersOnly]'
})
export class NumberDirective {
	@Input() numberformControl: FormControl;
	constructor(private _el: ElementRef) {}

	@HostListener('input', ['$event']) onInputChange(event) {
		const initalValue = this._el.nativeElement.value;
		this.numberformControl.patchValue(initalValue.replace(/[^0-9]*/g, ''));
		if (initalValue !== this._el.nativeElement.value) {
			event.stopPropagation();
		}
	}
}
