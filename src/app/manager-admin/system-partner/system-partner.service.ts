import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SystemPartnerService {

  constructor(private http: HttpClient) { }
  listBranches(data): Observable<any> {
    // console.log(JSON.stringify(data));
    return this.http.post<any>(`${environment.apiUrl}/admin/branchAppConnect/listAll`, data).pipe(map((res: any) => {
      return res;
    }));
  }
  // set ON - OFF
  connectStatus(data): Observable<any> {
    // console.log(JSON.stringify(data));
    return this.http.post<any>(`${environment.apiUrl}/admin/branchAppConnect/update`, data).pipe(map((res: any) => {
      return res;
    }));
  }
}
