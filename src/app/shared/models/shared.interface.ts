export interface IImage {
  id: number;
  type: 'img';
  url: string;
  name: string;
  face: EFace;
}

export enum EFace {
  FRONT = 'FRONT',
  BACK = 'BACK'
}
