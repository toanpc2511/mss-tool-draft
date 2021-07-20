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
  capacity: string;
  code: string;
  description: string;
  height: string;
  length: string;
  name: string;
  productName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
}

export interface ProductsResponse {
  name: string;
  price: number;
  unit: string;
  id: number;
  entry_price: number;
  date_price_listing: string;
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
  code: string;
  description: string;
  gasFieldName: string;
  name: string;
  pumpPoleName: string;
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

  // Step 2
  getListGasBin(gasStationId: number) {
    return this.http.get<GasBinResponse[]>(`gas-fields/${gasStationId}`);
  }

  getListProduct() {
    return this.http.get<ProductsResponse[]>('products');
  }

  createGasBin() {}

  // Step 3
  getPumpPolesByGasStation(gasStationId) {
    return this.http.get<Array<IPumpPole>>(`pump-poles/${gasStationId}`);
  }

  createPumpPole(pumpPole: IPumpPoleInput) {
    return this.http.post<any>(`pump-poles`, pumpPole);
  }

  // Step 4
  getPumpHosesByGasStation(gasStationId) {
    return this.http.get<Array<IPumpHose>>(`pump-hoses/${gasStationId}`);
  }

  createPumpHose(pumpHose: IPumpHoseInput) {
    return this.http.post<any>(`pump-hoses`, pumpHose);
  }

  resetCreateData() {
    this.gasStationId = null;
    this.gasStationStatus = null;
    this.stepDataSubject = new BehaviorSubject<StepData>({
      currentStep: 1,
      step1: { isValid: false, data: null },
      step2: { isValid: false },
      step3: { isValid: false },
      step4: { isValid: false }
    });
  }
}
