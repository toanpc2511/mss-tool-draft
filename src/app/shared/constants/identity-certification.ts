export const DOC_TYPES = {
  CCCD: 'CCCD',
  CMND: 'CMND',
  PASSPORT: 'PASSPORT',
  BIRTH_CERT: 'BIRTH_CERT',
};

export const DOC_TYPES_VI = [
  {
    code: DOC_TYPES.CCCD,
    name: 'Căn cước công dân',
    radioTxt: 'CCCD',
    noneMark: 'CAN CUOC CONG DAN',
  },
  {
    code: DOC_TYPES.PASSPORT,
    name: 'Hộ chiếu',
    radioTxt: 'Hộ chiếu',
    noneMark: 'HO CHIEU',
  },
  {
    code: DOC_TYPES.CMND,
    name: 'Chứng minh nhân dân',
    radioTxt: 'CMND',
    noneMark: 'CHUNG MINH NHAN DAN',
  },
  {
    code: DOC_TYPES.BIRTH_CERT,
    name: 'Giấy khai sinh',
    radioTxt: 'Giấy khai sinh',
    noneMark: 'GIAY KHAI SINH',
  },
];
