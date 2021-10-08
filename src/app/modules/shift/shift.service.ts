import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { NumberLiteralType } from 'typescript';

export type PumpPoleResponse = {
	id: number;
	name: string;
};

export type OffTimeResponse = {
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
		shiftId: number;
	}[];
	totalPump: number;
}

export class ICalendarData {
	id: number;
	employeeName: string;
	start: string;
	end: string;
	offTimeResponses: OffTimeResponse[];
	pumpPoleResponses: PumpPoleResponse[];
	totalPump: NumberLiteralType;
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

@Injectable({
	providedIn: 'root'
})
export class ShiftService {
	constructor(private http: HttpService) {}

	getStationByAccount() {
		return this.http.get<any[]>('gas-stations/address');
	}

	getShiftWorks(start: string, end: string, employeeIds: string[], stationId: string) {
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
}
