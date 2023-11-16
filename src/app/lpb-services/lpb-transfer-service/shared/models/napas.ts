import { CommonTransfer } from "./common";

export interface NapasBankInfo {
  bankName: string;
  benId: string;
}

export interface NapasCardInfo {
  bankName: string;
  customerName: string;
}

export interface NapasTransfer extends CommonTransfer {
  intermediaryAcn: string;
  intermediaryAcnName: string;
  employeeId: string;
  accountName: string;

  recipientAcn: string;
  recipientCardNum: string;
  recipientBankId: string;
  recipientBankName: string;
  recipientFullName: string;
}
