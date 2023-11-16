import { IAutoPayment, IBodyCancelAutoPaySignUp, IStatusTransactionReject } from './../models/water.interface';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IBills, ICifSearch, IResCancelTransaction, IResCheckTrans, IResCreateChangeDebts, IResTransactionApprove, IResTransactionReject, ISupplier, ITransaction } from '../models/water.interface';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
export const WATER_SERVICE = 'water-service';

@Injectable({
  providedIn: 'root'
})
export class WaterService {
  API_URL = `${environment.apiUrl}/${WATER_SERVICE}`;
  transactionApproveSubject = new BehaviorSubject([]);

  constructor(private http: HttpService) { }

  getBills(customerId: string, serviceType: string, supplierCode: string) {
    let params = { customerId: customerId, serviceType: serviceType, supplierCode: supplierCode }
    return this.http.get<IBills[]>(`${this.API_URL}/search/debt-bills`, { params: params });
  }

  getSupplierFromCode(code: string) {
    return this.http.get<ISupplier>(`${this.API_URL}/supplier/code/${code}`, {});
  }

  getAccountCustomers(customerCifNumber: string, recordPerPage: number, pageNumber: number) {
    let params = { customerCifNumber: customerCifNumber, recordPerPage: `${recordPerPage}`, pageNumber: `${pageNumber}` }
    return this.http.get<ICifSearch[]>(`${this.API_URL}/cif/info`, { params: params });
  }

  createPaymentBill(body: any) {
    return this.http.post<ITransaction>(`${this.API_URL}/transaction`, body, {});
  }

  editTransaction(body: any, id: string) {
    return this.http.put<ITransaction>(`${this.API_URL}/transaction/${id}`, body, {});
  }

  cancelTransaction(body) {
    return this.http.delete<IResCancelTransaction>(`${this.API_URL}/transaction`, { body });
  }

  getListSupplierActive() {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '9999')
      .set('filter', 'status|eq|ACTIVE')
      .set('sort', 'supplierName:ASC')
    return this.http.get<ISupplier[]>(`${this.API_URL}/supplier`, {
      params: params
    });
  }
  getDetailTransaction(id: string) {
    return this.http.get<ITransaction>(`${this.API_URL}/transaction/${id}`, {})
  }

  approveTransactions(body) {
    return this.http.post<IResTransactionApprove>(`${this.API_URL}/transaction/approve`, body, {})
  }
  rejectTransactions(body) {
    return this.http.put<IResTransactionReject>(`${this.API_URL}/transaction/reject`, body, {})
  }

  approveChangeDebtTrans(body) {
    return this.http.post<IResTransactionApprove>(`${this.API_URL}/transaction/change-debt/approve`, body, {})
  }

  rejectChangeDebtTrans(body) {
    return this.http.put<IStatusTransactionReject[]>(`${this.API_URL}/transaction/change-debt/reject`, body, {})
  }

  insertChangeDebts(body) {
    return this.http.post<IResCreateChangeDebts[]>(`${this.API_URL}/transaction/change-debt/create`, body, {})
  }

  getCustomer(customerId: string, serviceType: string, supplierCode: string) {
    let params = { customerId: customerId, serviceType: serviceType, supplierCode: supplierCode }
    return this.http.get<IBills[]>(`${this.API_URL}/settle/customer`, { params: params });
  }

  checkStatusTran(body: { id: string }) {
    return this.http.post<IResCheckTrans>(`${this.API_URL}/transaction/check/${body.id}`, body, {});
  }

  getDetailAutoPaymentSignUp(id: string) {
    return this.http.get<IAutoPayment>(`${this.API_URL}/settle/${id}`, {})
  }

  getDetailAutoPaymentRegister(id: string) {
    return this.http.get<IAutoPayment>(`${this.API_URL}/settle/register/${id}`, {})
  }

  getCustomerAutoPay(supplierCode: string, customerId: string) {
    const params = { page: "0", size: "9999", filter: `status|eq|ACTIVE&supplierCode|eq|${supplierCode}&custId|eq|${customerId}` }
    return this.http.get<IAutoPayment[]>(`${this.API_URL}/settle/register`, { params })
  }

  createAutoPaymentSignUp(body: any) {
    return this.http.post<IAutoPayment>(`${this.API_URL}/settle/create`, body, {});
  }

  editAutoPaymentSignUp(body: any, id: string) {
    return this.http.put<IAutoPayment>(`${this.API_URL}/settle/${id}`, body, {});
  }

  cancelAutoPaymentSignUp(body) {
    return this.http.delete<IBodyCancelAutoPaySignUp>(`${this.API_URL}/settle/cancel`, { body });
  }

  deleteAutoPaymentSignUp(id) {
    return this.http.delete<IBodyCancelAutoPaySignUp>(`${this.API_URL}/settle/${id}`, {});
  }

  approveAutoPayment(body): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/settle/approve`, body, {});
  }

  rejectApproveAutoPayment(body): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/settle/reject`, body, {});
  }

  uploadDataOffline(body): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/import/offline/save`, body, {});
  }

  // water offline
  getDetailOffline(id: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/import/offline/${id}`, {});
  }

  approveOffline(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}/import/offline/approve`, body, {});
  }

  rejectOffline(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}/import/offline/reject`, body, {});
  }

  deleteOffline(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/import/offline/${id}`, {});
  }
}
