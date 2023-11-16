import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DetailProcess } from './process';
import { Bigger3Date, BiggerDate, futureDate, pastDate } from '../_validator/cif.register.validator';
import { NgTemplateOutlet } from '@angular/common';

export class IndividualCif {
  constructor(data: any, processId: string = '') {
    if (!data) { return; }
    this.processId = processId;
    this.fullName = data.fullName.value ? data.fullName.value.trim() : data.fullName.value;
    this.gender = data.gender.value;
    this.perDocNo = data.perDocNo.value;
    this.perDocType = data.perDocType.value;
    this.issueDate = this.toISODate(data.issuedDate.value);
    this.issuePlace = data.issuedPlace.value.trim();
    this.expireDate = this.toISODate(data.expiredDate.value);
    this.mobilePhone = data.mobilePhone.value;
    this.workPhone = data.workPhone.value;
    this.homePhone = data.homePhone.value;
    this.socialNetwork = data.socialNetwork.value ? data.socialNetwork.value.trim() : data.socialNetwork.value;
    this.birthDate = this.toISODate(data.birthday.value);
    this.bornOfPlace = data.birthPlace.value ? data.birthPlace.value.trim() : data.birthPlace.value;
    this.residence = data.hasResident.value === '1';
    this.industry = data.job.value;
    this.position = data.jobTitle.value.trim();
    this.cifKH78 = data.cifKH78.value ? data.cifKH78.value.trim() : data.cifKH78.value;
    this.cifMANKT = data.cifMANKT.value ? data.cifMANKT.value.trim() : data.cifMANKT.value;
    this.employeeId = data.employeeId.value ? data.employeeId.value.trim() : data.employeeId.value;
    this.maritalStatus = data.maritalStatus.value;
    this.branchCode = data.branch.value;
    this.education = data.academicLevel.value;
    this.email = data.email.value ? data.email.value.trim() : data.email.value;
    this.sector = '1700';
    this.income = data.salary.value;
    this.nationalityCode = data.nationality.value;
    // this.cityWork = data.workPlace.value ? data.workPlace.value.trim() : data.workPlace.value
    this.usingOverdraft = data.useOverDraft.value === '1';
    this.salaryInBank = data.receiveSalaryFromLpb.value === '1';
    this.personalIncomeTax = data.personalIncomeTax.value ? data.personalIncomeTax.value.trim() : data.personalIncomeTax.value;

    this.ccountryCode = data.currentCountry.value;
    this.ccityCode = data.currentProvince.value;
    this.cdistrictCode = data.currentDistrict.value;
    this.cwardCode = data.currentWards.value;
    this.cstreetNumber = data.currentAddress.value ? data.currentAddress.value.trim() : data.currentAddress.value;

    this.rcountryCode = data.permanentCountry.value;
    this.rcityCode = data.permanentProvince.value;
    this.rdistrictCode = data.permanentDistrict.value;
    this.rwardCode = data.permanentWards.value;
    this.rstreetNumber = data.permanentAddress.value ? data.permanentAddress.value.trim() : data.permanentAddress.value;

    // unavailable at the moment
    // this.passport = null
    // this.passportExpDate = this.toISODate(data.passportExpDate.value)
    // this.passportIssueDate = this.toISODate(data.passportIssueDate.value)
    // this.passportIssuePlace = null

    this.rmPrimaryCode = data.employeeId.value.trim();
    this.rmSecondaryCode = data.employeeId.value.trim();
    if (data.nationality.value === 'US') {
      // send fatca information when nationality is US
      this.fatcaIds = this.getFatca(data);
    }
    if (data.nationality.value !== 'VN') {
      // send visa information when nationality is different from VN
      this.freeVisa = data.freeVisa.value === '1';
      this.visaExpireDate = this.toISODate(data.visaExpireDate.value);
      this.visaIssueDate = this.toISODate(data.visaIssueDate.value);
    }
  }

  processId: string;
  sector: string;
  fullName: string;
  gender: string;

  perDocNo: string;
  perDocType: string;
  issueDate: string;
  issuePlace: string;
  expireDate: string;

  perDocNo2: string;
  perDocType2: string;
  issueDate2: string;
  issuePlace2: string;
  expireDate2: string;

