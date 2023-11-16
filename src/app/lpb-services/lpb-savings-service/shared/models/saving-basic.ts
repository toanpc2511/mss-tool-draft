export interface Term {
  termCode: string;
  terms: number[];
}

export interface TermResponse {
  term: string;
  termCode: string;
}

export interface Category {
  category: string;
  code: string;
  codeDesc: string;
  id: string;
}

export interface UDF {
  savingsBook?: string; // Sổ tiết kiệm
  maxCost?: string; // Chi phí HD tối đa
  employeeCode?: string; // Mã nhân viên
  totalAccount?: string; // TK TONG
  unitName?: string; // Tên đơn vị
  mechanism?: string; // Cơ chế
  depositContractNumber?: string; // Số hợp đồng tiền gửi
  vipCustomer?: string; // Khách hàng VIP
  cbnvHdv?: string; // CBNV HDV
  lotteryTicketNumber?: string; // Số phiếu dự thưởng
  maxDueDate?: string; // Ngày đến hạn tối đa
  pgdbd?: string; // PGDBĐ
  depositAmounts?: string; // Các khoản ký quỹ
  unitTaxCode?: string; // MST đơn vị
  socialInsuranceType?: string; // Phân loại BHXH
  onlineChannel?: string; // Kênh online
  cctg?: string; // CCTG
  transferInfo?: string; // Thông tin chuyển nhượng
  fourC_PTTT?: string; // 4C_PTTT
  program?: string; // Chương trình
  oddTermType?: string; // Loại kỳ hạn lẻ ngày
  unitAddress?: string; // Địa chỉ đơn vị
  socialInsuranceProvinceCode?: string; // Mã tỉnh BHXH
  gift?: string; // Qùa tặng
  khoiHo?: string; // KHOI HO
  normalInterestRate?: string; // Lãi suất thường
  postOfficeCode?: string; // Mã bưu cục
  salaryAccount?: string; // TK Lương
  tkbd?: string; // TKBD
  depositMoney?: string; // Tiền gửi ký quỹ
  customerType?: string; // Đối tượng khách hàng
  referralOfficer?: string; // Cán bộ giới thiệu
  accountInterestRateDiscount?: string; // Ưu đãi lãi xuất tài khoản
}

export interface CO_OWNER {
  index?: number;

  cifNo: string;
  fullName: string;
  phoneNumber: string;
  docNum: string;
  docType: string;
  docIssueDate: string;
  docIssuePlace: string;
  address: string;
  ownershipRate: string;
  expirationDate: string;
}
export interface AUTHORIZED_PERSON {
  index?: number;

  cifNo: string;
  fullName: string;
  phoneNumber: string;
  docNum: string;
  docType: string;
  docIssueDate: string;
  docIssuePlace: string;
  address: string;
  authorizationScope: string;
  authorizationDuration: string;
  authorizationStartDate: string;
  authorizationEndDate: string;
}
export interface LEGAL_REPRESENTATIVE {
  index?: number;

  cifNo: string;
  fullName: string;
  birthDate: string;
  docNum: string;
  docType: string;
  issueDate: string;
  issuePlace: string;
  visaExemption: boolean;
  hasExpiration: boolean;
  fromDate: string;
  toDate: string;
  currentAddress: string;
  permanentAddress: string;
  nationality: string;
  mobilePhone: string;
  homePhone: string;
  email: string;
  occupation: string;
  position: string;
  relation: string;
  legalDocument: string;
  guardianType: string;
}

export interface PGDBD {
  branchCode: string;
  branchType: string;
  districtCode: string;
  lendingBranch: string;
  managingBranch: string;
  poOldBranchCode: string;
  poShort: string;
  provinceCode: string;
}
export interface BENEFICIARY {

}
