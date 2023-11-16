export const TRANSACTION_PAYMENT_FILE_COLUMN = [
  {
    headerName: 'Số Batch',
    headerProperty: 'batchNo',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên file',
    headerProperty: 'fileName',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: 'createdDate',
    headerIndex: 2,
    className: 'w-200-px',
    type: 'datetime'
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'createdBy',
    headerIndex: 3,
    className: 'w-100-px'
  },
  {
    headerName: 'Người duyệt',
    headerProperty: 'checkerId',
    headerIndex: 4,
    className: 'w-100-px'
  },
  {
    headerName: 'Trạng thái giao dịch',
    headerProperty: 'batchStatusName',
    headerIndex: 5,
    className: 'w-200-px',
  }
];

export const ACCOUNTING_INFO_TAB_ONE_COLUMNS = [
  {
    headerName: 'Số GD',
    headerProperty: 'transNo',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Core_Ref_No',
    headerProperty: 'coreRefNo',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tài khoản',
    headerProperty: 'acNumber',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên tài khoản',
    headerProperty: 'acName',
    headerIndex: 3,
    className: 'w-300-px'
  },
  {
    headerName: 'Nợ có',
    headerProperty: 'drcrType',
    headerIndex: 4,
    className: 'w-100-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'totalAmount',
    headerIndex: 5,
    className: 'w-200-px',
    type: 'currency'
  },
];

export const ACCOUNTING_INFO_TAB_TWO_COLUMNS = [
  ...ACCOUNTING_INFO_TAB_ONE_COLUMNS,
  {
    headerName: 'Trạng thái hạch toán',
    headerProperty: 'statusName',
    headerIndex: 6,
    className: 'w-200-px',
    customStyleTick: {
      property: 'status',
      valueProperty: [
        {
          value: 'SUCCESS',
          class: 'success'
        },
        {
          value: 'FAIL',
          class: 'error'
        }
      ]
    }
  },
  {
    headerName: 'Nội dung',
    headerProperty: 'desc',
    headerIndex: 7,
    className: 'w-300-px'
  },
];

export const INFO_ORDER_TAB_TWO_COLUMNS = [
  {
    headerName: 'Mã khách hàng',
    headerProperty: 'custId',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên khách hàng',
    headerProperty: 'custName',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã DL',
    headerProperty: 'electricCode',
    headerIndex: 2,
    className: 'w-150-px'
  },
  {
    headerName: 'Số hóa đơn',
    headerProperty: 'billId',
    headerIndex: 3,
    className: 'w-150-px'
  },
  {
    headerName: 'Kỳ hóa đơn',
    headerProperty: 'billDesc',
    headerIndex: 4,
    className: 'w-100-px'
  },
  {
    headerName: 'Loại hóa đơn',
    headerProperty: 'billStatus',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'totalAmount',
    type: 'currency',
    headerIndex: 6,
    className: 'w-150-px'
  },
  {
    headerName: 'Số biên nhận',
    headerProperty: 'receiptNumber',
    headerIndex: 7,
    className: 'w-150-px'
  },
  {
    headerName: 'Trạng thái gạch nợ',
    headerProperty: 'changeDebtStatusName',
    headerIndex: 8,
    className: 'w-200-px',
    customStyleTick: {
      property: 'changeDebtStatus',
      valueProperty: [
        {
          value: 'SUCCESS',
          class: 'success'
        },
        {
          value: 'IN_PROCESS',
          class: 'warning'
        },
        {
          value: 'REJECT' || 'ERROR',
          class: 'error'
        }
      ]
    }
  },
];

