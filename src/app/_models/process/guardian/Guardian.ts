import {GuardianCustomerPerson} from './GuardianCustomerPerson';

export class Guardian {
  id: string;
  customer: GuardianCustomerPerson;
  processId: string;
  guardianTypeCode: string;
  guardianTypeName: string;
  guardianRelationCode: string;
  guardianRelationName: string;
  actionCode: string;
  actionName: string;
  currentStatusCode: string;
  currentStatusName: string;
  changeStatusCode: string;
  changeStatusName: string;
  createdDate: string;
  createdBy: string;
  createdByUserName: string;
  createdByFullName: string;
  createdByUserCore: string;
  modifiedDate: string;
  modifiedBy: string;
  modifiedByUserName: string;
  modifiedByFullName: string;
  modifiedByUserCore: string;
  rowNum: string;
}
