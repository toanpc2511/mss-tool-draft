export const API_CITY = '/lpb-common-service/api/public/redis/city';
export const API_DISTRICT = '/lpb-common-service/api/public/redis/district';
export const API_WARD = '/lpb-common-service/api/public/redis/ward';

export const PERSONAL_TAX_COLUMNS = [
  {
    headerName: 'Số giao dịch',
    headerProperty: 'transNo',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã số thuế',
    headerProperty: 'taxCode',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên người nộp thế',
    headerProperty: 'payerName',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Loại thuế',
    headerProperty: 'taxTypeName',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'billAmount',
    headerIndex: 4,
    type: 'currency',
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái giao dịch',
    headerProperty: 'statusName',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Hình thức',
    headerProperty: 'paymentTypeName',
    headerIndex: 6,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: 'createdDate',
    headerIndex: 7,
    type: 'datetime',
    className: 'w-200-px'
  },
];

export const SEARCH_TAX_COLUMNS = [
  {
    headerName: 'Mã số thuế',
    headerProperty: 'taxCode',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên người nộp thuế',
    headerProperty: 'payerName',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Số hiệu kho bạc',
    headerProperty: 'treasuryNumber',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã chương',
    headerProperty: 'chapter',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'billAmount',
    headerIndex: 4,
    type: 'currency',
    className: 'w-200-px'
  },
  {
    headerName: 'Số quyết định',
    headerProperty: 'decisionNumber',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày quyết định',
    headerProperty: 'decisionDate',
    headerIndex: 6,
    type: 'date',
    className: 'w-200-px'
  },
];

export const LAND_COLUMNS = [
  {
    headerName: 'Mã thửa đất',
    headerProperty: '',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tờ bản đồ',
    headerProperty: '',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Địa chỉ thửa đất',
    headerProperty: '',
    headerIndex: 2,
    className: 'w-300-px'
  },
  {
    headerName: 'Tên Huyện',
    headerProperty: '',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên Xã',
    headerProperty: '',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Số thông báo',
    headerProperty: '',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày thông báo',
    headerProperty: '',
    headerIndex: 6,
    className: 'w-200-px',
    type: 'date'
  },
];
export const DECISION_COLUMNS = [
  {
    headerName: 'Số quyết định',
    headerProperty: 'decisionNumber',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Loại thuế',
    headerProperty: 'taxTypeApi',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'Số khung',
    headerProperty: 'containerNumber',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Số máy',
    headerProperty: 'engineNumber',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày quyết định',
    headerProperty: 'decisionDate',
    headerIndex: 4,
    type: 'date',
    className: 'w-200-px'
  },
  {
    headerName: 'Đặc điểm',
    headerProperty: 'describe',
    headerIndex: 5,
    className: 'w-300-px'
  }
];

export const SUBSECTION_COLUMNS = [
  {
    headerName: 'Mã chương',
    headerProperty: 'chapterChange',
    headerIndex: 0,
    className: 'w-150-px'
  },
  {
    headerName: 'Tiểu mục',
    headerProperty: '',
    headerIndex: 1,
    className: 'w-150-px'
  },
  {
    headerName: 'Tên tiểu mục',
    headerProperty: '',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'billAmount',
    headerIndex: 5,
    type: 'currency',
    className: 'w-150-px'
  },
  {
    headerName: 'TK ngân sách',
    headerProperty: '',
    headerIndex: 6,
    className: 'w-300-px'
  }
];

export const SUBSECTION_TAX_OTHER_COLUMNS = [
  ...SUBSECTION_COLUMNS,
  {
    headerName: 'Số quyết định/ mã hồ sơ',
    headerProperty: '',
    headerIndex: 3,
    className: 'w-300-px'
  },
  {
    headerName: 'Kỳ thuế',
    headerProperty: '',
    headerIndex: 4,
    className: 'w-200-px'
  }
];

export const BT_COLUMNS = [
  {
    headerName: 'Số giao dịch',
    headerProperty: 'id',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tài khoản',
    headerProperty: 'acNumber',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'lcyAmount',
    headerIndex: 2,
    type: 'currency',
    className: 'w-200-px'
  },
  {
    headerName: 'Nợ/ Có',
    headerProperty: 'drcrType',
    headerIndex: 3,
    className: 'w-100-px'
  },
];

export const APPROVE_TRANSACTION_EXTRAL_COLUMNS = [
  {
    headerName: 'Số GD',
    headerProperty: 'transNo',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã GD core',
    headerProperty: '',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Số hồ sơ/ Số QĐ/ Mã ID',
    headerProperty: 'treasuryNumber',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã số thuế',
    headerProperty: 'taxCode',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên người nộp thuế',
    headerProperty: 'payerName',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Loại thuế',
    headerProperty: 'taxTypeName',
    headerIndex: 5,
    className: 'w-300-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'billAmount',
    headerIndex: 6,
    type: 'currency',
    className: 'w-200-px'
  },
  {
    headerName: 'Mã CN',
    headerProperty: 'trnName',
    headerIndex: 7,
    className: 'w-200-px'
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'createdBy',
    headerIndex: 8,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: 'createdDate',
    headerIndex: 9,
    type: 'date',
    className: 'w-200-px'
  }
];
