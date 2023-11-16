interface CardExtendServices {
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
  coreActionCode: string;
  branchCodeDo: string;
  expireDate: string;
  totalOutStanding?: string;
  clientType?: string;
  address?: string;
  creditLimit?: string;
  cardTypeCode?: string;
  accountStatus?: string;
  contractType?: string;
  contract?: string;
  cardStateCode?: string;
}

export interface SendApproveDto extends CardExtendServices {
  sendNote: string;
  pinCount: string;
}

export interface SendApproveRequest {
  dto: SendApproveDto;
  file?: File;
}

export interface ResponseStatus {
  codes: {
    code: string;
    detail: string;
    msg: string;
    target: string;
  }[];
  success: boolean;
}
export interface CardServiceResponse {
  responseStatus: ResponseStatus;
  item: any;
}

export interface SearchServiceHistoryRequest {
  uidValue?: string;
  customerCode?: string;
  phoneNumber?: string;
  cardId?: string;
  inputBy?: string;
  cardProductCode?: string;
  branchCodeDo?: string;
  actionCode?: string;
  serviceStatus?: string;
  searchType?: string;
  approveBy?: string;
  sendDateFrom?: string;
  sendDateTo?: string;
  approveDateFrom?: string;
  approveDateTo?: string;
  page: number;
  size: number;
}
