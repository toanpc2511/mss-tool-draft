import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { DataResponse } from 'src/app/shared/models/data-response.model';

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

export interface IDiscount {
	id: number;
	name: string;
	productName: string;
	moneyDiscount: number;
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

	getListDiscount() {
		let dataFake = [];
		for (let i = 0; i < 20; i++) {
			dataFake = [
				...dataFake,
				{ id: 1, name: `Thân thiết ${i}`, moneyDiscount: 10000 + i, productName: `Dầu gì đó ${i}` }
			];
		}
		return of<DataResponse<IDiscount[]>>({ data: dataFake, meta: { code: 'SUN-OIL-200' } });
	}

  // Lấy ds cấu hình tích điểm
  getListRankStock() {
    return this.http.get<Array<IRankStock>>('rank-stock');
  }

  // Sửa cấu hình tích điểm
  updateRankStock(rankStock) {
    return this.http.put<any>(`rank-stock`, rankStock);
  }
}
