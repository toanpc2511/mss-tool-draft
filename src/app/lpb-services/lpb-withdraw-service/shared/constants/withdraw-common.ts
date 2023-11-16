import { FOOTER_BUTTON_CODE } from "src/app/shared/constants/constants";

export const PRODUCTS_TYPES = {
  FOREIGN: 'FOREIGN',
  DOMESTIC: 'DOMESTIC',
  ALL: 'ALL',
};


export const WITHDRAW_PRODUCTS_CODES = {
  RT01: 'RT01',
  RT02: 'RT02',
  RT03: 'RT03',
  RT04: 'RT04',
  RU01: 'RU01',
  RU02: 'RU02',
};

export const WITHDRAW_PRODUCTS = [
  {
    code: WITHDRAW_PRODUCTS_CODES.RT01,
    name: 'RUT TIEN MAT VND - CUNG TINH, TP',
    type: PRODUCTS_TYPES.DOMESTIC,
  },
  {
    code: WITHDRAW_PRODUCTS_CODES.RT02,
    name: 'RUT TM VND - KHAC TINH, TP',
    type: PRODUCTS_TYPES.DOMESTIC,
  },
  {
    code: WITHDRAW_PRODUCTS_CODES.RT03,
    name: 'RUT TM TU T/K VANG LAI - CUNG HT',
    type: PRODUCTS_TYPES.DOMESTIC,
  },
  {
    code: WITHDRAW_PRODUCTS_CODES.RT04,
    name: 'RUT TM TU T/K VANG LAI - KHAC HT',
    type: PRODUCTS_TYPES.DOMESTIC,
  },
  {
    code: WITHDRAW_PRODUCTS_CODES.RU01,
    name: 'RUT NTE TU TK - CUNG TINH, TP',
    type: PRODUCTS_TYPES.FOREIGN,
  },
  {
    code: WITHDRAW_PRODUCTS_CODES.RU02,
    name: 'RUT NTE TU TK - KHAC TINH, TP',
    type: PRODUCTS_TYPES.FOREIGN,
  },
];

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


export const DENOMINATIONS = {
  VND: [
    100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000,
    500000,
  ],
  USD: [1, 2, 5, 10, 20, 50, 100],
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



