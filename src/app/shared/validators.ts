import { NO_EMIT_EVENT } from './app-constants';
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { FormControl, ValidationErrors, Validators } from '@angular/forms';
import { formatMoney } from './helpers/functions';

const longtitudePattern = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
const latitudePattern = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
const phonePattern = /^([0-9]{10}|[0-9]{11}|[0-9]{12})$/;
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

	static max =
		(max: number) =>
		(control: FormControl): ValidationErrors | null => {
			const value = control?.value as string;
			if (typeof value === 'string') {
				const valueOrigin = value?.replace(/,/g, '') || null;
				if (valueOrigin && Number(valueOrigin) > max) {
					return { max: true };
				}
			} else {
				if (value) {
					control.patchValue(formatMoney(value), { emitEvent: false, onlySelf: true });
				}
			}
			return null;
		};

	static coordinates = (control: FormControl): ValidationErrors | null => {
		const value = control?.value as string;
		if (value) {
			const coordinates = value?.split(',') || null;
			if (
				!coordinates ||
				coordinates.length !== 2 ||
				coordinates[0].length === 0 ||
				coordinates[1].length === 0 ||
				!longtitudePattern.test(coordinates[0]) ||
				!latitudePattern.test(coordinates[1])
			) {
				return { coordinates: true };
			}
		}
		return null;
	};

	static phone = (control: FormControl): ValidationErrors | null => {
		const value = control.value || '';
		if (!value.trim()) {
			return { required: true };
		}
		if (!phonePattern.test(value)) {
			return { phone: true };
		}
		return null;
	};

	static noWhiteSpace = (control: FormControl): ValidationErrors | null => {
		const value = control?.value as string;
		if (value?.includes(' ')) {
			control.patchValue(value.split(' ').join(''), NO_EMIT_EVENT);
		}
		return null;
	};
}
