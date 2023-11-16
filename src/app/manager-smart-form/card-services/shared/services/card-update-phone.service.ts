import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {
  ApproveOrRejectRequest,
  GetListApproveRequest,
  GetListUserByBranchRequest,
  SearchCustomerRequest,
  SendApproveRequest
} from '../models/card-update-phone-number';

@Injectable({
  providedIn: 'root'
})
export class CardUpdatePhoneService {

  constructor(private http: HttpClient) {
  }

  searchCustomerSVBO(request: SearchCustomerRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/svboService/search`, request).pipe(map((res: any) => {
      return res;
    }));
  }

  sendApproveUpdatePhoneSVBO(request: SendApproveRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/svboService/sendApprove`, request).pipe(map((res: any) => {
      return res;
    }));
  }

  getListApproveUpdatePhoneSVBO(request: GetListApproveRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/svboService/listAllApprove`, request).pipe(map((res: any) => {
      return res;
    }));
  }

  approveRequestUpdatePhoneSVBO(request: ApproveOrRejectRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/svboService/approve`, request).pipe(map((res: any) => {
      return res;
    }));
  }

  rejectRequestUpdatePhoneSVBO(request: ApproveOrRejectRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/svboService/reject`, request).pipe(map((res: any) => {
      return res;
    }));
  }
}
