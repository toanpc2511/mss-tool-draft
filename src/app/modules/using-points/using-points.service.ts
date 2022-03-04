import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export interface IPaymentMethod {
	id: number;
	name: string;
	code: string;
	description: string;
	status: string;
}
export interface IEmployees {
	id: number;
	name: string;
	code: string;
	stationId: number;
}

export interface IFilterUsingPoints {
  orderCode: string;
  startAt: string;
  endAt: string;
  stationName: string;
  userName: string;
  phone: string;
  paymentMethod: string;
  productName: string;
}

export interface IHistoryUsingPoint {
  accumulationPointReceive: number;
  accumulationPointUse: number;
  createdAt: string;
  nameDriver: string;
  oderCode: string;
  oderId: number;
  paymentMethod: string;
  paymentMethodName: string;
  phone: string;
  productName: string;
  stationName: string;
  total: number;
  totalAccumulationPointReceive: number;
  totalAccumulationPointUse: number;
}

@Injectable({
	providedIn: 'root'
})
export class UsingPointsService {
	constructor(private http: HttpService) {}

	// Phương thức thanh toán
	getPaymentMethods() {
		return this.http.get<Array<IPaymentMethod>>(`payments/methods/actively`);
	}

	// Tìm kiếm giao dịch
  searchHistoryUsingPoints(page: number, size: number, data: IFilterUsingPoints) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('order-code', data.orderCode)
      .set('phone', data.phone)
      .set('start-at', data.startAt)
      .set('end-at', data.endAt)
      .set('payment-method', data.paymentMethod)
      .set('product-name', data.productName)
      .set('station-name', data.stationName)
      .set('user-name', data.userName);
		return this.http.get<Array<IHistoryUsingPoint>>('payments/methods/histories/accumulate/driver', { params });
  }

	exportFileExcel(data: IFilterUsingPoints) {
		const params = new HttpParams()
      .set('order-code', data.orderCode)
      .set('phone', data.phone)
      .set('start-at', data.startAt)
      .set('end-at', data.endAt)
      .set('payment-method', data.paymentMethod)
      .set('product-name', data.productName)
      .set('station-name', data.stationName)
      .set('user-name', data.userName);
		return this.http.getFileUrl<string>(`payments/methods/histories/accumulate/driver/excel`, {
			params
		});
	}
}
