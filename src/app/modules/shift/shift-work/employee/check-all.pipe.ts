import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'checkAll',
  pure:false
})
export class CheckAllPipe implements PipeTransform {

  transform(data: any[]): boolean {
    return !data.some(x => !x.isChecked);
  }
}