export const COLUMNS_FILE_IMPORT = [
  {
    headerName: 'Mã khách hàng',
    headerProperty: 'custId',
    headerIndex: 0,
    className: 'w-100-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'totalAmount',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'Số biên nhận (Mã GD)',
    headerProperty: 'receiptNumber',
    headerIndex: 2,
    className: 'w-100-px'
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'noteName',
    headerIndex: 3,
    className: 'w-100-px',
    customStyleTick: {
      property: 'noteCode',
      valueProperty: [
        {
          value: 'OK',
          class: 'success'
        },
        {
          value: 'ERROR',
          class: 'error'
        }
      ]
    }
  },
  {
    headerName: 'Mô tả',
    headerProperty: 'description',
    headerIndex: 4,
    className: 'w-100-px'
  },
];

export const INFO_ORDER_IN_PAY_BY_FILE_COLUMNS = [
  {
    headerName: 'Mã khách hàng',
    headerProperty: 'custId',
    headerIndex: 0,
    className: 'w-100-px'
  },
  {
    headerName: 'Tên khách hàng',
    headerProperty: 'custName',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã DL',
    headerProperty: 'electricCode',
    headerIndex: 2,
    className: 'w-100-px'
  },
  {
    headerName: 'Số hóa đơn',
    headerProperty: 'billCode',
    headerIndex: 3,
    className: 'w-100-px'
  },
  {
    headerName: 'Kỳ hóa đơn',
    headerProperty: 'billDesc',
    headerIndex: 4,
    className: 'w-100-px'
  },
  {
    headerName: 'Loại hóa đơn',
    headerProperty: 'billStatus',
    headerIndex: 5,
    className: 'w-100-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'totalAmount',
    headerIndex: 6,
    type: 'currency',
    className: 'w-100-px'
  },
  {
    headerName: 'Kết quả',
    headerProperty: 'result',
    headerIndex: 7,
    className: 'w-200-px'
  },
];

export const TRANSACTION_AUTO_PAYMENT_COLUMNS = [
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
    headerName: 'Tên khách hàng',
    headerProperty: 'custName',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'createdBy',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: 'createdDate',
    headerIndex: 4,
    type: 'date',
    className: 'w-200-px'
  },
  {
    headerName: 'Loại giao dịch',
    headerProperty: 'transactionTypeName',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái giao dịch',
    headerProperty: 'auditStatusName',
    headerIndex: 6,
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái hoạt động',
    headerProperty: 'statusName',
    headerIndex: 7,
    className: 'w-200-px'
  }
];

export const CUSTOMER_REGISTER_COLUMNS = [
  {
    headerName: 'Mã KH',
    headerProperty: 'custId',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã CIF',
    headerProperty: 'cif',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tài khoản',
    headerProperty: 'acNumber',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày TT định kỳ',
    headerProperty: 'settleDate',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Số điện thoại',
    headerProperty: 'custMobile',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Email',
    headerProperty: 'email',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'CN đăng ký',
    headerProperty: 'brnName',
    headerIndex: 6,
    className: 'w-200-px'
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'createdBy',
    headerIndex: 7,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: 'createdDate',
    type: 'datetime',
    headerIndex: 8,
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái hoạt động',
    headerProperty: 'statusName',
    headerIndex: 9,
    className: 'w-200-px',
    customStyleTick: {
      property: 'status',
      valueProperty: [
        {
          value: 'ACTIVE',
          class: 'success'
        },
        {
          value: 'INACTIVE',
          class: 'error'
        }
      ]
    }
  },
  {
    headerName: 'Nhà CC',
    headerProperty: 'supplierName',
    headerIndex: 10,
    className: 'w-200-px'
  },
];

