import { Pipe, PipeTransform } from '@angular/core';
import { TimeHelper } from '../helpers/time.helper';


@Pipe({
  name: 'prettyDate'
})
export class PrettyDatePipe implements PipeTransform {

  transform(dateValue: string | number, option: 'DATE_ONLY' | 'FULL_DATE'): string {
    if(!dateValue) return '';

    const date = new Date(dateValue);
    let dateStr = date.toLocaleString("en-GB");

    if(option === 'DATE_ONLY') return dateStr.split(',')[0];
    else {
      return dateStr.replace(",", "");
    }
  }
}
