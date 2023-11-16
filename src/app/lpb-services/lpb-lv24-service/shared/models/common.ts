export interface CustomerUserInfo {
  id?: string;
  address: string;
  cif: string;
  cusName: string;

  cusTypeDes: string;
  docMethod: string;
  docNum: string;
  docType: string;
  phoneNumber: string;
  userCreatedTime: string;
  userCreatedBy?: string;

  userMakerId: string;
  userName: string;

  wrongPassCount: string;

  cusStatus: string;
  userStatus: string;
  accountStatus: string;

  email: string;
  createdBy: string;
}

export class CustomError extends Error {
  status;
  constructor({ status, message }: { status: string; message: string }) {
    super(message);
    this.status = status;
  }
}
