import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { convertDateToServer } from '../../shared/helpers/functions';
import { GasStationResponse, IPumpPole } from '../gas-station/gas-station.service';
import { SortDirection } from '../../_metronic/shared/crud-table';

export enum EShiftChangRequestType {
	CHANGE = 'SWAP',
	REPLACE = 'REPLACE'
}

export enum EShiftChangRequestStatus {
	SWAPPED = 'SWAPPED',
	WAITING = 'WAITING',
	REJECTED = 'REJECTED',
	REPLACED = 'REPLACED'
}

export type PumpPoleResponse = {
	id: number;
	name: string;
};

export type OffTimeResponse = {
	id: number;
	start: string;
	end: string;
};

export interface ICalendarChanged {
	employeeNameTo: string;
	endTime: string;
	startTime: string;
	typeEnd: 'THE_NEXT_DAY' | 'TODAY';
	typeStart: 'THE_NEXT_DAY' | 'TODAY';
}
export interface ICalendarResponse {
	calendarId: number;
	employeeId: number;
	employeeName: string;
	backgroundColor: string;
	color: string;
	start: string;
	end: string;
	offTimes: OffTimeResponse[];
	pumpPoleResponses: PumpPoleResponse[];
	shiftName: string;
	checked: boolean;
	shiftId: number;
	calendarChangedResponses: ICalendarChanged[];
}

export class ICalendarData {
	shiftId: number;
	employeeId: number;
	employeeName: string;
	offTimes: OffTimeResponse[];
	pumpPoles: PumpPoleResponse[];
}

export interface IEmployee {
	id: number;
	code: string;
	name: string;
}

export interface IShiftConfig {
	id: number;
	name: string;
	type: string;
	color: string;
	description: string;
	startHour: number;
	startMinute: number;
	endHour: number;
	endMinute: number;
	offTimes: [ITime];
	codeColor: string;

  startTime?: string;
  endTime?: string;
}

export interface ITime {
	startHour: number;
	startMinute: number;
	endHour: number;
	endMinute: number;
}

export interface IEmployeeByIdStation {
	id: number;
	name: string;
	code: string;
}

export interface IInfoCalendarEmployee {
	employeeId: number;
	pumpPoles: [number];
	shiftOffIds: [number];
}

export interface IDataEventCalendar {
	id: string;
	start: Date;
	end: Date;
	extendedProps: ICalendarData;
}

// Đổi ca/thay ca

export interface IShiftRequestChange {
	id: string;
	employeeIdFrom: string;
	employeeCodeFrom: string;
	employeeNameFrom: string;
	employeeCodeTo: string;
	employeeNameTo: string;
	type: EShiftChangRequestType;
	stationName: string;
	shiftName: string;
	shiftNameTo: string;
	content: string;
	dateFrom: string;
	dateTo: string;
	status: EShiftChangRequestStatus;
	createAt: string;
	reason: string;
	startTime: string;
	typeStart: 'TODAY' | 'THE_NEXT_DAY';
	endTime: string;
	typeEnd: 'TODAY' | 'THE_NEXT_DAY';
}

export interface IOtherRevenue {
	exportQuantity: number;
	finalInventory: number;
	headInventory: number;
	id: number;
	importQuantity: number;
	lockShiftId: number;
	price: number;
	productId: number;
	productName: string;
	total: number;
	totalMoney: number;
	unit: string;
}

export interface IValueSearchLockShift {
	startAt: string;
	endAt: string;
	shiftName: string;
	stationName: string;
}

export interface ILockShift {
	endHour: number;
	endMinute: number;
	id: number;
	shiftId: number;
	shiftName: string;
	startHour: number;
	startMinute: number;
	stationId: number;
	stationName: string;
	status: string;
	timeEnd: string;
	timeStart: string;
}

export interface IOrderOfShift {
	id: number;
	pumpHose: string;
	pumpPole: string;
	status: string;
	code: string;
}

export interface IPromotionalRevenue {
	actualInventoryQuantity: number;
	compensateQuantity: number;
	exportQuantity: number;
	finalInventory: number;
	hasChip: boolean;
	headInventory: number;
	id: number;
	importQuantity: number;
	lockShiftId: number;
	productId: number;
	productName: string;
	unit: string;
}

export interface IOffTimes {
	end: string;
	id: number;
	start: string;
	typeEnd: string;
	typeStart: string;
}

export interface ICalendarEmployeeInfos {
	shiftId: number;
	shiftName: string;
	start: string;
	stationAddress: string;
	stationId: number;
	stationName: string;
	backgroundColor: string;
	calendarId: number;
	checked: boolean;
	employeeId: number;
	employeeName: string;
	end: string;
	offTimes: [IOffTimes];
	pumpPoleResponses: [IPumpPole];
}

