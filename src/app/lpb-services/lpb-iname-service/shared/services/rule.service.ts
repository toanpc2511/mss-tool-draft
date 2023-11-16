import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpService} from '../../../../shared/services/http.service';
import {Observable} from 'rxjs';
import {Deposit} from '../../../lpb-deposit-service/shared/models/deposit';
import {DataResponse} from '../../../../shared/models/data-response.model';

@Injectable({
  providedIn: 'root'
})
export class RuleService {
  private serviceRoute = `${environment.apiUrl}/iname-service/rule`;
  constructor(private http: HttpService) { }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.serviceRoute}/${id}`, {});
  }

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


}