import { Injectable } from '@angular/core';
import { HttpService } from '../../../../shared/services/http.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICifInfo, ICifSearch, IDataCheckTrans, ITaxInfo, ITransactionPersonal } from '../interfaces/tax.interface';
import { environment } from 'src/environments/environment';
import { ECategoryType } from '../constants/tax.constant';

const TAX_SERVICE = 'tax-service';

@Injectable({
  providedIn: 'root'
})
export class TaxService {
  API_URL = `${environment.apiUrl}/${TAX_SERVICE}`;
  taxInfoSubject: BehaviorSubject<ITaxInfo> = new BehaviorSubject<ITaxInfo>(null);

  constructor(
    private http: HttpService
  ) {
  }

  getAccountCustomers(customerCifNumber: string, recordPerPage: number, pageNumber: number): Observable<any> {
    const params = { customerCifNumber, recordPerPage: `${recordPerPage}`, pageNumber: `${pageNumber}` };
    return this.http.get<ICifSearch[]>(`${this.API_URL}/cif/info`, { params });
  }

  searchTax(params: any): Observable<any> {
    return this.http.get<ITaxInfo[]>(`${this.API_URL}/tax`, { params });
  }

  checkChapter(params): Observable<any> {
    return this.http.get(`${this.API_URL}/tax/chapter/check`, { params });
  }

  searchCif(params: any): Observable<any> {
    return this.http.get<ICifInfo[]>(`${this.API_URL}/cif/info`, { params });
  }

  getBeneficiaryBanks(): Observable<any> {
    return this.http.get(`${this.API_URL}/tax/beneficiary-banks`, {});
  }

  getListCategory(category: ECategoryType): Observable<any> {
    const params = { categoryType: category }
    return this.http.get(`${this.API_URL}/category/all`, { params });
  }

  createTransactionPersonal(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}/transaction`, body, {});
  }

  createTransactionPersonalSelf(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}/transaction/self`, body, {});
  }

  detailTransactionPersonal(id: string): Observable<any> {
    return this.http.get<ITransactionPersonal>(`${this.API_URL}/transaction/${id}`, {});
  }

  approveTransactions(body: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/transaction/approve`, body, {});
  }

  rejectTransactions(body: any) {
    return this.http.put<any>(`${this.API_URL}/transaction/reject`, body, {})
  }

  reverseTransactions(body: any) {
    return this.http.post<any>(`${this.API_URL}/transaction/reverse`, body, {})
  }

  approveReverseTransactions(body: any): Observable<any>{
    return this.http.post<any>(`${this.API_URL}/transaction/reverse/approve`, body, {});
  }

  rejectReverseTransactions(body: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/transaction/reverse/reject`, body, {})
  }

  deleteTransactions(body: any) {
    return this.http.delete<any>(`${this.API_URL}/transaction`, {body})
  }

  checkStatusTransaction(body: {id: string}) {
    return this.http.post<IDataCheckTrans>(`${this.API_URL}/transaction/check/${body.id}`, body, {} );
  }

  checkStatusTranRevert(body: { id: string }) {
    return this.http.post<any>(`${this.API_URL}/transaction/revert/check/${body.id}`, body, {});
  }

  printReceiptPersonal(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/report/receipt/${id}`)
  }

  checkStatusTrans(id: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/transaction/check/${id}`, {}, {});
  }

  sendTransactionApprove(body: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/transaction/send`, body, {});
  }
}
