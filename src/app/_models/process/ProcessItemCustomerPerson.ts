import {PerDocNoList} from './PerDocNoList';
import {Mis, Udf} from '../register.cif';

export class ProcessItemCustomerPerson {
  id: string;
  perDocNoList: PerDocNoList[] = [];

  customerId: string;
  fullName: string;
  genderCode: string;
  genderName: string;
  dateOfBirth: string;
  mobileNo: string;
  residentStatus: string;
  profession: string;
  position: string;
  nationality1Code: string;
  nationality1Name: string;
  nationality2Code: string;
  nationality2Name: string;
  nationality3Code: string;
  nationality3Name: string;
  nationality4Code: string;
  nationality4Name: string;
  workPlace: string;
  email: string;
  payStatus: string;
  creditStatus: string;
  visaExemption: string;
  visaIssueDate: string;
  visaExpireDate: string;
  residenceCountryCode: string;
  residenceCountryName: string;
  residenceCityName: string;
  residenceCityName2: string;
  residenceDistrictName: string;
  residenceWardName: string;
  residenceStreetNumber: string;
  currentCountryCode: string;
  currentCountryName: string;
  currentCityName: string;
  currentCityName2: string;
  currentDistrictName: string;
  currentWardName: string;
  currentStreetNumber: string;
  taxCode: string;
  language: string;
  fatcaCode: string;
  fatcaName: string;
  fatcaAnswer: string;
  rowNum: string;
}
