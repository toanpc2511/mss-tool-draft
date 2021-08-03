import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

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
  province: IProvince;
  district: IDistrict;
  ward: IWard;
  address: string;
  fullAddress: string;
  areaId: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
}

export interface CreateStation {
  stationCode: string;
  name: string;
  provinceId: number;
  districtId: number;
  wardId: number;
  address: string;
  fullAddress: string;
  areaId: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
}
// end gas station

// gas bin
export interface GasBinResponse {
  id?: number;
  capacity: string;
  code: string;
  description: string;
  height: string;
  length: string;
  name: string;
  productName: string;
  product?: {
    id: number;
    name: string;
  };
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
}

export interface ProductsResponse {
  name: string;
  price: number;
  unit: string;
  id: number;
  entryPrice: number;
  datePriceListing: string;
  type: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
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
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
}
// end gas bin
export interface IPumpPole {
  code: string;
  description: string;
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
}

export interface IPumpPoleInput {
  code: string;
  description: string;
  gasStationId: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
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
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
}

export interface IPumpHoseInput {
  code: string;
  description: string;
  gasFieldId: number;
  name: string;
  pumpPoleId: 0;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
}

export interface IProvince {
  provinceId: number;
  name: string;
  area: {
    id: number;
    name: string;
  };
}

export interface IDistrict {
  districtId: number;
  name: string;
  provinceId: number;
}

export interface IWard {
  wardId: number;
  name: string;
  districtId: number;
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
    // return this.http.get<Array<IProvince>>('provinces');
    return of<Array<IProvince>>([
      { name: 'Hà Nội', provinceId: 1, area: { id: 1, name: 'Vùng 1' } },
      { name: 'Hải phòng', provinceId: 2, area: { id: 1, name: 'Vùng 2' } }
    ]);
  }

  getDistrictsByProvince(provinceId: number) {
    // return this.http.get<Array<IDistrict>>('districts');
    const districts: IDistrict[] = [
      { name: 'Mê Linh', provinceId: 1, districtId: 1 },
      { name: 'Đông Anh', provinceId: 1, districtId: 2 },
      { name: 'Yên Lãng', provinceId: 2, districtId: 3 },
      { name: 'Tiên Lãng', provinceId: 2, districtId: 4 }
    ];

    return of<Array<IDistrict>>(districts.filter((d) => d.provinceId === Number(provinceId)));
  }

  getWardsByDistrict(districtId: number) {
    // return this.http.get<Array<IWard>>('wards');
    const wards: IWard[] = [
      { name: 'Tam Đồng', districtId: 1, wardId: 1 },
      { name: 'Nam Cường', districtId: 1, wardId: 2 },
      { name: 'Hải Hậu', districtId: 2, wardId: 3 },
      { name: 'Bình Minh', districtId: 2, wardId: 4 },
      { name: 'Sơn Đông', districtId: 3, wardId: 5 },
      { name: 'Sơn Nam', districtId: 4, wardId: 6 }
    ];
    return of<Array<IWard>>(wards.filter((w) => w.districtId === Number(districtId)));
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
    return this.http.get<ProductsResponse[]>('products');
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
    return this.http.get<Array<IPumpPole>>(`pump-poles/gas-stations`, { params });
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
  getPumpHosesByGasStation(gasStationId) {
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
}