export interface IFuelRevenue {
  code: string;
  electronicEnd: number;
  electronicStart: number;
  employeeName: string;
  gaugeEnd: number;
  gaugeStart: number;
  id: number;
  limitMoney: number;
  lockShiftId: number;
  productName: string;
  provisionalMoney: number;
  quantityElectronic: number;
  quantityGauge: number;
  quantityTransaction: number;
  shiftId: number;
  shiftName: string;
  stationId: number;
  stationName: string;
  timeEnd: string;
  timeStart: string;
  totalCashPaid: number;
  totalLimitMoney: number;
  totalLiter: number;
  totalMoney: number;
  totalPoint: number;
  totalPoints: number;
  totalPrice: number;
  totalProvisionalMoney: number;
  cashMoney: number;
  price: number;
  chip: boolean;
}

export interface ITotalMoneyRevenue {
	cashMoneyRevenue: number;
	limitMoneyRevenue: number;
	otherProductRevenue: number;
	pointRevenue: number;
	provisionalMoneyRevenue: number;
	totalLiter: number;
	totalProvisionalRevenue: number;
	employeeMoneyRevenues: [IEmployeeMoneyRevenues];
	productRevenueResponses: [IProductRevenue];
  totalRevenue: number;
}

export interface IEmployeeMoneyRevenues {
	id: number;
	name: string;
	moneyFromFuel: number;
	moneyFromOtherProduct: number;
	totalEmployeeMoney: number;
}

export interface IProductRevenue {
	productName: string;
	quantityTransaction: number;
	totalMoney: number;
	unit: string;
}

@Injectable({
	providedIn: 'root'
})
export class ShiftService {
	lockShiftId: number;
	stationId: number;
	statusLockShift: string;

	private currentStepSubject: BehaviorSubject<number>;
	currentStep$: Observable<number>;
	constructor(private http: HttpService) {
		this.currentStepSubject = new BehaviorSubject<number>(1);
		this.currentStep$ = this.currentStepSubject.asObservable();
	}

	getStationByAccount() {
		return this.http.get<GasStationResponse[]>('gas-stations/station-employee');
	}

	getEmployeesByStation(stationId: string) {
		const params = new HttpParams().set('station-id', stationId);
		return this.http.get<IEmployee[]>(`gas-stations/station`, { params });
	}

	getShiftWorksByDate(stationId: string, time: string) {
		const params = new HttpParams().set('station-id', stationId).set('time', time);
		return this.http.get<ICalendarResponse[]>(`calendars/employees/stations`, { params });
	}

	getShiftWorks(start: string, end: string, employeeIds: number[], stationId: string) {
		const params = new HttpParams()
			.set('employee-ids', employeeIds?.join(',') || '')
			.set('time-start', start)
			.set('time-end', end)
			.set('station-id', stationId);
		return this.http.get<ICalendarResponse[]>('calendars', { params });
	}

	// ds cấu hình ca
	getListShiftConfig() {
		return this.http.get<Array<IShiftConfig>>(`shifts`);
	}

  // ds cấu hình ca tiếp theo
  getListShiftConfigNext(shiftId: number, stationId: number, time: string) {
    const params = new HttpParams()
      .set('shift-id', shiftId.toString())
      .set('station-id', stationId.toString())
      .set('time', time)
    return this.http.get<Array<IShiftConfig>>(`shifts/days`, {params});
  }

	// thêm cấu hình ca
	createShiftConfig(shiftConfigData: IShiftConfig) {
		return this.http.post(`shifts`, shiftConfigData);
	}

	// sửa cấu hình ca
	updateShiftConfig(id: number, shiftConfigData: IShiftConfig) {
		return this.http.put(`shifts/${id}`, shiftConfigData);
	}

	// xóa cấu hình ca
	deleteShiftConfg(id: number) {
		return this.http.delete(`shifts/${id}`);
	}

	// danh sách thời gian nghỉ theo ca
	getListOffTime(id: number) {
		const params = new HttpParams().set('shift-id', id.toString());
		return this.http.get('shifts-off-time', { params });
	}

	// thêm lịch làm vệc
	createShiftOffTime(req) {
		return this.http.post('calendars', req);
	}

	// Lấy ds nhân viên trạm theo id
	getListEmployee(stationId) {
		const params = new HttpParams().set('station-id', stationId);
		return this.http.get<Array<IEmployeeByIdStation>>('gas-stations/station', { params });
	}

	// Sửa lịch làm việc của nhân viên
	updateShiftOffTime(id: number, req) {
		return this.http.put(`calendars/${id}`, req);
	}

	// Xóa lịch làm việc của nhân viên
	deleteCalendarOfEmployee(id: number) {
		return this.http.delete(`calendars/${id}`);
	}

	// Xóa lịch trong khoảng thời gian
	deleteCalendarAll(
		req: { timeStart: string; timeEnd: string; employeeIds: [number] },
		stationId: number
	) {
		const params = new HttpParams()
			.set('time-start', convertDateToServer(req.timeStart))
			.set('time-end', convertDateToServer(req.timeEnd))
			.set('employee-ids', req.employeeIds.join(','))
			.set('station-id', stationId.toString());
		return this.http.delete(`calendars`, { params });
	}

	setCurrentStep(step: number) {
		if(step > this.currentStepSubject.value) {
			this.currentStepSubject.next(step);
		}
	}

