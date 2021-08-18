/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import * as moment from 'moment';

export class TValidators extends Validators {
	static patternNotWhiteSpace =
		(regex: RegExp) =>
		(control: FormControl): ValidationErrors | null => {
			const value = control.value;
			if (!value.trim()) {
				return { required: true };
			}
			if (!regex.test(value)) {
				return { pattern: true };
			}
			return null;
		};

	static afterCurrentDate =
		() =>
		(control: FormControl): ValidationErrors | null => {
			const value = control.value;

			if (value) {
				const dateValue = moment(value, 'DD/MM/YYYY');
				const currentDateValue = moment(new Date(), 'DD/MM/YYYY');
				console.log(moment(currentDateValue).diff(dateValue, 'day'));
				if (!dateValue.isValid()) {
					return { invalidDate: true };
				}
			}
			return null;
		};
}
