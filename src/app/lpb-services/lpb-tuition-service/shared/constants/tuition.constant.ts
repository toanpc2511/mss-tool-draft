export const BRANCH_UPLOAD_FILE = '170';

export const PAYMENT_METHODS = [
  { label: "NP03 - NT học phí cùng tỉnh, Tp - không phí dịch vụ", value: "NP03" },
  { label: "CP03 - CT học phí cùng tỉnh , Tp - không phí dịch vụ", value: "CP03" },
  { label: "NP04 - NT học phí khác tỉnh , Tp - không phí dịch vụ", value: "NP04" },
  { label: "CP04 - CT học phí khác tỉnh , Tp - không phí dịch vụ", value: "CP04" },
]

export const IDENTITY_DOC_TYPES = [
  { label: "Số CIF", value: "CIF" }
]

export const STATUS_TRANSACTION = [
  { label: 'Chờ duyệt', value: 'IN_PROCESS' },
  { label: 'Đã duyệt', value: 'APPROVE' }
]
export const STATUS_TRANSACTION2 = [
  { label: 'Chờ duyệt', value: 'IN_PROCESS' },
  { label: 'Đã duyệt', value: 'APPROVE' },
  { label: 'Nghi Ngờ', value: 'TIMEOUT' }
]

export const TRANSACTION_TYPES = [
  { label: 'Duyệt thanh toán', value: 'IN_PROCESS' },
  { label: 'Duyệt gạch nợ bổ sung', value: 'CHANGE_DEBT' },
  { label: 'Kiểm tra giao dịch nghi ngờ', value: 'CHECK' },
]

export const TRANSACTION_TYPES_AUTO_PAYMENT = [
  { label: 'Duyệt đăng ký tự động', value: 'APPROVE_REGISTER_AUTO_SETTLE' },
  { label: 'Duyệt hủy đăng ký tự động', value: 'APPROVE_CANCEL_AUTO_SETTLE' },
 ]

  // { label: 'Duyệt chỉnh sửa đăng ký tự động', value: 'APPROVE_MODIFY_AUTO_SETTLE' },
