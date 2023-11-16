import { CommonTransfer } from './common';

export interface CitadTransfer extends CommonTransfer {
  addrRecipientBank: string;
  addrSender1: string;
  addrSender2: string;
  addrSender3: string;
  addrSender4: string;
  accountName: string;

  crossoverNote: string;
  directCode: string;
  employeeId: string;
  inDirectCode: string;
  inDirectCodeDesc: string;
  nostroAcn: string;
  nostroName: string;

  recipientAcn: string;
  recipientBankId: string;
  recipientBank: string;
  recipientBankName: string;
  recipientDocIssueDate: string;
  recipientDocIssuePlace: string;
  recipientDocNum: string;
  recipientDocType: string;
  recipientFullName: string;
  routeCode: string;
}

export interface CitadBankInfo {
  code: string;
  displayName: string;
  name: string;
}

export interface CitadIndirectInfo {
  directCode: string;
  directName: string;
  id: string;
  indirectCode: string;
  indirectName: string;
  routeCode: string;
}


export interface CitadSyncInfo {
  lastSyncDt: string | number;
  status: string;
  statusVi?: string;
  color?: string;
}
