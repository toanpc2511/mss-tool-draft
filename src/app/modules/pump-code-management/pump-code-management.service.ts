import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStationActiveByToken } from '../inventory-management/inventory-management.service';
import { IPumpHose, IPumpPole } from '../gas-station/gas-station.service';
import { IFilterUsingPoint } from '../history-of-using-points/history-of-using-points.service';
import { DataResponse } from '../../shared/models/data-response.model';

export interface IFilterHistoryPumpCode {
  stationCode: string;
  pumpPoleCode: string;
  pumpHoseCode: string;
  pumpCode: string;
  dateFrom: string;
  dateTo: string;
}

export interface IHistoryPumpCode {
  connection: boolean;
  deviceTime: string;
  id: number;
  intoMoney: number;
  numberOfLit: number;
  productName: string;
  pumpHoseCode: string;
  pumpPoleCode: string;
  serverTime: string;
  stationCode: string;
  status: boolean;
  totalAmountAccumulated: number;
  totalCumulativeLiters: number;
  unitPrice: number;
  pumpCode:  string;
}

export interface IPumpCode {
  connection: boolean;
  deviceHours: string;
  id: number;
  intoMoney: number;
  numberOfLit: number;
  productName: string;
  pumpHoseCode: string;
  pumpPoleCode: string;
  serverTime: string;
  stationCode: string;
  status: boolean;
  totalAmountAccumulated: number;
  totalCumulativeLiters: number;
  unitPrice: number;
  stationCodeChip: string;
  pumpHoseCodeChip: number;
  statusPump: number;
  moneyPumped: number;
  valuePumped: number;
  totalAmountAccumulatedChip: number;
  totalCumulativeLitersChip: number;
}

export class IDataConnectMqtt {
  station: string;
  slave: number;
  statusPump: number;
  moneyPumped: number;
  valuePumped: number;
  totalAmountAccumulated: number;
  totalCumulativeLiters: number;
}

export class StepData {
  currentStep: number;
  step1: {
    isValid: boolean;
    // data: UpdateCustomer;
  };
  step2: {
    isValid: boolean;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PumpCodeManagementService {
  private stepDataSubject: BehaviorSubject<StepData>;
  stepData$: Observable<StepData>;

  constructor(private http: HttpService) {
    this.stepDataSubject = new BehaviorSubject<StepData>({
      currentStep: 1,
      step1: { isValid: false },
      step2: { isValid: false }
    });
    this.stepData$ = this.stepDataSubject.asObservable();
  }

  resetCreateData() {
    this.stepDataSubject.next({
      currentStep: 1,
      step1: { isValid: false},
      step2: { isValid: false }
    });
  }

  setStepData(stepData: StepData) {
    this.stepDataSubject.next(stepData);
  }

  getStepDataValue(): StepData {
    return this.stepDataSubject.value;
  }

  // Lấy ds trạm theo token login và trạng thái
  getStationByToken(status, corporation) {
    const params = new HttpParams()
      .set('status', status)
      .set('corporation', corporation)
    return this.http.get<Array<IStationActiveByToken>>(`gas-stations/employee/status-corporation`, {params});
  }

  // Lấy danh sách cột theo trạm của nhân viên
  getPumpPolesEmployee(gasStationId?: number | string) {
    const params = new HttpParams()
      .set('gas-station-id', gasStationId?.toString() || '')
    return this.http.get<IPumpPole[]>('pump-poles/gas-stations/employee', {params});
  }

  // Lấy danh sách vòi theo trạm + cột của nhân viên
  getPumpHoseEmployee(gasStationId?: number | string, pumpPoleId?: number | string) {
    const params = new HttpParams()
      .set('gas-station-id', gasStationId?.toString() || '')
      .set('pump-pole-id', pumpPoleId?.toString() || '')
    return this.http.get<IPumpHose[]>('pump-hoses/employee', {params});
  }

  // Lấy danh sách lịch sử mã bơm
  getHistoryPumpCode(page: number, size: number, dataReq: IFilterHistoryPumpCode) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('station-code', dataReq.stationCode)
      .set('pump-pole-code', dataReq.pumpPoleCode)
      .set('pump-hose-code', dataReq.pumpHoseCode)
      .set('pump-code', dataReq.pumpCode)
      .set('date-from', dataReq.dateFrom)
      .set('date-to', dataReq.dateTo)
    return this.http.get<IHistoryPumpCode[]>('history-pump-code/filters', {params})
  }

  // hdf
  getPumpCode(stationCode) {
    const params = new HttpParams()
      .set('station-code', stationCode)
    return this.http.get<IPumpCode[]>('pump-code/filters', {params})
  }

  exportHistoryPumpCode(data: IFilterHistoryPumpCode): Observable<DataResponse<string>> {
    const params = new HttpParams()
      .set('station-code', data.stationCode)
      .set('pump-pole-code', data.pumpPoleCode)
      .set('date-from', data.dateFrom)
      .set('date-to', data.dateTo)
      .set('pump-hose-code', data.pumpHoseCode);
    return this.http.getFileUrl<string>(`history-pump-code/excels`, {
      params
    });
  }
}