  perDocNo3: string;
  perDocType3: string;
  issueDate3: string;
  issuePlace3: string;
  expireDate3: string;

  mobilePhone: string;
  birthDate: string;
  bornOfPlace: string;
  residence: boolean;
  industry: string;
  position: string;
  cifKH78: string;
  cifMANKT: string;
  employeeId: string;
  maritalStatus: string;
  branchCode: string;
  education: string;
  email: string;
  workPhone: string;
  homePhone: string;
  socialNetwork: string;
  // sector: string
  income: string;
  personalIncomeTax: string;
  nationalityCode: string;
  // cityWork: string
  usingOverdraft: boolean;
  salaryInBank: boolean;

  ccountryCode: string;
  ccityCode: string;
  cdistrictCode: string;
  cwardCode: string;
  cstreetNumber: string;

  rcountryCode: string;
  rcityCode: string;
  rdistrictCode: string;
  rwardCode: string;
  rstreetNumber: string;

  fatcaIds: string[];
  freeVisa: boolean;
  passport: string;
  passportExpDate: string;
  passportIssueDate: string;
  passportIssuePlace: string;

  rmPrimaryCode: string;
  rmSecondaryCode: string;
  visaExpireDate: string;
  visaIssueDate: string;

  getFatca(data: any): string[] {
    const fatcas: string[] = [];
    if (data.fatcaW8.value && data.fatcaW8.value != null && data.fatcaW8.value !== undefined && data.fatcaW8.value !== '') {
      fatcas.push(data.fatcaW8.value);
    }
    if (data.fatcaW9.value && data.fatcaW9.value != null && data.fatcaW9.value !== undefined && data.fatcaW9.value !== '') {
      fatcas.push(data.fatcaW9.value);
    }
    return fatcas;
  }

  toISODate(date: string): string {
    return date !== '' ? date + 'T00:00:00' : null;
  }

  toDateVN(date: string): string {
    return moment(new Date(date)).format('DD/MM/yyyy');
  }
}

export class Cif {

  constructor(process: DetailProcess) {
    if (process && process.processId !== '' && process.processId !== undefined && process.processId != null) {
      this.cifFormGroup.get('fullName').setValue(process.fullName);
      this.cifFormGroup.get('gender').setValue(process.gender);
      this.cifFormGroup.get('birthday').setValue(process.getBirthDayEdit());
      this.cifFormGroup.get('birthPlace').setValue(process.bornOfPlace);
      this.cifFormGroup.get('identificationType').setValue(process.perDocType);
      this.cifFormGroup.get('verificationPaper').setValue(process.perDocNo);
      this.cifFormGroup.get('perDocType').setValue(process.perDocType);
      this.cifFormGroup.get('perDocNo').setValue(process.perDocNo);
      this.cifFormGroup.get('issuedDate').setValue(process.getIssueDateEdit());
      this.cifFormGroup.get('issuedPlace').setValue(process.issuePlace);
      this.cifFormGroup.get('expiredDate').setValue(process.getExpireDateEdit());
      this.cifFormGroup.get('mobilePhone').setValue(process.mobilePhone);
      this.cifFormGroup.get('hasResident').setValue(process.residence ? '1' : '2');
      this.cifFormGroup.get('job').setValue(process.industry);
      this.cifFormGroup.get('jobTitle').setValue(process.position);
      this.cifFormGroup.get('employeeId').setValue(process.employeeId);
      this.cifFormGroup.get('cifKH78').setValue(process.cifKH78);
      this.cifFormGroup.get('branch').setValue(process.branchCode);
      this.cifFormGroup.get('cifMANKT').setValue(process.cifMANKT);
      this.cifFormGroup.get('maritalStatus').setValue(process.maritalStatus);
      this.cifFormGroup.get('workPhone').setValue(process.workPhone);
      this.cifFormGroup.get('academicLevel').setValue(process.education);
      this.cifFormGroup.get('homePhone').setValue(process.homePhone);
      this.cifFormGroup.get('nationality').setValue(process.nationalityCode);
      this.cifFormGroup.get('socialNetwork').setValue(process.socialNetwork);
      this.cifFormGroup.get('useOverDraft').setValue(process.usingOverdraft);
      this.cifFormGroup.get('salary').setValue(process.income);
      this.cifFormGroup.get('freeVisa').setValue(process.freeVisa);
      // this.cifFormGroup.get('freeVisa').setValue(process.visaIssueDate)
      // this.cifFormGroup.get('freeVisa').setValue(process.visaExpireDate)
      this.cifFormGroup.get('receiveSalaryFromLpb').setValue(process.salaryInBank);
      this.cifFormGroup.get('personalIncomeTax').setValue(process.personalIncomeTax);
      this.cifFormGroup.get('currentCountry').setValue(process.ccountryCode);
      this.cifFormGroup.get('currentProvince').setValue(process.ccityCode);
      this.cifFormGroup.get('currentDistrict').setValue(process.cdistrictCode);
      this.cifFormGroup.get('currentWards').setValue(process.cwardCode);
      this.cifFormGroup.get('currentAddress').setValue(process.cstreetNumber);
      this.cifFormGroup.get('permanentCountry').setValue(process.nationalityCode);
      this.cifFormGroup.get('permanentProvince').setValue(process.rcityCode);
      this.cifFormGroup.get('permanentDistrict').setValue(process.rdistrictCode);
      this.cifFormGroup.get('permanentWards').setValue(process.rwardCode);
      this.cifFormGroup.get('permanentAddress').setValue(process.rstreetNumber);
    }
  }
  cifFieldToValidate: string[] = [
    'fullName',
    'gender',
    // 'verificationPaper',
    'perDocType',
    'perDocNo',
    // 'identificationType',
    'issuedDate',
    'issuedPlace',
    'expiredDate',
    'mobilePhone',
    'birthday',
    'birthPlace',
    'hasResident',
    'job',
    'jobTitle',
    'employeeId',
    'branch',
    'currentCountry',
    'currentProvince',
    'currentDistrict',
    'currentWards',
    'currentAddress',
    'permanentCountry',
    'permanentProvince',
    'permanentDistrict',
    'permanentWards',
    'permanentAddress',
    // 'cifKH78',
    // 'cifMANKT',
  ];

