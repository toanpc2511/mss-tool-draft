import { Pipe, PipeTransform } from '@angular/core';
import { Item } from '../models/tuition.interface';

@Pipe({
    name: 'accountingStatus'
})

export class AccountingStatusPipe implements PipeTransform {

    transform(value: string, accountingStatus: Item[]): string {
        let row = accountingStatus.find(x => x.value === value);
        if (row) {
            return row.label;
        }
        return value;
    }

}