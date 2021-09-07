import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { HttpParams } from '@angular/common/http';

export interface IRank {
  id: number;
  name: string;
  score: number;
  introduction: string;
  policy: string;
  promotion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationManagementService {
  constructor(private http: HttpService) {}

  // Lấy danh sách cấu hình hạng
  getListRank() {
    return this.http.get<Array<IRank>>('ranks');
  }

  // Sửa cấu hình hạng
  updateRankConfig(rankConfig) {
    return this.http.put<any>(`ranks`, rankConfig);
  }
}
