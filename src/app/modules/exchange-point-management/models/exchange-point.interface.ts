export interface IExchangePoint {
  id: number;
  phone: string;
  currentPoint: number;
  pointSwap: number;
  pointRemain: number;
  priceReceived: number;
  attachment: IAttachment[];
  profile: IProfile;
  createdAt: string;
}

export interface IProfile {
  id: number;
  name: string;
  idCard: string;
  phone: string;
}

export interface IAttachment {
  id: number;
  url: string;
  name: string;
}
