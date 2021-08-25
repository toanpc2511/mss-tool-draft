/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { formatMoney } from './helpers/functions';

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

	static min =
		(min: number) =>
		(control: FormControl): ValidationErrors | null => {
			const value = control?.value as string;
			if (typeof value === 'string') {
				const valueOrigin = value?.replace(/,/g, '') || null;
				if (valueOrigin && Number(valueOrigin) < min) {
					return { min: true };
				}
			} else {
				if (value) {
					control.patchValue(formatMoney(value), { emitEvent: false, onlySelf: true });
				}
			}
			return null;
		};
}
