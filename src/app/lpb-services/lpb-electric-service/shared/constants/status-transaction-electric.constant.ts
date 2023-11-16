import { EStatusTransaction } from './../../../lpb-water-service/shared/constants/water.constant';
export const STATUS_TRANSACTION_PAY_BY_FILE = [
  { label: 'Chờ duyệt', value: 'IN_PROCESS' },
  { label: 'Đã duyệt nộp tiền vào trung gian', value: 'APPROVE_TRANSFER' },
  { label: 'Từ chối duyệt nộp tiền vào trung gian', value: 'REJECT_APPROVE_TRANSFER' },
  { label: 'Đã gạch nợ hóa đơn', value: 'APPROVE_CHANGE_DEBT' },
  { label: 'Từ chối duyệt gạch nợ hóa đơn', value: 'REJECT_APPROVE_CHANGE_DEBT' },
  { label: 'Đã báo có điện lực', value: 'APPROVE_ACCOUNTING' },
];


export const STATUS_TRANSACTION_AUTO_PAYMENT = [
  { label: 'Chờ duyệt', value: 'IN_PROCESS' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối duyệt', value: 'REJECT' }
];

export enum EStatusTransactionSettleElectric {
  IN_PROCESS = 'IN_PROCESS',
  APPROVED = 'APPROVED',
}

export enum EStatusActive {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
