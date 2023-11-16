import {EventEmitter, Injectable, Output} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpService} from '../../../../shared/services/http.service';
import {FileService} from '../../../../shared/services/file.service';
import {
  GET_INFO_BILL, GET_SUPPLIER, LIST_TRANS_SERVICE,
  TRANS_DETAIL_SERVICE,
  TRANS_SERVICE,
  VIETTEL_POST_SERVICE
} from '../constants/url.viettel-post.service';
import {IAccount} from '../../../../system-configuration/shared/models/lvbis-config.interface';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {IOutPut, ISchool} from '../../../lpb-tuition-service/shared/models/tuition.interface';
import {HTTPMethod} from '../../../../shared/constants/http-method';
import {timeout} from 'rxjs/operators';
import {NotificationService} from '../../../../_toast/notification_service';
import {AUTHORIZE_MANAGE, TRANS_APPROVE} from '../../../lpb-vietlott-service/shared/constants/url.vietlott.service';
import {IError} from '../../../../shared/models/error.model';
import {FormMessageService} from '../../../../shared/services/form-message.service';
import {saveAs} from 'file-saver';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';

@Injectable({
  providedIn: 'root'
})
export class ViettelPostService {
  header: any;
  @Output() progressEvent: EventEmitter<boolean> = new EventEmitter();
  API_URL = `${environment.apiUrl}/${VIETTEL_POST_SERVICE}`;
  // API_URL = 'http://localhost:8082';
  transactionApproveSubject = new BehaviorSubject([]);

  constructor(private readonly httpClient: HttpClient,
              private http: HttpService,
              private fileService: FileService,
              private toastr: CustomNotificationService) {
  }

  // Tim kiem thong tin tai khoan tu so CIF
  searchCifInfo(params): Observable<any> {
    return this.http.get<IAccount>(`${this.API_URL}/cif/info`, {params});
  }

  // Tim kiem thong tin bang ke
  getInfoBill(params): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${GET_INFO_BILL}`, {params});
  }

  // Huy giao dich
  cancelTrans(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/${LIST_TRANS_SERVICE}/${id}`, {});
  }


  // Tao moi giao dich
  createTrans(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${TRANS_SERVICE}`, body, {});
  }

  // Chi tiet giao dich theo ID
  getTransDetail(id: string): Observable<any> {
    return this.http.get<IAccount>(`${environment.apiUrl}/${TRANS_DETAIL_SERVICE}/${id}`, {});
  }

  getListSupplier(filter: string): any {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '9999')
      .set('filter', filter)
      .set('sort', 'name:ASC');
    return this.http.get<any>(`${environment.apiUrl}/${GET_SUPPLIER}`, {params});
  }

  searchTransaction(urlPath: string, maBk: string, status: string, fromDate: string, toDate: string): any {
    const params = new HttpParams()
      .set('vtpCode', maBk)
      .set('status', status)
      .set('fromDate', fromDate)
      .set('toDate', toDate);
    return this.http.get<ISchool[]>(`${this.API_URL}/transaction`, {
      params
    });
  }
  callApiTransaction(url: string, body: any): Observable<any> {
    return this.http.post(`${this.API_URL}/${url}`, body, {});
  }

  // tslint:disable-next-line:typedef
  getAllBranch(url: string): Observable<any>{
    return this.http.get<any>(`${this.API_URL}/${url}`, {});
  }

  downloadFileBc(url: string, branchCode: string, startDate: string, endDate: string, fileName?: string): any {
    const param = {branchCode, startDate, endDate};
    return this.httpClient.get<Blob>(`${this.API_URL}/${url}`,
      {
        headers: {...this.header},
        params: param,
        observe: 'response',
        responseType: 'blob' as 'json'
      })
      .subscribe((res) => {
        const contentDisposition = res.headers.get('content-disposition');
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['']).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['']/g, '');
          }
        }

        saveAs(res.body, fileName);
      }, () => this.toastr.error('Lỗi', 'Đã có lỗi xảy ra, vui lòng thử lại sau'));
  }

  getBillDetail(id: string): Observable<any> {
    return this.http.get<IAccount>(`${this.API_URL}/transaction/${id}`, {});
  }
}
