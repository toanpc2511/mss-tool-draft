export interface IFilterCifSearch {
  customerCifNumber: string;
  recordPerPage: number;
  pageNumber: number;
}

export interface ICifSearch {
  accountNumber: string;
  accountName: string;
  branchCode?: string;
  custClass?: string;
  availableBalance?: string;
  custAddress?: string;
  custPhone?: string;
  custName?: string;
}

export interface ITaxInfo {
  administrationCode: string;
  billAmount: number;
  chapter: number;
  decisionDate: number;
  decisionNumber: string;
  metadataList: IDecisionResponses[];
  organReceive: string;
  payerName: string;
  payerAddress: string;
  infoData: IInfoData;
  subSectionResponses: ISubSectionResponses[];
  beneficiaryBank: IBeneficiaryBank;
  taxCode: string;
  taxTypeApi: string;
  taxTypeCode: string;
  taxTypeName: string;
  treasuryNumber: string;
  number: string;
}

export interface IInfoData {
  organReceiveCode: string;
  trafficDescribe: string;
  assetAddress: string;
  districtCode: string;
  ccy: string;
  engineCode: string;
  decisionNumber: string;
  payerName: string;
  provinceCode: string;
  taxType: string;
  taxCode: string;
  treasuryNumber: string;
  decisionDate: 1668445200000,
  taxTypeCode: string;
  taxTypeName: string;
  payerAddress: string;
  administrationCode: string;
  taxTypeApi: string;
  identifyNumber: string;
  cccd: string;
  keySearch: string;
  taxCycle: string;
}

export interface ISubSectionResponses {
  id?: number;
  chapter: number;
  subSectionCode: string;
  subSectionName: string;
  billAmount: number;
  fund: string;
  taxCycle: string;
  decisionNumber: string;
}

export interface IDecisionResponses {
  decisionNumber: string;
  taxTypeName: string;
  containerNumber: string;
  engineNumber: string;
  decisionDate: number;
  describe: string;
}

export interface IBeneficiaryBank {
  bankName: string;
  bankNumber: string;
  treasuryCode4: string;
  branchCode: string;
}

export interface ICifInfo {
  accountName: string;
  accountNumber: string;
  accountType: string;
  availableBalance: string;
  branchCode: string;
  custAddress: string;
  custClass: string;
  custName: string;
  custPhone: string;
}

export interface ITransactionPersonal {
  id: string;
  administrationCode: string;
  billAmount: number;
  chapter: number;
  decisionDate: number;
  decisionNumber: string;
  metadataList: IDecisionResponses[];
  organReceive: string;
  payerName: string;
  payerAddress: string;
  infoData: IInfoData;
  status: string;
  tctStatus: string;
  accountingStatus: string;
  kbnnStatus: string;
  statusName: string;
  tranDetailResponses: any[];
  note: string;
  description: string;
  subSectionResponses: ISubSectionResponses[];
  beneficiaryBank: IBeneficiaryBank;
  taxCode: string;
  taxTypeApi: string;
  taxTypeCode: string;
  taxTypeName: string;
  treasuryNumber: string;
  number: string;
  paymentTypeName: string;
  paymentType: string;
  preBalance: string;
  replacerName: string;
  replacerAddress: string;
  replacerTaxCode: string;
  tranPostResponses: any[];
  lastModifiedDate: string;
}

export interface ITranPortResponses {
  id: string;
  transId: string;
  acNumber: string;
  acName: string;
  drcrType: string;
  accountType: string;
  lcyAmount: number;
  authId: string;
  authDate: number;
  accountingStatusCode: string;
  accountingStatusName: string;
  createdDate: number;
  createdBy: string;
  lastModifiedDate: number;
  lastModifiedBy: string;
}

export interface IDataCheckTrans {
  tranId: string;
  status: string;
  transationStatusName: string;
  message: string;
}
