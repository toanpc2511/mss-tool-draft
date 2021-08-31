import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { HttpService } from 'src/app/shared/services/http.service';
import { ISortData } from '../contract/contract.service';

export enum EPartnerStatus {
	WAITING_ACCEPTED = 'WAITING_ACCEPTED',
	ACCEPTED = 'ACCEPTED',
	REJECTED = 'REJECTED'
}

export interface ICar {
	id: number;
	name: string;
}

export interface IPartner {
	id: number;
	fullName: string;
	phone: string;
	cars: ICar[];
	status: EPartnerStatus;
}

@Injectable({
	providedIn: 'root'
})
export class PartnerService {
	constructor(private http: HttpService) {}

	getPartner(
		driverId: string,
		page: number,
		size: number,
		searchText: string,
		sortData: ISortData
	) {
		const params = new HttpParams()
			.set('driver-id', driverId)
			.set('page', page.toString())
			.set('page', page.toString())
			.set('size', size.toString())
			.set('field-sort', sortData?.fieldSort || '')
			.set('direction-sort', sortData?.directionSort || '')
			.set('search-text', searchText || '');

		return of<DataResponse<Array<IPartner>>>({
			data: [
				{
					id: 1,
					fullName: '1',
					phone: '01927382',
					cars: [
						{ id: 1, name: '123' },
						{ id: 2, name: '456' }
					],
					status: EPartnerStatus.ACCEPTED
				},
				{
					id: 2,
					fullName: '2',
					phone: '01927383',
					cars: [
						{ id: 6, name: '12375' },
						{ id: 7, name: '456445' },
						{ id: 8, name: '456445' }
					],
					status: EPartnerStatus.REJECTED
				},
				{
					id: 3,
					fullName: '3',
					phone: '3333333',
					cars: [
						{ id: 6, name: '3333333' },
						{ id: 7, name: '333333' }
					],
					status: EPartnerStatus.WAITING_ACCEPTED
				}
			],
			meta: {
				code: 'SUN-OIL-200',
				page: 1,
				size: 15,
				total: 3
			}
		});

		// return this.http.get<Array<IPartner>>(`partners/enterprise`, {
		// 	params
		// });
	}

	getAllCars() {
		return of<DataResponse<ICar[]>>({
			data: [
				{
					id: 1,
					name: '1244444444443'
				},
				{
					id: 2,
					name: '234444444444'
				},
				{
					id: 3,
					name: '344444444444445'
				},
				{
					id: 5,
					name: '344444444444445'
				},
				{
					id: 7,
					name: '344444444444445'
				}
			],
			meta: {
				code: 'SUN-OIL-200'
			}
		});
	}

	getPartnerById(partnerId: number) {
		return of<DataResponse<IPartner>>(null);
	}

	getPartnerByPhone(phoneNumber: string) {
		return of<DataResponse<any>>(null);
	}

	createPartner(body: IPartner) {
		return of<DataResponse<any>>(null);
	}

	updatePartner(partnerId: number, body: IPartner) {
		return of<DataResponse<any>>(null);
	}
}
