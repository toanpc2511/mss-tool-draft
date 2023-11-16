export function isHoiSo(): boolean {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  return userInfo?.branchCode === '001' || userInfo?.branchCode === '000';
}

export function isGDV(): boolean {
  const userRole = JSON.parse(localStorage.getItem('userRole'));
  return 'UNIFORM.BANK.GDV' === userRole?.code;
}


export function isKSV(): boolean {
  const userRole = JSON.parse(localStorage.getItem('userRole'));
  return 'UNIFORM.BANK.KSV' === userRole?.code;
}

export function isRoot(): boolean {
  const userRole = JSON.parse(localStorage.getItem('userRole'));
  console.log('UNIFORM.BANK.QUANTRI' === userRole?.code, userRole?.code);
  return 'UNIFORM.BANK.QUANTRI' === userRole?.code;
}

export function isKSPAdmin(): boolean {
  const userRole = JSON.parse(localStorage.getItem('userRole'));
  return 'UNIFORM.KSP.ADMIN' === userRole?.code;
}
