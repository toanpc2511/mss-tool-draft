import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
  EbsServicesApproveRequest,
  EbsServicesRejectRequest,
  SearchListEbsServicesApproveRequest
} from '../models/card-services-approve';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CardEbsServicesApproveService {
  constructor(private http: HttpClient) { }

  searchListEbsServicesApprove(request: SearchListEbsServicesApproveRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/listAllApprove`, request);
  }

  approveEbsServices(request: EbsServicesApproveRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/approve`, request);
  }

  rejectEbsServices(request: EbsServicesRejectRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/reject`, request);
  }

  searchListApproveKSV(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/listAllKSV`, request);
  }

  searchListApproveNHS(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/listAllNHS`, request);
  }
}

