import { NativeDateAdapter } from '@angular/material/core';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class DateAdapterService extends NativeDateAdapter {
  parse(value: any, displayFormat?: string): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const str = value.split('/');
      let year;
      let month;
      let date;
      if (displayFormat === 'inputDate') {
        year = Number(str[2]);
        month = Number(str[1]) - 1;
        date = Number(str[0]);
      } else if (displayFormat === 'inputMonth') {
        year = Number(str[1]);
        month = Number(str[0]) - 1;
        date = 1;
      }
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
  format(date: Date, displayFormat: string): string {
    if (displayFormat === 'input') {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return this._to2digit(day) + '/' + this._to2digit(month) + '/' + year;
    } else if (displayFormat === 'inputMonth') {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return this._to2digit(month) + '/' + year;
    } else {
      return date.toDateString();
    }
  }

  // tslint:disable-next-line:typedef
  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
}
