import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Response, ResponseStatus } from '../_models/response';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { ApprovableProcess } from '../_models/process';

@Injectable({
  providedIn: 'root'
})
export class ApprovalCifService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService)
    { }

  // tslint:disable-next-line:typedef
  approval(id: string) {
    return this.http.post<ResponseStatus>(`${environment.apiUrl}/process/process/approveOne`, { id })
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  sendApprove(obj: any) {
    return this.http.post<ResponseStatus>(`${environment.apiUrl}/process/process/sendApprove`, obj)
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  sendApproveOne(obj: any) {
    return this.http.post<ResponseStatus>(`${environment.apiUrl}/process/process/sendApproveOne`, obj)
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }


  // tslint:disable-next-line:typedef
  approvalAll(processId) {
    return this.http.post<ResponseStatus>(`${environment.apiUrl}/process/process/approveAll`, { id: processId })
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  refuse(approvableProcess: ApprovableProcess) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/indivProcess/refuseCif`, approvableProcess)
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  approverClose(approvableProcess: ApprovableProcess) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/indivProcess/approverClose`, approvableProcess)
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  inputterClose(approvableProcess: ApprovableProcess) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/indivProcess/inputterClose`, approvableProcess)
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  getRegistrableServiceList(processId: string) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/processIntegrated/listAll`, { processId })
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  getNoteServiceList(integratedId: string) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/integrated/integratedStatus`, { integratedId })
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  sendModify(obj: any) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/process/sendModify`, obj)
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  sendModifyOne(obj: any) {
    return this.http.post<ResponseStatus>(`${environment.apiUrl}/process/process/sendModifyOne`, obj)
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }

  // tslint:disable-next-line:typedef
  sendReject(obj: any) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/process/sendReject`, obj)
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  sendClose(processId) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/process/sendCancel`, { id: processId })
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  sendRejectOne(obj: any) {
    return this.http
      .post<ResponseStatus>(`${environment.apiUrl}/process/process/sendRejectOne`, obj)
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
}
