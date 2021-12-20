export const LIST_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETE: 'DELETE'
};
export const LIST_STATUS_CONTRACT = {
  ACCEPTED: 'ACCEPTED',
  REJECT: 'REJECT',
  WAITING_ACCEPT: 'WAITING_ACCEPT',
  DRAFT: 'DRAFT'
};

export const LIST_STATUS_PROFILE_CUSTOMER = {
  SUCCESS: 'SUCCESS',
  UN_SUCCESS: 'UN_SUCCESS',
  UNCONFIRMED: 'UNCONFIRMED'
}

export const LIST_STATUS_CUSTOMER = {
  ACTIVE: 'ACTIVE',
  LOCK:'LOCK',
  DELETE:'DELETE'
}

export const LIST_STATUS_QR = {
  YES: 'YES',
  NO: 'NO'
}

export const LIST_STATUS_SEARCH = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
}

export const TYPE_LOOP = [
  {
    type: 'DONT_REPEAT',
    name: 'Không lặp lại'
  },
  {
    type: 'DAILY',
    name: 'Hàng ngày'
  },
  {
    type: 'WEEKLY',
    name: 'Hàng tuần'
  }
];

export const LIST_DAY_OF_WEEK = [
  {
    type: 'MONDAY',
    name: 'T2'
  },
  {
    type: 'TUESDAY',
    name: 'T3'
  },
  {
    type: 'WEDNESDAY',
    name: 'T4'
  },
  {
    type: 'THURSDAY',
    name: 'T5'
  },
  {
    type: 'FRIDAY',
    name: 'T6'
  },
  {
    type: 'SATURDAY',
    name: 'T7'
  },
  {
    type: 'SUNDAY',
    name: 'CN'
  },
];

export const LIST_STATUS_SHIFT_CLOSING = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  PENDING: 'PENDING'
}

export const LIST_STATUS_ORDER = {
  NEW: 'NEW',
  PROCESSING: 'PROCESSING',
  FINISH_PROCESSING: 'FINISH_PROCESSING',
  WAIT_FOR_PAY: 'WAIT_FOR_PAY',
  CANCEL: 'CANCEL',
  DONE: 'DONE'
}

export const LIST_STATUS_ORDER_REQUEST = {
  WAIT_CONFIRM: 'WAIT_CONFIRM',
  APPROVE: 'APPROVE',
  CONFIRM: 'CONFIRM',
  REFUSE: 'REFUSE',
  IMPORTED: 'IMPORTED',
  EXPORTED: 'EXPORTED',
  REQUEST_CHANGE: 'REQUEST_CHANGE',
}


export const LIST_STATUS_EXPORT = {
  EXPORTED: 'EXPORTED',
  NOT_EXPORTED: 'NOT_EXPORTED',
  WAITING: 'WAITING'
}

export const LIST_STATUS_IMPORT = {
  ENTERED: 'ENTERED',
  NOT_ENTER: 'NOT_ENTER',
  WAITING: 'WAITING'
}
