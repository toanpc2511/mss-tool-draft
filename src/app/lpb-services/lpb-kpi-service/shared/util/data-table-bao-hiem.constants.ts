export const DATA_TABLE_BAO_HIEM_PHI = [
  {
    headerName: 'ĐVKD/PGĐ',
    headerProperty: 'branchCode',
    headerIndex: 0,
    className: 'w-80-px'
  },
  {
    headerName: 'Mã CBNV',
    headerProperty: 'employeeID',
    headerIndex: 1,
    // type: 'datetime',
    className: 'w-200-px'
  },
  {
    headerName: 'Hợp đồng bảo hiểm',
    headerProperty: 'contractNo',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Sản phẩm',
    headerProperty: 'product',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'ADLS/Không ADLS',
    headerProperty: 'adls',
    headerIndex: 4,
    className: 'w-150-px'
  },
  {
    headerName: 'TSĐB/KTTN',
    headerProperty: 'tsbdKttn',
    headerIndex: 5,
    className: 'w-150-px'
  },
  {
    headerName: 'H0 giới thiệu',
    headerProperty: 'hogt',
    headerIndex: 6,
    className: 'w-150-px'
  },
  {
    headerName: 'Phí bảo hiểm trước thuế',
    headerProperty: 'fee',
    headerIndex: 7,
    className: 'w-150-px'
  }
];

export const TYPE_LKK2 = [
  {key: 'BC02A', name: 'BC02A.BC LKD PHI NHÂN THỌ'},
  {key: 'BC02B', name: 'BC02B.BC ĐVKD THỰC CHI'},
  {key: 'BC02C', name: 'BC02C.BC CHI TIẾT LƯƠNG HỘI SỞ'},
  {key: 'BC02D', name: 'BC02D.BC LƯƠNG HỘI SỞ'}
];

export const TYPE_STATUS = [
  {key: '1', name: 'Đã Duyệt'},
  {key: '0', name: 'Chưa Duyệt'}
];

export const TYPE_DATA = [
  {key: 'HO', name: 'HO Phân Bổ'},
  {key: 'DVKD', name: 'Đơn Vị Kinh Doanh Phân Bổ'}
];

export const TYPEBC_CLHTATM = [
  {key: 'BC01A', name: 'BC01A_TDHT ATM'}
];
export const TYPE_LKK2_ADD = Object.keys(TYPE_LKK2).map((e) => {
  return { key: e, name: TYPE_LKK2[e] };
});

export const TYPE_STATUS_ADD = Object.keys(TYPE_STATUS).map((e) => {
  return { key: e, name: TYPE_STATUS[e] };
});


export const TYPEBC_MBNTKHCN = [
  {key: 'BC03A', name: 'BC03A_BÁO CÁO ĐỐI SOÁT LKD MBNT PHÂN KHÚC KHCN CHI TIẾT'},
  {key: 'BC03B', name: 'BC03B_BÁO CÁO CHI LKD MUA BÁN NGOẠI TỆ KHCN'},
  {key: 'BC03C', name: 'BC03C_BÁO CÁO THỰC CHI LKD MBNT_KHCN'},
  {key: 'BC03D', name: 'BC03D_BÁO CÁO CÁC ĐVKD CHƯA PHÂN BỔ LKD'}
];

export const TYPE_MBNT_DN = [
  {key: 'BC04A', name: 'BC04A.BÁO CÁO ĐỐI SOÁT LKD MBNT PHÂN KHÚC KHDN CHI TIẾT'},
  {key: 'BC04B', name: 'BC04B.BÁO CÁO CHI LKD MUA BÁN NGOẠI TỆ KHDN'},
  {key: 'BC04C', name: 'BC04C.BÁO CÁO THỰC CHI LKD MUA BÁN NGOẠI TỆ KHDN'}
];

export const TYPEBC_HDNGANHAN = [
  {key: 'BC02A', name: 'BC02A_BÁO CÁO CHI LƯƠNG KHUYẾN KHÍCH HUY ĐỘNG VỐN'},
  {key: 'BC02B', name: 'BC02B_BÁO CÁO ĐỐI SOÁT CÁC TÀI KHOẢN TÍNH LKK HUY ĐỘNG'}
];
