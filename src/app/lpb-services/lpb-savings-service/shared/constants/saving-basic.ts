// region NGHỀ NGHIỆP
export enum OCCUPATION {
  occupation1 = 'occupation1',
  occupation2 = 'occupation2',
  occupation3 = 'occupation3',
  occupation4 = 'occupation4',
  occupation5 = 'occupation5',
}
export const OCCUPATIONS = [
  { code: OCCUPATION.occupation1, label: 'nghề nghiệp ví dụ 1' },
  { code: OCCUPATION.occupation2, label: 'nghề nghiệp ví dụ 2' },
  { code: OCCUPATION.occupation3, label: 'nghề nghiệp ví dụ 3' },
  { code: OCCUPATION.occupation4, label: 'nghề nghiệp ví dụ 4' },
  { code: OCCUPATION.occupation5, label: 'nghề nghiệp ví dụ 5' },
];
// end region NGHỀ NGHIỆP

// region PHẠM VI ỦY QUYỀN
export enum AUTHORIZATION_SCOPE {
  withdrawPrincipal = 'withdrawPrincipal',
  withdrawInterest = 'withdrawInterest',
  withdrawBoth = 'withdrawBoth',
  other = 'other',
}
export const AUTHORIZATION_SCOPES = [
  { code: AUTHORIZATION_SCOPE.withdrawPrincipal, label: 'Chỉ được rút gốc' },
  { code: AUTHORIZATION_SCOPE.withdrawInterest, label: 'Chỉ được rút lãi' },
  { code: AUTHORIZATION_SCOPE.withdrawBoth, label: 'Được rút gốc và lãi' },
  { code: AUTHORIZATION_SCOPE.other, label: 'Khác...........' },
];
// end region PHẠM VI ỦY QUYỀN

// region THỜI HẠN ỦY QUYỀN
export enum AUTHORIZATION_DURATION {
  limited = 'limited',
  untilReplaced = 'untilReplaced',
}
export const AUTHORIZATION_DURATIONS = [
  { code: AUTHORIZATION_DURATION.limited, label: 'Có giới hạn' },
  {
    code: AUTHORIZATION_DURATION.untilReplaced,
    label: 'Thời gian ủy quyền đến khi có thay thể/bổ sung',
  },
];
// end region THỜI HẠN ỦY QUYỀN

export const GENDERS = [
  { label: 'Nam', code: 'male' },
  { label: 'Nữ', code: 'female' },
  { label: 'Khác', code: 'other' },
];

export const RELATIONS = [
  { label: 'Cha', code: 'father' },
  { label: 'Mẹ', code: 'mother' },
  { label: 'Anh ruột', code: 'brother' },
  { label: 'Chị ruột', code: 'sister' },
  { label: 'Ông', code: 'grandfather' },
  { label: 'Bà', code: 'grandmother' },
  { label: 'Cô ruột', code: 'aunt' },
  { label: 'Chú ruột', code: 'uncle' },
  { label: 'Khác', code: 'other' },
];

export enum UDF_FIELDS_NAME {
  '4C_PTTT' = 'fourC_PTTT',
  'CAC KHOAN KY QUY' = 'depositAmounts',
  'CCTG' = 'cctg',
  'CO CHE' = 'mechanism',
  'CHUONG TRINH' = 'program',
  'KHACH HANG VIP' = 'vipCustomer',
  'KHOI HO' = 'khoiHo',
  'LOAI KY HAN LE NGAY' = 'oddTermType',
  'MA TINH BHXH' = 'socialInsuranceProvinceCode',
  'PHAN LOAI BHXH' = 'socialInsuranceType',
  'QUA TANG' = 'gift',
  'TIEN GUI KY QUY' = 'depositMoney',
  'TKBD' = 'tkbd',
  'TKLUONG' = 'salaryAccount',
  'UU DAI LAI SUAT TAI KHOAN' = 'accountInterestRateDiscount',
}
