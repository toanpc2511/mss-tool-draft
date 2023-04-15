import { Observable } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';
import { Injectable } from '@angular/core';
import { IBrand, ICategory, IProduct } from '../models/shared.interface';

@Injectable({
	providedIn: 'root'
})
export class SharedService {
	constructor(private http: HttpService) {}

	// Service brand
	getBrands() {
		return this.http.get<IBrand[]>('brands');
	}

	createBrand(body: any) {
		return this.http.post('brands', body);
	}

	editBrand(id: string, body: any) {
		return this.http.put<any>(`brands/${id}`, body);
	}

	deleteBrand(id: string) {
		return this.http.delete(`brands/${id}`);
	}

	// Service category
	getListCategory(): Observable<any> {
		return this.http.get<ICategory[]>('categories');
	}
	createCategory(body) {
		return this.http.post('categories', body);
	}
	editCategory(body, id: string) {
		return this.http.put(`categories/${id}`, body);
	}
	deleteCategory(id: string) {
		return this.http.delete(`categories/${id}`);
	}

	//Service product
	getListProduct(params) {
		return this.http.get<IProduct[]>('products', { params });
	}

	deleteProduct(id: string) {
		return this.http.delete(`products/${id}`);
	}

	createProduct(body) {
		return this.http.post('products', body);
	}

	updateProduct(body, id: string) {
		return this.http.put(`products/${id}`, body, {});
	}

	getDetailProduct(id: string) {
		return this.http.get<IProduct>(`products/${id}`);
	}

	// Service property
	getListProperty() {
		return this.http.get<any>('product-attribute');
	}

	createProperty(body: any) {
		return this.http.post('product-attribute', body);
	}

	updateProperty(id: string, body: any) {
		return this.http.put(`product-attribute/${id}`, body, {});
	}

	deleteProperty(id: string) {
		return this.http.delete(`product-attribute/${id}`);
	}

	// Service Order
	getListOrder(params: any) {
		return this.http.get<any>('orders', { params });
	}
}
