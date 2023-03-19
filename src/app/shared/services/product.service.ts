import { Observable } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	constructor(private http: HttpService) {}
	getListProduct(params) {
		return this.http.get<IProduct[]>('products', { params });
	}

	deleteProduct(id: string) {
		return this.http.delete(`products/${id}`);
	}

	createProduct(body): Observable<any> {
		return this.http.post('products', body);
	}

	getDetailProduct(id: string) {
		return this.http.get<IProduct>(`product/${id}`);
	}
}

export interface IProduct {
	createdAt: string;
	id: string;
	images: string;
	model: string;
	name: string;
	price: string;
	quantity: number;
	updatedAt: string;
}
