import {Injectable} from '@angular/core';
import {HttpService} from '../../../../shared/services/http.service';
import {Observable} from 'rxjs';
import {DataResponse} from '../../../../shared/models/data-response.model';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobrunrService {

  constructor(private http: HttpService) {
  }

  triggerRecurringJob(id: string, serviceName: string): Observable<DataResponse<any>> {
    return this.http.post<any>(
      `${environment.apiUrl}/${serviceName}/jobrunr/recurring-jobs/${id}`,
      {},
      {}
    );
  }
}
