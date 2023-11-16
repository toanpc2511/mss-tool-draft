import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {HttpService} from '../../../../shared/services/http.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class CreditCardService {
  header: any;
  userInfo: any;
  now = moment().valueOf();

  constructor(private http: HttpService) {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.header = {
      ...this.header,
      clientMessageId: `${this.userInfo.userName}-${this.now}`
    };
  }

  getAllInformation(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/credit-card-service/credit-card/search`, request, {}).pipe(map((res: any) => {
      return res;
    }));
  }
  approveLv1(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/credit-card-service/credit-card/approveLv1`, request, {}).pipe(map((res: any) => {
      return res;
    }));
  }
  approveLv2(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/credit-card-service/credit-card/approveLv2`, request, {}).pipe(map((res: any) => {
      return res;
    }));
  }
  getHistory(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/credit-card-service/credit-card/history`, request, {}).pipe(map((res: any) => {
      return res;
    }));
  }
  sendApprove(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/credit-card-service/credit-card/sendApprove`, request, {}).pipe(map((res: any) => {
      return res;
    }));
  }
  getSumary(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/credit-card-service/credit-card/listSummary`, request, {}).pipe(map((res: any) => {
      return res;
    }));
  }
  findAllRecords(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/credit-card-service/credit-card/findAll`, request, {}).pipe(map((res: any) => {
      return res;
    }));
  }
  sendModify(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/credit-card-service/credit-card/sendModify`, data, {}).pipe(map((res: any) => {
      return res;
    }));
  }
  getDetail(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/credit-card-service/credit-card/${id}`, {}).pipe(map((res: any) => {
      return res;
    }));
  }

}
