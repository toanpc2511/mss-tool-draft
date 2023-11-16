import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { CardSubCreate } from 'src/app/_models/card/subCard/CardSubCreate';
import { CardSubList } from 'src/app/_models/card/subCard/CardSubList';
import { CardSubUpdate } from 'src/app/_models/card/subCard/CardSubUpdate';
import { environment } from 'src/environments/environment';
import { ErrorHandlerService } from '../error-handler.service';
import { Response } from 'src/app/_models/response';
@Injectable({
  providedIn: 'root'
})
export class SubCardService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }

  // tslint:disable-next-line:typedef
  getListCard(cardId) {
    return this.http
      .post<Response>(`${environment.apiUrl}/card/supCard/listAll`, { cardId });

  }
  // tslint:disable-next-line:typedef
  createSubCard(obj: CardSubCreate) {
    return this.http.post<Response>(`${environment.apiUrl}/card/supCard/create`, obj);
  }
  // tslint:disable-next-line:typedef
  updateSubCard(obj: CardSubCreate) {
    return this.http.post<Response>(`${environment.apiUrl}/card/supCard/update`, obj);
  }
  // tslint:disable-next-line:typedef
  deleteSubCard(id: string) {
    return this.http.post<Response>(`${environment.apiUrl}/card/supCard/delete`, { id })
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
  // tslint:disable-next-line:typedef
  detailSupCard(id) {
    return this.http.post<Response>(`${environment.apiUrl}/card/supCard/detail`, { id })
      .pipe(map(data => {
        return data;
      }
        , catchError(this.errorHandler.handleError)));
  }
}
