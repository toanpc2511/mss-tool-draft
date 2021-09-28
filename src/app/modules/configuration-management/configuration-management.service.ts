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
	nameProduct: string;
	nameRank: string;
	scoreExportInvoice: number;
	scoreNoInvoice: number;
	discount: number;
	priceAreaTwo: number;
}

export interface IConfigPromotion {
  promotionId: number;
  nameProduct: string;
  amountLiterOrder: number;
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

	// Lấy danh sách cấu hình chiết khấu
	getListDiscount() {
		return this.http.get<Array<IDiscount>>('rank-stock/discounts');
	}

	updateDiscountConfig(discountConfig: any) {
		return this.http.put<any>('rank-stock/discounts', discountConfig);
	}

  // Lấy ds cấu hình tích điểm
  getListRankStock() {
    return this.http.get<Array<IRankStock>>('rank-stock');
  }

  // Sửa cấu hình tích điểm
  updateRankStock(rankStock) {
    return this.http.put<any>(`rank-stock`, rankStock);
  }

  // Lấy ds cấu hình khuyến mại
  getListConfigPromotion() {
    return this.http.get<Array<IConfigPromotion>>('promotions');
  }

  // Xóa cấu hình khuyến mại
  deleteConfigPromotion(id: any) {
    console.log(id);
  }
}
