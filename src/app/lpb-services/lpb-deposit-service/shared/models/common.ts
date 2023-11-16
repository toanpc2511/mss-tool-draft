import { ResponseStatus } from 'src/app/_models/response';
export interface Meta {
  code: string;
  errors: [
    {
      description: string;
      field: string;
    }
  ];
  message: string;
  page: 0;
  size: 0;
  total: 0;
}
export interface BranchInfo {
  id: string;
  parentId: string;
  name: string;
  code: string;
  phone: string;
  fax: string;
  contactName: string;
  email: string;
  address: string;
  cityCode: string;
  districtCode: string;
  displayPriority: string;
  statusCode: string;
  createdDate: string;
  createdBy: string;
  modifiedDate: string;
  modifiedBy: string;
  branchCodeName: string;
}

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

export interface CustomerInfoResponse {
  data: CustomerInfo[];
  meta: Meta;
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
  address: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  addressLine4: string;
  accounts: Account[];
}

export interface GetAccountRequest {
  cifNo?: string;
  acn?: string;
  docNum?: string;
  docType?: string;
}
export interface GetAccountsResponse {
  data: Account[];
  meta: Meta;
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

export interface FeeItem {
  curCode: string;
  feeAmount: string | number;
  feeAmountMin: string | number;
  feeAmountMax: string | number;
  vat: string | number;
  vatMax: string | number;
  vatMin: string | number;
}

export interface FeeCalculationResponse {
  data: FeeCalculationData;
  meta: Meta;
}

export interface FeeCalculationData {
  feeItems: FeeItem[];
  exchangeRate: string | number;
}

export interface SignatureInfoResponse {
  data: SignatureInfo[];
  meta: Meta;
}

export interface AccountStatus {
  noDrStatus: string;
  noCrStatus: string;
  frozenStatus: string;
  blockStatus: string;
}
