import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { HttpService } from '../../shared/services/http.service';
import { IProductInfo } from '../product/product.service';

export interface ISortData {
  fieldSort: string;
  directionSort: string;
}

export interface ICustomers {
  id: number;
  name: string;
  phone: string;
  rank: string;
  location: string;
  profileStatus: 'UNCONFIRMED' | 'SUCCESS' | 'UN_SUCCESS';
  status: 'ACTIVE' | 'LOCK' | 'DELETE';
}

export interface IInfoCutomer {
  id: number;
  name: string;
  phone: string;
  location: string;
  rank: string;
  idCard:  string;
  dateOfBirth: string;
  userType: string;
  accountStatus: 'ACTIVE' | 'LOCK' | 'DELETE';
  profileStatus: 'SUCCESS' | 'UN_SUCCESS' | 'UNCONFIRMED';
  cashLimitMoney: number;
  cashLimitOilAccount: [
    {
      productId: number;
      cashLimitOil: number;
      unitCashLimitOil: string;
    }
  ]
}

export interface IVehicles {
  id: number;
  name: string;
  vehicleCompany: string;
  color: string;
  numberVariable: string;
  type: string;
  credentialImages: [
    {
      id: number;
      url: string;
      type: string;
      name: string;
      face: string;
    }
  ]
}

export interface IAccountChild {
  accountId: number;
  cashLimitMoney: number;
  phone: string;
  status: 'ACTIVE' | 'LOCK' | 'DELETE';
  unitCashLimitMoney: string;
  cashLimitOilResponses: [
    {
      productId: number;
      productName: string;
      cashLimitOil: number;
      unitCashLimitOil: string;
    }
  ];
  numberVariable: [string]
}

export interface IContract {
  id: number;
  name: string;
  code: string;
  contractType: {
    id: number;
    name: string;
    type: string;
    code: string;
  };
  status: string;
  effectEndDate: string;
}

export class StepData {
  currentStep: number;
  step1: {
    isValid: boolean;
    data: UpdateCustomer;
  };
  step2: {
    isValid: boolean;
  };
  step3: {
    isValid: boolean;
  };
  step4: {
    isValid: boolean;
  };
}

export interface UpdateCustomer {
}

@Injectable({
  providedIn: 'root'
})
export class CustomerManagementService {
  private stepDataSubject: BehaviorSubject<StepData>;
  stepData$: Observable<StepData>;

  constructor(private http: HttpService) {
    this.stepDataSubject = new BehaviorSubject<StepData>({
      currentStep: 1,
      step1: { isValid: false, data: null },
      step2: { isValid: false },
      step3: { isValid: false },
      step4: { isValid: false }
    });
    this.stepData$ = this.stepDataSubject.asObservable();
  }

  // Lấy danh sách khách hàng
  getLisrCustomer(page: number, size: number, searchText: string, sortData: ISortData) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('field-sort', sortData?.fieldSort || '')
      .set('direction-sort', sortData?.directionSort || '')
      .set('search-text', searchText || '');

    return this.http.get<Array<ICustomers>>('customers', { params });
  }

  // Cập nhập thông tin khách hàng
  updateCustomer(customerId: number, itemUpdate) {
    return this.http.put(`customers/${customerId}`, itemUpdate);
  }

  //  Lấy thông tin khách hàng
  getCustomerInfo(driverId: number) {
    const params = new HttpParams()
      .set('account-id', driverId.toString())
      .set('user-type', 'ENTERPRISE');

    return this.http.get<Array<IInfoCutomer>>('customers/info', { params });
  }

  // Lấy danh sách xe
  getListVehicles(page: number, size: number, searchText: string, sortData: ISortData, driverId: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('field-sort', sortData?.fieldSort || '')
      .set('direction-sort', sortData?.directionSort || '')
      .set('search-text', searchText || '')
      .set('driver-id', driverId.toString());

    return this.http.get<Array<IVehicles>>('vehicles', { params });
  }

  // Lấy danh sách thông tin tài khoản con

  getListChildAccounts(page: number, size: number, searchText: string, sortData: ISortData, driverId: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('field-sort', sortData?.fieldSort || '')
      .set('direction-sort', sortData?.directionSort || '')
      .set('search-text', searchText || '')
      .set('driver-id', driverId.toString());

    return this.http.get<Array<IAccountChild>>('customers/child-accounts', { params });
  }

  // Lấy danh sách hợp đồng của khách hàng
  getListContractByCustomer(page: number, size: number, searchText: string, sortData: ISortData, driverId: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('field-sort', sortData?.fieldSort || '')
      .set('direction-sort', sortData?.directionSort || '')
      .set('search-text', searchText || '')
      .set('driver-id', driverId.toString());

    return this.http.get<Array<IContract>>('contracts/enterprise', { params });
  }

  setStepData(stepData: StepData) {
    this.stepDataSubject.next(stepData);
  }

  getStepDataValue(): StepData {
    return this.stepDataSubject.value;
  }

  resetCreateData() {
    this.stepDataSubject.next({
      currentStep: 1,
      step1: { isValid: false, data: null },
      step2: { isValid: false },
      step3: { isValid: false },
      step4: { isValid: false }
    });
  }

}
