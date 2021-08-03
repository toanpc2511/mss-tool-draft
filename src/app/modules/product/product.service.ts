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

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  constructor(
    private http: HttpService
  ) {

  }

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
