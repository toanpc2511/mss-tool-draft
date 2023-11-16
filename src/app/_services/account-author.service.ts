import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlerService} from "./error-handler.service";
import {ProcessResponse, Response} from "../_models/response";
import {environment} from "../../environments/environment";
import {catchError, map,delay} from "rxjs/operators";
import {AccountAuthor} from '../_models/AccountAuthor';

@Injectable({
  providedIn: 'root'
})
export class AccountAuthorService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlerService) { }


  getAccountAuthors(accountId: string)  {
    return this.http
      .post<Response>(`${environment.apiUrl}/account/accountAuthor/list`, {accountId: accountId})
      .pipe(
        delay(600),
        map(data => {
        return data
      }, catchError(this.errorHandler.handleError)));
  }

}
