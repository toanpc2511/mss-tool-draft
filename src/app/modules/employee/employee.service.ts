import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFile } from 'src/app/shared/services/file.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { SortState } from 'src/app/_metronic/shared/crud-table';
import { GasStationResponse } from '../gas-station/gas-station.service';
import { convertDateToServer } from '../../shared/helpers/functions';
import { Observable } from 'rxjs';
import { DataResponse } from '../../shared/models/data-response.model';
import { IEmployeeAssessment } from './employee-assessment/models/employee-assessment.interface';
import { IDetailEmployeeAssessment } from './employee-assessment/models/detail-employee-assessment.interface';

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
	id: number;
	code: string;
	name: string;
	station: GasStationResponse[];
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

export interface IEmployeeDetail {
	id: number;
	avatar: IImage;
	code: string;
	name: string;
	dateOfBirth: string;
	sex: ESex;
	phone: string;
	email: string;
	department: {
		id: number;
		name: string;
		type: string;
		code: string;
		departmentType: string;
	};
	positions: {
		id: number;
		name: string;
		type: string;
		code: string;
		departmentType: string;
	};
	stationList: {
		id: number;
		name: string;
	}[];
	accountId: number;
	nation: string;
	religion: string;
	address: string;
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
	attachment: IFile[];
}

export interface IFilter {
  dateFrom?: string,
  dateTo?: string,
  employeeId?: string,
  stationId?: string
  vote?: string;
}

interface IParam {
  page?: number;
  size?: number;
  filter?: IFilter;
}

@Injectable({
	providedIn: 'root'
})
export class EmployeeService {
	constructor(private http: HttpService) {}

	getAllEmployees() {
		return this.http.get<IEmployee[]>('employees/staff');
	}

	getEmployees(
		page: number,
		size: number,
		searchDepartmentId: string,
		searchPositionId: string,
		searchText: string,
		sortData: SortState
	) {
		const params = new HttpParams()
			.set('page', page.toString())
			.set('size', size.toString())
			.set('department-id', searchDepartmentId)
			.set('positions-id', searchPositionId)
			.set('field-sort', sortData?.column || '')
			.set('direction-sort', sortData?.direction || '')
			.set('search-text', searchText || '')
			.set('callApiType', 'background');
		return this.http.get<IEmployee[]>('employees', { params });
	}

	getAllStationAddress() {
		return this.http.get<GasStationResponse[]>('gas-stations/address');
	}

	getAllDepartment() {
		return this.http.get<IDepartment[]>(`properties?type=DEPARTMENT`);
	}

	getPositionByDepartment(departmentType: string) {
		const params = new HttpParams().set('type-department', departmentType);
		return this.http.get<IDepartment[]>(`properties/department`, { params });
	}

	getEmployeeById(employeeId: string) {
		return this.http.get<IEmployeeDetail>(`employees/details/${employeeId}`);
	}

	createEmployee(employeeData: IEmployeeInput) {
		return this.http.post(`employees`, employeeData);
	}

	updateEmployee(id: string, employeeData: IEmployeeInput) {
		return this.http.put(`employees/${id}`, employeeData);
	}

	deleteEmployee(id: number) {
		return this.http.delete(`employees/${id}`);
	}

  getListEmployeeAssessment(params: IParam): Observable<DataResponse<IEmployeeAssessment>> {
    return this.http.get<IEmployeeAssessment>('evaluations/filters', { params: this.createParam(params) })
  }

  exportExcelEmployeeAssessment(params: IParam): Observable<DataResponse<string>> {
    return this.http.getFileUrl<string>('evaluations/filters/excels', { params: this.createParam(params)});
  }

  getListDetailEmployeeAssessment(params: IParam): Observable<DataResponse<IDetailEmployeeAssessment[]>> {
    return this.http.get<IDetailEmployeeAssessment[]>('evaluations/detail', { params: this.createParam(params) });
  }

  createParam(param: IParam): HttpParams {
    return new HttpParams()
      .set('page', param.page ? param.page.toString() : '')
      .set('size', param.size ? param?.size.toString() : '')
      .set('date-from', convertDateToServer(param.filter.dateFrom))
      .set('date-to', convertDateToServer(param.filter.dateTo))
      .set('employee-id', param.filter.employeeId || '')
      .set('station-id', param.filter.stationId || '')
      .set('vote', param.filter.vote || '')
  }
}
