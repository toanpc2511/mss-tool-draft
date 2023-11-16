import { Pipe, PipeTransform } from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Pipe({
  name: 'vnCurency',
})
export class VnCurency implements PipeTransform {
  constructor(private numberPipe: DecimalPipe) {
  }
  transform(value: number): string | number {
    if (value) {
      return this.numberPipe.transform(value, '1.0');
    }
    return 0;
  }
}
