import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListAccount } from 'src/app/_models/card/Account';
import { Branch } from 'src/app/_models/card/Branch';
import { Card } from 'src/app/_models/card/Card';
import { CommonCard } from 'src/app/_models/card/CommonCard';
import { DeliveryType } from 'src/app/_models/card/deliveryType';
import { CardService } from 'src/app/_services/card/card.service';
import { SubCardService } from 'src/app/_services/card/sub-card.service';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { CardSubUpdate } from 'src/app/_models/card/subCard/CardSubUpdate';
import { CifCondition } from 'src/app/_models/cif';
import { ProcessService } from 'src/app/_services/process.service';
import { Process } from 'src/app/_models/process/Process';
import { CardDetailOutputDTOUVoCaChcNngChiTitCaThChnh } from 'src/app/_models/card/cardDetailOutputDTOUVoCaChcNngChiTitCaThChnh';
import { Category } from '../../../../_models/category/category';
import { futureDate1 } from 'src/app/_validator/cif.register.validator';
import { ErrorMessage } from 'src/app/_utils/ErrorMessage';
import { CategoryService } from 'src/app/_services/category/category.service';
import * as moment from 'moment';
import { GlobalConstant } from 'src/app/_utils/GlobalConstant';
import { map, startWith } from 'rxjs/operators';
import { CategoryList } from 'src/app/_models/category/categoryList';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';
import { MissionService } from 'src/app/services/mission.service';
declare var $: any;