  cifFormGroup: FormGroup = new FormGroup({
    fullName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(35)])),
    gender: new FormControl('', Validators.required),
    verificationPaper: new FormControl(''),
    perDocNo: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50)])),
    identificationType: new FormControl(''),
    perDocType: new FormControl('', Validators.required),
    issuedDate: new FormControl('', Validators.compose([Validators.required, futureDate])),
    issuedPlace: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),
    expiredDate: new FormControl('', Validators.compose([Validators.required, pastDate])),
    mobilePhone: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    birthday: new FormControl('', Validators.compose([Validators.required, futureDate])),
    birthPlace: new FormControl(null, Validators.compose([Validators.required, Validators.maxLength(200)])),
    hasResident: new FormControl('', Validators.required),
    job: new FormControl(null, Validators.required),
    jobTitle: new FormControl('', Validators.required),
    cifKH78: new FormControl('', Validators.required),
    cifMANKT: new FormControl('', Validators.required),
    employeeId: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
    maritalStatus: new FormControl(''),
    branch: new FormControl(null, Validators.required),
    academicLevel: new FormControl(''),
    email: new FormControl('', [Validators.maxLength(100), Validators.email,
    Validators.pattern('^[a-z][a-z0-9_\.]{3,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$')
    ]),
    workPhone: new FormControl(''),
    homePhone: new FormControl(''),
    socialNetwork: new FormControl(''),
    // sector: new FormControl(''),
    salary: new FormControl(null),
    nationality: new FormControl('VN'),
    freeVisa: new FormControl(''),
    visaExpireDate: new FormControl(''),
    visaIssueDate: new FormControl(''),
    useOverDraft: new FormControl(''),
    receiveSalaryFromLpb: new FormControl(''),
    personalIncomeTax: new FormControl(''),

    currentCountry: new FormControl('VN', Validators.required),
    currentProvince: new FormControl(null, Validators.required),
    currentDistrict: new FormControl(null, Validators.required),
    currentWards: new FormControl(null, Validators.required),
    currentAddress: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),

    permanentCountry: new FormControl('VN', Validators.required),
    permanentProvince: new FormControl(null, Validators.required),
    permanentDistrict: new FormControl(null, Validators.required),
    permanentWards: new FormControl(null, Validators.required),
    permanentAddress: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(200)])),
    fatcaW9: new FormControl(''),
    fatcaW8: new FormControl(''),
    openNewAccount: new FormControl(''),
    openCardService: new FormControl(''),
  }, {
    validators: [
      Bigger3Date('birthday', 'issuedDate', 'expiredDate')
    ]
  });

  setFormData(process: DetailProcess): void {
    if (process && process.processId !== '' && process.processId !== undefined) {
      this.cifFormGroup.get('fullName').setValue(process.fullName);
      this.cifFormGroup.get('gender').setValue(process.gender);
      this.cifFormGroup.get('birthday').setValue(process.getBirthDayEdit());
      this.cifFormGroup.get('birthPlace').setValue(process.bornOfPlace);
      this.cifFormGroup.get('identificationType').setValue(process.perDocType);
      this.cifFormGroup.get('verificationPaper').setValue(process.perDocNo);
      this.cifFormGroup.get('perDocType').setValue(process.perDocType);
      this.cifFormGroup.get('perDocNo').setValue(process.perDocNo);
      this.cifFormGroup.get('issuedDate').setValue(process.getIssueDateEdit());
      this.cifFormGroup.get('issuedPlace').setValue(process.issuePlace);
      this.cifFormGroup.get('expiredDate').setValue(process.getExpireDateEdit());
      this.cifFormGroup.get('mobilePhone').setValue(process.mobilePhone);
      this.cifFormGroup.get('email').setValue(process.email);
      this.cifFormGroup.get('hasResident').setValue(process.residence ? '1' : '2');
      this.cifFormGroup.get('job').setValue(process.industry);
      this.cifFormGroup.get('jobTitle').setValue(process.position);
      this.cifFormGroup.get('employeeId').setValue('TODO123');
      this.cifFormGroup.get('employeeId').setValue(process.employeeId);
      this.cifFormGroup.get('cifKH78').setValue(process.cifKH78);
      this.cifFormGroup.get('branch').setValue(process.branchCode);
      this.cifFormGroup.get('cifMANKT').setValue(process.cifMANKT);
      this.cifFormGroup.get('maritalStatus').setValue(process.maritalStatus);
      this.cifFormGroup.get('workPhone').setValue(process.workPhone);
      this.cifFormGroup.get('academicLevel').setValue(process.education);
      this.cifFormGroup.get('homePhone').setValue(process.homePhone);
      this.cifFormGroup.get('nationality').setValue(process.nationalityCode);
      this.cifFormGroup.get('socialNetwork').setValue(process.socialNetwork);
      this.cifFormGroup.get('useOverDraft').setValue(process.usingOverdraft);
      this.cifFormGroup.get('salary').setValue(process.income);
      this.cifFormGroup.get('freeVisa').setValue(process.getVisa());
      if (process.freeVisa != null && process.freeVisa === true) {
        this.cifFormGroup.get('visaIssueDate').setValue(process.getEditDate(process.visaIssueDate));
        this.cifFormGroup.get('visaExpireDate').setValue(process.getEditDate(process.visaExpireDate));
      }
      this.cifFormGroup.get('receiveSalaryFromLpb').setValue(process.salaryInBank);
      this.cifFormGroup.get('personalIncomeTax').setValue(process.personalIncomeTax);
      this.cifFormGroup.get('currentCountry').setValue(process.ccountryCode);
      this.cifFormGroup.get('currentProvince').setValue(process.ccityCode);
      this.cifFormGroup.get('currentDistrict').setValue(process.cdistrictCode);
      this.cifFormGroup.get('currentWards').setValue(process.cwardCode);
      this.cifFormGroup.get('currentAddress').setValue(process.cstreetNumber);
      this.cifFormGroup.get('permanentCountry').setValue(process.nationalityCode);
      this.cifFormGroup.get('permanentProvince').setValue(process.rcityCode);
      this.cifFormGroup.get('permanentDistrict').setValue(process.rdistrictCode);
      this.cifFormGroup.get('permanentWards').setValue(process.rwardCode);
      this.cifFormGroup.get('permanentAddress').setValue(process.rstreetNumber);
    }
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }
}

