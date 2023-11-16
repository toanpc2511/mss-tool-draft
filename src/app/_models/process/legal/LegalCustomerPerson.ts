import {PerDocNoList} from '../PerDocNoList';

export class LegalCustomerPerson {
  id: string;
  fullName: string;
  inEffect: any;
  idIndex: number;
  dateOfBirth: string;
  mobileNo: string;
  currentCountryCode: string;
  currentCityName: string;
  currentDistrictName: string;
  currentWardName: string;
  currentStreetNumber: string;
  taxCode: string;
  language: string;
  obj: string;
  status: string;
  perDocNoList: PerDocNoList[] = [];
}
