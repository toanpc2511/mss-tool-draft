import {LpbDatatableColumn} from '../../../../shared/models/LpbDatatableColumn';

export const ACC_VIETTEL_POST = '999992356868';
export const ACC_NAME_VIETTEL_POST = 'VIETTEL POST';
export const ACC_BRANCH_VIETTEL_POST = '105';
export const CASH_ACCNO = '101100001';
export const CASH_ACCNAME = 'TK Tiền mặt đã kiểm đếm';
export const LIST_STATUS = [
  {label: 'Chờ duyệt', value: 'IN_PROCESS'},
  {label: 'Đã duyệt', value: 'APPROVE'},
  {label: 'Từ chối duyệt', value: 'REJECT'},
  {label: 'Xóa', value: 'CANCEL'},
  {label: 'Nghi ngờ', value: 'TIMEOUT'},
  {label: 'Gạch nợ bổ sung', value: 'BOSUNG'},
];
export const PAYMENT_TYPE = [
  {label: 'Tiền mặt', value: 'NT01'},
  {label: 'Chuyển khoản', value: 'CT01'},
];
export const IDENTITY_DOC_TYPES = [
  {label: 'Số CIF', value: 'CIF'}
];
export const TRANSACTION_TABLE_VIETTEL_POST: LpbDatatableColumn[] = [
  {
    headerName: 'Số GD',
    headerProperty: 'tranNo',
    headerIndex: 0,
    className: 'w-150-px'
  },
  {
    headerName: 'Hình thức',
    headerProperty: 'paymentTypeName',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'Mã bảng kê',
    headerProperty: 'billCode',
    headerIndex: 2,
    className: 'w-100-px'
  },
  {
    headerName: 'Mã nhân viên',
    headerProperty: 'staffId',
    headerIndex: 3,
    className: 'w-100-px'
  },
  {
    headerName: 'Tên nhân viên',
    headerProperty: 'staffName',
    headerIndex: 4,
    className: 'w-100-px'
  },
  {
    headerName: 'Nội dung',
    headerProperty: 'trnDesc',
    headerIndex: 5,
    className: 'w-300-px'
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'makerId',
    headerIndex: 6,
    width: '100px',
    className: 'w-100-px'
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: 'makerDt',
    headerIndex: 7,
    className: 'w-100-px',
    type: 'datetime'
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'statusName',
    headerIndex: 8,
    className: 'w-100-px'
  },
];
export const BILL_TABLE_VIETTEL_POST: LpbDatatableColumn[] = [
  {
    headerName: 'Mã bảng kê',
    headerProperty: 'billCode',
    headerIndex: 0,
    className: 'w-50-px'
  },
  {
    headerName: 'Mã nhân viên',
    headerProperty: 'custId',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'Tên nhân viên',
    headerProperty: 'custName',
    headerIndex: 2,
    className: 'w-100-px'
  },
  {
    headerName: 'Nội dung khoản thu',
    headerProperty: 'billDesc',
    headerIndex: 3,
    className: 'w-400-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'billAmount',
    headerIndex: 4,
    width: '100px',
    type: 'currency',
    className: 'w-100-px'
  },
];
export const TRANSACTION_POST_DETAIL: LpbDatatableColumn[] = [
  {
    headerName: 'Số GD',
    headerProperty: 'tranNo',
    headerIndex: 0,
    className: 'w-100-px'
  },
  {
    headerName: 'Số tài khoản',
    headerProperty: 'acNumber',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'Tên tài khoản',
    headerProperty: 'acName',
    headerIndex: 2,
    className: 'w-80-px'
  },
  {
    headerName: 'Nợ/Có',
    headerProperty: 'drcrInd',
    headerIndex: 3,
    className: 'w-80-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'lcyAmount',
    headerIndex: 4,
    width: '100px',
    type: 'currency',
    className: 'w-100-px'
  },
  {
    headerName: 'Trạng thái hạch toán',
    headerProperty: 'htStatusName',
    headerIndex: 5,
    className: 'w-200-px'
  },
];
export const CURRENCIES = {
  USD: 'USD',
  AUD: 'AUD',
  EUR: 'EUR',
  GBP: 'GBP',
  VND: 'VND',
};

