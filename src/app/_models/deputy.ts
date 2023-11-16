export class GuardianList {
  guardianTypeCode: string; // Mã loại Đại diện pháp luật đang mặc định  truyền INDIV_GUARDIAN
  guardianRelationCode: string; // Mã loại quan hệ của ĐDPL
  actionCode: string; // thêm mới truyền C
  customer: Customer = new Customer();
  inEffect: any;
  status: string;
  id: string;
  customerCode: string;
}

export class Customer {
  // nếu search từ phía code về thì truyền
  id: string;
  customerCode: string;
  customerTypeCode: string;
  customerCategoryCode: string;
  mnemonicName: string;
  employeeId: string;
  branchCode: string;
  actionCode = 'C';
  // kết thúc
  person: DeputyCif = new DeputyCif();
}

export class DeputyCif {
  id: any;
  fullName: any;
  residentStatus: any;
  dateOfBirth: any;
  // perDocNo: any
  genderCode: any;
  mobileNo: any;
  guardianRelationCode: any;
  relationshipName: any;
  nationality1Code: any;
  status: any;
  taxCode: any;
  currentCountryCode: any;
  currentCityName: any;
  currentDistrictName: any;
  currentWardName: any;
  currentStreetNumber: any;
  visaExemption: any;
  visaIssueDate: any;
  visaExpireDate: any;
  idIndex: number; // id ảo
  perDocNoList: PerDocNoList[] = [];
  actionCode = 'C';
}

export class PerDocNoList {
  id: string;
  perDocIndex: number;
  perDocTypeCode: string;
  perDocNo: string;
  issueDate: any;
  issuePlace: string;
  expireDate: any;
}
