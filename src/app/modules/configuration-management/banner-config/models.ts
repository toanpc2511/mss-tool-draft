export interface IBanner {
  id: number;
  title: string;
  shows: boolean;
  image: {
    id: number;
    url: string;
    typeMedia: string;
  }
}