// tslint:disable-next-line:class-name
export class cifFormValidator {
  fullName: boolean;
  gender: boolean;
  nationality: boolean;
  verificationPaper: boolean;
  identificationType: boolean;

  visaIssueDate: boolean;
  visaExpireDate: boolean;

  perDocNo: boolean;
  perDocType: boolean;
  issuedDate: boolean;
  issuedPlace: boolean;
  expiredDate: boolean;

  perDocNo2: boolean;
  perDocType2: boolean;
  issuedDate2: boolean;
  issuedPlace2: boolean;
  expiredDate2: boolean;

  perDocNo3: boolean;
  perDocType3: boolean;
  issuedDate3: boolean;
  issuedPlace3: boolean;
  expiredDate3: boolean;

  mobilePhone: boolean;
  birthday: boolean;
  birthPlace: boolean;
  hasResident: boolean;
  job: boolean;
  jobTitle: boolean;
  cifKH78: boolean;
  cifMANKT: boolean;
  employeeId: boolean;
  branch: boolean;
  currentCountry: boolean;
  currentProvince: boolean;
  currentDistrict: boolean;
  currentWards: boolean;
  currentAddress: boolean;
  permanentCountry: boolean;
  permanentProvince: boolean;
  permanentDistrict: boolean;
  permanentWards: boolean;
  permanentAddress: boolean;


