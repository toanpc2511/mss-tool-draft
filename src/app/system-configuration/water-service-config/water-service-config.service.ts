import { Observable } from 'rxjs';
import { HttpService } from './../../shared/services/http.service';
import { ISupplier, IPaymentRule } from './../shared/models/lvbis-config.interface';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WaterServiceConfigService {
  url: string = `${environment.apiUrl}/water-service`
  constructor(private http: HttpService) {}

  getListSupplier(params) {
    return this.http.get<ISupplier[]>(`${this.url}/supplier`, {
      params: params,
    });
  }

  createSupplier(body: any) {
    return this.http.post(`${this.url}/supplier`, body, {});
  }

  getFormGroups() {
    return this.http.get<IPaymentRule[]>(`${this.url}/form-group/default`, {});
  }

  getDetailSupplier(id: string) {
    return this.http.get<ISupplier>(`${this.url}/supplier/${id}`, {})
  }

  updateSupplier(body, id: string) {
    return this.http.put<any>(`${this.url}/supplier/${id}`, body, {});
  }

  changeStatusSupplier(body, id: string) {
    return this.http.put<any>(`${this.url}/supplier/status/${id}`, body, {})
  }

  searchInfoCustomer(params: any): Observable<any> {
    return this.http.get<any>(`${this.url}/cif/acc-info`, {params});
  }
}
