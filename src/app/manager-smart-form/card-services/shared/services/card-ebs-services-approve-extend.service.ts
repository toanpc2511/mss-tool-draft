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
export class CardEbsServicesApproveExtendService {
  constructor(private http: HttpClient) { }

  searchListEbsServicesApprove(request: SearchListEbsServicesApproveRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/cardCore/listAllApprove`, request);
  }

  approveExtendRequest(request: EbsServicesApproveRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/cardCore/approve`, request);
  }

  approveEbsServices(request: EbsServicesApproveRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/approve`, request);
  }

  rejectEbsServices(request: EbsServicesRejectRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/ebsService/reject`, request);
  }

  rejectCardCore(request: EbsServicesRejectRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/cardCore/reject`, request);
  }
  getDetailLktk(request): Observable<any> {
    return  this.http.post<any>(`${environment.apiUrl}/card/cardCore/detailLktk`, request);
  }
}