  getFormValidator(): boolean {
    return !this.fullName &&
      !this.gender &&
      // !this.verificationPaper &&
      // !this.identificationType &&

      !this.visaIssueDate &&
      !this.visaExpireDate &&
      !this.perDocNo &&
      !this.perDocType &&
      !this.issuedDate &&
      !this.issuedPlace &&
      !this.expiredDate &&

      !this.perDocNo2 &&
      !this.perDocType2 &&
      !this.issuedDate2 &&
      !this.issuedPlace2 &&
      !this.expiredDate2 &&

      !this.perDocNo3 &&
      !this.perDocType3 &&
      !this.issuedDate3 &&
      !this.issuedPlace3 &&
      !this.expiredDate3 &&

      !this.mobilePhone &&
      !this.birthday &&
      !this.birthPlace &&
      !this.hasResident &&
      !this.job &&
      !this.jobTitle &&
      !this.nationality &&
      // !this.cifKH78 &&
      // !this.cifMANKT &&
      !this.employeeId &&
      // !this.branch &&
      !this.currentCountry &&
      !this.currentProvince &&
      !this.currentDistrict &&
      !this.currentWards &&
      !this.currentAddress &&
      !this.permanentCountry &&
      !this.permanentProvince &&
      !this.permanentDistrict &&
      !this.permanentWards &&
      !this.permanentAddress;
  }
}

export class UniValidator {
  valid: boolean;
  message: string;

  constructor(valid: boolean, message: string) {
    this.valid = valid;
    this.message = message;
  }
}

export class CifCondition {
  approveBy: number;
  branchCode: string;
  code: string;
  createdDate: string;
  inputDateMin: string;
  inputDateMax: string;
  customerCode: number;
  customerTypeCode: string;
  regisType: string;
  fullName: string;
  id: any;
  inputBy: string;
  inputter: string;
  isSlaFailed: boolean;
  mobilePhone: string;
  page: number;
  perDocNo: string;
  size: number;
  statusId: string;
  statusCode: any;

  constructor(page: number = 1,
              size: number = 10,
              approveBy: number = null,
              branchCode: string = null,
              code: string = null,
              createdDate: string = null,
              inputDateFrom: string = null,
              inputDateTo: string = null,
              customerCode: number = null,
              customerTypeCode: string = null,
              fullName: string = null,
              id: string = null,
              inputBy: string = null,
              inputter: string = null,
              isSlaFailed: boolean = null,
              mobilePhone: string = null,
              perDocNo: string = null,
              statusId: string = null,
              regisType: string = null,
  ) {
    this.page = page;
    this.size = size;
    this.approveBy = approveBy;
    this.branchCode = branchCode;
    this.code = code;
    this.createdDate = createdDate;
    this.inputDateMin = inputDateFrom;
    this.inputDateMax = inputDateTo;
    this.customerCode = customerCode;
    this.customerTypeCode = customerTypeCode;
    this.fullName = fullName;
    this.id = id;
    this.inputBy = inputBy;
    this.inputter = inputter;
    this.isSlaFailed = isSlaFailed;
    this.mobilePhone = mobilePhone;
    this.perDocNo = perDocNo;
    this.statusId = statusId;
    this.regisType = regisType;
  }

