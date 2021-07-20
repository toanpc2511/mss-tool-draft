import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

export interface IStepData<T> {
  isValid: boolean;
  data: T;
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

export interface IStep1Data {}

export interface IStep2Data {}

export interface IStep3Data {}

export interface IStep4Data {}

export interface IPumpPole {
  code: string;
  description: string;
  id: number;
  name: string;
  status: 'ACTIVE' | 'DEACTIVE' | 'DELETE';
}

export interface IPumpPoleInput {
  code: string;
  description: string;
  gasStationId: number;
  name: string;
  status: 'ACTIVE' | 'DEACTIVE' | 'DELETE';
}

export interface IPumpHose {
  code: string;
  description: string;
  gasFieldName: string;
  name: string;
  pumpPoleName: string;
  status: 'ACTIVE' | 'DEACTIVE' | 'DELETE';
}

export interface IPumpHoseInput {
  code: string;
  description: string;
  gasFieldId: number;
  name: string;
  pumpPoleId: 0;
  status: 'ACTIVE' | 'DEACTIVE' | 'DELETE';
}
export class StepData {
  currentStep: number;
  step1: IStepData<IStep1Data>;
  step2: IStepData<IStep2Data>;
  step3: IStepData<IStep3Data>;
  step4: IStepData<IStep4Data>;
}
@Injectable({
  providedIn: 'root'
})
export class GasStationService {
  // Global
  gasStationId: number;
  gasStationStatus: boolean;
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
      step2: { isValid: false, data: null },
      step3: { isValid: false, data: null },
      step4: { isValid: false, data: null }
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
  getListGasBin(gasStationId: string) {
    return this.http.get<GasBinResponse[]>(`gas-fields/${gasStationId}`);
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
}
