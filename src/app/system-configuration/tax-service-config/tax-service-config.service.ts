import { Injectable } from '@angular/core';
import {HttpService} from "../../shared/services/http.service";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TaxServiceConfigService {
  url = `${environment.apiUrl}/tax-service`;
  constructor(
    private http: HttpService
  ) { }

  asyncCategory(path: string): Observable<any> {
    return this.http.get(`${this.url}/${path}`, {});
  }
}
