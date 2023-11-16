import {LegalCustomer} from './LegalCustomer';

export class Legal {
  id: any;
  legalCode: string;
  amount: string;
  content: string;
  beginDate: string;
  nationalityCode: string;
  inEffect: any;
  idTTPL: string;
  customerList: LegalCustomer[] = [];
  status: string;
  legalAgreementCode: string;
}