export const TRANSACTION_DOUBTS_COLUMNS = [
  {
    headerName: 'Số GD',
    headerProperty: 'transNo',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã khách hàng',
    headerProperty: 'custId',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên khách hàng',
    headerProperty: 'custName',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'totalAmount',
    headerIndex: 3,
    type: 'currency',
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái hạch toán',
    headerProperty: 'accountingStatus',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Nhà cung cấp',
    headerProperty: 'supplierName',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Hình thức thanh toán',
    headerProperty: 'paymentTypeName',
    headerIndex: 6,
    className: 'w-200-px'
  },
  {
    headerName: 'Chi nhánh',
    headerProperty: 'brnName',
    headerIndex: 7,
    className: 'w-200-px'
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'makerId',
    headerIndex: 8,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: '',
    headerIndex: 9,
    className: 'w-200-px'
  },
  {
    headerName: 'Mô tả',
    headerProperty: 'tranDesc',
    headerIndex: 10,
    className: 'w-400-px'
  },
];
export const CHANGE_DEBT_COLUMNS = [
  {
    headerName: 'Số GD',
    headerProperty: 'transNo',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã khách hàng',
    headerProperty: 'custId',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên khách hàng',
    headerProperty: 'custName',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'totalAmount',
    headerIndex: 3,
    type: 'currency',
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái gạch nợ',
    headerProperty: 'changeDebtStatus',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Nhà cung cấp',
    headerProperty: 'supplierName',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Hình thức thanh toán',
    headerProperty: 'paymentTypeName',
    headerIndex: 6,
    className: 'w-200-px'
  },
  {
    headerName: 'Chi nhánh',
    headerProperty: 'brnName',
    headerIndex: 7,
    className: 'w-200-px'
  },
  {
    headerName: 'Người tạo',
    headerProperty: 'makerId',
    headerIndex: 8,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày tạo',
    headerProperty: '',
    headerIndex: 9,
    className: 'w-200-px'
  },
  {
    headerName: 'Mô tả',
    headerProperty: 'tranDesc',
    headerIndex: 10,
    className: 'w-400-px'
  },
];

export const REPORT_TRANSACTION_COLUMNS = [
  {
    headerName: 'Mã GD',
    headerProperty: 'transNo',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã KH',
    headerProperty: 'customerId',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên khách hàng',
    headerProperty: 'customerName',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Địa chỉ',
    headerProperty: 'customerAddress',
    headerIndex: 3,
    className: 'w-300-px'
  },
  {
    headerName: 'Mã hóa đơn',
    headerProperty: 'billId',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'totalAmount',
    type: 'currency',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Core_ref_no',
    headerProperty: 'coreRefNo',
    headerIndex: 6,
    className: 'w-200-px'
  },
  {
    headerName: 'Chi nhánh GD',
    headerProperty: 'tranName',
    headerIndex: 7,
    className: 'w-200-px'
  },
  {
    headerName: 'Kênh thanh toán',
    headerProperty: 'paymentChannelTypeName',
    headerIndex: 8,
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'summaryTranStatusName',
    headerIndex: 9,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày giao dịch',
    headerProperty: 'transDate',
    headerIndex: 10,
    className: 'w-200-px',
    type: 'datetime'
  },
];

export const REPORT_TRANSACTION_LV24_COLUMNS = [
  {
    headerName: 'Mã GD',
    headerProperty: 'transId',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã KH',
    headerProperty: 'custNo',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên khách hàng',
    headerProperty: 'customerName',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã hóa đơn',
    headerProperty: 'inputValue',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'amountTransfer',
    type: 'currency',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Core_ref_no',
    headerProperty: 'coreRefNo',
    headerIndex: 6,
    className: 'w-200-px'
  },
  {
    headerName: 'Chi nhánh GD',
    headerProperty: 'branchCode',
    headerIndex: 7,
    className: 'w-200-px'
  },
  {
    headerName: 'Kênh thanh toán',
    headerProperty: 'channelName',
    headerIndex: 8,
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'transStatus',
    headerIndex: 9,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày giao dịch',
    headerProperty: 'transTime',
    headerIndex: 10,
    className: 'w-200-px',
    type: ''
  },
];

