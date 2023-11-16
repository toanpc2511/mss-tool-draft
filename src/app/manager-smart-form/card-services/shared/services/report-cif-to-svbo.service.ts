import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportCifToSvboService {

  constructor(private http: HttpClient) { }

  listReportCifToSvbo(request: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/svboService/findExport`, request).pipe(map((res: any) => {
      return res;
    }));
  }
  listBranches(): Observable<any> {
    return  this.http.get<any>(`${environment.apiUrl}/card/cardCommon/branchListAll`).pipe(map(res => {
      return res;
    }));
  }
  exportFile(req: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/card/svboService/exportReport`, req, {
      observe: 'response',
      responseType: 'blob' as 'json',
      // headers: new HttpHeaders().append('Content-Tydpe', 'application/xml')
    });
  }
}
