import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {catchError, delay, map} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';
import {ErrorHandlerService} from './error-handler.service';

@Injectable({providedIn: 'root'})
export class UdfCifService {
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  dto = {};

  getAllUdfCifTracuuTtstkwebViviet(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfTracuuTtstkwebViviet/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifComboSanPham2018(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfComboSanPham2018/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifMaCbnvLpb(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfMaCbnvLpb/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifDiaBanNongThon(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfDiaBanNongThon/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifKhoiDonViGioiThieu(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfKhoiDonViGioiThieu/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifDinhdanh(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfCifDinhdanh/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifGroupCode(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfGroupCode/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifCongTyNhaNuoc(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfCongTyNhaNuoc/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifDbKhVay(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfDbKhVay/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCnUtpt1483Cif(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfCnUtpt1483Cif/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifLvUdCnCaoCif(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfLvUdCnCaoCif/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifKhut(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfKhut/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifThuongTat(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfThuongTat/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifLoaiChuongTrinh(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfLoaiChuongTrinh/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifKhachHang(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfKhachHang/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifTcKTctd(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfTcKTctd/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifMaTctd(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfMaTctd/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifViTriToLketVayvon(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfViTriToLketVayvon/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifMaHuyenThiXa(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfMaHuyenThiXa/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfCifPnkh(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfCifPnkh/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfBranch(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/process/userView/branchListAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  getAllUdfNhanHddtQuaMail(): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/udfNhanHddtQuaMail/listAll`, this.dto).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }
}
