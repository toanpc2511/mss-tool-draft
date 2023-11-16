import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceString',
})
export class SliceString implements PipeTransform {
  transform(value: string, fixed: number = 30) {
    if (value.length <= 32) {
      return value;
    }
    return value.slice(0, fixed) + '...';
  }
}
