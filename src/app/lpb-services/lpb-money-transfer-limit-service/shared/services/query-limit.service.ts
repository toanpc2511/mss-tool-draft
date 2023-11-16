import {Injectable} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpService} from '../../../../shared/services/http.service';
import {Observable} from 'rxjs';
import {DataResponse} from '../../../../shared/models/data-response.model';
import {API_BASE_URL} from '../constants/Constants';

@Injectable({
  providedIn: 'root'
})
export class QueryLimitService {
  private serviceRoute = `${environment.apiUrl}${API_BASE_URL}/query-limit`;

  constructor(private http: HttpService) {
  }

  queryLimit(params): Observable<any> {
    return this.http.get<any>(`${this.serviceRoute}`, {params});
  }

}
