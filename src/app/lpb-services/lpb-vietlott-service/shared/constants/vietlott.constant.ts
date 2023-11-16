import {LpbDatatableColumn} from '../../../../shared/models/LpbDatatableColumn';

export const NOTE = 'Phí: Vui lòng thực hiện bút toán thu phí giao dịch tiền mặt hoặc chuyển khoản tại HOST ( nếu giao dịch có phí)';
export const WARN = 'Lưu ý: Phí thu hộ Vietlott do CN Hà Nội thu và phát hành hóa đơn theo từng tháng; Chi nhánh Hà Nội phân bổ thu phí về các ĐVKD thực hiện dịch vụ. Các ĐVKD không thu bất kỳ khoản phí nào khác với các đại lý, điểm bán hàng khi thực hiện giao dịch tăng hạn mức.';
export const ACC_VIETLOTT = '999999730382';
export const ACC_NAME_VIETLOTT = 'CT TNHH MTV XO SO DIEN TOAN VN';
// export const ACC_BRANCH_VIETLOTT = '110';
export const CASH_ACCNO = '101100001';
export const CASH_ACCNAME = 'TK Tiền mặt đã kiểm đếm';

export const VALUE_CODES = {
  CASH: 'NVL1',
  PAYMENTTYPE_TM: 'NT01', // xet dieu kien CK hay TM, phu thuoc vào PAYMENT_TYPE
  PAYMENTTYPE_CK: 'CT01',
  ACTIONCODE_APPROVE: 'VIETLOTT_SERVICE_FOOTER_ACTION_APPROVE', // dung khi set Hidden Button
  ACTIONCODE_REJECT: 'VIETLOTT_SERVICE_FOOTER_ACTION_REJECT',
  ACTIONCODE_IN_CT: 'VIETLOTT_SERVICE_FOOTER_ACTION_PRINT_DOCUMENT_KSV',
};

export const LIST_AGENT_TYPE = [
  {label: 'V2VL', value: 'V2VL'},
];

export const LIST_STATUS = [
  {label: 'Chờ duyệt', value: 'IN_PROCESS'},
  {label: 'Đã duyệt', value: 'APPROVE'},
  {label: 'Từ chối duyệt', value: 'REJECT'},
  {label: 'Xóa', value: 'CANCEL'}
];
export const LIST_STATUS_KSV = [
  {label: 'Chờ duyệt', value: 'IN_PROCESS'},
  {label: 'Đã duyệt', value: 'APPROVE'},
  {label: 'Từ chối duyệt', value: 'REJECT'}
];
export const LIST_STATUS_RETRY = [
  {label: 'Chờ duyệt tăng hạn mức bổ sung', value: 'IN_PROCESS'},
  {label: 'Đã duyệt tăng hạn mức', value: 'APPROVE'},
  {label: 'Từ chối tăng hạn mức', value: 'REJECT'}
];
export const LIST_TRANS_TYPE = [
  {label: 'Giao dịch nạp tiền', value: 'TRANS'},
  {label: 'Giao dịch tăng hạn mức bổ sung', value: 'TRANS_RETRY'},
  {label: 'Giao dịch nghi ngờ', value: 'TRANS_TIMEOUT'}
];

export const IDENTITY_DOC_TYPES = [
  {label: 'Số CIF', value: 'CIF'}
];

export const PAYMENT_METHODS = [
  {label: 'Chuyển khoản cùng tỉnh_CVL1', value: 'CK'},
  {label: 'Nộp tiền mặt cùng tỉnh_NVL1', value: 'NVL1'},
];

export const PAYMENT_TYPE = [
  {label: 'Tiền mặt', value: 'NT01'},
  {label: 'Chuyển khoản', value: 'CT01'},
];
export const LIST_CHANEL = [
  {label: 'Tất cả', value: 'ALL'},
  {label: 'CITAD', value: 'CITAD'},
  {label: 'Lienviet24H', value: 'Lienviet24H'},
  {label: 'IB', value: 'IB'},
  {label: 'NAPAS', value: 'NAPAS'},
  {label: 'UNIFORM', value: 'UNIFORM'},
];
export const LIST_REPORT_TYPE = [
  {value: 'BC01', label: 'Báo cáo giao dịch'},
  {value: 'BC02', label: 'Báo cáo phí thu hộ Vietlott'},
];

