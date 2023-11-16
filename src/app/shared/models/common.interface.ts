export interface Product {
  code: string;
  name: string;
  type: string;
}

// ACCOUNT
export interface Account extends AccountBasic, Partial<AccountStatus> {}
export interface AccountBasic {
  accountBranchCode: string;
  curCode: string;
  acn: string;
  accountName: string;
  availableBalance: string;
}

export interface CustomerInfo {
  cifNo: string;
  docIssueDate: string;
  docIssuePlace: string;
  docNum: string;
  docType: string;
  fullName: string;
  customerType: string;
  identificationType: string;
  nation: string;
  address: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  accounts: Account[];
}

export interface IdentityProfile {
  docName: string;
  docTitle: string;
  fileContent: string;
  fileType: string;
  isImage?: boolean;
  mimeType?: string;
  fileUrl?: string;
}

export interface SignatureInfo {
  effectiveDate: string;
  fileContent: string;
  sigName: string;
  sigTitle: string;
  fileType: string;
  isImage?: boolean;
  mimeType?: string;
  fileUrl?: string;
}

export interface FeeCalculationRequest {
  curCode: string;
  productCode: string;
  amount: number;
  branchCode: string;
  acn: string;
}

export interface EmployeeInfo {
  employeeId: string;
  employeeName: string;
}

export interface FeeItem {
  curCode: string;
  feeAmount: string | number;
  feeAmountMin: string | number;
  feeAmountMax: string | number;
  vat: string | number;
  vatMax: string | number;
  vatMin: string | number;
}


export interface FeeCalculationData {
  feeItems: FeeItem[];
  exchangeRate: string | number;
}

export interface AccountStatus {
  noDrStatus: string;
  noCrStatus: string;
  frozenStatus: string;
  blockStatus: string;
}

export type GetCustomerInfoInputType = 'cif' | 'gtxm' | 'acn';

export interface ApproveRequest {
  id: string;
  note?: string;
  version: number;
}

export class PrintedDoc {
  fileContent: string;
  fileName: string;
}

export interface AccountBalance {
  avalBal: number;
  overdraftAvalBal: number;
}
