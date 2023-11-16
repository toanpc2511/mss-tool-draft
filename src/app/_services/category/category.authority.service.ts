import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from '../error-handler.service';
import { environment } from '../../../environments/environment';
import { catchError, map, delay } from 'rxjs/operators';
import { Response } from '../../_models/response';
import { DistrictAndWardModel, MenuGeneralModel } from 'src/app/_models/category.authority';
import { DistrictRequest, WardRequest } from 'src/app/_models/request';
import { AuthorExpireAndAuthorType } from 'src/app/_models/category/categoryList';


@Injectable({
  providedIn: 'root'
})
export class CategoryAuthorityService {
  sub = '/account/';
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) { }
  dto = {};

  // Gioi tinh
  // tslint:disable-next-line:typedef
  apiGender() {
    return this.http
      .post<Response>(`${environment.apiUrl}/process/gender/listAll`, this.dto);
  }
  // tslint:disable-next-line:typedef
  getGenders() {
    return this.apiGender().pipe(map(data => data.items.map(item => new MenuGeneralModel(item)),
      catchError(this.errorHandler.handleError)));
  }
  // Loai giay to tuy than
  // tslint:disable-next-line:typedef
  apiPerDocType() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}perDocType/listAll`).pipe();
  }
  // tslint:disable-next-line:typedef
  getPerDocTypes() {
    return this.apiPerDocType().pipe(map(data => data.items.map(item => new MenuGeneralModel(item)),
      catchError(this.errorHandler.handleError)));
  }
  // Nganh nghe
  // tslint:disable-next-line:typedef
  apiIndustry() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}industry/listAll`);
  }
  // tslint:disable-next-line:typedef
  getIndustries() {
    return this.apiIndustry().pipe(map(data => data.items.map(item => new MenuGeneralModel(item)),
      catchError(this.errorHandler.handleError)));
  }
  // pham vi uy quyen
  // tslint:disable-next-line:typedef
  getAuthorType() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}/authorType/listAll`);
  }
  // tslint:disable-next-line:typedef
  getLstAuthorType() {
    return this.getAuthorType().pipe(map(data => data.items.map(item => new AuthorExpireAndAuthorType(item)),
      catchError(this.errorHandler.handleError)));
  }

  // thoi gian uy quyen
  // tslint:disable-next-line:typedef
  getAuthorExpire() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}/authorExpire/listAll`);
  }
  // tslint:disable-next-line:typedef
  getLstAuthorExpire() {
    return this.getAuthorExpire().pipe(map(data => data.items.map(item => new AuthorExpireAndAuthorType(item)),
      catchError(this.errorHandler.handleError)));
  }

  /* Dia chi hien tai, thuong tru cua khach hang */
  // Quoc tich, quoc gia
  // tslint:disable-next-line:typedef
  apiCountry() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}country/listAll`);
  }
  // tslint:disable-next-line:typedef
  getCountries() {
    return this.apiCountry().pipe(map(data => data.items.map(item => new MenuGeneralModel(item)),
      catchError(this.errorHandler.handleError)));
  }

  // Tinh/ thanh pho
  // tslint:disable-next-line:typedef
  apiCity() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}city/listAll`);
  }
  // tslint:disable-next-line:typedef
  getCities() {
    return this.apiCity().pipe(map(data => data.items.map(item => new MenuGeneralModel(item)), catchError(this.errorHandler.handleError)));
  }

  // Quan/ huyen
  // tslint:disable-next-line:typedef
  apiDistrict(cityName: any) {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}district/listAll`, cityName);
  }
  // tslint:disable-next-line:typedef
  getDistrictByCityId(code: string) {
    // let requestObj = new DistrictRequest(cityCode)
    const cityName = {};
    // tslint:disable-next-line:no-string-literal
    cityName['cityName'] = code;
    return this.apiDistrict(cityName).pipe(map(data => data.items.map(item => new DistrictAndWardModel(item)),
      catchError(this.errorHandler.handleError)));
  }

  // Phuong/ xa
  // tslint:disable-next-line:typedef
  apiWard(districName: any) {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}ward/listAll`, districName);
  }
  // tslint:disable-next-line:typedef
  getWardByDistrictId(code: string) {
    const districtName = {};
    // tslint:disable-next-line:no-string-literal
    districtName['districtName'] = code;
    return this.apiWard(districtName).pipe(map(data => data.items.map(item => new DistrictAndWardModel(item)),
      catchError(this.errorHandler.handleError)));
  }
  /* Ket thuc Dia chi hien tai, thuong tru */

}


