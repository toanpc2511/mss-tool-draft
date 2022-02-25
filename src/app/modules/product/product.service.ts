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

export interface IInfoProduct {
  categoryId: number;
  code: string;
  description: string;
  entryPrice: number;
  id: number;
  name: string;
  price: number;
  qrCode: string;
  status: string;
  tax: number;
  unit: string;
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
	status: IStatus;
}

export interface IProductType {
	id: number;
	name: string;
	description: string;
	status: IStatus;
	code: string;
	type: string;
}

export interface IProductOther {
	id: number;
	code: string;
	description: string;
	entryPrice: number;
	name: string;
	nameCategory: string;
	price: number;
	valueAddedTax: number;
	createQrCode: boolean;
	status: IStatus;
	categoryId: number;
	unit: string;
}

export interface IValueSearchProduct {
	productType: string;
	productName: string;
	productCode: string;
	importPriceFrom: string;
	importPriceTo: string;
	exportPriceFrom: string;
	exportPriceTo: string;
	status: string;
	qrCode: string;
}

export interface ISortData {
	fieldSort: string;
	directionSort: string;
}

export interface IStatus {
	status: 'ACTIVE' | 'INACTIVE' | 'DELETE';
}

@Injectable({
	providedIn: 'root'
})
export class ProductService {
	private productList: ProductModel[] = [];
	constructor(private http: HttpService) {}
	// Nhóm sản phẩm
	getListProductType() {
		return this.http.get<IProductType[]>('categories');
	}

	getListProductTypeOther() {
		return this.http.get<IProductType[]>('categories/other');
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
		return this.http.get<IProduct[]>(`products/category/${categoryId}`);
	}

	getListOilProduct() {
		return this.http.get<IProduct[]>(`products/products-oils`);
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

	// Danh sách sản phẩm khác
	getListProductOther(page: number, size: number, data: IValueSearchProduct, sortData: ISortData) {
		const params = new HttpParams()
			.set('page', page.toString())
			.set('size', size.toString())
			.set('field-sort', sortData?.fieldSort || '')
			.set('direction-sort', sortData?.directionSort || '')
			.set('name', data.productName)
			.set('code', data.productCode)
			.set('status', data.status)
			.set('status-qr', data.qrCode)
			.set('category-id', data.productType)
			.set('price-biggest', data.exportPriceTo)
			.set('price-smallest', data.exportPriceFrom)
			.set('entry-price-biggest', data.importPriceTo)
			.set('entry-price-smallest', data.importPriceFrom);

		return this.http.get('products/filters', { params });
	}

	createProductOther(data: IProductOther) {
		return this.http.post(`products/except-oils`, data);
	}

	updateProductOther(id: number, data: IProductOther) {
		return this.http.put(`products/except-oils/${id}`, data);
	}

	deleteProductOther(productId: string | number) {
		return this.http.delete(`products/except-oils/${productId}`);
	}

	getInfoProductOther(id: number) {
		return this.http.get<IInfoProduct>(`products/other/${id}`);
	}
}
