import {GuardianList} from './deputy';
import {UserUpdateForm} from './user';
import {ReferenceCif} from './RefernceCif/ReferenceCif';
import {OwnerBenefitsCif} from './ownerBenefitsCif';
import {OwnerBenefitsCif2} from './ownerBenefitsCif2';
import {Legal} from './process/legal/Legal';

export class CifModel {
  branchCode: string;
  customer: Customer = new Customer();
  legalList: Legal[];
  guardianList: GuardianList[];
  // employeeId: string
}

export class Customer {
  branchCode: string;
  customerCategoryCode: string;
  customerCode: string; // sẽ chuyền lên code cif đẹp, mặc định ko truyền
  customerTypeCode: string;
  employeeId: string;
  mnemonicName: string;
  person: Person = new Person();
  mis: Mis = new Mis();
  udf: Udf = new Udf();
  guardianList: GuardianList[];
  cifLienQuan: ReferenceCif[];
  customerOwnerBenefit: OwnerBenefitsCif2[];
  actionCode = 'C';
  legalList: Legal[];
}

export class Person {
  dateOfBirth: string;
  creditStatus: boolean;
  currentCityName: string;
  currentCountryCode: string;
  currentCountryName: string;
  currentDistrictName: string;
  currentStreetNumber: string;
  currentWardName: string;
  email: string;
  fullName: string;
  genderCode: string;
  genderName: string;
  mobileNo: string;
  nationality1Code: string;
  nationality1Name: string;
  nationality2Code: string;
  nationality2Name: string;
  nationality3Code: string;
  nationality3Name: string;
  nationality4Code: string;
  nationality4Name: string;
  payStatus: boolean;
  perDocNoList: PerDocNoList[] = [];
  position: string;
  profession: string;
  residenceCityName: string;
  residenceCountryCode: string;
  residenceCountryName: string;
  residenceDistrictName: string;
  residenceStreetNumber: string;
  residenceWardName: string;
  residentStatus: boolean;
  taxNumber: number;
  visaExemption: any;
  visaExpireDate: string;
  visaIssueDate: string;
  workPlace: string;
  language: string;
  fatcaCode: string;
  fatcaName: string;
  fatcaAnswer: string;
}

export class PerDocNoList {
  id: string;
  perDocIndex: number; // số thứ tự giấy tờ tùy thân 1 2 3
  expireDate: string;
  issueDate: string;
  issuePlace: string;
  perDocNo: string;
  perDocTypeCode: string;
  perDocTypeName: string;
  // perDocTypeName:string
}

export class Mis {
  cifLoaiCode: string;
  cifLhktCode: string;
  cifTpktCode: string;
  cifTctdCode: string;
  cifKbhtgCode: string;
  lhnnntvayCode: string;
  tdManktCode: string;
  cifNganhCode: string;
  cifKh78Code: string;
  cifPnkhCode: string;
  comTsctCode: string;
  dcGhCode: string;
  hhxnkCode: string;
  loaiDnCode: string;
  cifManktCode: string;
}

export class Udf {
  canBoGioiThieu: string;
  cifPnkhCode: string;
  tenDoiNgoai: string;
  website: string;
  email: string;
  dienThoai: string;
  tongSoLdHienTai: string;
  nganhNgheKinhDoanh: string;
  tenVietTat: string;
  hoTenVoChong: string;
  coCmndHc: string;
  ngayCapCmndHc: string;
  vonCoDinh: string;
  vonLuuDong: string;
  noPhaiThu: string;
  noPhaiTra: string;
  maHuyenThiXaCode: string;
  viTriToLketVayvonCode: string;
  maTctdCode: string;
  tcKTctdCode: string;
  tongnguonvon: string;
  kyDanhGiaTvn: string;
  khachHangCode: string;
  loaiChuongTrinhCode: string;
  tuNgay: any;
  denNgay: any;
  thuongTatCode: string;
  khutCode: string;
  lvUdCnCaoCifCode: string;
  cnUtpt1483CifCode: string;
  dbKhVayCode: string;
  congTyNhaNuocCode: string;
  groupCodeCode: string;
  noiCapCmndHc: string;
  cifDinhdanhCode: string;
  dangkyDvGdemailDvkd: string;
  tongDoanhThu: string;
  khoiDonViGioiThieuCode: string;
  diaBanNongThonCode: string;
  maCbnvLpbCode: string;
  cifGiamDoc: string;
  cifKeToanTruong: string;
  comboSanPham2018Code: string;
  expiredDate: any;
  pnkhKhdk: string;
  tracuuTtstkwebVivietCode: string;
  sdtNhanSmsGdtetkiem: string;
  soSoBaoHiemXaHoi: string;
  nguoiDaidienPhapluat: string;
  cmndCccdHc: string;
  nhanHdtQuaMail: string;
  kenhTao = 'online';
}
