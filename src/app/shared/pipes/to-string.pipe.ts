import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toString',
})
export class ToStringPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    try {
      return value?.toString() || '';
    } catch (error) {
      return '';
    }
  }
}
