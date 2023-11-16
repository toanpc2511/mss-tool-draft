export enum DEPOSIT_ACCOUNT_TYPE_CODE {
  CASH = 'CASH',
  SPEND = 'SPEND',
}

export const DEPOSIT_ACCOUNT_TYPES = [
  {
    code: DEPOSIT_ACCOUNT_TYPE_CODE.CASH,
    name: 'Tiền mặt',
  },
  {
    code: DEPOSIT_ACCOUNT_TYPE_CODE.SPEND,
    name: 'TKTT',
  },
];

export enum RECEIPT_ACCOUNT_TYPE_CODE {
  GL = 'GL',
  SPEND = 'SPEND',
}

export const RECEIPT_ACCOUNT_TYPES = [
  {
    code: RECEIPT_ACCOUNT_TYPE_CODE.SPEND,
    name: 'TKTT',
  },
  {
    code: RECEIPT_ACCOUNT_TYPE_CODE.GL,
    name: 'Tài khoản GL',
  },
];

export enum SAVINGS_MONEY_TYPE_CODE {
  INTEREST = 'INTEREST',
  PRINCIPAL = 'PRINCIPAL',
}

export const SAVINGS_MONEY_TYPES = [
  {
    code: SAVINGS_MONEY_TYPE_CODE.PRINCIPAL,
    name: 'Gốc',
  },
  {
    code: SAVINGS_MONEY_TYPE_CODE.INTEREST,
    name: 'Lãi',
  },
];

export enum TERM_CODE {
  WEEK = 'W',
  MONTH = 'M',
}

export const TERMS = [
  {
    code: TERM_CODE.WEEK,
    name: 'Tuần'
  },
  {
    code: TERM_CODE.MONTH,
    name: 'Tháng'
  },
]

export const ctrlNames = {
  SENDER: {
    cif: 'senderCif',
    docNum: 'senderDocNum',
    docType: 'senderDocType',
    name: 'senderFullName',
    accType: 'senderAccType',
  },

  ACC: {
    productType: 'productType',
    classCode: 'classCode',
    interestRate: 'interestRate',
    curCode: 'curCode',
    serialNo: 'serialNo',
    forecastInterest: 'forecastInterest',
    termCode: 'termCode',
    term: 'term',
    acn: 'acn',
    finalizeMethod: 'finalizeMethod',
    startDate: 'startDate',
    maturityDate: 'maturityDate',
    depositAmount: 'depositAmount',
    note: 'note',
  },
};

export const FINALIZE_METHOD_CODE = {
  ROLL_OVER_PRINCIPAL: 'ROLL_OVER_PRINCIPAL',
  ROLL_OVER_PRINCIPAL_INTEREST: 'ROLL_OVER_PRINCIPAL_INTEREST'
}

export const FINALIZE_METHODS = [
  {
    code: FINALIZE_METHOD_CODE.ROLL_OVER_PRINCIPAL,
    name: 'Quay vòng gốc',
  },
  {
    code: FINALIZE_METHOD_CODE.ROLL_OVER_PRINCIPAL_INTEREST,
    name: 'Quay vòng cả gốc và lãi',
  },
]

