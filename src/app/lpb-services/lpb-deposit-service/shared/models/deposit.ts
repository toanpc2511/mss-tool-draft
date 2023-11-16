import { Meta } from './common';

export interface DepositTable {
  id: string;
  accountBranch: string;
  acn: string;
  approveBy: string;
  approveDate: string;
  approveNote: string;
  approveRevertBy: string;
  approveRevertDate: string;
  approveRevertNote: string;
  cifNo: string;
  createBy: string;
  createDate: string;
  curCode: string;
  docNum: string;
  docType: string;
  note: string;
  productCode: string;
  sendBy: string;
  sendDate: string;
  sendNote: string;
  status: string;
  transCode: string;
  transactionAmount: number;
}
export interface Deposit {
  id?: string;
  accountBranchCode: string;
  acn: string;
  branchCode: string;
  cifNo: string;
  curCode: string;
  docIssueDate: string;
  docIssuePlace: string;
  docNum: string;
  docType: string;
  employeeId: string;
  feeJson: string;
  feeType: string;
  accountName: string;
  customerName: string;
  negotiatorAddress: string;
  negotiatorDocNum: string;
  negotiatorDocType: string;
  negotiatorFullName: string;
  negotiatorPhone: string;
  note: string;
  productCode: string;
  receiptJson: string;
  totalAmount: number;
  transactionAmount: number;
  status?: string;
  createdBy?: string;
  approveNote?: string;
  approveRevertNote?: string;
  version?: number;
  approveDate?: number;
  approveRevertDate?: number;
  createdDate?: number;
  approveBy?: string,
  approveRevertBy?: string,
  transCode?: string;
  xrefCode?: string;
}

export interface DepositForm {
  accountBranch: string;
  acn: string;
  approveBy: string;
  approveDate: string;
  approveNote: string;
  approveRevertBy: string;
  approveRevertDate: string;
  approveRevertNote: string;
  cifNo: string;
  createBy: string;
  createDate: string;
  curCode: string;
  docIssueDate: string;
  docIssuePlace: string;
  docNum: string;
  docType: string;
  feeJson: string;
  feeType: string;
  id: string;
  negotiatorAddress: string;
  negotiatorDocNum: string;
  negotiatorDocType: string;
  negotiatorFullName: string;
  negotiatorPhone: string;
  note: string;
  productCode: string;
  receiptJson: string;
  sendBy: string;
  sendDate: string;
  sendNote: string;
  status: string;
  totalAmount: number;
  transCode: string;
  transactionAmount: number;
}


export interface SearchDepositRequest {
  accountBranch: string;
  acn: string;
  cifNo: string;
  docNum: string;
  docType: string;
  note: string;
  productCode: string;
  sendBy: string;
  sendDateFrom: string;
  sendDateTo: string;
  status: string;
  transCode: string;
}

export interface SearchDepositResponse {
  data: DepositTable[];
  meta: Meta;
}
export interface SearchDepositByIdRequest {
  id: string;
}

export interface SearchDepositByIdRespose {
  data: DepositForm[];
  meta: Meta;
}

export interface DepositResponse {
  data: Deposit;
  meta: Meta;
}

export interface DepositApproveRequest {
  id: string;
  note?: string;
  version: number;
}

export interface PrintResponse {
  data: PrintedDoc;
  meta: Meta;
}

export class PrintedDoc {
  fileContent: string;
  fileName: string;
}

export interface AccountBalance {
  avalBal: number;
  overdraftAvalBal: number;
}

export interface PrintedCurrentForm {
  acn: string;
  branchCityName: string;
  branchName: string;
  customerName: string;
  docIssueDate: string;
  docIssuePlace: string;
  docNum: string;
  id: string;
  withBank: string;

  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  transId?: string;
  version?: number;
}
