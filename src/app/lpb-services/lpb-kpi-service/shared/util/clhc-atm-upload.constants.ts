import {TYPE_LKK2, TYPE_MBNT_DN, TYPEBC_CLHTATM, TYPEBC_MBNTKHCN} from "./data-table-bao-hiem.constants";

export const INFO_UPLOAD_TABLE_COLUMN = [
  {
    headerName: 'Mã đơn vị',
    headerProperty: 'branchCode',
    headerIndex: 0,
    className: 'w-100-px'
  },
  {
    headerName: 'Mã nhân viên',
    headerProperty: 'employeeID',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
      headerName: 'Tên nhân viên',
      headerProperty: 'fullname',
      headerIndex: 2,
      className: 'w-100-px'
    },
  {
    headerName: 'Số lượng khách hàng chuyển đổi hưởng cơ chế 100k lần 1',
    headerProperty: 'slEnjobNo1',
    headerIndex: 3,
    className: 'w-100-px'
  },
  {
    headerName: 'Số lượng khách hàng chuyển đổi hưởng cơ chế 100k lần 2',
    headerProperty: 'slEnjobNo2',
    headerIndex: 4,
    className: 'w-100-px'
  },
  {
    headerName: 'Tổng LKK',
    headerProperty: 'totalLKK',
    type: 'currency',
    headerIndex: 5,
    className: 'w-100-px'
  }
];
export const INFO_UPLOAD_TABLE_COLUMN_ER =
{
  headerName: 'Trạng thái dữ liệu',
    headerProperty: 'error',
  headerIndex: 6,
  className: 'w-100-px'
};
export const INFO_UPLOAD_TABLE_COLUMN_NAME =
  {
    headerName: 'Tên nhân viên',
    headerProperty: 'fullName',
    headerIndex: 6,
    className: 'w-100-px'
  };
export const TYPE_REPORT = {
  TKK: 'TKK'
};
export const TYPE_DOWLOAD = [{
  key: 'EXEL', name: 'File excel'
}, {
  key: 'PDF', name: 'File pdf'
}];
export const  TYPE_UPLOAD = [
   {key: 'LKK', name: '1. Tín dụng hưu trí ATM', file: 'Lkk_template_upload.xlsx', typeReport: TYPEBC_CLHTATM}
  ,{key: 'LKD', name: '2. Bảo hiểm Phi nhân thọ', file: 'HOSoLieuTinhLuong.xlsx', typeReport: TYPE_LKK2}
  ,{key: 'LKD_KHCN', name: '3. LKD mua bán ngoại tệ KHCN', file: 'Template_MBNTKHCN.xlsx', typeReport: TYPEBC_MBNTKHCN}
  ,{key: 'LKD1', name: '4. LKD mua bán ngoại tệ KHDN', typeReport: TYPE_MBNT_DN}
  ,{key: 'LKD3', name: '5. Bảo hiểm Nhân thọ', typeReport: TYPE_LKK2}
];
export const TYPE_UPLOAD_ARR = Object.keys(TYPE_UPLOAD).map((e) => {
  return { key: e, name: TYPE_UPLOAD[e] };
});

export const  TYPE_UPLOAD_HO = [
  {key: 'NCLC', name: '6. Ngày công luân chuyển', file: 'UploadNgayCongLC_Template.xlsx'}
  ,{key: 'HDNH', name: '7. Huy động ngắn hạn', file: 'HuyDongNganHan_Template.xlsx'}
];

export const  TYPE_UPLOAD_MHBC = [
  {key: 'LKK', name: '1. Tín dụng hưu trí ATM', file: 'Lkk_template_upload.xlsx', typeReport: TYPEBC_CLHTATM}
  ,{key: 'LKD', name: '2. Bảo hiểm Phi nhân thọ', file: 'HOSoLieuTinhLuong.xlsx', typeReport: TYPE_LKK2}
  ,{key: 'LKD_KHCN', name: '3. LKD mua bán ngoại tệ KHCN', file: 'Template_MBNTKHCN.xlsx', typeReport: TYPEBC_MBNTKHCN}
  ,{key: 'LKD1', name: '4. LKD mua bán ngoại tệ KHDN', typeReport: TYPE_MBNT_DN}
  ,{key: 'LKD3', name: '5. Bảo hiểm Nhân thọ', typeReport: TYPE_LKK2}
  ,{key: 'HDNH', name: '6. Huy động ngắn hạn', file: 'HuyDongNganHan_Template.xlsx'}
];

export const  TYPE_UPLOAD_MHHOUP = [
  {key: 'LKK', name: '1. Tín dụng hưu trí ATM', file: 'Lkk_template_upload.xlsx', typeReport: TYPEBC_CLHTATM}
  ,{key: 'LKD', name: '2. Bảo hiểm Phi nhân thọ', file: 'HOSoLieuTinhLuong.xlsx', typeReport: TYPE_LKK2}
  ,{key: 'LKD_KHCN', name: '3. LKD mua bán ngoại tệ KHCN', file: 'Template_MBNTKHCN.xlsx', typeReport: TYPEBC_MBNTKHCN}
  ,{key: 'LKD1', name: '4. LKD mua bán ngoại tệ KHDN', typeReport: TYPE_MBNT_DN}
  ,{key: 'LKD3', name: '5. Bảo hiểm Nhân thọ', typeReport: TYPE_LKK2}
  ,{key: 'NCLC', name: '6. Ngày công luân chuyển', file: 'UploadNgayCongLC_Template.xlsx'}
  ,{key: 'HDNH', name: '7. Huy động ngắn hạn', file: 'HuyDongNganHan_Template.xlsx'}
];
