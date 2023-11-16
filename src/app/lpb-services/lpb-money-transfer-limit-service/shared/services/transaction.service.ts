import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpService} from '../../../../shared/services/http.service';
import {Observable} from 'rxjs';
import {DataResponse} from '../../../../shared/models/data-response.model';
import {API_BASE_URL} from '../constants/Constants';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private serviceRoute = `${environment.apiUrl}${API_BASE_URL}/transaction`;
  constructor(private http: HttpService) { }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.serviceRoute}/${id}`, {});
  }
  update(id, request: any): Observable<DataResponse<any>> {
    if (id) {
      return this.http.put<any>(
        `${this.serviceRoute}/${id}`,
        request,
        {}
      );
    } else {
      return this.http.post<any>(
        `${this.serviceRoute}`,
        request,
        {}
      );
    }
  }

  approve(request: any): Observable<DataResponse<any>> {
    return this.http.post<any>(
      `${this.serviceRoute}/approve`,
      request,
      {}
    );
  }


  reject(request: any): Observable<DataResponse<any>> {
    return this.http.post<any>(
      `${this.serviceRoute}/reject`,
      request,
      {}
    );
  }

  getDataImport(request): Observable<DataResponse<any>> {
    return this.http.postUpload<Array<File>>(`${this.serviceRoute}/import`, request);
  }

  saveDataImport(request: any): Observable<DataResponse<any>> {
    return this.http.post<any>(
      `${this.serviceRoute}/saveDataImport`,
      request,
      {}
    );
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.serviceRoute}/${id}`, {});
  }

}
