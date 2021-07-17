import { Injectable } from '@angular/core';
import { filter } from 'lodash';

@Injectable()
export class FilterService<T> {
  constructor() {}

  filter(dataSource: Array<T>, filterField: any) {
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
        if (typeof data[key] === 'string' && data[key].includes(filterField[key])) {
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
