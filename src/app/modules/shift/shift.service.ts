import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { convertDateToServer } from '../../shared/helpers/functions';
import { GasStationResponse } from '../gas-station/gas-station.service';
import { SortDirection } from './../../_metronic/shared/crud-table/models/sort.model';

export enum EShiftChangRequestType {
	CHANGE = 'CHANGE',
	REPLACE = 'REPLACE'
}

export enum EShiftChangRequestStatus {
	SWAPPED = 'SWAPPED',
	WAITING = 'WAITING',
	REJECTED = 'REJECTED'
}

export class StepData {
	currentStep: number;
	step1: {
		isValid: boolean;
	};
	step2: {
		isValid: boolean;
	};
	step3: {
		isValid: boolean;
	};
	step4: {
		isValid: boolean;
	};
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
	employeeNameFrom: string;
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
	stationName: string;
	status: string;
	timeEnd: string;
	timeStart: string;
}

export interface IOrderOfShift {
  id: number,
  pumpHose: string,
  pumpPole: string,
  status: string
}

@Injectable({
	providedIn: 'root'
})
export class ShiftService {
	private stepDataSubject: BehaviorSubject<StepData>;
	stepData$: Observable<StepData>;
	constructor(private http: HttpService) {
		this.stepDataSubject = new BehaviorSubject<StepData>({
			currentStep: 1,
			step1: { isValid: false },
			step2: { isValid: false },
			step3: { isValid: false },
			step4: { isValid: false }
		});
		this.stepData$ = this.stepDataSubject.asObservable();
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
	deleteCalendarAll(req: { timeStart: string; timeEnd: string; employeeIds: [number] }) {
		const params = new HttpParams()
			.set('time-start', convertDateToServer(req.timeStart))
			.set('time-end', convertDateToServer(req.timeEnd))
			.set('employee-ids', req.employeeIds.join(','));
		return this.http.delete(`calendars`, { params });
	}

	setStepData(stepData: StepData) {
		this.stepDataSubject.next(stepData);
	}

	getStepDataValue(): StepData {
		return this.stepDataSubject.value;
	}

	resetCreateData() {
		this.stepDataSubject.next({
			currentStep: 1,
			step1: { isValid: false },
			step2: { isValid: false },
			step3: { isValid: false },
			step4: { isValid: false }
		});
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
  getOrdersOfShift(id: number) {
    const params = new HttpParams()
      .set('shift-id', id.toString())
    return this.http.get<Array<IOrderOfShift>>('orders/shift-order', {params})
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
    return this.http.get('promotional-revenue', {params});
  }

  // Hủy đơn hàng của ca
  rejectOrderOfShift(dataReq: {content: string, id: number, shiftId: number}) {
    return this.http.post('lock-shifts/order-shift', dataReq);
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

	approveShiftRequestChange(id: string) {
		return this.http.put(`swap-shifts/status/${id}`, { status: EShiftChangRequestStatus.SWAPPED });
	}

	rejectShiftRequestChange(id: string) {
		return this.http.put(`swap-shifts/status/${id}`, { status: EShiftChangRequestStatus.REJECTED });
	}
}
