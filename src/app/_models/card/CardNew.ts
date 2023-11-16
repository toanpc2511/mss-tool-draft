import {AccountLinkList} from './AcountLinkList';
import {CardSubList} from './subCard/CardSubList';

export class CardNew {
  id: string;
  cardSubList: CardSubList;
  accountLinkList: AccountLinkList[];//danh sách tài khoản liên kết
  processId: string;
  accountId: string;
  cardTypeCode: string;
  cardRateCode: string;
  cardProductCode: string;
  cardHolderName: string;
  cardNumber: string;
  deliveryTypeCode: string;
  deliveryChanelCode: string;
  deliveryBranchCode: string;
  deliveryAddress: string;
  cardIssueFeeTypeCode: string;
  feeAmount: number;
  totalAmount: number;
  vat: string;
  interestRate: number;
  secretQuestion: string;
  secretAnswer: string;
  explain: string;
  startDate: string;
  expirationDate: string;
  employeeId: string;
  referrerCode: string;
  currentStatusCode: string;
  currentStatusName: string;
  changeStatusCode: string;
  changeStatusName: string;
  actionCode: string;
  actionName: string;
}
