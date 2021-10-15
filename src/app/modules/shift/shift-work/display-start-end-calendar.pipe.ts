import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
	name: 'displayStartEndCalendar'
})
export class DisplayStartEndCalendarPipe implements PipeTransform {
	transform({ start, end }: { start: string; end: string }): string {
		const momentStart = moment(start);
		const momentEnd = moment(end);
		const isNextDay = !momentStart.isSame(momentEnd, 'day');
		if (isNextDay) {
			return `(${momentStart.format('HH:MM')} - ${momentEnd.format('HH:MM')} hôm sau)`;
		}
		return `(${momentStart.format('HH:MM')} - ${momentEnd.format('HH:MM')})`;
	}
}