	getCurrentStepValue() {
		return this.currentStepSubject.value;
	}

	resetCreateData() {
		this.currentStepSubject.next(1);
	}

	// Lấy ds lịch sử chốt ca
	getListLockShift(page: number, size: number, dataReq: IValueSearchLockShift) {
		const params = new HttpParams()
			.set('page', page.toString())
			.set('size', size.toString())
			.set('start-at', convertDateToServer(dataReq.startAt))
			.set('end-at', convertDateToServer(dataReq.endAt))
			.set('shift-name', dataReq.shiftName)
			.set('station-name', dataReq.stationName);
		return this.http.get<Array<ILockShift>>('lock-shifts/filter', { params });
	}

	// lấy ds giao dịch của ca
	getOrdersOfShift(lockShiftId: number) {
		const params = new HttpParams()
			.set('lock-shift-id', lockShiftId.toString());
		return this.http.get<Array<IOrderOfShift>>('orders/shift-order', { params });
	}

	// Tạo ds doanh thu sản phẩm nhiên liệu
	createFuelProductRevenue(req) {
		return this.http.post('product-revenue', req);
	}

	// Lấy ds doanh thu nhiên liệu
	getFuelProductRevenue(id: number) {
		return this.http.get<Array<IFuelRevenue>>(`product-revenue/${id}`);
	}

	// Sửa doanh thu nhiên liệu
	updateFuelProductRevenue(id: number, dataReq) {
		return this.http.put(`product-revenue/${id}`, dataReq);
	}

	// Lấy ds doanh thu hàng hóa
	getOtherProductRevenue(id: number, page: number, size: number) {
		const params = new HttpParams()
			.set('lock-shift-id', id.toString())
			.set('page', page.toString())
			.set('size', size.toString());
		return this.http.get<Array<IOtherRevenue>>('other-product-revenue', { params });
	}

	// Sửa doanh thu hàng hóa khác
	updateOtherProductRevenue(dataReq) {
		return this.http.put(`other-product-revenue`, dataReq);
	}

	// Lấy ds báo cáo khuyến mãi
	getPromotionalRevenue(id: number) {
		const params = new HttpParams().set('lock-shift-id', id.toString());
		return this.http.get<Array<IPromotionalRevenue>>('promotional-revenue', { params });
	}

	// Sửa báo cáo khuyến mãi
	updatePromotionalRevenue(dataReq) {
		return this.http.put(`promotional-revenue`, dataReq);
	}

	// Hủy đơn hàng của ca
	rejectOrderOfShift(dataReq: { content: string; id: number }) {
		return this.http.post('lock-shifts/order-shift', dataReq);
	}

	// Lấy ds lịch làm việc theo ca
	getCalendarEmployeeInfos(shiftId: number, stationId: number, time: string) {
		const params = new HttpParams()
			.set('shift-id', shiftId.toString())
			.set('station-id', stationId.toString())
			.set('time', time);
		return this.http.get<Array<ICalendarEmployeeInfos>>('calendars/employees/infos', { params });
	}

	// Lấy danh sách tổng tiền mặt
	getTotalMoneyRevenue(id: number) {
		return this.http.get<ITotalMoneyRevenue>(`product-revenue/total-money/${id}`);
	}

  // Xác nhận chốt ca
  confirmLockShift(dataReq) {
    return this.http.post('lock-shifts', dataReq);
  }

  // in báo cáo chốt ca
  exportFileExcel(lockShiftId: number) {
    const params = new HttpParams()
      .set('lock-shift-id', lockShiftId.toString());
    return this.http.getFileUrl<string>('excel-exporters/total-revenues', {params});
  }

	/*
		Đổi ca/thay ca
	*/
	getShiftRequestChangeList(
		status: string,
		type: string,
		sortColumn: string,
		sortDirection: SortDirection,
		searchText: string,
		page: number,
		size: number
	) {
		const params = new HttpParams()
			.set('status', status)
			.set('type', type)
			.set('field-sort', sortColumn)
			.set('direction-sort', sortDirection)
			.set('search-text', searchText)
			.set('page', page.toString())
			.set('size', size.toString());
		return this.http.get<IShiftRequestChange[]>(`swap-shifts`, { params });
	}

	getDetailShiftRequestChange(id: string) {
		return this.http.get<IShiftRequestChange>(`swap-shifts/${id}`);
	}

	approveShiftRequestChange(id: string, type: EShiftChangRequestType, employeeIdFrom: string) {
		return this.http.put(`swap-shifts/status/${id}`, {
			status: type === EShiftChangRequestType.CHANGE ? 'SWAPPED' : 'REPLACED',
			type,
			employeeIdCreate: employeeIdFrom
		});
	}

	rejectShiftRequestChange(id: string, reason: string, type: EShiftChangRequestType, employeeIdFrom: string) {
		return this.http.put(`swap-shifts/status/${id}`, {
			status: EShiftChangRequestStatus.REJECTED,
			reason,
			type,
			employeeIdCreate: employeeIdFrom
		});
	}
}
