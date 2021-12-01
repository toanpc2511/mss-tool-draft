import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { Observable } from 'rxjs';
import { DataResponse } from '../../../shared/models/data-response.model';
import { IBanner } from './models';
import { HttpParams } from '@angular/common/http';
import { convertDateToServer } from '../../../shared/helpers/functions';

interface IParam {
  page: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class BannerConfigService {

  constructor(private http: HttpService) { }

  getList(): Observable<DataResponse<IBanner[]>> {
    return this.http.get<IBanner[]>('banners');
  }

  create(data: IBanner): Observable<DataResponse<boolean>> {
    return this.http.post<boolean>('banners', data);
  }

  update(data: IBanner, id: number): Observable<DataResponse<boolean>> {
    return this.http.put<boolean>(`banners/${id}`, data);
  }

  delete(id: number): Observable<DataResponse<boolean>> {
    return this.http.delete<boolean>(`banners/${id}`);
  }
}
