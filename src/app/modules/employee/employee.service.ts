import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { take } from 'rxjs/operators';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { IFile } from 'src/app/shared/services/file.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { SortState } from 'src/app/_metronic/shared/crud-table';
import { IDistrict, IProvince, IWard } from '../gas-station/gas-station.service';

export enum EMaritalStatus {
	MARRIED = 'MARRIED',
	UNMARRIED = 'UNMARRIED'
}

export enum ESex {
	MALE = 'MALE',
	FEMALE = 'FEMALE'
}

export enum EFace {
	FRONT = 'FRONT',
	BACK = 'BACK'
}

export interface IEmployee {
	code: string;
	name: string;
	stationId: string;
	department: IDepartment;
	positions: IPosition;
}

export interface IDepartment {
	id: number;
	code: string;
	departmentType: string;
	name: string;
	type: string;
}

export interface IPosition {
	id: number;
	code: string;
	name: string;
	type: string;
}

export interface IImage {
	id: number;
	type: 'img';
	url: string;
	name: string;
	face: EFace;
}

export interface IEmployeeInput {
	avatar: IImage;
	name: string;
	dateOfBirth: string;
	sex: ESex;
	phone: string;
	email: string;
	department: {
		code: string;
		departmentType: string;
	};
	positions: {
		code: string;
		departmentType: string;
	};
	stationId: string;
	nation: string;
	address: string;
	religion: string;
	identityCardNumber: string;
	dateRange: string;
	fullAddress: string;
	supplyAddress: string;
	province: {
		id: number;
		name: string;
	};
	district: {
		id: number;
		name: string;
	};
	ward: {
		id: number;
		name: string;
	};
	maritalStatus: EMaritalStatus;
	credentialImages: IImage[];
	attachmentRequests: number[];
}

@Injectable({
	providedIn: 'root'
})
export class EmployeeService {
	constructor(private http: HttpService) {}

	getEmployees(page: number, size: number, searchText: string, sortData: SortState) {
		const params = new HttpParams()
			.set('page', page.toString())
			.set('size', size.toString())
			.set('field-sort', sortData?.column || '')
			.set('direction-sort', sortData?.direction || '')
			.set('search-text', searchText || '');
		// let fakeData: IEmployee[] = [];
		// for (let i = 0; i < 20; i++) {
		// 	fakeData = [
		// 		...fakeData,
		// 		{
		// 			code: `NV${i}`,
		// 			name: `Nhân viên ${i}`,
		// 			department: `Phòng ban ${i}`,
		// 			position: `Vị trí ${i}`,
		// 			officeAddress: `Địa chỉ làm việc ${i}`
		// 		}
		// 	];
		// }
		// return of<DataResponse<IEmployee[]>>({
		// 	data: fakeData,
		// 	meta: {
		// 		code: 'SUN-OIL-200',
		// 		page: 1,
		// 		total: 20
		// 	}
		// });
		return this.http.get<IEmployee>('employees', { params });
	}

	getAllDepartment() {
		return this.http.get<IDepartment[]>(`properties?type=DEPARTMENT`);
	}

	getPositionByDepartment(departmentType: string) {
		const params = new HttpParams().set('type-department', departmentType);
		return this.http.get<IDepartment[]>(`properties/department`, { params });
	}

	getEmployeeById(employeeId: string) {
		return this.http.get(`employees/${employeeId}`);
	}

	createEmployee(employee: IEmployeeInput) {
		return this.http.post(`employees`, employee);
	}

	updateEmployee(id: string, user: IEmployeeInput) {
		return this.http.put(`employees/${id}`, user);
	}

	deleteEmployee(id: number) {
		return this.http.delete(`employees/${id}`);
	}
}
