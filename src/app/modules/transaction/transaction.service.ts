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
	status: string;
	code: string;
}
export interface IEmployees {
	id: number;
	name: string;
	code: string;
	stationId: number;
}

export interface IFilterTransaction {
	employee: string;
	orderCode: string;
	payMethod: string;
 	phone: string;
	product: string;
	station: string;
	userName: string;
	startAt: string;
	endAt: string;
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
	codeEmployee: string;
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
		return this.http.get<Array<IStationEployee>>(`employees/station`);
	}

	// Lấy ds tất cả nhân viên thực hiện
	getAllEmployee() {
		return this.http.get<Array<IEmployees>>(`employees/stations-employee`);
	}

	// Lấy ds nhân viên theo trạm
	getEmployeeStation(stationName: string) {
		const params = new HttpParams().set('name-station', stationName);
		return this.http.get(`gas-stations/employee`, { params });
	}

	// Tìm kiếm giao dịch
	searchTransaction(page: number, size: number, data: IFilterTransaction) {
		const params = new HttpParams()
			.set('page', page.toString())
			.set('size', size.toString())
			.set('order-code', data.orderCode)
			.set('product-name', data.product)
			.set('station-name', data.station)
			.set('payment-method', data.payMethod)
			.set('employee-id', data.employee)
			.set('phone', data.phone)
			.set('start-at', data.startAt)
			.set('end-at', data.endAt)
			.set('user-name', data.userName);

		return this.http.get<Array<ITransaction>>('orders/filters', { params });
	}

	// Xuất file excel
	exportFileExcel(data: IFilterTransaction) {
		const params = new HttpParams()
				.set('order-code', data.orderCode)
				.set('product-name', data.product)
				.set('station-name', data.station)
				.set('payment-method', data.payMethod)
				.set('employee-id', data.employee)
				.set('phone', data.phone)
				.set('start-at', data.startAt)
				.set('end-at', data.endAt)
				.set('user-name', data.userName);
		return this.http.getFileUrl<string>(`orders/filters/excels`, {
			params
		});
	}
}
