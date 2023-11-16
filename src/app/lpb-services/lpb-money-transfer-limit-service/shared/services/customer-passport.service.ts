import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpService} from '../../../../shared/services/http.service';
import {Observable} from 'rxjs';
import {DataResponse} from '../../../../shared/models/data-response.model';
import {API_BASE_URL} from '../constants/Constants';

@Injectable({
  providedIn: 'root'
})
export class CustomerPassportService {
  private serviceRoute = `${environment.apiUrl}${API_BASE_URL}/customer-passport`;
  constructor(private http: HttpService) { }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.serviceRoute}/${id}`, {});
  }
  createOrUpdate(id, request: any): Observable<DataResponse<any>> {
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

}
