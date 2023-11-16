export class ResultResponse{
    responseStatus: any;  // trang thai phan hoi
    responseSucces: any;  //  trang thai phan hoi thanh cong
    responseCode: any;  // ma trang thai
    responseMsg: any;  // thong bao loi
}
export class Response {
  count: number;
  responseStatus: ResponseStatus;
  items: any[];
  item: any;
  processId: string;
  customerId: string;
}
export class SingleResponse {
  item: any;
  responseStatus: ResponseStatus;
}
export class ProcessResponse extends Response {
  customer: any;
}
export class ResponseStatus {
  success: boolean;
  codes: ResponseCode[];
  responseStatus: ResponseStatus;
}
export class ResponseCode {
  code: string;
  target: string;
  msg: string;
  detail: any;
}
