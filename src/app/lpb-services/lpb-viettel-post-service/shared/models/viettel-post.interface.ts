export interface ICifSearch {
  accountNumber: string;
  accountName: string;
  branchCode?: string;
  custClass?: string;
  availableBalance?: string;
  acyCurr_Balance?: string;
}
export interface ITransaction {
  id: string;
  trnBrn: string;
  trnName: string;
  trnDesc: string;
  trnDt: string;
  module: string;
  makerId: string;
  makerDt: string;
  checkerId: string;
  checkerDt: string;
  billCode: string;
  cif: string;
  paymentType: string;
  totalAmount: number;
  staffId: string;
  staffName: string;
  accNumber: string;
  accName: string;
  accBrn: string;
  xref: string;
  status: string;
  statusName: string;
  htStatus: string;
  htStatusName: string;
  gnStatus: string;
  gnStatusName: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  ccy: string;
  paymentChannel: string;
  preBalance: number;
  revertCoreRefNo: string;
  tillId: string;
  coreRefNo: string;
  revertXref: string;
  tranNo: string;
  billType: string;
  billStatus: string;
  billAmount: number;
  settleAmount: number;
  amtUnit: string;
  employeeName: string;
  paymentBankId: string;
  grandTotal: string;
  paymentBankCode: string;
  description: string;
  employeeId: string;
  documentNo: string;
  orgCode: string;
  accountNo: string;
  documentId: string;
  postCode: string;
  statusPartner: string;
  customerNo: string;
  payerName: string;
  payerGttt: string;
  payerGtttDate: string;
  statusCheck: string;
  billDesc: string;
  transactionPostResponses: ITransactionPost [];
  categoryCashResponses: ICategoryCash [];
}

export interface ITransactionPost {
  transactionId: string;
  acNo: string;
  acCcy: string;
  acBranch: string;
  acName: string;
  custGl: string;
  bankCode: string;
  drcrInd: string;
  amount: number;
  fcyAmount: string;
  amountTag: string;
  eventCode: string;
  eventSeqNo: string;
  lastModifiedDt: string;
  trnStat: string;
  recordStatus: string;
  recordStatusName: string;
  relatedCustomer: string;
  relatedAccount: string;
  relatedReference: string;
  coreRefNo: string;
  coreTxnDt: string;
  corePostDt: string;
  coreBlockNo: string;
  coreBlockDt: string;
  extCustNo: string;
  extScrAccount: string;
  extDesAccount: string;
  extRefNo: string;
  extValueDt: string;
  produceCode: string;
  trnUnique: string;
  htStatus: string;
  htStatusName: string;
  acNumber: string;
}
export interface ICategoryCash {
  id: string;
  transId: string;
  denomination: string;
  quantity: string;
  total: string;
}
