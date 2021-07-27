import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  name: string;
  address: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
  code: string;
}

export interface CreateStation {
  stationCode: string;
  name: string;
  address: string;
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
@Injectable({
  providedIn: 'root'
})
export class GasStationService {
  // Global
  gasStationId: number;
  gasStationStatus: 'ACTIVE' | 'INACTIVE' | 'DELETE';
  apiUrl = environment.apiUrl;
  stepDataSubject: BehaviorSubject<StepData>;
  stepData$: Observable<StepData>;

  // Step 1

  // Step 2

  // Step 3

  // Step 4

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
  setStepData(stepData) {
    this.stepDataSubject.next(stepData);
  }

  getStepDataValue(): StepData {
    return this.stepDataSubject.value;
  }

  // Step 1
  getListStation() {
    return this.http.get<GasStationResponse[]>('gas-stations');
  }

  createStation(body: CreateStation) {
    return this.http.post<GasStationResponse>('gas-stations', body);
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

  updatePumpHose(id: number, pumpPole: IPumpPoleInput) {
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
