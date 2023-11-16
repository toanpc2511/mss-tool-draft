import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { Response, ResponseStatus } from '../_models/response';
import { environment } from '../../environments/environment';
import { catchError, map, delay } from 'rxjs/operators';
import { Observable } from "rxjs";
import { ProcessResponse } from '../_models/response';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {
  }
  // api lấy danh sách thẻ chính
  getListCard(obj: any): Observable<any> {
    return this.http
      .post<Response>(`${environment.apiUrl}/card/card/listAll`, obj)
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }
  // lấy danh sách thẻ phụ
  getListSupCard(cardId: string) {
    return this.http
      .post<Response>(`${environment.apiUrl}/card/supCard/listAll`, { cardId: cardId })
      .pipe(
        delay(600),
        map(data => {
          return data
        }, catchError(this.errorHandler.handleError)));
  }
  getAccountList(obj: any) {
    return this.http
      .post<any>(`${environment.apiUrl}/account/account/list`, obj)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getAccountAuthors(accountId: string) {
    return this.http
      .post<Response>(`${environment.apiUrl}/account/accountAuthor/list`, { accountId: accountId })
      .pipe(
        delay(600),
        map(data => {
          return data
        }, catchError(this.errorHandler.handleError)));
  }
  getCardByAccount(accountId: string) {
    return this.http
      .post<Response>(`${environment.apiUrl}/card/card/listByAccount`, { accountId: accountId })
      .pipe(
        delay(600),
        map(data => {
          return data
        }, catchError(this.errorHandler.handleError)));
  }
  detailProcess(processId: string): any {
    return this.http
      .post<ProcessResponse>(`${environment.apiUrl}/process/process/detail`, { id: processId })
      .pipe(
        delay(600), map(data => {
          return data;
        }, catchError(this.errorHandler.handleError)));
  }
  list(accountId: string, processId: string) {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/customer/listCoowner`, { accountId, processId })
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)));
  }
  getFileReport(): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    return this.http.get(`${environment.apiUrl}/printout/report/viewHelp`, { headers: headers, responseType: "blob" });
  }
  getFileReportViewProcess(processId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('processId', processId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewProcess`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewCoOwner(customerId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('customerId', customerId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewCoOwner`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewCoOwnerDoc(customerId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "text/html");
    let params = new HttpParams()
      .set('customerId', customerId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewCoOwnerDoc`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewCoOwnerSV(customerId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('customerId', customerId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewCoOwnerSV`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewCoOwnerSVDoc(customerId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "text/html");
    let params = new HttpParams()
      .set('customerId', customerId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewCoOwnerSVDoc`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAccount(processId: string, accountId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccount`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAccountDoc(processId: string, accountId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountDoc`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAccountNoAuthor(processId: string, accountId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountNoAuthor`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAccountSV(processId: string, accountId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountSV`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAccountSVDoc(processId: string, accountId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountSVDoc`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportAccountUpdate(processId: string, accountId: string, customerCode: string, supCardId: string, accountIdTemp: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId)
      .set('customerCode', customerCode)
      .set('supCardId', supCardId)
      .set('accountIdTemp', accountIdTemp);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountUpdate`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportAccountUpdateThe(processId: string, accountId: string, customerCode: string, supCardId: string, accountIdTemp: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId)
      .set('customerCode', customerCode)
      .set('supCardId', supCardId)
      .set('accountIdTemp', accountIdTemp);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountUpdateThe`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportAccountUpdateDocThe(processId: string, accountId: string, customerCode: string, supCardId: string, accountIdTemp: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId)
      .set('customerCode', customerCode)
      .set('supCardId', supCardId)
      .set('accountIdTemp', accountIdTemp);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountUpdateDocThe`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportAccountUpdateDocTK(processId: string, accountId: string, customerCode: string, supCardId: string, accountIdTemp: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "text/html");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId)
      .set('customerCode', customerCode)
      .set('supCardId', supCardId)
      .set('accountIdTemp', accountIdTemp);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountUpdateDocTK`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportAccountUpdateDoc(processId: string, accountId: string, customerCode: string, supCardId: string, accountIdTemp: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "text/html");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId)
      .set('customerCode', customerCode)
      .set('supCardId', supCardId)
      .set('accountIdTemp', accountIdTemp);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountUpdateDoc`, { params: params, headers: headers, responseType: "blob" });
  }

  getFileOpenPaymentAccount() {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");;
    return this.http.get(`${environment.apiUrl}/printout/report/viewOpenPaymentAccount`, { headers: headers, responseType: "blob" });
  }
  getFileOpenDebitAccount() {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");;
    return this.http.get(`${environment.apiUrl}/printout/report/viewOpenDebitAccount`, { headers: headers, responseType: "blob" });
  }
  getFileOpenLV() {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");;
    return this.http.get(`${environment.apiUrl}/printout/report/viewOpenLV`, { headers: headers, responseType: "blob" });
  }
  getFileOpenIBank(processId: string, reportType: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");;
    let params = new HttpParams()
      .set('processId', processId)
      .set('report-type', reportType);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccount`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAuthor(processId: string, accountId: string, accountAuthorId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");;
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId)
      .set('accountAuthorId', accountAuthorId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountUQ`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAuthorDoc(processId: string, accountId: string, accountAuthorId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "text/html");;
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId)
      .set('accountAuthorId', accountAuthorId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountUQDoc`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAccountCSH(processId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");;
    let params = new HttpParams()
      .set('processId', processId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountCSH`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAccountCSHDoc(processId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "text/html");;
    let params = new HttpParams()
      .set('processId', processId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountCSHDoc`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAccountTTPL(processId: string, legalId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");;
    let params = new HttpParams()
      .set('processId', processId)
      .set('legalId', legalId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountTTPL`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAccountTTPLDoc(processId: string, legalId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "text/html");;
    let params = new HttpParams()
      .set('processId', processId)
      .set('legalId', legalId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountTTPLDoc`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAccountGuardian(processId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");;
    let params = new HttpParams()
      .set('processId', processId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountDDPL`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewAccountGuardianDoc(processId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "text/html");;
    let params = new HttpParams()
      .set('processId', processId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountDDPLDoc`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewDSH(processId: string, accountId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "application/json");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountDSH`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileReportViewDSHDoc(processId: string, accountId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "text/html");
    let params = new HttpParams()
      .set('processId', processId)
      .set('accountId', accountId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewAccountDSHDoc`, { params: params, headers: headers, responseType: "blob" });
  }
  getFileView() {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "text/html");
    return this.http.get(`${environment.apiUrl}/printout/report/viewDoc`, { headers: headers, responseType: "blob" });
  }
  getFileViewDoc(processId: string) {
    let headers = new HttpHeaders();
    headers.set("Content-Type", "text/html");
    let params = new HttpParams()
      .set('processId', processId);
    return this.http.get(`${environment.apiUrl}/printout/report/viewProcessDoc`, { params: params, headers: headers, responseType: "blob" });
  }
}
