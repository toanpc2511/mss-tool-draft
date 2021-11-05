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
	product: string;
	station: string;
	payMethod: string;
	phone: string;
	startAt: string;
	endAt: string;
	userName: string;
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
	searchTransaction(page: number, size: number, data: IFilterUsingPoints) {
		const params = new HttpParams()
			.set('page', page.toString())
			.set('size', size.toString())
			.set('order-code', data.orderCode)
			.set('product-name', data.product)
			.set('station-name', data.station)
			.set('payment-method', data.payMethod)
			.set('phone', data.phone)
			.set('start-at', data.startAt)
			.set('end-at', data.endAt)
			.set('user-name', data.userName);
		return this.http.get('order/filters-enterprises', { params });
	}

	exportFileExcel(data: IFilterUsingPoints) {
		const params = new HttpParams()
			.set('order-code', data.orderCode)
			.set('product-name', data.product)
			.set('station-name', data.station)
			.set('payment-method', data.payMethod)
			.set('phone-driver', data.phone)
			.set('start-at', data.startAt)
			.set('end-at', data.endAt)
			.set('user-name', data.userName);
		return this.http.getFileUrl<string>(`order/filters-enterprises/excels`, {
			params
		});
	}
}
