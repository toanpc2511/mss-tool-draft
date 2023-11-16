export enum ETaxType {
  TCT_QUERY_LPTB = 'TCT_QUERY_LPTB',
  TCT_QUERY_TND = 'TCT_QUERY_TND',
  TCT_QUERY_TCN = 'TCT_QUERY_TCN'
}

export const TAX_TYPES = [
  {
    code: 'TCT_QUERY_TND',
    name: 'Thuế nhà đất'
  },
  {
    code: 'TCT_QUERY_LPTB',
    name: 'Thuế lệ phí trước bạ'
  },
  {
    code: 'TCT_QUERY_TCN',
    name: 'Thuế cá nhân khác'
  }
];

export enum EPaymentChannelType {
  AUTOMATION= 'AUTOMATION',
  TELLER = 'TELLER',
  AUTO = 'AUTO'
}

export const TAX_STATUS = [
  { label: 'Chờ duyệt', value: 'IN_PROCESS' },
  { label: 'Đã duyệt', value: 'APPROVE' },
  { label: 'Từ chối duyệt', value: 'REJECT' },
  { label: 'Chờ duyệt revert giao dịch', value: 'REVERT_IN_PROCESS' },
  { label: 'Đã duyệt revert giao dịch', value: 'REVERT_APPROVED' },
  { label: 'Từ chối revert giao dịch', value: 'REVERT_REJECT' },
  { label: 'Giao dịch nghi ngờ', value: 'ERROR' },
];

export enum ETaxStatus {
  IN_PROCESS = 'IN_PROCESS',
  SUCCESS = 'SUCCESS',
  APPROVE = 'APPROVE',
  HT_REVERT_SUCCESS = 'HT_REVERT_SUCCESS',
  REVERT_SUCCESS = 'REVERT_SUCCESS',
  APPROVE_TRANSFER = 'APPROVE_TRANSFER',
  APPROVE_CHANGE_DEBT = 'APPROVE_CHANGE_DEBT',
  APPROVE_ACCOUNTING = 'APPROVE_ACCOUNTING',
  REJECT_APPROVE_TRANSFER = 'REJECT_APPROVE_TRANSFER',
  REJECT_APPROVE_CHANGE_DEBT = 'REJECT_APPROVE_CHANGE_DEBT',
  DELETED = 'DELETED'
}

export const PAYMENT_METHODS = [
  {label: 'Chuyển khoản', value: 'CK'},
  {label: 'Tiền mặt', value: 'TM'},
];

export const TCT_STATUS = [
  { label: 'Tất cả', value: ''},
  { label: 'Thành công', value: 'SUCCESS'},
  { label: 'Thất bại', value: 'FAIL'},
  { label: 'Không xác định', value: 'ERROR'},
];

export const KBNN_STATUS = [
  { label: 'Tất cả', value: ''},
  { label: 'Thất bại', value: 'SUCCESS'},
  { label: 'Không xác định', value: 'ERROR'},
];

export const RECEIVING_OBJECT = [
  { label: 'Tổng cục thuế', value: 'TCT'},
  { label: 'Kho bạc nhà nước', value: 'KBNN'},
];

export enum ECategoryType {
  TCT_QUERY_DMCQT = 'TCT_QUERY_DMCQT',
  TCT_QUERY_DMDBHC = 'TCT_QUERY_DMDBHC',
  TCT_QUERY_DMKB = 'TCT_QUERY_DMKB',
  TCT_QUERY_DMC = 'TCT_QUERY_DMC',
  TCT_QUERY_DMK = 'TCT_QUERY_DMK',
  TCT_QUERY_DMTM = 'TCT_QUERY_DMTM'
}
