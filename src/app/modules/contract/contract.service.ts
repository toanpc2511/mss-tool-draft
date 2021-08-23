import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFile } from 'src/app/shared/services/file.service';
import { HttpService } from 'src/app/shared/services/http.service';

export enum ECreatorType {
	EMPLOYEE = 'EMPLOYEE',
	ENTERPRISE = 'ENTERPRISE'
}

export enum EContractType {
	PREPAID_CONTRACT = 'PRE_PAY',
	PLAN_CONTRACT = 'PLAN'
}
export interface IContract {
	id: number;
	code: string;
	name: string;
	attachment: [
		{
			id: number;
			url: string;
			name: string;
		}
	];
	customer: {
		address: string;
		dateOfBirth: string;
		districtId: string;
		email: string;
		enterpriseName: string;
		id: string;
		idCard: string;
		name: string;
		phone: null;
		provinceId: string;
		status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
		wardId: string;
	};
	customerId: string;
	contractAddress: string;
	fullAddress: string;
	payMethod: {
		id: number;
		code: EPaymentMethods;
		name: string;
		type: string;
	};
	product: [
		{
			categoryResponse: {
				code: string;
				description: string;
				id: number;
				name: string;
				status: string;
				type: string;
			};
			productResponse: {
				amount: number;
				discount: number;
				id: number;
				name: string;
				price: number;
				totalMoney: number;
				unit: string;
			};
		}
	];
	totalPayment: number;
	transportMethod: {
		id: number;
		name: string;
		code: ETransportMethods;
		type: string;
	};
	contractType: {
		id: number;
		code: EContractType;
		name: string;
		type: string;
	};
	effectEndDate: string;
	effectStartDate: string;
	createdAt: string;
	rejectReason: string;
	approveDate: string;
	limitMoney: number;
	dateOfPayment: string;
	status: 'ACCEPTED' | 'REJECT' | 'WAITING_ACCEPT';
	station: {
		id: number;
		code: string;
		address: string;
		areaType: string;
		fullAddress: string;
	};
}

export enum EPaymentMethods {
	CASH = 'CASH',
	TRANSFER = 'TRANSFER'
}

export enum ETransportMethods {
	TEC = 'TEC'
}

export enum EContractStatus {
	ACCEPTED = 'ACCEPTED',
	REJECT = 'REJECT',
	WAITING_ACCEPT = 'WAITING_ACCEPT',
	DRAFT = 'DRAFT'
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

export interface IProductInfo {
	totalMoney: number;
	discount: number;
	categoryProductId: number;
	productName: string;
	unit: string;
	productId: number;
	amount: number;
}
export interface IContractPrepayInput {
	profileId: number;

	creatorType: ECreatorType;
	name: string;
	effectEndDate: string;
	contractTypeCode: EContractType;
	transportMethodCode: ETransportMethods;
	payMethodCode: EPaymentMethods;
	stationId: number;
	fullAddress: string;

	productInfoRequests: Array<IProductInfo>;
	totalPayment: number;

	attachmentRequests: Array<IFile>;
	statusType: EContractStatus;
}
export interface IContractPlanInput {
	profileId: number;

	creatorType: ECreatorType;
	name: string;
	effectEndDate: string;
	contractTypeCode: EContractType;
	transportMethodCode: ETransportMethods;
	payMethodCode: EPaymentMethods;

	limitMoney: number;
	dateOfPayment: {
		paymentTimeOne: string;
		paymentTimeTwo: string;
		paymentTimeThree: string;
		paymentTimeFour: string;
		paymentTimeFive: string;
	};

	attachmentRequests: Array<IFile>;
	statusType: EContractStatus;
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
		const params = new HttpParams().set('phone-number', phone).set('callApiType', 'background');
		return this.http.get<ICustomerInfo>('drivers/information', { params });
	}

	getContractById(contractId: number) {
		return this.http.get<IContract>(`contracts/${contractId}`);
	}

	createPrepayContract(contract: IContractPrepayInput) {
		return this.http.post<any>(`contracts`, contract);
	}

	createPlanContract(contract: IContractPlanInput) {
		return this.http.post<any>(`contracts/plans`, contract);
	}

	updatePrepayContract(contractId: number, contract: IContractPrepayInput) {
		return this.http.put<any>(`contracts/${contractId}`, contract);
	}

	updatePlanContract(contractId: number, contract: IContractPlanInput) {
		return this.http.post<any>(`contracts/plans/${contractId}`, contract);
	}

	deleteContract(contractId: number) {
		return this.http.delete(`contracts/${contractId}`);
	}

	acceptContract(id: number) {
		return this.http.put(`contracts/acceptances/${id}`, {});
	}
	rejectContract(id: number, body) {
		return this.http.put(`contracts/rejections/${id}`, body);
	}
}
