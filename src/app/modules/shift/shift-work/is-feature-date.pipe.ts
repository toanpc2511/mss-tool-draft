import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
	name: 'isFeatureDate'
})
export class IsFeatureDatePipe implements PipeTransform {
	transform(value: Date): boolean {
		const currentDate = moment().add({hour: 7});
		return moment(value).isAfter(currentDate);
	}
}
