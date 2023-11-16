export const FORMAT_REQUEST_DATE = 'yyyy/MM/DD';
export const SEARCH_STORIES_TYPES = {
  SINGLE_STT: 'SINGLE_STT',
  GDV_ALL: 'GDV_ALL',
  KSV_APPROVED: 'KSV_APPROVED',
  AWAIT_APPROVE: 'AWAIT_APPROVE',
};
export const FETCH_STATUS = {
  IDLE: 0,
  LOADING: 1,
  COMPLETED: 2,
  ERROR: 4,
};

export const INPUT_TYPE_SEARCH_CARD_BACK = [
  { code: 'CIF', name: 'CIF Khách hàng', control: 'customerCode' },
  { code: 'PHONE_NUMBER', name: 'Số điện thoại', control: 'phoneNumber' },
  { code: 'PER_DOCS_NO', name: 'Giấy tờ xác minh', control: 'uidValue' },
  { code: 'CARD_ID', name: 'CardID', control: 'cardId' },
];

export const TYPE_SEARCH_CUSTOMER_UPDATE_PHONE = [
  { code: 'CIF', name: 'CIF Khách hàng' },
  { code: 'PHONE_NUMBER', name: 'Số điện thoại' },
  { code: 'CCCD', name: 'Căn cước công dân' },
  { code: 'CMND', name: 'Chứng minh nhân dân' },
];

export const RESPONSE_CODE_CARD_UPDATE_SVBO = {
  UNI_00: 'UNI-00',
  UNI_01: 'UNI-01',
  UNI_02: 'UNI-02',
};

export const SERVICE_STATUSES = [
  { code: 'S', name: 'Đã duyệt' },
  { code: 'R', name: 'Từ chối' },
  { code: 'W', name: 'Chờ duyệt' },
  { code: 'P', name: 'Pending' },
];

export const SERVICE_STATUSES_COLOR = {
  S: '#2F80ED',
  R: '#dc3545',
  P: '#ffc107',
  W: '#ffc107',
};

export const TYPE_TRANSACTION_SEARCH_APPROVE = [
  { code: '', name: 'Tất cả' },
  { code: 'CARD_BACK', name: 'Trả thẻ' },
  { code: 'CARD_BROKEN_AFTER', name: 'Báo hỏng' }
];

export const EXTEND_STEP = {
  HOME: 'HOME',
  LOCK: 'LOCK',
  UNLOCK: 'UNLOCK',
  UNLOCK_PIN: 'UNLOCK_PIN',
  HISTORY: 'HISTORY',
  DETAIL_UNLOCK: 'DETAIL_UNLOCK',
  DETAIL_LOCK: 'DETAIL_LOCK',
  DETAIL_UNLOCK_PIN: 'DETAIL_UNLOCK_PIN',
  CARD_END: 'CARD_END',
  DETAIL_CARD_END: 'DETAIL_CARD_END',
  ACCOUNT_LINK: 'ACCOUNT_LINK',
  DETAIL_ACCOUNT_LINK: 'DETAIL_ACCOUNT_LINK',
};

export const EBS_ACTION_SEARCH_CODE = {
  UNLOCK: 'UNLOCK',
  UNLOCK_PIN: 'UNLOCK_PIN',
  LOCK: 'LOCK',
};

export const EBS_ACTIONS_SEARCH = [
  {
    code: EBS_ACTION_SEARCH_CODE.UNLOCK,
    name: 'Mở khóa thẻ',
    permittedCodes: ['CSTS0006', 'CSTS0015', 'CSTS0020'],
  },
  {
    code: EBS_ACTION_SEARCH_CODE.UNLOCK_PIN,
    name: 'Mở khóa PIN',
    permittedCodes: ['CSTS0000', 'CSTS0012', 'CSTS0020', 'CSTS0023', 'CSTS0006', 'CSTS0015'],
  },
  {
    code: EBS_ACTION_SEARCH_CODE.LOCK,
    name: 'Khóa thẻ',
    permittedCodes: ['CSTS0000'],
  },
  {
    code: 'CARD_END',
    name: 'Chấm dứt sử dụng thẻ',
    permittedCodes: [
      'LOCAL_DEBIT',
      'JCB Debit',
      'Visa Platinum Debit',
      'Domestic Debit',
      'MC Debit',
    ],
  },
  {
    code: 'ACCOUNT_LINK',
    name: 'Thêm/Hủy TK liên kết/Đổi tài khoản mặc định',
    permittedCodes: [
      'LOCAL_DEBIT',
      'JCB Debit',
      'Visa Platinum Debit',
      'Domestic Debit',
      'MC Debit',
    ],
  },
];

export const LOCK_STATUS_CODE = {
  LOCK_LOST: 'LOCK_LOST',
  LOCK_CREDIT: 'LOCK_CREDIT',
  LOCK_TEMPORARY: 'LOCK_TEMPORARY',
};

export const LOCK_STATUSES = [
  {
    code: LOCK_STATUS_CODE.LOCK_LOST,
    name: 'Thẻ bị mất, thất lạc, lộ thông tin thẻ',
  },
  {
    code: LOCK_STATUS_CODE.LOCK_CREDIT,
    name: 'Thẻ khóa do liên đới tín dụng',
  },
  {
    code: LOCK_STATUS_CODE.LOCK_TEMPORARY,
    name: 'Thẻ tạm khóa bởi khách hàng',
  },
];

export const APPROVE_STEP = {
  CARD_LOST: 'CARD_LOST',
  CARD_BROKEN_AFTER: 'CARD_BROKEN_AFTER',
  CARD_BACK: 'CARD_BACK',
  ...EXTEND_STEP,
};

export const MODAL_TYPES = {
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  ERROR: 'ERROR',
};
