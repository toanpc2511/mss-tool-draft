export const CROSS_CHECKING_WATER_COLUMN = [
  {
    headerName: 'Số GD',
    headerProperty: 'tranNo',
    headerIndex: 0,
    className: 'w-80-px'
  },
  {
    headerName: 'Ngày giao dịch',
    headerProperty: 'tranDate',
    headerIndex: 1,
    // type: 'datetime',
    className: 'w-200-px'
  },
  {
    headerName: 'Mã khách hàng',
    headerProperty: 'custId',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên khách hàng',
    headerProperty: 'custName',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Kỳ hóa đơn',
    headerProperty: 'billCycle',
    headerIndex: 4,
    className: 'w-150-px'
  },
  {
    headerName: 'Số tiền',
    headerProperty: 'totalAmount',
    headerIndex: 5,
    className: 'w-150-px'
  },
  {
    headerName: 'Hình thức thanh toán',
    headerProperty: 'paymentChannelTypeName',
    headerIndex: 6,
    className: 'w-150-px'
  },
  {
    headerName: 'Kênh thanh toán',
    headerProperty: 'paymentTypeName',
    headerIndex: 7,
    className: 'w-150-px'
  },
  {
    headerName: 'Trạng thái gạch nợ',
    headerProperty: 'status',
    headerIndex: 8,
    className: 'w-150-px'
  },
  {
    headerName: 'Kiểm tra lỗi',
    headerProperty: 'noteName',
    headerIndex: 9,
    className: 'w-150-px',
    customStyleTick: {
      property: 'note',
      valueProperty: [
        {
          value: 'ERROR',
          class: 'error'
        },
        {
          value: 'OK',
          class: 'success'
        }
      ]
    },
    tooltipProperty: 'noteDetail'
  }
];
