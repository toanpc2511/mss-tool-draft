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
				if (data[key] && filterField[key] && this.checkDataKey(data, filterField, key)) {
					isMatched = true;
					break;
				}
			}
			return isMatched;
		});
	}

	checkDataKey(data, filterField, key): boolean {
		return (
			((typeof data[key] === 'string' || typeof data[key] === 'number') &&
				cleanAccents(data[key] as string)
					.toLowerCase()
					.includes(cleanAccents(filterField[key] as string).toLowerCase())) ||
			data[key] === filterField[key]
		);
	}
}
