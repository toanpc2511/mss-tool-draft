import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpService} from '../../../../shared/services/http.service';
import {FileService} from '../../../../shared/services/file.service';
import {
  AUTHORIZE_MANAGE, AUTHORIZE_MANAGE_DETAIL, TOPUP_LIMIT,
  TRANS_APPROVE, TRANS_CHECK,
  TRANS_REJECT, TRANS_RETRY_APPROVE, TRANS_RETRY_SERVICE,
  TRANS_SERVICE,
  VIETLOTT_SERVICE,
  VIRTUAL_ACC_SERVICE
} from '../constants/url.vietlott.service';
import {IAgent, ITransaction} from '../models/vietlott.interface';
import {IAccount} from '../../../../system-configuration/shared/models/lvbis-config.interface';
import {IOutPut} from '../../../lpb-tuition-service/shared/models/tuition.interface';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VietlottService {
  API_URL = `${environment.apiUrl}/${VIETLOTT_SERVICE}`;
  transactionApproveSubject = new BehaviorSubject([]);

  constructor(private http: HttpService,
              private fileService: FileService) {
  }
  getDetailAgent(params): Observable<any>{
    return this.http.get<IAgent>(`${environment.apiUrl}/${VIRTUAL_ACC_SERVICE}`, {params});
  }
  searchCifInfo(params): Observable<any> {
    return this.http.get<IAccount>(`${this.API_URL}/cif/info`, {params});
  }
  searchAccountInfo(params): Observable<any> {
    return this.http.get<IAccount>(`${this.API_URL}/acc/info`, {params});
  }
  cancelTrans(id: string): Observable<any> {
    return this.http.delete<IOutPut>(`${environment.apiUrl}/${TRANS_SERVICE}/${id}`, {});
  }
  createTrans(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${TRANS_SERVICE}`, body, {});
  }
  getTransDetail(id: string): Observable<any> {
    return this.http.get<ITransaction>(`${environment.apiUrl}/${TRANS_SERVICE}/${id}`, {});
  }
  approveTrans(id: string): Observable<any> {
    return this.http.put<IOutPut>(`${environment.apiUrl}/${TRANS_APPROVE}/${id}`, {}, {});
  }

  rejectTrans(id: string): Observable<any> {
    return this.http.put<IOutPut>(`${environment.apiUrl}/${TRANS_REJECT}/${id}`, {}, {});
  }
  approveTrans_Retry(id: string): Observable<any> {
    return this.http.post<IOutPut>(`${environment.apiUrl}/${TRANS_RETRY_APPROVE}/${id}`, {}, {});
  }
  approveAuthorize(body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}${AUTHORIZE_MANAGE}`, body, {});
  }
  deleteAuthorize(body: any): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${AUTHORIZE_MANAGE}`, {body} );
  }
  getDetailAuthorize(param: string): Observable<any>{
    return this.http.get<IAgent>(`${environment.apiUrl}${AUTHORIZE_MANAGE_DETAIL}?${param}`, {});
  }
  getlistTrans(posId: string, date: string): Observable<any>{
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '9999')
      .set('filter', `posId|eq|${posId}&makerDt|gte|${date}`)
      .set('sort', 'makerDt:DESC');
    return this.http.get<any>(`${environment.apiUrl}/${TRANS_SERVICE}?${params}`, {});
  }
  // truy van han muc diem giao dich
  getTopupLimit(param: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${TOPUP_LIMIT}?${param}`, {});
  }
  // gui phe duyet, tu choi giao dich tang han muc bo sung
  changeDebts(body): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/${TRANS_RETRY_SERVICE}`, body, {});
  }
  // Kiem tra trang thai GD
  getTransCheck(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/${TRANS_CHECK}/${id}`, {});
  }

  getConfigFee(url: string): Observable<any>{
    return this.http.get<any>(`${this.API_URL}/${url}`, {});
  }

  updateConfigFee(url: string, body): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/${url}`, body, {});
  }
}