@Component({
  selector: 'app-update-sup-card',
  templateUrl: './update-sup-card.component.html',
  styleUrls: ['./update-sup-card.component.css']
})
export class UpdateSupCardComponent implements OnInit {
  ERROR_MESSAGE = ErrorMessage;
  PROCESS_STATUS = GlobalConstant.PROCESS_STATUS;
  loading = false;
  @ViewChild('multiSelect') multiSelect;
  id = '';
  cardId = '';
  accountId = '';
  cardTypeCode = '';
  contractNumber = '';
  options: Category[] = [];
  card: CardDetailOutputDTOUVoCaChcNngChiTitCaThChnh[];
  cardMain: Card[];
  products: any[];
  obj: CardSubUpdate = new CardSubUpdate();
  card1: Card = new Card();
  g: CommonCard[];
  per: CommonCard[];
  account: ListAccount[];
  deliveryType: DeliveryType[];
  submitted = false;
  branch: Branch[];
  processId;
  process: Process = new Process();
  accountCLone = [];
  categories: CategoryList = new CategoryList();
  filteredOptions: Observable<Category[]>[] = [];
  i: number;
  roleLogin: any;
  isKSV: boolean;
  isGDV: boolean;
  constructor(
    private _LOCATION: Location,
    private route: ActivatedRoute,
    private cardService: CardService,
    private router: Router,
    private cardSubService: SubCardService,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService,
    private supCardService: SubCardService,
    private cifService: ProcessService,
    private category: CategoryService,
    private missionService: MissionService,
  ) { }
  ngOnInit(): void {
    $('.childName').html('Cập nhật thẻ phụ');
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.cardId = paramMap.get('cardId');
      this.processId = paramMap.get('processId');
      this.getProcessInformation(paramMap.get('processId'));
    });
    this.detail(this.id);
    this.getCardDetail(this.cardId);
    this.listGender();
    this.listPerDocType();
    this.getBranch();
    this.getDeliveryType();
    this.categoriesLoader();
    this.missionService.setProcessId(this.processId);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;
      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
  }

  // tslint:disable-next-line:member-ordering
  UpdateSupCardForm = new FormGroup({
    id: new FormControl(this.id),
    cardId: new FormControl(this.cardId),
    accountId: new FormControl(this.accountId, [Validators.required]),
    cardTypeCode: new FormControl(this.cardTypeCode),
    accountLinkList: new FormControl([], [Validators.maxLength(3)]),
    employeeId: new FormControl('', [Validators.required]),
    referrerCode: new FormControl('', [Validators.required]),
    cardHolderName: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
    deliveryTypeCode: new FormControl('DEFAULT', [Validators.required]),
    deliveryChanelCode: new FormControl('TAI_CHI_NHANH'),
    deliveryBranchCode: new FormControl(''),
    deliveryAddress: new FormControl('',),
    person: new FormGroup({
      fullName: new FormControl('', [Validators.required, Validators.maxLength(35)]),
      dateOfBirth: new FormControl('', [Validators.required, futureDate1]),
      genderCode: new FormControl('M', Validators.required),
      mobileNo: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
      address: new FormControl('',),
      perDocTypeCode: new FormControl('', Validators.required),
      perDocNo: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      issueDate: new FormControl('', [Validators.required, futureDate1]),
      issuePlace: new FormControl('', Validators.required),
      expireDate: new FormControl(''),
      nationalityCode: new FormControl('VN',)
    }, { validators: [this.validateGTXM, this.dateValidator] }),
    actionCode: new FormControl('C',),
    cardIssueFeeTypeCode: new FormControl('YC01'),
    cardNumber: new FormControl('', [Validators.maxLength(16)]),
  });

  // tslint:disable-next-line:member-ordering
  acc = this.UpdateSupCardForm.get('accountLinkList') as FormArray;
  // tslint:disable-next-line:typedef
  get getProcessId() { return this.UpdateSupCardForm.get('processId'); }
  // tslint:disable-next-line:typedef
  get getAccountID() { return this.UpdateSupCardForm.get('accountId'); }
  // tslint:disable-next-line:typedef
  get deliveryTypeCode() { return this.UpdateSupCardForm.get('deliveryTypeCode'); }
  // tslint:disable-next-line:typedef
  get accountLinkList() { return this.UpdateSupCardForm.get('accountLinkList'); }
  // tslint:disable-next-line:typedef
  get employeeId() { return this.UpdateSupCardForm.get('employeeId'); }
  // tslint:disable-next-line:typedef
  get referrerCode() { return this.UpdateSupCardForm.get('referrerCode'); }
  // tslint:disable-next-line:typedef
  get cardHolderName() { return this.UpdateSupCardForm.get('cardHolderName'); }
  // tslint:disable-next-line:typedef
  get deliveryChanelCode() { return this.UpdateSupCardForm.get('deliveryChanelCode'); }
  // tslint:disable-next-line:typedef
  get deliveryBranchCode() { return this.UpdateSupCardForm.get('deliveryBranchCode'); }
  // tslint:disable-next-line:typedef
  get deliveryAddress() { return this.UpdateSupCardForm.get('deliveryAddress'); }
  // tslint:disable-next-line:typedef
  get cardNumber() { return this.UpdateSupCardForm.get('cardNumber'); }
  // tslint:disable-next-line:typedef
  get person() { return this.UpdateSupCardForm.get('person'); }
  // tslint:disable-next-line:typedef
  get fullName() { return this.person.get('fullName'); }
  // tslint:disable-next-line:typedef
  get dateOfBirth() { return this.person.get('dateOfBirth'); }
  // tslint:disable-next-line:typedef
  get genderCode() { return this.person.get('genderCode'); }
  // tslint:disable-next-line:typedef
  get mobileNo() { return this.person.get('mobileNo'); }
  // tslint:disable-next-line:typedef
  get address() { return this.person.get('address'); }
  // tslint:disable-next-line:typedef
  get perDocTypeCode() { return this.person.get('perDocTypeCode'); }
  // tslint:disable-next-line:typedef
  get perDocNo() { return this.person.get('perDocNo'); }
  // tslint:disable-next-line:typedef
  get issueDate() { return this.person.get('issueDate'); }
  // tslint:disable-next-line:typedef
  get issuePlace() { return this.person.get('issuePlace'); }
  // tslint:disable-next-line:typedef
  get nationalityCode() { return this.person.get('nationalityCode'); }
  // tslint:disable-next-line:typedef
  get expireDate() { return this.person.get('expireDate'); }

  checkDates(group: FormGroup): { notValid: boolean; } {
    if (group.controls.issueDate.value < group.controls.dateOfBirth.value) {
      return { notValid: true };
    }
    return null;
  }

  dateValidator(form: FormGroup): ValidationErrors | null {
    const dateOfBirth = form.controls.dateOfBirth.value;
    const issueDate = form.controls.issueDate.value;
    const dayDif = moment(dateOfBirth).diff(issueDate, 'day');
    // console.log(dayDif);
    return (dayDif >= 1) ? { validateDate: true } : null;
  }

  validateGTXM(group: FormGroup): ValidationErrors | null {
    if (group.controls.perDocTypeCode.value === 'CHUNG MINH NHAN DAN') {
      group.controls.perDocNo.setValidators([Validators.required, Validators.minLength(9) || Validators.maxLength(12)]);

    } else if (group.controls.perDocTypeCode.value === 'CAN CUOC CONG DAN') {
      group.controls.perDocNo.setValidators([Validators.required, Validators.maxLength(12), Validators.minLength(12)]);
    } else if (group.controls.perDocTypeCode.value === 'HO CHIEU') {
      group.controls.perDocNo.setValidators([Validators.required, Validators.pattern(/^[0-9]\d*$/)]);
    } else if (group.controls.perDocTypeCode.value === 'GIAY KHAI SINH') {
      group.controls.perDocNo.setValidators([Validators.required, Validators.pattern(/^[0-9]\d*$/)]);
    }

    return null;
  }

  managerNameControl(index: number): void {
    this.filteredOptions[index] = this.issuePlace.valueChanges
      .pipe(
        startWith<string | Category>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
    this.issuePlace.valueChanges.subscribe(data => {
      let expiredDate = '';
      let isDisableIssuedate = false;
      let isDisableExpireddate = false;
      if (data.perDocTypeCode === GlobalConstant.CUSTOMER_TYPE.CMND && data.issueDate) {
        expiredDate = data.issueDate.clone().add(15, 'y');
      } else if (data.perDocTypeCode === GlobalConstant.CUSTOMER_TYPE.HO_CHIEU) {
        const nationalCode = this.nationalityCode.value;
        if (nationalCode === 'VN') {
          if (data.issueDate) {
            expiredDate = data.issueDate.clone().add(10, 'y');
          }
        } else {
          isDisableExpireddate = false;
        }

      } else if (data.perDocTypeCode === GlobalConstant.CUSTOMER_TYPE.CCCD_2) {
        if (this.person.get('dateOfBirth').value) {
          const age = moment().diff(this.person.get('dateOfBirth').value, 'years');
          const dateOfBirth = this.person.get('dateOfBirth').value.clone();
          if (age < 14) {
            isDisableIssuedate = true;
            isDisableExpireddate = true;
          } else if (age < 25 && age >= 14) {
            expiredDate = dateOfBirth.add(25, 'y');
          } else if (age >= 25 && age < 40) {
            expiredDate = dateOfBirth.add(40, 'y');
          } else if (age >= 40) {
            expiredDate = dateOfBirth.add(60, 'y');
          }
        }
      } else {
        isDisableExpireddate = true;
      }
      if (isDisableIssuedate) {
        this.issueDate.disable({ emitEvent: false, onlySelf: true });
        this.issueDate.setValue(null, { emitEvent: false, onlySelf: true });
      } else {
        this.issueDate.enable({ emitEvent: false, onlySelf: true });
      }
      if (isDisableExpireddate) {
        this.expireDate.disable({ emitEvent: false, onlySelf: true });
        this.expireDate.setValue(null, { emitEvent: false, onlySelf: true });
      } else {
        this.expireDate.enable({ emitEvent: false, onlySelf: true });
      }
      const expiredDateLeft = moment().diff(expiredDate, 'years');

      // if (expiredDate && expiredDateLeft > 0) {
      //   this.perDocNoList.at(index)
      //     .get('isDisplayWarning').setValue(true, {onlySelf: true, emitEvent: false});
      // } else {
      //   this.perDocNoList.at(index)
      //     .get('isDisplayWarning').setValue(false, {onlySelf: true, emitEvent: false});
      // }
      // this.perDocNoList.at(index)
      //   .get('expireDate').setValue(expiredDate, {onlySelf: true});
    }
    );
  }

  private _filter(name): Category[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
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

  backPage(): void {
    this._LOCATION.back();
  }
  listGender(): void {
    const g = new CommonCard();
    this.cardService.getGender().subscribe(
      data => {
        if (data.items) {
          this.g = data.items;
          // console.log(this.g);
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
          console.log(this.per);

        }
      }
    );
  }
  getAccountLinkedList(processId): void {
    const acc = new ListAccount();
    acc.processId = processId;
    this.cardService.getAccountList(processId).subscribe(
      data => {
        if (data.items) {
          this.account = data.items.filter(e => e.currencyCode === 'VND' && e.id !== this.accountId);
          this.account.forEach(element => {
            this.accountCLone.push({
              accountId: element.id,
              accountNumber: element.accountNumber,
              accountIndex: element.accountIndex
            });
          });
        }
        console.log('getAccountLinkedList');
      }
    );
  }
  detail(id): void {
    const c = new Card();
    c.id = id;
    // id = '4a9eb7cf-7e28-4312-8942-237c4cea9eab'
    this.supCardService.detailSupCard(id).subscribe(
      data => {
        if (data.item) {
          this.card = data.item;
          this.accountId = data.item.accountId;
          this.id = data.item.id;
          this.cardId = data.item.cardId;
          this.processId = data.item.processId;
          this.cardTypeCode = data.item.cardTypeCode;
          this.accountId = data.item.accountId;
          this.UpdateSupCardForm.patchValue(data.item);
          this.getAccountLinkedList(this.processId);
          this.accountLinkList.setValue([]);
          // tslint:disable-next-line:only-arrow-functions
          const test = data.item.accountLinkList.sort(function (a, b): number {
            return a.account.accountIndex - b.account.accountIndex;
          });
          const dsadasda = [];
          test.forEach(element => {
            dsadasda.push(element.accountId);
          });
          this.accountLinkList.setValue(dsadasda);

        }
      }, error => {
        this.errorHandler.showError(error);
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

  getProcessInformation(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    // processId='fd063016-74c6-48da-a366-aa2b599c933b'
    this.cifService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.process.item = data.item;
        const currentWardName = data.item.customer.person.currentWardName;
        const currentCityName = data.item.customer.person.currentCityName;
        const currentStreetNumber = data.item.customer.person.currentStreetNumber;
        const currentDistrictName = data.item.customer.person.currentDistrictName;
        const name = data.item.customer.person.fullName;
        const name2 = this.toNoSign(name).toUpperCase();
        console.log('process', this.process.item);
        this.deliveryAddress.patchValue(currentStreetNumber + ', ' + currentWardName + ', ' + currentDistrictName + ', ' + currentCityName);
        this.cardHolderName.patchValue(name2);
      }
    }, error => {
    }, () => { }
    );
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
  getDeliveryType(): void {
    const deli = new DeliveryType();
    this.cardService.getListDeliveryType().subscribe(
      data => {
        if (data.items) {
          this.deliveryType = data.items;
          // console.log('hình thức phát hành', this.deliveryType);
        }
      }
    );
  }
  a(value): void {
    console.log(value);
    if (value !== 'CAN CUOC CONG DAN') {
      this.perDocNo.setValue('');
    }
  }
  update(): void {
    this.submitted = true;
    this.loading = true;
    this.UpdateSupCardForm.controls.id.setValue(this.id);
    this.UpdateSupCardForm.controls.cardId.setValue(this.cardId);
    this.UpdateSupCardForm.controls.accountId.setValue(this.accountId);
    this.UpdateSupCardForm.controls.cardTypeCode.setValue(this.cardTypeCode);

    if (this.UpdateSupCardForm.invalid) {
      return;
    }
    this.obj = this.UpdateSupCardForm.value;
    const accountLinkListData = [];
    this.accountLinkList.value.forEach(element => {
      accountLinkListData.push({
        accountId: element
      });
    });
    this.obj.accountLinkList = accountLinkListData;
    this.cardSubService.updateSubCard(null).subscribe(rs => {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < rs.responseStatus.codes.length; index++) {
        if (rs.responseStatus.success) {
          this.notificationService.showSuccess('Cập nhật thẻ thành công', '');
          setTimeout(() => {
            this.router.navigate(['smart-form/manager/infor-sup-card/' +
              this.UpdateSupCardForm.value.id + '/' + this.cardId + '/' + this.processId]);
            this.loading = true;
          }, 1000);
        } else {
          this.notificationService.showError('Cập nhật thẻ thất bại', '');
          this.loading = false;
        }
      }
    }, err => {
    });
  }



  inputLatinUppercase(event): void {
    // this.handleCustomInput(event.target, event);
    event.target.value = this.toNoSign(event.target.value);
  }
  // chuyển tiếng việt thành tiếng latin, vd: NGUYỄN VĂN A -> NGUYEN VAN A
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
    str = str.replace(/~|`|!|@|#|%|&|(|)|_/g, '');
    str = str.replace(/,|<|>|'|;|'|:|/g, '');
    console.log('after ', str);
    return str;
  }
}
