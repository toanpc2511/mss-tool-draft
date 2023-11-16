import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ErrorHandlerService} from './error-handler.service';
import {CifCondition, CifCondition1, IndividualCif, LstCifProcess} from '../_models/cif';
import {ProcessResponse, Response} from '../_models/response';
import {environment} from '../../environments/environment';
import {catchError, map, delay} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) {
  }

  openCif(userCif: IndividualCif): any {
    return this.http.post<Response>(`${environment.apiUrl}/process/indivProcess/openIndivCIF`, userCif)
      .pipe(map(data => {
          return data;
        }
        , catchError(this.errorHandler.handleError)));

  }

  FatCaForm(obj: any): any{
    return this.http.post<Response>(`${environment.apiUrl}/process/fatcaForm/listAll`, obj)
    .pipe(map(data => {
      return data;
    },
    catchError(this.errorHandler.handleError)));
  }

  updateCif(userCif: IndividualCif): any {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/process/update`, userCif)
      .pipe(map(data => {
          return data;
        }
        , catchError(this.errorHandler.handleError)));

  }

  getCifProcessList(condition: LstCifProcess): any {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/process/list`, condition)
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }

  regiserCif(obj: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/process/process/openCIF`, obj).pipe(
      map(data => {
        return data;
      }, catchError(this.errorHandler.handleError))
    );
  }

  //
  getCifList(condition: CifCondition): any {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/process/list`, condition)
      //.post<Response>(`${environment.apiUrl}/process/process/listSearch`, condition)
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }

  getCifListProcess(condition: CifCondition1): any {
    return this.http
      //.post<Response>(`${environment.apiUrl}/process/process/list`, condition)
      .post<Response>(`${environment.apiUrl}/process/process/listSearchKSV`, condition)
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }

 
  findCif(uidValue, type, cif, phone): any {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/customerSearch/searchCustomer`, {
        uidName: type,
        uidValue,
        cif,
        phone
      })
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }

  getProcessId(cif): any {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/customerESB/getCustomerProcess`, {cif})
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }

  getCustomerInfo(cif): any {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/customerESB/getCustomerInfo`, {cif})
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }

  //
  deleteProcess(processId: string): any {
    return this.http
      .delete<Response>(`${environment.apiUrl}/process/process/${processId}`, )
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
    // .subscribe(
    //   data => this.errorHandler.messageHandler(data.responseStatus, 'Xóa hồ sơ thành công!')
    //   ,error => {
    //     this.errorHandler.showError(error)
    //   }
    // )
  }

  detailProcess(processId: string): any {
    return this.http
      .post<ProcessResponse>(`${environment.apiUrl}/process/process/detail`, {id: processId})
      .pipe(
        delay(600), map(data => {
          return data;
        }, catchError(this.errorHandler.handleError)));
  }

  unlockUpdate(processId: string): any{
    return this.http
    .post<ProcessResponse>(`${environment.apiUrl}/process/process/unlockUpdate`, {id: processId})
    .pipe(
      delay(600), map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }

  detailCustomer(processId: string): any {
    return this.http
      .get<ProcessResponse>(`${environment.apiUrl}/process/indivProcess/customer/${processId}`)
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }

  detailCustomer2(id: string): any {
    return this.http
      .get<ProcessResponse>(`${environment.apiUrl}/process/customer/${id}`)
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }
}
