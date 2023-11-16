
export const ALLOW_STATUS_CODE = {
  GDV: {
    DRAFT: 'DRAFT',
    WAIT_APPROVE: 'WAIT_APPROVE',
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    WAIT_MODIFY: 'WAIT_MODIFY',
    WAIT_REVERT: 'WAIT_REVERT',
    APPROVE_REVERT: 'APPROVE_REVERT',
    SUSPICIOUS: 'SUSPICIOUS',
    SUSPICIOUS_REVERT: 'SUSPICIOUS_REVERT',
  },

  KSV: {
    WAIT_APPROVE: 'WAIT_APPROVE',
    APPROVE: 'APPROVE',
    REJECT: 'REJECT',
    WAIT_MODIFY: 'WAIT_MODIFY',
    WAIT_REVERT: 'WAIT_REVERT',
    APPROVE_REVERT: 'APPROVE_REVERT',
    SUSPICIOUS: 'SUSPICIOUS',
    SUSPICIOUS_REVERT: 'SUSPICIOUS_REVERT',
  },
};

export const PRODUCTS_TYPES = {
  FOREIGN: 'FOREIGN',
  DOMESTIC: 'DOMESTIC',
  ALL: 'ALL',
};

export const TRANS_STATUS_CODES = {
  DRAFT: 'DRAFT',
  WAIT_APPROVE: 'WAIT_APPROVE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  WAIT_MODIFY: 'WAIT_MODIFY',
  WAIT_REVERT: 'WAIT_REVERT',
  APPROVE_REVERT: 'APPROVE_REVERT',
  SUSPICIOUS: 'SUSPICIOUS',
  SUSPICIOUS_REVERT: 'SUSPICIOUS_REVERT',
};

export const TRANSACTION_STATUSES = [
  { code: TRANS_STATUS_CODES.DRAFT, name: 'Đã lưu', color: '#2F80ED' },
  {
    code: TRANS_STATUS_CODES.WAIT_APPROVE,
    name: 'Chờ duyệt',
    color: '#ffc107',
  },
  {
    code: TRANS_STATUS_CODES.WAIT_MODIFY,
    name: 'Chờ bổ sung',
    color: '#ffc107',
  },
  { code: TRANS_STATUS_CODES.APPROVE, name: 'Đã duyệt', color: '#28a745' },
  { code: TRANS_STATUS_CODES.REJECT, name: 'Từ chối', color: '#dc3545' },
  {
    code: TRANS_STATUS_CODES.WAIT_REVERT,
    name: 'Chờ duyệt RV',
    color: '#ffc107',
  },
  {
    code: TRANS_STATUS_CODES.APPROVE_REVERT,
    name: 'Reversed',
    color: '#28a745',
  },
  { code: TRANS_STATUS_CODES.SUSPICIOUS, name: 'Cần đối soát', color: '#7B3461' },
  { code: TRANS_STATUS_CODES.SUSPICIOUS_REVERT, name: 'Cần đối soát RV', color: '#ffc107' },
];


export type RelatedParty = 'SENDER' | 'RECIPIENT';

export const FORM_VAL_ERRORS = {
  REQUIRED: 'required',
  NO_EXIST: 'noExist',
  NOT_MATCH_PROD: 'notMatchProd',
  UNDER_MIN: 'underMin',
  OVER_MAX: 'overMax',
  NOT_EXIST_ACC: 'notExistAcc',
  NOT_ENOUGH_CHARS: 'notEnoughChars',
  TOO_BIG: 'tooBig',
  NOT_MATCH_CURCODE: 'notMatchCurCode',
  SAME_ACN: 'sameAcn',
  NOT_PERSONAL_ACC: 'notPersonalAcc',
  MIN_LENGTH: 'minlength',
  MAX_LENGTH: 'maxlength',
  FROZEN: 'frozen',
  NO_CR: 'noCr',
  NO_DR: 'NO_DR',
  INVALID_DATE: 'inValidDate',
  MAX_DATE: 'maxDate',
  PATTERN: 'pattern',
};

export const DOC_TYPES = {
  CCCD: 'CCCD',
  CMND: 'CMND',
  PASSPORT: 'PASSPORT',
  BIRTH_CERT: 'BIRTH_CERT',
};

export const DOC_TYPES_VI = [
  {
    code: DOC_TYPES.CCCD,
    name: 'Căn cước công dân',
    radioTxt: 'CCCD',
    noneMark: 'CAN CUOC CONG DAN',
  },
  {
    code: DOC_TYPES.PASSPORT,
    name: 'Hộ chiếu',
    radioTxt: 'HC',
    noneMark: 'HO CHIEU',
  },
  {
    code: DOC_TYPES.CMND,
    name: 'Chứng minh nhân dân',
    radioTxt: 'CMND',
    noneMark: 'CHUNG MINH NHAN DAN',
  },
  {
    code: DOC_TYPES.BIRTH_CERT,
    name: 'Giấy khai sinh',
    radioTxt: 'GKS',
    noneMark: 'GIAY KHAI SINH',
  },
];

export const CURRENCIES = {
  USD: 'USD',
  AUD: 'AUD',
  EUR: 'EUR',
  GBP: 'GBP',
  VND: 'VND',
};

export const FEE_TYPES = {
  EXCLUDING: 'EXCLUDING', // Phí ngoài
  INCLUDING: 'INCLUDING', // Phí trong
  FREE: 'FREE',
};

export const FORM_CONTROL_NAMES = {
  SENDER: {
    cif: 'senderCifNo',
    acn: 'senderAcn',
    balance: 'senderAvailableBalance',
    branchCode: 'senderAccountBranchCode',
    curCode: 'senderCurCode',
    name: 'senderName',
    address: 'senderAddress',
    addressLine1: 'senderAddressLine1',
    addressLine2: 'senderAddressLine2',
    addressLine3: 'senderAddressLine3',
    addressLine4: 'senderAddressLine4',
    accountName: 'senderAccountName',
  },

  OTHERS: {
    fee: 'fee',
    feeVAT: 'feeVAT',
    feeEx: 'feeEx',
    feeVATEx: 'feeVATEx',
    feeType: 'feeType',
    productCode: 'productCode',
    transactionAmount: 'transactionAmount',
    totalAmount: 'totalAmount',
    note: 'note',
    accountingNote: 'accountingNote',
    nostroAcn: 'nostroAcn',
    nostroName: 'nostroName',
    intermediaryAcn: 'intermediaryAcn',
    intermediaryAcnName: 'intermediaryAcnName',
    routeCode: 'routeCode',
  },

  RECIPIENT: {
    textType: 'recipientTxtType',
    text: 'recipientTxt',
    cardNum: 'recipientCardNum',
    acn: 'recipientAcn',
    docType: 'recipientDocType',
    docNum: 'recipientDocNum',
    docIssueDate: 'recipientDocIssueDate',
    docIssuePlace: 'recipientDocIssuePlace',
    name: 'recipientFullName',
    bank: 'recipientBank',
    bankId: 'recipientBankId',
    bankAddr: 'recipientBankAddress',
    directCode: 'recipientDirectCode',
    indirectCode: 'recipientIndirectCode',
    indirectCodeId: 'recipientIndirectCodeId',
    inDirectCodeDesc: 'inDirectCodeDesc',
    citadCode: 'citadCode',
    bankName: 'recipientBankName'
  }
};
