import { convertTimeToString } from './../../../shared/helpers/functions';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
	transform(item: any): string {
		if (item) {
			return `${convertTimeToString(item.startHour, item.startMinute)} - 
        ${convertTimeToString(item.endHour, item.endMinute)}`;
		}
		return '';
	}
}
