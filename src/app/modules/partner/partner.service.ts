import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { HttpService } from 'src/app/shared/services/http.service';
import { ISortData } from '../contract/contract.service';

export interface IPartner {
	id: number;
	name: string;
	phone: string;
	status: EPartnerStatus;
	numberVariables: string[];
}

export enum EPartnerStatus {
	WAITING = 'WAITING',
	ACCEPTED = 'ACCEPTED',
	REJECTED = 'REJECTED'
}

export interface IVehicle {
	id: number;
	name: string;
	vehicleCompany: string;
	color: string;
	numberVariable: string;
	type: 'CAR';
}

export interface ICashLimit {
	productId: number;
	cashLimitOil: number;
	unitCashLimitOil?: string;
}
export interface ICashLimitInfo {
	rank: string;
	cashLimitMoney: number;
	userType: string;
	cashLimitOilAccount: ICashLimit[];
}

export interface IPartnerInput {
	driverId: number;
	cashLimitOil: Array<{
		productId: number;
		cashLimitOil: number;
		unitCashLimitOil?: string;
	}>;
	vehicleIds: IVehicle[];
	cashLimitMoney: number;
}

@Injectable({
	providedIn: 'root'
})
export class PartnerService {
	constructor(private http: HttpService) {}

	getPartners(
		driverId: string,
		page: number,
		size: number,
		searchText: string,
		sortData: ISortData
	) {
		const params = new HttpParams()
			.set('driver-id', driverId)
			.set('page', page.toString())
			.set('size', size.toString())
			.set('field-sort', sortData?.fieldSort || '')
			.set('direction-sort', sortData?.directionSort || '')
			.set('search-text', searchText || '');

		return this.http.get<Array<IPartner>>('enterprises/child-account', {
			params
		});
	}

	getAllVehicles() {
		return this.http.get<IVehicle[]>('vehicles/enterprise/list');
	}

	getPartnerById(partnerId: number) {
		return of<DataResponse<IPartner>>(null);
	}

	getPartnerByPhone(phoneNumber: string) {
		const params = new HttpParams()
			.set('phone-number', phoneNumber)
			.set('callApiType', 'background');
		return this.http.get<IPartner>('profiles/names', { params });
	}

	getCashLimit() {
		return this.http.get<ICashLimitInfo>('cash-limit/enterprises');
	}

	createPartner(body: IPartner) {
		return this.http.post<any>('enterprises/childes', body);
	}

	updatePartner(partnerId: number, body: IPartner) {
		return of<DataResponse<any>>(null);
	}
}
