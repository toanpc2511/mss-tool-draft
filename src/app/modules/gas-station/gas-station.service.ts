import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EArea, EStatus } from 'src/app/shared/data-enum/enums';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import { PumpPoleResponse } from '../shift/shift.service';

export class StepData {
	currentStep: number;
	step1: {
		isValid: boolean;
		data: CreateStation;
	};
	step2: {
		isValid: boolean;
	};
	step3: {
		isValid: boolean;
	};
	step4: {
		isValid: boolean;
	};
}
// gas station
export interface GasStationResponse {
	id: number;
	code: string;
	name: string;
	provinceId: number;
	districtId: number;
	wardId: number;
	address: string;
	fullAddress: string;
	areaType: EArea;
	status: EStatus;
	lat: string;
	lon: string;
	chip: boolean;
	phone: string;
}

export interface CreateStation {
	stationCode: string;
	name: string;
	provinceId: number;
	districtId: number;
	wardId: number;
	address: string;
	fullAddress: string;
	areaType: EArea;
	lat: string;
	lon: string;
	chip: boolean;
	phone: string;
	status: EStatus;
}
// end gas station

// gas bin
export interface IProduct {
	id: number;
	name: string;
}
export interface GasBinResponse {
	id?: number;
	capacity: string;
	code: string;
	description: string;
	height: string;
	length: string;
	name: string;
	productName: string;
	product?: IProduct;
	status: EStatus;
}

export interface ProductsResponse {
	name: string;
	price: number;
	unit: string;
	id: number;
	entryPrice: number;
	datePriceListing: string;
	type: string;
	status: EStatus;
}

export interface CreateGasBin {
	capacity: string;
	code: string;
	description: string;
	gasStationId: string;
	height: string;
	length: string;
	name: string;
	productId: string;
	status: EStatus;
}
// end gas bin
export interface IPumpPole {
	code: string;
	description: string;
	id: number;
	name: string;
	status: EStatus;
}

export interface IPumpPoleInput {
	code: string;
	description: string;
	gasStationId: number;
	name: string;
	status: EStatus;
}

export interface IPumpHose {
	id: number;
	code: string;
	description: string;
	gasFieldName: string;
	gasField?: {
		id: number;
		name: string;
	};
	name: string;
	pumpPoleName: string;
	pumpPole?: {
		id: number;
		name: string;
	};
	status: EStatus;
}

export interface IPumpHoseInput {
	code: string;
	description: string;
	gasFieldId: number;
	name: string;
	pumpPoleId: number;
	status: EStatus;
}

export interface IProvince {
	code: string;
	id: number;
	name: string;
	areaType: EArea;
}

export interface IDistrict {
	id: number;
	name: string;
	prefix: string;
	provinceId: number;
}

export interface IWard {
	districtId: number;
	id: number;
	name: string;
	prefix: string;
	provinceId: 0;
}
export interface IAddress {
	id: number;
	name: string;
	address: string;
	status: EStatus;
	code: string;
	areaType: string;
	fullAddress: string;
	provinceId: number;
}

export interface IInfoBarem {
  capacity: string;
  code: string;
  height: string;
  length: string;
  name: string;
  scales: [{
    numberOfLit: number,
    height: number
  }];
}

@Injectable({
	providedIn: 'root'
})
export class GasStationService {
	// Global
	gasStationId: number;
	gasStationStatus: 'ACTIVE' | 'INACTIVE' | 'DELETE';
	apiUrl = environment.apiUrl;
	private stepDataSubject: BehaviorSubject<StepData>;
	stepData$: Observable<StepData>;

	constructor(private http: HttpService) {
		this.stepDataSubject = new BehaviorSubject<StepData>({
			currentStep: 1,
			step1: { isValid: false, data: null },
			step2: { isValid: false },
			step3: { isValid: false },
			step4: { isValid: false }
		});
		this.stepData$ = this.stepDataSubject.asObservable();
	}

	// Create gas station
	setStepData(stepData: StepData) {
		this.stepDataSubject.next(stepData);
	}

	getStepDataValue(): StepData {
		return this.stepDataSubject.value;
	}

	// Step 1
	getAllProvinces() {
		return this.http.get<Array<IProvince>>('provinces');
	}

