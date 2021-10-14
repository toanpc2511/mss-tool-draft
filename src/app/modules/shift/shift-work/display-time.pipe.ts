import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'displayTime'
})
export class DisplayTimePipe implements PipeTransform {
	transform(value: string, type?: 'TO_DAY' | 'THE_NEXT_DAY'): string {
		return value ? value.substr(0, 5) + (type === 'THE_NEXT_DAY' ? ' hôm sau' : '') : '';
	}
}