  setCreatedDate(date): void {
    this.createdDate = date !== '' ? date + 'T00:00:00' : null;
  }

  setFormatDate(date): string {
    return date !== '' ? date + 'T00:00:00' : null;
    // return date != '' ? date  : null
  }

  dateCreatedValidator(): UniValidator {
    const start = moment(new Date(this.inputDateMin));
    const end = moment(new Date(this.inputDateMax));
    const now = moment(new Date(moment().format('yyyy-MM-DD')));
    const condStart = start.diff(now, 'day');
    const condEnd = end.diff(now, 'day');
    const cond = end.diff(start, 'day');

    if (!start.isValid() && !end.isValid()) {
      return new UniValidator(false, 'Ngày bắt đầu và ngày kết thúc không hợp lệ');
    } else if (!start.isValid()) {
      return new UniValidator(false, 'Ngày bắt đầu không hợp lệ');
    } else if (!end.isValid()) {
      return new UniValidator(false, 'Ngày kết thúc không hợp lệ');
    } else {
      if (cond >= 0) {
        if (condStart > 0 && condEnd > 0) {
          return new UniValidator(false, 'Ngày bắt đầu và ngày kết thúc không được là ngày tương lai');
        } else if (condStart > 0) {
          return new UniValidator(false, 'Ngày bắt đầu không được là ngày tương lai');
        } else if (condEnd > 0) {
          return new UniValidator(false, 'Ngày kết thúc không được là ngày tương lai');
        } else {
          // ngay bat dau va ngay ket thuc la ngay hien tai
          if (this.inputDateMax != null && this.inputDateMax !== '' && this.inputDateMin != null && this.inputDateMin !== '') {
            if (cond > 366) {
              return new UniValidator(false, 'Giới hạn tìm kiếm trong 1 năm');
            } else { return new UniValidator(true, ''); }
          } else { return new UniValidator(true, ''); }
        }
      } else {
        if (condStart > 0 && condEnd > 0) {
          return new UniValidator(false, 'Ngày bắt đầu và ngày kết thúc không được là ngày tương lai');
        } else if (condStart > 0) {
          return new UniValidator(false, 'Ngày bắt đầu không được là ngày tương lai');
        } else if (condEnd > 0) {
          return new UniValidator(false, 'Ngày kết thúc không được là ngày tương lai');
        } else {
          if (this.inputDateMax != null && this.inputDateMax !== '' && this.inputDateMin != null && this.inputDateMin !== '') {
            return new UniValidator(false, 'Ngày bắt đầu đang lớn hơn ngày kết thúc');
          } else { return new UniValidator(true, ''); }
        }
      }
    }
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }
}

export class LstCifProcess {
  page: number;
  size: number;
  code: string;
  branchCode: string;
  branchName: string;
  lastNode: string;
  statusCode: string;
  statusName: string;
  inputDate: any;
  inputBy: string;
  inputByUserName: string;
  inputByFullName: string;
  inputByUserCore: string;
  approveBy: string;
  approveByUserName: string;
  approveByFullName: string;
  approveByUserCore: string;
  createdDate: any;
  createdBy: string;
  createdByUserName: string;
  createdByFullName: string;
  createdByUserCore: string;
  modifiedDate: any;
  modifiedBy: string;
  modifiedByUserName: string;
  modifiedByFullName: string;
  modifiedByUserCore: string;
}

export class CustomerStatus {
  id: string;
  code: string;
  name: string;
  description: string;
  displayPriority: string;
  statusCode: string;
  statusName: string;

  constructor( id: string = null,
              code: string  = null,
              name: string  = null,
              description: string  = null,
              displayPriority: string= null,
              statusCode: string = null,
              statusName: string = null
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.displayPriority = displayPriority;
    this.statusCode= statusCode;
    this.statusName = statusName;
  }
}


