import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CustomerInfoResponse,
  FeeCalculationRequest,
  FeeCalculationResponse,
  SignatureInfo,
  SignatureInfoResponse,
} from '../models/common';
import { HttpService } from 'src/app/shared/services/http.service';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { FeeCalculationData } from '../models/common';
import { CustomerInfo } from '../models/common';
import { AccountBalance } from '../models/deposit';

export type GetCustomerInfoInputType = 'cif' | 'gtxm' | 'acn';
interface EmployeeInfo {
  employeeId: string;
  employeeName: string;
}

@Injectable({
  providedIn: 'root',
})
export class DepositCommonService {
  private serviceRoute = `${environment.apiUrl}/deposit-service`;

  constructor(private http: HttpService, private httpClient: HttpClient) {}

  getAllBranch(): Observable<any> {
    return this.http.get<any>(
      `${this.serviceRoute}/redis/getBranch`,
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

  getSignatures(cifNo: string, skipSpinner: boolean = false): Observable<DataResponse<SignatureInfo[]>> {
    return this.http.get<SignatureInfo[]>(
      `${this.serviceRoute}/signatureInfo?cifNo=${cifNo}`,
      skipSpinner ? { headers: { 'x-skip-spinner': 'true' } } : {}
    );
  }

  getCoOwnerSignatures(acn: string): Observable<DataResponse<SignatureInfo[]>> {
    return this.http.get<SignatureInfo[]>(
      `${this.serviceRoute}/signatureInfo/getSignatureCoOwner?acn=${acn}`,
      {}
    );
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

  getTransactions(): Observable<any> {
    return this.http.get<any>(
      `${this.serviceRoute}/transaction?page=0&size=10&filter=''&sort=''`,
    );
  }

  getBranchInfo(branchCode: string): Observable<any> {
    return this.http.get<any>(
      `${this.serviceRoute}/redis/getBranch?branchCode=${branchCode}`,
      { headers: { 'x-skip-spinner': 'true' } }
    );
  }
}
