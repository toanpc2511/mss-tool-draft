import {
  REPORT_DETAIL_AUTO_PAYMENT_COLUMNS,
  REPORT_MOBIFONE_COLUMNS,
  REPORT_REGISTER_AUTO_COLUMNS,
  REPORT_TRANSACTION_COLUMNS,
  REPORT_TRANSACTION_LV24_COLUMNS
} from "./columns-transaction-electric.constant";

export const TICK_STATUS = [
  { value: 'ACTIVE', class: 'success' },
  { value: 'INACTIVE', class: 'error' },
  { value: 'IN_PROCESS', class: 'warning' },
  { value: 'APPROVE', class: 'success' },
  { value: 'REJECT', class: 'error' },
  { value: 'REVERT_IN_PROCESS', class: 'warning' },
  { value: 'REVERT_APPROVED', class: 'success' },
  { value: 'REVERT_REJECT', class: 'error' },
]

export const PAYMENT_METHODS = [
  { label: "Chuyển khoản", value: "CK" },
  { label: "Tiền mặt", value: "TTTM" },
]

export const IDENTITY_DOC_TYPES = [
  { label: "Số CIF", value: "CIF" }
]

export const STATUS_TRANSACTION = [
  { label: 'Chờ duyệt', value: 'IN_PROCESS' },
  { label: 'Đã duyệt', value: 'APPROVE' }
]

export const BATCH_STATUS_TRANSACTION = [
  { label: 'Chờ duyệt', value: 'IN_PROCESS' },
  { label: 'Đã duyệt nộp tiền vào trung gian', value: 'APPROVE_TRANSFER' },
  { label: 'Từ chối duyệt nộp tiền vào trung gian', value: 'REJECT_APPROVE_TRANSFER' },
  { label: 'Đã gạch nợ hóa đơn', value: 'APPROVE_CHANGE_DEBT' },
  { label: 'Từ chối duyệt gạch nợ hóa đơn', value: 'REJECT_APPROVE_CHANGE_DEBT' },
  { label: 'Đã báo có điện lực', value: 'APPROVE_ACCOUNTING' },
]

export const TRANSACTION_TYPES = [
  { label: 'Thanh toán hóa đơn', value: 'IN_PROCESS' },
  { label: 'Kiểm tra giao dịch nghi ngờ', value: 'CHECK' },
  { label: 'Kiểm tra giao dịch nghi ngờ revert', value: 'CHECK_REVERT' },
  { label: 'Gạch nợ bổ sung', value: 'CHANGE_DEBT' },
];

