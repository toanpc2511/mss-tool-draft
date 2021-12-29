import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { DataResponse } from '../../shared/models/data-response.model';

export interface ILogGroups {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})

export class ImpactHistoryService {
  constructor(
    private http: HttpService,
    private httpClient: HttpClient
  ) {}

  getLogGroups() {
    return this.httpClient.get<DataResponse<ILogGroups[]>>('https://sunoil-management.firecloud.live/permissions/groups/log');
  }

}
