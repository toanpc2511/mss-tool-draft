export interface ICifSearch {
  accountNumber: string;
  accountName: string;
  branchCode?: string;
  custClass?: string;
  availableBalance?: string;
  acyCurr_Balance?: string;
}

export interface IAgent {
  posId: string;
  accName: string;
  accAddress?: string;
  accPhoneNumber?: string;
  branch: string;
  vpaymentId: string;
  accountCore: string;
  code: string; // Ma chi nhanh quan ly
  name: string; // Ten chi nhanh quan ly
  recordStat: string;
  available: string;
}

export interface ITransaction {
  id: string;
  transactionId: string;
  posId: string;
  posName: string;
  posAddress: string;
  posMobi: string;
  amount: number;
  transactionCode: string;
  trnDesc: string;
  feeDv?: number;
  vatDv?: number;
  fee?: string;
  vat?: string;
  recordStatus: string;
  recordStatusName: string;
  makerId: string;
  makerDt: string;
  checkerId?: string;
  checkerDt?: string;
  sendMsgStatus?: string;
  trnDt?: string;
  trnBrn: string;
  cusNo: string;
  cusName: string;
  cusType: string;
  accNo: string;
  accDesc: string;
  accBranch: string;
  accCcy: string;
  accDrcr: string;
  chanelCode: string;
  serviceCode: string;
  productCode: string;
  accAvaiBalance: number;
  partnerAccNo: string;
  partnerAccName: string;
  authStat: string;
  vietlottErpError: string;
  vietlottErpDesc: string;
  vietlottBerError: string;
  vietlottBerDesc: string;
  recentErp: string;
  recentBer: string;
  lienvietErr: string;
  lienvietErrDesc: string;
  transToVietlott: string;
  trnUnique: string;
  vpaymentId: string;
  htStatus: string;
  htStatusName: string;
  coreDesc: string;
  coreRefNo: string;
  gnStatus: string;
  gnStatusName: string;
  numRetryTimeout: number;
  numSettleBill: number;
  transactionPostResponses: ITransactionPost [];
}

export interface ITransactionPost {
  transactionId: string;
  transToVietlott: string;
  acNo: string;
  acCcy: string;
  acBranch: string;
  custGl: string;
  bankCode: string;
  drcrInd: string;
  amount: number;
  fcyAmount: string;
  amountTag: string;
  eventCode: string;
  eventSeqNo: string;
  trnStat: string;
  recordStatus: string;
  relatedCustomer: string;
  relatedAccount: string;
  relatedReference: string;
  coreRefNo: string;
  coreBlockNo: string;
  extCustNo: string;
  extScrAccount: string;
  extDesAccount: string;
  extRefNo: string;
  produceCode: string;
  trnUnique: string;
}
export interface IAuthorize {
  posId: string;
  accName: string;
  accAddress?: string;
  accPhoneNumber?: string;
  vpaymentId: string;
  accountCore: string;
  code: string; // Ma chi nhanh quan ly
  name: string; // Ten chi nhanh quan ly
  recordStat: string;
  available: string;
}
