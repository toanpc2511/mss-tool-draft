import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { AccountBalance, CustomerInfo, FeeCalculationData, FeeCalculationRequest, GetCustomerInfoInputType, SignatureInfo } from '../models/common.interface';
import { DataResponse } from '../models/data-response.model';

@Injectable({
  providedIn: 'root'
})
export class FinanceCommonService {
  constructor(private http: HttpService, private httpClient: HttpClient) {}

  getAllBranch(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/transfer-service/redis/getBranch`,
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

    return this.http.get<FeeCalculationData>(`${environment.apiUrl}/deposit-service/fee`, {
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
      `${environment.apiUrl}/deposit-service/customer/info?inputType=${inputType}&input=${textSearch}`,
      {}
    );
  }

  getBalance(acn: string): Observable<DataResponse<AccountBalance>> {
    return this.http.get<AccountBalance>(
      `${environment.apiUrl}/deposit-service/customer/account-aval-bal?acn=${acn}`,
      {}
    );
  }

  getBranchInfo(branchCode: string): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/transfer-service/redis/getBranch?branchCode=${branchCode}`,
      { headers: { 'x-skip-spinner': 'true' } }
    );
  }
}