export const REPORT_DETAIL_AUTO_PAYMENT_COLUMNS = [
  {
    headerName: 'Mã chi nhánh',
    headerProperty: 'tranBrn',
    headerIndex: 0,
    className: 'w-100-px'
  },
  {
    headerName: 'Tên chi nhánh',
    headerProperty: 'tranName',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã khách hàng',
    headerProperty: 'customerId',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên khách hàng',
    headerProperty: 'customerName',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'TK thanh toán',
    headerProperty: 'accNumber',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên TK',
    headerProperty: 'accName',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày ĐK thanh toán',
    headerProperty: 'settleDt',
    headerIndex: 6,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày thanh toán',
    headerProperty: 'transDt',
    headerIndex: 7,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'totalAmount',
    type: 'currency',
    headerIndex: 8,
    className: 'w-200-px'
  },
  {
    headerName: 'Core Ref No',
    headerProperty: 'coreRefNo',
    headerIndex: 9,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã hoá đơn',
    headerProperty: 'billId',
    headerIndex: 10,
    className: 'w-200-px'
  },
  {
    headerName: 'Billcode',
    headerProperty: 'billCode',
    headerIndex: 11,
    className: 'w-200-px'
  },
  {
    headerName: 'Nhà cung cấp',
    headerProperty: 'supplierName',
    headerIndex: 12,
    className: 'w-200-px'
  },
  {
    headerName: 'Kết quả hạch toán',
    headerProperty: 'accountingStatusName',
    headerIndex: 13,
    className: 'w-200-px'
  },
  {
    headerName: 'Kết quả gạch nợ',
    headerProperty: 'changeDebtStatusName',
    headerIndex: 14,
    className: 'w-200-px'
  },
  {
    headerName: 'Kết quả revert',
    headerProperty: '',
    headerIndex: 15,
    className: 'w-200-px'
  },
];

export const REPORT_MOBIFONE_COLUMNS = [
  {
    headerName: 'Mã trạm',
    headerProperty: 'custId',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Địa chỉ trạm',
    headerProperty: 'custAddress',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Điện tiêu thụ',
    headerProperty: 'DNTT',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày bắt đầu',
    headerProperty: 'TuNgay',
    type: 'date',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày kết thúc',
    headerProperty: 'DenNgay',
    type: 'date',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Số CT',
    headerProperty: 'SoCongTo',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Số HD',
    headerProperty: 'HoaDonID',
    headerIndex: 7,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày phát hành',
    headerProperty: 'NgayPH',
    type: 'date',
    headerIndex: 8,
    className: 'w-200-px'
  },
  {
    headerName: 'Tiền điện',
    headerProperty: 'TienDien',
    type:  'currency',
    headerIndex: 9,
    className: 'w-200-px'
  },
  {
    headerName: 'Thuế suất (%)',
    headerProperty: 'ThueSuat',
    type:  'currency',
    headerIndex: 10,
    className: 'w-200-px'
  },
  {
    headerName: 'Tiền thuế',
    headerProperty: 'TienThue',
    type:  'currency',
    headerIndex: 11,
    className: 'w-200-px'
  },
  {
    headerName: 'Thành tiền',
    headerProperty: 'SoTien',
    type:  'currency',
    headerIndex: 12,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên đơn vị (khách hàng)',
    headerProperty: 'custName',
    headerIndex: 13,
    className: 'w-200-px'
  }
];

export const REPORT_REGISTER_AUTO_COLUMNS = [
  {
    headerName: 'Tên CN',
    headerProperty: 'brnName',
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
    headerName: 'Tên khách hàng',
    headerProperty: 'custName',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tài khoản',
    headerProperty: 'acNumber',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày TT định kỳ',
    headerProperty: 'settleDate',
    headerIndex: 4,
    className: 'w-150-px'
  },
  {
    headerName: 'Ngày hiệu lực',
    headerProperty: 'lastModifiedDate',
    type: 'date',
    headerIndex: 5,
    className: 'w-200-px'
  },
  {
    headerName: 'Nội dung',
    headerProperty: 'desc',
    headerIndex: 7,
    className: 'w-200-px'
  },
  {
    headerName: 'Nhà cung cấp',
    headerProperty: 'supplierName',
    headerIndex: 8,
    className: 'w-200-px'
  }
];
