import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SmsCreateInputDTO } from 'src/app/_models/sms/SmsCreateInputDTO';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SmsService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }
  dto={}
//Dịch vụ của Trạng thái SMS
  getSmsStatus():Observable<any> {
    return this.http.post<Response>(`${environment.apiUrl}/ebank/smsStatus/listAll`, this.dto)
  }

  searchSmsNotiStatus(accountNo): Observable<any> {
    return this.http.get(`${environment.apiUrl}/lvbis-service/sms-notification?accountNo=` + accountNo);
  }

  //Dịch vụ của Chức năng với SMS
  getSmsAction():Observable<any> {
    return this.http.post<Response>(`${environment.apiUrl}/ebank/smsAction/listAll`, this.dto)
  }
// Dịch vụ của Gói dịch vụ SMS
 getSmsPackage():Observable<any> {
    return this.http.post<Response>(`${environment.apiUrl}/ebank/smsPackage/listAll`, this.dto)
  }
  // Dịch vụ của Cấu hình dịch vụ SMS sử dụng trên các tài khoản
  getSmsAccount():Observable<any> {
    return this.http.post<Response>(`${environment.apiUrl}/ebank/smsAccount/listAll`, this.dto)
  }
// them moi
  createCSms(obj: SmsCreateInputDTO) {
    return this.http
      .post<Response>(`${environment.apiUrl}/ebank/sms/create`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)))
  }
//xoa
  delete(id: string) {
    return this.http.post<Response>(`${environment.apiUrl}/ebank/sms/delete`, { id })
      .pipe(map(data => {
        // console.log(data);
        return data
      }
        , catchError(this.errorHandler.handleError)))
  }
  //sua
  uptdateSms(id: string) {
    return this.http.post<Response>(`${environment.apiUrl}/ebank/sms/update`, { id })
      .pipe(map(data => {
        // console.log(data);
        return data
      }
        , catchError(this.errorHandler.handleError)))
  }
  // detail
  detail(id: string) {
    return this.http.post<Response>(`${environment.apiUrl}/ebank/sms/detail`, { id })
      .pipe(map(data => {
        // console.log(data);
        return data
      }
        , catchError(this.errorHandler.handleError)))
  }
}
