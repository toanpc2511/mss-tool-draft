export const CITAD_PRODUCTS_CODES = {
  CT03: 'CT03',
  CT04: 'CT04',
  CT05: 'CT05',
  CT06: 'CT06',
};

export const PRODUCTS_TYPES = {
  FOREIGN: 'FOREIGN',
  DOMESTIC: 'DOMESTIC',
  ALL: 'ALL',
};


export const CITAD_PRODUCTS = [
  {
    code: CITAD_PRODUCTS_CODES.CT03,
    name: 'CK VND KHAC HT CN',
    type: PRODUCTS_TYPES.DOMESTIC,
  },
  {
    code: CITAD_PRODUCTS_CODES.CT04,
    name: 'CK VND KHAC HT DN',
    type: PRODUCTS_TYPES.DOMESTIC,
  },
  {
    code: CITAD_PRODUCTS_CODES.CT05,
    name: 'CT VND KHAC',
    type: PRODUCTS_TYPES.DOMESTIC,
  },
];

export const ROUTES_CODES = {
  IBPS_O_HO: 'IBPS_O_HO',
  IBPS_O_HO1: 'IBPS_O_HO1',
  IBPS_O_HO2: 'IBPS_O_HO2',
  IBPS_O_HCM: 'IBPS_O_HCM'
};


export const CITAD_ROUTES = [
  {
    code: ROUTES_CODES.IBPS_O_HO,
    name: 'IBPS OUTWARD HO',
  },
  {
    code: ROUTES_CODES.IBPS_O_HO1,
    name: 'IBPS OUTWARD HO1',
  },
  {
    code: ROUTES_CODES.IBPS_O_HO2,
    name: 'IBPS OUTWARD HO2',
  },
  {
    code: ROUTES_CODES.IBPS_O_HCM,
    name: 'IBPS OUTWARD HCM',
  },
];

export const CITAD_SYNC_STATUS = {
  FAILURE: 'FAILURE',
  IN_PROCESS: 'IN_PROCESS',
  NO_PROCESS: 'NO_PROCESS'
}

export const CITAD_SYNC_STATUS_VI = {
  FAILURE: 'Thất bại',
  IN_PROCESS: 'Đang đồng bộ',
  NO_PROCESS: 'Thành công'
}

export const CITAD_SYNC_STATUS_COLOR = {
  FAILURE: '#dc3545',
  IN_PROCESS: '#ffc107',
  NO_PROCESS: '#28a745'
}

