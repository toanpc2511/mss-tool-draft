import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpService} from '../../shared/services/http.service';
import {IAccount, IPaymentGroupTuition, IUniversity} from '../shared/models/lvbis-config.interface';
import {HttpParams} from '@angular/common/http';
import {ISchool} from '../../lpb-services/lpb-tuition-service/shared/models/tuition.interface';

@Injectable({
  providedIn: 'root'
})
export class TuitionServiceConfigService {
  url = `${environment.apiUrl}/tuition-service`;

  constructor(private http: HttpService) {
  }

  getFormGroups(): Observable<any> {
    return this.http.get<IPaymentGroupTuition[]>(`${this.url}/config/payment-group`, {});
  }

  searchInfoCustomer(params): Observable<any> {
    return this.http.get<IAccount>(`${this.url}/cif/info`, {params});
  }

  changeStatusUniversity(body, id: string): Observable<any> {
    return this.http.put<any>(`${this.url}/config/university/status/${id}`, body, {});
  }

  getDetailUniversity(id: string): Observable<any> {
    return this.http.get<IUniversity>(`${this.url}/config/university/${id}`, {});
  }

  createUniversity(body: any): Observable<any> {
    return this.http.post(`${this.url}/config/university`, body, {});
  }

  updateUniversity(body, id: string): Observable<any> {
    return this.http.put<any>(`${this.url}/config/university/${id}`, body, {});
  }
  getListUniversityActive() {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '9999')
      .set('filter', '')
      .set('sort', 'name:ASC');
    return this.http.get<ISchool[]>(`${this.url}/config/university`, {
      params
    });
  }
}
