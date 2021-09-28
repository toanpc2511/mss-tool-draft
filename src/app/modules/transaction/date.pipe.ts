import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateCustom'
})
export class DatePipe implements PipeTransform {

  transform(value: string): string {
    if(value) {
      const momentValue = moment(value);
      const date = momentValue.format('DD/MM/YYYY');
      const hour = momentValue.hour();
      const minute = momentValue.minute();
      return `${date} ${hour}:${minute}`
    }
    return '';
  }
}
