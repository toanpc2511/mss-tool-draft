import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportCardTransactionService {

  constructor(private http: HttpClient) { }

  listBranches(): Observable<any> {
    return  this.http.get<any>(`${environment.apiUrl}/process/userView/branchListAll`).pipe(map(res => {
      return res;
    }));
  }
  exportFile(req: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/card/ebsService/exportReport`, req, {
      observe: 'response',
      responseType: 'blob' as 'json',
    });
  }
}
