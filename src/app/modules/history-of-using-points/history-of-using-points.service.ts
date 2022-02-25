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

export interface IStationEployee {
	id: number;
	name: string;
	address: string;
  fullAddress?: string;
	status: string;
	code: string;
}

export interface IFilterUsingPoint {
	endAt: string;
	orderCode: string;
	paymentMethod: string;
	phone: string;
	productName: string;
	startAt: string;
	stationName: string;
	userName: string;
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
export class HistoryUsingPointsService {
	constructor(private http: HttpService) {}

	// Phương thức thanh toán
	getPaymentMethods() {
		return this.http.get<Array<IPaymentMethod>>(`payments/methods/actively`);
	}

	// Lấy ds trạm
	getStationEmployee() {
		return this.http.get<Array<IStationEployee>>(`employees/station-status`);
	}

	// Tìm kiếm giao dịch sử dụng điểm
	searchHistoryUsingPoints(page: number, size: number, data: IFilterUsingPoint) {
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

		return this.http.get<Array<IHistoryUsingPoint>>('payments/methods/histories/accumulate', {
			params
		});
	}

	// Xuất file excel
	exportFileExcel(data: IFilterUsingPoint) {
		const params = new HttpParams()
			.set('order-code', data.orderCode)
			.set('phone', data.phone)
			.set('start-at', data.startAt)
			.set('end-at', data.endAt)
			.set('payment-method', data.paymentMethod)
			.set('product-name', data.productName)
			.set('station-name', data.stationName)
			.set('user-name', data.userName);
		return this.http.getFileUrl<string>(`payments/methods/histories/accumulate/excels`, {
			params
		});
	}
}
