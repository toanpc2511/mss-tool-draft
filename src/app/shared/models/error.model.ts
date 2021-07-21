export interface IError {
  code: string;
  errors: Array<{
    field: string;
    description: string;
  }>;
  message: string;
}
