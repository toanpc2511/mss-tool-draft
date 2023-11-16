import { Injectable } from '@angular/core';
import {IPaymentRule, ISupplierElectric} from '../shared/models/lvbis-config.interface';
import {HttpService} from '../../shared/services/http.service';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectricServiceConfigService {
  url = `${environment.apiUrl}/electric-service`;

  constructor(private http: HttpService) { }

  getFormGroups(): Observable<any> {
    return this.http.get<IPaymentRule[]>(`${this.url}/form-group/default`, {});
  }
  createSupplier(body: any): Observable<any> {
    return this.http.post(`${this.url}/supplier`, body, {});
  }

  getDetailSupplier(id: string): Observable<any> {
    return this.http.get<ISupplierElectric>(`${this.url}/supplier/${id}`, {});
  }

  updateSupplier(body, id: string): Observable<any> {
    return this.http.put<any>(`${this.url}/supplier/${id}`, body, {});
  }

  changeStatusSupplier(body, id: string): Observable<any> {
    return this.http.put<any>(`${this.url}/supplier/status/${id}`, body, {});
  }

  searchInfoCustomer(params): Observable<any> {
    return this.http.get<any>(`${this.url}/cif/acc-info`, {params});
  }
}