export class CifCondition1 {
  page?: number;
  size?: number;
  code?: string;
//  approveBy: string;
  branchCode?: string;
  customerCode?: number;
  customerTypeCode?: string;
  fullName?: string;
  perDocNo?: string;
  statusCode?: any;
  inputDate?: string;
  inputDateMin?: string;
  inputDateMax?: string;
  inputBy?: string;
  modifiedBy?: string;
  statusCif?: any; 
  typeService?: any;
  statusService?: any;
  
  

  constructor(page: number = 1,
              size: number = 10,
              branchCode: string = null,
              code: string = null,
              inputDateFrom: string = null,
              inputDateTo: string = null,
              customerCode: number = null,
              customerTypeCode: string = null,
              fullName: string = null,
              inputBy: string = null,
              perDocNo: string = null,
              statusCif: any = null,
              statusService: any = null,
              typeService: any = null,
              modifiedBy: string = null
  ) {
    this.page = page;
    this.size = size;
    
    this.branchCode = branchCode;
    this.code = code;
    
    this.inputDateMin = inputDateFrom;
    this.inputDateMax = inputDateTo;
    this.customerCode = customerCode;
    this.customerTypeCode = customerTypeCode;
    this.fullName = fullName;
   
    this.inputBy = inputBy;
    
   
  
    this.perDocNo = perDocNo;
  
    this.statusCif = statusCif;
    this.statusService = statusService;
    this.typeService = typeService;
    this.modifiedBy = modifiedBy;
  }

  

  // setCreatedDate(date): void {
  //   this.inputDate = date !== '' ? date + 'T00:00:00' : null;
  // }

  setFormatDate(date): string {
    return date !== '' ? date + 'T00:00:00' : null;
    // return date != '' ? date  : null
  }

  dateCreatedValidator(): UniValidator {
    const start = moment(new Date(this.inputDateMin));
    const end = moment(new Date(this.inputDateMax));
    const now = moment(new Date(moment().format('yyyy-MM-DD')));
    const condStart = start.diff(now, 'day');
    const condEnd = end.diff(now, 'day');
    const cond = end.diff(start, 'day');

    if (!start.isValid() && !end.isValid()) {
      return new UniValidator(false, 'Ngày bắt đầu và ngày kết thúc không hợp lệ');
    } else if (!start.isValid()) {
      return new UniValidator(false, 'Ngày bắt đầu không hợp lệ');
    } else if (!end.isValid()) {
      return new UniValidator(false, 'Ngày kết thúc không hợp lệ');
    } else {
      if (cond >= 0) {
        if (condStart > 0 && condEnd > 0) {
          return new UniValidator(false, 'Ngày bắt đầu và ngày kết thúc không được là ngày tương lai');
        } else if (condStart > 0) {
          return new UniValidator(false, 'Ngày bắt đầu không được là ngày tương lai');
        } else if (condEnd > 0) {
          return new UniValidator(false, 'Ngày kết thúc không được là ngày tương lai');
        } else {
          // ngay bat dau va ngay ket thuc la ngay hien tai
          if (this.inputDateMax != null && this.inputDateMax !== '' && this.inputDateMin != null && this.inputDateMin !== '') {
            if (cond > 366) {
              return new UniValidator(false, 'Giới hạn tìm kiếm trong 1 năm');
            } else { return new UniValidator(true, ''); }
          } else { return new UniValidator(true, ''); }
        }
      } else {
        if (condStart > 0 && condEnd > 0) {
          return new UniValidator(false, 'Ngày bắt đầu và ngày kết thúc không được là ngày tương lai');
        } else if (condStart > 0) {
          return new UniValidator(false, 'Ngày bắt đầu không được là ngày tương lai');
        } else if (condEnd > 0) {
          return new UniValidator(false, 'Ngày kết thúc không được là ngày tương lai');
        } else {
          if (this.inputDateMax != null && this.inputDateMax !== '' && this.inputDateMin != null && this.inputDateMin !== '') {
            return new UniValidator(false, 'Ngày bắt đầu đang lớn hơn ngày kết thúc');
          } else { return new UniValidator(true, ''); }
        }
      }
    }
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }
}
