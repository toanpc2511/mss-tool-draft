import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { HttpService } from 'src/app/shared/services/http.service';
import { ISortData } from '../contract/contract.service';

export interface IPartner {
	driverId: number;
	ticketId: number;
	name: string;
	phone: string;
	status: EPartnerStatus;
	numberVariables: string[];
}

export enum EPartnerStatus {
	WAITING = 'WAITING',
	ACCEPTED = 'ACCEPTED',
	REJECTED = 'REJECT'
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
	productName: string;
	cashLimitOil: number;
	unitCashLimitOil?: string;
}
export interface ICashLimitInfo {
	rank: string;
	cashLimitMoney: number;
	userType: string;
	cashLimitOilAccount: ICashLimit[];
}

export interface ICashLimitOilChildNMaster {
	productId: number;
	productName: string;
	cashLimitOilChild: number;
	cashLimitOilMaster: number;
}

export interface ICashLimitMoneyChildNMaster {
	cashLimitMoneyChild: number;
	cashLimitMoneyMaster: number;
}

export interface IPartnerData {
	vehicles: IVehicle[];
	driverInfo: {
		id: number;
		name: string;
		phone: string;
	};
	cashLimitMoneyChildNmaster: ICashLimitMoneyChildNMaster;
	cashLimitOilChildNmaster: ICashLimitOilChildNMaster[];
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

	getPartners(page: number, size: number, searchText: string, sortData: ISortData) {
		const params = new HttpParams()
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
		return this.http.get<IPartnerData>(`ticket-assign/childes/${partnerId}`);
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
		return this.http.put<any>(`ticket-assign/childes/${partnerId}`, body);
	}

	deletePartner(partnerId: number, status: string) {
    const params = new HttpParams()
      .set('status', status)
		return this.http.delete(`enterprises/${partnerId}`, {params});
	}
}
