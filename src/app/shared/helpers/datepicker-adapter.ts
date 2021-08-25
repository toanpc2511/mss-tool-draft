/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable({
	providedIn: 'root'
})
export class CustomAdapter extends NgbDateAdapter<string> {
	readonly DELIMITER = '/';

	fromModel(value: string | null): NgbDateStruct | null {
		if (moment(value, 'DD/MM/YYYY').isValid()) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10)
			};
		}
		return null;
	}

	toModel(date: NgbDateStruct | null): string | null {
		if (date) {
			const value = moment(`${date.month}/${date.day}/${date.year}`);
			if (value.isValid()) {
				return value.format('DD/MM/YYYY');
			}
		}
		return null;
	}
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable({
	providedIn: 'root'
})
export class CustomDateParserFormatter extends NgbDateParserFormatter {
	readonly DELIMITER = '/';

	parse(value: string): NgbDateStruct | null {
		if (moment(value, 'DD/MM/YYYY').isValid()) {
			const date = value.split(this.DELIMITER);
			return {
				day: parseInt(date[0], 10),
				month: parseInt(date[1], 10),
				year: parseInt(date[2], 10)
			};
		}
		return null;
	}

	format(date: NgbDateStruct | null): string {
		if (date) {
			const value = moment(`${date.month}/${date.day}/${date.year}`);
			if (value.isValid()) {
				return value.format('DD/MM/YYYY');
			}
		}
		return null;
	}
}
