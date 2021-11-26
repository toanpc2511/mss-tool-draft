import { Injectable } from '@angular/core';
import { HttpService } from '../../../shared/services/http.service';
import { Observable } from 'rxjs';
import { DataResponse } from '../../../shared/models/data-response.model';
import { IImportingInventoryDetail } from './models/importing-inventory-detail.interface';

@Injectable({
  providedIn: 'root'
})
export class ImportInventoryDetailService {

  constructor(private http: HttpService) { }

  getById(id: string): Observable<DataResponse<IImportingInventoryDetail>> {
    return this.http.get<IImportingInventoryDetail>(`warehouse-import/${id}`);
  }

  completeImportingInventoryRequest(data: any, id: string): Observable<DataResponse<boolean>> {
    console.log(data);
    return this.http.put<boolean>(`warehouse-import/${id}`, data);
  }
}
