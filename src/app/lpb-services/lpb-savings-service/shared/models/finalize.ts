export interface FINALIZE {
  cifNo: string;
  accountNumber: string;
  serial: string;
  currency: string;
  description: string;
  settlementType: string;
  openingDate: string;
  settlementDate: string;
  interestRate: string;
  bookStatus: string;
  prematureInterest: string;
  amount: string;
  matureInterest: string;
  totalAmount: string;
  moneyList: any[];
  settlementDeposits: any[];
  additionalExpenses: string;
}
