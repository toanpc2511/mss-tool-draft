import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpService} from '../../shared/services/http.service';
import {Observable} from 'rxjs';
import {IAccount, ISupplierViettelPost} from '../shared/models/lvbis-config.interface';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ViettelPostServiceConfigService {
  url = `${environment.apiUrl}/viettel-post-service`;

  constructor(private http: HttpService) {
  }

  changeStatusSupplier(body, id: string): Observable<any> {
    return this.http.put<any>(`${this.url}/config/supplier/status/${id}`, body, {});
  }

  getDetailSupplier(id: string): Observable<any> {
    return this.http.get<ISupplierViettelPost>(`${this.url}/config/supplier/${id}`, {});
  }

  createSupplier(body: any): Observable<any> {
    return this.http.post(`${this.url}/config/supplier`, body, {});
  }

  updateSupplier(body, id: string): Observable<any> {
    return this.http.put<any>(`${this.url}/config/supplier/${id}`, body, {});
  }

  getListSupplier(filter: string): any {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '9999')
      .set('filter', filter)
      .set('sort', 'name:ASC');
    return this.http.get<any>(`${this.url}/config/supplier`, {params});
  }

  searchInfoCustomer(params): Observable<any> {
    return this.http.get<IAccount>(`${this.url}/cif/info`, {params});
  }
}
