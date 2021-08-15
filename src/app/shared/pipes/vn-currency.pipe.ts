import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'vnCurrency'
})
export class VnCurrencyPipe implements PipeTransform {
	transform(value: string): string {
		return value.replace(/\./g, ',');
	}
}
