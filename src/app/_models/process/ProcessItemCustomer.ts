import { ReferenceCif } from '../RefernceCif/ReferenceCif';
import { ProcessItemCustomerPerson } from './ProcessItemCustomerPerson';
import { OwnerBenefitsCif2 } from '../ownerBenefitsCif2';
import { Mis, Udf } from '../register.cif';
import { GuardianList } from '../deputy';
import { Legal } from './legal/Legal';

export class ProcessItemCustomer {
  id: string;
  processId: string;
  legalId: string;
  cifLienQuan: ReferenceCif[] = [];
  customerOwnerBenefit: OwnerBenefitsCif2[] = [];
  person: ProcessItemCustomerPerson = new ProcessItemCustomerPerson();
  guardianList: GuardianList[] = [];
  legalList: Legal[] = [];
  mis: Mis = new Mis();
  udf: Udf = new Udf();
  customerCode: string;
  currentStatusName: string;
  statusCif?: string;
  statusCifName?: string;
}
