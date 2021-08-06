import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxSelectedDisplay'
})
export class MaxSelectedDisplayPipe implements PipeTransform {
  transform(value: Array<any>, maxSelectedDisplay: number): unknown {
    if (value.length > maxSelectedDisplay) {
      return value.splice(0, maxSelectedDisplay);
    }
    return value;
  }
}
