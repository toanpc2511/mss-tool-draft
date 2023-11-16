import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SearchCardRequest } from '../models/card-inssuance';
import {
  CardServiceResponse,
  SearchServiceHistoryRequest,
  SendApproveRequest,
} from '../models/card-services-extend';
import { MatDialog } from '@angular/material/dialog';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { CardServiceCommonService } from './card-service-common.service';

@Injectable({
  providedIn: 'root',
})
export class CardServicesExtendService {
  constructor(
    private http: HttpClient,
    private lpbDialogService: LpbDialogService,
    private matDialog: MatDialog,
    private cardServiceCommonService: CardServiceCommonService
  ) {
    this.lpbDialogService.setDialog(this.matDialog);
  }

  checkValidCardInfo(cardInfo: any): void {
    const crrDateStr = moment().format('DD/MM/YYYY');
    const crrDate = moment(crrDateStr, 'DD/MM/YYYY').toDate();
    let isExpired = false;
    let invalidPinCount = false;

    let expireDate;
    try {
      const expireDateStr = cardInfo?.expireDate;
      expireDate = moment(expireDateStr, 'DD/MM/YYYY').toDate();
    } catch (error) {
      console.error(error);
    }

    if (expireDate && expireDate < crrDate) {
      isExpired = true;
    }

    const pinCount = Number(cardInfo?.pinCount);
    if (pinCount >= 3) {
      invalidPinCount = true;
    }

    if (isExpired && invalidPinCount) {
      throw Error(
        'Thẻ không được thực hiện dịch vụ do hết hạn và PIN count ≥ 3'
      );
    }

    if (isExpired) {
      throw Error('Thẻ không được thực hiện dịch vụ do hết hạn');
    }

    if (invalidPinCount) {
      throw Error('Thẻ không được thực hiện dịch vụ do PIN count ≥ 3');
    }
  }
  checkValidIfExpired(cardInfo: any): void {
    // => check lại truờng hợp thẻ nếu thẻ hết hạn khi gửi duyệt, bỏ kiểm tra pin count
    const crrDateStr = moment().format('DD/MM/YYYY');
    const crrDate = moment(crrDateStr, 'DD/MM/YYYY').toDate();
    let isExpired = false;
    let expireDate;
    try {
      const expireDateStr = cardInfo?.expireDate;
      expireDate = moment(expireDateStr, 'DD/MM/YYYY').toDate();
    } catch (error) {
      console.error(error);
    }
    if (expireDate && expireDate < crrDate) {
      isExpired = true;
    }
    if (isExpired) {
      throw Error('Thẻ không được thực hiện dịch vụ do hết hạn');
    }
  }

  searchCustomerCards(request: SearchCardRequest): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/card/cardCore/search`,
      request
    );
  }

  getCardInfo(cardId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set('x-skip-spinner', 'true');
    return this.http.post<any>(
      `${environment.apiUrl}/card/cardCore/getOne?cardId=${cardId}`,
      { headers }
    );
  }

  getCardInforNew(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/card/cardCore/detail/${id}`);
  }

  getCardDetail(cardId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/card/cardCore/getCardDetail?cardId=${cardId}`);
  }

  getServiceCode(req): any {
    return this.http.post(`${environment.apiUrl}/card/cardCore/exportLklkYctgkhcn`, req);
  }

  sendApproveLinkAcc(req): Observable<any> {
    return this.http.post(`${environment.apiUrl}/card/cardCore/sendApproveLktk`, req);
  }


  validCardInfo(cardId: string): Observable<boolean> {
    return new Observable((subscribe) => {
      this.getCardInfo(cardId).subscribe((result) => {
        try {
          this.checkValidCardInfo(result);
          subscribe.next(true);
        } catch (error) {
          subscribe.next(false);
          this.lpbDialogService.openDialog(
            {
              title: 'Thông báo',
              messages: [error.message],
              buttons: {
                confirm: { display: false },
                dismiss: {
                  display: true,
                  label: 'Đóng',
                  bgColor: '#23388F',
                  color: '#fff',
                },
              },
            },
            () => {}
          );
        } finally {
          subscribe.complete();
        }
      });
    });
  }
  validCardWithoutCheckPinCount(cardId: string): Observable<boolean> {
    return new Observable((subscribe) => {
      this.getCardInfo(cardId).subscribe((result) => {
        try {
          this.checkValidIfExpired(result);
          subscribe.next(true);
        } catch (error) {
          subscribe.next(false);
          this.lpbDialogService.openDialog(
            {
              title: 'Thông báo',
              messages: [error.message],
              buttons: {
                confirm: { display: false },
                dismiss: {
                  display: true,
                  label: 'Đóng',
                  bgColor: '#23388F',
                  color: '#fff',
                },
              },
            },
            () => {}
          );
        } finally {
          subscribe.complete();
        }
      });
    });
  }

  checkLockCreditCard(cardCordId: string): Observable<boolean> {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return new Observable((observer) => {
      let params = new HttpParams()
        .set('cardCoreId', cardCordId)
        .set('branchCodeDo', userInfo.branchCode);

      this.http
        .get<any>(`${environment.apiUrl}/card/cardCore/checkCreditHis`, {
          params,
        })
        .subscribe(
          (res) => {
            if (res) {
              this.cardServiceCommonService
                .getBranchInfo(res?.recentlyBranchCode)
                .subscribe(
                  (res) => {
                    const info = res.item;
                    this.lpbDialogService.openDialog(
                      {
                        title: 'Thông báo',
                        messages: [
                          `Thẻ bị khóa do liên đới tín dụng tại ${info?.branchFullName}, vui lòng mở khóa tại chi nhánh thực hiện khóa thẻ`,
                        ],
                        buttons: {
                          confirm: { display: false },
                          dismiss: {
                            display: true,
                            label: 'Đóng',
                            bgColor: '#23388F',
                            color: '#fff',
                          },
                        },
                      },
                      () => {}
                    );
                  },
                  (error) => {},
                  () => {
                    observer.next(false);
                  }
                );
            } else {
              observer.next(true);
            }
          },
          (error) => {
            observer.next(false);
          }
        );
    });
  }

  sendApprove(request: SendApproveRequest): Observable<CardServiceResponse> {
    const formRequest = new FormData();
    formRequest.append(
      'dto',
      new Blob([JSON.stringify(request.dto)], {
        type: 'application/json',
      })
    );
    if (request.file) {
      formRequest.append('file', request.file);
    }

    return this.http.post<CardServiceResponse>(
      `${environment.apiUrl}/card/cardCore/sendApprove`,
      formRequest
    );
  }

  emergencyLock(request: SendApproveRequest): Observable<CardServiceResponse> {
    return this.http.post<CardServiceResponse>(
      `${environment.apiUrl}/card/cardCore/lockCardLost`,
      request.dto
    );
  }

  getHistories(
    request: SearchServiceHistoryRequest
  ): Observable<CardServiceResponse> {
    return this.http.post<any>(
      `${environment.apiUrl}/card/cardCore/history`,
      request
    );
  }
  exportHistories(request: SearchServiceHistoryRequest): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/card/cardCore/exportHistory`,
      request,
      {
        observe: 'response',
        responseType: 'blob' as 'json',
        headers: { 'x-skip-spinner': 'true' },
      }
    );
  }
}
