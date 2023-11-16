import {PaymentPeroidType, PaymentType} from '../enums/PaymentType';

export class LpbDatatablePaymentConfig {
  sortBy: string;
  totalAmount: number;
  paymentType: PaymentType = PaymentType.ANY;
  paymentPeroidType: PaymentPeroidType = PaymentPeroidType.ANY;
  type: string;
}
