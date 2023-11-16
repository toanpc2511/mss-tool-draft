import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';

export const WATER_SERVICE = 'water-service';

@Injectable({
  providedIn: 'root'
})
export class LvbisService {

  constructor(private http: HttpClient) { }



  searchBillWater(supplierCode, customerCode): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${WATER_SERVICE}/bills?supplierCode=${supplierCode}&customerCode=${customerCode}`);
  }

  getAllSupplier(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${WATER_SERVICE}/supplier`);
  }

  createPaymentRequest(request: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/${WATER_SERVICE}/payment-request`, request);
  }

  getPaymentRequest(customerCode): Observable<any> {
    return this.http.get(`${environment.apiUrl}/${WATER_SERVICE}/payment-request?customerCode=${customerCode}`);
  }
}
