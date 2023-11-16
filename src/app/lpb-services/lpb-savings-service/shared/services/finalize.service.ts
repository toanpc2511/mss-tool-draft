import { Injectable } from '@angular/core';
import { Observable, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { FINALIZE } from '../models/finalize';

@Injectable({
  providedIn: 'root',
})
export class FinalizeService {
  constructor() {}

  getFinalizeById(id: string): Observable<DataResponse<FINALIZE>> {
    return timer(3000).pipe(
      map((e) => {
        return {
          data: {
            cifNo: '00189734',
            accountNumber: '123456789',
            serial: 'ABC-123',
            currency: 'ABC',
            description: 'Fixed deposit',
            settlementType: 'ALL',
            openingDate: '10/10/2021',
            settlementDate: '11/11/2022',
            interestRate: '0.05',
            bookStatus: 'NORMAL1',
            prematureInterest: '20000',
            amount: '100000',
            matureInterest: '500',
            totalAmount: '',
            moneyList: [],
            settlementDeposits: [],
            additionalExpenses: '1',
          } as FINALIZE,
          meta: {
            code: 'uni01-00-200',
            message: 'Thành công',
          },
        } as DataResponse<FINALIZE>;
      })
    );
  }
}
