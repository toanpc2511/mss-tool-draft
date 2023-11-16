import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DetailProcess } from 'src/app/_models/process';
import { MissionService } from 'src/app/services/mission.service';
import { ProcessService } from 'src/app/_services/process.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { AuthorExpireAndAuthorType, CategoryAuthority } from '../../_models/category/categoryList';
import { CategoryAuthorityService } from 'src/app/_services/category/category.authority.service';
import { ValidatorSpace } from 'src/app/_validator/otp.validator';
import { AccountService } from 'src/app/_services/account.service';
import { AuthorityAccountService } from 'src/app/_services/authority-account.service';
import { AccountModel } from 'src/app/_models/account';
import { AuthorityModel, AuthorizationScope } from 'src/app/_models/authority';
import { ConstantUtils } from 'src/app/_utils/_constant';
import * as moment from 'moment';
import { BiggerDate, futureDate, pastDate } from 'src/app/_validator/cif.register.validator';
import { forkJoin, from } from 'rxjs';
declare var $: any;
@Component({
  selector: 'app-update-authority',
  templateUrl: './update-authority.component.html',
  styleUrls: ['./update-authority.component.scss']
})
export class UpdateAuthorityComponent implements OnInit {
  // updateAuthorityForm: FormGroup;
  submitted = false;
  processId: any;
  accountId: any;
  id: any;
  detailProcess: DetailProcess = new DetailProcess(null);
  categories: CategoryAuthority = new CategoryAuthority();
  lstAuthorType: AuthorExpireAndAuthorType[];
  lstAuthorExpire: AuthorExpireAndAuthorType[];
  objAccount: AccountModel = new AccountModel();
  numberAccount: any;
  objAuthority: AuthorityModel = new AuthorityModel();
  objUpdateAuthority: AuthorityModel = new AuthorityModel();
  radioCheck: any;
  constant: ConstantUtils = new ConstantUtils();
  valueOrther: any;
  isChecked: boolean;
  limitValue: any;
  booleanOrther: boolean;
  booleanLimitValue: boolean;
  orderPVUQ: any[] = [];
  booleanPVUQ: boolean;
  // radioCheckExpire: any;
  checkBoxTrue: boolean;
  birthDate: any;
  issueDate: any;
  startDate: any;
  endDate: any;
  disableFromdate: boolean;
  disableTodate: boolean;
  booleanChangeQT1: boolean;
  booleanChangeQT2: boolean;
  booleanChangeQT3: boolean;
  booleanChangeQT4: boolean;
  nationCode: string;
  national1 = false;
  nationalCode1Str: string;
  national2 = false;
  nationalCode2Str: string;
  national3 = false;
  nationalCode3Str: string;
  lstCountries: any[] = [];
  expireAuthorCode: string;
  booleanNull2: boolean;
  booleanNull3: boolean;
  booleanNull4: boolean;
  booleanValidForm: boolean;
  booleanValidTo: boolean;
  booleanDateForm: boolean;
  addStr = '';
  booleanDateOfbirth: boolean;
  booleanDateProvided: boolean;
  booleanDateProvidedLessDateOfbirth: boolean;
  numberGTXM: any;
  returnValueCode: string;
  updatAuthorExprise = true;
  fDate: any;
  tDate: any;
  disableForm = false;
  noicap: any = [
    {
      name: 'ĐKQL CƯ TRÚ VÀ DLQG VỀ DÂN CƯ'
    },
    {
      name: 'QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI'
    }

  ];
  EMAIL_REGEX = '^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$';
  updateAuthorityForm = new FormGroup({
    fullName: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    typeGTXM: new FormControl('', [Validators.required]),
    numberGTXM: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    dateProvided: new FormControl('', Validators.required),
    placeProvided: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    regency: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    gender: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    nationality: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    email: new FormControl(null, Validators.pattern(this.EMAIL_REGEX)),
    job: new FormControl('', Validators.required),
    currentCountry: new FormControl(null, Validators.required),
    permanentCountry: new FormControl(null, Validators.required),
    currentProvince: new FormControl(null, Validators.required),
    permanentProvince: new FormControl(null, Validators.required),
    currentDistrict: new FormControl(null, Validators.required),
    permanentDistrict: new FormControl(null, Validators.required),
    currentWards: new FormControl(null, Validators.required),
    permanentWards: new FormControl(null, Validators.required),
    currentAddress: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    permanentAddress: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    visaExemption: new FormControl(true),
    visaIssueDate: new FormControl(''),
    visaExpireDate: new FormControl(''),
    expireAuthorCode: new FormControl(''),
    validFrom: new FormControl('', Validators.required),
    validTo: new FormControl(''),
  });
  @Output() dateOnInput: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private router: Router, private cifService: ProcessService, private fb: FormBuilder,
    private errorHandler: ErrorHandlerService,
    private notificationService: NotificationService,
    private category: CategoryAuthorityService,
    private route: ActivatedRoute, private _LOCATION: Location, private missionService: MissionService,
    private accountService: AccountService,
    private authorityService: AuthorityAccountService,
    private datePipe: DatePipe, private el: ElementRef) {
  }
  ngOnInit(): void {
    $('.childName').html('Cập nhật ủy quyền');
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    this.id = this.route.snapshot.paramMap.get('id');
    this.getDataSelect();
    this.getDetailAccount(this.accountId);
    this.getDetailAuthority(this.id);
    this.visaExemptionDate();
    this.disableAddress();
    this.disnableAuthorExpire();
    // this.setDisableForm()
  }

  setDisableForm(status: string): void {
    const dis = [
      'phoneNumber',
      'email',
      'job',
      'nationality',
      'currentCountry',
      'permanentCountry',
      'currentProvince',
      'permanentProvince',
      'currentDistrict',
      'permanentDistrict',
      'currentWards',
      'permanentWards',
      'currentAddress',
      'permanentAddress',
      'visaExemption',
      'visaIssueDate',
      'visaExpireDate',
      'expireAuthorCode',
      'validFrom',
      'validTo',
    ];
    if (status === 'ACTIVE') {
      dis.forEach((e) => {
        this.updateAuthorityForm.controls[e].disable();
      });
      this.disableForm = true;
    }
  }
  getDetailAccount(id: any): void {
    const obj = {};
    // tslint:disable-next-line: no-string-literal
    obj['id'] = id;
    this.accountService.getDetailAccount(obj).subscribe(data => {
      this.objAccount = data.item;
      if (this.objAccount.accountIndex !== null && this.objAccount.accountNumber === null) {
        this.numberAccount = 'Tài khoản mới ' + this.objAccount.accountIndex;
      } else if (this.objAccount.accountIndex !== null && this.objAccount.accountNumber !== null) {
        this.numberAccount = this.objAccount.accountNumber;
      }
    });
  }
  addNationality(): void {
    this.submitted = false;
    if (!this.national1) {
      this.national1 = true;
      this.booleanNull2 = true;
    } else if (!this.national2) {
      this.national2 = true;
      this.booleanNull3 = true;
    } else if (!this.national3) {
      this.national3 = true;
      this.booleanNull4 = true;
    }
  }

  changeNational(idx: any): void {
    const valueNation = this.updateAuthorityForm.get('nationality').value;
    const rsValueNation = valueNation !== null ? valueNation : undefined;
    const rsNationalCode1 = this.nationalCode1Str !== null ? this.nationalCode1Str : undefined;
    const rsNationalCode2 = this.nationalCode2Str !== null ? this.nationalCode2Str : undefined;
    const rsNationalCode3 = this.nationalCode3Str !== null ? this.nationalCode3Str : undefined;
    if (idx === 1) {
      this.booleanChangeQT1 = (rsValueNation === rsNationalCode1 && rsNationalCode1 !== undefined)
        || (rsValueNation === rsNationalCode2 && rsNationalCode2 !== undefined) ||
        (rsValueNation === rsNationalCode3 && rsNationalCode3 !== undefined) ? true : false;
    } else if (idx === 2) {
      this.booleanChangeQT2 = (rsNationalCode1 === rsValueNation && rsValueNation !== undefined) ||
        (rsNationalCode1 === rsNationalCode2 && rsNationalCode2 !== undefined) ||
        (rsNationalCode1 === rsNationalCode3 && rsNationalCode3 !== undefined) ? true : false;
      this.booleanNull2 = rsNationalCode1 === undefined ? true : false;
    } else if (idx === 3) {
      this.booleanChangeQT3 = (rsNationalCode2 === rsValueNation && rsValueNation !== undefined) ||
        (rsNationalCode2 === rsNationalCode1 && rsNationalCode1 !== undefined) ||
        (rsNationalCode2 === rsNationalCode3 && rsNationalCode3 !== undefined) ? true : false;
      this.booleanNull3 = rsNationalCode2 === undefined ? true : false;
    } else if (idx === 4) {
      this.booleanChangeQT4 = (rsNationalCode3 === rsValueNation && rsValueNation !== undefined) ||
        (rsNationalCode3 === rsNationalCode1 && rsNationalCode1 !== undefined) ||
        (rsNationalCode3 === rsNationalCode2 && rsNationalCode2 !== undefined) ? true : false;
      this.booleanNull4 = rsNationalCode3 === undefined ? true : false;
    }
  }
  removeNationality(idx: any): void {
    if (idx === 1) {
      this.national1 = false;
      this.nationalCode1Str = null;
    } else if (idx === 2) {
      this.national2 = false;
      this.nationalCode2Str = null;
    } else {
      this.national3 = false;
      this.nationalCode3Str = null;
    }
  }
  checkValue(event: any, idx: any, item: any): void {
    if (event.target.checked) {
      const obj = {};
      if (item.code === this.constant.DEPOSIT_AND_WITHDRAW) {
        this.isChecked = true;
      } else if (item.code === this.constant.OTHER) {
        this.booleanOrther = true;
      }
      // tslint:disable-next-line: no-string-literal
      obj['code'] = item.code;
      this.orderPVUQ.push(obj);
    } else {
      let returnCheckCode: boolean;
      for (let index = 0; index < this.orderPVUQ.length; index++) {
        if (this.orderPVUQ[index].code === item.code) {
          this.orderPVUQ.splice(index, 1);
          break;
        }
      }
      if (item.code === this.constant.DEPOSIT_AND_WITHDRAW || item.code === this.constant.ALL) {
        for (const index of this.orderPVUQ) {
          if (this.orderPVUQ[index].code === this.constant.DEPOSIT_AND_WITHDRAW || this.orderPVUQ[index].code === this.constant.ALL) {
            returnCheckCode = true;
            break;
          } else {
            returnCheckCode = false;
          }
        }
        if (!returnCheckCode) {
          this.isChecked = false;
          this.booleanLimitValue = false;
        }
      } else if (item.code === this.constant.OTHER) {
        this.booleanOrther = false;
      }
    }
    if (this.orderPVUQ.length === 0) {
      this.booleanPVUQ = true;
    } else {
      this.booleanPVUQ = false;
    }
  }
  getDetailAuthority(id: any): void {
    const obj = {};
    // tslint:disable-next-line: no-string-literal
    obj['id'] = id;
    this.authorityService.getDetailAuthority(obj).subscribe(rs => {
      // tslint:disable-next-line: no-string-literal
      this.objAuthority = rs['item'];
      console.log(this.objAuthority);
      this.lstCountries = this.categories.countries;
      this.updateAuthorityForm.get('typeGTXM').setValue(this.objAuthority.perDocTypeName);
      this.updateAuthorityForm.get('fullName').setValue(this.objAuthority.fullName);
      this.updateAuthorityForm.get('gender').setValue(this.objAuthority.genderCode);
      this.updateAuthorityForm.get('job').setValue(this.objAuthority.industry);
      this.updateAuthorityForm.get('email').setValue(this.objAuthority.email);
      this.updateAuthorityForm.get('currentCountry').setValue(this.objAuthority.currentCountryCode);
      this.updateAuthorityForm.get('currentAddress').setValue(this.objAuthority.currentStreetNumber);
      this.updateAuthorityForm.get('currentProvince').setValue(this.objAuthority.currentCityName);
      this.getCurrentDistrictsByCityCodeHT();
      this.updateAuthorityForm.get('nationality').setValue(this.objAuthority.nationality1Code);
      this.nationalCode1Str = this.objAuthority.nationality2Code;
      this.nationalCode2Str = this.objAuthority.nationality3Code;
      this.nationalCode3Str = this.objAuthority.nationality4Code;
      this.national1 = this.objAuthority.nationality2Code !== null ? true : false;
      this.national2 = this.objAuthority.nationality3Code !== null ? true : false;
      this.national3 = this.objAuthority.nationality4Code !== null ? true : false;
      this.updateAuthorityForm.get('permanentCountry').setValue(this.objAuthority.residenceCountryCode);
      this.updateAuthorityForm.get('permanentAddress').setValue(this.objAuthority.residenceStreetNumber);
      this.updateAuthorityForm.get('permanentProvince').setValue(this.objAuthority.residenceCityName);
      this.getCurrentDistrictsByCityCodeTT();
      this.checkBoxTrue = (this.objAuthority.currentCountryCode === this.objAuthority.residenceCountryCode)
        && (this.objAuthority.currentCityCode === this.objAuthority.residenceCityCode) &&
        (this.objAuthority.currentDistrictCode === this.objAuthority.residenceDistrictCode) &&
        (this.objAuthority.currentWardCode === this.objAuthority.residenceWardCode) &&
        (this.objAuthority.currentStreetNumber === this.objAuthority.residenceStreetNumber) ? true : undefined;
      this.updateAuthorityForm.get('numberGTXM').setValue(this.objAuthority.perDocNo);
      this.numberGTXM = this.objAuthority.perDocNo;
      const newBirthDate = this.objAuthority.birthDate !== null ? new Date(this.objAuthority.birthDate) : null;
      this.birthDate = newBirthDate !== null ? this.datePipe.transform(newBirthDate, 'yyyy-MM-dd') : null;
      this.updateAuthorityForm.get('dateOfBirth').setValue(this.birthDate);
      const newIssueDate = this.objAuthority.issueDate !== null ? new Date(this.objAuthority.issueDate) : null;
      this.issueDate = newIssueDate !== null ? this.datePipe.transform(newIssueDate, 'yyyy-MM-dd') : null;
      this.updateAuthorityForm.get('dateProvided').setValue(this.issueDate);
      const newDateFrom = this.objAuthority.validFrom !== null ? new Date(this.objAuthority.validFrom) : null;
      this.startDate = newDateFrom !== null ? this.datePipe.transform(newDateFrom, 'yyyy-MM-dd') : null;
      const newDateTo = this.objAuthority.validTo !== null ? new Date(this.objAuthority.validTo) : null;
      this.endDate = newDateTo !== null ? this.datePipe.transform(newDateTo, 'yyyy-MM-dd') : null;
      this.updateAuthorityForm.get('placeProvided').setValue(this.objAuthority.issuePlace);
      this.updateAuthorityForm.get('phoneNumber').setValue(this.objAuthority.mobilePhone);
      this.radioCheck = this.objAuthority.residence === true ? true : false;
      this.updateAuthorityForm.get('regency').setValue(this.objAuthority.position);
      this.updateAuthorityForm.get('visaExemption').setValue(this.objAuthority.visaExemption);
      this.updateAuthorityForm.get('visaIssueDate').setValue(this.objAuthority.visaIssueDate);
      this.updateAuthorityForm.get('visaExpireDate').setValue(this.objAuthority.visaExpireDate);
      if (this.lstAuthorType !== undefined) {
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < this.objAuthority.authorTypes.length; index++) {
          this.returnCheckBox(this.objAuthority.authorTypes[index]);
          if (this.objAuthority.authorTypes[index].authorTypeCode === this.constant.OTHER) {
            this.booleanOrther = true;
            this.valueOrther = this.objAuthority.authorTypes[index].authorTypeFreeText;
          } else if (this.objAuthority.authorTypes[index].authorTypeCode === this.constant.DEPOSIT_AND_WITHDRAW ||
            this.objAuthority.authorTypes[index].authorTypeCode === this.constant.ALL) {
            this.isChecked = true;
            this.onBlurMethod(this.objAuthority.authorTypes[index].limitAmount);
          }
        }
      }
      this.updateAuthorityForm.get('expireAuthorCode').setValue(this.objAuthority.expireAuthorCode);
      this.updateAuthorityForm.get('validFrom').setValue(newDateFrom);
      this.updateAuthorityForm.get('validTo').setValue(newDateTo);
      this.disnableAuthorExpire();
      this.setDisableForm(this.objAuthority.currentStatusCode);
      // if (this.lstAuthorExpire !== undefined) {

      //   // tslint:disable-next-line: prefer-for-of
      //   for (let index = 0; index < this.lstAuthorExpire.length; index++) {
      //     if (this.objAuthority.expireAuthorCode === this.ls c tAuthorExpire[index].code) {
      //       // tslint:disable-next-line: no-string-literal
      //       this.lstAuthorExpire[index]['checked'] = true;
      //       this.expireAuthorCode = this.objAuthority.expireAuthorCode;
      //       // this.radioCheckExpire = true
      //     }
      //     if (this.objAuthority.expireAuthorCode === this.constant.ONE) {
      //       this.disableTodate = false;
      //       this.disableFromdate = true;
      //       this.returnValueCode = this.constant.ONE;
      //     } else if (this.objAuthority.expireAuthorCode === this.constant.VALID_TIME_RANGE) {
      //       this.disableTodate = true;
      //       this.disableFromdate = true;
      //     } else {
      //       this.disableTodate = false;
      //       this.disableFromdate = true;
      //     }
      //   }
      // }

    });
  }
  get getCurrentCountry(): AbstractControl { return this.updateAuthorityForm.get('currentCountry'); }
  get getPermanentCountry(): AbstractControl { return this.updateAuthorityForm.get('permanentCountry'); }
  get getCurrentDistrict(): AbstractControl { return this.updateAuthorityForm.get('currentDistrict'); }
  get getCurrentProvince(): AbstractControl { return this.updateAuthorityForm.get('currentProvince'); }
  get getCurrentWards(): AbstractControl { return this.updateAuthorityForm.get('currentWards'); }
  get getPermanentDistrict(): AbstractControl { return this.updateAuthorityForm.get('permanentDistrict'); }
  get getPermanentProvince(): AbstractControl { return this.updateAuthorityForm.get('permanentProvince'); }
  get getPermanentWards(): AbstractControl { return this.updateAuthorityForm.get('permanentWards'); }
  get getValidFrom(): AbstractControl { return this.updateAuthorityForm.get('validFrom'); }
  get getValidTo(): AbstractControl { return this.updateAuthorityForm.get('validTo'); }
  checkDate(event: any, controlName: string): void {
    this.updateAuthorityForm.get(controlName).markAsTouched();
    if (event?.isValid()) {
      this.updateAuthorityForm.get(controlName).setValue(event.format('YYYY-MM-DD'));
    } else {
      this.updateAuthorityForm.get(controlName).setValue('');
    }
  }
  dpMessage(controlName: string): string {
    switch (controlName) {
      case 'dateOfBirth':
        return 'Ngày sinh không hợp lệ';
        break;
      case 'dateProvided':
        return 'Ngày cấp không hợp lệ';
        break;
      default:
        return '';
        break;
    }
  }
  returnCheckBox(item: any): void {
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.lstAuthorType.length; index++) {
      const obj = {}; if (this.lstAuthorType[index].code === item.authorTypeCode) {
        // tslint:disable-next-line: no-string-literal
        obj['code'] = item.authorTypeCode;
        // tslint:disable-next-line: no-string-literal
        this.lstAuthorType[index]['checked'] = true;
        this.orderPVUQ.push(obj);
      }
    }
  }

  getCurrentDistrictsByCityCodeHT(): void {
    const obj = {};
    // tslint:disable-next-line: no-string-literal
    obj['cityName'] = this.objAuthority.currentCityName;
    this.category.apiDistrict(obj).subscribe(rs => {
      this.categories.currentDistricts = rs.items;
      this.updateAuthorityForm.get('currentDistrict').setValue(this.objAuthority.currentDistrictName);
      this.getCurrentWardsByCurrentDistrictsHT();
    });
  }
  visaExemptionDate(): void {
    if (this.updateAuthorityForm.get('visaExemption').value) {
      this.updateAuthorityForm.get('visaIssueDate').reset();
      this.updateAuthorityForm.get('visaIssueDate').disable();
      this.updateAuthorityForm.get('visaExpireDate').reset();
      this.updateAuthorityForm.get('visaExpireDate').disable();
    } else if (this.updateAuthorityForm.get('nationality').value === 'VN') {
      this.updateAuthorityForm.get('visaIssueDate').reset();
      this.updateAuthorityForm.get('visaIssueDate').disable();
      this.updateAuthorityForm.get('visaExpireDate').reset();
      this.updateAuthorityForm.get('visaExpireDate').disable();
    }
    this.updateAuthorityForm.get('visaExemption').valueChanges.subscribe(x => {
      if (x) {
        this.updateAuthorityForm.get('visaIssueDate').reset();
        this.updateAuthorityForm.get('visaIssueDate').disable();
        this.updateAuthorityForm.get('visaExpireDate').reset();
        this.updateAuthorityForm.get('visaExpireDate').disable();
      } else {
        this.updateAuthorityForm.get('visaIssueDate').enable();
        this.updateAuthorityForm.get('visaIssueDate').setValidators(futureDate);
        this.updateAuthorityForm.get('visaExpireDate').enable();
        this.updateAuthorityForm.get('visaExpireDate').setValidators(pastDate);
      }
    });

  }


  disableAddress(): void {
    this.getCurrentCountry.valueChanges.subscribe(x => {
      // this.onCloneAddress();
      if (x !== 'VN') {
        this.getCurrentDistrict.setValue(null);
        this.getCurrentProvince.setValue(null);
        this.getCurrentWards.setValue('-chọn phường / xã-');
        this.getCurrentDistrict.disable();
        this.getCurrentProvince.disable();
        this.getCurrentWards.disable();
      } else {
        this.getCurrentDistrict.enable();
        this.getCurrentProvince.enable();
        this.getCurrentWards.enable();
      }
    });
    this.getPermanentCountry.valueChanges.subscribe(x => {
      // console.log(x);
      if (x !== 'VN') {
        this.getPermanentDistrict.setValue(null);
        this.getPermanentProvince.setValue(null);
        this.getPermanentWards.setValue(null);
        this.getPermanentDistrict.disable();
        this.getPermanentProvince.disable();
        this.getPermanentWards.disable();
      } else {
        this.getPermanentDistrict.enable();
        this.getPermanentProvince.enable();
        this.getPermanentWards.enable();
      }
    });
  }
  getCurrentDistrictsByCityCodeTT(): void {
    const obj = {};
    // tslint:disable-next-line: no-string-literal
    obj['cityName'] = this.objAuthority.residenceCityName;
    this.category.apiDistrict(obj).subscribe(rs => {
      this.categories.permanentDistricts = rs.items;
      this.updateAuthorityForm.get('permanentDistrict').setValue(this.objAuthority.residenceDistrictName);
      this.getCurrentWardsByCurrentDistrictsTT();
    });
  }
  getCurrentWardsByCurrentDistrictsHT(): void {
    const obj = {};
    // tslint:disable-next-line: no-string-literal
    obj['districtName'] = this.objAuthority.currentDistrictName;
    this.category.apiWard(obj).subscribe(rs => {
      this.categories.currentWards = rs.items;
      this.updateAuthorityForm.get('currentWards').setValue(this.objAuthority.currentWardName);
    });
  }
  getCurrentWardsByCurrentDistrictsTT(): void {
    const obj = {};
    // tslint:disable-next-line: no-string-literal
    obj['districtName'] = this.objAuthority.residenceDistrictName;
    this.category.apiWard(obj).subscribe(rs => {
      this.categories.permanentWards = rs.items;
      this.updateAuthorityForm.get('permanentWards').setValue(this.objAuthority.residenceWardName);
    });
  }
  disnableAuthorExpire(): void {
    const a = this.objAuthority.expireAuthorCode;
    if (a === this.constant.ONE || a === this.constant.WAIT_UPDATE) {
      this.updatAuthorExprise = false;
    } else {

      this.updatAuthorExprise = true;
    }

  }

  checkRadioContentAuthority(event: any, value: any): void {
    this.booleanValidForm = false;
    this.booleanValidTo = false;
    this.booleanDateForm = false;
    if (event.target.checked && value.code === this.constant.ONE) {
      this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.objUpdateAuthority.validTo = null;
      this.disableTodate = false;
      this.disableFromdate = true;
      this.updateAuthorityForm.get('validTo').setValue(null);
      this.returnValueCode = this.constant.ONE;
    } else if (event.target.checked && value.code === this.constant.VALID_TIME_RANGE) {
      this.disableTodate = true;
      this.disableFromdate = false;
      this.updatAuthorExprise = true;
      this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.updateAuthorityForm.get('validTo').setValidators(Validators.required);
      this.returnValueCode = undefined;
    } else {
      this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.disableTodate = false;
      this.disableFromdate = true;
      this.updateAuthorityForm.get('validTo').setValue(null);
      this.returnValueCode = this.constant.WAIT_UPDATE;
    }
    this.expireAuthorCode = value.code;
    // this.checkRadioValue = value;
    // this.booleanCheckRadio = false;
  }
  // tslint:disable-next-line: typedef
  get f() {
    return this.updateAuthorityForm.controls;
  }
  backPage(): void {
    this._LOCATION.back();
  }
  onBlurMethod(val: any): void {
    // tslint:disable-next-line: one-variable-per-declaration
    let str = val.toString(),
      output = [], i = 1, formatted = null;
    str = str.split('').reverse();
    if (str.indexOf('.') < 0) {
      for (let j = 0, len = str.length; j < len; j++) {
        if (str[j] !== ',') {
          output.push(str[j]);
          if (i % 3 === 0 && j < (len - 1)) {
            output.push('.');
          }
          i++;
        }
      }
    } else {
      output = val;
    }

    formatted = output.reverse().join('');
    this.limitValue = formatted;
  }
  changeTypeGTXM(): void {
    for (const index in this.categories.perDocTypes) {
      if (this.categories.perDocTypes[index].name === this.updateAuthorityForm.get('typeGTXM').value) {
        this.updateAuthorityForm.get('numberGTXM').setValue(null);
        this.addStr = null;
        break;
      }
    }
  }

  keyPress(event: KeyboardEvent): void {
    let str = '';
    const initalValue = event.key;
    for (const index in this.categories.perDocTypes) {
      if (this.categories.perDocTypes[index].name === this.updateAuthorityForm.get('typeGTXM').value) {
        // this.updateAuthorityForm.get('numberGTXM').setValue(null)
        str = this.categories.perDocTypes[index].code;
        break;
      }
    }
    if (str === this.constant.CCCD || str === this.constant.CMTND) {
      this.el.nativeElement.value = initalValue.replace(/[0-9]*/g, '');
      if (initalValue.indexOf(' ') >= 0) {
        event.preventDefault();
      } else {
        if (initalValue === this.el.nativeElement.value) {
          event.preventDefault();
        }
        else {
          // this.addStr = this.addStr + initalValue
          if (this.numberGTXM !== null && this.numberGTXM.length >= 12) {
            event.preventDefault();
          }
        }

      }
    } else if (str === this.constant.HC) {
      this.el.nativeElement.value = initalValue.replace(/[a-zA-Z0-9]*/g, '');
      if (initalValue.indexOf(' ') >= 0) {
        event.preventDefault();
      } else {
        if (initalValue === this.el.nativeElement.value) {
          event.preventDefault();
        }
      }
    }

  }
  checkFromToDate(): void {
    if (this.expireAuthorCode === this.constant.VALID_TIME_RANGE || this.expireAuthorCode === this.constant.ONE) {
      if (this.objUpdateAuthority.validFrom === '' || this.objUpdateAuthority.validFrom === null) {
        this.booleanValidForm = true;
        this.booleanDateForm = false;
      }
      if ((this.objUpdateAuthority.validTo === '' || this.objUpdateAuthority.validTo === null)
        && this.expireAuthorCode !== this.constant.ONE) {
        this.booleanValidTo = true;
        this.booleanDateForm = false;
      }
      if ((this.objUpdateAuthority.validFrom !== '' && this.objUpdateAuthority.validFrom !== null)
        && (this.objUpdateAuthority.validTo !== '' && this.objUpdateAuthority.validTo !== null)) {
        const dateForm = this.objUpdateAuthority.validFrom !== null ? new Date(this.objUpdateAuthority.validFrom) : null;
        const dateTo = this.objUpdateAuthority.validTo !== null ? new Date(this.objUpdateAuthority.validTo) : null;
        console.log(dateForm);

        if (dateForm.getTime() > dateTo.getTime()) {
          this.booleanDateForm = true;
          this.booleanValidForm = false;
          this.booleanValidTo = false;
        } else {
          this.booleanDateForm = false;
          this.booleanValidForm = false;
          this.booleanValidTo = false;
        }
      } else {
        if (this.objUpdateAuthority.validFrom !== null) {
          this.booleanValidForm = false;
          this.booleanDateForm = false;
        } else if (this.objUpdateAuthority.validTo !== null && this.objUpdateAuthority.validTo !== undefined) {
          this.booleanValidForm = false;
          this.booleanValidTo = false;
        }
      }
    } else if (this.expireAuthorCode === this.constant.WAIT_UPDATE) {
      if (this.objUpdateAuthority.validFrom === '' || this.objUpdateAuthority.validFrom === null) {
        this.booleanValidForm = true;
        this.booleanDateForm = false;
      }
    } else {
      this.booleanValidForm = false;
      this.booleanDateForm = false;
      this.booleanValidTo = false;
    }
  }

  checkDateOfBirthAndDateProvided(): void {
    if (this.updateAuthorityForm.get('dateOfBirth').value !== null && this.updateAuthorityForm.get('dateOfBirth').value !== '') {
      const dateOfBirth = this.updateAuthorityForm.get('dateOfBirth').value;
      if (dateOfBirth.getTime() > new Date().getTime()) {
        this.booleanDateOfbirth = true;
      } else {
        this.booleanDateOfbirth = false;
      }
    }
    if (this.updateAuthorityForm.get('dateProvided').value !== null && this.updateAuthorityForm.get('dateProvided').value !== ''
      && this.updateAuthorityForm.get('dateOfBirth').value !== null && this.updateAuthorityForm.get('dateOfBirth').value !== '') {
      const dateProvided = this.updateAuthorityForm.get('dateProvided').value;
      const dateOfBirth = this.updateAuthorityForm.get('dateOfBirth').value;
      if (dateProvided.getTime() < dateOfBirth.getTime()) {
        this.booleanDateProvidedLessDateOfbirth = true;
      } else {
        this.booleanDateProvidedLessDateOfbirth = false;
        this.booleanDateProvided = false;
      }
    } else {
      const dateProvided = this.updateAuthorityForm.get('dateProvided').value;
      if (dateProvided.getTime() > new Date().getTime()) {
        this.booleanDateProvided = true;
      } else {
        this.booleanDateProvided = false;
        this.booleanDateProvidedLessDateOfbirth = false;
      }
    }
  }
  createAuthority(): void {
    this.booleanPVUQ = this.orderPVUQ.length === 0 ? true : false;
    this.submitted = true;
    console.log('obj update', this.objUpdateAuthority);
    this.returnObj();
    this.checkFromToDate();
    console.log(this.updateAuthorityForm.invalid);
    if (this.isChecked) {
      this.booleanLimitValue = this.limitValue === undefined || this.limitValue === '' ? true : false;
    }
    if (this.updateAuthorityForm.invalid || (this.booleanPVUQ || this.booleanLimitValue) ||
      (this.national1 && this.booleanChangeQT2) || (this.national1 && this.booleanNull2) ||
      (this.national2 && this.booleanChangeQT3) || (this.national2 && this.booleanNull3) ||
      (this.national3 && this.booleanChangeQT4) || (this.national3 && this.booleanNull4) ||
      this.booleanValidForm || this.booleanValidTo || this.booleanDateForm || this.booleanDateOfbirth
      || this.booleanDateProvided || this.booleanDateProvidedLessDateOfbirth
    ) {
      // this.notificationService.showError('kiểm tra lại thông tin', '');
      return;
    }
    this.authorityService.updateAuthority(this.objUpdateAuthority).subscribe(rs => {
      for (const index in rs.responseStatus.codes) {
        if (rs.responseStatus.codes[index].code === '200') {
          this.notificationService.showSuccess('Cập nhật ủy quyền thành công', '');
          setTimeout(() => {
            this.router.navigate(['./smart-form/manager/authority', { processId: this.processId, id: this.accountId }]);
          }, 1000);
        } else {
          if (rs.responseStatus.codes[index].code === '204') {
            this.notificationService.showError(rs.responseStatus.codes[index].detail, '');
          } else {
            this.notificationService.showError('Cập nhật ủy quyền thất bại', '');
          }
        }
      }
    });
  }
  returnObj(): AuthorityModel {
    this.objUpdateAuthority.accountId = this.accountId;
    // tslint:disable-next-line: no-string-literal
    this.objUpdateAuthority['id'] = this.id;
    const genderCode = this.categories.genders.filter(e => e.name === this.updateAuthorityForm.get('gender').value);
    const perDocTypeCode = this.categories.perDocTypes.filter(e => e.name === this.updateAuthorityForm.get('typeGTXM').value);
    const upperName = this.updateAuthorityForm.get('fullName').value;
    this.objUpdateAuthority.fullName = upperName.toUpperCase();
    this.objUpdateAuthority.genderCode = this.updateAuthorityForm.get('gender').value;
    this.objUpdateAuthority.perDocTypeCode = perDocTypeCode[0].code;
    this.objUpdateAuthority.perDocNo = this.updateAuthorityForm.get('numberGTXM').value;
    this.objUpdateAuthority.issueDate = this.issueDate;
    this.objUpdateAuthority.issuePlace = this.updateAuthorityForm.get('placeProvided').value;
    this.objUpdateAuthority.residence = this.radioCheck;
    this.objUpdateAuthority.position = this.updateAuthorityForm.get('regency').value;
    this.objUpdateAuthority.birthDate = this.birthDate;
    this.objUpdateAuthority.mobilePhone = this.updateAuthorityForm.get('phoneNumber').value;
    this.objUpdateAuthority.email = this.updateAuthorityForm.get('email').value;
    this.objUpdateAuthority.industry = this.updateAuthorityForm.get('job').value;
    this.objUpdateAuthority.currentCityName = this.updateAuthorityForm.get('currentProvince').value;
    this.objUpdateAuthority.currentDistrictName = this.updateAuthorityForm.get('currentDistrict').value;
    this.objUpdateAuthority.currentWardName = this.updateAuthorityForm.get('currentWards').value;
    this.objUpdateAuthority.currentStreetNumber = this.updateAuthorityForm.get('currentAddress').value;
    this.objUpdateAuthority.residenceDistrictName = this.updateAuthorityForm.get('permanentDistrict').value;
    this.objUpdateAuthority.residenceStreetNumber = this.updateAuthorityForm.get('permanentAddress').value;
    this.objUpdateAuthority.residenceCityName = this.updateAuthorityForm.get('permanentProvince').value;
    this.objUpdateAuthority.residenceWardName = this.updateAuthorityForm.get('permanentWards').value;
    this.objUpdateAuthority.residenceStreetNumber = this.updateAuthorityForm.get('permanentAddress').value;
    this.objUpdateAuthority.currentCountryCode = this.updateAuthorityForm.get('currentCountry').value;
    this.objUpdateAuthority.residenceCountryCode = this.updateAuthorityForm.get('permanentCountry').value;
    this.objUpdateAuthority.nationality1Code = this.updateAuthorityForm.get('nationality').value;
    this.objUpdateAuthority.nationality2Code = this.nationalCode1Str !== null ? this.nationalCode1Str : undefined;
    this.objUpdateAuthority.nationality3Code = this.nationalCode2Str !== null ? this.nationalCode2Str : undefined;
    this.objUpdateAuthority.nationality4Code = this.nationalCode3Str !== null ? this.nationalCode3Str : undefined;
    this.objUpdateAuthority.visaExemption = this.updateAuthorityForm.get('visaExemption').value;
    this.objUpdateAuthority.visaIssueDate = this.updateAuthorityForm.get('visaIssueDate').value !== '' ||
      this.updateAuthorityForm.get('visaIssueDate').value !== null ?
      this.datePipe.transform(this.updateAuthorityForm.get('visaIssueDate').value, 'yyyy-MM-dd') : null;
    this.objUpdateAuthority.visaExpireDate = this.updateAuthorityForm.get('visaExpireDate').value !== '' ||
      this.updateAuthorityForm.get('visaExpireDate').value !== null ?
      this.datePipe.transform(this.updateAuthorityForm.get('visaExpireDate').value, 'yyyy-MM-dd') : null;
    const authorTypeCodes = [];
    this.orderPVUQ.forEach(e => {
      const obj = new AuthorizationScope();
      obj.authorTypeCode = e.code;
      obj.authorTypeFreeText = e.code === this.constant.OTHER ? this.valueOrther : undefined;
      obj.limitAmount = e.code === this.constant.DEPOSIT_AND_WITHDRAW || e.code === this.constant.ALL ? Number(this.limitValue.replaceAll('.', '')) : undefined;
      authorTypeCodes.push(obj);
    });
    console.log('Author Typce Code', authorTypeCodes);

    this.objUpdateAuthority.authorTypes = authorTypeCodes;
    this.objUpdateAuthority.expireAuthorCode = this.updateAuthorityForm.get('expireAuthorCode').value;
    this.objUpdateAuthority.validFrom = this.updateAuthorityForm.get('validFrom').value !== '' ||
      this.updateAuthorityForm.get('validFrom').value !== null ?
      this.datePipe.transform(this.updateAuthorityForm.get('validFrom').value, 'yyyy-MM-dd') : null;
    this.objUpdateAuthority.validTo = this.updateAuthorityForm.get('validTo').value !== '' ||
      this.updateAuthorityForm.get('validTo').value !== null ?
      this.datePipe.transform(this.updateAuthorityForm.get('validTo').value, 'yyyy-MM-dd') : null;
    return this.objUpdateAuthority;
  }

  onAddressChange(controlName: string): void {
    switch (controlName) {
      case 'currentProvince':
        // will get list of district on city id
        if (this.f.currentProvince.value !== '' && this.f.currentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.currentProvince.value).subscribe(data => this.categories.currentDistricts = data);
          this.updateAuthorityForm.get('currentDistrict').setValue(null);
          this.updateAuthorityForm.get('currentWards').setValue(null);
        } else {
          this.categories.currentDistricts = [];
          this.updateAuthorityForm.get('currentDistrict').setValue(null);
          this.categories.currentWards = [];
          this.updateAuthorityForm.get('currentWards').setValue(null);
        }
        break;
      case 'currentDistrict':
        // will get list of ward on district id
        if (this.f.currentDistrict.value !== '' && this.f.currentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.currentDistrict.value).subscribe(data => this.categories.currentWards = data);
          this.updateAuthorityForm.get('currentWards').setValue(null);
        } else {
          this.categories.currentWards = [];
          this.updateAuthorityForm.get('currentWards').setValue(null);
        }
        break;
      case 'permanentProvince':
        // will get list of district on city id
        if (this.f.permanentProvince.value !== '' && this.f.permanentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.permanentProvince.value).subscribe(data => this.categories.permanentDistricts = data);
          this.updateAuthorityForm.get('permanentDistrict').setValue(null);
          this.updateAuthorityForm.get('permanentWards').setValue(null);
        } else {
          this.categories.permanentDistricts = [];
          this.updateAuthorityForm.get('permanentDistrict').setValue(null);
          this.categories.permanentWards = [];
          this.updateAuthorityForm.get('permanentWards').setValue(null);
        }
        break;
      case 'permanentDistrict':
        // will get list of ward on district id
        if (this.f.permanentDistrict.value !== '' && this.f.permanentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.permanentDistrict.value).subscribe(data => this.categories.permanentWards = data);
          this.updateAuthorityForm.get('permanentWards').setValue(null);
        } else {
          this.categories.permanentWards = [];
          this.updateAuthorityForm.get('permanentWards').setValue(null);
        }
        break;
      default:
        // to do
        break;
    }
  }
  getDataSelect(): void {
    this.category.getGenders().subscribe(data => this.categories.genders = data);
    this.category.getPerDocTypes().subscribe(data => this.categories.perDocTypes = data);
    this.category.getCountries().subscribe(data => {
      this.categories.countries = data;
      this.lstCountries = data;
    });
    this.category.getCities().subscribe(data => this.categories.cites = data);
    this.category.getIndustries().subscribe(data => this.categories.industries = data);
    this.category.getLstAuthorType().subscribe(data => {
      this.lstAuthorType = data;
    });
    this.category.getLstAuthorExpire().subscribe(data => {
      this.lstAuthorExpire = data;
    });
    forkJoin([
      this.category.getGenders(),
      this.category.apiPerDocType(),
      this.category.getCountries(),
      this.category.getCities(),
      this.category.getIndustries(),
      this.category.getLstAuthorExpire(),
      this.category.getLstAuthorExpire(),
    ]).subscribe(data => {
      if (data) {
        this.getDetailAuthority(this.id);
      }
    });
  }
  onCloneAddress(event: any): void {
    if (event.target.checked) {
      this.categories.permanentDistricts = this.categories.currentDistricts;
      this.categories.permanentWards = this.categories.currentWards;
      this.updateAuthorityForm.get('permanentCountry').setValue(this.updateAuthorityForm.get('currentCountry').value);
      this.updateAuthorityForm.get('permanentProvince').setValue(this.updateAuthorityForm.get('currentProvince').value);
      this.updateAuthorityForm.get('permanentDistrict').setValue(this.updateAuthorityForm.get('currentDistrict').value);
      this.updateAuthorityForm.get('permanentWards').setValue(this.updateAuthorityForm.get('currentWards').value);
      this.updateAuthorityForm.get('permanentAddress').setValue(this.updateAuthorityForm.get('currentAddress').value);
    } else {
      this.updateAuthorityForm.get('permanentCountry').setValue(null);
      this.updateAuthorityForm.get('permanentProvince').setValue(null);
      this.updateAuthorityForm.get('permanentDistrict').setValue(null);
      this.updateAuthorityForm.get('permanentWards').setValue('');
      this.updateAuthorityForm.get('permanentAddress').setValue('');
    }
  }
  // a = false
  // checkPVUQ(evt: any): void {
  //   console.log('PVUQ', evt);
  //   // if (evt === this.constant.ALL) {
  //   //   console.log(this.lstAuthorType);
  //   // }
  //   if (evt === this.constant.ALL) {
  //    for (const i of this.lstAuthorType.filter(e => e.code !== this.constant.ALL)){
  //     // console.log(i);

  //    }
  //   }
  // }
}
