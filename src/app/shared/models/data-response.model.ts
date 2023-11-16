export class DataResponse<T> {
  meta: {
    code?: string;
    errors?: [
      {
        description?: string;
        field?: string;
      }
    ];
    message?: string;
    page?: number;
    size?: number;
    total?: number;
  };
  data?: T;
  constructor(response: any, isLink?: boolean) {
    this.meta = response.meta;
    this.data = response.data as T;
  }
}