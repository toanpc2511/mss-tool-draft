import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { DataResponse } from '../../shared/models/data-response.model';
import { environment } from '../../../environments/environment';

export interface ILogGroups {
  id: number;
  code: string;
  name: string;
  groups: [ILogGroupsItem]
}
export interface ILogGroupsItem {
  code: string;
  id: number;
  name: string;
}

export interface ILogDetail {
  code: string;
  date: string;
  description: string;
  descriptionDetail: string;
  name: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})

export class ImpactHistoryService {
  constructor(
    private http: HttpService,
    private httpClient: HttpClient
  ) {}

  getLogGroups() {
    return this.httpClient.get<DataResponse<ILogGroups[]>>(`${environment.apiUrlRoot}/permissions/histories/log`);
  }

  getLogDetail(page: number, size: number,dataReq, entity: string) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('create-to', dataReq.endAt)
      .set('create-from', dataReq.startAt)
      .set('entity', entity)

    return this.http.get<ILogDetail[]>('logs', {params})
  }

}
