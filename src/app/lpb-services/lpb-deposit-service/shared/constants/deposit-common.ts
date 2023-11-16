import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';

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
    radioTxt: 'Hộ chiếu',
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
    radioTxt: 'Giấy khai sinh',
    noneMark: 'GIAY KHAI SINH',
  },
];

export const FETCH_STATUS = {
  IDLE: 0,
  LOADING: 1,
  COMPLETED: 2,
  ERROR: 4,
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

export const CURRENCIES = {
  USD: 'USD',
  AUD: 'AUD',
  EUR: 'EUR',
  GBP: 'GBP',
  VND: 'VND',
};

export const DEPOSIT_PRODUCTS_CODES = {
  NT01: 'NT01',
  NT02: 'NT02',
  NU01: 'NU01',
  NU02: 'NU02',
};

export const PRODUCTS_TYPES = {
  FOREIGN: 'FOREIGN',
  DOMESTIC: 'DOMESTIC',
  ALL: 'ALL',
};

export const DEPOSIT_PRODUCTS = [
  {
    code: DEPOSIT_PRODUCTS_CODES.NT01,
    name: 'NOP TM VAO TK VND - CUNG TINH, TP',
    type: PRODUCTS_TYPES.DOMESTIC,
  },
  {
    code: DEPOSIT_PRODUCTS_CODES.NT02,
    name: 'NOP TM VAO TK VND - KHAC TINH, TP',
    type: PRODUCTS_TYPES.DOMESTIC,
  },
  {
    code: DEPOSIT_PRODUCTS_CODES.NU01,
    name: 'NOP NTE VAO TK - CUNG TINH, TP',
    type: PRODUCTS_TYPES.FOREIGN,
  },
  {
    code: DEPOSIT_PRODUCTS_CODES.NU02,
    name: 'NOP NTE VAO TK - KHAC TINH, TP',
    type: PRODUCTS_TYPES.FOREIGN,
  },
];

export const DENOMINATIONS = {
  VND: [
    100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000,
    500000,
  ],
  USD: [1, 2, 5, 10, 20, 50, 100],
};

export const CHARGE_TYPES = {
  EXCLUDING: 'EXCLUDING', // Phí ngoài
  INCLUDING: 'INCLUDING', // Phí trong
  FREE: 'FREE',
};


type FOOTER_ACTION = {
  code: string;
  name: string;
  enableOnlyCrrUser: boolean;
  enableStatus: string[];
  activeWhen: ('disabled' | 'enabled')[];
  roles: string[];
};

export const FOOTER_ACTIONS: FOOTER_ACTION[] = [
  {
    code: FOOTER_BUTTON_CODE.FOOTER_ACTION_SAVE,
    name: 'Lưu thông tin',
    enableOnlyCrrUser: false,
    enableStatus: [],
    activeWhen: ['enabled'],
    roles: ['GDV'],
  },
  {
    code: FOOTER_BUTTON_CODE.FOOTER_ACTION_SEND_APPROVE,
    name: 'Gửi duyệt',
    enableOnlyCrrUser: false,
    enableStatus: [TRANS_STATUS_CODES.DRAFT, TRANS_STATUS_CODES.WAIT_MODIFY],
    activeWhen: ['enabled', 'disabled'],
    roles: ['GDV'],
  },
  {
    code: FOOTER_BUTTON_CODE.FOOTER_ACTION_EDIT,
    name: 'Sửa',
    enableOnlyCrrUser: true,
    enableStatus: [
      TRANS_STATUS_CODES.DRAFT,
      TRANS_STATUS_CODES.WAIT_MODIFY,
      TRANS_STATUS_CODES.WAIT_APPROVE,
    ],
    activeWhen: ['disabled'],
    roles: ['GDV'],
  },
  {
    code: FOOTER_BUTTON_CODE.FOOTER_ACTION_DELETE,
    name: 'Xóa',
    enableOnlyCrrUser: true,
    enableStatus: [
      TRANS_STATUS_CODES.DRAFT,
      TRANS_STATUS_CODES.WAIT_MODIFY,
      TRANS_STATUS_CODES.WAIT_APPROVE,
    ],
    activeWhen: ['disabled'],
    roles: ['GDV'],
  },
  {
    code: FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE,
    name: 'Phê duyệt',
    enableOnlyCrrUser: false,
    enableStatus: [
      TRANS_STATUS_CODES.WAIT_APPROVE,
      TRANS_STATUS_CODES.WAIT_REVERT,
      TRANS_STATUS_CODES.SUSPICIOUS,
      TRANS_STATUS_CODES.SUSPICIOUS_REVERT,
    ],
    activeWhen: ['disabled'],
    roles: ['KSV'],
  },
  {
    code: FOOTER_BUTTON_CODE.FOOTER_ACTION_REVERSE,
    name: 'Reverse',
    enableOnlyCrrUser: true,
    enableStatus: [
      TRANS_STATUS_CODES.APPROVE,
    ],
    activeWhen: ['disabled'],
    roles: ['GDV'],
  },
  {
    code: FOOTER_BUTTON_CODE.FOOTER_ACTION_UNREVERSE,
    name: 'Unreverse',
    enableOnlyCrrUser: true,
    enableStatus: [
      TRANS_STATUS_CODES.WAIT_REVERT,
    ],
    activeWhen: ['disabled'],
    roles: ['GDV'],
  },
  {
    code: FOOTER_BUTTON_CODE.FOOTER_ACTION_PRINT_FORM,
    name: 'In biểu mẫu',
    enableOnlyCrrUser: false,
    enableStatus: [
      TRANS_STATUS_CODES.DRAFT,
      TRANS_STATUS_CODES.REJECT,
      TRANS_STATUS_CODES.APPROVE,
      TRANS_STATUS_CODES.APPROVE_REVERT,
      TRANS_STATUS_CODES.WAIT_REVERT,
      TRANS_STATUS_CODES.WAIT_MODIFY,
      TRANS_STATUS_CODES.WAIT_APPROVE,
      TRANS_STATUS_CODES.SUSPICIOUS,
      TRANS_STATUS_CODES.SUSPICIOUS_REVERT,
    ],
    activeWhen: ['disabled'],
    roles: ['GDV', 'KSV'],
  },
  {
    code: FOOTER_BUTTON_CODE.FOOTER_ACTION_PRINT_DOCUMENT,
    name: 'In chứng từ',
    enableOnlyCrrUser: false,
    enableStatus: [
      TRANS_STATUS_CODES.APPROVE,
      TRANS_STATUS_CODES.APPROVE_REVERT,
      TRANS_STATUS_CODES.WAIT_REVERT,
      TRANS_STATUS_CODES.WAIT_MODIFY,
      TRANS_STATUS_CODES.WAIT_APPROVE,
      TRANS_STATUS_CODES.SUSPICIOUS,
      TRANS_STATUS_CODES.SUSPICIOUS_REVERT,
    ],
    activeWhen: ['disabled'],
    roles: ['GDV', 'KSV'],
  },
];
