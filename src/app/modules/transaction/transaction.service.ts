import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpService) {}

  getPaymentMethods() {
    return this.http.get(`payments/methods/actively`);
  }

  // Lấy ds trạm
  getStationEmployee() {
    return this.http.get(`gas-stations/station-employee`)
  }

}
