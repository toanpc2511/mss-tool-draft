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
	stationName: string;
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

export interface IWareHouseOrderDetail {
	code: string;
	capacity: number;
	driver: {
		id: number;
		name: string;
	};
	exportedWarehouseAddress: string;
	exportedWarehouseName: string;
	freightCharges: number;
	id: number;
	importedWarehouseAddress: string;
	importedWarehouseName: string;
	internalCar: boolean;
	licensePlates: string;
	oderForm: string;
	paymentMethod: string;
	representativeName: string;
	totalProductMoney: number;
	transportCost: number;
	vehicleCostMethod: string;
	wareHouseOrderProductResponses: [
		{
			amountActually: number;
			compartment: string;
			gasFieldInName: string;
			gasFieldOutName: string;
			id: number;
			intoMoney: number;
			price: number;
			productName: string;
			supplierName: string;
			unit: string;
		}
	];
	rejectReason: string;
	adjustReason: string;
	status: EWarehouseOrderStatus;
	requestCode: string;
	expectedDate: string;
}

export interface IGasFuel {
	capacity: string;
	code: string;
	description: null;
	height: string;
	id: number;
	length: string;
	name: string;
	productId: number;
	status: string;
}

export interface IInfoOrderRequest {
	id: number;
	address: string;
	fullAddress: string;
	code: string;
	employeeRequest: string;
	reason: string;
	requestDate: string;
	stationName: string;
	stationId: number;
	status: string;
	productResponses: [IProductRequest];
}
export interface IProductRequest {
	amountActually: number;
	amountRecommended: number;
	gasFieldIn: number;
	gasFieldOut: {
		capacity: string;
		code: string;
		height: string;
		id: number;
		length: string;
		name: string;
		product_id: number;
		status: string;
	};
	productName: string;
	productId: number;
	unit: string;
}

@Injectable({
	providedIn: 'root'
})
export class InventoryManagementService {
	constructor(private http: HttpService) {}

	// Lấy ds trạm trạng thái active
	getStationEmployee() {
		const params = new HttpParams().set('status', 'ACTIVE');
		return this.http.get<Array<IStationEployee>>(`employees/station-status`, { params });
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
			.set('station-name', data.stationName)
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
		return this.http.get<IWarehouseOrderRequest[]>('warehouse-orders/filters', { params });
	}
	// Lấy ds bồn theo trạm và loại nhiên liệu
	getListGasFuel(productId: number | string, gasStationId: number | string) {
		const params = new HttpParams()
			.set('product-id', productId.toString())
			.set('gas-station-id', gasStationId.toString());

		return this.http.get<Array<IGasFuel>>('gas-fields/station-product', { params });
	}

	// tạo yêu cầu đặt hàng
	createOrderRequest(dataReq) {
		return this.http.post('import-request', dataReq);
	}

	// Update yêu cầu dặt hàng
	updateOrderRequest(dataReq, orderRequestId: number) {
		return this.http.put(`import-request/${orderRequestId}`, dataReq);
	}

	// Xóa yêu cầu đặt hàng
	deleteOrderRequest(id: number) {
		return this.http.delete(`import-request/${id}`);
	}

	// Xem chi tiết yêu cầu đặt hàng
	viewDetailOrderRequest(id: number) {
		return this.http.get<IInfoOrderRequest>(`import-request/${id}`);
	}

	// Duyệt/Từ chối yêu cầu đặt hàng
	approveOrRejectOrderRequest(
		id: string | number,
		data: { requestConfirm: boolean; reason: string }
	) {
		return this.http.put(`import-request/handles/${id}`, data);
	}

	// Xem chi tiết yêu cầu đặt kho
	viewDetailOrderWarehouse(id: string) {
		return this.http.get<IWareHouseOrderDetail>(`warehouse-orders/details/${id}`);
	}

	// Duyệt yêu cầu đặt kho
	approveWarehouseRequest(id: string) {
		return this.http.put(`warehouse-orders/approves/${id}`, null);
	}
	// Từ chối yêu cầu đặt kho
	rejectWarehouseRequest(id: string, reason: string) {
		return this.http.put(`warehouse-orders/refuses/${id}`, { reason });
	}
	// Yêu cầu điều chỉnh yêu cầu đặt kho
	adjustWarehouseRequest(id: string, reason: string) {
		return this.http.put(`warehouse-orders/request-adjustments/${id}`, { reason });
	}
}
