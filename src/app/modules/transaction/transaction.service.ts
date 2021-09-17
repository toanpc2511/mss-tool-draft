import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export interface IPaymentMethod {
  id: number;
  name: string;
  description: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpService) {}

  // Phương thức thanh toán
  getPaymentMethods() {
    return this.http.get<Array<IPaymentMethod>>(`payments/methods/actively`);
  }

  // Lấy ds trạm
  getStationEmployee() {
    return this.http.get(`gas-stations/station-employee`)
  }

  // Lấy ds nhân viên thực hiện
  getEmployee() {
    return this.http.get(`employees`)
  }

}
