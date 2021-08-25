/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { ElementRef, HostListener, Directive } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[decimal-mask]'
})
export class DecimalMaskDirective {
	constructor(private el: ElementRef, public model: NgControl) {}

	@HostListener('input', ['$event']) onEvent($event) {
		const valArray = [this.el.nativeElement.value + ''];
		for (let i = 0; i < valArray.length; ++i) {
			valArray[i] = valArray[i].replace(/\D/g, '');
		}

		let newVal = '';

		if (valArray.length !== 0) {
			const matches = valArray[0].match(/[0-9]{3}/gim);

			if (matches !== null && valArray[0].length > 3) {
				const commaGroups = Array.from(
					Array.from(valArray[0])
						.reverse()
						.join('')
						.match(/[0-9]{3}/gim)
						.join(',')
				)
					.reverse()
					.join('');
				const replacement = valArray[0].replace(commaGroups.replace(/\D/g, ''), '');
				newVal = (replacement.length > 0 ? replacement + ',' : '') + commaGroups;
			} else {
				newVal = valArray[0];
			}
		}
		this.model.control.setValue(newVal);
	}
}
