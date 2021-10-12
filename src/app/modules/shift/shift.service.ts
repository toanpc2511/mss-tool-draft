import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { GasStationResponse } from './../gas-station/gas-station.service';
import { convertDateToServer } from '../../shared/helpers/functions';

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
	calendarResponses: {
		calendarId: number;
		employeeId: number;
		employeeName: string;
		backgroundColor: string;
		color: string;
		start: string;
		end: string;
		offTimeResponses: OffTimeResponse[];
		pumpPoleResponses: PumpPoleResponse[];
		shiftName: string;
		checked: boolean;
		shiftId: number;
	}[];
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
	description: string;
	startHour: number;
	startMinute: number;
	endHour: number;
	endMinute: number;
	offTimes: [ITime];
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
	shifOff: [number];
}

export interface IDataEventCalendar {
	id: string;
	start: Date;
	end: Date;
	extendedProps: ICalendarData;
}

@Injectable({
	providedIn: 'root'
})
export class ShiftService {
	constructor(private http: HttpService) {}

	getStationByAccount() {
		return this.http.get<GasStationResponse[]>('gas-stations/station-employee');
	}

	getEmployeesByStation(stationId: string) {
		const params = new HttpParams().set('station-id', stationId);
		return this.http.get<IEmployee[]>(`gas-stations/station`, { params });
	}

	getShiftWorks(start: string, end: string, employeeIds: number[], stationId: string) {
		const params = new HttpParams()
			.set('employee-ids', employeeIds?.join(',') || '')
			.set('time-start', start)
			.set('time-end', end)
			.set('station-id', stationId);
		return this.http.get<ICalendarResponse>('calendars', { params });
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
}
