import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ErrorHandlerService} from './error-handler.service';
import {ProcessResponse, Response, ResponseStatus} from '../_models/response';
import {environment} from '../../environments/environment';
import {catchError, delay, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoOwnerAccountService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  // tslint:disable-next-line:typedef
  create(obj) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/customer/createCoowner`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)));
  }

  detailCoOwner(id: string): any {
    return this.http
      .post<ProcessResponse>(`${environment.apiUrl}/process/customer/detailCoowner`, {id})
      .pipe(
        delay(600), map(data => {
          return data;
        }, catchError(this.errorHandler.handleError)));
  }

  // tslint:disable-next-line:typedef
  detail(accountId: string) {
    return this.http
      .get<ResponseStatus>(`${environment.apiUrl}/account/co-owner/${accountId}`)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)));
  }

  // tslint:disable-next-line:typedef
  update(data) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/customer/updateCoowner`, data)
      // tslint:disable-next-line:no-shadowed-variable
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)));
  }

  // tslint:disable-next-line:typedef
  list(accountId: string, processId: string) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/customer/listCoowner`, {accountId, processId})
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)));
  }

  // tslint:disable-next-line:typedef
  delete(id: string) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/customer/deleteCoowner`, {id})
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)));
  }

}
