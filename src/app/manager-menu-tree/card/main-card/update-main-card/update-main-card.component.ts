import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListAccount } from 'src/app/_models/card/Account';
import { CardOption, CardProduct } from 'src/app/_models/card/CardOption';
import { DeliveryType } from 'src/app/_models/card/deliveryType';
import { CardService } from 'src/app/_services/card/card.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { CategoryList } from '../../../../_models/category/categoryList';
import { MissionService } from 'src/app/services/mission.service';
import { Branch } from 'src/app/_models/card/Branch';
import { ProcessService } from 'src/app/_services/process.service';
import { CifCondition } from 'src/app/_models/cif';
import { DetailProcess } from 'src/app/_models/process';
import { Process } from 'src/app/_models/process/Process';
import { CardUpdate } from 'src/app/_models/card/CardUpdate';
import { Card } from 'src/app/_models/card/Card';
import { ErrorHandlerService } from 'src/app/_services/error-handler.service';
import { AccountLinkListOp } from 'src/app/_models/card/accountLinkListOutputDTOUVoCaChcNngDanhSchTiKhonLinKtCaThChnhCaTiKhonLinKtCaTh';
import { CardIssueFee } from 'src/app/_models/card/CommonCard';
import { AccountService } from 'src/app/_services/account.service';
import { GlobalConstant } from '../../../../_utils/GlobalConstant';
declare var $: any;

@Component({
  selector: 'app-update-main-card',
  templateUrl: './update-main-card.component.html',
  styleUrls: ['./update-main-card.component.scss']
})
export class UpdateMainCardComponent implements OnInit {
  PROCESS_STATUS = GlobalConstant.PROCESS_STATUS;
  constructor(
    private _LOCATION: Location,
    private cardService: CardService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cifService: ProcessService,
    private errorHandler: ErrorHandlerService,
    private missionService: MissionService,
  ) { }
  // tslint:disable-next-line:typedef
  get cardTypeCode() { return this.UpdateCardForm.get('cardTypeCode'); }
  // tslint:disable-next-line:typedef
  get getId() { return this.UpdateCardForm.get('id'); }
  // tslint:disable-next-line:typedef
  get getTypeName() { return this.UpdateCardForm.get('cardTypeCode'); }
  // tslint:disable-next-line:typedef
  get cardRateCode() { return this.UpdateCardForm.get('cardRateCode'); }
  // tslint:disable-next-line:typedef
  get cardProductCode() { return this.UpdateCardForm.get('cardProductCode'); }
  // tslint:disable-next-line:typedef
  get accountId() { return this.UpdateCardForm.get('accountId'); }
  // tslint:disable-next-line:typedef
  get cardHolderName() { return this.UpdateCardForm.get('cardHolderName'); }
  // tslint:disable-next-line:typedef
  get interestRate() { return this.UpdateCardForm.get('interestRate'); }
  // tslint:disable-next-line:typedef
  get deliveryTypeCode() { return this.UpdateCardForm.get('deliveryTypeCode'); }
  // tslint:disable-next-line:typedef
  get deliveryChanelCode() { return this.UpdateCardForm.get('deliveryChanelCode'); }
  // tslint:disable-next-line:typedef
  get deliveryBranchCode() { return this.UpdateCardForm.get('deliveryBranchCode'); }
  // tslint:disable-next-line:typedef
  get deliveryAddress() { return this.UpdateCardForm.get('deliveryAddress'); }
  // tslint:disable-next-line:typedef
  get accountLinkList() { return this.UpdateCardForm.get('accountLinkList'); }
  // tslint:disable-next-line:typedef
  get cardNumber() { return this.UpdateCardForm.get('cardNumber'); }
  // tslint:disable-next-line:typedef
  get employeeId() { return this.UpdateCardForm.get('employeeId'); }
  // tslint:disable-next-line:typedef
  get referrerCode() { return this.UpdateCardForm.get('referrerCode'); }
  // tslint:disable-next-line:typedef
  get explain() { return this.UpdateCardForm.get('explain'); }

