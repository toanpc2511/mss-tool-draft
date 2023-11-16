import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import {ErrorHandlerService} from "./error-handler.service";
@Injectable({ providedIn: 'root' })
export class RoleService {
    constructor(private http: HttpClient,
                private errorHandler: ErrorHandlerService) {
    }

    getAllRoles(titleCode: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/role/list`, titleCode).pipe(
             delay(600),
           map(data =>{
                return data
           },catchError(this.errorHandler.handleError))
        )
    }
    deleteRole(obj: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/role/delete`, obj).pipe(
             map(data => {
                  return data
             }, catchError(this.errorHandler.handleError))
        )
   }
    getLstAllRoles(): Observable<any> {
        return this.http.get<any>(`${environment.apiUrl}/admin/role/listAll`).pipe(
           map(data =>{
                return data
           },catchError(this.errorHandler.handleError))
        )
    }

    updateRole(role: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/role/update`, role).pipe(
           map(data =>{
                return data
           },catchError(this.errorHandler.handleError))
        )
    }

    insertRole(role: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/role/insert`, role).pipe(
           map(data =>{
                return data
           },catchError(this.errorHandler.handleError))
        )
    }

    mapAction(role: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/admin/role/mapAction`, role).pipe(
           map(data =>{
                return data
           },catchError(this.errorHandler.handleError))
        )
    }

  mapActionNew(role: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/admin/role/mapActionNew`, role).pipe(
      map(data =>{
        return data
      },catchError(this.errorHandler.handleError))
    )
  }
}
