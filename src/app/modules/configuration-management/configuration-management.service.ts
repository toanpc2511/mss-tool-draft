import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export interface IRank {
  id: number;
  name: string;
  score: number;
  introduction: string;
  policy: string;
  promotion: string;
}

export interface IRankStock {
  id: number;
  nameRank: string;
  nameProduct: string;
  scoreExportInvoice: number;
  scoreNoInvoice: number;
  discount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationManagementService {
  constructor(private http: HttpService) {
  }

  // Lấy danh sách cấu hình hạng
  getListRank() {
    return this.http.get<Array<IRank>>('ranks');
  }

  // Sửa cấu hình hạng
  updateRankConfig(rankConfig) {
    return this.http.put<any>(`ranks`, rankConfig);
  }

  // Lấy ds cấu hình tích điểm
  getListRankStock() {
    return this.http.get<Array<IRankStock>>('rank-stock');
  }
}