export const SEARCH_TRANSACTION_TYPES = [
  { label: 'Thanh toán hóa đơn', value: 'IN_PROCESS' },
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

export const TRANSACTION_TELLER_KSV_COLUMN = [
  {
    headerName: 'Số GD',
    headerProperty: 'transNo',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã KH',
    headerProperty: 'custId',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên KH',
    headerProperty: 'custName',
    headerIndex: 2,
    className: 'w-200-px'
  },

  {
    headerName: 'Số tiền',
    headerProperty: 'totalAmount',
    type: 'currency',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái giao dịch',
    headerProperty: 'status',
    headerIndex: 4,
    className: 'w-200-px',
    customStyleTick: {
      property: 'statusCode',
      valueProperty: [
        {
          value: 'APPROVE',
          class: 'success'
        },
        {
          value: 'IN_PROCESS',
          class: 'warning'
        },
        {
          value: 'REJECT',
          class: 'error'
        },
        {
          value: 'REVERT_IN_PROCESS',
          class: 'warning'
        },
        {
          value: 'REVERT_APPROVED',
          class: 'success'
        },
        {
          value: 'REVERT_REJECT',
          class: 'error'
        },
      ]
    }
  },
  {
    headerName: 'Nhà cung cấp',
    headerProperty: 'supplierName',
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
    headerName: 'Chi nhánh',
    headerProperty: 'brnCode',
    headerIndex: 7,
    className: 'w-150-px'
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'makerId',
    headerIndex: 8,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: 'createdDate',
    headerIndex: 9,
    className: 'w-200-px',
    type: 'datetime'
  },
  {
    headerName: 'Mô tả',
    headerProperty: 'tranDesc',
    headerIndex: 10,
    className: 'w-300-px',
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
    headerProperty: 'id',
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
    headerName: 'Kỳ HĐ',
    headerProperty: 'billId',
    headerIndex: 7,
    className: 'w-100-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'settledAmount',
    headerIndex: 8,
    className: 'w-200-px text-right'
  },
  {
    headerName: 'Tài khoản ghi nợ',
    headerProperty: 'acNumber',
    headerIndex: 9,
    className: 'w-200-px'
  },
  {
    headerName: 'Kênh TT',
    headerProperty: 'chanelName',
    headerIndex: 10,
    className: 'w-300-px'
  },
  {
    headerName: 'Value Date',
    headerProperty: 'valueDate',
    headerIndex: 11,
    className: 'w-300-px',
    type: 'datetime'
  },
  {
    headerName: 'Trans Date',
    headerProperty: 'tranDt',
    headerIndex: 12,
    className: 'w-300-px',
    type: 'datetime'
  },
]

export const PAYMENT_AUTO_KSV_COLUMNS = [
  {
    headerName: 'Số GD',
    headerProperty: 'id',
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
  for (let index = 0; index < 31; index++) {
    result.push({ label: `Ngày ${index + 1} hàng tháng`, value: index + 1 })
  }
  return result;
}

export const RECURRING_PAYMENT_DATES = calcRecurringPaymentDate()

export const BILLS_CREATE_COLUMNS = [
  { headerName: "Mã hóa đơn", headerProperty: "billCode", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Kỳ hóa đơn", headerProperty: "billDesc", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Loại hóa đơn", headerProperty: "billStatus", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Số tiền", headerProperty: "billAmount", headerIndex: 0, type: "currency", width: 100, className: "w-150-px" },
];

export const COLUMNS_BILLS = [
  { headerName: "Mã hóa đơn", headerProperty: "billId", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Kỳ hóa đơn", headerProperty: "billPeriod", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Loại hóa đơn", headerProperty: "billStatus", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Số tiền", headerProperty: "billAmount", headerIndex: 0, type: "currency", width: 100, className: "w-150-px" },
  { headerName: "Trạng thái gạch nợ", headerProperty: "changeDebtStatusName", headerIndex: 0, type: "", width: 100, className: "w-200-px" },
];

export const COLUMNS_BILLS2 = [
  { headerName: "Mã hóa đơn", headerProperty: "tranDetailId", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Kỳ hóa đơn", headerProperty: "billPeriod", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Loại hóa đơn", headerProperty: "billType", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Số tiền", headerProperty: "totalAmount", headerIndex: 0, type: "currency", width: 100, className: "w-150-px" },
];

export const COLUMNS_ACCOUNTING = [
  { headerName: "Số GD", headerProperty: "transNo", headerIndex: 0, type: "C", width: 100, className: "w-150-px" },
  { headerName: "Core Ref No", headerProperty: "coreRefNo", headerIndex: 0, type: "C", width: 100, className: "w-150-px" },
  { headerName: "Số tài khoản", headerProperty: "acNumber", headerIndex: 0, type: "C", width: 100, className: "w-120-px" },
  { headerName: "Tên tài khoản", headerProperty: "acName", headerIndex: 0, type: "C", width: 100, className: "w-300-px" },
  { headerName: "Nợ/Có", headerProperty: "drcrType", headerIndex: 0, type: "", width: 100, className: "w-50-px" },
  { headerName: "Số tiền", headerProperty: "lcyAmount", headerIndex: 0, type: "currency", width: 100, className: "w-150-px" },
  { headerName: "Trạng thái hạch toán", headerProperty: "accountingStatusName", headerIndex: 0, type: "", width: 100, className: "w-200-px" },
];

export const REVERT_ACCOUNTING_COLUMNS = [
  { headerName: "Số GD", headerProperty: "transNo", headerIndex: 0, type: "C", width: 100, className: "w-150-px" },
  { headerName: "Số tài khoản", headerProperty: "acNumber", headerIndex: 0, type: "C", width: 100, className: "w-120-px" },
  { headerName: "Tên tài khoản", headerProperty: "acName", headerIndex: 0, type: "C", width: 100, className: "w-300-px" },
  { headerName: "Nợ/Có", headerProperty: "drcrTypeRevert", headerIndex: 0, type: "", width: 100, className: "w-50-px" },
  { headerName: "Số tiền", headerProperty: "lcyAmount", headerIndex: 0, type: "currency", width: 100, className: "w-150-px" },
  { headerName: "Trạng thái hạch toán", headerProperty: "accountingRevertStatusName", headerIndex: 0, type: "", width: 100, className: "w-200-px" },
];

export const ACCOUNTING_COLUMNS = [
  { headerName: "Số GD", headerProperty: "transNo", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Core_Ref_No", headerProperty: "coreRefNo", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Số tài khoản", headerProperty: "acNumber", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Tên tài khoản", headerProperty: "acName", headerIndex: 0, type: "C", width: 100, className: "w-300-px" },
  { headerName: "Nợ/Có", headerProperty: "drcrType", headerIndex: 0, type: "", width: 100, className: "w-100-px" },
  { headerName: "Số tiền", headerProperty: "lcyAmount", headerIndex: 0, type: "currency", width: 100, className: "w-200-px" },
];

export const ACCOUNTING2_COLUMNS = [
  { headerName: "Số GD", headerProperty: "transNo", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Core_Ref_No", headerProperty: "coreRefNo", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Số tài khoản", headerProperty: "acNumber", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Tên tài khoản", headerProperty: "acName", headerIndex: 0, type: "C", width: 100, className: "w-300-px" },
  { headerName: "Nợ/Có", headerProperty: "drcrType", headerIndex: 0, type: "", width: 100, className: "w-100-px" },
  { headerName: "Số tiền", headerProperty: "lcyAmount", headerIndex: 0, type: "currency", width: 100, className: "w-200-px" },
  { headerName: "Nội dung", headerProperty: "lcyAmount", headerIndex: 0, type: "", width: 100, className: "w-200-px" },
];

export const CHANGE_DEBT_COLUMNS = [
  { headerName: "Số GD", headerProperty: "transNo", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Mã khách hàng", headerProperty: "transNo", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Tên khách hàng", headerProperty: "acNumber", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Mã ĐL", headerProperty: "acName", headerIndex: 0, type: "C", width: 100, className: "w-300-px" },
  { headerName: "Số hóa đơn", headerProperty: "drcrType", headerIndex: 0, type: "", width: 100, className: "w-100-px" },
  { headerName: "Số tiền", headerProperty: "lcyAmount", headerIndex: 0, type: "currency", width: 100, className: "w-200-px" },
  { headerName: "Số biên nhận", headerProperty: "drcrType", headerIndex: 0, type: "", width: 100, className: "w-100-px" },
  { headerName: "Trạng thái gạch nợ", headerProperty: "lcyAmount", headerIndex: 0, type: "", width: 100, className: "w-200-px" },
];

const CUSTOM_STYLE_TICK = {
  property: 'statusCode',
  valueProperty: TICK_STATUS
};

export const COLUMNS_TRANSACTIONS = [
  { headerName: "Số GD", headerProperty: "transNo", headerIndex: 0, type: "C", width: 100, className: "w-150-px" },
  { headerName: "Mã khách hàng", headerProperty: "custId", headerIndex: 0, type: "C", width: 100, className: "w-150-px" },
  { headerName: "Tên khách hàng", headerProperty: "custName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Số tiền", headerProperty: "totalAmount", headerIndex: 0, type: "currency", width: 100, className: "w-150-px" },
  { headerName: "Trạng thái", headerProperty: "status", headerIndex: 0, type: "C", width: 100, className: "w-200-px", customStyleTick: CUSTOM_STYLE_TICK },
  { headerName: "Nhà cung cấp", headerProperty: "supplierName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Hình thức thanh toán", headerProperty: "paymentTypeName", headerIndex: 0, type: "", width: 100, className: "w-150-px" },
  { headerName: "Chi nhánh", headerProperty: "brnName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Người tạo", headerProperty: "makerId", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Ngày tạo", headerProperty: "tranDate", headerIndex: 0, type: "datetime", width: 100, className: "w-150-px" },
  { headerName: "Mô tả", headerProperty: "tranDesc", headerIndex: 0, type: "", width: 100, className: "w-300-px" },
]

const CUSTOM_STYLE_TICK2 = {
  property: 'batchStatus',
  valueProperty: TICK_STATUS
};

export const FILE_COLUMNS = [
  { headerName: "Số batch", headerProperty: "batchNo", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Tên file", headerProperty: "fileName", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Ngày tạo", headerProperty: "createdDate", headerIndex: 0, type: "datetime", width: 100, className: "w-200-px" },
  { headerName: "Người tạo", headerProperty: "createdBy", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Người duyệt", headerProperty: "checkerId", headerIndex: 0, type: "", width: 100, className: "w-100-px" },
  { headerName: "Trạng thái batch", headerProperty: "batchStatusName", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
]

export const COLUMNS_CLEAR_DEBTS = [
  { headerName: "Mã CN", headerProperty: "tranBrn", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Tên CN", headerProperty: "tranName", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Mã KH", headerProperty: "customerId", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Ngày GD", headerProperty: "makerDt", headerIndex: 0, type: "date", width: 100, className: "w-200-px" },
  { headerName: "Tháng HĐ", headerProperty: "billId", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Năm HĐ", headerProperty: "billCode", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Số tiền", headerProperty: "settledAmount", headerIndex: 0, type: "currency", width: 100, className: "w-150-px" },
  { headerName: "TK ghi nợ", headerProperty: "acNumber", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Kênh TT", headerProperty: "chanelName", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Trạng thái gạch nợ", headerProperty: "changeDebtStatusName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Value Date", headerProperty: "valueDate", headerIndex: 0, type: "datetime", width: 100, className: "w-200-px" },
  { headerName: "Trans Date", headerProperty: "tranDt", headerIndex: 0, type: "datetime", width: 100, className: "w-200-px" },
]

export const COLUMNS_AUTO_PAY_SIGN_UP = [
  { headerName: "Số GD", headerProperty: "id", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
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
  { headerName: "Số tiền", headerProperty: "totalAmount", headerIndex: 0, type: "currency", width: 100, className: "w-150-px" },
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

export const REQUEST_TYPES_AUTO_PAYMENT_SEARCH = [
  { label: 'Đăng ký thanh toán tự động', value: 'APPROVE_REGISTER_AUTO_SETTLE' },
  { label: 'Chỉnh sửa đăng ký thanh toán tự động', value: 'APPROVE_MODIFY_AUTO_SETTLE' },
  { label: 'Hủy đăng ký thanh toán tự động', value: 'APPROVE_CANCEL_AUTO_SETTLE' }
];

export const STATUS_SETTLE_AUTO_PAYMENT_SEARCH = [
  { label: 'Chờ duyệt', value: 'IN_PROCESS' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Đã hủy', value: 'CANCELED' },
  { label: 'Từ chối duyệt', value: 'REJECT' }
];

export const STATUS_TRANSACTION_SEARCH = [
  { label: 'Tất cả', value: 'REPORT_ALL' },
  // { label: 'Đang chờ xử lý', value: 'IN_PROCESS' },
  // { label: 'Từ chối giao dịch', value: 'REJECT' },
  // { label: 'Hủy giao dịch', value: 'CANCEL' },
  // { label: 'Hạch toán thành công', value: 'HT_SUCCESS' },
  // { label: 'Hạch toán thất bại', value: 'HT_FAILED' },
  // { label: 'Hạch toán không xác định', value: 'HT_UNK' },
  { label: 'Hạch toán thành công - Gạch nợ thành công', value: 'GN_SUCCESS' },
  // { label: 'Hạch toán thành công - Gạch nợ thất bại', value: 'GN_FAILED' },
  { label: 'Hạch toán thành công - Gạch nợ không xác định', value: 'GN_UNK' },
  // { label: 'Chờ duyệt revert gạch nợ', value: 'REVERT_IN_PROCESS' },
  // { label: 'Từ chối Revert gạch nợ', value: 'REVERT_REJECT' },
  // { label: 'Revert gạch nợ giao dịch thành công', value: 'GN_REVERT_SUCCESS' },
  // { label: 'Revert gạch nợ giao dịch thất bại', value: 'GN_REVERT_FAILED' },
  // { label: 'Revert giao dịch gạch nợ không xác định', value: 'GN_REVERT_UNK' },
  { label: 'Revert gạch nợ giao dịch thành công - Revert hạch toán giao dịch thành công', value: 'HT_REVERT_SUCCESS' },
  // { label: 'Revert gạch nợ giao dịch thành công - Revert hạch toán giao dịch thất bại', value: 'HT_REVERT_FAILED' },
  // { label: 'Revert gạch nợ giao dịch thành công - Revert hạch toán giao dịch không xác định', value: 'HT_REVERT_UNK' },
  // { label: 'Gạch nợ thất bại - Revert hạch toán giao dịch thành công', value: 'GN_FAILED_HT_REVERT_SUCCESS' },
  // { label: 'Gạch nợ thất bại - Revert hạch toán giao dịch thất bại', value: 'GN_FAILED_HT_REVERT_FAILED' },
  // { label: 'Gạch nợ thất bại - Revert hạch toán giao dịch không xác định', value: 'GN_FAILED_HT_REVERT_UNK' },
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
  { headerName: "Mã KH (LPB)", headerProperty: "custIdLpb", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Mã KH (Đối tác)", headerProperty: "custIdSupplier", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Kỳ hóa đơn (LPB)", headerProperty: "billCycleLpb", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Kỳ hóa đơn (Đối tác)", headerProperty: "billCycleSupplier", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Số tiền (LPB)", headerProperty: "totalAmountLpb", headerIndex: 0, type: "currency", width: 100, className: "w-150-px" },
  { headerName: "Số tiền (Đối tác)", headerProperty: "totalAmountSupplier", headerIndex: 0, type: "currency", width: 100, className: "w-150-px" },
  { headerName: "Ngày GD (LPB)", headerProperty: "tranDateLpb", headerIndex: 0, type: "date", width: 100, className: "w-100-px" },
  { headerName: "Ngày GD (Đối tác)", headerProperty: "tranDateSupplier", headerIndex: 0, type: "date", width: 100, className: "w-100-px" },
  { headerName: "Trạng thái gạch nợ (LPB)", headerProperty: "statusLpbName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Trạng thái gạch nợ (Đối tác)", headerProperty: "statusSupplierName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Hình thức thanh toán", headerProperty: "paymentTypeName", headerIndex: 0, type: "", width: 100, className: "w-150-px" },
  { headerName: "Kênh thanh toán", headerProperty: "paymentChannelTypeName", headerIndex: 0, type: "C", width: 100, className: "w-100-px" },
  { headerName: "Kết quả đối soát", headerProperty: "forControlResultName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
]

export const INFO_INVOICE_QUERY = [
  { title: 'Số Batch', property: 'batchNo' },
  { title: 'Tên file', property: 'fileName' },
  { title: 'Trạng thái Batch', property: 'batchStatusName' },
  { title: 'Tài khoản chuyên thu', property: 'middleAcNumber' },
  { title: 'Account CCY', property: 'ccy' },
  { title: 'Chi nhánh', property: 'tranBrn' },
  { title: 'Người tạo', property: 'createdBy' },
];

export const INFO_PAYMENT_TO_INTERMEDIARY = [
  { title: 'Số giao dịch', property: 'transNo' },
  { title: 'Trạng thái', property: 'status' },
  { title: 'Số tài khoản ghi có', property: 'creditNumber' },
  { title: 'Tên tài khoản ghi có', property: 'creditName' },
  { title: 'Số tài khoản ghi nợ', property: 'debitNumber' },
  { title: 'Tên tài khoản ghi nợ', property: 'debitName' },
  { title: 'Số tiền', property: 'totalAmount', type: 'vnCurrency' },
];

export enum EStatusTransactionByFile {
  IN_PROCESS = 'IN_PROCESS',
  APPROVE_TRANSFER = 'APPROVE_TRANSFER',
  APPROVE_CHANGE_DEBT = 'APPROVE_CHANGE_DEBT',
  APPROVE_ACCOUNTING = 'APPROVE_ACCOUNTING',
  REJECT_APPROVE_TRANSFER = 'REJECT_APPROVE_TRANSFER',
  REJECT_APPROVE_CHANGE_DEBT = 'REJECT_APPROVE_CHANGE_DEBT',
  DELETED = 'DELETED'
}

export enum EStatusSuccess {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  REVERT_IN_PROCESS = 'REVERT_IN_PROCESS',
  REVERT_SUCCESS = 'REVERT_SUCCESS',
  HT_REVERT_SUCCESS = 'HT_REVERT_SUCCESS'
}

export const TRANSACTION_TYPES_AUTO_PAYMENT = [
  { label: 'Đăng ký thanh toán tự động', value: 'APPROVE_REGISTER_AUTO_SETTLE' },
  { label: 'Hủy đăng ký thanh toán tự động', value: 'APPROVE_CANCEL_AUTO_SETTLE' },
  { label: 'Chỉnh sửa đăng ký thanh toán tự động', value: 'APPROVE_MODIFY_AUTO_SETTLE' },
];

export const STATUS_ACTIVE = [
  { label: 'Hoạt động', value: 'ACTIVE' },
  { label: 'Không hoạt động', value: 'INACTIVE' },
];
// Báo cáo đối soát
export const CROSS_CHECKING_REPORT_TYPES = [
  { label: "Hóa đơn thanh toán tại LPB", value: "1", api: "/electric-service/report/transaction", columns: COLUMNS_REPORT1, apiReport: "water-service/report/transaction/export" },
  { label: "Hóa đơn đã gạch nợ tại EVN", value: "2", api: "/electric-service/settle", columns: COLUMNS_REPORT2, apiReport: "water-service/report/settle/export" },
  { label: "Hóa đơn lệch", value: "3", api: "/electric-service/settle", columns: COLUMNS_REPORT2, apiReport: "water-service/report/settle/export" },
];

export const CROSS_CHECKING_PAYMENT_CHANNELS = [
  { label: 'Tại quầy', value: 'TELLER' },
  { label: 'Tự động', value: 'AUTOMATION' },
];

export const CROSS_CHECKING_CHANGE_DEBT_STATUS = [
  { label: "Đang xử lý", value: "IN_PROCESS" },
  { label: "Đã xử lý", value: "SUCCESS" },
  { label: "Thất bại", value: "FALSE" },
  { label: "Lỗi", value: "ERROR" },
]

export const REPORT_TYPES = [
  {
    label: 'Báo cáo đăng ký TT tự động',
    columns: REPORT_REGISTER_AUTO_COLUMNS,
    value: '0',
    apiPath: '/electric-service/report/settle',
    apiExport: 'electric-service/report/settle/export'
  },
  {
    label: 'Báo cáo giao dịch',
    columns: REPORT_TRANSACTION_COLUMNS,
    value: '1',
    apiPath: '/electric-service/report/transaction',
    apiExport: 'electric-service/report/transaction/export'
  },
  {
    label: 'Báo cáo chi tiết TT tự động',
    columns: REPORT_DETAIL_AUTO_PAYMENT_COLUMNS,
    value: '2',
    apiPath: '/electric-service/report/settle-detail',
    apiExport: 'electric-service/report/settle-detail/export'
  },
  {
    label: 'Báo cáo thu hộ Mobifone',
    columns: REPORT_MOBIFONE_COLUMNS,
    value: '3',
    apiPath: '/electric-service/transaction/collection-mobifone',
    apiExport: 'electric-service/report/collection-mobifone/export'
  },
  {
    label: 'Báo cáo giao dịch LV24',
    columns: REPORT_TRANSACTION_LV24_COLUMNS,
    value: '4',
    apiPath: '/electric-service/report/transaction/evn',
    apiExport: 'electric-service/report/transaction/evn/export'
  },
];

export const CONTENT_TYPES = [
  { label: 'Đăng ký mới', value: 'APPROVE_REGISTER_AUTO_SETTLE' },
  { label: 'Hủy TT tự động', value: 'APPROVE_CANCEL_AUTO_SETTLE' },
];

export const PAYMENT_CHANNEL_TYPES = [
  { label: 'Tất cả', value: '' },
  { label: 'Tại quầy', value: 'TELLER' },
  { label: 'File Upload', value: 'FILE' },
  { label: 'Tự động', value: 'AUTOMATION' },
];

export const PAYMENT_CHANNEL_TYPES_LV24 = [
  { label: 'Qua app', value: 'E_MOBILE' },
  { label: 'Qua Web', value: 'WEBVIVIET' },
  { label: 'Giao dịch tự động trên hệ thống', value: 'SYSTEM' },
];

export const STATUS_TRANSACTION_SEARCH_LV24 = [
  { label: 'Đang xử lý', value: 'P' },
  { label: 'Thành công', value: 'S' },
  { label: 'Thất bại', value: 'F' },
  { label: 'Thực hiện xong Exception', value: 'E' },
  { label: 'Timeout', value: 'U' },
]

export const SUPPLIER_LV24 = [
  { label: 'Thanh toán điện lực TP.HCM', value: 'EVN_B_HCM' },
  { label: 'Thanh toán điện lực Hà Nội', value: 'EVN_B_HN' },
  { label: 'Thanh toán điện lực Miền Bắc', value: 'EVN_B_MB' },
  { label: 'Thanh toán điện lực Miền Nam', value: 'EVN_B_MN' },
  { label: 'Thanh toán điện lực Miền Trung', value: 'EVN_B_MT' },
  { label: 'Thanh toán điện lực Tỉnh/Tp khác', value: 'EVN_B_OTHER' },      
]

export const STATUS_DEBTS = [
  { label: 'Hạch toán thành công - Gạch nợ thành công', value: '0' },
  { label: 'Hạch toán thành công - Gạch nợ không xác định', value: '1' },
  { label: 'Hạch toán thất bại', value: '2' },
  { label: 'Hạch toán không xác định', value: '3' },
  { label: 'Revert hạch toán thành công - Gạch nợ thất bại', value: '4' },
  { label: 'Revert hạch toán thất bại - Gạch nợ thất bại', value: '5' },
  { label: 'Revert hạch toán không xác định - Gạch nợ thất bại', value: '6' },
];


export const STATUS_SETTLE_ELECTRIC = [
  { label: 'Chờ duyệt', value: 'IN_PROCESS' },
  { label: 'Đã duyệt', value: 'APPROVE' },
  { label: 'Từ chối duyệt', value: 'REJECT' },
  { label: 'Chờ duyệt Revert', value: 'REVERT_IN_PROCESS' },
  { label: 'Đã duyệt Revert', value: 'REVERT_APPROVED' },
  { label: 'Từ chối duyệt Revert', value: 'REVERT_REJECT' },
];

export const CHANGE_DEBT_STATUS = [
  { label: 'Tất cả', value: '' },
  { label: 'Chờ gạch nợ', value: 'IN_PROCESS' },
  { label: 'Gạch nợ thành công', value: 'SUCCESS' },
  { label: 'Gạch nợ thất bại', value: 'FAIL' },
  { label: 'Chờ duyệt revert gạch nợ', value: 'REVERT_IN_PROCESS' },
  { label: 'Revert gạch nợ thành công', value: 'REVERT_SUCCESS' },
  { label: 'Từ chối Revert gạch nợ', value: 'REVERT_REJECT' },
  { label: 'Revert gạch nợ thất bại', value: 'REVERT_FAILED' },
  { label: 'Revert gạch nợ không xác định', value: 'REVERT_UNK' },
  { label: 'Lỗi khi gạch nợ', value: 'ERROR' },
  { label: 'Từ chối', value: 'REJECT' },
  { label: 'Hủy gạch nợ', value: 'CANCEL' },
];
