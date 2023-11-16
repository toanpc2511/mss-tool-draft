export interface Withdraw {
  id?: string;
  accountBranchCode: string;
  acn: string;
  branchCode: string;
  cifNo: string;
  curCode: string;
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
  negotiatorDocIssueDate: string;
  negotiatorDocIssuePlace: string;
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
  approveBy?: string;
  approveRevertBy?: string;
  xrefCode?: string;
}

export class PrintedDoc {
  fileContent: string;
  fileName: string;
}

export interface AccountRelationRequest {
  acn: string;
  cif: string;
  docIssueDate: string;
  docNum: string;
  docType: string;
  docTypeOfOwner: string;
}

export interface AccountRelationResponse {
  relType: string;
  relWarningMessage: string;
}

