import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Deposit,
  DepositApproveRequest,
  DepositResponse,
  PrintResponse,
  PrintedCurrentForm,
  PrintedDoc,
} from '../models/deposit';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/shared/services/http.service';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DepositService {
  private serviceRoute = `${environment.apiUrl}/deposit-service`;

  constructor(private http: HttpService, private httpClient: HttpClient) {}

  getLimit(): Observable<DataResponse<number>>{
    return this.http.get<number>(
      `${this.serviceRoute}/transaction/getLimit`,
      {}
    );
  }

  revertToDraft(req: DepositApproveRequest): Observable<DataResponse<Deposit>> {
    return this.http.post<Deposit>(
      `${this.serviceRoute}/transaction/draft`,
      req,
      {}
    );
  }

  saveDeposit(body: Deposit): Observable<DataResponse<Deposit>> {
    return this.http.post<Deposit>(
      `${this.serviceRoute}/transaction`,
      body,
      {}
    );
  }

  sendApprove(id: string, version: number): Observable<any> {
    const req: DepositApproveRequest = { id, note: 'my note', version };
    return this.http.post<any>(
      `${this.serviceRoute}/transaction/sendApprove`,
      req,
      {}
    );
  }

  updateDeposit(body: Deposit): Observable<DataResponse<Deposit>> {
    return this.http.put<Deposit>(
      `${this.serviceRoute}/transaction/${body.id}`,
      body,
      {}
    );
  }

  getTransactionDetail(id: string): Observable<any> {
    return this.http.get<any>(`${this.serviceRoute}/transaction/${id}`, {});
  }

  deleteDeposit(id: string): Observable<any> {
    return this.http.delete<any>(`${this.serviceRoute}/transaction/${id}`, {});
  }

  approveDeposit(req: DepositApproveRequest): Observable<any> {
    return this.http.post<any>(
      `${this.serviceRoute}/transaction/approve`,
      req,
      {}
    );
  }

  rejectDeposit(req: DepositApproveRequest): Observable<any> {
    return this.http.post<any>(
      `${this.serviceRoute}/transaction/reject`,
      req,
      {}
    );
  }

  sendModifyRequest(req: DepositApproveRequest): Observable<any> {
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

  getPrintedCurrentForm(
    req: PrintedCurrentForm
  ): Observable<DataResponse<PrintedDoc>> {
    return this.http.post<PrintedDoc>(
      `${this.serviceRoute}/transaction/printCurrentTransaction`,
      req,
      {}
    );
  }

  getCurrentInfo(
    transId: string
  ): Observable<DataResponse<PrintedCurrentForm>> {
    return this.http.get<PrintedCurrentForm>(
      `${this.serviceRoute}/transaction/getCurrentInfo/${transId}`,
      {}
    );
  }
}
