/*
 * Copyright (C) 2021 LPB
 */

export const PREFIX_MOBILE_NUMBER = [
  '086',
  '096',
  '097',
  '098',
  '032',
  '033',
  '034',
  '035',
  '036',
  '037',
  '038',
  '039',
  '089',
  '090',
  '093',
  '070',
  '079',
  '077',
  '076',
  '078',
  '088',
  '091',
  '094',
  '083',
  '084',
  '085',
  '081',
  '082',
  '087',
  '092',
  '056',
  '058',
  '052',
  '099',
  '059',
  '095',
  '055'
];

/**
 * User role
 */
export const USER_ROLES = {
  'UNIFORM.BANK.GDV': 'UNIFORM.BANK.GDV',
  'UNIFORM.BANK.KSV': 'UNIFORM.BANK.KSV',
};

/**
 * Giấy tờ xác minh
 */
export const listVerificationDocs = [
  { code: 'CAN CUOC CONG DAN', name: 'Căn cước công dân' },
  { code: 'CHUNG MINH NHAN DAN', name: 'Chứng minh nhân dân' },
  { code: 'HO CHIEU', name: 'Hộ chiếu' },
  { code: 'GIAY KHAI SINH', name: 'Giấy khai sinh' },
];

/**
 * Mối quan hệ
 */
export const listRelationships = [
  { code: 'FATHER_MOTHER', name: 'Bố/mẹ' },
  { code: 'WIFE_HUSBAND', name: 'Vợ/chồng' },
  { code: 'GRANDMATHER_GRANDFATHER', name: 'Ông/ bà' },
  { code: 'SISTER_BROTHER', name: 'Anh/ chị' },
  { code: 'OTHER', name: 'Khác' },
];
/**
 * Phân loại FATCA
 */
export const typeFatcaList = [
  { code: 'US PERSON', name: 'Công dân Mỹ' },
  { code: 'PENDING CLASSIFICATION', name: 'Đang thu thập và xác minh FATCA' },
  { code: 'NONE US PERSON', name: 'Không phải công dân Mỹ' },
  { code: 'LOW VALUE EXEMPT', name: 'Chủ tài khoản chống đối' },
];
/**
 *  Mẫu biểu bổ sung
 */
export const fatcaFormList = [
  { code: 'W8BEN', name: 'W8BEN' },
  { code: 'W9', name: 'W9' },
  { code: 'OTHER', name: 'Khác' },
];
/**
 * Đối tượng
 */
export const objectTypeList = [
  { code: 'AUTHORIZATION', name: 'BÊN ỦY THÁC/ỦY QUYỀN' },
  { code: 'OWER_BENEFIT', name: 'BÊN THỤ HƯỞNG' },
  { code: 'AUTHORIZATION RECEIVER', name: 'BÊN NHẬN ỦY THÁC/ ỦY QUYỀN' },
  { code: 'SUPERVISORY', name: 'BÊN KIỂM SOÁT' },
  { code: 'OTHER', name: 'KHÁC' },
];

export const FOOTER_BUTTON_CODE = {
  FOOTER_ACTION_EDIT: 'FOOTER_ACTION_EDIT',
  FOOTER_ACTION_DELETE: 'FOOTER_ACTION_DELETE',
  FOOTER_ACTION_SEND_APPROVE: 'FOOTER_ACTION_SEND_APPROVE',
  FOOTER_ACTION_REVERSE: 'FOOTER_ACTION_REVERSE',
  FOOTER_ACTION_UNREVERSE: 'FOOTER_ACTION_UNREVERSE',
  FOOTER_ACTION_PRINT_DOCUMENT: 'FOOTER_ACTION_PRINT_DOCUMENT',
  FOOTER_ACTION_PRINT_FORM: 'FOOTER_ACTION_PRINT_FORM',
  FOOTER_ACTION_APPROVE: 'FOOTER_ACTION_APPROVE',
  FOOTER_ACTION_SAVE: 'FOOTER_ACTION_SAVE',
  FOOTER_ACTION_REJECT: 'FOOTER_ACTION_REJECT',
};
