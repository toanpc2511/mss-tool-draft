export const DATA_TABLE_MBNT_KHCN = [
  {
    headerName: 'Ngày giao dịch',
    headerProperty: 'transDate',
    headerIndex: 0,
    className: 'w-100-px'
  },
  {
    headerName: 'Số hiệu giao dịch',
    headerProperty: 'transCode',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'Mã ĐVKD',
    headerProperty: 'branchCode',
    headerIndex: 2,
    className: 'w-100-px'
  },
  {
    headerName: 'Giá trị (nguyên tệ)',
    headerProperty: 'giaTriNguyenTe',
    type: 'currency',
    headerIndex: 3,
    className: 'w-100-px'
  },
  {
      headerName: 'Loại tiền',
      headerProperty: 'currencyType',
      headerIndex: 4,
      className: 'w-100-px'
    },
  {
    headerName: 'Chiều ĐVKD M/B với KH',
    headerProperty: 'chieuDvkdKH',
    headerIndex: 5,
    className: 'w-100-px'
  },
  {
    headerName: 'Tỷ giá CHI NHANH - HO',
    headerProperty: 'tyGiaCnHo',
    type: 'currency',
    headerIndex: 6,
    className: 'w-100-px'
  },
  {
    headerName: 'Tỷ giá CHI NHANH - KH',
    headerProperty: 'tyGiaCnKh',
    type: 'currency',
    headerIndex: 7,
    className: 'w-100-px'
  },
  {
    headerName: 'Biên lợi nhuận',
    headerProperty: 'bienLoiNhuan',
    headerIndex: 8,
    className: 'w-100-px'
  },
  {
    headerName: 'Lợi nhuận KDNT',
    headerProperty: 'loiNhuanKDNT',
    type: 'currency',
    headerIndex: 9,
    className: 'w-100-px'
  },
  {
    headerName: 'CIF CTV',
    headerProperty: 'cif_CTV',
    headerIndex: 10,
    className: 'w-100-px'
  },
  {
    headerName: 'Tỷ lệ chi HHMG',
    headerProperty: 'tyLeChiHHMG',
    type: 'currency',
    headerIndex: 11,
    className: 'w-100-px'
  },
  {
    headerName: 'Số tiền chi HHMG',
    headerProperty: 'soTienChiHHMG',
    type: 'currency',
    headerIndex: 12,
    className: 'w-100-px'
  },
  {
    headerName: 'Lợi nhuận sau HHMG',
    headerProperty: 'loiNhuanSauHHMG',
    type: 'currency',
    headerIndex: 13,
    className: 'w-100-px'
  },
  {
    headerName: 'Mã Cán bộ bán hàng trực tiếp',
    headerProperty: 'maNV',
    headerIndex: 14,
    className: 'w-100-px'
  }
];
export const MBNT_KHCN_COLUMN_ER =
  {
    headerName: 'Trạng thái dữ liệu',
    headerProperty: 'error',
    headerIndex: 15,
    className: 'w-100-px'
  };
export const DATA_TABLE_MBNT_KHCN_PHANBO = [

  {
    headerName: 'Mã ĐVKD',
    headerProperty: 'branch_CODE',
    headerIndex: 0,
    className: 'w-100-px'
  },
  {
    headerName: 'Mã CBNV phân bổ',
    headerProperty: 'employee_ID',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'LKD chi CBBH trực tiếp (8%)',
    headerProperty: 'chi_CBBH',
    type: 'currency',
    headerIndex: 2,
    className: 'w-100-px'
  },
  {
    headerName: 'LKD chi cho ĐVKD (3%)',
    headerProperty: 'chi_DVKD',
    type: 'currency',
    headerIndex: 3,
    className: 'w-100-px'
  }
];
export const MBNT_KHCN_PB_COLUMN_ER =
  {
    headerName: 'Trạng thái dữ liệu',
    headerProperty: 'error',
    headerIndex: 4,
    className: 'w-100-px'
  };
