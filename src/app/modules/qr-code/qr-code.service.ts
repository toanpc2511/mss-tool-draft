import { Injectable } from '@angular/core';
import { HttpService } from '../../shared/services/http.service';
import { HttpParams } from '@angular/common/http';
import { ISortData } from '../product/product.service';

export interface IQrProductOther {
  categoryId: number,
  categoryName: string,
  id: number,
  code: string,
  price: number,
  productName: string,
  status: string,
  valueAddedTax: number,
  qrCodeProduct: {
    id: number,
    description: string,
    title: string,
    qrCodeImage: {
      id: number,
      typeMedia: string,
      url: string
    }
  }
}

export interface IQrPumpHose {
  code: string,
  hose: string,
  id: number,
  nameFuel: string,
  pole: null
  price: number,
  qrCode: null
  station: string,
  status: string,
  image: {
    id: number,
    typeMedia: string,
    url: string,
  }
}

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  constructor(
    private http: HttpService
  ) { }

  getListQrCodeProductOther(page: number, size: number, searchText: string, sortData: ISortData) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('field-sort', sortData?.fieldSort || '')
      .set('direction-sort', sortData?.directionSort || '')
      .set('search-text', searchText || '');
    return this.http.get<Array<IQrProductOther>>('qrs/products/others', {params});
  }

  getListQrCodePumlHose() {
    return this.http.get<Array<IQrPumpHose>>('qrs/hoses');
  }
}
