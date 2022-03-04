import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

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
export interface ITransaction {
	accumulationPointReceive: number;
	accumulationPointUse: number;
	actualityMoney: number;
	billMoney: number;
	cashLimit: number;
	cashPaid: number;
	code: string;
	createdAt: string;
	imageNumberVariableReal: string;
	imageSpeedometer: string;
	nameDriver: string;
	nameEmployee: string;
	numberLiters: number;
	numberVariable: [string];
	numberVariableReal: string;
	orderTotalResponse: {
		totalPaymentLimitOil: number;
		totalAccumulationPointUse: number;
		totalCashPaid: number;
		totalActualityLiters: number;
		totalOrder: number;
		totalPaymentLimitMoney: number;
	};
	paymentLimit: number;
	paymentMethodName: string;
	phone: string;
	price: number;
	productName: string;
	promotions: string;
	pumpPole: string;
	pumpHose: string;
	speedometer: number;
	stationName: string;
	takeReceipt: boolean;
	totalNumberLiters: number;
	validLicensePlate: boolean;
	actualityLiters: number;
	paymentLimitMoney: number;
	paymentLimitOil: number;
}

export interface IFilterTransaction {
	orderCode: string;
	product: string;
	accountType: string;
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
export class TransactionService {
	constructor(private http: HttpService) {}

	// Phương thức thanh toán
	getPaymentMethods() {
		return this.http.get<Array<IPaymentMethod>>(`payments/methods/actively`);
	}

	// Tìm kiếm giao dịch
	searchTransaction(page: number, size: number, data: IFilterTransaction) {
		const params = new HttpParams()
			.set('page', page.toString())
			.set('size', size.toString())
			.set('order-code', data.orderCode)
			.set('product-name', data.product)
			.set('user-type', data.accountType)
			.set('station-name', data.station)
			.set('payment-method', data.payMethod)
			.set('phone', data.phone)
			.set('start-at', data.startAt)
			.set('end-at', data.endAt)
			.set('user-name', data.userName);
		return this.http.get<Array<ITransaction>>('order/filters-enterprises', { params });
	}

	exportFileExcel(data: IFilterTransaction) {
		const params = new HttpParams()
			.set('order-code', data.orderCode)
			.set('product-name', data.product)
			.set('user-type', data.accountType)
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
