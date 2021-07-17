import { Injectable } from '@angular/core';
import { orderBy } from 'lodash';
import { SortState } from 'src/app/_metronic/shared/crud-table';

@Injectable()
export class SortService<T> {
  sorting: SortState;
  constructor() {
    this.sorting = new SortState();
  }

  sort(dataSource: Array<T>, column: string): Array<T> {
    const isActiveColumn = this.sorting.column === column;
    if (!isActiveColumn) {
      this.sorting.column = column;
      this.sorting.direction = 'asc';
    } else {
      if (this.sorting.direction === 'asc') {
        this.sorting.direction = 'desc';
      } else if (this.sorting.direction === 'desc') {
        this.sorting.column = '';
      }
    }
    return this.sortData(dataSource);
  }

  private sortData(dataSource: Array<T>) {
    if (this.sorting.direction === 'desc') {
      return orderBy(dataSource, this.sorting.column).reverse();
    }
    return orderBy(dataSource, this.sorting.column);
  }
}
