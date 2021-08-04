import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginator'
})
export class PaginatorPipe implements PipeTransform {
  transform(page: number): number {
    const roundedPage = Math.round(page);
    if (page > 0) {
      if (roundedPage === 0) {
        return 1;
      } else if (page - roundedPage > 0) {
        return roundedPage + 1;
      } else if (page - roundedPage <= 0) {
        return roundedPage;
      }
    }
    return 0;
  }
}
