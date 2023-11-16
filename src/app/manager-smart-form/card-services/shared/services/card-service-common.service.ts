import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { GetListUserByBranchRequest } from '../models/card-update-phone-number';

@Injectable({
  providedIn: 'root',
})
export class CardServiceCommonService {
  constructor(private http: HttpClient) {}

  getUserByBranch(request: GetListUserByBranchRequest): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiUrl}/card/cardCommon/userBranchListAll`,
        request
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getAllBranch(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/process/userView/branchListAll`
    );
  }
  getAllBranch2(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/api/public/branch`);
  }

  getAllCardProductCode(): Observable<any> {
    return this.http.post<any>(
      `${environment.apiUrl}/card/cardProduct/listAll`,
      {}
    );
  }

  getAllCardProductCode2(): Observable<any> {
    return this.http.get<any>(
      `${environment.apiUrl}/card/cardProduct/listAllProduct`,
      {}
    );
  }

  getBranchInfo(branchCode: string): Observable<any> {
    return this.http.get<any>(
        `${environment.apiUrl}/card/cardCommon/branch/${branchCode}`
    );
  }
}
