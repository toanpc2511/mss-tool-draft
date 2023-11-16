import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ErrorHandlerService} from './error-handler.service';
import {Response} from '../_models/response';
import {environment} from '../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  isExistIdentifyNumber2(uidName, uidValue): Promise<any> {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/gender/listAll`, {
        uidName,
        uidValue
      }).toPromise();
  }

  isExistIdentifyNumber(uidName, uidValue): any {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/customerSearch/searchCustomer`, {
        uidName,
        uidValue
      });

  }
}
