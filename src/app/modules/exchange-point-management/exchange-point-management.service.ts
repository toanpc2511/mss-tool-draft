import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpService } from '../../shared/services/http.service';
import { convertDateToServer } from '../../shared/helpers/functions';
import { IExchangePoint } from './models/exchange-point.interface';
import { DataResponse } from '../../shared/models/data-response.model';

interface IFilter {
  startAt?: string,
  endAt?: string,
  driverName?: string,
  phone?: string
}

interface IParam {
  page: number;
  size: number;
  filter?: IFilter;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangePointManagementService {

  constructor(private http: HttpService) {}

  getAll(param: IParam): Observable<DataResponse<IExchangePoint[]>> {
    const params = this.createParam(param);
    return this.http.get<IExchangePoint[]>('swap-point/filter', { params })
  }

  createParam(param: IParam): HttpParams {
    return new HttpParams()
      .set('page', param.page.toString())
      .set('size', param.size.toString())
      .set('start-at', convertDateToServer(param.filter.startAt))
      .set('end-at', convertDateToServer(param.filter.endAt))
      .set('driver-name', param.filter.driverName)
      .set('phone', param.filter.phone)
  }
}
