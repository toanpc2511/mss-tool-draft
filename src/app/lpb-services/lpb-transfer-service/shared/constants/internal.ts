import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';
import { PRODUCTS_TYPES, TRANS_STATUS_CODES } from './common';

export const INTERNAL_TRANSFER_PRODUCTS_CODES = {
  CT01: 'CT01',
  CT02: 'CT02',
  CT07: 'CT07',
};

export const INTERNAL_TRANSFER_PRODUCTS = [
  {
    code: INTERNAL_TRANSFER_PRODUCTS_CODES.CT01,
    name: 'CK VND CUNG HT',
    type: PRODUCTS_TYPES.DOMESTIC,
  },
  {
    code: INTERNAL_TRANSFER_PRODUCTS_CODES.CT02,
    name: 'CK NHAN TM VND CUNG HT',
    type: PRODUCTS_TYPES.DOMESTIC,
  },
  {
    code: INTERNAL_TRANSFER_PRODUCTS_CODES.CT07,
    name: 'CK NTE CUNG HT',
    type: PRODUCTS_TYPES.FOREIGN,
  },
];

export const TRANSCODE_TYPE = {
  uniform: {
    value: 'Uniform',
    key: 'U',
  },
  core: {
    value: 'Core',
    key: 'C',
  },
};

export const ACN_TYPE = {
  uniform: {
    value: 'Ghi nợ',
    key: 'N',
  },
  core: {
    value: 'Ghi có',
    key: 'C',
  },
};

export const RECIPIENT_SEARCH_TYPE = {
  GTXM: 'GTXM',
  ACN: 'ACN',
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
      // TRANS_STATUS_CODES.WAIT_APPROVE,
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
];