export const LIST_STATUS_APPROVED = [
  {name: 'Chờ duyệt', value: 'IN_PROCESS'},
  {name: 'Đã duyệt', value: 'APPROVE'},
  {name: 'Nghi ngờ', value: 'TIMEOUT'},
  {name: 'Gạch nợ bổ sung', value: 'BOSUNG'},
];
export const VALUE_CODES = {
  CASH: 'NVL1',
  PAYMENTTYPE_TM: 'NT01', // xet dieu kien CK hay TM, phu thuoc vào PAYMENT_TYPE
  PAYMENTTYPE_CK: 'CT01',
  ACTIONCODE_APPROVE: 'VIETLOTT_SERVICE_FOOTER_ACTION_APPROVE', // dung khi set Hidden Button
  ACTIONCODE_REJECT: 'VIETLOTT_SERVICE_FOOTER_ACTION_REJECT',
  ACTIONCODE_IN_CT: 'VIETLOTT_SERVICE_FOOTER_ACTION_PRINT_DOCUMENT_KSV',
  ACTIONCODE_SETTLE_BILL: 'VIETLOTT_SERVICE_FOOTER_ACTION_SETTLE_BILL',
  ACTIONCODE_CHECK: 'VIETLOTT_SERVICE_FOOTER_ACTION_CHECK',
};
export const BILL_TABLE_VIETTEL_POST_DETAIL: LpbDatatableColumn[] = [
  {
    headerName: 'Mã bảng kê',
    headerProperty: 'billCode',
    headerIndex: 0,
    className: 'w-50-px'
  },
  {
    headerName: 'Mã nhân viên',
    headerProperty: 'staffId',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'Tên nhân viên',
    headerProperty: 'staffName',
    headerIndex: 2,
    className: 'w-100-px'
  },
  {
    headerName: 'Nội dung khoản thu',
    headerProperty: 'trnDesc',
    headerIndex: 3,
    className: 'w-400-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'billAmount',
    headerIndex: 4,
    width: '100px',
    type: 'currency',
    className: 'w-100-px'
  },
];
export const MONETARY_VALUE = [
  {denomination: 500000, quantity: null},
  {denomination: 200000, quantity: null},
  {denomination: 100000, quantity: null},
  {denomination: 50000, quantity: null},
  {denomination: 20000, quantity: null},
  {denomination: 10000, quantity: null},
  {denomination: 5000, quantity: null},
  {denomination: 2000, quantity: null},
  {denomination: 1000, quantity: null},
  {denomination: 500, quantity: null},
  {denomination: 200, quantity: null}];


export const TRANSACTION_TABLE_VIETTEL_POST_APPROVED: LpbDatatableColumn[] = [
  {
    headerName: 'Số GD',
    headerProperty: 'tranNo',
    headerIndex: 0,
    className: 'w-150-px'
  },
  {
    headerName: 'Hình thức',
    headerProperty: 'paymentTypeName',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'Mã bảng kê',
    headerProperty: 'billCode',
    headerIndex: 2,
    className: 'w-100-px'
  },
  {
    headerName: 'Tên nhân viên',
    headerProperty: 'staffName',
    headerIndex: 3,
    className: 'w-110-px'
  },
  {
    headerName: 'Nội dung',
    headerProperty: 'trnDesc',
    headerIndex: 4,
    className: 'w-300-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'amount',
    headerIndex: 5,
    className: 'w-100-px',
    type: 'currency'
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'makerId',
    headerIndex: 6,
    width: '100px',
    className: 'w-100-px'
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: 'makerDt',
    headerIndex: 7,
    className: 'w-100-px',
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'statusName',
    headerIndex: 8,
    className: 'w-100-px'
  },
];



