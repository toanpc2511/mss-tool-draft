import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

const currentDate = moment();

@Pipe({
	name: 'isFeatureDate'
})
export class IsFeatureDatePipe implements PipeTransform {
	transform(value: Date): boolean {
		return moment(value).isAfter(currentDate, 'day');
	}
}
