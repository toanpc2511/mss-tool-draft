export interface INews {
  id?: number;
  title: string;
  content: string;
  display: boolean;
  description: string;
  image: IImageNews[];
  createdAt?: string;
}

interface IImageNews {
  id: number;
  url: string;
  type: string;
  location: string;
}
