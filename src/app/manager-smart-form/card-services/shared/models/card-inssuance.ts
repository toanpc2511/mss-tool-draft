export interface SearchCardRequest {
  cardId?: string;
  uidValue?: string;
  customerCode?: string;
  phoneNumber?: string;
  cardProductCode?: string;
  branchCode?: string;
  actionCode?: string;
}

export interface GetCardEbsInfoRequest {
  cardCoreId: string;
  cardStatusCode: string;
  actionCode: string;
  branchCode: string;
}

export interface SendApproveInssuanceInfo {
  cardCoreId: string;
  customerCode: string;
  uidValue: string;
  fullName: string;
  phoneNumber: string;
  branchCode: string;
  cardCategory: string;
  cardProductCode: string;
  cardNumber: string;
  cardEmbossedName: string;
  defaultAccount: string;
  releaseDate: string;
  cardStatusCode: string;
  cardEbsSerialNumber: string;
  cardEbsStatusCode: string;
  ebsActionCode: string;
  sendNote: string;
  branchCodeDo: string;
  checkConnectEbs: string;
}

export interface SendApproveInssuanceRequest {
  dto: SendApproveInssuanceInfo;
  file: File;
}

export interface CardEbsInfo {
  cardId: string;
  cardStatusEbs: string;
  cardEbsSerialNumber: string;
}

export interface CardProductCodeInfo {
  id: string;
  code: string;
  name: string;
  description: string;
  cardTypeCode: string;
  cardTypeName: string;
  displayPriority: string;
  statusCode: string;
  statusName: string;
  cardRateCode: string;
  contractType: string;
  contractName: string;
  cardTypeId: string;
  blankTypeId: string;
  productId: string;
}

export interface CardSearchInfo {
  cardCoreId: string;
  customerCode: string;
  uidValue: string;
  fullName: string;
  phoneNumber: string;
  branchCode: string;
  cardCategory: string;
  cardProductCode: string;
  cardNumber: string;
  cardEmbossedName: string;
  defaultAccount: string;
  releaseDate: string;
  cardStatusCode: string;
  viewDetailAllowance?: boolean;
  cardTypeCode?: string;
  pendingStatus?: string;
  cardCategoryName?: string;
}

export interface CardEbsInfo {
  id: string;
  cardCoreId: string;
  cardProcessId: string;
  customerCode: string;
  uidValue: string;
  fullName: string;
  phoneNumber: string;
  branchCode: string;
  branchName: string;
  cardCategory: string;
  cardCategoryName: string;
  cardProductCode: string;
  cardProductName: string;
  cardNumber: string;
  cardEmbossedName: string;
  defaultAccount: string;
  releaseDate: string;
  cardStatusCode: string;
  cardStatusName: string;
  cardEbsSerialNumber: string;
  ebsServiceCode: string;
  ebsActionCode: string;
  ebsActionName: string;
  cardEbsStatusCode: string;
  ebsServiceStatusCode: string;
  ebsServiceStatusName: string;
  sendNote: string;
  approveNote: string;
  fileContent: string;
  fileName: string;
  fileType: string;
  displayPriority: string;
  createdDate: string;
  createdBy: string;
  modifiedDate: string;
  modifiedBy: string;
  inputDate: string;
  inputBy: string;
  approveDate: string;
  approveBy: string;
  coreRefCode: string;
  coreRefDesc: string;
  coreResultStatusCode: string;
  coreResultStatusName: string;
  ebsRefCode: string;
  ebsRefDesc: string;
  ebsResultStatusCode: string;
  ebsResultStatusName: string;
  displayStatusName?: string;
  displayStatus?: string;
}

export interface CardSearchInfo2 extends CardSearchInfo{
  expireDate: string;
  coreActionCode: string;
  sendNote: string;
  branchCodeDo: string;
  pinCount: string;
  cardStateCode: string;
  serviceCode: string;
  accSvbo: [];
  accCbs: [];
}
