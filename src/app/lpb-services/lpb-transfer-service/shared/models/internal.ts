import { CommonTransfer } from "./common";

/*
Approve Models
*/
export interface InternalTransfer extends CommonTransfer{
  accountBranchCode: string;
  acn: string;
  accountName: string;
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
  recipientCif: string;
  employeeId: string;

  recipientAcn?: string;
  recipientBranchCode?: string;
  recipientDocIssueDate?: string;
  recipientDocIssuePlace?: string;
  recipientAccountName?: string;
  recipientDocNum?: string;
  recipientDocType?: string;
  recipientFullName?: string;

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
/*
Approve Models
*/

/*
Search Models
*/
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
}
/*
End Search Models
*/
