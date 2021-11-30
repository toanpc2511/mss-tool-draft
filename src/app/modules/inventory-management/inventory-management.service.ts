import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { GasStationResponse } from '../gas-station/gas-station.service';

export enum EWarehouseOrderStatus {
	NEW = 'NEW',
	WAITING = 'WAITING',
	CONFIRMED = 'CONFIRMED',
	REFUSED = 'REFUSED',
	ADJUST = 'ADJUST'
}

export const PaymentMethod = [
	{ key: 'MONEY', value: 'Tiền mặt'},
	{ key: 'CASH', value: 'Chuyển khoản'}
]

export const LIST_WAREHOUSE_ORDER_FORM = [
	{ key: 'SUPPLIER', value: 'Nhà cung cấp'},
	{ key: 'DEPOT', value: 'Kho tổng'},
	{ key: 'STORE', value: 'Kho  tại cửa hàng'}
]

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
  expectedDateStart: string;
  expectedDateEnd: string;
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
  exportedWarehouseId: number;
  licensePlateId: number;
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
  importRequestId: number;
	vehicleCostMethod: string;
	wareHouseOrderProductResponses: [IWareHouseOrderProductResponses];
	rejectReason: string;
	adjustReason: string;
	status: EWarehouseOrderStatus;
	requestCode: string;
	expectedDate: string;
}

export interface IWareHouseOrderProductResponses {
  amountActually: number;
  amountRecommended: number;
  treasurerRecommend: number;
  gasFieldInId: number;
  recommend: number;
  gasFieldOutId: number;
  supplierId: number;
  importProductId: number;
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
	gasFieldIn: {
    capacity: string;
    code: string;
    height: string;
    id: number;
    length: string;
    name: string;
    product_id: number;
    status: string;
  };
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

export interface ISupplier {
	address: string;
	id: number;
	name: string;
}

export interface ITransitCar {
  capacity: number;
  id: number;
  licensePlates: string;
}

export interface IShippingTeam {
  code: string;
  id: number;
  name: string;
}

export interface IFilterImportInventory {
  orderForm: string;
  idStoreExport: number;
  idStoreImport: number;
  expectedDateStart: string;
  expectedDateEnd: string;
  status: string;
}

export interface IFilterExportInventory {
  orderForm: string;
  idStoreExport: number;
  expectedDateStart: string;
  expectedDateEnd: string;
  status: string;
}

export interface IExportInventory {
  approvalDate: string;
  code: string;
  createdAt: string;
  driverName: string;
  licensePlates: string;
  orderForm: string;
  status: string;
  storeExport: string;
  storeImport: string;
  id: number;
}

export interface IImportInventory {
  approvalDate: string;
  code: string;
  createdAt: string;
  driverName: string;
  id: number;
  importRequestId: number;
  licensePlates: string;
  orderForm: string;
  status: string;
  storeExport: string;
  storeImport: string;
  warehouseOrderId: number;
}

export interface IExportInventoryDetail {
  code: string;
  status: string;
  driverName: string;
  exportedWarehouseAddress: string;
  exportedWarehouseName: string;
  id: number;
  importRequestId: number;
  importedWarehouseAddress: string;
  importedWarehouseName: string;
  licensePlates: string;
  representativeGiveName: string;
  representativeGiveCode: string;
  representativeTakeName: string;
  internalCar: boolean;
  wareHouseOrderProductResponses: [IProductExportInventory]
}

export interface IProductExportInventory {
  amountActually: number;
  amountRecommended: number;
  capLead: string;
  capValve: string;
  compartment: string;
  difference: string;
  gasFieldInId: number;
  gasFieldInName: string;
  gasFieldOutId: number;
  gasFieldOutName: string;
  id: number;
  importProductId: number;
  intoMoney: number;
  price: number;
  productName: string;
  quotaExport: string;
  quotaImport: string;
  recommend: number;
  supplierId: number;
  supplierName: string;
  temperatureExport: string;
  temperatureImport: string;
  treasurerRecommend: number;
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
			.set('expected-date-start', data.expectedDateStart)
			.set('expected-date-end', data.expectedDateEnd);

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

