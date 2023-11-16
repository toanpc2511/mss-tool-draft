import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, pipe} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrossCheckingService {

  constructor( private http: HttpClient) { }

  listBranch(): Observable<any> {
    // không lấy PGD
    return this.http.get<any>(`${environment.apiUrl}/card/exportCard/branchListAll`).pipe(map((res: any) => {
      return res;
    }));
  }
  listAllBranch(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/crosschecking/branch`).pipe(map((res: any) => {
      return res;
    }));
  }
  // lấy danh sách thẻ
  listDetails(data: any): Observable<any> {
    console.log(JSON.stringify(data));
    return this.http.post<any>(`${environment.apiUrl}/crosschecking/bankpayment/getListCrossCheckingCore`, data)
      .pipe(map((res: any) => {
      return res;
    }));
  }
  // Lấy danh sách thẻ cần phê duyệt
  listNeedApproval(data: any): Observable<any> {
    console.log(JSON.stringify(data));
    return this.http.post<any>(`${environment.apiUrl}/crosschecking/bankpayment/getListCrossCheckingCorepPD`, data)
      .pipe(map((res: any) => {
      return res;
    }));
  }

  // xuất báo cáo
  listReport(data: any): Observable<any> {
    console.log(JSON.stringify(data));
    return this.http.post(`${environment.apiUrl}/crosschecking/report/export`, data, {
      observe: 'response',
      responseType: 'blob' as 'json',
      // headers: new HttpHeaders().append('Content-Tydpe', 'application/xml')
    });
  }
  // Đồng ý duyệt
  approveCard(id: string): Observable<any> {
    // console.log(JSON.stringify(id));
    return this.http.post(`${environment.apiUrl}/crosschecking/bankpayment/addCreditPayment`, id).pipe(map((res: any) => {
      return res;
    }));
  }
  // Từ chối duyệt
  refuseCard(id: string): Observable<any> {
    // console.log(JSON.stringify(id));
    return this.http.post(`${environment.apiUrl}/crosschecking/bankpayment/refuseCreditCard`, id).pipe(map((res: any) => {
      return res;
    }));
  }
  // Gạch nơ bổ sung
  updateStatusCard(id: string): Observable<any> {
    // console.log(JSON.stringify(id));
    return this.http.post(`${environment.apiUrl}/crosschecking/bankpayment/updateStatus`, id).pipe(map((res: any) => {
      return res;
    }));
  }
  // file SMS
  listReportSms(req): any {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    return this.http.post(`${environment.apiUrl}/crosschecking/report/smsReport`, req, httpOptions);
  }
}
