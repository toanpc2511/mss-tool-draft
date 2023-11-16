import { FormGroup } from '@angular/forms';
import { CustomerUserInfo } from './common';

/*
Search Models
*/
export interface SearchResponseData {
  approveBy: string;
  approveDate: string;
  branchCode: string;
  cif: string;
  createdBy: string;
  createdDate: string;
  cusName: string;
  docNum: string;
  docType: string;
  id: string;
  phoneNumber: string;
  serviceCode: string;
  serviceName: string;
  status: string;
  statusName: string;
  transCode: string;
  userName: string;
}
/*
End Search Models
*/

export interface TransactionData {
  accountStatus: string;
  address: string;
  approveBy: string;
  approveDate: string;
  approveNote: string;
  branchCode: string;
  cif: string;
  createdBy: string;
  createdDate: string;
  cusName: string;
  cusStatus: string;
  cusTypeDes: string;
  docMethod: string;
  docNum: string;
  docType: string;
  email: string;
  id: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  note: string;
  phoneNumber: string;
  serviceCode: string;
  status: string;
  transCode: string;
  userCreatedTime: string;
  userMakerId: string;
  userName: string;
  userStatus: string;
  wrongPassCount: string;
}

export interface CreateTransactionRequest {
  accountStatus: string;
  address: string;
  branchCode: string;
  cif: string;
  cusName: string;
  cusStatus: string;
  cusTypeDes: string;
  docMethod: string;
  docNum: string;
  docType: string;
  email: string;
  note: string;
  phoneNumber: string;
  serviceCode: string;
  userCreatedTime: string;
  userMakerId: string;
  userName: string;
  userStatus: string;
  wrongPassCount: string;
}
export interface ConfirmTransactionRequest {
  id: string;
  note: string;
  rejectNote?: string;
}

export interface ISubmit {
  frmValues: any;
  customerUserInfo: CustomerUserInfo;
  form?: FormGroup;
  transactionData?: TransactionData;
  id?: string;
}
