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
    serviceBankInfo?: IBankInfo;
    specialBankInfo?: IBankInfo;
    type?: string;
}

export interface IBankInfo {
    cif?: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
    bankAccountBrnCode?: string;
    bankAccountBrnName?: string;
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
    accountInfos: ICustomerInfo;
    billInfos: IListBillInfo[];
    settleAccountInfos: ISettleAccountInfo[];
    prefix?: string;
}

export interface ISettleAccountInfo {
    settleAcBrn?: string;        // Mã chi nhánh
    settleAcDesc: string;       // Thông tin tài khoản
    settleAcNo: string;         // Số tài khoản
    settleCusNo?: string;   // Số cif
    settleMechant?: string;
}

export interface ICustomerInfo {
    custDesc: string;    // Tên địa chỉ; tên đường phố; tên khu vực
    custId?: string;      // Mã khách hàng
    custName: string;    // Tên khách hàng
    custType: string;
    otherInfo?: string;
    resInfo?: IResInfo;    //
}

export interface IResInfo {
    counter: string;
    counterAnalyst: string;
    electricCode: string;
    gcs: string;
    major: string;
    number: string;
    session: string;
    stationCode: string;
    taxCode: string;
}

export interface IListBillInfo {
    billAmount: string;
    billCode?: string;
    billDesc: string;
    billId?: string;
    billInfo?: string;
    billType: string;
    billStatus: string;
    resBillInfo?: IResBillInfo;
    extraData?: IExtraData;
}
export interface IExtraData {
    settleBillAccount?: {
        settleBillAcBrn?: string;
        settleBillAcDesc?: string;
        settleBillAcNo?: string;
        settleBillCustomerNo?: string;
        settleBillMerchant?: string;
    }
}
export interface IResBillInfo {
    amount: string;
    billCode: string;
    billId: string;
    fromDate: string;
    month: string;
    numberAddress: string;
    rateMoney: string;
    toDate: string;
    year: string;
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
    custAddress?: string;
    custPhone?: string;
    custName?: string;
}

// Tra Cuu So Du Theo Tai Khoan

// Tao Thanh Toan
export interface IFilterCreatePayment {
    brnCustomer: string;
    ccy: string;
    cif: string;
    custAcName: string;
    custAcNumber: string;
    custAddress: string;
    custId: string;
    custName: string;
    custPhoneNumber: string;
    custType?: string;
    paymentType: string;
    payerName: string;
    payerAddress: string;
    payerPhoneNumber: string;
    preAmount: number;
    supplierCode: string;
    supplierName: string;
    totalAmount: number;
    tranDesc: string;
    tranRequests: ITtranRequest[]; // Chi tiết giao dịch
    electricCode: string;
    receiptNumber?: string;
    custInfo?: string;
}

export interface ITtranRequest {
    billAmount: number;
    billDesc: string;
    billId: string;
    billType: string;
    otherInfor: string;
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
    tranNo: string;
    acNumber: string;
    acName: string;
    acType: string;
    totalAmount: string;
}

export interface ITranDetailResponse {
    billId: string;
    billDesc: string;
    billType: string;
    billTypeName: string;
    billAmount: string;
}

//

export interface ITransaction {
    accountingStatus: string;
    accountingStatusCode: string;
    billInfos: IBillInfo[];
    brnCode: string;
    brnName: string;
    custType: string;
    changeDebtStatus: string;
    changeDebtStatusCode: string;
    coreRefNo: string;
    cif: string;
    custAcName: string;
    custAcNumber: string;
    custAddress: string;
    custId: string;
    custName: string;
    custPhoneNumber: string;
    lastModifiedDate: string;
    makerId: string;
    payerName: string;
    payerAddress: string;
    payerPhoneNumber: string;
    paymentTypeCode: string;
    paymentTypeName: string;
    status: string;
    statusCode: string;
    supplierAcName: string;
    supplierAcNumber: string;
    supplierName: string;
    supplierCode: string;
    totalAmount: number;
    tranDate: string;
    tranDesc: string;
    tranId: string;
    tranPostInfos: ITranPostInfo[];
    transNo: string;
    preBalance?: string;
    electricCode?: string;
    receiptNumber?: string;
}

export interface IBillInfo {
    billAmount: string;
    billCode: string;
    billDesc: string;
    billId: string;
    billInfo: string;
    billType: string;
    billTypeName: string;
    resBillInfo: IResBillInfo;
}

export interface IResBillInfo {
    amount: string;
    billCode: string;
    billId: string;
    fromDate: string;
    month: string;
    numberAddress: string;
    rateMoney: string;
    toDate: string;
    year: string;
}

