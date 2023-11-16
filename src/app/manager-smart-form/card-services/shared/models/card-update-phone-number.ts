export interface SearchCustomerRequest {
  uidName: string;
  uidValue: string;
  phone: string;
  customerCode: string;
}

export interface SearchCardExtendRequest {
  uidValue?: string;
  customerCode?: string;
  cardProductCode?: string;
  branchCode?: string;
  actionSearch?: string;
  phoneNumber?: string;
  cardId?: string;
}

// Obj Thông tin khách hàng khi tìm kiếm
export interface CustomerInfo {
  CUSTOMER_NO: string;
  TEL_NO: string;
  UID_NAME: string;
  UID_VALUE: string;
  NOI_CAP: string;
  NGAY_CAP: string;
  FULL_NAME: string;
  GENDER: string;
  DATEOFBIRTH: string;
  BRANCH_CODE: string;
  BRANCH_NAME: string;
  RECORD_STAT: string;
  BRANCH_STAT: string;
  MARK: string;
  NATION: string;
}

// Obj thông tin User lấy theo chi nhánh
export interface UserBranchInfo {
  branchCode: string;
  branchCodeName: string;
  branchName: string;
  code: string;
  fullName: string;
  id: string;
  name: string;
  userCore: string;
  userName: string;
}

// Obj thông tin yêu cầu cập nhật số điện thoại SVBO chờ duyệt
export interface SVBOUpdatePhoneRecordInfo {
  id: string;
  branchCode: string;
  branchName: string;
  customerCode: string;
  fullName: string;
  uidValue: string;
  mobilePhone: string;
  svboServiceStatusCode: string;
  svboServiceStatusName: string;
  displayPriority: string;
  serviceResultStatusCode: string;
  errorCode: string;
  errorDesc: string;
  refCode: string;
  refDesc: string;
  inputDate: string;
  inputBy: string;
  approvedDate: string;
  approvedBy: string;
}

export interface SendApproveRequest {
  customerCode: string;
  fullName: string;
  uidValue: string;
  mobilePhone: string;
}

export interface ApproveOrRejectRequest {
  id: string;
  approveNote?: string;
}

export interface GetListApproveRequest {
  page: number;
  size: number;
  customerCode: string;
  fromDate: string;
  toDate: string;
  branchCode: string;
  inputUser: string;
  svboServiceStatusCode: string;
  uidValue: string;
}

export interface GetListUserByBranchRequest {
  branchCode: string;
}
