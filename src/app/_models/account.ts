
export class AccountModel {

  id: string;
  fullName: string;
  perDocNo: string;
  validFrom: string;
  validTo: string;
  accClassId: string; // id tài khoản
  accClassName: string; // mã tài khoản
  accProductId: string; //
  accProductName: string; //
  accTypeId: string; // id loại tài khoản
  accTypeName: string; // tên tài khoản
  accountDes: string; // Tên mô tả tài khoản
  accountClassCode: string; // id tài khoản
  accountClassName: string; // mã tài khoản
  accountProductCode: string; //
  accountProductName: string; //
  accountIndex: string;
  accountTypeCode: string; // id loại tài khoản
  accountTypeName: string; // tên tài khoản
  accountDescription: string; // Tên mô tả tài khoản
  accountName: string; // tên tài khoản
  accountNumber: string; // số tài khoản
  actionCode: string; // thay đổi
  actionName: string; // thay đổi
  branchCode: string; // code branch
  branchId: string; // id branch
  branchName: string; // tên chi nhánh
  changeStatus: string; // trạng thái thay đổi
  changeStatusName: string; // trạng thái sau thay đổi
  createdBy: string; // người tạo
  createdDate: Date; // ngày tạo
  inputterEmployeeId: string; // Mã nhân viên người tạo
  inputterUserCore: string; // Mã user core người tạo
  inputterName: string; // tên đầy đủ người tạo
  inputterUserName: string; // người tạo
  currencyCode: string; // id loại tiền tệ
  currencyName: string; // tên tiền tệ
  currentStatus: string; //   mã trạng thái hiện tại
  currentStatusName: string; // trạng thái hiện tại
  employeeId: string; // mã nhân viên
  minBalance: string; // số dư tối thiểu
  modifiedBy: string; // người cập nhật
  modifiedDate: Date; // ngày cập nhật
  modifierFullname: string; // full tên người cập nhật
  modifierUsername: string; // người cập nhật
  processId: string; // mã pk hồ sơ
  requestId: string; // request id sang esb
  currentStatusCode?: string;
  changeStatusCode?: string;
  employeeName: string; // tên nhân viên
  isActive?: boolean;
  constructor(process: any = null) {
    // tslint:disable-next-line:curly
    if (process == null) return;
    this.id = process.id;
    this.fullName = process.fullName;
    this.perDocNo = process.perDocNo;
    this.currentStatusName = process.currentStatusName;
    this.validFrom = process.validFrom;
    this.validTo = process.validTo;
  }
}
export class CreateAccount {
  accountClassCode: string; // example: U0CNTN
  accountProductCode: string; /// example: CASA
  accountTypeCode: string; // example: SINGLE
  accountDescription: string; // example: NGUYỄN VĂN A
  accountName: string; // example: NGUYỄN VĂN A
  branchCode: string; // example: 1
  currencyCode: string; // example: USD
  employeeId: string; // example: 1,
  minBalance: string; // example: 10 USD,
  processId: string; // example: 1
}
