import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
	name: 'isFeatureDate'
})
export class IsFeatureDatePipe implements PipeTransform {
	transform(value: Date): boolean {
		const currentDate = moment();
		return moment(value).isAfter(currentDate);
	}
}
