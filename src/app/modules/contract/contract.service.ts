import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

export interface IContract {
  code: string;
  name: string;
  contractType: {
    type: string;
  };
  effectEndDate: string;
  effectStartDate: string;
  status: 'ACCEPTED' | 'REJECT' | 'WAITING_ACCEPT';
}

export interface ISortData {
  fieldSort: string;
  directionSort: string;
}

export interface IRole {
  id: number;
  name: string;
  description: string;
}

export interface IAddress {
  id: number;
  name: string;
  address: string;
  status: 'ACTIVE';
  code: string;
  areaType: string;
  fullAddress: string;
  provinceId: number;
  distric_id: number;
}

export interface IProperties {
  id: number;
  name: string;
  type: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  constructor(private http: HttpService) {}

  getRoles() {
    return this.http.customGet<Array<IRole>>(`${environment.apiUrl1}/permissions/roles`);
  }

  getListContract(page: number, size: number, searchText: string, sortData: ISortData) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page', page.toString())
      .set('size', size.toString())
      .set('field-sort', sortData?.fieldSort || '')
      .set('direction-sort', sortData?.directionSort || '')
      .set('search-text', searchText || '');

    return this.http.get<Array<IContract>>('contracts', { params });
  }

  getAddress() {
    return this.http.get<IAddress[]>('gas-stations/address');
  }

  getProperties(type: string) {
    const params = new HttpParams().set('type',type)
    return this.http.get<IProperties[]>('properties', {params});
  }

  getInfoUser(phone: string) {
    const params = new HttpParams().set('phone-number',phone)
    return this.http.get('drivers/information', {params});
  }

}