  loading = false;
  card: Card[];
  cardd: Card = new Card();
  checkAddress: any;
  objCardUpdate: CardUpdate = new CardUpdate();
  submitted = false;
  id = '';
  processId: string;
  a: any;
  cardType: CardOption[];
  cardRate: CardOption[];
  cardProduct: CardProduct[];
  cardProduct2: CardProduct[];
  categories: CategoryList = new CategoryList();
  account: ListAccount[];
  deliveryType: DeliveryType[];
  branch: Branch[];
  cus: CifCondition[];
  process: Process = new Process();
  detailProcess: DetailProcess = new DetailProcess(null);
  pro: Process[];
  accountList: AccountLinkListOp;
  index = 0;
  cardIssueFee: CardIssueFee[];
  accountCLone = [];
  roleLogin: any = [];
  isKSV: boolean;
  isGDV: boolean;

  UpdateCardForm = new FormGroup({
    id: new FormControl(this.id),
    cardTypeCode: new FormControl('', Validators.required),
    cardRateCode: new FormControl('STANDARD', Validators.required),
    cardProductCode: new FormControl('', Validators.required),
    accountId: new FormControl('', [Validators.required]),
    cardHolderName: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
    deliveryTypeCode: new FormControl('DEFAULT', Validators.required),
    deliveryChanelCode: new FormControl('TAI_CHI_NHANH'),
    deliveryBranchCode: new FormControl(''),
    deliveryAddress: new FormControl(''),
    cardIssueFeeTypeCode: new FormControl(''),
    accountLinkList: new FormControl([], Validators.maxLength(3)),
    interestRate: new FormControl('0'),
    explain: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    employeeId: new FormControl('', Validators.required),
    referrerCode: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    actionCode: new FormControl('C', Validators.required),
    cardNumber: new FormControl('', [Validators.minLength(16)]),
    deliveryChanelAddress: new FormControl('')
  });
  // form validate
  acc = this.UpdateCardForm.get('accountLinkList') as FormArray;
  ngOnInit(): void {
    $('.childName').html('Cập nhật thẻ chính');
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.checkAddress = document.querySelector('#address-form') as HTMLElement;
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
      this.id = paramMap.get('id');
      this.detail(paramMap.get('id'));
      this.getProcessInformation(paramMap.get('processId'));
    });
    this.getCardType();
    this.getBranch();
    this.getCardType();
    this.getCardIssueFee();
    this.getDeliveryType();
    this.getCardRate();
    this.apiCardProduct();
    this.missionService.setProcessId(this.processId);
    // this.getAccountLinkedList()
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;

      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
  }
  backPage(): void {
    this._LOCATION.back();
  }

  // tài khoản liên kết thẻ
  getAccountLinkedList(): void {
    this.cardService.getAccountList(this.processId).subscribe(
      data => {
        if (data.items) {
          this.account = data.items.filter(e => e.currencyCode === 'VND');
          this.a = data.items.filter(e => e.currencyCode === 'VND');
          // ádsad
          this.accountChange();
          // ádsadsad
          this.accountId.valueChanges.subscribe(x => {
            this.accountCLone = [];
            this.a = this.account.filter(option => {
              return option.id !== x;
            });
            this.a.forEach(element => {
              this.accountCLone.push({
                accountId: element.id,
                accountNumber: element.accountNumber,
                accountIndex: element.accountIndex
              });
            });
          });
        }
      }
    );
  }
  accountChange(): void {
    this.accountCLone = [];
    this.a = this.account.filter(option => {
      return option.id !== this.accountId.value;
    });
    this.a.forEach(element => {
      this.accountCLone.push({
        accountId: element.id,
        accountNumber: element.accountNumber,
        accountIndex: element.accountIndex
      });
    });
  }
  detail(id): void {
    this.cardService.detailCard(id).subscribe(
      data => {
        // console.log('item', data.item);
        if (data.item) {
          this.card = data.item;
          this.cardd = data.item;
          this.UpdateCardForm.patchValue(data.item);
          this.accountLinkList.setValue([]);

          // tslint:disable-next-line:typedef
          // tslint:disable-next-line:only-arrow-functions
          const test = data.item.accountLinkList.sort(function (a, b): number {
            return a.account.accountIndex - b.account.accountIndex;
          });
          this.getAccountLinkedList();
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
  // loại thẻ
  getCardType(): void {
    this.cardService.getTypeCard().subscribe(
      data => {
        if (data.items) {
          this.cardType = data.items;
        }
      }
    );
  }

  // mã thẻ
  apiCardProduct(): void {
    this.cardService.apiCardProduct().subscribe(
      data => {
        if (data.items) {
          this.cardProduct = data.items;
          this.cardTypeCode.valueChanges.subscribe(x => {
            this.cardProduct = data.items.filter(option => {
              return option.cardTypeCode === x;
            });
          });
        }
      }
    );
  }
  // hạng thẻ
  getCardRate(): void {
    this.cardService.getRateCard().subscribe(
      data => {
        if (data.items) {
          this.cardRate = data.items;
        }
      }
    );
  }


  // hình thức phát hành
  getDeliveryType(): void {
    this.cardService.getListDeliveryType().subscribe(
      data => {
        if (data.items) {
          this.deliveryType = data.items;
          // console.log(this.deliveryType);
        }
      }
    );
  }
  // chọn chi nhánh
  getBranch(): void {
    this.cardService.getListBranch().subscribe(
      data => {
        if (data.items) {
          this.branch = data.items;
        }
      }
    );
  }
  getCardIssueFee(): void {
    this.cardService.getIssueFee().subscribe(
      data => {
        if (data.items) {
          this.cardIssueFee = data.items;
          this.UpdateCardForm.get('cardIssueFeeTypeCode').setValue(data.items[0].code);
          // console.log(this.cardIssueFee);
        }
      }
    );
  }
  // lấy địa chỉ khách hàng

  // lưu thẻ
  save(): void {
    this.submitted = true;
    this.getId.setValue(this.id);
    this.UpdateCardForm.controls.id.setValue(this.id);
    // console.log(this.UpdateCardForm.invalid);
    // console.log(this.UpdateCardForm.value);
    if (this.UpdateCardForm.invalid) {
      return;
    }
    this.objCardUpdate = this.UpdateCardForm.value;
    const accountLinkListData = [];
    this.accountLinkList.value.forEach(element => {
      accountLinkListData.push({
        accountId: element
      });
    });
    this.objCardUpdate.accountLinkList = accountLinkListData;
    this.cardService.updateCard(this.objCardUpdate).subscribe(rs => {
      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < rs.responseStatus.codes.length; index++) {
        if (rs.responseStatus.success) {
          this.notificationService.showSuccess('Cập nhật thẻ thành công', '');
          this.router.navigate(['smart-form/manager/card-infor', { processId: this.processId, id: this.UpdateCardForm.value.id }]);
        } else if (rs.responseStatus.codes[index].code === '400') {
          this.notificationService.showError(rs.responseStatus.codes[index].detail, 'Lỗi cập nhật thẻ chính');
        } else {
          this.notificationService.showError('Chỉnh sửa thất bại', '');
        }

      }
    }, err => {
    });
  }
  getProcessInformation(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    this.cifService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.process.item = data.item;
        const currentWardName = data.item.customer.person.currentWardName;
        const currentCityName = data.item.customer.person.currentCityName;
        const currentStreetNumber = data.item.customer.person.currentStreetNumber;
        const currentDistrictName = data.item.customer.person.currentDistrictName;
        const name = data.item.customer.person.fullName;
        const name2 = this.toNoSign(name).toUpperCase();
        // console.log('process', this.process.item);
        this.deliveryAddress.patchValue(currentStreetNumber + ', ' + currentWardName + ', ' + currentDistrictName + ', ' + currentCityName);
        this.cardHolderName.patchValue(name2);
      }
    }, error => {
    }, () => { }
    );
  }
  // xử lý gõ chỉ tiếng việt viết hoa không dấu trên thẻ input
  inputLatinUppercase(event): void {
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
    str = str.replace(/,|<|>|"|;|'|:|/g, '');
    // console.log('after ', str);
    return str;
  }
}
