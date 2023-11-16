import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import { ApproveRequest, InternalTransfer } from '../../models/internal';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { Observable } from 'rxjs';
import { PrintedDoc } from '../../models/common';
import { TransferHTTPService } from '../../interface/common';
import { AccountBalance, CustomerInfo, FeeCalculationData, FeeCalculationRequest, GetCustomerInfoInputType } from 'src/app/shared/models/common.interface';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InternalTransferService implements TransferHTTPService {
  private serviceRoute = `${environment.apiUrl}/transfer-service`;
  constructor(private http: HttpService) {}

  getLimit(): Observable<DataResponse<number>>{
    return this.http.get<number>(
      `${this.serviceRoute}/transaction/getLimit`,
      {}
    );
  }

  createTransfer(
    request: InternalTransfer
  ): Observable<DataResponse<InternalTransfer>> {
    return this.http.post<InternalTransfer>(
      `${this.serviceRoute}/transaction`,
      request,
      {}
    );
  }

  updateTransfer(
    request: InternalTransfer
  ): Observable<DataResponse<InternalTransfer>> {
    return this.http.put<InternalTransfer>(
      `${this.serviceRoute}/transaction/${request.id}`,
      request,
      {}
    );
  }

  sendApprove(request: ApproveRequest): Observable<any> {
    return this.http.post<any>(
      `${this.serviceRoute}/transaction/sendApprove`,
      request,
      {}
    );
  }

  getTransactionDetail(id: string): Observable<DataResponse<InternalTransfer>> {
    return this.http.get<InternalTransfer>(
      `${this.serviceRoute}/transaction/${id}`,
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

  deleteTransfer(id: string): Observable<any> {
    return this.http.delete<any>(`${this.serviceRoute}/transaction/${id}`, {});
  }

  approveTransfer(req: ApproveRequest): Observable<any> {
    return this.http.post<any>(
      `${this.serviceRoute}/transaction/approve`,
      req,
      {}
    );
  }

  rejectTransfer(req: ApproveRequest): Observable<any> {
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
}
