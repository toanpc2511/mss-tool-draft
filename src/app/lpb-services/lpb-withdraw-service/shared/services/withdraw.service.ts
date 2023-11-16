import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import {
  AccountRelationRequest,
  AccountRelationResponse,
  PrintedDoc,
  Withdraw,
} from '../model/withdraw';
import {
  AccountBalance,
  ApproveRequest,
  CustomerInfo,
  EmployeeInfo,
  FeeCalculationData,
  FeeCalculationRequest,
  GetCustomerInfoInputType,
} from 'src/app/shared/models/common.interface';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WithdrawService {
  private serviceRoute = `${environment.apiUrl}/withdraw-service`;
  constructor(private http: HttpService, private httpClient: HttpClient) {}

  getLimit(): Observable<DataResponse<number>>{
    return this.http.get<number>(
      `${this.serviceRoute}/transaction/getLimit`,
      {}
    );
  }

  getEmployeeInfo(code: string): Observable<DataResponse<EmployeeInfo>> {
    return this.http.get<EmployeeInfo>(
      `${this.serviceRoute}/customer/getEmployeeName?employeeId=${code}`,
      {}
    );
  }

  getFee(
    req: FeeCalculationRequest
  ): Observable<DataResponse<FeeCalculationData>> {
    let params = new HttpParams();
    params = params.set('acn', req.acn);
    params = params.set('amount', req.amount.toString());
    params = params.set('branchCode', req.branchCode);
    params = params.set('curCode', req.curCode);
    params = params.set('productCode', req.productCode);

    return this.http.get<FeeCalculationData>(`${this.serviceRoute}/fee`, {
      params,
    });
  }

  getAttachment(cif: string, skipSpinner: boolean = false): Observable<any> {
    return this.httpClient.get<any>(
      `${environment.apiUrl}/attachment/attachment?cif=${cif}`,
      skipSpinner ? { headers: { 'x-skip-spinner': 'true' } } : {}
    );
  }

  getCustomerInfo(
    textSearch: string,
    inputType: GetCustomerInfoInputType
  ): Observable<DataResponse<CustomerInfo[]>> {
    return this.http.get<CustomerInfo[]>(
      `${this.serviceRoute}/customer/info?inputType=${inputType}&input=${textSearch}`,
      {}
    );
  }

  getBalance(acn: string): Observable<DataResponse<AccountBalance>> {
    return this.http.get<AccountBalance>(
      `${this.serviceRoute}/customer/account-aval-bal?acn=${acn}`,
      {}
    );
  }

  getBranchInfo(branchCode: string): Observable<any> {
    return this.http.get<any>(
      `${this.serviceRoute}/redis/getBranch?branchCode=${branchCode}`,
      { headers: { 'x-skip-spinner': 'true' } }
    );
  }

  revertToDraft(req: ApproveRequest): Observable<DataResponse<Withdraw>> {
    return this.http.post<Withdraw>(
      `${this.serviceRoute}/transaction/draft`,
      req,
      {}
    );
  }

  saveWithdraw(body: Withdraw): Observable<DataResponse<Withdraw>> {
    return this.http.post<Withdraw>(
      `${this.serviceRoute}/transaction`,
      body,
      {}
    );
  }

  sendApprove(id: string, version: number): Observable<any> {
    const req: ApproveRequest = { id, note: 'my note', version };
    return this.http.post<any>(
      `${this.serviceRoute}/transaction/sendApprove`,
      req,
      {}
    );
  }

  updateWithdraw(body: Withdraw): Observable<DataResponse<Withdraw>> {
    return this.http.put<Withdraw>(
      `${this.serviceRoute}/transaction/${body.id}`,
      body,
      {}
    );
  }

  getTransactionDetail(id: string): Observable<any> {
    return this.http.get<any>(`${this.serviceRoute}/transaction/${id}`, {});
  }

  deleteWithdraw(id: string): Observable<any> {
    return this.http.delete<any>(`${this.serviceRoute}/transaction/${id}`, {});
  }

  approveWithdraw(req: ApproveRequest): Observable<any> {
    return this.http.post<any>(
      `${this.serviceRoute}/transaction/approve`,
      req,
      {}
    );
  }

  rejectWithdraw(req: ApproveRequest): Observable<any> {
    return this.http.post<any>(
      `${this.serviceRoute}/transaction/reject`,
      req,
      {}
    );
  }

  sendModifyRequest(req: ApproveRequest): Observable<any> {
    return this.http.post<any>(
      `${this.serviceRoute}/transaction/waitModify`,
      req,
      {}
    );
  }

  getPrintedForm(
    id: string,
    isLogo: string
  ): Observable<DataResponse<PrintedDoc>> {
    return this.http.get<PrintedDoc>(
      `${this.serviceRoute}/transaction/print/${id}?isLogo=${isLogo}`,
      {}
    );
  }

  getPrintedDoc(id: string): Observable<DataResponse<PrintedDoc>> {
    return this.http.get<PrintedDoc>(
      `${this.serviceRoute}/transaction/print-invoice/${id}`,
      {}
    );
  }

  getAccountRelation(
    req: AccountRelationRequest
  ): Observable<DataResponse<AccountRelationResponse>> {
    let params = {};
    Object.keys(req).forEach((key) => {
      params[key] = req[key];
    });

    return this.http.get<AccountRelationResponse>(
      `${this.serviceRoute}/relAcc`,
      { params: params }
    );
  }
}
