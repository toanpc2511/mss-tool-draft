export const VIETLOTT_SERVICE = 'vietlott-service';

export const VIRTUAL_ACC_SERVICE = `${VIETLOTT_SERVICE}/virtualAccount`;
// giao dich
export const TRANS_SERVICE = `${VIETLOTT_SERVICE}/limit`;
export const TRANS_APPROVE = `${VIETLOTT_SERVICE}/limit/approve`;
export const TRANS_REJECT = `${VIETLOTT_SERVICE}/limit/reject`;
export const TRANS_CHECK = `${VIETLOTT_SERVICE}/limit/check`;


// chung tu
export const REPORT_PTT = `${VIETLOTT_SERVICE}/reports/debt`;
export const REPORT_PCT = `${VIETLOTT_SERVICE}/reports/tranPost`;

// tang han muc bo sung
export const TRANS_RETRY_SERVICE = `${VIETLOTT_SERVICE}/limit/update-status-limit`;
export const TRANS_RETRY_APPROVE = `${VIETLOTT_SERVICE}/limit/settle-bill`;

// bao cao
export const URL_REPORT = `${VIETLOTT_SERVICE}/reports/report`;

// gan/ xoa quyen quan ly
export  const AUTHORIZE_MANAGE = `/${VIETLOTT_SERVICE}/branch`;
export  const AUTHORIZE_MANAGE_DETAIL = `/${VIETLOTT_SERVICE}/branch/posId`;

// truy van han muc
export const TOPUP_LIMIT = `${VIETLOTT_SERVICE}/limit/topUp-limit`;

