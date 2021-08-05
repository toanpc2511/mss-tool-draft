import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export interface IProduct {
  id: number;
  code: string;
  name: string;
  price: number;
  entryPrice: number;
  priceAreaOne: number;
  priceAreaTwo: number;
  categoryId: number;
  description: string;
  qrCode: string;
  unit: string;
  valueAddedTax: number;
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

  deleteProductType(prodTypeId: string | number) {
    return this.http.delete(`categories/${prodTypeId}`);
  }

  createProductType(data: IProductType) {
    return this.http.post(`categories`, data);
  }

  updateProductType(id: number, data: IProductType) {
    return this.http.put(`categories/${id}`, data);
  }

  // Danh sách sản phẩm
  getListProduct(categoryId: number) {
    return this.http.get<IProduct[]>(`products/category/${categoryId}`);
  }

  deleteProduct(prodId: string | number) {
    return this.http.delete(`products/${prodId}`);
  }

  createProduct(data: IProduct) {
    return this.http.post(`products/oils`, data);
  }

  updateProduct(id: number, data: IProduct) {
    return this.http.put(`products/oils/${id}`, data);
  }
}
