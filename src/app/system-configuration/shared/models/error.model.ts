export interface IError {
  code: string;
  message: string;
  errors?: Array<{
    field: string;
    description: string;
  }>;
}
