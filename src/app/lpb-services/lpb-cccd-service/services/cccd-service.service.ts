import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {API_BASE_URL} from '../../lpb-money-transfer-limit-service/shared/constants/Constants';
import {HttpService} from '../../../shared/services/http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CccdServiceService {

  private serviceRoute = `${environment.apiUrl}/cccd-service/api/cccds/detail`;
  constructor(private http: HttpService) { }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.serviceRoute}?id=${id}`, {});
  }
}
