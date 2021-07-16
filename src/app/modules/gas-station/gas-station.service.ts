import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GasStationService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getGasStation(): Observable<DataResponse<any>> {
    return this.http.get<DataResponse<any>>(`${this.apiUrl}/gas-stations`);
  }
}
