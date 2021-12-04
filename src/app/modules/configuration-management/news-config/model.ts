export interface INews {
  id?: number;
  title: string;
  content: string;
  display: boolean;
  description: string;
  image: IImageNews[];
  createdAt?: string;
}

export interface IImageNews {
  id: number;
  url: string;
  type: string;
  location: string;
}

export enum ELocationImg {
  DETAIL= 'DETAIL',
  CONTENT = 'CONTENT'
}

export interface IImage {
  id: number;
  type: string;
  url: string;
  name?: string;
  location: ELocationImg
}