export interface ITranPostInfo {
    acBrn: string;
    acName: string;
    acNumber: string;
    accountType: string;
    accountingStatusCode: string;
    accountingStatusName: string;
    authDate: string;
    authId: string;
    brnCode: string;
    ccy: string;
    createdBy: string;
    createdDate: string;
    drcrType: string;
    drcrTypeName: string;
    id: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    lcyAmount: number;
    makerDate: string;
    makerId: string;
    totalAmount: number;
    transId: string;
    transNo: string;
    accountingRevertStatus?: string;
    accountingRevertStatusName?: string;
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

export interface ISupplierRule {
    paymentGroupCode: string;
    paymentGroupName: string;
    paymentRuleCode: string;
    paymentRuleName: string;
    paymentRuleParentCode?: string;
    supplierId: string;
}

export interface IDataQueryFile {
    acBrn: string;
    acName: string;
    acNumber: string;
    detail: string;
    querySearchBills: IQuerySearchBills[];
}

export interface IQuerySearchBills {
    billCode: string;
    custId: string;
    custName: string;
    electricCode: string;
    result: string;
    totalAmount: number;
}

export interface IAccountInfos {
    customerInfo: {
        custDesc: string;
        custId: string;
        custName: string;
        custType: string;
        // resInfo: IResInfo
    };
}

export interface IResInfo {
    electricCode: string;
    taxCode: string;
    stationCode: string;
    major: string;
    gcs: string;
    session: string;
    counter: string;
    counterAnalyst: string;
    number: string;
}

export interface ITransactionSettle {
    acName: string;
    acNumber: string;
    auditStatus: string;
    auditStatusName: string;
    availableBalance: string;
    brnCode: string;
    brnName: string;
    checkerId?: string;
    makerId: string;
    phone: string;
    cif: string;
    createdBy: string;
    createdDate: string;
    custClass: string;
    custDesc: string;
    custEmail: string;
    custId: string;
    custMobile: string;
    custName: string;
    custType: string;
    desc: string;
    email: string;
    id: string;
    lastModifiedBy: string;
    lastModifiedDate: string;
    paymentRule: string;
    sendMail: number;
    settleDate: number;
    settleRegisterId: string;
    status: string;
    statusName: string;
    supplierCode: string;
    supplierName: string;
    transactionType: string;
    transactionTypeName: string;
    transNo: string;
}

export interface IInfoCustomerRegister {
    id: string;
    custId: string;
    custName: string;
    settleDate: number;
    acNumber: string;
    acName: string;
    auditStatus: string;
    auditStatusName: string;
    createdBy: string;
    brnName: string;
    brnCode: string;
    createdDate: number;
    cif: string;
    email: string;
    phone: string;
    custClass: string;
    supplierCode: string;
    custDesc: string;
    custType: string;
    lastModifiedDate: number;
    lastModifiedBy: string;
    supplierName: string;
    status: string;
    statusName: string;
    paymentRule: string;
    transNo: string;
    settleResponses: ISettleResponses[];
    sendMail: boolean;
}

export interface ISettleResponses {
    id: string;
    custId: string;
    custName: string;
    settleDate: number;
    acNumber: string;
    acName: string;
    auditStatus: string;
    auditStatusName: string;
    createdBy: string;
    brnName: string;
    brnCode: string;
    createdDate: number;
    cif: string;
    email: string;
    custClass: string;
    supplierCode: string;
    custDesc: string;
    lastModifiedDate: number;
    lastModifiedBy: string;
    supplierName: string;
    status: string;
    statusName: string;
    transactionType: string;
    transactionTypeName: string;
    paymentRule: string;
    desc: string;
    transNo: string;
    settleRegisterId: string;
    sendMail: boolean;
}

export interface IBatchApprove {
    batchTransaction: IBatchTransaction;
    description: string;
    response: IResponseApproveBatch;
    status: string;
}

export interface IBatchTransaction {
    acBrn: string;
    acName: string;
    acNumber: string;
    accountingBatchResponses: IAccountingBatch[];
    accountingStatus: string;
    batchNo: string;
    batchStatus: string;
    batchStatusName: string;
    ccy: string;
    checkerId: string;
    createdBy: string;
    createdDate: number;
    custAcName: string;
    custAcNumber: string;
    fileName: string;
    id: string;
    lastModifiedDate: number;
    makerId: string;
    middleAcName: string;
    middleAcNumber: string;
    payerAddress: string;
    payerName: string;
    payerPhone: string;
    preAmount: number;
    stepStatus: string;
    tranBrn: string;
    tranName: string;
    transNo: string;
    transactionResponses: ITransactionBatch[];
    transferPaymentType: string;
    transferPaymentTypeName: string;
    transferTransactionResponses: ITransferTransaction[];
}

export interface IAccountingBatch {
    acBranch: string;
    acName: string;
    acNumber: string;
    accountType: string;
    batchNo: string;
    ccy: string;
    checkerId: string;
    coreRefDesc: string;
    coreRefNo: string;
    createdBy: string;
    createdDate: number;
    desc: string;
    drcrType: string;
    drcrTypeName: string;
    id: string;
    lastModifiedBy: string;
    lastModifiedDate: number;
    makerId: string;
    preBalance: number;
    status: string;
    statusName: string;
    totalAmount: number;
    tranDesc: string;
    transNo: string;
}

export interface ITransactionBatch {
    accountingStatus: string;
    accountingStatusCode: string;
    billInfos: IBillInfoBatch[];
    brnCode: string;
    brnName: string;
    changeDebtStatus: string;
    changeDebtStatusCode: string;
    checkerId: string;
    cif: string;
    coreRefNo: string;
    createdBy: string;
    createdDate: number;
    custAcName: string;
    custAcNumber: string;
    custAddress: string;
    custId: string;
    custInfo: string;
    custName: string;
    custPhoneNumber: string;
    custType: string;
    electricCode: string;
    id: string;
    lastModifiedBy: string;
    lastModifiedDate: number;
    makerId: string;
    payerAddress: string;
    payerName: string;
    payerPhoneNumber: string;
    paymentTypeCode: string;
    paymentTypeName: string;
    preBalance: number;
    receiptNumber: string;
    revertCheckerId: string;
    revertRefNo: string;
    status: string;
    statusCode: string;
    supplierAcName: string;
    supplierAcNumber: string;
    supplierCode: string;
    supplierName: string;
    totalAmount: number;
    tranBrn: string;
    tranDate: number;
    tranDesc: string;
    tranDt: number;
    tranId: string;
    tranName: string;
    tranPostInfos: ITranPost[];
    transNo: string;
}

export interface IBillInfoBatch {
    batchNo: string;
    billAmount: string;
    billCode: string;
    billDesc: string;
    billId: string;
    billInfo: string;
    billStatus: string;
    billType: string;
    billTypeName: string;
    changeDebtRevertStatus: string;
    changeDebtRevertStatusName: string;
    changeDebtStatus: string;
    changeDebtStatusName: string;
    createdBy: string;
    createdDate: number;
    custId: string;
    custName: string;
    electricCode: string;
    lastModifiedBy: string;
    lastModifiedDate: number;
    messageResponse: string;
    messageResponseCode: string;
    otherInfo: string;
    receiptNumber: string;
    resBillInfo: string;
    revertDt: number;
    revertEDesc: string;
    revertRefCode: string;
    revertRefDesc: string;
    taxCode: string;
    transNo: string;
}

export interface ITranPost {
    acBrn: string;
    acName: string;
    acNumber: string;
    accountType: string;
    accountingRevertStatus: string;
    accountingRevertStatusName: string;
    accountingStatusCode: string;
    accountingStatusName: string;
    authDate: number;
    authId: string;
    brnCode: string;
    ccy: string;
    createdBy: string;
    createdDate: number;
    drcrType: string;
    drcrTypeName: string;
    id: string;
    lastModifiedBy: string;
    lastModifiedDate: number;
    lcyAmount: number;
    makerDate: number;
    makerId: string;
    totalAmount: number;
    tranDesc: string;
    tranRevertDesc: string;
    transId: string;
    transNo: string;
}

export interface ITransferTransaction {
    acBranch: string;
    acName: string;
    acNumber: string;
    accountType: string;
    batchNo: string;
    ccy: string;
    checkerId: string;
    coreRefDesc: string;
    coreRefNo: string;
    createdBy: string;
    createdDate: number;
    desc: string;
    drcrType: string;
    drcrTypeName: string;
    id: string;
    lastModifiedBy: string;
    lastModifiedDate: number;
    makerId: string;
    preBalance: number;
    status: string;
    statusName: string;
    totalAmount: number;
    tranDesc: string;
    transNo: string;
}

export interface IResponseApproveBatch {
    coreRefNo: string;
    errorDesc: string;
    msgId: string;
    msgStat: string;
    trnRefNo: string;
    warningDesc: string;
}
