export const USER_INFO = (): any => {
  try {
    return JSON.parse(localStorage.getItem('userInfo'));
  } catch (error) {
    return null;
  }
};

export const NO_EMIT = {
  emitEvent: false,
  onlySelf: true,
};

export const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'; // define a constant for the date format
export const DATE_FORMAT_VN_SIMPLE = 'DD/MM/YYYY'; // define a constant for the date format
//#region doc
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
//#endregion doc

//#region CURRENCIES
export const CURRENCY_TYPES = {
  FOREIGN: 'FOREIGN',
  DOMESTIC: 'DOMESTIC',
  ALL: 'ALL',
};

export const CURRENCIES = {
  USD: 'USD',
  AUD: 'AUD',
  EUR: 'EUR',
  GBP: 'GBP',
  VND: 'VND',
};

export const DENOMINATIONS = {
  [CURRENCIES.VND]: [
    100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000,
    500000,
  ],
  [CURRENCIES.USD]: [1, 2, 5, 10, 20, 50, 100],
};
//#endregion CURRENCIES

// #region PRODUCTS_TYPE
export enum PRODUCTS_TYPE_CODES {
  UPFRONT_INTEREST = 'UPFRONT_INTEREST',
  MONTHLY_INTEREST = 'MONTHLY_INTEREST',
  QUARTERLY_INTEREST = 'QUARTERLY_INTEREST',
  MATURITY_INTEREST = 'MATURITY_INTEREST',
}
export const PRODUCTS_TYPES = [
  {
    code: PRODUCTS_TYPE_CODES.UPFRONT_INTEREST,
    label: 'Đầu kỳ',
  },
  {
    code: PRODUCTS_TYPE_CODES.MONTHLY_INTEREST,
    label: 'Hàng tháng',
  },
  {
    code: PRODUCTS_TYPE_CODES.QUARTERLY_INTEREST,
    label: 'Hàng quý',
  },
  {
    code: PRODUCTS_TYPE_CODES.MATURITY_INTEREST,
    label: 'Cuối kỳ',
  },
];
// #endregion PRODUCTS_TYPE

// #region  PRODUCTS
export enum PRODUCTS_CODES {
  BASIC = 'BASIC',
}
export const PRODUCTS = [
  {
    code: PRODUCTS_CODES.BASIC,
    label: 'Tiết kiệm thường',
  },
];
// #endregion PRODUCTS

// #region ACCOUNT_STATUS
export enum ACCOUNT_STATUS {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
}
export const ACCOUNT_STATUSES = [
  { code: ACCOUNT_STATUS.OPEN, label: 'Mở' },
  { code: ACCOUNT_STATUS.CLOSE, label: 'Đóng' },
];
// #endregion ACCOUNT_STATUS

// #region TRANS_STATUS

export const TRANS_STATUS = {
  DRAFT: 'DRAFT',
  WAIT_APPROVE: 'WAIT_APPROVE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  WAIT_MODIFY: 'WAIT_MODIFY',
  WAIT_REVERT: 'WAIT_REVERT',
  APPROVE_REVERT: 'APPROVE_REVERT',
};

export const TRANS_STATUSES = [
  { code: TRANS_STATUS.DRAFT, label: 'Đã lưu', color: '#2F80ED' },
  {
    code: TRANS_STATUS.WAIT_APPROVE,
    label: 'Chờ duyệt',
    color: '#ffc107',
  },
  {
    code: TRANS_STATUS.WAIT_MODIFY,
    label: 'Chờ bổ sung',
    color: '#ffc107',
  },
  { code: TRANS_STATUS.REJECT, label: 'Từ chối', color: '#dc3545' },
  { code: TRANS_STATUS.APPROVE, label: 'Đã duyệt', color: '#28a745' },
  {
    code: TRANS_STATUS.WAIT_REVERT,
    label: 'Chờ duyệt RV',
    color: '#ffc107',
  },
  {
    code: TRANS_STATUS.APPROVE_REVERT,
    label: 'Reversed',
    color: '#28a745',
  },
];

// #endregion TRANS_STATUS

export const FORM_VAL_ERRORS = {
  REQUIRED: 'required',
  NO_EXIST: 'noExist',
  NOT_MATCH_PROD: 'notMatchProd',
  NOT_EXIST_ACC: 'notExistAcc',
  NOT_ENOUGH_CHARS: 'notEnoughChars',
  MIN_LENGTH: 'minlength',
  MAX_LENGTH: 'maxlength',
  FROZEN: 'frozen',
  NO_CR: 'noCr',
  NO_DR: 'noDr',
  NOT_PERSONAL: 'notPersonal',
  BELOW_MIN: 'belowMin',
  PATTERN: 'pattern',
  MAX: 'max',
  DIFF_AMOUNT: 'DIFF_AMOUNT',
  DIFF_AMOUNT_PERCENT: 'DIFF_AMOUNT_PERCENT',
  NOT_MATCH_CURCODE: 'NOT_MATCH_CURCODE',
  INVALID_DATE: 'inValidDate',
  DATE_RANGE_ERROR: 'dateRangeError',
  OUT_OF_BOUNDS: 'outOfBounds',
  FOREIGNER: 'FOREIGNER',
  EMAIL: 'email',
};
// region NGƯỜI CƯ TRÚ
export enum RESIDENT {
  resident1 = 'resident1',
  resident2 = 'resident2',
  resident3 = 'resident3',
  resident4 = 'resident4',
  resident5 = 'resident5',
}
export const RESIDENTS = [
  { code: RESIDENT.resident1, label: 'người cư trú ví dụ 1' },
  { code: RESIDENT.resident2, label: 'người cư trú ví dụ 2' },
  { code: RESIDENT.resident3, label: 'người cư trú ví dụ 3' },
  { code: RESIDENT.resident4, label: 'người cư trú ví dụ 4' },
  { code: RESIDENT.resident5, label: 'người cư trú ví dụ 5' },
];
// end region NGƯỜI CƯ TRÚ
