import {
  IAccountInfos,
  IAutoPayment,
  IBatchApprove,
  IBatchTransaction,
  IBodyCancelAutoPaySignUp,
  IDataQueryFile,
  IInfoCustomerRegister,
  IStatusTransactionReject,
  ISupplierRule, ITransactionSettle
} from './../models/electric.interface';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IBills, ICifSearch, IResCancelTransaction, IResCheckTrans, IResCreateChangeDebts, IResTransactionApprove, IResTransactionReject, ISupplier, ITransaction } from '../models/electric.interface';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
export const ELECTRIC_SERVICE = 'electric-service';

@Injectable({
  providedIn: 'root'
})
export class ElectricService {
  API_URL = `${environment.apiUrl}/${ELECTRIC_SERVICE}`;
  transactionApproveSubject = new BehaviorSubject([]);

  constructor(private http: HttpService) { }

  getBills(customerId: string, serviceType: string, supplierCode: string) {
    let params = { customerId: customerId, serviceType: serviceType, supplierCode: supplierCode }
    return this.http.get<IBills>(`${this.API_URL}/search/debt-bills`, { params: params });
  }

  getSupplierFromCode(code: string) {
    return this.http.get<ISupplier>(`${this.API_URL}/supplier/code/${code}`, {});
  }

  getSupplierRules(supplierId: string) {
    return this.http.get<ISupplierRule[]>(`${this.API_URL}/form-group/supplier-rule/${supplierId}`, {});
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
    return this.http.delete<IResCancelTransaction>(`${this.API_URL}/transaction/cancel`, { body });
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
    return this.http.post<any>(`${this.API_URL}/transaction/approve`, body, {})
  }
  rejectTransactions(body) {
    return this.http.put<IResTransactionReject>(`${this.API_URL}/transaction/reject`, body, {})
  }
  approveRevertTransactions(body) {
    return this.http.post<any>(`${this.API_URL}/transaction/revert/approve`, body, {})
  }
  rejectRevertTransactions(body) {
    return this.http.put<IResTransactionReject>(`${this.API_URL}/transaction/revert/reject`, body, {})
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

  checkStatusTranRevert(body: { id: string }) {
    return this.http.post<IResCheckTrans>(`${this.API_URL}/transaction/revert/check/${body.id}`, body, {});
  }

  changeDebt(id: string): Observable<any> {
    return this.http.post(`${this.API_URL}/transaction/change-debt/${id}`, {}, {});
  }

  getDetailAutoPaymentSignUp(id: string) {
    return this.http.get<IAutoPayment>(`${this.API_URL}/settle/${id}`, {})
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

  deleteAutoPaymentSignUp(id: string) {
    return this.http.delete<IBodyCancelAutoPaySignUp>(`${this.API_URL}/settle/cancel/${id}`, {});
  }

  approveAutoPayment(body): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/settle/approve`, body, {});
  }

  rejectApproveAutoPayment(body): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/settle/reject`, body, {});
  }

  // Thanh toán theo file
  queryDataByFile(body: any): Observable<any> {
    return this.http.post<IDataQueryFile>(`${this.API_URL}/payment/search`, body, {});
  }

  createTransactionByFile(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}/batch`, body, {});
  }

  deleleTransactionByFile(id: string, body: any): Observable<any> {
    return this.http.delete(`${this.API_URL}/batch/${id}`, { body });
  }

  getDetailTransactionByFile(id: string): Observable<any> {
    return this.http.get<IBatchTransaction>(`${this.API_URL}/batch/${id}`, {});
  }

  // Duyệt thanh toán theo file
  getDataByStep(batchNo: string, step: string): Observable<any> {
    return this.http.get(`${this.API_URL}/batch`, {});
  }

  agreeApproveStep1(batchId: string, batchNo: string, lastmodifiedDate: string) {
    const body = { batchId, batchNo, lastmodifiedDate }
    return this.http.post<IBatchApprove>(`${this.API_URL}/batch/transfer`, body, {});
  }

  rejectApproveStep1(batchId: string): Observable<any> {
    const body = { batchId };
    return this.http.delete(`${this.API_URL}/batch/transfer`, { body });
  }

  agreeApproveStep2(batchId: string, batchNo: string, lastmodifiedDate: string) {
    const body = { batchId, batchNo, lastmodifiedDate }
    return this.http.post<IBatchApprove>(`${this.API_URL}/batch/change-debt`, body, {});
  }

  rejectApproveStep2(batchId: string): Observable<any> {
    const body = { batchId };
    return this.http.delete(`${this.API_URL}/batch/change-debt`, { body });
  }

  accoutingApprove(batchId: string, batchNo: string) {
    const body = { batchId, batchNo }
    return this.http.post<IBatchApprove>(`${this.API_URL}/batch/accounting`, body, {});
  }

  // Thanh toán tự động
  searchCustomerNewRegister(params: any): Observable<any> {
    return this.http.get<IAccountInfos>(`${this.API_URL}/settle/customer`, { params });
  }

  createTransactionAutoPayment(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}/settle/create`, body, {});
  }

  detailTransactionSettle(id: string): Observable<any> {
    return this.http.get<ITransactionSettle>(`${this.API_URL}/settle/${id}`, {});
  }

  deleteTransactionSettle(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/settle/${id}`, {});
  }

  getDetailCustomerRegister(id: string): Observable<any> {
    return this.http.get<IInfoCustomerRegister>(`${this.API_URL}/settle/register/${id}`, {})
  }

  cancelRegisterAutoPayment(body: any): Observable<any> {
    return this.http.delete(`${this.API_URL}/settle/register/cancel`, { body })
  }

  updateCustomerRegister(id: string, body: any): Observable<any> {
    return this.http.put(`${this.API_URL}/settle/register/${id}`, body, {});
  }

  revertTransaction(body: any): Observable<any> {
    return this.http.post(`${this.API_URL}/transaction/revert`, body, {});
  }

  checkAccountingTransfer(body: { id: string }): Observable<any> {
    return this.http.post<IBatchApprove>(`${this.API_URL}/batch/check/${body.id}`, body, {});
  }

  checkCreateAccounting(body: { id: string }): Observable<any> {
    return this.http.post<IBatchApprove>(`${this.API_URL}/batch/check-accounting/${body.id}`, body, {});
  }

  insertChangeDebtByFile(id: string) {
    return this.http.post<any>(`${this.API_URL}/batch/change-debt/file/${id}`, {}, {})
  }
}
