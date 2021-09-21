import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { ProductModel } from './product.model';

export interface IProductInfo {
	id: number;
	productId: number;
	area: string;
	unit: string;
	price: number;
	discount: number;
	status: string;
}

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
	private productList: ProductModel[] = [];
	constructor(private http: HttpService) {}
	// Nhóm sản phẩm
	getListProductType() {
		return this.http.get<IProductType[]>('categories/actives');
	}

	getProductList() {
		return this.productList.slice();
	}

	addProduct(product: ProductModel) {
		this.productList.push(product);
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
		return this.http.get<IProduct[]>(`products/categories/${categoryId}`);
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

	getProductInfo(productId: number, rankId: string, areaProduct: string) {
		const params = new HttpParams()
			.set('product-id', productId.toString())
			.set('rank-id', rankId)
			.set('area-product', areaProduct);
		return this.http.get<IProductInfo>('area-products', { params });
	}
}
