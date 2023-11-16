import {IndividualCif} from './cif';
import * as moment from 'moment';
import {Customer, Mis, Person, Udf} from './register.cif';
import {ReferenceCif} from './RefernceCif/ReferenceCif';
import {OwnerBenefitsCif2} from './ownerBenefitsCif2';
import {GuardianList} from './deputy';
import {OwnerBenefitsCif} from './ownerBenefitsCif';
import { createdByUser } from './createdByUser';
import { Branch } from './branch';

export class  Process {
  id: string;
  person: Person = new Person();
  code: string;
  statusId: string;
  statusName: string;
  branchCode: string;
  branchName: string;
  inputBy: string;
  inputter: string;
  inputterName: string;
  approveBy: string;
  isSlaFailed: string;
  createdDate: string;
  customerTypeCode: string;
  customerTypeName: string;
  regisType: string;
  regisTypeName: string;
  customerCode: string;
  fullName: string;
  perDocNo: string;
  mobilePhone: string;
  statusCode:	string;

  mis: Mis = new Mis();
  udf: Udf = new Udf();
  customerRelationshipList: ReferenceCif[] = [];
  customerOwnerBenefitList: OwnerBenefitsCif2[] = [];
  guardianList: GuardianList[] = [];
  createdByUser: createdByUser[] = [];
  branch: Branch[] = [];

  constructor(process: any = null) {
    if (!process) {
      return;
    }

    this.id = process.id;
    this.code = process.code;
    this.person = process.customer;
    this.statusId = process.statusId;
    this.statusName = process.statusName;
    this.branchCode = process.branchCode;
    this.branchName = process.branchName;
    this.inputBy = process.inputBy;
    this.inputter = process.inputter;
    this.inputterName = process.inputterName;
    this.approveBy = process.approveBy;
    this.isSlaFailed = process.isSlaFailed;
    this.createdDate = process.createdDate;
    this.customerTypeCode = process.customerTypeCode;
    this.customerTypeName = process.customerTypeName;
    this.regisType = process.regisType;
    this.regisTypeName = process.regisTypeName;
    this.customerCode = process.customerCode;
    this.fullName = process.fullName;
    this.perDocNo = process.perDocNo;
    this.mobilePhone = process.mobilePhone;
  }

  getDateCreated(): any {
    return moment(new Date(this.createdDate)).format('DD/MM/yyyy');
  }
}

export class DetailProcess extends IndividualCif {
  processId: string;
  genderName: string;
  customerTypeCode: string;
  customerTypeName: string;
  customerCode: string;
  branchName: string;
  currentState: string;
  changeState: string;
  action: string;
  requestId: string;
  perDocTypeName: string;
  maritalStatusName: string;
  industryName: string;
  educationName: string;
  nationalityName: string;
  rdistrictName: string;
  rcityName: string;
  rwardName: string;
  cdistrictName: string;
  cwardName: string;
  ccityName: string;
  statusId: string;
  statusName: string;

  constructor(process: any) {
    super(null);
    if (!process) {
      return;
    }
    this.customerTypeCode = process.customerTypeCode;
    this.customerTypeName = process.customerTypeName;
    this.customerCode = process.customerCode;
    this.currentState = process.changeState;
    this.changeState = process.changeState;
    this.action = process.action;
    this.requestId = process.requestId;
    this.perDocTypeName = process.perDocTypeName;
    this.maritalStatusName = process.maritalStatusName;
    this.industryName = process.industryName;
    this.educationName = process.educationName;
    this.nationalityName = process.nationalityName;
    this.rdistrictName = process.rdistrictName;
    this.rcityName = process.rcityName;
    this.rwardName = process.rwardName;
    this.cdistrictName = process.cdistrictName;
    this.cwardName = process.cwardName;
    this.ccityName = process.ccityName;

    this.processId = process.processId;
    this.fullName = process.fullName;
    this.gender = process.gender;
    this.genderName = process.genderName;
    this.perDocNo = process.perDocNo;
    this.perDocType = process.perDocType;
    this.issueDate = process.issueDate;
    this.issuePlace = process.issuePlace;
    this.expireDate = process.expireDate;
    this.mobilePhone = process.mobilePhone;
    this.birthDate = process.birthDate;
    this.bornOfPlace = process.bornOfPlace;
    this.residence = process.residence;
    this.industry = process.industry;
    this.position = process.position;
    this.employeeId = process.employeeId;
    this.maritalStatus = process.maritalStatus;
    this.branchCode = process.branchCode;
    this.branchName = process.branchName;
    this.education = process.education;
    this.email = process.email;
    // this.sector = process.sector
    this.income = process.income;
    this.nationalityCode = process.nationalityCode;
    // this.cityWork = process.cityWork
    this.usingOverdraft = process.usingOverdraft;
    this.salaryInBank = process.salaryInBank;

    this.ccountryCode = 'VN';
    // this.ccountryCode = process.ccountryCode
    this.ccityCode = process.ccityCode;
    this.cdistrictCode = process.cdistrictCode;
    this.cwardCode = process.cwardCode;
    this.cstreetNumber = process.cstreetNumber;

    this.rcountryCode = process.rcountryCode;
    this.rcityCode = process.rcityCode;
    this.rdistrictCode = process.rdistrictCode;
    this.rwardCode = process.rwardCode;
    this.rstreetNumber = process.rstreetNumber;

    this.fatcaIds = process.fatcaIds;
    this.freeVisa = process.freeVisa;
    this.passport = process.passport;
    // this.passportExpDate = this.toISODate(process.passportExpDate)
    // this.passportIssueDate = this.toISODate(process.passportIssueDate)
    this.passportIssuePlace = process.passportIssuePlace;

    this.rmPrimaryCode = process.rmPrimaryCode;
    this.rmSecondaryCode = process.rmSecondaryCode;
    // this.visaExpireDate = this.toISODate(process.visaExpireDate)
    // this.visaIssueDate = this.toISODate(process.visaIssueDate)
    this.statusId = process.statusId;
    this.statusName = process.statusName;
  }

  getBirthDay(): any {
    return this.toDateVN(this.birthDate);
  }

  getVisa(): any {
    return this.freeVisa === true ? '1' : '2';
  }

  getEditDate(date: string): any {
    return (date !== '' && date != null && date !== undefined) ? moment(new Date(date)).format('yyyy-MM-DD') : '';
  }

  getBirthDayEdit(): any {
    return moment(new Date(this.birthDate)).format('yyyy-MM-DD');
  }

  getIssueDate(): any {
    return this.toDateVN(this.issueDate);
  }

  getIssueDateEdit(): any {
    return moment(new Date(this.issueDate)).format('yyyy-MM-DD');
  }

  getExpireDate(): any {
    return this.toDateVN(this.expireDate);
  }

  getExpireDateEdit(): any {
    return moment(new Date(this.expireDate)).format('yyyy-MM-DD');
  }
}

export class ApprovableProcess {
  constructor(processId: string, note: string = '') {
    this.processId = processId;
    this.note = note;
  }

  processId: string;
  note: string;
}
