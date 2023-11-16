import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';
import { SingleResponse } from '../_models/response';
import { Observable } from 'rxjs';
import { AnySoaRecord } from 'dns';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  numberChars = new RegExp('[^0-9]', 'g');
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  getAccountList(obj: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/account/account/list`, obj)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getAccountLinkList(obj: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/account/account/accountLinkList`, obj)
      .pipe(catchError(this.errorHandler.handleError));
  }
  getLstAllCurrency(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/account/currency/listAll`)
      .pipe(catchError(this.errorHandler.handleError));
  }
  // loại tài khoản
  getLstAccountProduct(obj?: any): Observable<any> {
    return this.http
      .post<AnySoaRecord>(`${environment.apiUrl}/account/accountProduct/listAll`, obj)
      .pipe(catchError(this.errorHandler.handleError));
  }
  // mã tài khoản
  getLstAccountClass(obj?: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/account/accountClass/listAll`, obj)
      .pipe(catchError(this.errorHandler.handleError));
  }
  // số dư tối thiểu
  getAccountMinBal(): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/account/accountMinBal/listAll`)
      .pipe(catchError(this.errorHandler.handleError));
  }
  createAccount(obj: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/account/account/create`, obj)
      .pipe(catchError(this.errorHandler.handleError));
  }
  getDetailAccount(obj: any): Observable<any> {
    return this.http
      .post<SingleResponse>(`${environment.apiUrl}/account/account/detail`, obj)
      .pipe(catchError(this.errorHandler.handleError));
  }
  updateAccount(obj: any): Observable<any> {
    return this.http
      .post<SingleResponse>(`${environment.apiUrl}/account/account/update`, obj)
      .pipe(catchError(this.errorHandler.handleError));
  }
  deleteAccount(obj: any): Observable<any> {
    return this.http
      .post<SingleResponse>(`${environment.apiUrl}/account/account/delete`, obj)
      .pipe(catchError(this.errorHandler.handleError));
  }
  minBalanceBuilder(val: string): string {
    if (typeof (val) === 'string') {
      return `${Number(val.replace(this.numberChars, ''))} `;
    } else {
      return `${val}`;
    }
  }

}
