import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { LpbDialogService } from 'src/app/shared/services/lpb-dialog.service';
import { environment } from 'src/environments/environment';
import { BEFORE_CONFIRM_ERROR } from '../constants/common';
import { CustomerUserInfo } from '../models/common';
import {
  ConfirmTransactionRequest,
  CreateTransactionRequest,
  TransactionData,
} from '../models/lv24';

@Injectable({
  providedIn: 'root',
})
export class LV24Service {
  constructor(
    private http: HttpService,
    private dialogService: LpbDialogService,
    private dialog: MatDialog,
    private customNotificationService: CustomNotificationService
  ) {
    this.dialogService.setDialog(this.dialog);
  }
  getBranchList() {
    return this.http.get(`${environment.apiUrl}/admin/api/public/branch`, {
      params: {},
    });
  }
  getCustomerUserInfo({
    input,
    txtSearch,
  }: {
    input: 'docNum' | 'phoneNumber';
    txtSearch: string;
  }): Observable<DataResponse<CustomerUserInfo>> {
    // trim the txtSearch input
    txtSearch = txtSearch?.trim() || '';
    return this.http.get(
      `${environment.apiUrl}/lv24-service/transaction/getCusUserInfo`,
      {
        params: {
          docNum: input === 'docNum' ? txtSearch : '',
          phoneNum: input === 'phoneNumber' ? txtSearch : '',
        },
      }
    );
  }

  getTransactionById(id: string): Observable<DataResponse<TransactionData>> {
    return this.http.get(
      `${environment.apiUrl}/lv24-service/transaction/${id}`,
      {}
    );
  }

  getLatestStatus(
    id: string,
    phoneNum: string
  ): Observable<DataResponse<TransactionData>> {
    return this.http.get(
      `${environment.apiUrl}/lv24-service/transaction/lastestStatus`,
      {
        params: {
          id,
          phoneNum,
        },
      }
    );
  }

  create(
    request: CreateTransactionRequest,
    self?: any
  ): Observable<DataResponse<TransactionData>> {
    return (this || self).http.post(
      `${environment.apiUrl}/lv24-service/transaction`,
      request,
      {}
    );
  }

  approve(
    request: ConfirmTransactionRequest,
    self?: any
  ): Observable<DataResponse<TransactionData>> {
    return (this || self).http.post(
      `${environment.apiUrl}/lv24-service/transaction/approve`,
      request,
      {}
    );
  }

  reject(
    request: ConfirmTransactionRequest,
    self?: any
  ): Observable<DataResponse<TransactionData>> {
    return (this || self).http.post(
      `${environment.apiUrl}/lv24-service/transaction/reject`,
      request,
      {}
    );
  }

  callSvcAfterChkStatus(
    request: ConfirmTransactionRequest | CreateTransactionRequest,
    info: CustomerUserInfo | TransactionData,
    confirmService: (
      request: ConfirmTransactionRequest | CreateTransactionRequest,
      self?: any
    ) => Observable<DataResponse<TransactionData>>
  ): Observable<DataResponse<TransactionData | unknown>> {
    return this.getLatestStatus(info.id, info.phoneNumber).pipe(
      switchMap(({ data, meta }) => {
        if (!data) {
          return confirmService(request);
        }
        const { userStatus, accountStatus, cusStatus } = data;
        if (
          info.userStatus !== userStatus ||
          info.accountStatus !== accountStatus ||
          info.cusStatus !== cusStatus
        ) {
          return throwError({
            status: BEFORE_CONFIRM_ERROR.CHANGED,
            message:
              'Trạng thái người dùng đã thay đổi, vui lòng reload để tiếp tục',
          });
        }
        return confirmService(data);
      }),
      catchError((error) => {
        if (error?.status) {
          return throwError(error);
        }
        return confirmService(request, this);
      })
    );
  }

  handleError(error: any, callback?: () => void) {
    let message: string;
    if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else {
      message = 'Có lỗi xảy ra xin vui lòng thử lại';
    }
    this.customNotificationService.error('Thông báo', message);
    callback && callback();
  }
  handleSuccess(error: any, callback?: () => void) {
    let message: string;
    if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    } else {
      message = 'Thành công';
    }
    this.customNotificationService.success('Thông báo', message);
    callback && callback();
  }
}
