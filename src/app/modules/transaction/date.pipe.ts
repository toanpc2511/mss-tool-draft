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
      const hour = momentValue.hour() > 10 ? momentValue.hour() : '0' + momentValue.hour();
      const minute = momentValue.minute() > 10 ? momentValue.minute() : '0' + momentValue.minute();
      return `${date} ${hour}:${minute}`
    }
    return '';
  }
}
