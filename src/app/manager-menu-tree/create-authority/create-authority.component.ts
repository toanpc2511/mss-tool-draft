import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { AbstractControl, AbstractFormGroupDirective, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { DetailProcess } from 'src/app/_models/process';
import { MissionService } from 'src/app/services/mission.service';
import { ProcessService } from 'src/app/_services/process.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { Nationality } from 'src/app/_models/nationality';
import { CategoryAuthority } from 'src/app/_models/category/categoryList';
import { ValidatorSpace } from 'src/app/_validator/otp.validator';
import { ElementRef } from '@angular/core';
import { AuthorityModel, AuthorizationScope } from 'src/app/_models/authority';
import { CategoryAuthorityService } from 'src/app/_services/category/category.authority.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { PopupSearchComponent } from 'src/app/_popup-search/popup.search.component';
import { AccountService } from 'src/app/_services/account.service';
import { AccountModel } from 'src/app/_models/account';
import { AuthorityAccountService } from 'src/app/_services/authority-account.service';
import { ConstantUtils } from 'src/app/_utils/_constant';
declare var $: any;
import * as moment from 'moment';
import { GlobalConstant } from 'src/app/_utils/GlobalConstant';
import { TypeModifier } from '@angular/compiler/src/output/output_ast';
import { SearchInfoComponent } from 'src/app/components/search-info/search-info.component';
import { Category } from 'src/app/_models/category/category';
import { Observable } from 'rxjs';
import { futureDate, pastDate } from 'src/app/_validator/cif.register.validator';
@Component({
  selector: 'app-create-authority',
  templateUrl: './create-authority.component.html',
  styleUrls: ['./create-authority.component.scss']
})
export class CreateAuthorityComponent implements OnInit {
  @ViewChild(SearchInfoComponent, { static: false }) searchInfoComponent: SearchInfoComponent;
  nationalityFormAdds: Nationality[] = [];
  isChecked: boolean;
  checkAddNationality: boolean;
  submitted = false;
  lstAuthorType: any = [];
  lstAuthorExpire: any = [];
  processId: any;
  detailProcess: DetailProcess = new DetailProcess(null);
  startDate: any;
  endDate: any;
  disableFromdate: boolean;
  disableTodate: boolean;
  categories: CategoryAuthority = new CategoryAuthority();
  hiddenInformationCustomer = false;
  orderPVUQ: any[] = [];
  booleanPVUQ: boolean;
  constant = new ConstantUtils();
  limitValue: any;
  checkRadioValue: any;
  customer: any;
  booleanLimitValue: boolean;
  booleanCheckRadio: boolean;
  booleanOrther: boolean;
  duplicateAddress: boolean;
  booleanCheckResident: boolean;
  booleanCheckQT: boolean;
  valueBooleanResident = true;
  valueOrther: string;
  expireAuthorCode: string;
  objCreateAuthority: AuthorityModel = new AuthorityModel();
  accountId: string;
  booleanChangeQT1: boolean;
  booleanChangeQT2: boolean;
  booleanChangeQT3: boolean;
  booleanChangeQT4: boolean;
  nationCode: string;
  objAccount: AccountModel = new AccountModel();
  numberAccount: any;
  // _constant: ConstantUtils = new ConstantUtils();
  booleanValidForm: boolean;
  booleanValidTo: boolean;
  booleanDateForm: boolean;
  addStr: string = null;
  viewCountry: any = [];
  returnButton: boolean;
  national1 = false;
  nationalCode1Str: string;
  national2 = false;
  nationalCode2Str: string;
  national3 = false;
  nationalCode3Str: string;
  booleanNull2: boolean;
  booleanNull3: boolean;
  booleanNull4: boolean;
  lstCountriesNew: any[] = [];
  returnValueCode: string;
  loading = false;
  isKSV: boolean;
  isGDV: boolean;
  roleLogin: any = [];
  disableSave = false;
  noicap: any = [
    {
      name: 'ĐKQL CƯ TRÚ VÀ DLQG VỀ DÂN CƯ'
    },
    {
      name: 'QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI'
    }

  ];
  EMAIL_REGEX = '^[\\w-_\\.+]*[\\w-_\\.]\\@([\\w]+\\.)+[\\w]+[\\w]$';
  createAuthorityForm = new FormGroup({
    searchCustomer: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    fullName: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    typeGTXM: new FormControl('', [Validators.required]),
    numberGTXM: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    dateProvided: new FormControl('', Validators.required),
    placeProvided: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    regency: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    gender: new FormControl('', Validators.required),
    email: new FormControl('', Validators.pattern(this.EMAIL_REGEX)),
    dateOfBirth: new FormControl('', Validators.required),
    nationality: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    job: new FormControl('', Validators.required),
    currentCountry: new FormControl(null, Validators.required),
    permanentCountry: new FormControl(null, Validators.required),
    currentProvince: new FormControl(null, Validators.required),
    permanentProvince: new FormControl(null, Validators.required),
    currentDistrict: new FormControl(null, Validators.required),
    permanentDistrict: new FormControl(null, Validators.required),
    currentWards: new FormControl('', Validators.required),
    permanentWards: new FormControl('', Validators.required),
    numberHome: new FormControl('', Validators.required),
    currentAddress: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    permanentAddress: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
    visaExemption: new FormControl(true),
    visaIssueDate: new FormControl(''),
    visaExpireDate: new FormControl('')
  });
  filteredOptions: Observable<Category[]>[] = [];
  @Output() dateOnInput: EventEmitter<any> = new EventEmitter<any>();
  CUSTOMER_TYPE = GlobalConstant.CUSTOMER_TYPE;
  valueSearch: string;
  filterSelected = this.CUSTOMER_TYPE.CMND;
  booleanDateOfbirth: boolean;
  booleanDateProvided: boolean;
  booleanDateProvidedLessDateOfbirth: boolean;
  constructor(
    private router: Router, private cifService: ProcessService,
    private errorHandler: ErrorHandlerService,
    private notificationService: NotificationService,
    private category: CategoryAuthorityService,
    private el: ElementRef,
    private dialog: MatDialog,
    private accountService: AccountService,
    private authorityService: AuthorityAccountService,
    private route: ActivatedRoute, private location: Location, private missionService: MissionService,
    private datePipe: DatePipe) {
  }
  ngOnInit(): void {
    this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    $('.childName').html('Thêm ủy quyền');
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
    });
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    this.getDataSelect();
    this.getDetailAccount(this.accountId);
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;
      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
    $('.childName').html('Thêm ủy quyền');
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('accountId');

    this.getDataSelect();
    this.getDetailAccount(this.accountId);
    this.initForm();
    this.disableAddress();
    this.visaExemptionDate();
  }
  initForm(): void {
    this.createAuthorityForm = new FormGroup({
      searchCustomer: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
      fullName: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
      typeGTXM: new FormControl('', [Validators.required]),
      numberGTXM: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
      dateProvided: new FormControl('', Validators.required),
      placeProvided: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
      regency: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
      gender: new FormControl('M', Validators.required),
      email: new FormControl('', Validators.pattern(this.EMAIL_REGEX)),
      dateOfBirth: new FormControl('', Validators.required),
      nationality: new FormControl(null, Validators.required),
      phoneNumber: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace, Validators.minLength(10)]),
      job: new FormControl('', Validators.required),
      currentCountry: new FormControl(null, Validators.required),
      permanentCountry: new FormControl(null, Validators.required),
      currentProvince: new FormControl(null, Validators.required),
      permanentProvince: new FormControl(null, Validators.required),
      currentDistrict: new FormControl(null, Validators.required),
      permanentDistrict: new FormControl(null, Validators.required),
      currentWards: new FormControl('', Validators.required),
      permanentWards: new FormControl('', Validators.required),
      numberHome: new FormControl('', Validators.required),
      currentAddress: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
      permanentAddress: new FormControl(null, [Validators.required, ValidatorSpace.cannotContainSpace]),
      visaExemption: new FormControl(true),
      visaIssueDate: new FormControl(''),
      visaExpireDate: new FormControl(''),
    });
  }
  onInputChange(event: any): void {
    this.dateOnInput.emit(moment(event.target.value, 'DD/MM/YYYY'));
  }
  hiddenForm(evt: boolean): void {
    this.hiddenInformationCustomer = evt;
  }
  // infor(evt: any): void{
  //   console.log(evt);
  //  }
  get getEmail(): AbstractControl { return this.createAuthorityForm.get('email') };
  searchCustomer(): void {
    if (this.customer === undefined) {
      this.returnButton = true;
    }
    if (this.customer !== undefined && !this.createAuthorityForm.get('searchCustomer').errors) {
      const data = {
        px: '',
        position_top: '',
        data: {
          customerCode: this.valueSearch,
          type: this.filterSelected,
          isSearchCif: true
        },
        index: 0
      };
      const dialogRef = this.dialog.open(PopupSearchComponent, DialogConfig.configDialogSearch(data));
      dialogRef.afterClosed().subscribe(rs => {
        if (rs === 1) {
          this.hiddenInformationCustomer = true;
          this.returnButton = false;
        }
      });
    }
  }
  checkDate(event: any, controlName: string): void {
    this.createAuthorityForm.get(controlName).markAsTouched();
    if (event?.isValid()) {
      this.createAuthorityForm.get(controlName).setValue(event.format('YYYY-MM-DD'));
    } else {
      this.createAuthorityForm.get(controlName).setValue('');
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
  visaExemptionDate(): void {
    if (this.createAuthorityForm.get('visaExemption').value) {
      this.createAuthorityForm.get('visaIssueDate').reset();
      this.createAuthorityForm.get('visaIssueDate').disable();
      this.createAuthorityForm.get('visaExpireDate').reset();
      this.createAuthorityForm.get('visaExpireDate').disable();

    } else if (this.createAuthorityForm.get('nationality').value === 'VN') {
      this.createAuthorityForm.get('visaIssueDate').reset();
      this.createAuthorityForm.get('visaIssueDate').disable();
      this.createAuthorityForm.get('visaExpireDate').reset();
      this.createAuthorityForm.get('visaExpireDate').disable();
    }
    this.createAuthorityForm.get('visaExemption').valueChanges.subscribe(x => {
      if (x) {
        this.createAuthorityForm.get('visaIssueDate').reset();
        this.createAuthorityForm.get('visaIssueDate').disable();
        this.createAuthorityForm.get('visaExpireDate').reset();
        this.createAuthorityForm.get('visaExpireDate').disable();
      } else {
        this.createAuthorityForm.get('visaIssueDate').enable();
        this.createAuthorityForm.get('visaIssueDate').setValidators(futureDate);
        this.createAuthorityForm.get('visaExpireDate').enable();
        this.createAuthorityForm.get('visaExpireDate').setValidators(pastDate);
      }
    });

  }


  // tslint:disable-next-line:typedef
  get f() {
    return this.createAuthorityForm.controls;
  }
  get getCurrentCountry(): AbstractControl { return this.createAuthorityForm.get('currentCountry'); }
  get getPermanentCountry(): AbstractControl { return this.createAuthorityForm.get('permanentCountry'); }
  get getCurrentDistrict(): AbstractControl { return this.createAuthorityForm.get('currentDistrict'); }
  get getCurrentProvince(): AbstractControl { return this.createAuthorityForm.get('currentProvince'); }
  get getCurrentWards(): AbstractControl { return this.createAuthorityForm.get('currentWards'); }
  get getPermanentDistrict(): AbstractControl { return this.createAuthorityForm.get('permanentDistrict'); }
  get getPermanentProvince(): AbstractControl { return this.createAuthorityForm.get('permanentProvince'); }
  get getPermanentWards(): AbstractControl { return this.createAuthorityForm.get('permanentWards'); }



  getDetailAccount(id: any): void {
    this.accountService.getDetailAccount({ id }).subscribe(data => {
      this.objAccount = data.item;
      if (this.objAccount.accountIndex !== null && this.objAccount.accountNumber === null) {
        this.numberAccount = 'Tài khoản mới ' + this.objAccount.accountIndex;
      } else if (this.objAccount.accountIndex !== null && this.objAccount.accountNumber !== null) {
        this.numberAccount = this.objAccount.accountNumber;
      }
    }, error => {
    });
  }
  getDataSelect(): void {
    this.category.getGenders().subscribe(data => this.categories.genders = data);
    this.category.getPerDocTypes().subscribe(data => this.categories.perDocTypes = data);
    this.category.getCountries().subscribe(data => {
      this.categories.countries = data;
      this.viewCountry = this.categories.countries.filter(e => e.code === 'VN');
      this.createAuthorityForm.get('nationality').setValue(this.viewCountry[0].code);
      this.createAuthorityForm.get('currentCountry').setValue(this.viewCountry[0].code);
      this.createAuthorityForm.get('permanentCountry').setValue(this.viewCountry[0].code);
    });
    this.category.getCities().subscribe(data => this.categories.cites = data);
    this.category.getIndustries().subscribe(data => this.categories.industries = data);
    this.category.getAuthorType().subscribe(data => { this.lstAuthorType = data.items; });
    this.category.getAuthorExpire().subscribe(data => { this.lstAuthorExpire = data.items; });

  }
  onAddressChange(controlName: string): void {
    switch (controlName) {
      case 'currentProvince':
        // will get list of district on city id
        if (this.f.currentProvince.value !== '' && this.f.currentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.currentProvince.value).subscribe(data => this.categories.currentDistricts = data);
          this.createAuthorityForm.get('currentDistrict').setValue(null);
          this.createAuthorityForm.get('currentWards').setValue('');
        } else {
          this.categories.currentDistricts = [];
          this.createAuthorityForm.get('currentDistrict').setValue(null);
        }
        break;
      case 'currentDistrict':
        // will get list of ward on district id
        if (this.f.currentDistrict.value !== '' && this.f.currentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.currentDistrict.value).subscribe(data => this.categories.currentWards = data);
          this.createAuthorityForm.get('currentWards').setValue('');
        } else {
          this.categories.currentWards = [];
          this.createAuthorityForm.get('currentWards').setValue(null);
        }
        break;
      case 'permanentProvince':
        // will get list of district on city id
        if (this.f.permanentProvince.value !== '' && this.f.permanentProvince.value != null) {
          this.category.getDistrictByCityId(this.f.permanentProvince.value).subscribe(data => this.categories.permanentDistricts = data);
          this.createAuthorityForm.get('permanentDistrict').setValue(null);
          this.createAuthorityForm.get('permanentWards').setValue('');
        } else {
          this.categories.permanentDistricts = [];
          this.createAuthorityForm.get('permanentDistrict').setValue(null);
        }
        break;
      case 'permanentDistrict':
        // will get list of ward on district id
        if (this.f.permanentDistrict.value !== '' && this.f.permanentDistrict.value != null) {
          this.category.getWardByDistrictId(this.f.permanentDistrict.value).subscribe(data => this.categories.permanentWards = data);
          this.createAuthorityForm.get('permanentWards').setValue('');
        } else {
          this.categories.permanentWards = [];
          this.createAuthorityForm.get('permanentWards').setValue(null);
        }
        break;
      default:
        // to do
        break;
    }
  }

  checkRadioContentAuthority(event: any, value: any): void {
    this.booleanValidForm = false;
    this.booleanValidTo = false;
    this.booleanDateForm = false;
    // console.log(value);

    if (event.target.checked && value.code === this.constant.ONE) {
      this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.objCreateAuthority.validTo = null;
      this.disableTodate = false;
      this.disableFromdate = true;
      this.returnValueCode = this.constant.ONE;
    } else if (event.target.checked && value.code === this.constant.VALID_TIME_RANGE) {
      this.disableTodate = true;
      this.disableFromdate = true;
      this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.returnValueCode = undefined;
    } else {
      this.startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.disableTodate = false;
      this.disableFromdate = true;
      this.returnValueCode = this.constant.WAIT_UPDATE;
    }
    this.expireAuthorCode = value.code;
    this.checkRadioValue = value;
    this.booleanCheckRadio = false;
  }
  checkRadioResident(event: any): void {
    // this.valueBooleanResident = event;
    if (event === 'yes') {
      this.valueBooleanResident = true;
    } else {
      this.valueBooleanResident = false;
    }
  }
  backPage(): void {
    this.location.back();
  }
  disableAddress(): void {
    this.getCurrentCountry.valueChanges.subscribe(x => {
      // console.log(x);
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
  addNationality(): void {
    this.lstCountriesNew = this.categories.countries;
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
  removeNationality(idx: any): void {
    if (idx === 1) {
      this.national1 = false;
    } else if (idx === 2) {
      this.national2 = false;
    } else {
      this.national3 = false;
    }
  }
  changeNational(idx: any): void {
    const valueNation = this.createAuthorityForm.get('nationality').value;
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
  checkValue(event: any, idx: any, item: any): void {

    // console.log(item);

    if (event.target.checked) {
      if (item.code === this.constant.DEPOSIT_AND_WITHDRAW || item.code === this.constant.ALL) {
        this.isChecked = true;
      } else if (item.code === this.constant.OTHER) {
        this.booleanOrther = true;
      }
      this.orderPVUQ.push(item);
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
        this.valueOrther = undefined;
      }

    }
    if (this.orderPVUQ.length === 0) {
      this.booleanPVUQ = true;
    } else {
      this.booleanPVUQ = false;
    }
    if (item.code === this.constant.ALL) {
      // console.log(item)
      // console.log(this.orderPVUQ[1].code);
    }
  }
  checkLstAddFormNationality(): void {
    if (this.nationalityFormAdds.length > 0) {
      for (const index in this.nationalityFormAdds) {
        if (this.nationalityFormAdds[index].nationlityCode === undefined) {
          // tslint:disable-next-line:no-string-literal
          this.nationalityFormAdds[index]['checked'] = true;
        } else {
          // tslint:disable-next-line:no-string-literal
          this.nationalityFormAdds[index]['checked'] = false;
        }
      }
      for (const index in this.nationalityFormAdds) {
        // tslint:disable-next-line:no-string-literal
        if (this.nationalityFormAdds[index]['checked'] === true) {
          this.booleanCheckQT = true;
          break;
        } else {
          this.booleanCheckQT = false;
        }
      }
    } else {
      this.booleanCheckQT = false;
    }
  }

  changeTypeGTXM(): void {
    for (const index in this.categories.perDocTypes) {
      if (this.categories.perDocTypes[index].name === this.createAuthorityForm.get('typeGTXM').value) {
        this.createAuthorityForm.get('numberGTXM').setValue(null);
        this.addStr = null;
        break;
      }
    }
  }
  onBlurMethod(val: any): void {
    // tslint:disable-next-line:one-variable-per-declaration
    let str = val.toString(),
      // tslint:disable-next-line:prefer-const
      parts = false, output = [],
      i = 1, formatted = null;
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

    formatted = output.length > 0 ? output.reverse().join('') : output;
    this.limitValue = formatted;
  }
  keyPressOnlyNUmber(event: KeyboardEvent): void {
    const initalValue = event.key;
    this.el.nativeElement.value = initalValue.replace(/[0-9]*/g, '');
    if (initalValue.indexOf(' ') >= 0) {
      event.preventDefault();
    } else {
      if (initalValue === this.el.nativeElement.value) {
        event.preventDefault();
      }
    }
  }
  keyPress(event: KeyboardEvent): void {
    let str = '';
    const initalValue = event.key;
    // let keyId = event.keyCode
    for (const index in this.categories.perDocTypes) {
      if (this.categories.perDocTypes[index].name === this.createAuthorityForm.get('typeGTXM').value) {
        str = this.categories.perDocTypes[index].code;
        // console.log(str);
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
          if (this.addStr !== null && this.addStr.length >= 12) {
            event.preventDefault();
          }
        }

      }
    }
    else if (str === this.constant.HC) {
      this.el.nativeElement.value = initalValue.replace(/[a-zA-Z0-9]*/g, '');
      if (initalValue.indexOf(' ') >= 0) {
        event.preventDefault();
      } else {
        if (initalValue === this.el.nativeElement.value) {
          event.preventDefault();
        }
        else {
          if (this.addStr !== null && this.addStr.length >= 50) {
            event.preventDefault();
          }
        }
      }
    }

    else if (str === this.constant.KHAI_SINH) {
      this.el.nativeElement.value = initalValue.replace(/[0-9]*/g, '');
      if (initalValue.indexOf(' ') >= 0) {
        event.preventDefault();
      } else {
        if (initalValue === this.el.nativeElement.value) {
          event.preventDefault();
        }
        else {
          if (this.addStr !== null && this.addStr.length >= 50) {
            event.preventDefault();
          }
        }

      }
    }

  }
  returnObj(): AuthorityModel {
    this.objCreateAuthority.accountId = this.accountId;
    const genderCode = this.categories.genders.filter(e => e.name === this.createAuthorityForm.get('gender').value);
    const perDocTypeCode = this.categories.perDocTypes.filter(e => e.name === this.createAuthorityForm.get('typeGTXM').value);
    const upperName = this.createAuthorityForm.get('fullName').value;
    this.objCreateAuthority.fullName = upperName !== null ? upperName.toUpperCase().trim() : null;
    this.objCreateAuthority.genderCode = this.createAuthorityForm.get('gender').value;
    this.objCreateAuthority.perDocTypeCode = perDocTypeCode.length > 0 ? perDocTypeCode[0].code : null;
    this.objCreateAuthority.perDocNo = this.createAuthorityForm.get('numberGTXM').value;
    this.objCreateAuthority.issueDate = this.createAuthorityForm.get('dateProvided').value !== '' ||
      this.createAuthorityForm.get('dateProvided').value !== null ?
      this.datePipe.transform(this.createAuthorityForm.get('dateProvided').value, 'yyyy-MM-dd') : null;
    this.objCreateAuthority.issuePlace = this.createAuthorityForm.get('placeProvided').value;
    this.objCreateAuthority.residence = this.valueBooleanResident;
    this.objCreateAuthority.position = this.createAuthorityForm.get('regency').value;
    this.objCreateAuthority.birthDate = this.createAuthorityForm.get('dateOfBirth').value !== '' ||
      this.createAuthorityForm.get('dateOfBirth').value !== null ?
      this.datePipe.transform(this.createAuthorityForm.get('dateOfBirth').value, 'yyyy-MM-dd') : null;
    this.objCreateAuthority.mobilePhone = this.createAuthorityForm.get('phoneNumber').value;
    this.objCreateAuthority.email = this.createAuthorityForm.get('email').value;
    this.objCreateAuthority.industry = this.createAuthorityForm.get('job').value;
    this.objCreateAuthority.currentCityName = this.createAuthorityForm.get('currentProvince').value;
    this.objCreateAuthority.currentDistrictName = this.createAuthorityForm.get('currentDistrict').value;
    this.objCreateAuthority.currentWardName = this.createAuthorityForm.get('currentWards').value;
    this.objCreateAuthority.currentStreetNumber = this.createAuthorityForm.get('currentAddress').value;
    this.objCreateAuthority.residenceDistrictName = this.createAuthorityForm.get('permanentDistrict').value;
    this.objCreateAuthority.residenceStreetNumber = this.createAuthorityForm.get('permanentAddress').value;
    this.objCreateAuthority.residenceCityName = this.createAuthorityForm.get('permanentProvince').value;
    this.objCreateAuthority.residenceWardName = this.createAuthorityForm.get('permanentWards').value;
    this.objCreateAuthority.residenceStreetNumber = this.createAuthorityForm.get('permanentAddress').value;
    this.objCreateAuthority.currentCountryCode = this.createAuthorityForm.get('currentCountry').value;
    this.objCreateAuthority.residenceCountryCode = this.createAuthorityForm.get('permanentCountry').value;
    this.objCreateAuthority.nationality1Code = this.createAuthorityForm.get('nationality').value;
    this.objCreateAuthority.nationality2Code = this.nationalCode1Str !== null ? this.nationalCode1Str : undefined;
    this.objCreateAuthority.nationality3Code = this.nationalCode2Str !== null ? this.nationalCode2Str : undefined;
    this.objCreateAuthority.nationality4Code = this.nationalCode3Str !== null ? this.nationalCode3Str : undefined;
    this.objCreateAuthority.visaExemption = this.createAuthorityForm.get('visaExemption').value;
    this.objCreateAuthority.visaIssueDate = this.createAuthorityForm.get('visaIssueDate').value !== '' ||
      this.createAuthorityForm.get('visaIssueDate').value !== null ?
      this.datePipe.transform(this.createAuthorityForm.get('visaIssueDate').value, 'yyyy-MM-dd') : null;
    this.objCreateAuthority.visaExpireDate = this.createAuthorityForm.get('visaExpireDate').value !== '' ||
      this.createAuthorityForm.get('visaExpireDate').value !== null ?
      this.datePipe.transform(this.createAuthorityForm.get('visaExpireDate').value, 'yyyy-MM-dd') : null;

    const authorTypeCodes = [];
    this.orderPVUQ.forEach(e => {
      const obj = new AuthorizationScope();
      obj.authorTypeCode = e.code;
      if (e.code === this.constant.OTHER) {
        obj.authorTypeFreeText = this.valueOrther;
      } else if (e.code === this.constant.DEPOSIT) {
        obj.authorTypeFreeText = this.constant.DEPOSIT;
      } else if (e.code === this.constant.DEPOSIT_AND_WITHDRAW) {
        obj.authorTypeFreeText = this.constant.DEPOSIT_AND_WITHDRAW;
        obj.limitAmount = Number(this.limitValue.replaceAll('.', ''));
      } else if (e.code === this.constant.ALL) {
        obj.authorTypeFreeText = this.constant.ALL
        obj.limitAmount = Number(this.limitValue.replaceAll('.', ''));
      } else {
        obj.authorTypeFreeText = undefined;
      }
      authorTypeCodes.push(obj);
    });
    const startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
    this.objCreateAuthority.authorTypes = authorTypeCodes;
    this.objCreateAuthority.expireAuthorCode = this.expireAuthorCode;
    this.objCreateAuthority.validFrom = startDate;
    this.objCreateAuthority.validTo = endDate;
    return this.objCreateAuthority;
  }
  checkFromToDate(): void {
    if (this.expireAuthorCode === this.constant.VALID_TIME_RANGE || this.expireAuthorCode === this.constant.ONE) {
      if (this.objCreateAuthority.validFrom === null || this.objCreateAuthority.validFrom === undefined) {
        this.booleanValidForm = true;
        this.booleanDateForm = false;
      }
      if ((this.objCreateAuthority.validTo === null || this.objCreateAuthority.validTo === undefined) &&
        this.expireAuthorCode !== this.constant.ONE) {
        this.booleanValidTo = true;
        this.booleanDateForm = false;
      }
      if ((this.objCreateAuthority.validFrom !== null && this.objCreateAuthority.validFrom !== undefined)
        && (this.objCreateAuthority.validTo !== null && this.objCreateAuthority.validTo !== undefined)) {
        const dateForm = this.objCreateAuthority.validFrom !== null ? new Date(this.objCreateAuthority.validFrom) : null;
        const dateTo = this.objCreateAuthority.validTo !== null ? new Date(this.objCreateAuthority.validTo) : null;
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
        if (this.objCreateAuthority.validFrom !== null) {
          this.booleanValidForm = false;
          this.booleanDateForm = false;
        } else if (this.objCreateAuthority.validTo !== null && this.objCreateAuthority.validTo !== undefined) {
          this.booleanValidForm = false;
          this.booleanValidTo = false;
        }
      }
    } else if (this.expireAuthorCode === this.constant.WAIT_UPDATE) {
      if (this.objCreateAuthority.validFrom === '' || this.objCreateAuthority.validFrom === null) {
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
    if (this.createAuthorityForm.get('dateOfBirth').value !== null && this.createAuthorityForm.get('dateOfBirth').value !== '') {
      const dateOfBirth = this.createAuthorityForm.get('dateOfBirth').value;
      if (dateOfBirth.toDate().getTime() > new Date().getTime()) {
        this.booleanDateOfbirth = true;
      } else {
        this.booleanDateOfbirth = false;
      }
    }
    if (this.createAuthorityForm.get('dateProvided').value !== null && this.createAuthorityForm.get('dateProvided').value !== ''
      && this.createAuthorityForm.get('dateOfBirth').value !== null && this.createAuthorityForm.get('dateOfBirth').value !== '') {
      const dateProvided = this.createAuthorityForm.get('dateProvided').value;
      const dateOfBirth = this.createAuthorityForm.get('dateOfBirth').value;
      if (dateProvided.toDate().getTime() < dateOfBirth.toDate().getTime()) {
        this.booleanDateProvidedLessDateOfbirth = true;
      } else {
        this.booleanDateProvidedLessDateOfbirth = false;
        this.booleanDateProvided = false;
      }
    } else {
      const dateProvided = this.createAuthorityForm.get('dateProvided').value;
      if (dateProvided.toDate().getTime() > new Date().getTime()) {
        this.booleanDateProvided = true;
      } else {
        this.booleanDateProvided = false;
        this.booleanDateProvidedLessDateOfbirth = false;
      }
    }
  }

  createAuthority(): void {
    this.returnButton = true;
    this.loading = true;
    this.disableSave = true;
    if (this.hiddenInformationCustomer) {
      this.booleanPVUQ = this.orderPVUQ.length === 0 ? true : false;
      this.booleanCheckRadio = this.checkRadioValue === undefined ? true : false;
      if (this.isChecked) {
        this.booleanLimitValue = this.limitValue === undefined ? true : false;
      }
      this.submitted = true;
      this.checkLstAddFormNationality();
      console.log(this.objCreateAuthority);
      this.returnObj();
      this.checkFromToDate();
      this.checkDateOfBirthAndDateProvided();
      if (this.createAuthorityForm.invalid &&
        this.booleanCheckQT || this.booleanCheckResident ||
        (this.booleanPVUQ || this.booleanLimitValue) &&
        this.booleanCheckRadio || !this.hiddenInformationCustomer ||
        (this.national1 && this.booleanChangeQT2) || (this.national1 && this.booleanNull2) ||
        (this.national2 && this.booleanChangeQT3) || (this.national2 && this.booleanNull3) ||
        (this.national3 && this.booleanChangeQT4) || (this.national3 && this.booleanNull4) ||
        this.booleanValidForm || this.booleanValidTo || this.booleanDateForm || this.booleanDateOfbirth
        || this.booleanDateProvided || this.booleanDateProvidedLessDateOfbirth) {
        this.notificationService.showError('Thông tin không hợp lệ, nhập lại', '');
        return;
      }

      this.authorityService.createAuthority(this.objCreateAuthority).subscribe(rs => {
        for (const index in rs.responseStatus.codes) {
          if (rs.responseStatus.success) {
            this.notificationService.showSuccess('Thêm mới ủy quyền thành công', '');
            setTimeout(() => {
              this.router.navigate(['./smart-form/manager/authority', { processId: this.processId, id: this.accountId }]);
            }, 1000);
          } else {
            if (rs.responseStatus.codes[index].code === '204') {
              this.notificationService.showError(rs.responseStatus.codes[index].detail, '');
            } else {
              this.notificationService.showError('Thêm mới ủy quyền thất bại', '');
            }

          }
        }
      }, err => {

      });
    }
  }
  onCloneAddress(event: any): void {
    if (event.target.checked) {
      this.categories.permanentDistricts = this.categories.currentDistricts;
      this.categories.permanentWards = this.categories.currentWards;
      this.createAuthorityForm.get('permanentCountry').setValue(this.createAuthorityForm.get('currentCountry').value);
      this.createAuthorityForm.get('permanentProvince').setValue(this.createAuthorityForm.get('currentProvince').value);
      this.createAuthorityForm.get('permanentDistrict').setValue(this.createAuthorityForm.get('currentDistrict').value);
      this.createAuthorityForm.get('permanentWards').setValue(this.createAuthorityForm.get('currentWards').value);
      this.createAuthorityForm.get('permanentAddress').setValue(this.createAuthorityForm.get('currentAddress').value);
    } else {
      this.createAuthorityForm.get('permanentCountry').setValue(null);
      this.createAuthorityForm.get('permanentProvince').setValue(null);
      this.createAuthorityForm.get('permanentDistrict').setValue(null);
      this.createAuthorityForm.get('permanentWards').setValue('');
      this.createAuthorityForm.get('permanentAddress').setValue('');
    }
  }

}
