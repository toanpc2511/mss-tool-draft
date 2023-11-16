import { TRANS_STATUS_CODES } from "../constants/common";

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

export type FEE_CATEGORY = 'VND_Fee' | 'VND_FeeVAT' | 'EX_Fee' | 'EX_FeeVAT';

export type HiddenButton = {
  actionCode: string;
  hiddenType: 'disable' | 'none';
};

export class PrintedDoc {
  fileContent: string;
  fileName: string;
}

export interface SearchResponseData {
  acn: string;
  approveBy: string;
  approveDate: string;
  branchCode: string;
  cifNo: string;
  createdBy: string;
  createdDate: string;
  curCode: string;
  id: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  note: string;
  productCode: string;
  recipientAcn: string;
  status: string;
  statusName: string;
  transCode: string;
  transactionAmount: string | number;
  transType?: TRANS_TYPE
}

export interface CommonTransfer {
  accountBranchCode: string;
  acn: string;
  branchCode: string;
  cifNo: string;
  curCode: string;
  feeJson: string;
  feeType: string;
  note: string;
  productCode: string;
  totalAmount: number;
  transactionAmount: number;
  customerName: string;
  address: string;

  id?: string;
  coreTransCode?: string;
  transCode?: string;
  createdBy?: string;
  createdDate?: string;
  version?: number;
  sendBy?: string;
  sendDate?: string;
  status?: string;
  approveBy?: string;
  approveDate?: string;
  approveNote?: string;
  approveRevertBy?: string;
  approveRevertDate?: string;
  approveRevertNote?: string;
  xrefCode?: string;
}

export interface ApproveRequest {
  id: string;
  note?: string;
  version: number;
}

export type TRANS_TYPE = 'INTERNAL' | 'CITAD' | 'NAPAS';
