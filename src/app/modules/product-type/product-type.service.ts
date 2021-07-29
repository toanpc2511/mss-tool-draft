import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';

export interface ProductTypeResponse {
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

export class ProductTypeService {
  constructor(
    private http: HttpService
  ) {

  }

  getListProductType() {
    return this.http.get<ProductTypeResponse[]>('categories');
  }

  deleteStation(prodTypeId: string | number) {
    return this.http.delete(`categories/${prodTypeId}`);
  }

  createProductType(data: ProductTypeResponse) {
    return this.http.post(`categories`, data);
  }

  updateProductType(id: number, data: ProductTypeResponse) {
    return this.http.put(`categories/${id}`, data);
  }
}
