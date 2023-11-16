export interface SearchListEbsServicesApproveRequest {
  page: number;
  size: number;
  uidValue: string;
  customerCode: string;
  inputBy: string;
  cardProductCode: string;
  branchCodeDo: string;
  ebsActionCode?: string;
  actionCode?: string;
  phoneNumber: string;
  cardId?: string;
}

export interface EbsServicesApproveRequest {
  id: string;
}
export interface EbsServicesApprove {
  id: string;
  displayStatus: string;
  screenType?: string;
}

export interface EbsServicesRejectRequest {
  id: string;
  approveNote: string;
}

export interface EbsServicesApproveObject {
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
  serviceStatusName?: string;
  // actionCode?: string;
  branchCodeDo?: string;
  actionCode: string;
  actionName: string;
  expireDate?: string;
  pinCount?: string;
  subActionCode?: string;
  brokenDesc?: string;
  displayStatus?: string;
  displayStatusName?: string;
  mismatchBy?: string;
}
export interface EbsServicesApproveObject2 extends EbsServicesApproveObject {
  accCbs: [];
  accSvbo: [];
}
