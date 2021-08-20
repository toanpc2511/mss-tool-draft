import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
@Pipe({
	name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {
	transform(str: string): string {
		if (str) {
			return moment(str, 'YYYY/MM/DD').format('DD/MM/YYYY').toString();
		}
		return null;
	}
}
