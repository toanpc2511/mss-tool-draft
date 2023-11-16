import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import { ApproveRequest } from '../../models/internal';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { Observable } from 'rxjs';
import { PrintedDoc } from '../../models/common';
import { TransferHTTPService } from '../../interface/common';
import { NapasBankInfo, NapasCardInfo, NapasTransfer } from '../../models/napas';
import { NapasMockTransferService } from './napas-mock-transfer.service';

@Injectable({
  providedIn: 'root',
})
export class NapasTransferService implements TransferHTTPService {
  private serviceRoute = `${environment.apiUrl}/transfer-service/napas-transaction`;
  constructor(
    private http: HttpService,
    private napasMockTransferService: NapasMockTransferService
  ) {}

  createTransfer(
    request: NapasTransfer
  ): Observable<DataResponse<NapasTransfer>> {
    return this.http.post<NapasTransfer>(`${this.serviceRoute}`, request, {});
  }

  getListBank(): Observable<DataResponse<NapasBankInfo[]>> {
    return this.http.get<NapasBankInfo[]>(
      `${this.serviceRoute}/getListBank`,
      {}
    );
  }

  getCardInfo(cardNum: string): Observable<DataResponse<NapasCardInfo>> {
    return this.http.get<NapasCardInfo>(
      `${this.serviceRoute}/getCusInfoByCardNum?cardNum=${cardNum}`,
      {}
    );
  }

  getCustomerNameByAcnAndBankCode({
    acn,
    bankCode,
  }: {
    acn: string;
    bankCode: string;
  }): Observable<DataResponse<string>> {
    return this.http.get<string>(
      `${this.serviceRoute}/getCusNameByAcnAndBankCode?acn=${acn}&bankCode=${bankCode}`,
      {}
    );
  }

  updateTransfer(
    request: NapasTransfer
  ): Observable<DataResponse<NapasTransfer>> {
    return this.http.put<NapasTransfer>(
      `${this.serviceRoute}/${request.id}`,
      request,
      {}
    );
  }

  sendApprove(request: ApproveRequest): Observable<any> {
    return this.http.post<any>(`${this.serviceRoute}/sendApprove`, request, {});
  }

  getTransactionDetail(id: string): Observable<DataResponse<NapasTransfer>> {
    return this.http.get<NapasTransfer>(`${this.serviceRoute}/${id}`, {});
  }

  getPrintedForm(
    id: string,
    isLogo: string
  ): Observable<DataResponse<PrintedDoc>> {
    return this.http.get<PrintedDoc>(
      `${this.serviceRoute}/print/${id}?isLogo=${isLogo}`,
      {}
    );
  }

  getPrintedDoc(id: string): Observable<DataResponse<PrintedDoc>> {
    return this.http.get<PrintedDoc>(
      `${this.serviceRoute}/print-invoice/${id}`,
      {}
    );
  }

  deleteTransfer(id: string): Observable<any> {
    return this.http.delete<any>(`${this.serviceRoute}/${id}`, {});
  }

  approveTransfer(req: ApproveRequest): Observable<any> {
    return this.http.post<any>(`${this.serviceRoute}/approve`, req, {});
  }

  rejectTransfer(req: ApproveRequest): Observable<any> {
    return this.http.post<any>(`${this.serviceRoute}/reject`, req, {});
  }

  sendModifyRequest(req: ApproveRequest): Observable<any> {
    return this.http.post<any>(`${this.serviceRoute}/waitModify`, req, {});
  }
}
