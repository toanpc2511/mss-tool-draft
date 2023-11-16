import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Account } from 'src/app/shared/models/common.interface';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import { Category, PGDBD, Term, TermResponse } from '../models/saving-basic';

@Injectable({
  providedIn: 'root',
})
export class BasicSavingService {
  private serviceRoute = `${environment.apiUrl}/savings-service`;
  constructor(private http: HttpService) {}

  getTerms({
    curCode,
    productType,
  }: {
    curCode: string;
    productType: string;
  }): Observable<DataResponse<Term[]>> {
    return this.http
      .get<TermResponse[]>(
        `${this.serviceRoute}/passbook/getTerm?curCode=${curCode}&productCode=${productType}`,
        {}
      )
      .pipe(
        switchMap((res) => {
          if (res.data) {
            const response: DataResponse<Term[]> = {
              meta: res.meta,
              data: [],
            };
            response.data = res.data.map((termData) => ({
              terms: termData.term.split('/').map((str) => Number(str.trim())),
              termCode: termData.termCode,
            }));

            return of(response);
          } else {
            return null;
          }
        })
      );
  }

  getAccountInfo(textSearch: string): Observable<DataResponse<Account[]>> {
    return this.http.get<Account[]>(
      `${environment.apiUrl}/deposit-service/customer/account?acn=${textSearch}`,
      {}
    );
  }

  getCategoryList(fieldName?: string): Observable<DataResponse<Category[]>> {
    if(fieldName){
      return this.http.get<Category[]>(
        `${this.serviceRoute}/passbook/category?categoryName=${fieldName}`,
        {}
      );
    }
    return this.http.get<Category[]>(
      `${this.serviceRoute}/passbook/category`,
      {}
    );
  }

  getPGDBD(branchCode: string): Observable<DataResponse<PGDBD>> {
    return this.http.get<PGDBD>(
      `${this.serviceRoute}/passbook/getOldBranchCode?branchCode=${branchCode}`,
      {}
    );
  }
}
