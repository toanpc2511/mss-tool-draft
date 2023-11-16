import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User, UserInfo} from '../_models/user';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {catchError, delay, map} from 'rxjs/operators';
import {ErrorHandlerService} from './error-handler.service';
import {Response} from '../_models/response';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  getAllUsers(): Observable<any> {

    return this.http.get<any>(`${environment.apiUrl}/process/userView/userListAll`).pipe(
      delay(600),
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getUserByBranch(req: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/userView/userListAll`, req).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUsersByCondition(obj: any): Observable<any> {

    return this.http.post<any>(`${environment.apiUrl}/admin/user/list`, obj).pipe(
      delay(600),
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  syncUserToRedis(type): Observable<any> {

    return this.http.get<any>(`${environment.apiUrl}/admin/${type}/syncToRedis`).pipe(
      delay(600),
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  deleteUser(id: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/user/delete`, id).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  lockUser(id: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/user/lock`, id).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  unlockUser(id: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/user/unlock`, id).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  detail(id: any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/user/detail?id=` + id).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  addUser(user: UserInfo): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/admin/user/insert`, user)
      .pipe(
        map((data) => {
          return data;
        }, catchError(this.errorHandler.handleError))
      );
  }

  update(user: UserInfo): Observable<any> {
    return this.http
      .post<Response>(`${environment.apiUrl}/admin/user/update`, user)
      .pipe(
        map((data) => {
          return data;
        }, catchError(this.errorHandler.handleError))
      );
  }

  getAllUser(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/user/listAll`).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  mappingUserToRole(request: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/admin/user/mapping-user-role`, request)
      .pipe(
        map((data) => {
          return data;
        }, catchError(this.errorHandler.handleError))
      );
  }

}
