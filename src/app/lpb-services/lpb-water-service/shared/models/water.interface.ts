//
export interface IHeader {
    FIELD: string;
    NAME: string;
    TYPE: string;
    WIDTH: number;
    CLASS: string;
}

export interface Item {
    label: string;
    value: string;
}
// Nhà cung cấp
export interface ISupplier {
    id?: string;
    supplierName: string;
    supplierCode: string;
    supplierAuthMethod?: string;
    domain?: string;
    apiDataFormat?: string;
    description?: string;
    address?: string;
    serviceType?: string;
    status?: string;
    supplierMetadata?: ISupplierMetadata;
    supplierFormGroups?: ISupplierFormGroups[];
    createdDate?: string;
    lastModifiedDate?: string;
    lastModifiedBy?: string;
}

export interface ISupplierMetadata {
    service?: string;
    serviceId?: string;
    productCode?: string;
    merchantId?: string;
    minPayment?: number;
    paymentMethod?: string;
    bankInfo?: IBankInfo;
    prefixFormat?: string;
    billFormat?: string;
}

export interface IBankInfo {
    cif?: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
}

export interface ISupplierFormGroups {
    id?: string;
    name?: string;
    code?: string;
    description?: string;
    address?: string;
    ruleResponses?: IRuleResponses[];
}

export interface IRuleResponses {
    id?: string;
    name?: string;
    code?: string;
    selected?: boolean;
}

// Hóa đơn
export interface IBills {
    customerInfo: ICustomerInfo;
    listBillInfo: IListBillInfo[];
    settleAccountInfo: ISettleAccountInfo[];
    prefix?: string;
}

export interface ISettleAccountInfo {
    settleAcBrn?: string;        // Mã chi nhánh
    settleAcDesc: string;       // Thông tin tài khoản
    settleAcNo: string;         // Số tài khoản
    settleCustomerNo?: string;   // Số cif
    settleMerchant?: string;
}

export interface ICustomerInfo {
    custDesc: string;    // Tên địa chỉ; tên đường phố; tên khu vực
    custId?: string;      // Mã khách hàng
    custName: string;    // Tên khách hàng
    custType?: string;    //
    custEmail?: string;    //
    custMobile?: string;    //
    custStatus?: string;
    customer_no?: string;
    kind_of_otp?: string;
    otherInfo?: string;
    providerId?: string;
    uidValue?: string;
}

export interface IListBillInfo {
    amt_unit?: string;       // Đơn vị tiền tệ *
    billAmount?: string;     // Tổng tiền
    billCode: string;       // Năm
    billDesc?: string;       // Số mét khối tiêu thụ
    billId: string;         // Tháng
    billStatus?: string;     // Hết nợ
    billType?: string;       // Mã khu vực
    otherInfo?: string;      // Chỉ số cũ; chỉ số mới; tiền lưu bộ; tiền phí bảo vệ môi trường; tiền phí nước thải; tiền VAT
    paymentMethod?: string;  // Hình thức thanh toán *
    settledAmount: string;  // Tổng tiền
    checked?: boolean;
    billInfo: string;
}

export interface IFilterGetSuppliers {
    page: number;
    size: number;
}

export interface IFilterGetBills {
    customerId: string;
    serviceType: string;
    supplierCode: string;
}

export interface IFilterGetAccountCustomers {
    identityDocType: string;
    numberDocType: string;
}

// Tim Danh Sach Tai Khoan Theo số CIF; ...
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
}

// Tra Cuu So Du Theo Tai Khoan

// Tao Thanh Toan
export interface IFilterCreatePayment {
    accBrn: string;         // mã chi nhanh TK NCC
    accName: string;        // Tên chủ TK NCC
    accNumber: string;      // Tài khoản thanh toán NCC
    availableBalance: string,
    cif: string;            // mã cif(Số khách hàng)
    customerId: string;     // Mã khách hàng
    customerName: string;   // Tên khách hàng
    customerAddress: string;    // Địa chỉ khách hàng
    customerPhone?: string;    // Địa chỉ khách hàng
    paymentType: string;    // Loại thanh toán(TTTM;CK)
    supplierCode: string;     // mã nhà cung cấp
    totalAmount: number;    // Tổng số tiền thanh toán
    tranBrn?: string;        // Mã chi nhánh tạo thanh toán
    tranDesc: string;       // Mô tả diễn giải
    tranName?: string;       // Tên chi nhánh tạo thanh toán
    ccy?: string;
    tranDetails: ITranDetail[]; // Chi tiết giao dịch
    tranPostDebit: ITranPost;     // Dữ liệu Insert Debit Database
    tranPostCredit: ITranPost;     // Dữ liệu Insert Credit Database
}

export interface ITranDetail {
    billAmount: number; // Số tiền nợ hóa đơn khi tra cứu nợ khách hàng
    billCode: string    // Số tháng của kỳ nợ trả về khi tra cứu nợ cước khách hàng
    billDesc: string;   // Số danh bộ Trả về khi tra cứu nợ khách hàng
    billId: string;     // Số năm của kỳ nợ trả về khi tra cứu nợ cước khách hàng
    tranDesc: string;   // Mô tả diễn giải
    billStatus: string;     // Hết nợ
    billType: string;       // Mã khu vực
    otherInfo: string;      // Chỉ số cũ; chỉ số mới; tiền lưu bộ; tiền phí bảo vệ môi trường; tiền phí nước thải; tiền VAT
    settledAmount: number;  // Tổng tiền
}

export interface ITranPost {
    acBrn: string;      // Mã chi nhánh
    acName: string;     // Tên nhà cung cấp nếu là ghi có hoặc tên khách hàng nếu là ghi nợ
    acNumber: string;   // Tài khoản ghi nợ/có
    drcrType: string;   // Tính chất nợ /có  (D or C)
}

