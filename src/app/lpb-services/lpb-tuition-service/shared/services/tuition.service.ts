import {environment} from '../../../../../environments/environment';
import {HttpService} from '../../../../shared/services/http.service';
import {
  TUITION_SERVICE,
  URL_FILE_APPROVE,
  URL_FILE_CANCEL,
  URL_FILE_REJECT,
  URL_FILE_SCHOOL
} from '../constants/url.tuition.service';
import {IFee, IOutPut, IResTransactionCheck, IResTransactionRetry} from '../models/tuition.interface';
import {Injectable} from '@angular/core';
import {FileService} from '../../../../shared/services/file.service';
import {HttpParams} from '@angular/common/http';
import {
  IAutoPayment,
  IBodyCancelAutoPaySignUp,
  IListBillInfo,
  ISchool,
  IStatusTransactionReject,
  ITranDetail
} from '../models/tuition.interface';

import {BehaviorSubject, Observable} from 'rxjs';

import {
  IBills,
  ICifSearch,
  IResCancelTransaction,
  IResCheckTrans,
  IResCreateChangeDebts,
  IResTransactionApprove,
  IResTransactionReject,
  ISupplier,
  ITransaction
} from '../models/tuition.interface';

@Injectable({
  providedIn: 'root'
})
export class TuitionService {
  API_URL = `${environment.apiUrl}/${TUITION_SERVICE}`;
  transactionApproveSubject = new BehaviorSubject([]);

  constructor(private http: HttpService,
              private fileService: FileService) {
  }

  rejectFile(id: string): Observable<any> {
    return this.http.put<IOutPut>(`${environment.apiUrl}/${URL_FILE_REJECT}/${id}`, {}, {});
  }

  approveFile(id: string): Observable<any> {
    return this.http.post<IOutPut>(`${environment.apiUrl}/${URL_FILE_APPROVE}/${id}`, {}, {});
  }

  cancelFile(id: string): Observable<any> {
    return this.http.put<IOutPut>(`${environment.apiUrl}/${URL_FILE_CANCEL}/${id}`, {}, {});
  }

  getListUniversityActive() {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '9999')
      .set('filter', 'isActive|eq|ACTIVE')
      .set('sort', 'name:ASC');
    return this.http.get<ISchool[]>(`${environment.apiUrl}/${URL_FILE_SCHOOL}`, {
      params
    });
  }

  // getBills(studentCode: string, universityCode: string, pageNumber: string, pageSize: string) {
  //   let params = { studentCode: studentCode, universityCode: universityCode, pageNumber: pageNumber,pageSize: pageSize  }
  //   //return this.http.get<IListBillInfo[]>(`${this.API_URL}/student/search-student`, { params: params });
  //   return this.http.get<IListBillInfo[]>(`http://localhost:8082/tuition-service/student/search-student`, { params: params });
  // }

  getBills(studentCode: string, universityCode: string) {

    const params = new HttpParams()
     //.set('studentCode', studentCode)
     //.set('universityCode', universityCode)
    .set('filter', `recordStat|eq|OPEN&isActive|eq|ACTIVE&checkPaid|eq|0&studentCode|eq|${studentCode}&uniCode|eq|${universityCode}`)
    .set('page', '0')
    .set('size', '10')
    .set('sort', 'semester:ASC,amount:ASC')
    .set('typePayment', 'FAR_NEAR');
    return this.http.get<IListBillInfo[]>(`${this.API_URL}/student`, {
      params
    });

  }

  getTransaction(status: string, universityCode: string, studentCode: string) {

    const params = new HttpParams()
      .set('status', status)
      .set('studentCode', studentCode)
      .set('universityCode', universityCode)
      .set('pageNumber', '0')
      .set('pageSize', '10');

    return this.http.get<ITransaction[]>(`${this.API_URL}/transaction/search`,
      {params}
    );
  }

  getFee(branchCode : string, productCode: string, currency: string, acc: string, amount: string ) {

    const params = new HttpParams()
    
      .set('branchCode', branchCode)
      .set('productCode', productCode)
      .set('currency', currency)
      .set('acc', acc)
      .set('amount', amount);

    return this.http.get<IFee[]>(`${this.API_URL}/fee`,
      {params}
    );
  }

  getTransactionByID(id: string) {


    return this.http.get<ITransaction>(`${this.API_URL}/transaction/${id}`, {}
    );
  }


  getTransactionDetails(transId: string) {

    return this.http.get<ITranDetail[]>(`${this.API_URL}/transaction/transactionDetail/${transId}`,
      {}
    );
  }

  getSupplierFromCode(code: string) {
    return this.http.get<ISupplier>(`${this.API_URL}/supplier/code/${code}`, {});
  }

  getUniversity() {
    return this.http.get<ISchool[]>(`${this.API_URL}/getUniversity`, {});
  }

  getAccountCustomers(customerCifNumber: string, recordPerPage: number, pageNumber: number) {
    let params = {customerCifNumber: customerCifNumber, recordPerPage: `${recordPerPage}`, pageNumber: `${pageNumber}`}
    return this.http.get<ICifSearch[]>(`${this.API_URL}/cif/info`, {params: params});
  }

  // createPaymentBill(body: any) {
  //   return this.http.post<ITransaction>(`${this.API_URL}/transaction`, body, {});
  // }
  createPaymentBill(body: any) {
    return this.http.post<ITransaction>(`${this.API_URL}/transaction`, body, {});
  }

  editTransaction(body: any, id: string) {
    return this.http.put<ITransaction>(`${this.API_URL}/transaction/${id}`, body, {});
  }

  cancelTransaction(body: any) {
    return this.http.delete<IResCancelTransaction>(`${this.API_URL}/transaction`,{body});
  }

  getUniversityByCode(code: string) {
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '9999')
      .set('filter', `isActive|eq|ACTIVE&code|eq|${code}`)
      .set('sort', 'name:ASC');
    return this.http.get<ISchool[]>(`${this.API_URL}/file/school`, {
      params
    });
  }

  approveTransactions(body) {
    return this.http.post<IResTransactionApprove>(`${this.API_URL}/transaction/approve`, body, {})
  }

  rejectTransactions(body) {
    return this.http.put<IResTransactionReject>(`${this.API_URL}/transaction/reject`, body, {})
  }

  checkTransactions(body) {
    return this.http.put<IResTransactionCheck>(`${this.API_URL}/transaction/check`, body, {})
  }

  retyTransactions(body) {
    return this.http.put<IResTransactionRetry>(`${this.API_URL}/transaction/retry`, body, {})
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
    let params = {customerId: customerId, serviceType: serviceType, supplierCode: supplierCode}
    return this.http.get<IBills[]>(`${this.API_URL}/settle/customer`, {params: params});
  }

  checkStatusTran(body: { id: string }) {
    return this.http.post<IResCheckTrans>(`${this.API_URL}/transaction/check/${body.id}`, body, {});
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
    return this.http.delete<IBodyCancelAutoPaySignUp>(`${this.API_URL}/settle/cancel`, {body});
  }

  approveAutoPayment(body): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/settle/approve`, body, {});
  }

  rejectApproveAutoPayment(body): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/settle/reject`, body, {});
  }

}
