export const ACCOUNTING_COLUMNS = [
  { headerName: "Số GD", headerProperty: "transNo", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Core_Ref_No", headerProperty: "coreRefNo", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Số tài khoản", headerProperty: "acNumber", headerIndex: 0, type: "C", width: 100, className: "w-150-px" },
  { headerName: "Tên tài khoản", headerProperty: "acName", headerIndex: 0, type: "C", width: 100, className: "w-300-px" },
  { headerName: "Nợ/Có", headerProperty: "drcrType", headerIndex: 0, type: "", width: 100, className: "w-60-px" },
  { headerName: "Số tiền", headerProperty: "totalAmount", headerIndex: 0, type: "currency", width: 100, className: "w-100-px" },
];

export const CHANGE_DEBT_COLUMNS = [
  { headerName: "Số GD", headerProperty: "transNo", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Mã khách hàng", headerProperty: "custId", headerIndex: 0, type: "C", width: 100, className: "w-150-px" },
  { headerName: "Tên khách hàng", headerProperty: "custName", headerIndex: 0, type: "C", width: 100, className: "w-200-px" },
  { headerName: "Mã ĐL", headerProperty: "electricCode", headerIndex: 0, type: "C", width: 100, className: "w-60-px" },
  { headerName: "Số hóa đơn", headerProperty: "billCode", headerIndex: 0, type: "", width: 100, className: "w-100-px" },
  { headerName: "Loại hóa đơn", headerProperty: "billStatus", headerIndex: 0, type: "", width: 100, className: "w-150-px" },
  { headerName: "Số tiền", headerProperty: "billAmount", headerIndex: 0, type: "currency", width: 100, className: "w-100-px" },
  { headerName: "Số biên nhận", headerProperty: "receiptNumber", headerIndex: 0, type: "", width: 100, className: "w-100-px" },
  { headerName: "Trạng thái gạch nợ", headerProperty: "changeDebtStatusName", headerIndex: 0, type: "", width: 100, className: "w-200-px" },
];