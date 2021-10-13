import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { getWeekDay } from 'src/app/shared/helpers/functions';

@Pipe({
	name: 'dateString'
})
export class DateStringPipe implements PipeTransform {
	transform(value: string): string {
		if (value) {
			const dateValue = moment(value).add({ hour: 7 });
			const weekDay = getWeekDay(dateValue);
			const day = dateValue.date();
			const month = dateValue.month() + 1;
			const year = dateValue.year();
			return `${weekDay}, ngày ${day} tháng ${month} năm ${year}`;
		}
		return '';
	}
}
