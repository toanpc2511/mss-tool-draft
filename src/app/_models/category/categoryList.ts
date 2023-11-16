import { DistrictAndWardModel, MenuGeneralModel } from '../category.authority';
import {Category, Phone} from './category';

export class CategoryList {

  genders: Category[];
  perDocTypes: Category[];
  perRelationTypes: Category[];
  perRelationSubject: Category[];
  industries: Category[];
  currentWards: Category[];
  permanentWards: Category[];
  currentDistricts: Category[];
  permanentDistricts: Category[];
  countries: Category[];
  sector: Category[];
  customerStatus: Category[];
  processIntegratedStatus: Category[];
  processStatus: Category[];
  status: Category[];
  maritalStatus: Category[];
  cites: Category[];
  permanentCites: Category[];
  positions: Category[];
  incomes: Category[];
  educations: Category[];
  branches: Category[];
  fatca: Category[];
  phone: Phone[];
  fatcaForm: Category[];
  perDocPlaces: Category[];
  lstRelationShip: Category[] = [];
  cards: Category[];
  sms: Category[];
}

export class CategoryAuthority{
  genders: MenuGeneralModel[];
  perDocTypes: MenuGeneralModel[];
  industries: MenuGeneralModel[];
  countries: MenuGeneralModel[];
  cites: MenuGeneralModel[];
  currentWards: DistrictAndWardModel[];
  permanentWards: DistrictAndWardModel[];
  currentDistricts: DistrictAndWardModel[];
  permanentDistricts: DistrictAndWardModel[];
  authorExpire: AuthorExpireAndAuthorType[];
  authorType: AuthorExpireAndAuthorType[];
}
export class AuthorExpireAndAuthorType{
  code: string;
  name: string;
  id: string;
  constructor(item: any) {
    this.id = item.id;
    this.code = item.code;
    this.name = item.name;
  }
}