  // lấy ds bồn theo nhiên liệu và trạm kho
  getListGasFuelWrehouse(productId: number | string, gasStationId: number | string, fromOrder: string) {
    const params = new HttpParams()
      .set('product-id', productId.toString())
      .set('form-order', fromOrder)
      .set('station-id', gasStationId?.toString());

    return this.http.get<Array<IGasFuel>>('suppliers/stations', { params });
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

	// Lấy danh sách kho xuất theo hình thức đặt kho
	getListSuppliers(formOrder: string) {
		const params = new HttpParams()
			.set('form-order', formOrder)
		return this.http.get<Array<ISupplier>>(`suppliers`, {params})
	}

  // Lấy danh sách xe vận chuyển
  getTransitCars() {
    return this.http.get<Array<ITransitCar>>('transit-cars')
  }

  // Lấy danh sách tài xế
  getShippingTeam() {
    return this.http.get<Array<IShippingTeam>>('employees/shipping-team');
  }

	// Duyệt yêu cầu đặt kho
	approveWarehouseRequest(id: string) {
		return this.http.put(`warehouse-orders/approves/${id}`, {});
	}
	// Từ chối yêu cầu đặt kho
	rejectWarehouseRequest(id: string, reason: string) {
		return this.http.put(`warehouse-orders/refuses/${id}`, { reason });
	}
	// Yêu cầu điều chỉnh yêu cầu đặt kho
	adjustWarehouseRequest(id: string, reason: string) {
		return this.http.put(`warehouse-orders/request-adjustments/${id}`, { reason });
	}

  // Gửi yêu cầu đặt kho
  putWarehouseOrders(id: number, dataReq) {
    return this.http.put(`warehouse-orders/${id}`, dataReq)
  }

  // Tìm kiếm ds xuất kho
  searchImportInventory(page: number, size: number, data: IFilterImportInventory) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', data.status)
      .set('order-form', data.orderForm)
      .set('id-store-export', data.idStoreExport.toString())
      .set('id-store-import', data.idStoreImport.toString())
      .set('expected-date-start', data.expectedDateStart)
      .set('expected-date-end', data.expectedDateEnd);

    return this.http.get<Array<IImportInventory>>('warehouse-import/filters', { params });
  }

  // Tìm kiếm ds xuất kho
  searchExportInventory(page: number, size: number, data: IFilterExportInventory) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('status', data.status)
      .set('order-form', data.orderForm)
      .set('id-store-export', data.idStoreExport.toString())
      .set('expected-date-start', data.expectedDateStart)
      .set('expected-date-end', data.expectedDateEnd);

    return this.http.get<Array<IExportInventory>>('warehouse-export/filters', { params });
  }

  // Chi tiết phiếu xuất kho
  getDetailExportInventory(id: string) {
    return this.http.get<IExportInventoryDetail>(`warehouse-export/${id}`);
  }

  //Hoàn thành xuất kho
  submitExportInventory(id: string, dataReq) {
    return this.http.put(`warehouse-export/complete/${id}`, dataReq)
  }

  // Lấy tất cả kho xuất theo hình thức đặt kho
  getListSuppliersActive() {
    return this.http.get<Array<ISupplier>>(`gas-stations/employee-active`)
  }

  // Lấy ds kho xuất (scr nhập kho)
  getGasStations() {
    return this.http.get<GasStationResponse[]>(`gas-stations`);
  }

  // Lấy ds lịch sử tịnh kho đo bể
  getMeasures(page: number, size: number, data) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('station-id', data.stationId.toString())
      .set('gas-field-id', data.gasFieldId.toString())
      .set('create-from', data.createFrom)
      .set('create-to', data.createTo);
    return this.http.get(`measures/filters`, {params})
  }
}
