import { Injectable } from '@angular/core';
import { filter } from 'lodash';
import { cleanAccents } from '../helpers/functions';

@Injectable()
export class FilterService<T> {
  constructor() {}

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
        if (
          data[key] &&
          filterField[key] &&
          (typeof data[key] === 'string' || typeof data[key] === 'number') &&
          cleanAccents(data[key] as string)
            .toLowerCase()
            .includes(cleanAccents(filterField[key] as string).toLowerCase())
        ) {
          isMatched = true;
          break;
        } else if (data[key] === filterField[key]) {
          isMatched = true;
          break;
        }
      }
      return isMatched;
    });
  }
}