export const STATUS_FILE = [
  { label: 'Chờ duyệt', value: 'INIT' },
  { label: 'Đã duyệt', value: 'OPEN' },
  { label: 'Từ chối duyệt', value: 'CLOSE' }
];
export const CROSS_UNIVERSITY = [
  { label: 'TRƯỜNG CAO ĐẲNG LÀO CAI', value: '1' },
  { label: 'TRƯỜNG ĐẠI HỌC HƯNG YÊN', value: '2' }
]
export const STATUS_SETTLE = [
  { label: 'Chờ duyệt', value: 'IN_PROCESS' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối duyệt', value: 'REJECT' },
];

export const ACCOUNTING_STATUS = [
  { label: "Chờ duyệt", value: "IN_PROCESS" },
  { label: "Đã duyệt", value: "SUCCESS" },
  { label: "Thất bại", value: "FALSE" },
  { label: "Lỗi", value: "ERROR" },
]

export const CHARGE_DEBIT_STATUS = [
  { label: "Đang xử lý", value: "IN_PROCESS" },
  { label: "Đã xử lý", value: "SUCCESS" },
  { label: "Thất bại", value: "FALSE" },
  { label: "Lỗi", value: "ERROR" },
]

export const TRANSACTION_STATUS = [
  { label: "Đang xử lý", value: "IN_PROCESS" },
  { label: "Thành công", value: "SUCCESS" },
  { label: "Thất bại", value: "FALSE" },
  { label: "Lỗi", value: "ERROR" },
  { label: "Hủy", value: "CANCEL" },
]

// export const TRANSACTION_TELLER_KSV_COLUMN = [
  export const FILE_KSV_COLUMNS = [
    {
      headerName: 'Trường',
      headerProperty: 'school',
      headerIndex: 0,
      className: 'w-200-px',
    },
    {
      headerName: 'Tên file',
      headerProperty: 'name',
      headerIndex: 1,
      className: 'w-200-px',
    },
    {
      headerName: 'Nội dung',
      headerProperty: 'detail',
      headerIndex: 2,
      className: 'w-200-px',
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 3,
      className: 'w-150-px',
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 4,
      className: 'w-200-px',
      type: 'datetime'
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'recordStatName',
      headerIndex: 5,
      className: 'w-150-px',
    },
  ];

export const CHANGE_DEBTS_TRANSACTION_TELLER_KSV_COLUMN = [
  {
    headerName: 'Mã CN',
    headerProperty: 'tranBrn',
    headerIndex: 0,
    className: 'w-100-px'
  },
  {
    headerName: 'Tên chi nhánh',
    headerProperty: 'tranName',
    headerIndex: 1,
    className: 'w-300-px'
  },
  {
    headerName: 'Mã GD',
    headerProperty: 'transNo',
    headerIndex: 2,
    className: 'w-300-px'
  },
  {
    headerName: 'Bill code',
    headerProperty: 'billCode',
    headerIndex: 3,
    className: 'w-100-px'
  },
  {
    headerName: 'Ngày GD',
    headerProperty: 'makerDt',
    headerIndex: 4,
    className: 'w-300-px',
    type: 'datetime'
  },
  {
    headerName: 'Mã KH',
    headerProperty: 'customerId',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái gạch nợ',
    headerProperty: 'changeDebtStatusName',
    headerIndex: 6,
    className: 'w-300-px'
  },
  {
    headerName: 'Trạng thái giao dịch',
    headerProperty: 'auditStatusName',
    headerIndex: 7,
    className: 'w-300-px'
  },
  {
    headerName: 'Kỳ HĐ',
    headerProperty: 'billId',
    headerIndex: 8,
    className: 'w-100-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'settledAmount',
    headerIndex: 9,
    type: 'currency',
    className: 'w-200-px text-right'
  },
  {
    headerName: 'Tài khoản ghi nợ',
    headerProperty: 'acNumber',
    headerIndex: 10,
    className: 'w-200-px'
  },
  {
    headerName: 'Kênh TT',
    headerProperty: 'chanelName',
    headerIndex: 11,
    className: 'w-300-px'
  },
  {
    headerName: 'Value Date',
    headerProperty: 'valueDate',
    headerIndex: 12,
    className: 'w-300-px',
    type: 'datetime'
  },
  {
    headerName: 'Trans Date',
    headerProperty: 'tranDt',
    headerIndex: 13,
    className: 'w-300-px',
    type: 'datetime'
  },
];

export const PAYMENT_AUTO_KSV_COLUMNS = [
  {
    headerName: 'Số GD',
    headerProperty: 'transNo',
    headerIndex: 0,
    className: 'w-200-px',
  },
  {
    headerName: 'Mã KH',
    headerProperty: 'custId',
    headerIndex: 1,
    className: 'w-150-px',
  },
  {
    headerName: 'Tên khách hàng',
    headerProperty: 'custName',
    headerIndex: 2,
    className: 'w-300-px',
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'statusName',
    headerIndex: 3,
    className: 'w-150-px',
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'createdBy',
    headerIndex: 4,
    className: 'w-150-px',
  },
  {
    headerName: 'Chi nhánh',
    headerProperty: 'brnName',
    headerIndex: 5,
    className: 'w-300-px',
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: 'createdDate',
    headerIndex: 6,
    className: 'w-200-px',
    type: 'datetime'
  },
];

export const PAYMENT_TYPES = [
  { label: 'Theo thông báo từ nhà cung cấp dịch vụ', value: '01', serviceType: "water-service" },
]

const calcRecurringPaymentDate = () => {
  let result = [];
  for (let index = 0; index < 28; index++) {
    result.push({ label: `Ngày ${index + 1} hàng tháng`, value: index + 1 })
  }
  return result;
}

export const RECURRING_PAYMENT_DATES = calcRecurringPaymentDate()

export const COLUMNS_BILLS = [
  {
    headerName: 'Tên Sinh Viên',
    headerProperty: 'studentName',
    headerIndex: 3,
    className: 'w-300-px',
  },
  {
    headerName: 'Lớp',
    headerProperty: 'className',
    headerIndex: 4,
    className: 'w-200-px',
  },
  {
    headerName: 'Khóa',
    headerProperty: 'faculty',
    headerIndex: 4,
    className: 'w-100-px',
  },
  {
    headerName: 'Nội dung khoản thu',
    headerProperty: 'feeType',
    headerIndex: 4,
    className: 'w-300-px',
  },
  {
    headerName: 'Kỳ thu',
    headerProperty: 'semester',
    headerIndex: 4,
    className: 'w-100-px',
  },
  {
    headerName: 'Năm',
    headerProperty: 'year',
    headerIndex: 4,
    className: 'w-100-px',
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'amount',
    headerIndex: 5,
    type: "currency",
    className: 'w-100-px',
  },

];

export const COLUMNS_TRANDETAIL = [
  {
    headerName: 'Tên Sinh Viên',
    headerProperty: 'studentName',
    headerIndex: 3,
    className: 'w-300-px',
  },
  {
    headerName: 'Lớp',
    headerProperty: 'className',
    headerIndex: 4,
    className: 'w-200-px',
  },
  {
    headerName: 'Khóa',
    headerProperty: 'faculty',
    headerIndex: 4,
    className: 'w-100-px',
  },
  {
    headerName: 'Nội dung khoản thu',
    headerProperty: 'billDescription',
    headerIndex: 4,
    className: 'w-300-px',
  },
  {
    headerName: 'Kỳ thu',
    headerProperty: 'semester',
    headerIndex: 4,
    className: 'w-100-px',
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'amount',
    headerIndex: 5,
    type: "currency",
    className: 'w-100-px',
  },

];

export const COLUMNS_ACCOUNTING = [
  {
    headerName: 'Số GD',
    headerProperty: 'transNo',
    headerIndex: 3,
    className: 'w-200-px',
  },
  {
    headerName: 'Số tài khoản',
    headerProperty: 'acNumber',
    headerIndex: 3,
    className: 'w-200-px',
  },
  {
    headerName: 'Tên tài khoản',
    headerProperty: 'acName',
    headerIndex: 4,
    className: 'w-300-px',
  },
  {
    headerName: 'Nợ/Có',
    headerProperty: 'drcrType',
    headerIndex: 5,
    className: 'w-100-px',
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'lcyAmount',
    type: "currency",
    headerIndex: 6,
    className: 'w-200-px',
  },
  {
    headerName: 'Trạng thái hạch toán',
    headerProperty: 'accountingStatusName',
    headerIndex: 6,
    className: 'w-200-px',
  }
];

export const COLUMNS_TRANSACTIONS = [


  {
    headerName: 'Số GD',
    headerProperty: 'tranNo',
    headerIndex: 0,
    width: '50px',
    className: 'w-200-px'
  },
  {
    headerName: 'Hình thức',
    headerProperty: 'paymentTypeCode',
    headerIndex: 1,
    width: '100px',
    className: 'w-200-px'
  },
  {
    headerName: 'Mã sinh viên',
    headerProperty: 'studentCode',
    headerIndex: 2,
    width: '100px',
    className: 'w-200-px'
  },
  {
    headerName: 'Tên sinh viên',
    headerProperty: 'studentName',
    headerIndex: 3,
    width: '200px',
    className: 'w-200-px'
  },

  {
    headerName: 'Số tiền',
    headerProperty: 'totalAmount',
    headerIndex: 4,
    width: '200px',
    type: 'currency',
    className: 'w-100-px'
  },
  {
    headerName: 'Nội dung',
    headerProperty: 'tranDesc',
    headerIndex: 5,
    className: 'w-400-px'
  },
  {
  headerName: 'Ngày tạo',
  headerProperty: 'createdDate',
  headerIndex: 6,
  width: '200px',
  type: 'date',
  className: 'w-200-px'
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'createdBy',
    headerIndex: 7,
    width: '200px',
    className: 'w-100-px'
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'statusName',
    headerIndex: 8,
    width: '200px',
    className: 'w-200-px'
  },
  {
    headerName: 'Lớp',
    headerProperty: 'className',
    headerIndex: 9,
    width: '200px',
    className: 'w-200-px'
  },
  {
    headerName: 'Khóa',
    headerProperty: 'faculty',
    headerIndex: 10,
    width: '200px',
    className: 'w-200-px'
  },
];

export const STATUS_APPROVE_TRANSACTION_SUCCESS = 'SUCCESS';

export const COLUMNS_CLEAR_DEBTS = [
  { headerName: "Mã CN", headerProperty: "tranBrn", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Tên CN", headerProperty: "tranName", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Mã KH", headerProperty: "customerId", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Ngày GD", headerProperty: "makerDt", headerIndex: 0, type: "date", width: 100, className: "w-200-px" },
  { headerName: "Tháng HĐ", headerProperty: "billId", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Năm HĐ", headerProperty: "billCode", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Số tiền", headerProperty: "settledAmount", headerIndex: 0, type: "currency", width: 100, className: "w-100-px" },
  { headerName: "TK ghi nợ", headerProperty: "acNumber", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Kênh TT", headerProperty: "chanelName", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Trạng thái gạch nợ", headerProperty: "changeDebtStatusName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Value Date", headerProperty: "valueDate", headerIndex: 0, type: "datetime", width: 100, className: "w-200-px" },
  { headerName: "Trans Date", headerProperty: "tranDt", headerIndex: 0, type: "datetime", width: 100, className: "w-200-px" },
]

export const COLUMNS_AUTO_PAY_SIGN_UP = [
  { headerName: "Số GD", headerProperty: "transNo", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Mã KH", headerProperty: "custId", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Tên khách hàng", headerProperty: "custName", headerIndex: 0, type: "C", width: 100, className: "w-300-px" },
  { headerName: "Người tạo", headerProperty: "createdBy", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Ngày tạo", headerProperty: "createdDate", headerIndex: 0, type: "datetime", width: 100, className: "w-200-px" },
  { headerName: "Loại giao dịch", headerProperty: "transactionTypeName", headerIndex: 0, type: "C", width: 100, className: "w-300-px" },
  { headerName: "Trạng thái hoạt động", headerProperty: "settleStatusName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Trạng thái giao dịch", headerProperty: "statusName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
]

export const COLUMNS_REPORT1 = [
  { headerName: "Mã CN", headerProperty: "tranBrn", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Mã GD", headerProperty: "transNo", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Ngày GD", headerProperty: "tranDt", headerIndex: 0, type: "date", width: 100, className: "w-100-px" },
  { headerName: "Mã KH", headerProperty: "customerId", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Tên KH", headerProperty: "customerName", headerIndex: 0, type: "C", width: 100, className: "w-300-px" },
  { headerName: "Kỳ HĐ", headerProperty: "billCycle", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Số tiền", headerProperty: "totalAmount", headerIndex: 0, type: "currency", width: 100, className: "w-100-px" },
  { headerName: "TK ghi nợ", headerProperty: "accNumber", headerIndex: 0, type: "C", width: 100, className: "w-150-px" },
  { headerName: "Kênh TT", headerProperty: "paymentChannelTypeName", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Trạng thái", headerProperty: "summaryTranStatusName", headerIndex: 0, type: "C", width: 100, className: "w-400-px" },
  { headerName: "Value Date", headerProperty: "valueDate", headerIndex: 0, type: "datetime", width: 100, className: "w-150-px" },
  { headerName: "Trans Date", headerProperty: "transDate", headerIndex: 0, type: "datetime", width: 100, className: "w-150-px" },
]

export const COLUMNS_REPORT2 = [
  { headerName: "Tên CN", headerProperty: "brnName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Số TK", headerProperty: "acNumber", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Tên TK", headerProperty: "acName", headerIndex: 0, type: "C", width: 100, className: "w-400-px" },
  { headerName: "Ngày thanh toán", headerProperty: "settleDate", headerIndex: 0, type: "C", width: 100, className: "w-150-px" },
  { headerName: "Ngày hiệu lực", headerProperty: "lastModifiedDate", headerIndex: 0, type: "datetime", width: 100, className: "w-200-px" },
  { headerName: "Nội dung", headerProperty: "desc", headerIndex: 0, type: "C", width: 100, className: "w-300-px" },
]

export const REPORT_TYPES = [
  { label: "Báo cáo giao dịch", value: "1", api: "/water-service/report/transaction", columns: COLUMNS_REPORT1, apiReport: "water-service/report/transaction/export" },
  { label: "Báo cáo đăng ký tự động", value: "2", api: "/water-service/settle", columns: COLUMNS_REPORT2, apiReport: "water-service/report/settle/export" },
]

export const PAYMENT_CHANNELS = [
  { label: 'Tại quầy', value: 'TELLER' },
  { label: 'Tự động', value: 'AUTOMATION' },
];

export const REQUEST_TYPES_AUTO_PAYMENT_SEARCH = [
  { label: 'Đăng ký thanh toán tự động', value: 'APPROVE_REGISTER_AUTO_SETTLE' },
  { label: 'Hủy đăng ký thanh toán tự động', value: 'APPROVE_CANCEL_AUTO_SETTLE' }
];

export const STATUS_SETTLE_AUTO_PAYMENT_SEARCH = [
  { label: 'Chờ duyệt', value: 'IN_PROCESS' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Đã hủy', value: 'CANCELED' },
  { label: 'Từ chối duyệt', value: 'REJECT' }
];

export const STATUS_TRANSACTION_SEARCH = [
  { label: 'Hạch toán thành công', value: 'HT_SUCCESS' },
  { label: 'Hạch toán thất bại', value: 'HT_FAILED' },
  { label: 'Hạch toán không rõ trạng thái', value: 'HT_UNK' },
  { label: 'Hạch toán thành công - Gạch nợ thành công', value: 'GN_SUCCESS' },
  { label: 'Hạch toán thành công - Gạch nợ thất bại', value: 'GN_FAILED' },
  { label: 'Hạch toán thành công - Gạch nợ không rõ trạng thái', value: 'GN_UNK' },
  // { label: 'Revert giao dịch thành công', value: 'REVERT_SUCCESS' },
  // { label: 'Revert giao dịch thất bại', value: 'REVERT_FAILED' },
  // { label: 'Revert giao dịch không rõ trạng thái', value: 'REVERT_UNK' },
  { label: 'Gạch nợ thất bại - Revert giao dịch thành công', value: 'REVERT_SUCCESS' },
  { label: 'Gạch nợ thất bại - Revert giao dịch thất bại', value: 'REVERT_FAILED' },
  { label: 'Gạch nợ thất bại - Revert giao dịch không rõ trạng thái', value: 'REVERT_UNK' },
];

export const CROSS_CHECKING_RESULTS = [
  { label: 'Sai lệch', value: 'NOT_MATCHED' },
  { label: 'Trùng khớp', value: 'MATCHED' },
  { label: 'Thiếu thông tin LPB', value: 'LPB_MISSING' },
  { label: 'Thiếu thông tin đối tác', value: 'SUPPLIER_MISSING' },
]

export const COLUMNS_REPORT_CROSS_CHECKING = [
  { headerName: "Số giao dịch", headerProperty: "tranNo", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Tên khách hàng", headerProperty: "custName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Mã KH (LPB)", headerProperty: "custId", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Mã KH (Đối tác)", headerProperty: "custIdSupplier", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Kỳ hóa đơn (LPB)", headerProperty: "billCycleLpb", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Kỳ hóa đơn (Đối tác)", headerProperty: "billCycleSupplier", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Số tiền (LPB)", headerProperty: "totalAmountLpb", headerIndex: 0, type: "currency", width: 100, className: "w-100-px" },
  { headerName: "Số tiền (Đối tác)", headerProperty: "totalAmountSupplier", headerIndex: 0, type: "currency", width: 100, className: "w-100-px" },
  { headerName: "Ngày GD (LPB)", headerProperty: "tranDateLpb", headerIndex: 0, type: "date", width: 100, className: "w-100-px" },
  { headerName: "Ngày GD (Đối tác)", headerProperty: "tranDateSupplier", headerIndex: 0, type: "date", width: 100, className: "w-100-px" },
  { headerName: "Trạng thái gạch nợ (LPB)", headerProperty: "statusLpbName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Trạng thái gạch nợ (Đối tác)", headerProperty: "statusSupplierName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Hình thức thanh toán", headerProperty: "paymentTypeName", headerIndex: 0, type: "", width: 100, className: "w-150-px" },
  { headerName: "Kênh thanh toán", headerProperty: "paymentChannelTypeName", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Kết quả đối soát", headerProperty: "forControlResultName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
]

export const TAIKHOANTM =
  { accNo: "101100001", name: "TK Tiền mặt đã kiểm đếm", accBranch:"110" }
