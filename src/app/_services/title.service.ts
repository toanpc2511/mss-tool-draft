import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { ErrorHandlerService } from "./error-handler.service";
@Injectable({ providedIn: 'root' })
export class TitleService {
     constructor(private http: HttpClient,
          private errorHandler: ErrorHandlerService) {
     }

     getlstTitle(obj: any): Observable<any> {
          return this.http.post<any>(`${environment.apiUrl}/admin/title/list`, obj).pipe(
               delay(600),
               map(data => {
                    return data
               }, catchError(this.errorHandler.handleError))
          )
     }
     deleteTitle(obj: any): Observable<any> {
          return this.http.post<any>(`${environment.apiUrl}/admin/title/delete`, obj).pipe(
               map(data => {
                    return data
               }, catchError(this.errorHandler.handleError))
          )
     }
     getAllTitle(): Observable<any> {
          return this.http.get<any>(`${environment.apiUrl}/admin/title/listAll`, { headers: { 'x-skip-spinner': 'true' }}).pipe(
               map(data => {
                    return data
               }, catchError(this.errorHandler.handleError))
          )
     }
     getAllBranch(obj: any): Observable<any> {
          return this.http.post<any>(`${environment.apiUrl}/admin/branch/list`, obj, { headers: { 'x-skip-spinner': 'true' }}).pipe(
               map(data => {
                    return data
               }, catchError(this.errorHandler.handleError))
          )
     }
     getLstAllBranch(): Observable<any> {
          return this.http.get<any>(`${environment.apiUrl}/admin/branch/listAll`).pipe(
               map(data => {
                    return data
               }, catchError(this.errorHandler.handleError))
          )
     }
     addTitle(obj: any) {
          return this.http.post<any>(`${environment.apiUrl}/admin/title/insert`, obj).pipe(
               map(data => {
                    return data
               }, catchError(this.errorHandler.handleError))
          )
     }
     detail(id: any) {
          return this.http.get<any>(`${environment.apiUrl}/admin/title/detail?id=` + id).pipe(
               map(data => {
                    return data
               }, catchError(this.errorHandler.handleError))
          )
     }
     updateTitle(obj: any) {
          return this.http.post<any>(`${environment.apiUrl}/admin/title/update`, obj).pipe(
               map(data => {
                    return data
               }, catchError(this.errorHandler.handleError))
          )
     }
}
