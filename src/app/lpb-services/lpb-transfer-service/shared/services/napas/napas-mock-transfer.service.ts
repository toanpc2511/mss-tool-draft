import { Injectable } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { SpinnerHandlerService } from 'src/app/shared/services/spinner-handler.service';
import {
  NapasCardInfo
} from '../../models/napas';

@Injectable({
  providedIn: 'root',
})
export class NapasMockTransferService {
  private mockAcc = [
    {
      acn: '0129837294',
      bankCode: '970406',
      customerName: 'Le Van A',
    },
    {
      acn: '1919494499',
      bankCode: '970422',
      customerName: 'Do Quang Test',
    },
    {
      acn: '8764656513',
      bankCode: '970423',
      customerName: 'Nguyen Duong Mock',
    },
  ];

  private mockCard = [
    {
      cardNum: '9704069876543210',
      bankName: 'DongA Bank_Ngân hàng TMCP Đông Á',
      customerName: 'Vu Thi B',
    },
    {
      cardNum: '8979416516949753',
      bankName: 'VPBank_Ngân hàng TMCP Việt Nam Thịnh Vương',
      customerName: 'Doan Trung Test1',
    },
    {
      cardNum: '4561237853423759',
      bankName: 'BIDV_Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
      customerName: 'Mac Van Mock2',
    },
  ];

  private meta = {
    SUCCESS: {
      code: 'uni-200',
      message: 'Thành công',
    },

    ERROR: {
      code: 'uni-400',
      message: 'Không tìm thấy dữ liệu',
    },
  };

  private debounceTime = 500;

  constructor(public spinnerHandler: SpinnerHandlerService) {}

  getCardInfo(cardNum: string): Observable<DataResponse<NapasCardInfo>> {
    this.spinnerHandler.setLoading(true, 'getCardInfo');

    return timer(this.debounceTime).pipe(
      switchMap(() => {
        const cardInfo = this.mockCard.find((data) => data.cardNum === cardNum);

        if (cardInfo) {
          const response: DataResponse<NapasCardInfo> = {
            data: {
              bankName: cardInfo.bankName,
              customerName: cardInfo.customerName,
            },
            meta: this.meta.SUCCESS,
          };

          return of(response);
        } else {
          return throwError(this.meta.ERROR);
        }
      }),
      finalize(() => {
        this.spinnerHandler.setLoading(false, 'getCardInfo');
      })
    );
  }

  getCustomerNameByAcnAndBankCode({
    acn,
    bankCode,
  }: {
    acn: string;
    bankCode: string;
  }): Observable<DataResponse<string>> {
    this.spinnerHandler.setLoading(true, 'getCustomerNameByAcnAndBankCode');

    return timer(this.debounceTime).pipe(
      switchMap(() => {
        const account = this.mockAcc.find((data) => data.acn === acn && data.bankCode === bankCode);

        if (account) {
          const response: DataResponse<string> = {
            data: account.customerName,
            meta: this.meta.SUCCESS,
          };

          return of(response);
        } else throwError(this.meta.ERROR);
      }),
      finalize(() => {
        this.spinnerHandler.setLoading(false, 'getCustomerNameByAcnAndBankCode');
      })
    );
  }
}
