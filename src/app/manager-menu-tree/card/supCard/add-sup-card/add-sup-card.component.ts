import { DatePipe, Location } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  LOCALE_ID,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListAccount } from 'src/app/_models/card/Account';
import { Card } from 'src/app/_models/card/Card';
import { Branch } from 'src/app/_models/card/Branch';
import { CommonCard } from 'src/app/_models/card/CommonCard';
import { DeliveryType } from 'src/app/_models/card/deliveryType';
import { CardSubCreate } from 'src/app/_models/card/subCard/CardSubCreate';
import { CardService } from 'src/app/_services/card/card.service';
import { SubCardService } from 'src/app/_services/card/sub-card.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { ProcessService } from 'src/app/_services/process.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { CifCondition } from 'src/app/_models/cif';
import { Process } from 'src/app/_models/process/Process';
import { ErrorMessage } from 'src/app/_utils/ErrorMessage';
// import { futureDate, futureDate1 } from 'src/app/_validator/cif.register.validator';
import { futureDate1, IssueDate } from '../../../../_validator/cif.register.validator';
import { Category } from '../../../../_models/category/category';
import { from, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GlobalConstant } from 'src/app/_utils/GlobalConstant';
import * as moment from 'moment';
import { CategoryService } from 'src/app/_services/category/category.service';
import { CategoryList } from 'src/app/_models/category/categoryList';
import { MissionService } from 'src/app/services/mission.service';
import { AccountService } from '../../../../_services/account.service';
import { HTTPMethod } from '../../../../shared/constants/http-method';
import { HelpsService } from '../../../../shared/services/helps.service';
import { LpbDatePickerComponent } from '../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import { PREFIX_MOBILE_NUMBER } from '../../../../shared/constants/constants';
import { RG_FULLNAME_CORE } from '../../../../shared/constants/regex.utils';
import { ShareDataServiceService } from '../../../../_services/share-data-service.service';
declare var $: any;

@Component({
  selector: 'app-add-sup-card',
  templateUrl: './add-sup-card.component.html',
  styleUrls: ['./add-sup-card.component.css'],
  providers: [
    DatePipe
  ]
})
export class AddSupCardComponent implements OnInit, AfterViewInit {

  @ViewChild('dpDateOfBirth', { static: false }) dpDateOfBirth: LpbDatePickerComponent;
  @ViewChild('dpIssueDate', { static: false }) dpIssueDate: LpbDatePickerComponent;
  @ViewChild('dpExpireDate', { static: false }) dpExpireDate: LpbDatePickerComponent;

  SERVICE_NAME = GlobalConstant.SERVICE_NAME;
  SERVICE_STATUS = GlobalConstant.SERVICE_STATUS;
  CUSTOMER_TYPE = GlobalConstant.CUSTOMER_TYPE;
  PROCESS_STATUS = GlobalConstant.PROCESS_STATUS;
  loading = false;
  ERROR_MESSAGE = ErrorMessage;
  processId: string;
  p2 = '';
  subCardId = '';
  divCa: any;
  card: Card;
  objCardNew: CardSubCreate = new CardSubCreate();
  g: CommonCard[];
  per: CommonCard[];
  account: ListAccount[];
  account1: ListAccount[];
  deliveryType: DeliveryType[];
  bidingAcount: ListAccount[];
  submitted = false;
  branch: Branch[];
  cardId = '';
  contractNumber = '';
  accountId = '';
  cardTypeCode = '';
  process: Process = new Process();
  card1: Card = new Card();
  accountCLone = [];
  filteredOptions: Observable<Category[]>[] = [];
  options: Category[] = [];
  categories: CategoryList = new CategoryList();
  currentDate;
  roleLogin: any;
  isKSV: boolean;
  isGDV: boolean;
  userCityName = '';
  userInfo = null;
  isView = false;
  customerCode: any;

  @Output() dateOfBirthChange = new EventEmitter<any>();

  constructor(
    private _LOCATION: Location,
    private route: ActivatedRoute,
    private cardService: CardService,
    private router: Router,
    private cardSubService: SubCardService,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService,
    private cifService: ProcessService,
    private category: CategoryService,
    private missionService: MissionService,
    private accountService: AccountService,
    private datePipe: DatePipe,
    private supCardService: SubCardService,
    private helpService: HelpsService,
    private shareDataService: ShareDataServiceService,
    private ref: ChangeDetectorRef
  ) {
  }

  ngAfterViewInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.currentDate = new Date().toISOString().slice(0, 10);
    this.divCa = document.querySelector('#tab') as HTMLElement;
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userCityName = this.userInfo.cityName;

    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
      this.p2 = paramMap.get('processId');
      this.getDeliveryType(paramMap.get('processId'));
      this.cardId = paramMap.get('cardId');
      this.getProcessInformation(paramMap.get('processId'));
      this.detail(this.cardId);
      this.subCardId = paramMap.get('supCardId');
      if (this.subCardId) {
        this.subCarddetail(this.subCardId);
      } else {
        this.addAccountLink();
      }
    });
    if (this.subCardId === null) {
      $('.childName').html('Tạo mới thẻ phụ');
    } else {
      $('.childName').html('Cập nhật thẻ phụ');
    }
    this.listGender();
    this.missionService.setProcessId(this.processId);
    this.listPerDocType();
    this.getBranch();
    this.employeeId.patchValue(JSON.parse(localStorage.getItem('userInfo')).employeeId);
    this.deliveryBranchCode.patchValue(JSON.parse(localStorage.getItem('userInfo')).branchCode);

    this.categoriesLoader();
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;
      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
    this.valuesChange();
    this.shareDataService.isView.subscribe(response => {
      this.isView = response;
      if (response) {
        this.CreateCardForm.disable();
        this.dpDateOfBirth.disable();
        this.dpExpireDate.disable();
        this.dpIssueDate.disable();
      }
    });
    this.ref.detectChanges();
  }

  ngOnInit(): void {
  }


  // tslint:disable-next-line:member-ordering
  CreateCardForm = new FormGroup({
    contractNumber: new FormControl(''),
    processId: new FormControl(''),
    cardId: new FormControl(this.cardId),
    accountId: new FormControl(this.accountId),
    cardTypeCode: new FormControl(this.cardTypeCode),
    accountLinkList: new FormArray([], isAccountLinkDup()),
    employeeId: new FormControl('', Validators.required),
    referrerCode: new FormControl('', Validators.required),
    cardHolderName: new FormControl('', [Validators.required, Validators.maxLength(25)]),
    deliveryTypeCode: new FormControl('DEFAULT', Validators.required),
    deliveryChanelCode: new FormControl('GUI_NHAN'),
    deliveryBranchCode: new FormControl(''),
    deliveryAddress: new FormControl('', Validators.required),
    person: new FormGroup({
      fullName: new FormControl('', [Validators.required, Validators.maxLength(35)]),
      dateOfBirth: new FormControl('', [Validators.required, futureDate1]),
      genderCode: new FormControl('M', Validators.required),
      mobileNo: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10), this.phoneNumberValidator]),
      address: new FormControl(''),
      perDocTypeCode: new FormControl('', Validators.required),
      perDocNo: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(12)]),
      issueDate: new FormControl('', [Validators.required, futureDate1]),
      issuePlace: new FormControl('', Validators.required),
      expireDate: new FormControl('', Validators.required),
    }, { validators: [this.dateValidator, this.validateGTXM] }),
    actionCode: new FormControl('C'),
    cardIssueFeeTypeCode: new FormControl('YC01'),
    cardNumber: new FormControl('', [Validators.minLength(16), Validators.maxLength(16)]),
    feeAmount: new FormControl('0', [Validators.required]),
  }, { validators: [this.accountLinkValidator] });

  // tslint:disable-next-line:member-ordering
  acc = this.CreateCardForm.get('accountLinkList') as FormArray;

  // tslint:disable-next-line:typedef
  get getProcessId() {
    return this.CreateCardForm.get('processId');
  }

  // tslint:disable-next-line:typedef
  get getAccountID() {
    return this.CreateCardForm.get('accountId');
  }

  // tslint:disable-next-line:typedef
  get deliveryTypeCode() {
    return this.CreateCardForm.get('deliveryTypeCode');
  }

  // tslint:disable-next-line:typedef
  get accountLinkList() {
    return this.CreateCardForm.get('accountLinkList') as FormArray;
  }

  // tslint:disable-next-line:typedef
  get employeeId() {
    return this.CreateCardForm.get('employeeId');
  }

  // tslint:disable-next-line:typedef
  get referrerCode() {
    return this.CreateCardForm.get('referrerCode');
  }

  // tslint:disable-next-line:typedef
  get cardHolderName() {
    return this.CreateCardForm.get('cardHolderName');
  }

  // tslint:disable-next-line:typedef
  get deliveryChanelCode() {
    return this.CreateCardForm.get('deliveryChanelCode');
  }

  // tslint:disable-next-line:typedef
  get deliveryBranchCode() {
    return this.CreateCardForm.get('deliveryBranchCode');
  }

  // tslint:disable-next-line:typedef
  get deliveryAddress() {
    return this.CreateCardForm.get('deliveryAddress');
  }

  // tslint:disable-next-line:typedef
  get cardNumber() {
    return this.CreateCardForm.get('cardNumber');
  }

  // tslint:disable-next-line:typedef
  get person() {
    return this.CreateCardForm.get('person');
  }

  // tslint:disable-next-line:typedef
  get fullName() {
    return this.person.get('fullName');
  }

  // tslint:disable-next-line:typedef
  get dateOfBirth() {
    return this.person.get('dateOfBirth');
  }

  // tslint:disable-next-line:typedef
  get genderCode() {
    return this.person.get('genderCode');
  }

  // tslint:disable-next-line:typedef
  get mobileNo() {
    return this.person.get('mobileNo');
  }

  // tslint:disable-next-line:typedef
  get address() {
    return this.person.get('address');
  }

  // tslint:disable-next-line:typedef
  get perDocTypeCode() {
    return this.person.get('perDocTypeCode');
  }

  // tslint:disable-next-line:typedef
  get perDocNo() {
    return this.person.get('perDocNo');
  }

  // tslint:disable-next-line:typedef
  get issueDate() {
    return this.person.get('issueDate');
  }

  // tslint:disable-next-line:typedef
  get issuePlace() {
    return this.person.get('issuePlace');
  }

  // tslint:disable-next-line:typedef
  get nationalityCode() {
    return this.person.get('nationalityCode');
  }

  // tslint:disable-next-line:typedef
  get expireDate() {
    return this.person.get('expireDate');
  }

  // tslint:disable-next-line:typedef
  get feeAmount() {
    return this.CreateCardForm.get('feeAmount');
  }

  dateValidator(form: FormGroup): ValidationErrors | null {
    const dateOfBirth = form.controls.dateOfBirth.value;
    const issueDate = form.controls.issueDate.value;
    const dayDif = moment(dateOfBirth).diff(issueDate, 'day');
    return (dayDif >= 1) ? { validateDate: true } : null;
  }

  phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
    const prefixPhoneNumber = control.value.toString().substring(0, 3);
    if (!PREFIX_MOBILE_NUMBER.includes(prefixPhoneNumber)) {
      return { inValidPrefix: true };
    }
    return null;
  }

  cmndValidator(control: AbstractControl): ValidationErrors | null {
    const perDocNo = control.value;
    if (perDocNo) {
      if (perDocNo.length === 9 || perDocNo.length === 12) {
        return null;
      } else {
        return { invalidLength: true };
      }

    }
    return null;
  }

  accountLinkValidator(form: FormGroup): ValidationErrors | null {
    const accountLinkList = form.controls.accountLinkList.value;
    const accountId = form.controls.accountId.value;
    // console.log(accountId, accountLinkList); // prints indexes: 0, 1, 2, 3
    if (accountId && accountLinkList.length > 0) {

      for (const item of accountLinkList) {
        // console.log(item.accountId, accountId); // prints indexes: 0, 1, 2, 3
        if (item.accountId === accountId) {
          return { isDuplicateAccount: true };
        }
      }
    }
    return null;
  }


  blurDateOfBirth(evt): void {
    if (!this.dpDateOfBirth.haveValue()) {
      // this.dpDateOfBirth.setErrorMsg('Ngày sinh không được để trống22');
      this.dateOfBirth.markAsTouched();
    }
    // this.dateOfBirth.markAsTouched();
  }

  blurIssueDate(evt): void {
    if (!this.dpIssueDate.haveValue()) {
      // this.dpIssueDate.setErrorMsg('Ngày sinh không được để trống22');
      this.issueDate.markAsTouched();
    }
  }

  blurExpireDate(evt): void {
    if (!this.dpExpireDate.haveValue()) {
      // this.dpIssueDate.setErrorMsg('Ngày sinh không được để trống22');
      this.expireDate.markAsTouched();
    }

  }

  dateOfBirthChanged(): void {

    if (this.dpDateOfBirth.getValue()) {
      if (!this.dpDateOfBirth.haveValidDate()) {
        this.dateOfBirth.setErrors({ invalidFormatDate: true });
      } else {
        this.dateOfBirth.patchValue(moment(this.dpDateOfBirth.getSelectedDate(), 'DD/MM/YYYY'));
      }

    } else {
      this.dateOfBirth.patchValue('');
    }
    // this.dateOfBirth.patchValue(moment(this.dpDateOfBirth.getSelectedDate(), 'DD/MM/YYYY'));
    // this.validateDateOfBirth();
  }

  issueDateChanged(): void {
    if (this.dpIssueDate.getValue()) {
      if (!this.dpIssueDate.haveValidDate()) {
        this.issueDate.setErrors({ invalidFormatDate: true });
      } else {
        this.issueDate.patchValue(moment(this.dpIssueDate.getSelectedDate(), 'DD/MM/YYYY'));
      }

    } else {
      this.issueDate.patchValue('');
    }
    // this.validateDateOfBirth();
  }

  expireDateChanged(): void {

    if (this.dpExpireDate.getValue()) {
      if (!this.dpExpireDate.haveValidDate()) {
        this.expireDate.setErrors({ invalidFormatDate: true });
      } else {
        this.expireDate.patchValue(moment(this.dpExpireDate.getSelectedDate(), 'DD/MM/YYYY'));
      }

    } else {
      this.expireDate.patchValue('');
    }

    // this.validateDateOfBirth();
  }

  valuesChange(): void {
    this.perDocTypeCode.valueChanges.subscribe(value => {

      if (value === this.CUSTOMER_TYPE.CMND) {
        this.perDocNo.setValidators([Validators.required, this.cmndValidator, Validators.pattern(/^-?([0-9]\d*)?$/)]);
      } else if (value === 'CAN CUOC CONG DAN') {
        this.perDocNo.setValidators([Validators.required, Validators.maxLength(12), Validators.minLength(12), Validators.pattern(/^-?([0-9]\d*)?$/)]);
      } else if (value === 'HO CHIEU') {
        this.perDocNo.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]);
      } else if (value === 'GIAY KHAI SINH') {
        this.perDocNo.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9]*$/)]);
      }
      this.issuePlaceDefaultValue();
      this.issueDateValidator();
      // this.checkPerDocNoByAge(age, moment(issueDate).year());
      this.calculateExpireDate();
    });
    this.dateOfBirth.valueChanges.subscribe(value => {
      this.issueDateValidator();
      this.calculateExpireDate();
    });

    this.issueDate.valueChanges.subscribe(value => {
      this.issueDateValidator();
      this.issuePlaceDefaultValue();
      this.calculateExpireDate();
    });

    this.fullName.valueChanges.subscribe(value => {
      this.cardHolderName.patchValue(value);
    });
  }

  calculateExpireDate(): void {
    const perDocTypeDoc = this.perDocTypeCode.value;
    const issueDate = this.issueDate.value;
    const dateOfBirth = this.dateOfBirth.value;
    this.expireDate.setValidators([Validators.required]);

    if (perDocTypeDoc === this.CUSTOMER_TYPE.CMND) {
      if (issueDate) {
        this.dpExpireDate.setValue(moment(issueDate).add(15, 'y').format('DD/MM/YYYY'));
      }
      this.dpExpireDate.disable();
    } else if (perDocTypeDoc === this.CUSTOMER_TYPE.CCCD) {
      if (dateOfBirth) {
        const age = moment().diff(dateOfBirth, 'years');
        if (age <= 25) {
          this.dpExpireDate.setValue(moment(dateOfBirth).add(25, 'y').format('DD/MM/YYYY'));
        } else if (age > 25 && age <= 40) {
          this.dpExpireDate.setValue(moment(dateOfBirth).add(40, 'y').format('DD/MM/YYYY'));
        } else if (age > 40 && age <= 60) {
          this.dpExpireDate.setValue(moment(dateOfBirth).add(60, 'y').format('DD/MM/YYYY'));
        } else {
          this.expireDate.clearValidators();
          this.dpExpireDate.setValue('');
        }
      }
      this.dpExpireDate.disable();
    } else {
      this.dpExpireDate.enable();
    }
  }

  issueDateValidator(): void {
    const perDocTypeCode = this.perDocTypeCode.value;
    const dateOfBirth = this.dateOfBirth.value;
    const issueDate = this.issueDate.value;
    const age = moment(issueDate).diff(dateOfBirth, 'years');
    if (perDocTypeCode === this.CUSTOMER_TYPE.CCCD) {
      const day = moment('1/1/2016', 'DD/MM/YYYY').diff(issueDate, 'day');
      if (day > 0) {
        this.issueDate.setErrors({ issueDateInValid: true });
      } else {
        this.issueDate.setErrors(null);
      }
    } else if (perDocTypeCode === this.CUSTOMER_TYPE.HO_CHIEU) {

    } else if (perDocTypeCode === this.CUSTOMER_TYPE.CMND) {
      if (age < 14) {
        this.perDocTypeCode.setErrors({ invalidAge: true });
      } else {
        this.perDocTypeCode.setErrors(null);
      }
      if (moment(issueDate).year() < 1920) {
        this.issueDate.setErrors({ invalidYear: true });
      } else {
        this.issueDate.setErrors(null);
      }
    }
  }


  issuePlaceDefaultValue(): void {
    const issueDate = moment(this.issueDate.value);
    const perDocTypeDoc = this.perDocTypeCode.value;
    const fromDate = moment('01/01/2016', 'DD/MM/YYYY');
    const toDate = moment('10/10/2018', 'DD/MM/YYYY');

    if (perDocTypeDoc === this.CUSTOMER_TYPE.CCCD) {
      if (issueDate.isBetween(fromDate, toDate)) {
        this.issuePlace.setValue('CCS ĐKQL CT và DLQG về DC');
        this.issuePlace.disable();
      } else if (issueDate.diff(toDate, 'day') >= 0) {
        this.issuePlace.setValue('CCS QLHC về TTXH');
        this.issuePlace.disable();
      }
    } else if (perDocTypeDoc === this.CUSTOMER_TYPE.HO_CHIEU) {
      this.issuePlace.enable();
      this.issuePlace.setValue('Cục Quản lý XNC');
    } else if (perDocTypeDoc === this.CUSTOMER_TYPE.CMND) {
      this.issuePlace.enable();
      this.issuePlace.setValue('Công An Tỉnh ' + this.userCityName);
    } else {
      this.issuePlace.enable();
      this.issuePlace.setValue('');
    }

  }

  /**
   * Bắt lỗi nhập ngày tháng năm sinh
   */
  validateDateOfBirth(): void {
    // this.dpDateOfBirth.setErrorMsg('');
    // const contentInputDateOfBirth = this.dpDateOfBirth.haveValue() ? this.dpDateOfBirth.getValue()
    //   : '';
    // if (contentInputDateOfBirth === '') {
    //   this.dpDateOfBirth.setErrorMsg('Ngày sinh không được để trống');
    //   return;
    // }
    // if (!this.dpDateOfBirth.haveValidDate()) {
    //   this.dpDateOfBirth.setErrorMsg('Ngày sinh sai định dạng');
    //   return;
    // }
    // // tslint:disable-next-line:prefer-const
    // let tmpDate = moment(this.dpDateOfBirth.getSelectedDate(), 'DD/MM/YYYY');
    // if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
    //   this.dpDateOfBirth.setErrorMsg('Ngày sinh không được chọn ngày tương lai');
    //   return;
    // }

    // this.dateOfBirthChange.emit(moment(this.dpDateOfBirth.getSelectedDate(), 'DD/MM/YYYY'));

  }

  validateGTXM(group: FormGroup): ValidationErrors | null {
    // console.log('testtt');


    return null;
  }
  /**
   *  kiểm tra user ấy có phải là người tạo hay ko
   */
  checkEditable(isSendApprove): void {

  }

  categoriesLoader(): void {
    this.category.getIndustries().subscribe(data => this.categories.industries = data);
    this.category.getCountries().subscribe(data => {
      this.categories.countries = data;
      // this.viewCountry = this.categories.countries.filter(e => e.code === 'VN' || e.id === 'VN');
    });
    this.category.getApiFATCA().subscribe(data => this.categories.fatca = data);
    this.category.getPerDocTypes().subscribe(data => {
      this.categories.perDocTypes = data;
    });
    this.category.getCities().subscribe(data => {
      this.categories.cites = data;
      this.categories.permanentCites = data;
    });
    this.category.getPerDocPlace().subscribe(data => {
      this.options = data;
      // this.categories.perDocPlaces = data;
    });
  }

  listGender(): void {
    const g = new CommonCard();
    this.cardService.getGender().subscribe(
      data => {
        if (data.items) {
          this.g = data.items;
        }
      }
    );
  }

  listPerDocType(): void {
    const per = new CommonCard();
    this.cardService.getPerDocType(per).subscribe(
      data => {
        if (data.items) {
          this.per = data.items.filter(e => e.statusCode === 'A');

        }
      }
    );
  }

  detail(id): void {
    const c = new Card();
    c.id = id;
    this.cardService.detailCard(id).subscribe(
      data => {
        if (data.item) {
          this.card = data.item;
          this.cardId = data.item.id;
          this.cardTypeCode = data.item.cardTypeCode;
          this.contractNumber = data.item.contractNumber;
          // this.cardHolderName.patchValue(data.item.cardHolderName);
          this.accountId = data.item.accountId;
          this.getAccountLinkedList(this.processId);
          this.getAccountID.setValue(data.item.accountId);
        }

      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }

  subCarddetail(id): void {
    const c = new Card();
    c.id = id;
    // id = '4a9eb7cf-7e28-4312-8942-237c4cea9eab'
    this.supCardService.detailSupCard(id).subscribe(
      data => {
        if (data.item) {
          this.card = data.item;
          this.accountId = data.item.accountId;
          // this.id = data.item.id;
          this.cardId = data.item.cardId;
          this.processId = data.item.processId;
          this.cardTypeCode = data.item.cardTypeCode;
          this.accountId = data.item.accountId;

          // data.item.person.dateOfBirth = this.datePipe.transform(, 'yyyy-MM-dd');
          // data.item.person.issueDate = this.datePipe.transform(moment(data.item.person.issueDate, 'dd/MM/yyyy'), 'yyyy-MM-dd');
          this.CreateCardForm.patchValue(data.item);
          if (this.dpDateOfBirth) {
            this.dpDateOfBirth.setValue(data.item.person.dateOfBirth);
            this.dpIssueDate.setValue(data.item.person.issueDate);
            this.dpExpireDate.setValue(data.item.person.expireDate);
          } else {
            this.subCarddetail(id);
          }

          this.issuePlace.setValue(data.item.person.issuePlace);
          // this.getAccountLinkedList(this.processId);
          data.item.accountLinkList.forEach(element => {
            const group = new FormGroup({
              accountId: new FormControl(element.accountId, { updateOn: 'blur' }),
            });
            this.accountLinkList.push(group);
          });
          if (this.accountLinkList.length <= 0) {
            this.addAccountLink();
          }
          if (data.item.processIntegrated.statusCode === this.SERVICE_STATUS.DA_DUYET) {
            this.deliveryTypeCode.disable();
            this.deliveryChanelCode.disable();
            this.deliveryAddress.disable();
            this.employeeId.disable();
            this.referrerCode.disable();
            this.deliveryBranchCode.disable();
          }

        }
      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }

  backPage(): void {
    this._LOCATION.back();
  }

  getAccountLinkedList(processId): void {
    this.accountService.getAccountLinkList({ processId: this.processId }).subscribe(
      data => {
        if (data.items) {
          this.bidingAcount = data.items;
          this.account = data.items;
        }
      }
    );
  }

  getCardDetail(cardId): void {
    const c = new Card();
    c.id = this.cardId;
    this.cardService.detailCard(cardId).subscribe(
      data => {
        if (data.item) {
          this.card1 = data.item;
        }
      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }

  getDeliveryType(processId): void {
    this.cardService.getListDeliveryType().subscribe(
      data => {
        if (data.items) {
          this.deliveryType = data.items;
          // console.log('hình thức phát hành', this.deliveryType);
        }
      }
    );
  }

  getFormValidationErrors(): void {
    Object.keys(this.CreateCardForm.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.CreateCardForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          // console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          this.notificationService.showError(key + ' ' + keyError, 'Lỗi thông tin không hợp lệ');
        });
      }
    });
  }
  actionSave(isSendApprove): void {
    this.submitted = true;
    setTimeout(() => {
      this.loading = false;
    }, 1500);
    this.CreateCardForm.controls.processId.setValue(this.p2);
    this.CreateCardForm.controls.contractNumber.setValue(this.contractNumber);
    this.CreateCardForm.controls.cardId.setValue(this.cardId);
    this.CreateCardForm.controls.accountId.setValue(this.accountId);
    this.CreateCardForm.controls.cardTypeCode.setValue(this.cardTypeCode);

    if (this.CreateCardForm.invalid) {
      this.getFormValidationErrors();
      return;
    }
    this.objCardNew = this.CreateCardForm.getRawValue();
    this.objCardNew.accountLinkList.forEach(item => {
      return item.accountId;
    });
    const dateOfBirthClone = this.objCardNew.person.dateOfBirth;
    const isseDateClone = this.objCardNew.person.issueDate;


    this.objCardNew.person.dateOfBirth = moment(this.objCardNew.person.dateOfBirth).format('DD/MM/YYYY');
    this.objCardNew.person.issueDate = moment(this.objCardNew.person.issueDate).format('DD/MM/YYYY');
    this.objCardNew.person.expireDate = moment(this.objCardNew.person.expireDate).format('DD/MM/YYYY');
    this.objCardNew.cardProductCode = this.card.cardProductCode;

    if (this.subCardId) {
      this.objCardNew.id = this.subCardId;
      this.cardSubService.updateSubCard(this.objCardNew).subscribe(rs => {
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < rs.responseStatus.codes.length; index++) {
          if (rs.responseStatus.success) {
            if (isSendApprove) {
              const request = {
                id: this.subCardId,
                typeCode: this.SERVICE_NAME.SUPCARD
              };
              this.helpService.callApi({
                method: HTTPMethod.POST,
                url: '/process/process/sendApproveOne',
                data: request,
                progress: true,
                // tslint:disable-next-line:no-shadowed-variable
                success: (res) => {
                  if (res && res.responseStatus.success) {
                    this.notificationService.showSuccess('Gửi duyệt thẻ thành công', '');
                    setTimeout(() => {
                      this.router.navigate(['smart-form/manager/infor-sup-card/' +
                        this.subCardId + '/' + this.cardId + '/' + this.processId]);
                      this.loading = true;
                    }, 1000);
                  } else {
                    this.notificationService.showError('Gửi duyệt thẻ thất bại', 'Lỗi gửi duyệt thẻ`');
                  }
                }
              });
            } else {
              this.notificationService.showSuccess('Cập nhật thẻ thành công', '');
              setTimeout(() => {
                this.router.navigate(['smart-form/manager/infor-sup-card/' +
                  this.subCardId + '/' + this.cardId + '/' + this.processId]);
                this.loading = true;
              }, 1000);
            }

          } else {
            this.notificationService.showError('Cập nhật thẻ thất bại', '');
            this.loading = false;
          }
        }
      }, err => {
      });
    } else {
      this.cardSubService.createSubCard(this.objCardNew).subscribe(rs => {
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < rs.responseStatus.codes.length; index++) {
          if (rs.responseStatus.success) {
            if (isSendApprove) {
              const request = {
                id: rs.item.id,
                typeCode: this.SERVICE_NAME.SUPCARD
              };
              this.helpService.callApi({
                method: HTTPMethod.POST,
                url: '/process/process/sendApproveOne',
                data: request,
                progress: true,
                // tslint:disable-next-line:no-shadowed-variable
                success: (res) => {
                  if (res && res.responseStatus.success) {
                    this.notificationService.showSuccess('Gửi duyệt thẻ thành công', '');
                    setTimeout(() => {
                      // this.router.navigate(['./smart-form/manager/sup-card', {processId: this.processId, id: this.cardId}]);
                      this.router.navigate(['smart-form/manager/infor-sup-card/' +
                        rs.item.id + '/' + this.cardId + '/' + this.processId]);
                    }, 1000);
                  } else {
                    this.notificationService.showError('Gửi duyệt thẻ thất bại', 'Lỗi gửi duyệt thẻ`');
                  }
                }
              });
            } else {
              this.notificationService.showSuccess('Thêm mới thẻ thành công', '');
              setTimeout(() => {
                // this.router.navigate(['./smart-form/manager/sup-card', {processId: this.processId, id: this.cardId}]);
                this.router.navigate(['smart-form/manager/infor-sup-card/' +
                  rs.item.id + '/' + this.cardId + '/' + this.processId]);
              }, 1000);
            }

          } else if (rs.responseStatus.codes[index].code === '400') {
            this.notificationService.showError('một thẻ chính chỉ được thêm tối đa hai thẻ phụ', 'Lỗi thêm mới thẻ');
          } else {
            this.notificationService.showError('Thêm mới thẻ thất bại', '');
          }
        }
      });
    }
  }
  save(isSendApprove): void {
    if (this.customerCode) {
      const body = {
        processId: this.processId,
        customerCode: this.customerCode
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/process/process/checkEditable',
          data: body,
          progress: true,
          success: (res) => {
            if (res && res.responseStatus.success) {
              if (res.item.editable) {
                this.actionSave(isSendApprove);
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.actionSave(isSendApprove);
    }
  }

  getBranch(): void {
    this.cardService.getListBranch().subscribe(
      data => {
        if (data.items) {
          this.branch = data.items;
        }
      }
    );
  }


  getProcessInformation(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    // processId='fd063016-74c6-48da-a366-aa2b599c933b'
    this.cifService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.process.item = data.item;
        this.customerCode = this.process.item.customerCode;
        const currentWardName = data.item.customer.person.currentWardName;
        const currentCityName = data.item.customer.person.currentCityName;
        const currentStreetNumber = data.item.customer.person.currentStreetNumber;
        const currentDistrictName = data.item.customer.person.currentDistrictName;
        const name = data.item.customer.person.fullName;
        const name2 = this.toNoSign(name).toUpperCase();
        // console.log('process', this.process.item);
        if (!this.subCardId) {
          this.deliveryAddress.patchValue(currentStreetNumber + ', ' + currentWardName + ', ' + currentDistrictName + ', ' + currentCityName);
        }

        // this.cardHolderName.patchValue(name2)
      }
    }, error => {
    }, () => {
    }
    );
  }

  inputLatinUppercase(evt): void {
    let content = (evt.target.value.length === 1) ? evt.target.value.trim() : evt.target.value;
    content = this.toNoSign(content);
    content = content.replace(RG_FULLNAME_CORE, '');

    this.fullName.patchValue(content);
  }

  inputLatinUppercaseCardHolder(evt): void {
    let content = (evt.target.value.length === 1) ? evt.target.value.trim() : evt.target.value;
    content = this.toNoSign(content);
    content = content.replace(RG_FULLNAME_CORE, '');
    content = content.toUpperCase();
    this.cardHolderName.patchValue(content);
  }

  toNoSign(value): any {
    if (value === '') {
      return '';
    }
    let str = value;
    str = str.replace(/Á|À|Ạ|Ả|Ã|Â|Ấ|Ầ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/É|È|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Í|Ì|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ú|Ù|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ý|Ỳ|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/1|2|3|4|5|6|7|8|9|0|-|=|/g, '');
    str = str.replace(/~|`|^|!|($)|@|#|%|&|(|)|_|/g, '');
    str = str.replace(/,|<|>|'|;|'|:|/g, '');
    // console.log('after ', str);
    return str;
  }

  addAccountLink(): void {
    const group = new FormGroup({
      accountId: new FormControl('', { updateOn: 'blur' }),
    });

    this.accountLinkList.push(group);
  }

  removeAccountLink(index: number): void {
    this.accountLinkList.removeAt(index);
  }

}

function isAccountLinkDup() {
  const validator: ValidatorFn = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      .map(control => control.value);
    const names = totalSelected.map(value => value.accountId);
    const hasDuplicate = names.some(
      (name, index) => names.indexOf(name, index + 1) !== -1
    );
    return hasDuplicate ? { duplicate: true } : null;
  };
  return validator;
}

