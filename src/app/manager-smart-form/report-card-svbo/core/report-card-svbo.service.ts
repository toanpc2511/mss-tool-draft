import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportCardSvboService {

  constructor(private http: HttpClient) { }
  // lấy danh sách chi nhánh
  getListBranch(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/card/exportCard/branchListAll`).pipe(map((res: any) => {
      return res;
    }));
  }
  // tslint:disable-next-line:typedef
  listCiftoSvbo(data: any): Observable<any> {
    // console.log('data gui di');
    console.log(JSON.stringify(data));
    return this.http.post<any>(`${environment.apiUrl}/card/exportCard/findUpdateCifToSvbo`, data).pipe(map((res: any) => {
      return res;
    }));
  }
  // tslint:disable-next-line:typedef
  exportFile(file: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/card/exportCard/exportUpdateCifToSvbo`, file).pipe(map((res: any) => {
      return res;
    }));
  }
}
