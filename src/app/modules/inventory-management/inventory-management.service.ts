import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export enum EWarehouseOrderStatus {
	NEW = 'NEW',
	WAITING = 'WAITING',
	CONFIRMED = 'CONFIRMED',
	REFUSED = 'REFUSED',
	ADJUST = 'ADJUST'
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
	status: string;
	stationId: number;
	employeeId: number;
	expectedDate: string;
	approvalDate: string;
}

export interface IFilterWarehouseOrder {
	status: string;
	stationId: number;
	employeeId: number;
	dateFrom: string;
	dateTo: string;
}

export interface IWarehouseOrderRequest {
	id: string;
	acceptorName: string;
	approvalDate: string;
	capacity: number;
	code: string;
	driver: {
		id: string;
		name: string;
	};
	freightCharges: number;
	importRequestId: number;
	internalCar: true;
	licensePlates: string;
	orderForm: 'SUPPLIER' | '';
	paymentMethod: 'MONEY';
	senderName: string;
	stationName: string;
	storeExport: {
		id: string;
		name: string;
		address: string;
	};
	submitDate: string;
	transportCost: number;
	vehicleCostMethod: 'MONEY';
	status: EWarehouseOrderStatus;
}

@Injectable({
	providedIn: 'root'
})
export class InventoryManagementService {
	constructor(private http: HttpService) {}

	// Lấy ds trạm
	getStationEmployee() {
		return this.http.get<Array<IStationEployee>>(`employees/station`);
	}

	// Lấy ds tất cả nhân viên yêu cầu
	getAllEmployee() {
		return this.http.get<Array<IEmployees>>(`employees/stations-employee`);
	}

	// Lấy ds nhân viên yêu cầu theo trạm
	getEmployeeStation(stationName: string) {
		const params = new HttpParams().set('name-station', stationName);
		return this.http.get(`gas-stations/employee`, { params });
	}

	// Tìm kiếm giao dịch
	searchOrderRequest(page: number, size: number, data: IFilterTransaction) {
		const params = new HttpParams()
			.set('page', page.toString())
			.set('size', size.toString())
			.set('status', data.status)
			.set('station-id', data.stationId.toString())
			.set('employee-id', data.employeeId.toString())
			.set('expected-date', data.expectedDate)
			.set('approval-date', data.approvalDate);

		return this.http.get('import-request/filters', { params });
	}

	// Danh sách yêu cầu đặt kho
	searchWarehouseOrderRequest(page: number, size: number, data: IFilterWarehouseOrder) {
		const params = new HttpParams()
			.set('page', page.toString())
			.set('size', size.toString())
			.set('status', data.status)
			.set('station-id', data.stationId.toString())
			.set('employee-id', data.employeeId.toString())
			.set('date-from', data.dateFrom)
			.set('date-to', data.dateTo);
		return this.http.get<IWarehouseOrderRequest[]>('warehouse_orders/filters', { params });
	}
}
