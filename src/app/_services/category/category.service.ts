import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ErrorHandlerService} from '../error-handler.service';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {Response} from '../../_models/response';
import {Category, RegisType} from '../../_models/category/category';
import {DistrictRequest, WardRequest} from '../../_models/request';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  sub = '/process/';

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlerService
  ) {
  }

  dto = {};

  // Gioi tinh
  // tslint:disable-next-line:typedef
  apiGender() {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}gender/listAll`, this.dto);
  }

  // đầu số điện thoại
  // tslint:disable-next-line:typedef
  getConfigSetting() {
    return this.http.get<Response>(`${environment.apiUrl}/process/userView/settingListAll`, this.dto);
  }

  // tslint:disable-next-line:typedef
  getGenders() {
    return this.apiGender().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  // Loai giay to tuy than
  // tslint:disable-next-line:typedef
  apiPerDocType() {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}perDocType/listAll`, this.dto);
  }

  // tslint:disable-next-line:typedef
  getPerDocTypes() {
    return this.apiPerDocType().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  // Nganh nghe
  // tslint:disable-next-line:typedef
  apiIndustry() {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}profession/listAll`, this.dto);
  }

  // tslint:disable-next-line:typedef
  getIndustries() {
    return this.apiIndustry().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  // Trinh do hon nhan
  // tslint:disable-next-line:typedef
  apiMaritalStatus() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}maritalStatus/listAll`);
  }

  // Chi nhanh
  // tslint:disable-next-line:typedef
  apiBranch() {
    return this.http
      .get<Response>(`${environment.apiUrl}/process/userView/branchListAll`);
  }

  // tslint:disable-next-line:typedef
  getBranch() {
    return this.apiBranch().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  // sector
  // tslint:disable-next-line:typedef
  apiSector() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}sector/listAll`);
  }

  // tslint:disable-next-line:typedef
  getSector() {
    return this.apiSector().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  // Chuc vu
  // tslint:disable-next-line:typedef
  apiPosition() {
    return this.http
      .get<Response>(`${environment.apiUrl}${this.sub}position/listAll`);
  }

  // tslint:disable-next-line:typedef
  getPosition() {
    return this.apiPosition().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  /* Dia chi hien tai, thuong tru cua khach hang */

  // Quoc tich, quoc gia
  // tslint:disable-next-line:typedef
  apiCountry() {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}country/listAll`, this.dto);
  }

  // tslint:disable-next-line:typedef
  getCountries() {
    return this.apiCountry().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  // Tinh/ thanh pho
  // tslint:disable-next-line:typedef
  apiCity() {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}city/listAll`, this.dto);
  }

  // tslint:disable-next-line:typedef
  getCities() {
    return this.apiCity().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  // Quan/ huyen
  // tslint:disable-next-line:typedef
  apiDistrict(requestBody: DistrictRequest) {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}district/listAll`, requestBody);
  }

  // tslint:disable-next-line:typedef
  getDistrictByCityId(cityId: string) {
    const requestObj = new DistrictRequest(cityId);
    return this.apiDistrict(requestObj).pipe(map(data => data.items?.map(item => new Category(item)),
      catchError(this.errorHandler.handleError)));
  }

  // Phuong/ xa
  // tslint:disable-next-line:typedef
  apiWard(requestBody: WardRequest) {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}ward/listAll`, requestBody);
  }

  // tslint:disable-next-line:typedef
  getWardByDistrictId(districtId: string) {
    const requestObj = new WardRequest(districtId);
    return this.apiWard(requestObj).pipe(map(data => data.items?.map(item => new Category(item)),
      catchError(this.errorHandler.handleError)));
  }

  /* Ket thuc Dia chi hien tai, thuong tru */

  // FATCA
  // tslint:disable-next-line:typedef
  apiFATCA() {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}fatca/listAll`, this.dto);
  }

  // tslint:disable-next-line:typedef
  FATCAForm() {
    return this.http.post<Response>(`${environment.apiUrl}${this.sub}fatcaForm/listAll`, this.dto);
  }

  getApiFATCAForm(): any {
    return this.FATCAForm().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  getApiFATCA(): any {
    return this.apiFATCA().pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  // Trang thai ho so
  getProcessStatus(): any {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}processStatus/listAll`, {})
      .pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  // Loai khach hang

  getCustomerType(): any {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}customerType/listAll`, {})
      .pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  getPerDocPlace(): any {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}perDocPlace/listAll`, {})
      .pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
  }

  getRelationShipLegalList(): any {
    return this.http
      .post<Response>(`${environment.apiUrl}${this.sub}legalObjectType/listAll`, {})
      .pipe(map(data => data.items.map(item => new Category(item)), catchError(this.errorHandler.handleError)));
    // return this.http.post<any>(`${environment.apiUrl}/process/guardianRelation/listAll`,this.dto);
  }


  // Trang thai cif
  getCifStatus(): any {
    return this.http.post<Response>(`${environment.apiUrl}/process/customerStatus/listAll`, this.dto);
  }

  // Loai dich vu
  getIntegratedType(): any {
    return this.http.post<Response>(`${environment.apiUrl}/process/integratedType/listAll`, this.dto);
  }

  // Trang thai dich vu
  getIntegratedStatus(): any {
    return this.http.post<Response>(`${environment.apiUrl}/process/integratedStatus/listAll`, this.dto);
  }

}
