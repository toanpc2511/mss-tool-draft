import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'compare',
})
export class ComparePipe implements PipeTransform {
  transform(values: any[], operator: 'equal' | 'include' | undefined): unknown {
    if (!values || values.length < 2) {
      return false;
    }

    switch (operator) {
      case 'include':
        if (!Array.isArray(values[0])) {
          return;
        }
        return values[0]?.some((e) => e === values[1]);
      case 'equal':
      default:
        if (values[0] === values[1]) {
          return true;
        }
        return false;
    }
  }
}
