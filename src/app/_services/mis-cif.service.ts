import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ErrorHandlerService } from './error-handler.service';
@Injectable({ providedIn: 'root' })
export class MisCifService {
    constructor(
        private http: HttpClient,
        private errorHandler: ErrorHandlerService) {
    }
    dto = {};
    getAllMisCifLoai(dto: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misCifLoai/listAll`, dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifLHKT(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misCifLhkt/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifTPKT(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misCifTpkt/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifTCTD(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misCifTctd/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifKBHTG(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misCifKbhtg/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifLHNNNTVAY(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misLhnnntvay/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifTDMANKT(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misTdMankt/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAlMisCifNGANH(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misCifNganh/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifKH78(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misCifKh78/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifPNKH(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misCifPnkh/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifComTSCT(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misComTsct/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifDCGH(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misDcGh/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifHHXNK(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misHhxnk/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifLoaiDN(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misLoaiDn/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }
    getAllMisCifMANKT(): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/process/misCifMankt/listAll`, this.dto).pipe(
            map(data => {
                return data;
            }, catchError(this.errorHandler.handleError))
        );
    }

}
