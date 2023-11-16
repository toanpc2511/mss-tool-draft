export interface ICccd {
  id?: number;
  cccdNo?: string | null;
  cmndBefore?: string | null;
  fullName?: string | null;
  birthDay?: string | null;
  title?: string | null;
  address?: string | null;
  dayProvide?: string | null;
  employeeId?: string | null;
  scanTime?: string | null;
  branch?: string | null;
  nationality?: string | null;
  nation?: string | null;
  religion?: string | null;
  homeTown?: string | null;
  identifying?: string | null;
  expiredDate?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  husbandOrWifeName?: string | null;
  avatarUrl?: string | null;
}

export class Cccd implements ICccd {
  constructor(
    public id?: number,
    public cccdNo?: string | null,
    public cmndBefore?: string | null,
    public fullName?: string | null,
    public birthDay?: string | null,
    public title?: string | null,
    public address?: string | null,
    public dayProvide?: string | null,
    public employeeId?: string | null,
    public scanTime?: string | null,
    public branch?: string | null
  ) {}
}

export function getCccdIdentifier(cccd: ICccd): number | undefined {
  return cccd.id;
}
