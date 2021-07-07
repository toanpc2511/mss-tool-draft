import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringMaxLength'
})
export class StringMaxLengthPipe implements PipeTransform {
  transform(str: string, maxLength: number): unknown {
    if (str) {
      if (str.length <= maxLength) {
        return str;
      } else {
        return `${str.substr(0, maxLength)}...`;
      }
    }
    return '';
  }
}
