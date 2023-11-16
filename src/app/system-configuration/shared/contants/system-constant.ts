import { LpbDatatableColumn } from '../../../shared/models/LpbDatatableColumn';

export const STATUS_SUPPLIER = [
  {
    type: 'ACTIVE',
    name: 'Hoạt động',
  },
  {
    type: 'INACTIVE',
    name: 'Dừng hoạt động',
  },
];
export const STATUS_UNIVERSITY = [
  {
    type: 0,
    name: 'Hoạt động',
  },
  {
    type: 1,
    name: 'Dừng hoạt động',
  },
];
export const PREFIXS = [
  { label: "Tên khách hàng", value: "CUST_NAME_NORMALIZE" },
  { label: "Mã khách hàng", value: "CUST_ID" },
];

export const PERIOD_DETAILS_ELECTRIC = [
  { label: 'Mã hóa đơn ', value: 'BILL_CODE' },
  { label: 'Số tiền', value: 'BILL_AMOUNT' },
  { label: 'Chi tiết kỳ', value: 'BILL_DESC' },
];

export const PREFIXS_ELECTRIC = [
  { label: 'Kênh thu', value: 'CHANNEL' },
  { label: 'Tên khách hàng', value: 'CUST_NAME_NORMALIZE' },
  { label: 'Mã khách hàng', value: 'CUST_ID' },
];

export const PERIOD_DETAILS = [
  { label: "Tháng", value: "BILL_ID" },
  { label: "Năm", value: "BILL_CODE" },
  { label: "Số tiền", value: "BILL_AMOUNT" },
];

export const TYPES_CONFIG_ELECTRIC = [
  {
    label: 'Dùng chung tài khoản chuyên thu cho tất cả các loại hóa đơn',
    value: 'SHARED'
  },
  {
    label: 'Tách riêng tài khoản chuyên theo loại hóa đơn',
    value: 'PRIVATE'
  }
];

export const SUPPLIER_COLUMNS = [
  {
    headerName: 'Tên NCC',
    headerProperty: 'supplierName',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã NCC',
    headerProperty: 'supplierCode',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Loại dịch vụ',
    headerProperty: 'serviceTypeName',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'statusName',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Người cập nhật',
    headerProperty: 'lastModifiedBy',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày cập nhật',
    headerProperty: 'lastModifiedDate',
    headerIndex: 5,
    className: 'w-200-px',
    type: 'datetime'
  },
];

export const ELECTRIC_SUPPLIER_COLUMNS: LpbDatatableColumn[] = [
  {
    headerName: 'Mã NCC',
    headerProperty: 'supplierCode',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Tên NCC',
    headerProperty: 'supplierName',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Loại dịch vụ',
    headerProperty: 'serviceTypeName',
    headerIndex: 2,
    className: 'w-200-px'
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'statusName',
    headerIndex: 3,
    className: 'w-200-px',
    customStyleTick: {
      property: 'statusCode',
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
    headerName: 'Người cập nhật',
    headerProperty: 'lastModifiedBy',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày cập nhật',
    headerProperty: 'lastModifiedDate',
    headerIndex: 5,
    className: 'w-200-px',
    type: 'datetime'
  },
];
export const UNIVERSITY_CONFIG_COLUMNS: LpbDatatableColumn[] = [
  {
    headerName: 'Tên nhà trường',
    headerProperty: 'name',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Hình thức thanh toán',
    headerProperty: 'typeConnectName',
    headerIndex: 1,
    className: 'w-200-px'
  },
  {
    headerName: 'Số Cif',
    headerProperty: 'customerNo',
    headerIndex: 3,
    className: 'w-200-px'
  },
  {
    headerName: 'Số tài khoản',
    headerProperty: 'accNo',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Người cập nhật',
    headerProperty: 'lastModifiedBy',
    headerIndex: 6,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày cập nhật',
    headerProperty: 'lastModifiedDate',
    headerIndex: 7,
    className: 'w-200-px',
    type: 'datetime'
  },
];

export const PREFIXS_TUITION = [
  { label: 'Tên sinh viên', value: 'studentName' },
  { label: 'Mã sinh viên', value: 'studentCode' },
  { label: 'Lớp', value: 'className' },
];

export const PERIOD_DETAILS_TUITION = [
  { label: 'Số tiền', value: 'amount' },
  { label: 'Học kỳ', value: 'semester' },
  { label: 'Năm', value: 'year' },
];

export const FORM_TYPES = [
  { label: 'Online', value: 'ONLINE' },
  { label: 'Offline', value: 'OFFLINE' },
];

export const CATEGORY_TYPES = [
  {
    label: 'Danh mục cơ quan thu',
    apiUpdate: 'category/sync?category=TCT_QUERY_DMCQT',
    apiExport: '/tax-service/category/export?category=TCT_QUERY_DMCQT'
  },
  {
    label: 'Danh mục ĐBHC',
    apiUpdate: 'category/sync?category=TCT_QUERY_DMDBHC',
    apiExport: '/tax-service/category/export?category=TCT_QUERY_DMDBHC'
  },
  {
    label: 'Danh mục kho bạc',
    apiUpdate: 'category/sync?category=TCT_QUERY_DMKB',
    apiExport: '/tax-service/category/export?category=TCT_QUERY_DMKB'
  },
  {
    label: 'Danh mục chương',
    apiUpdate: 'category/sync?category=TCT_QUERY_DMC',
    apiExport: '/tax-service/category/export?category=TCT_QUERY_DMC'
  },
  {
    label: 'Danh mục khoản',
    apiUpdate: 'category/sync?category=TCT_QUERY_DMK',
    apiExport: '/tax-service/category/export?category=TCT_QUERY_DMK'
  },
  {
    label: 'Danh mục tiểu mục',
    apiUpdate: 'category/sync?category=TCT_QUERY_DMTM',
    apiExport: '/tax-service/category/export?category=TCT_QUERY_DMTM'
  }
];
export const VIETTEL_POST_SUPPLIER_CONFIG_COLUMNS: LpbDatatableColumn[] = [
  {
    headerName: 'Tên NCC',
    headerProperty: 'name',
    headerIndex: 0,
    className: 'w-200-px'
  },
  {
    headerName: 'Mã NCC',
    headerProperty: 'code',
    headerIndex: 1,
    className: 'w-100-px'
  },
  {
    headerName: 'STK chuyên thu',
    headerProperty: 'accNo',
    headerIndex: 2,
    className: 'w-100-px'
  },
  {
    headerName: 'Trạng thái',
    headerProperty: 'isActiveName',
    headerIndex: 3,
    className: 'w-100-px',
    customStyleTick: {
      property: 'isActive',
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
    headerName: 'Người cập nhật',
    headerProperty: 'lastModifiedBy',
    headerIndex: 4,
    className: 'w-200-px'
  },
  {
    headerName: 'Ngày cập nhật',
    headerProperty: 'lastModifiedDate',
    headerIndex: 5,
    className: 'w-200-px',
    type: 'datetime'
  },
];
export const CONTENT_VIETTEL_POST = [
  { label: 'Mã bảng kê', value: 'billCode' },
  { label: 'Mã nhân viên', value: 'custId' },
  { label: 'Tên nhân viên', value: 'custName' },
  { label: 'Số tiền', value: 'billAmount' },
];
