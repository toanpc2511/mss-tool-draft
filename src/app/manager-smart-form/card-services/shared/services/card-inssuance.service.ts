import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {
  GetCardEbsInfoRequest,
  SearchCardRequest, SendApproveInssuanceRequest,
} from '../models/card-inssuance';

@Injectable({
  providedIn: 'root'
})
export class CardInssuanceService {
  headers = new HttpHeaders({
    'x-skip-spinner': 'true'
  });

  constructor(private http: HttpClient) { }

  searchCustomerCards(request: SearchCardRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/searchCard`, request);
  }

  getCardEbsInfo(request: GetCardEbsInfoRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/searchEbs`, request);
  }

  allListEbs(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/listAllGDV`, request);
  }

  deleteRequest(request): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/delete`, request);
  }

  sendApprove(request): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/sendApproveEbs`, request);
  }

  exportBBBGT(request): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json',
      // headers: this.headers // => disable intercepter
    };
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/exportBbbgt`, request, httpOptions);
  }

  exportBBTGT(request): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/exportBbtgt`, request, httpOptions);
  }

  exportYCTGKHCN(request): Observable<any> {
    const httpOptions = {
      responseType: 'blob' as 'json',
    };
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/exportYctgkhcn`, request, httpOptions);
  }

  sendApproveInsuance(request: SendApproveInssuanceRequest): Observable<any> {
    const formRequest = new FormData();
    formRequest.append('dto', new Blob([JSON.stringify(request.dto)], {
      type: 'application/json',
    }));
    // @ts-ignore
    formRequest.append('file', request.file);
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/sendApproveEbs`, formRequest);
  }
}