export const TRANSACTION_TABLE: LpbDatatableColumn[] = [
  {
    headerName: 'Số GD',
    headerProperty: 'transToVietlott',
    headerIndex: 0,
    className: 'w-50-px'
  },
  {
    headerName: 'Mã đại lý',
    headerProperty: 'posId',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'Tên đại lý',
    headerProperty: 'posName',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Số điện thoại',
    headerProperty: 'posMobi',
    headerIndex: 3,
    className: 'w-100-px'
  },
  {
    headerName: 'Địa chỉ',
    headerProperty: 'posAddress',
    headerIndex: 4,
    className: 'w-100-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'amount',
    headerIndex: 5,
    width: '200px',
    type: 'currency',
    className: 'w-100-px'
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'recordStatusName',
    headerIndex: 6,
    width: '100px',
    className: 'w-100-px'
  },
  {
    headerName: 'Hình thức',
    headerProperty: 'paymentType',
    headerIndex: 7,
    className: 'w-100-px'
  },
  {
    headerName: 'Mô tả',
    headerProperty: 'trnDesc',
    headerIndex: 8,
    className: 'w-200-px'
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'makerId',
    headerIndex: 9,
    className: 'w-50-px'
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: 'makerDt',
    headerIndex: 10,
    className: 'w-100-px',
    type: 'datetime'
  },
];
export const TRANSACTION_TABLE_KSV: LpbDatatableColumn[] = [
  {
    headerName: 'Số GD',
    headerProperty: 'transToVietlott',
    headerIndex: 0,
    className: 'w-50-px'
  },
  {
    headerName: 'Mã đại lý',
    headerProperty: 'posId',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'Tên điểm bán hàng',
    headerProperty: 'posName',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tiền giao dịch',
    headerProperty: 'amount',
    headerIndex: 3,
    width: '200px',
    type: 'currency',
    className: 'w-100-px'
  },
];
export const TRANSACTION_RETRY_TABLE: LpbDatatableColumn[] = [
  {
    headerName: 'Mã CN',
    headerProperty: 'trnBrn',
    headerIndex: 0,
    className: 'w-20-px'
  },
  {
    headerName: 'Tên CN',
    headerProperty: 'trnName',
    headerIndex: 1,
    className: 'w-150-px'
  },
  {
    headerName: 'Mã đại lý',
    headerProperty: 'posId',
    headerIndex: 2,
    className: 'w-150-px'
  },
  {
    headerName: 'Ngày GD',
    headerProperty: 'makerDt',
    headerIndex: 3,
    className: 'w-80-px',
    type: 'datetime'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'amount',
    headerIndex: 4,
    width: '200px',
    type: 'currency',
    className: 'w-100-px'
  },
  {
    headerName: 'TK ghi nợ',
    headerProperty: 'accNo',
    headerIndex: 5,
    className: 'w-100-px'
  },
  {
    headerName: 'Kênh TT',
    headerProperty: 'chanelCode',
    headerIndex: 6,
    className: 'w-100-px'
  },
  {
    headerName: 'Trạng thái gạch nợ',
    headerProperty: 'gnStatusName',
    headerIndex: 7,
    width: '100px',
    className: 'w-100-px'
  },
  {
    headerName: 'Value Date',
    headerProperty: 'makerDt',
    headerIndex: 8,
    className: 'w-100-px',
    type: 'datetime'
  },
  {
    headerName: 'Trans date',
    headerProperty: 'checkerDt',
    headerIndex: 9,
    className: 'w-100-px',
    type: 'datetime'
  },
];
export const TRANSACTION_DETAIL: LpbDatatableColumn[] = [
  {
    headerName: 'Đại lý',
    headerProperty: 'posName',
    headerIndex: 0,
    className: 'w-100-px'
  },
  {
    headerName: 'Địa chỉ',
    headerProperty: 'posAddress',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'amount',
    headerIndex: 2,
    width: '100px',
    type: 'currency',
    className: 'w-100-px'
  },
  {
    headerName: 'Nội dung thanh toán',
    headerProperty: 'trnDesc',
    headerIndex: 3,
    className: 'w-80-px'
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'recordStatusName',
    headerIndex: 4,
    className: 'w-200-px'
  },
];
export const TRANSACTION_POST_DETAIL: LpbDatatableColumn[] = [
  {
    headerName: 'Số GD',
    headerProperty: 'transToVietlott',
    headerIndex: 0,
    className: 'w-100-px'
  },
  {
    headerName: 'Số tài khoản',
    headerProperty: 'acNo',
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
    headerProperty: 'amount',
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
