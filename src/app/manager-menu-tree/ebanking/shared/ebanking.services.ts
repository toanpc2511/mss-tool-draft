import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Response } from 'src/app/_models/response';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class EbankingService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }
  dto = {}
  //Dịch vụ của Loại User
  ebankUserType(): Observable<any> {    
    return this.http.post<Response>(`${environment.apiUrl}/ebank/ebankUserType/listAll`, this.dto)
  }
  //Dịch vụ của Gói dịch vụ
  ebankPackage(): Observable<any> {
    return this.http.post<Response>(`${environment.apiUrl}/ebank/ebankPackage/listAll`, this.dto)
  }
  //Dịch vụ của Phương thức xác thực
  ebankDeviceType(): Observable<any> {
    return this.http.post<Response>(`${environment.apiUrl}/ebank/ebankDeviceType/listAll`, this.dto)
  }
  //thêm mới

  create(obj:any) {
    return this.http
      .post<Response>(`${environment.apiUrl}/ebank/ebank/create`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }
  //cập nhật
  update(obj) {
    return this.http
      .post<Response>(`${environment.apiUrl}/ebank/ebank/update`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }
  //danh sách toàn bộ bản ghi
  listAll(obj:any) {
    return this.http
      .post<Response>(`${environment.apiUrl}/ebank/ebank/listAll`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }
  //xóa toàn bộ bản ghi
  delete(id) {
    return this.http
      .post<Response>(`${environment.apiUrl}/ebank/ebank/delete`, {id})
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }
  // lấy chi tiết bản ghi 
  detail(id) {
    return this.http
      .post<Response>(`${environment.apiUrl}/ebank/ebank/detail`, {id})
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }
}
