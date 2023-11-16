import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CustomerInfo,
  GetCustomerInfoInputType,
} from 'src/app/shared/models/common.interface';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private http: HttpService,
    private httpClient: HttpClient,
    private customNotificationService: CustomNotificationService
  ) {}

  getCustomerInfo(
    textSearch: string,
    inputType: GetCustomerInfoInputType
  ): Observable<DataResponse<CustomerInfo[]>> {
    return this.http.get<CustomerInfo[]>(
      `${environment.apiUrl}/deposit-service/customer/info?inputType=${inputType}&input=${textSearch}`,
      {}
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
}
