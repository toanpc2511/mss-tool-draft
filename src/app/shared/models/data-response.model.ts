export interface DataResponse<T> {
  status: number;
  errors: any;
  data: T;
}