export interface ISupplierInfoResponse {
    supplierCode: string;
    supplierName: string;
}
export interface ITranPostResponse {
    id: string;
    transId: string;
    acNumber: string;
    acName: string;
    acBrn: string;
    drcrType: string;
    lcyAmount: number;
    ccy: string;
    makerId: string;
    makerDate: string;
    authId: string;
    authDate: string
    accountingStatusName: string;
    accountingStatusCode: string;
    createdDate: string;
    createdBy: string
    lastModifiedDate: string;
    lastModifiedBy: string;
}

export interface ITranDetailResponse {
    id: string;
    transId: string;
    accNumber: string;
    accName: string;
    accBrn: string;
    billId: string;
    billCode: string;
    billDesc: string;
    ccy: string;
    billAmount: number;
    settledAmount: string;
    paidAmount: string;
    drcrType: string;
    tranDesc: string;
    addChangeDebtStatusCode: string;
    addChangeDebtStatusName: string;
    addChargeDebtDate: string;
    makerId: string;
    makerDate: string;
    authId: string;
    authDate: string;
    changeDebtStatusCode: string;
    changeDebtStatusName: string;
    createdDate: string;
    createdBy: string;
    lastModifiedDate: string;
    lastModifiedBy: string;
}

//

export interface ITransaction {
    accBrn: string;
    accName: string;
    accNumber: string;
    ccy: string;
    coreRefNo: string;
    changeDebtStatusCode: string;
    changeDebtStatusName: string;
    accountingStatusName: string;
    accountingStatusCode: string;
    preBalance: 0,
    channel: string;
    checkerDt: null;
    checkerId: null;
    cif: string;
    createdBy: string;
    createdDate: string;
    customerAddress: string;
    customerId: string;
    customerName: string;
    customerPhone?: string;
    id: string;
    transNo: string;
    lastModifiedBy: string;
    lastModifiedDate: number;
    makerDt: string;
    makerId: string;
    paymentTypeName: string;
    paymentTypeCode: string;
    statusCode: string;
    statusName: string;
    supplierCode: string;
    supplierName: string;
    totalAmount: number;
    tranBrn: string;
    tranDesc: string;
    tranDetailResponses: ITranDetailResponse[];
    tranDt: string;
    tranName: string;
    tranPostResponses: ITranPostResponse[];
    xrep: string;
}

export interface IResTransactionReject {
    rejectTransList: IStatusTransactionReject[];
}

export interface IStatusTransactionReject {
    message: string;
    reject: boolean;
    transactionId: string;
}
export interface IResTransactionApprove {
    approves: IStatusTransApprove[];
}

export interface IStatusTransApprove {
    changeDebtResponses: any[];
    message: string;
    status: string;
    transactionId: string;
}

export interface IFilterChangeDebts {
    sort?: string;
    page: number;
    size: number;
    supplierCode?: string;
    customerId?: string;
    fromDate?: string;
    toDate?: string;
}

export interface IResChangeDebts {
    changeDebtNo: string;
    brachCode: string;
    brachName: string;
    transactionId: string;
    billCode: string;
    activeDate: string;
    customerId: string;
    sessionChangeDebt: string;
    settledAmount: string;
    channel: string;
    changeDebtStatus: string;
    valueDate: string;
    transDate: string;
}

export interface IResCreateChangeDebts {
    acNumber: string;
    billCode: string;
    billId: string;
    chanel: string;
    changeDebtStatus: string;
    checkerDt: string;
    customerId: string;
    id: string;
    makerDt: string;
    settledAmount: string;
    tranBrn: string;
    tranDt: string;
    tranName: string;
}

export interface IBodyUpdateTransaction {
    cif: string;
    paymentTypeCode: string;
    tranPostDebit: ITranPost;
}

export interface IBodyCancelTransaction {
    rejectTransList: IRejectTransList[];
}

export interface IRejectTransList {
    lastModifiedDate: string;
    transactionId: string;
}

export interface IResCancelTransaction {
    rejectTransList: IStatusTransactionReject[];
}

export interface IResCheckTrans {
    changeDebtResponses: any[]
    message: string;
    status: string;
    transactionId: string;
}

export interface IFilterCreateAutoPayment {
    acName: string;
    acNumber: string;
    branchCode: string;
    cif: string;
    custClass: string;
    customerInfo: ICustomerInfo;
    email: string;
    paymentRule: string;
    serviceType: string;
    settleDate: string;
    supplierCode: string;
}

export interface IAutoPayment {
    brnCode: string;
    brnName: string;
    cif: string;
    createdBy: string;
    createdDate: string;
    custId: string;
    custName: string;
    id: string;
    settleDate: number;
    statusCode: string;
    statusName: string;
    acName: string;
    acNumber: string;
    custClass: string;
    custDesc: string;
    custEmail: string;
    custMobile: string;
    email: string;
    supplierCode: string;
    supplierName: string;
    paymentRule: string;
    paymentRuleCode: string;
    paymentRuleName: string;
    lastModifiedDate: number;
    transactionType: string;
    transactionTypeName: string;
}

export interface IBodyCancelAutoPaySignUp {
    lastModifiedDate: number;
    reason: string;
    settleId: string;
    transactionType: string;
}

export interface IResCancelAutoPaySignUp {
    message: string;
    settleId: string;
    status: string;
}

export interface IBodyUpdateAutoPaySignUp {
    acName: string;
    acNumber: string;
    email: string;
    id: string;
    paymentType: string;
    settleDate: number;
}

export interface IReqApproveAutoPayment {
    transactionType: string;
    reason?: string;
    approveSettles: { settleId: string; lastModifiedDate: number }[];
}
