import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export enum EContractType {
	PREPAID_CONTRACT = 'PRE_PAY',
	PLAN_CONTRACT = 'PLAN'
}

export enum EPaymentMethods {
	CASH = 'CASH',
	TRANSFER = 'TRANSFER'
}

export enum ETransportMethods {
	TEC = 'TEC'
}

export enum ECreatorType {
	EMPLOYEE = 'EMPLOYEE',
	ADMIN = 'ADMIN'
}

export enum EContractStatus {
	ACCEPTED = 'ACCEPTED',
	REJECT = 'REJECT',
	WAITING_ACCEPT = 'WAITING_ACCEPT',
	DRAFT = 'DRAFT'
}
export interface IContract {
	code: string;
	name: string;
	contractType: {
		type: string;
	};
	effectEndDate: string;
	effectStartDate: string;
	status: EContractStatus;
}

export interface ISortData {
	fieldSort: string;
	directionSort: string;
}

export interface IAddress {
	id: number;
	name: string;
	address: string;
	status: 'ACTIVE';
	code: string;
	areaType: string;
	fullAddress: string;
	provinceId: number;
}

export interface IProperties {
	id: number;
	name: string;
	type: string;
	code: string;
	status: string;
}

export interface ICustomerInfo {
	id: number;
	name: string;
	address: string;
	enterpriseName: string;
	phone: string;
	email: string;
	dateOfBirth: Date;
	idCard: string;
}

export interface IContractInput {
	name: string;
	dateOfBirth: Date;
	effectStartDate: Date;
	effectEndDate: Date;
	productInfoRequests: Array<{
		totalMoney: number;
		discount: number;
		categoryProductId: number;
		productName: string;
		unit: string;
		productId: number;
		amount: number;
	}>;
	creatorType: ECreatorType;
	customerId: number;
	contractTypeCode: EContractType;
	transportMethodCode: ETransportMethods;
	payMethodCode: EPaymentMethods;
	addressContract: string;
	fullAddress: string;
	nameCustomer: string;
	addressCustomer: string;
	nameEnterPrise: string;
	profileId: number;
	phone: string;
	email: string;
	idCard: string;
	url: string;
	fileName: string;
	totalPayment: number;
}

@Injectable({
	providedIn: 'root'
})
export class ContractService {
	constructor(private http: HttpService) {}

	getListContract(page: number, size: number, searchText: string, sortData: ISortData) {
		const params = new HttpParams()
			.set('page', page.toString())
			.set('page', page.toString())
			.set('size', size.toString())
			.set('field-sort', sortData?.fieldSort || '')
			.set('direction-sort', sortData?.directionSort || '')
			.set('search-text', searchText || '');

		return this.http.get<Array<IContract>>('contracts', { params });
	}

	getAddress() {
		return this.http.get<IAddress[]>('gas-stations/address');
	}

	getProperties(type: string) {
		const params = new HttpParams().set('type', type);
		return this.http.get<IProperties[]>('properties', { params });
	}

	getInfoUser(phone: string) {
		const params = new HttpParams().set('phone-number', phone);
		return this.http.get<ICustomerInfo>('drivers/information', { params });
	}
}
