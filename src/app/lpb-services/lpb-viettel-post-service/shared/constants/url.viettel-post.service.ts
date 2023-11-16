
export const VIETTEL_POST_SERVICE = 'viettel-post-service';
// truy van thong tin bang ke
export const GET_INFO_BILL = `${VIETTEL_POST_SERVICE}/bill`;
// giao dich
export const TRANS_SERVICE = `/${VIETTEL_POST_SERVICE}/transaction`;
export const LIST_TRANS_SERVICE = `/${VIETTEL_POST_SERVICE}/transaction/findAll`;
export const TRANS_DETAIL_SERVICE = `${VIETTEL_POST_SERVICE}/transaction/findTrans`;
// chung tu
export const REPORT_PHT = `${VIETTEL_POST_SERVICE}/documents/tranPost`;
export const REPORT_PDNT = `${VIETTEL_POST_SERVICE}/documents/receipt`;

// Thong tin NCC
export const GET_SUPPLIER = `${VIETTEL_POST_SERVICE}/config/supplier`;
