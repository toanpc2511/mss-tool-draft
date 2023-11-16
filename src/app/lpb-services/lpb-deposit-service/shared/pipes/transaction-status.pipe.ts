import { Pipe, PipeTransform } from '@angular/core';
import { TRANSACTION_STATUSES } from '../constants/deposit-common';

@Pipe({
  name: 'transactionStatus',
})
export class TransactionStatusPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): string {
    return (
      TRANSACTION_STATUSES.find((e) => {
        return e.code === value;
      })?.name || 'Không xác định'
    );
  }
}
