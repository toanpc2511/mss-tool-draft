import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export interface IProduct {
  id: number;
  code: string;
  name: string;
  importPrice: number;
  priceZone1: number;
  priceZone2: number;
  unit: string;
  vat: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
}

export interface IProductType {
  id: number;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
  code: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  constructor(
    private http: HttpService
  ) {

  }
  // Nhóm sản phẩm
  getListProductType() {
    return this.http.get<IProductType[]>('categories');
  }

  deleteStation(prodTypeId: string | number) {
    return this.http.delete(`categories/${prodTypeId}`);
  }

  createProductType(data: IProductType) {
    return this.http.post(`categories`, data);
  }

  updateProductType(id: number, data: IProductType) {
    return this.http.put(`categories/${id}`, data);
  }

  // Danh sách sản phẩm
  getListProduct() {
    return this.http.get<IProduct[]>('');
  }

  deleteProduct(prodId: string | number) {
    return this.http.delete(`/${prodId}`);
  }

  createProduct(data: IProduct) {
    return this.http.post(``, data);
  }

  updateProduct(id: number, data: IProduct) {
    return this.http.put(``, data);
  }
}
