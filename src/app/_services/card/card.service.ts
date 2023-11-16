import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {CardNew} from 'src/app/_models/card/CardNew';
import {CardUpdate} from 'src/app/_models/card/CardUpdate';
import {CommonCard} from 'src/app/_models/card/CommonCard';
import {Response} from 'src/app/_models/response';
import {environment} from 'src/environments/environment';
import {ErrorHandlerService} from '../error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {
  }

  dto = {};

  // api lấy danh sách thẻ chính
  getListCard(obj: any): Observable<any> {
    return this.http
      .post<Response>(`${environment.apiUrl}/card/card/listAll`, obj)
      .pipe(map(data => {
        return data;
      }, catchError(this.errorHandler.handleError)));
  }

  getAccountList(processId): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/account/account/list`, {processId})
      .pipe(catchError(this.errorHandler.handleError));
  }

  getDetailAccount(id): Observable<any> {
    return this.http
      .post<Response>(`${environment.apiUrl}/account/account/detail`, {id})
      .pipe(catchError(this.errorHandler.handleError));
  }

  // api thêm thẻ mới
  createCard(obj: CardNew): Observable<Response> {
    return this.http
      .post<Response>(`${environment.apiUrl}/card/card/create`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)));
  }

  // api cập nhật
  updateCard(obj: CardUpdate): Observable<Response> {
    return this.http
      .post<Response>(`${environment.apiUrl}/card/card/update`, obj)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)));
  }

  // api lấy chi tiết thẻ
  detailCard(id): Observable<Response> {
    return this.http.post<Response>(`${environment.apiUrl}/card/card/detail`, {id})
      .pipe(map(data => {
          return data;
        }
        , catchError(this.errorHandler.handleError)));
  }

  // api lấy loại thẻ
  getTypeCard(): Observable<any> {
    return this.http.post<Response>(`${environment.apiUrl}/card/cardType/listAll`, this.dto);
  }

  // api lấy loại phí
  getIssueFee(): Observable<any> {
    return this.http.post<Response>(`${environment.apiUrl}/card/cardIssueFee/listAll`, this.dto);
  }

  // api lấy hạng thẻ
  getRateCard(): Observable<any> {
    return this.http.post<Response>(`${environment.apiUrl}/card/cardRate/listAll`, this.dto)
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)));
  }

  getRateCardByCardCode(cardProductCode: any): Observable<any> {
    return this.http.post<Response>(`${environment.apiUrl}/card/cardRate/cardRateByCode`, {cardProductCode})
      .pipe(map(data => data
        , catchError(this.errorHandler.handleError)));
  }

  // api lấy mã thẻ
  apiCardProduct(): Observable<Response> {
    return this.http.post<Response>(`${environment.apiUrl}/card/cardProduct/listAll`, this.dto);
  }

  apiCardProduct2(cardTypeCode: any): Observable<Response> {
    return this.http.post<Response>(`${environment.apiUrl}/card/cardProduct/list`, {cardTypeCode});
  }

  // api lấy kiểu thẻ
  getListDeliveryType(): Observable<Response> {
    return this.http.post<Response>(`${environment.apiUrl}/card/deliveryType/listAll`, this.dto)
      .pipe(map(data => {
          return data;
        }
        , catchError(this.errorHandler.handleError)));
  }

  // api lấy chi nhánh
  getListBranch(): Observable<Response> {
    return this.http.get<Response>(`${environment.apiUrl}/process/userView/branchListAll`);
  }

  // api xóa thẻ chính
  delete(id: string): Observable<Response> {
    return this.http.post<Response>(`${environment.apiUrl}/card/card/delete`, {id})
      .pipe(map(data => {
          return data;
        }
        , catchError(this.errorHandler.handleError)));
  }

  // api giới tính
  getGender(): Observable<Response> {
    return this.http.post<Response>(`${environment.apiUrl}/process/gender/listAll`, this.dto);
  }

  // api lấy GXTM
  getPerDocType(obj: CommonCard): Observable<Response> {
    return this.http.post<Response>(`${environment.apiUrl}/process/perDocType/listAll`, this.dto);
  }

}
