import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {catchError, delay, map} from 'rxjs/operators';
import {ErrorHandlerService} from "./error-handler.service";
import {Response} from "../_models/response";
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FunctionService {
  httpOptions = {};
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {}
  getAll() {
    return this.http
      .get<Response>(`${environment.apiUrl}/admin/function/listAll`, { headers: { 'x-skip-spinner': 'true' }})
      .pipe(data => data, catchError(this.errorHandler.handleError));
  }

  getAllFunction(obj:any) {
    return this.http
      .post<any>(`${environment.apiUrl}/admin/function/list`,obj)
      .pipe(delay(2000),
        catchError(this.errorHandler.handleError));
  }

  createOrUpdate(obj: any) {
    return this.http.post<any>(`${environment.apiUrl}/admin/function/insertOrUpdate`, obj).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  delete(id): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/function/delete`, id).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

}
