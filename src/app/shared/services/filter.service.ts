/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@angular/core';
import { filter } from 'lodash';
import { cleanAccents } from '../helpers/functions';

@Injectable()
export class FilterService<T> {
	filter(dataSource: Array<T>, filterField: any): Array<T> {
		let isValidFilter = false;

		for (const key in filterField) {
			if (filterField[key]) {
				isValidFilter = true;
				break;
			}
		}

		if (!isValidFilter) {
			return dataSource;
		}

		return filter(dataSource, (data) => {
			let isMatched = false;
			for (const key in filterField) {
				if (this.checkDataKey(data, filterField, key)) {
					isMatched = true;
					break;
				}
			}
			return isMatched;
		});
	}

	checkDataKey(data, filterField, key): boolean {
		let dataByKey: string = data[key];
		const filterFieldValue: string = filterField[key];
		if (typeof dataByKey === 'number') {
			dataByKey = String(dataByKey);
		}
		if (!dataByKey || !(typeof dataByKey === 'string' || typeof dataByKey === 'number')) {
			return false;
		}
		return cleanAccents(dataByKey)
			.toLowerCase()
			.includes(cleanAccents(filterFieldValue).toLowerCase());
	}
}
