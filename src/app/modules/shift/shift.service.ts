import { DataResponse } from './../../shared/models/data-response.model';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { GasStationResponse } from './../gas-station/gas-station.service';
import { convertDateToServer } from '../../shared/helpers/functions';
import { of } from 'rxjs';
import * as moment from 'moment';

export enum EShiftChangRequestType {
	CHANGE = 'CHANGE',
	REPLACE = 'REPLACE'
}

export enum EShiftChangRequestStatus {
	APPROVE = 'APPROVE',
	WAITING = 'WAITING',
	REJECT = 'REJECT'
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
	name: string;
	type: EShiftChangRequestType;
	station: string;
	date: string;
	shiftRequest: string;
	reason: string;
	createAt: string;
	status: EShiftChangRequestStatus;
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

	/*	
		Đổi ca/thay ca	
	*/
	getShiftRequestChangeList(type: string, status: EShiftChangRequestStatus) {
		const params = new HttpParams().set('type', type).set('status', status);
		let data: IShiftRequestChange[] = [];
		for (let i = 0; i < 50; i++) {
			data = [
				...data,
				{
					id: i.toString(),
					name: `Nhân viên ${i}`,
					type: i < 15 ? EShiftChangRequestType.CHANGE : EShiftChangRequestType.REPLACE,
					station: `Trạm ${i}`,
					date: moment().format('DD/MM/YYYY'),
					shiftRequest: `Ca ${i}`,
					reason: `Thích đổi ${i}`,
					createAt: moment().format('DD/MM/YYYY'),
					status:
						i < 10
							? EShiftChangRequestStatus.APPROVE
							: i < 20
							? EShiftChangRequestStatus.REJECT
							: EShiftChangRequestStatus.WAITING
				}
			];
		}
		console.log(data);
		
		return of<DataResponse<IShiftRequestChange[]>>({
			data,
			meta: {
				total: 50
			}
		});
		return this.http.get<IShiftRequestChange[]>(`shift-request-change`, { params });
	}

	getDetailShiftRequestChange(id: string) {
		return this.http.get(`shift-request-change/${id}`);
	}

	approveShiftRequestChange(id: string) {
		return this.http.put(`shift-request-change/${id}`, null);
	}

	rejectShiftRequestChange(id: string) {
		return this.http.put(`shift-request-change/${id}`, null);
	}
}