	getDistrictsByProvince(provinceId: number) {
		const params = new HttpParams().set('province-id', provinceId.toString());
		return this.http.get<Array<IDistrict>>(`districts`, { params });
	}

	getWardsByDistrict(districtId: number) {
		const params = new HttpParams().set('district-id', districtId.toString());
		return this.http.get<Array<IWard>>(`wards`, { params });
	}

	getListStation() {
		return this.http.get<GasStationResponse[]>('gas-stations');
	}

	getStationById(stationId: number) {
		return this.http.get<GasStationResponse>(`gas-stations/${stationId}`);
	}

	createStation(body: CreateStation) {
		return this.http.post<GasStationResponse>('gas-stations', body);
	}

	updateStation(id: number, body: CreateStation) {
		return this.http.put<CreateStation>(`gas-stations/${id}`, body);
	}

	deleteStation(stationId: string | number) {
		return this.http.delete(`gas-stations/${stationId}`);
	}

	// Step 2
	getListGasBin(gasStationId: number) {
		const params = new HttpParams({
			fromString: `gas-station-id=${gasStationId}`
		});
		return this.http.get<GasBinResponse[]>(`gas-fields`, { params });
	}

	getListProduct() {
		return this.http.get<ProductsResponse[]>('products/category/0');
	}

	createGasBin(body: CreateGasBin) {
		return this.http.post('gas-fields', body);
	}

	updateGasBin(id: number, body: CreateGasBin) {
		return this.http.put<CreateGasBin>(`gas-fields/${id}`, body);
	}

	deleteGasBin(id: string | number) {
		return this.http.delete(`gas-fields/${id}`);
	}

	// Step 3
	getPumpPolesByGasStation(gasStationId: string | number) {
		const params = new HttpParams({
			fromString: `gas-station-id=${gasStationId}`
		});
		return this.http.get<Array<IPumpPole>>(`pump-poles/gas-stations`, {
			params
		});
	}

	createPumpPole(pumpPole: IPumpPoleInput) {
		return this.http.post<any>(`pump-poles`, pumpPole);
	}

	updatePumpPole(id: number, pumpPole: IPumpPoleInput) {
		return this.http.put<any>(`pump-poles/${id}`, pumpPole);
	}

	deletePumpPole(id: number) {
		return this.http.delete<any>(`pump-poles/${id}`);
	}

	// Step 4
	getPumpHosesByGasStation(gasStationId: number) {
		const params = new HttpParams({
			fromString: `gas-station-id=${gasStationId}`
		});
		return this.http.get<Array<IPumpHose>>(`pump-hoses`, { params });
	}

	createPumpHose(pumpHose: IPumpHoseInput) {
		return this.http.post<any>(`pump-hoses`, pumpHose);
	}

	updatePumpHose(id: number, pumpPole: IPumpHoseInput) {
		return this.http.put<any>(`pump-hoses/${id}`, pumpPole);
	}

	deletePumpHose(id: number) {
		return this.http.delete<any>(`pump-hoses/${id}`);
	}

	getAddress() {
		return this.http.get<IAddress[]>('gas-stations/address');
	}

	resetCreateData() {
		this.gasStationId = null;
		this.gasStationStatus = null;
		this.stepDataSubject.next({
			currentStep: 1,
			step1: { isValid: false, data: null },
			step2: { isValid: false },
			step3: { isValid: false },
			step4: { isValid: false }
		});
	}

	getPumpPolesActiveByGasStation(gasStationId: string | number) {
		const params = new HttpParams({
			fromString: `station-id=${gasStationId}`
		});
		return this.http.get<Array<IPumpPole>>(`pump-poles/stations`, {
			params
		});
	}

	getPumpolesActive(stationId: string) {
		const params = new HttpParams().set('station-id', stationId);
		return this.http.get<PumpPoleResponse[]>('pump-poles/stations', { params });
	}

  // Lấy thông tin Barem của bồn
  getInfoBarem(gasBinId: number) {
    const params = new HttpParams()
      .set('gas-field-id', gasBinId.toString())
    return this.http.get<IInfoBarem>(`scales`, {params})
  }

  // nhập barem bồn
  impostBarem(dataReq) {
    return this.http.post('scales', dataReq);
  }
}
