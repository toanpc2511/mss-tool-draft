import { FOOTER_BUTTON_CODE } from 'src/app/shared/constants/constants';

export const CUSTOMER_SELECT_TYPE = {
  cusName: 'Tên khách hàng',
  phoneNumber: 'Số điện thoại',
  docNum: 'Giấy tờ xác minh',
};
export const CUSTOMER_SELECT_TYPE_ARR = Object.keys(CUSTOMER_SELECT_TYPE).map(
  (e) => {
    return { key: e, name: CUSTOMER_SELECT_TYPE[e] };
  }
);

export const REQUEST_TYPE = {
  transCode: 'Mã yêu cầu',
  status: 'Trạng thái yêu cầu',
  createdBy: 'User GDV',
};
export const REQUEST_TYPE_ARR = Object.keys(REQUEST_TYPE).map((e) => {
  return { key: e, name: REQUEST_TYPE[e] };
});

export const REQUEST_STATUS_TYPE = {
  WAIT_APPROVE: 'Chờ duyệt',
  APPROVE: 'Đã duyệt',
  REJECT: 'Từ chối ',
};

export const REQUEST_STATUS_TYPE_ARR = Object.keys(REQUEST_STATUS_TYPE).map(
  (e) => {
    return { key: e, name: REQUEST_STATUS_TYPE[e] };
  }
);

export const SERVICE_TYPE_CODE = {
  LOCK: 'LOCK',
  UNLOCK: 'UNLOCK',
  RESET_PASSWORD: 'RESET_PASSWORD',
};

export const SERVICE_TYPE = {
  LOCK: 'Khóa LienViet24h',
  UNLOCK: 'Mở khóa LienViet24h',
  RESET_PASSWORD: 'Reset mật khẩu LienViet24h',
};
export const SERVICE_TYPE_ARR = Object.keys(SERVICE_TYPE).map((e) => {
  return { key: e, name: SERVICE_TYPE[e] };
});

export const LV24_STATUS = {
  ACTIVE: 'ACTIVE',
  LOCK_CUSTOMER_REQUEST: 'LOCK_CUSTOMER_REQUEST',
  LOCK_WRONG_PASSWORD: 'LOCK_WRONG_PASSWORD',
  LOCK_ANOMALY_DETECTION: 'LOCK_ANOMALY_DETECTION',
  CLOSE: 'CLOSE',
  OPEN: 'OPEN',
  LOCK: 'LOCK',
};

export const LV24_STATUS_VI = {
  ACTIVE: 'Hoạt động',
  LOCK_CUSTOMER_REQUEST: 'Khóa (KH yêu cầu)',
  LOCK_WRONG_PASSWORD: 'Khóa (Sai password)',
  LOCK_ANOMALY_DETECTION: 'Khóa (Phát hiện bất thường)',
  CLOSE: 'Đóng',
  OPEN: 'Mở',
  LOCK: 'Khóa',
};

export const TRANS_STATUS_CODES = {
  WAIT_APPROVE: 'WAIT_APPROVE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
};
export const TRANSACTION_STATUSES = [
  {
    code: TRANS_STATUS_CODES.WAIT_APPROVE,
    name: 'Chờ duyệt',
    color: '#ffc107',
  },
  { code: TRANS_STATUS_CODES.APPROVE, name: 'Đã duyệt', color: '#28a745' },
  { code: TRANS_STATUS_CODES.REJECT, name: 'Từ chối', color: '#dc3545' },
];

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
    code: FOOTER_BUTTON_CODE.FOOTER_ACTION_SEND_APPROVE,
    name: 'Gửi duyệt',
    enableOnlyCrrUser: false,
    enableStatus: [],
    activeWhen: ['enabled', 'disabled'],
    roles: ['GDV'],
  },
  {
    code: FOOTER_BUTTON_CODE.FOOTER_ACTION_APPROVE,
    name: 'Phê duyệt',
    enableOnlyCrrUser: false,
    enableStatus: [TRANS_STATUS_CODES.WAIT_APPROVE],
    activeWhen: ['disabled'],
    roles: ['KSV'],
  },
];

export const BEFORE_CONFIRM_ERROR = {
  ERROR: 'ERROR',
  WAIT_APPROVE: 'WAIT_APPROVE',
  CHANGED: 'CHANGED',
  CHECK_FAILED: 'CHECK_FAILED',
};

export const CONFIRM_TYPE = {
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
};

export const DOC_TYPE = {
  1: 'Chứng minh thư',
  2: 'Hộ chiếu',
  3: 'Giấy phép kinh doanh',
  0: 'Không xác định',
  4: 'Chứng minh thư quân đội',
  5: 'Số điện thoại',
};
export const CUSTOMER_TYPE = {
  1: 'Cá nhân',
  2: 'Doanh nghiệp',
};

export const CUSTOMER_STATUS = {
  A: 'Hoạt động',
  C: 'Đóng',
  O: 'Mở',
  L: 'Khóa do khách hàng yêu cầu',
  S: 'Khóa do hệ thống',
};
export const ACCOUNT_STATUS = {
  A: 'Hoạt động',
  L: 'Khóa do khách hàng yêu cầu',
  C: 'Đóng',
  S: 'Khóa do hệ thống',
  F: 'Đóng băng',
};
export const USER_STATUS = {
  A: 'Hoạt động',
  L: 'Khóa do khách hàng yêu cầu',
  S: 'Khóa do phát hiện bất thường',
  P: 'Khóa do sai password',
  C: 'Đóng',
  O: 'Mở',
};

export const ERROR_CODES_DIALOG = {
  NOT_LATEST_DATA: '4000',
  STATUS_CANT_LOCK: '4003',
  STATUS_CANT_UNLOCK: '4004',
  STATUS_CANT_RESET_PASS: '4005',
};
