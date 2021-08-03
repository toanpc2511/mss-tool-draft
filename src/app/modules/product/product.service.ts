import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export interface ProductResponse {
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
    return this.http.get<ProductResponse[]>('');
  }

  deleteProduct(prodId: string | number) {
    return this.http.delete(`/${prodId}`);
  }

  createProduct(data: ProductResponse) {
    return this.http.post(``, data);
  }

  updateProduct(id: number, data: ProductResponse) {
    return this.http.put(``, data);
  }
}
