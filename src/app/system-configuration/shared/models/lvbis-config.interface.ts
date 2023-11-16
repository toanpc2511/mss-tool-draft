export interface ISupplier {
  id: string;
  supplierName: string;
  supplierCode: string;
  supplierAuthMethod: string;
  domain: string;
  apiDataFormat: string;
  description: string;
  address: string;
  serviceType: string; // 'WATER_SERVICE'
  statusName: string;
  statusCode: string;
  supplierMetadata: IMetadataSupplier;
  supplierFormGroups: any;
  createdDate: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  serviceTypeCode?: string;
  brnManager: string;
}

export interface IServiceBankInfo {
  bankAccountBrnCode: string;
  bankAccountBrnName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  cif: string;
}

export interface IMetadataSupplier {
  billFormat: string;
  merchantId: string;
  minPayment: string;
  paymentMethod: string;
  prefixFormat: string;
  productCode: string;
  service: string;
  serviceId: string;
  type: string;
  serviceBankInfo?: IServiceBankInfo;
}

export interface IPaymentRule {
  id: string;
  name: string;
  code: string;
  description: string;
  address: string;
  ruleResponses: IRuleResponse[];
}

export interface IRuleResponse {
  id: string;
  name: string;
  code: string;
  selected: boolean;
}

export interface ISupplierElectric {
  id: string;
  supplierName: string;
  supplierCode: string;
  serviceTypeCode: 'ELECTRIC_SERVICE';
  serviceTypeName: string;
  statusCode: 'INACTIVE' | 'ACTIVE';
  statusName: string;
  supplierMetadata: ISupplierMetadataElectric;
  supplierFormGroups: ISupplierFormGroupsElectric[];
  lastModifiedDate: number;
  lastModifiedBy: string;
  typeConfigs?: { value: string, label: string };
}

export interface ISupplierMetadataElectric {
  type: 'ELECTRIC_SERVICE';
  service: string;
  serviceId: string;
  moduleId: string;
  productCode: string;
  merchantId: string;
  minPayment: string;
  paymentConfigType: 'PRIVATE' | 'SHARED';
  specialBankInfo: IBankInfoElectric;
  serviceBankInfo: IBankInfoElectric;
  prefixFormat: string;
  billFormat: string;
}

export interface IBankInfoElectric {
  cif: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankAccountBrnCode: string;
  bankAccountBrnName: string;
}

export interface ISupplierFormGroupsElectric {
  id: string;
  name: string;
  code: string;
  description: string;
  address: string;
  ruleName?: string;
  ruleResponses: IRuleResponsesElectric[];
}

export interface IRuleResponsesElectric {
  id: string;
  name: string;
  code: string;
  selected: boolean;
}
// Loai quy tac Hoc phi
export interface IPaymentGroupTuition {
  id: string;
  name: string;
  code: string;
  isActive: number;
  ruleResponses: IRuleResponseTuition[];
}

// Chi tiet quy tac thanh toan Hoc phi
export interface IRuleResponseTuition {
  id: string;
  name: string;
  code: string;
  description: string;
  isActive: number;
}

export interface IUniversity {
  id: string;
  name: string;
  code: string;
  typeConnect: string;
  typeConnectName: string;
  typeSemesterPay: string;
  typeSemesterPayName: string;
  typePayment: string;
  typePaymentName: string;
  statusCode: string;
  accNo: string;
  customerNo: string;
  accVat: string;
  accFee: string;
  accName: string;
  branchAccNo: string;
  universityMetadata: IMetadataUniversity;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

export interface IMetadataUniversity {
  type: string;
  service: string;
  serviceId: string;
  productCode: string;
  merchantId: string;
  prefixFormat: string;
  billFormat: string;
}

export interface IAccount {
  accountNumber: string;
  accountName: string;
  branchCode: string;
  custClass: string;
  accountType: string;
  acyCurr_Balance: string;
}
export interface ISupplierViettelPost {
  id: string;
  name: string;
  code: string;
  isActive: string;
  isActiveName: string;
  cif: string;
  accNo: string;
  accName: string;
  accBranch: string;
  content: string;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}
