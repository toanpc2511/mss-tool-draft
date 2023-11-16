import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Response } from '../_models/response';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { AuthorityModel } from '../_models/authority';

@Injectable({
  providedIn: 'root'
})
export class AuthorityAccountService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  createAuthority(obj: AuthorityModel) {
    return this.http
      .post<Response>(`${environment.apiUrl}/account/accountAuthor/create`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }
  updateAuthority(obj: AuthorityModel) {
    return this.http
      .post<Response>(`${environment.apiUrl}/account/accountAuthor/update`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }
  delete(obj: any) {
    return this.http
      .post<Response>(`${environment.apiUrl}/account/accountAuthor/delete`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }
  getDetailAuthority(id:any){
    return this.http
    .post<Response>(`${environment.apiUrl}/account/accountAuthor/detail`, id)
    .pipe(map(data => data
      , catchError(this.errorHandler.handleError)))
  }
  list(obj) {

  }
}
