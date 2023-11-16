import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import { ApproveRequest } from '../../models/common';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { Observable } from 'rxjs';
import { PrintedDoc } from '../../models/common';
import { TransferHTTPService } from '../../interface/common';
import { CitadBankInfo, CitadIndirectInfo, CitadSyncInfo, CitadTransfer } from '../../models/citad';

@Injectable({
  providedIn: 'root',
})
export class CitadTransferService implements TransferHTTPService {
  private serviceRoute = `${environment.apiUrl}/transfer-service/citad-transaction`;
  constructor(private http: HttpService) {}

  syncCitadBanksData(): Observable<DataResponse<string>>{
    return this.http.post<string>(
      `${this.serviceRoute}/syncBanksData`,
      {},
      { headers: { 'x-skip-spinner': 'true' } }
    );
  }

  getSyncCitadStt(): Observable<DataResponse<CitadSyncInfo>>{
    return this.http.get<CitadSyncInfo>(
      `${this.serviceRoute}/getSyncCitadStt`,
      {}
    );
  }

  getBankList(): Observable<DataResponse<CitadBankInfo[]>>{
    return this.http.get<CitadBankInfo[]>(
      `${this.serviceRoute}/getListBank`,
      {}
    );
  }

  getIndirectInfoList(routeCode : string): Observable<DataResponse<CitadIndirectInfo[]>>{
    return this.http.get<CitadIndirectInfo[]>(
      `${this.serviceRoute}/getCitadCode?routeCode=${routeCode}`,
      {}
    );
  }

  checkProcessCode(id: string): Observable<DataResponse<boolean>> {
    return this.http.get<boolean>(
      `${this.serviceRoute}/checkProcessCode?id=${id}`,
      {}
    );
  }

  createTransfer(
    request: CitadTransfer
  ): Observable<DataResponse<CitadTransfer>> {
    return this.http.post<CitadTransfer>(
      `${this.serviceRoute}`,
      request,
      {}
    );
  }

  updateTransfer(
    request: CitadTransfer
  ): Observable<DataResponse<CitadTransfer>> {
    return this.http.put<CitadTransfer>(
      `${this.serviceRoute}/${request.id}`,
      request,
      {}
    );
  }

  sendApprove(request: ApproveRequest): Observable<any> {
    return this.http.post<any>(
      `${this.serviceRoute}/sendApprove`,
      request,
      {}
    );
  }

  getTransactionDetail(id: string): Observable<DataResponse<CitadTransfer>> {
    return this.http.get<CitadTransfer>(
      `${this.serviceRoute}/${id}`,
      {}
    );
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
    return this.http.post<any>(
      `${this.serviceRoute}/approve`,
      req,
      {}
    );
  }

  rejectTransfer(req: ApproveRequest): Observable<any> {
    return this.http.post<any>(
      `${this.serviceRoute}/reject`,
      req,
      {}
    );
  }

  sendModifyRequest(req: ApproveRequest): Observable<any> {
    return this.http.post<any>(
      `${this.serviceRoute}/waitModify`,
      req,
      {}
    );
  }

}
