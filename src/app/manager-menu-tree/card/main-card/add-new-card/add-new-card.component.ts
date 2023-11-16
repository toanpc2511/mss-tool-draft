import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListAccount } from 'src/app/_models/card/Account';
import { CardNew } from 'src/app/_models/card/CardNew';
import { CardOption, CardProduct } from 'src/app/_models/card/CardOption';
import { DeliveryType } from 'src/app/_models/card/deliveryType';
import { CardService } from 'src/app/_services/card/card.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { CategoryList } from '../../../../_models/category/categoryList';
import { MissionService } from 'src/app/services/mission.service';
import { Branch } from 'src/app/_models/card/Branch';
import { ProcessService } from 'src/app/_services/process.service';
import { CifCondition } from 'src/app/_models/cif';
import { Process } from 'src/app/_models/process/Process';
import { AccountService } from 'src/app/_services/account.service';
import { CardIssueFee } from 'src/app/_models/card/CommonCard';
import { AccountLinkListOp } from 'src/app/_models/card/accountLinkListOutputDTOUVoCaChcNngDanhSchTiKhonLinKtCaThChnhCaTiKhonLinKtCaTh';
import { SystemUsers } from 'src/app/_models/systemUsers';
import { ApprovalCifService } from '../../../../_services/approval-cif.service';
import { GlobalConstant } from '../../../../_utils/GlobalConstant';
import { HTTPMethod } from '../../../../shared/constants/http-method';
import { HelpsService } from '../../../../shared/services/helps.service';
import { ErrorHandlerService } from '../../../../_services/error-handler.service';
import * as moment from 'moment';
import { ShareDataServiceService } from '../../../../_services/share-data-service.service';
declare var $: any;

@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.scss']
})
export class AddNewCardComponent implements OnInit {

  constructor(
    private _LOCATION: Location,
    private cardService: CardService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private cifService: ProcessService,
    private accountService: AccountService,
    private missionService: MissionService,
    private approvalCifService: ApprovalCifService,
    private helpService: HelpsService,
    private errorHandler: ErrorHandlerService,
    private shareDataService: ShareDataServiceService
  ) {
  }
  isView = false;
  cardId = '';
  SERVICE_NAME = GlobalConstant.SERVICE_NAME;
  SERVICE_STATUS = GlobalConstant.SERVICE_STATUS;
  PROCESS_STATUS = GlobalConstant.PROCESS_STATUS;
  loading = false;
  checkAddress: any;
  objCardNew: CardNew = new CardNew();
  submitted = false;
  processId: string;
  p2 = '';
  cardType: CardOption[];
  cardRate: CardOption[] = [];
  cardProduct: CardProduct[];
  cardProduct2: CardProduct[];
  categories: CategoryList = new CategoryList();
  account: ListAccount[];
  a: ListAccount[];
  accountList: AccountLinkListOp[];
  deliveryType: DeliveryType[];
  branch: Branch[];
  cus: CifCondition[];
  process: Process = new Process();
  pro: Process[];
  bidingAcount: ListAccount[];
  accountCLone = [];
  cardIssueFee: CardIssueFee[] = [];
  cardIssueFeeCode: any;
  objUser: SystemUsers[];
  validFrom: any;
  validTo: any;
  lstTitle: [];
  titles: any;
  rolesName: any;
  userId: string;
  addressCus: string;
  roleLogin: any = [];
  isKSV: boolean;
  isGDV: boolean;
  customerCode: any;
  AddCardForm = new FormGroup({
    processId: new FormControl(this.p2),
    cardTypeCode: new FormControl('', Validators.required),
    cardRateCode: new FormControl('', Validators.required),
    cardProductCode: new FormControl('', Validators.required),
    accountId: new FormControl('', [Validators.required]),
    cardHolderName: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
    deliveryTypeCode: new FormControl('DEFAULT', Validators.required),
    deliveryChanelCode: new FormControl('TAI_CHI_NHANH'),
    deliveryBranchCode: new FormControl(''),
    deliveryAddress: new FormControl(''),
    cardIssueFeeTypeCode: new FormControl(''),
    accountLinkList: new FormArray([], isAccountLinkDup()),
    interestRate: new FormControl('0'),
    explain: new FormControl('', Validators.required),
    employeeId: new FormControl('', Validators.required),
    referrerCode: new FormControl('', [Validators.required, Validators.maxLength(200)]),
    actionCode: new FormControl('C', Validators.required),
    cardNumber: new FormControl('', [Validators.minLength(16)]),
    deliveryChanelAddress: new FormControl(''),
    feeAmount: new FormControl('0')
  }, { validators: [this.accountLinkValidator] });
  acc = this.AddCardForm.get('accountLinkList') as FormArray;

  // tslint:disable-next-line:typedef
  get cardTypeCode() {
    return this.AddCardForm.get('cardTypeCode');
  }

  // tslint:disable-next-line:typedef
  get getProcessId() {
    return this.AddCardForm.get('processId');
  }

  // tslint:disable-next-line:typedef
  get getTypeName() {
    return this.AddCardForm.get('cardTypeCode');
  }

  // tslint:disable-next-line:typedef
  get cardRateCode() {
    return this.AddCardForm.get('cardRateCode');
  }

  // tslint:disable-next-line:typedef
  get cardProductCode() {
    return this.AddCardForm.get('cardProductCode');
  }

  // tslint:disable-next-line:typedef
  get accountId() {
    return this.AddCardForm.get('accountId');
  }

  // tslint:disable-next-line:typedef
  get cardHolderName() {
    return this.AddCardForm.get('cardHolderName');
  }

  // tslint:disable-next-line:typedef
  get interestRate() {
    return this.AddCardForm.get('interestRate');
  }

  // tslint:disable-next-line:typedef
  get deliveryTypeCode() {
    return this.AddCardForm.get('deliveryTypeCode');
  }

  // tslint:disable-next-line:typedef
  get deliveryChanelCode() {
    return this.AddCardForm.get('deliveryChanelCode');
  }

  // tslint:disable-next-line:typedef
  get deliveryBranchCode() {
    return this.AddCardForm.get('deliveryBranchCode');
  }

  // tslint:disable-next-line:typedef
  get deliveryAddress() {
    return this.AddCardForm.get('deliveryAddress');
  }

  // tslint:disable-next-line:typedef
  get accountLinkList() {
    return (this.AddCardForm.get('accountLinkList') as FormArray);
  }

  // tslint:disable-next-line:typedef
  get cardNumber() {
    return this.AddCardForm.get('cardNumber');
  }

  // tslint:disable-next-line:typedef
  get employeeId() {
    return this.AddCardForm.get('employeeId');
  }

  // tslint:disable-next-line:typedef
  get referrerCode() {
    return this.AddCardForm.get('referrerCode');
  }

  // tslint:disable-next-line:typedef
  get explain() {
    return this.AddCardForm.get('explain');
  }

  get feeAmount(): any {
    return this.AddCardForm.get('feeAmount');
  }

  // tslint:disable-next-line:typedef
  get deliveryChanelAddress() {
    return this.deliveryBranchCode.value();
  }


  // tslint:disable-next-line:typedef
  ngOnInit(): void {
    this.roleLogin = JSON.parse(localStorage.getItem('role'));
    this.checkAddress = document.querySelector('#address-form') as HTMLElement;
    this.route.paramMap.subscribe(paramMap => {
      this.processId = paramMap.get('processId');
      this.p2 = paramMap.get('processId');

      this.cardId = paramMap.get('id');
      if (this.cardId) {
        this.detail(this.cardId);
      } else {
        this.addAccountLink();
        this.getProcessInformation(this.processId);
      }
    });
    if (this.cardId === null) {
      $('.childName').html('Tạo mới thẻ chính');
    } else {
      $('.childName').html('Cập nhật thẻ chính');
    }
    this.employeeId.patchValue(JSON.parse(localStorage.getItem('userInfo')).employeeId);
    this.deliveryBranchCode.patchValue(JSON.parse(localStorage.getItem('userInfo')).branchCode);
    this.getBranch();
    this.getCardType();
    this.getDeliveryType();
    this.getCardIssueFee();
    this.getCardRate();
    this.apiCardProduct();
    this.getAccountLinkedList();
    this.deliveryChanelCode.valueChanges.subscribe(value => {
      if (value === 'GUI_NHAN') {
        this.deliveryAddress.setValidators([Validators.required]);
      } else {
        this.deliveryAddress.clearValidators();
      }
    });
    this.missionService.setProcessId(this.processId);
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.roleLogin.length; i++) {
      if (this.roleLogin[i] === 'UNIFORM.BANK.GDV') {
        this.isGDV = true;

      } else if (this.roleLogin[i] === 'UNIFORM.BANK.KSV') {
        this.isKSV = true;
      }
    }
    this.shareDataService.isView.subscribe(response => {
      this.isView = response;
      if (response) {
        this.AddCardForm.disable();
      }

      // console.log(response);  // you will receive the data from sender component here.
    });

  }

  accountLinkValidator(form: FormGroup): ValidationErrors | null {
    const accountLinkList = form.controls.accountLinkList.value;
    const accountId = form.controls.accountId.value;

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

  backPage(): void {
    this._LOCATION.back();
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

  // loại phí
  getCardIssueFee(): void {
    this.cardService.getIssueFee().subscribe(
      data => {
        if (data.items) {
          this.cardIssueFee = data.items;
          this.AddCardForm.get('cardIssueFeeTypeCode').setValue(data.items[0].code);
        }
      }
    );
  }

  /**
   *  kiểm tra user ấy có phải là người tạo hay ko
   */
  checkEditable(isSendApprove): void {
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
  }
  // mã thẻ
  apiCardProduct(): void {
    this.cardTypeCode.valueChanges.subscribe(x => {
      this.cardRateCode.setValue(null);

      this.cardService.apiCardProduct2(x).subscribe(
        data => {
          if (data.items && data.items.length > 0) {
            this.cardProduct = data.items;
          } else {
            this.cardProduct = [];
          }
        }
      );
    });
  }

  // hạng thẻ
  getCardRate(): void {
    this.cardProductCode.valueChanges.subscribe(x => {
      this.cardService.getRateCardByCardCode(x).subscribe(
        data => {
          if (data.item) {
            this.cardRate.push(data.item);
            this.cardRateCode.setValue(data.item.code);
          } else {
            this.cardRate = [];
            // this.cardRateCode.setValue('21321');
          }
        }
      );
    });

  }

  // tài khoản liên kết thẻ
  getAccountLinkedList(): void {
    this.accountService.getAccountLinkList({ processId: this.processId }).subscribe(
      data => {
        if (data.items) {
          this.bidingAcount = data.items;
          this.account = data.items;
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

  // hồ sơ chi tiết
  getProcessInformation(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    this.cifService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.process.item = data.item;
        this.customerCode = this.process.item.customerCode;
        const currentWardName = data.item.customer.person.currentWardName;
        const currentCityName = data.item.customer.person.currentCityName;
        const currentStreetNumber = data.item.customer.person.currentStreetNumber;
        const currentDistrictName = data.item.customer.person.currentDistrictName;
        const currentCountryName = data.item.customer.person.currentCountryName;
        const name = data.item.customer.person.fullName;
        const name2 = this.toNoSign(name).toUpperCase();
        // tslint:disable-next-line:max-line-length
        this.addressCus = currentStreetNumber + ', ' + currentWardName + ', ' + currentDistrictName + ', ' + currentCityName + ', ' + currentCountryName;
        this.deliveryAddress.patchValue(this.addressCus);
        this.cardHolderName.patchValue(name2);
      }
    }, error => {
    }, () => {
    }
    );
  }
  actionSave(isSendApprove): void {
    this.submitted = true;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
    this.getProcessId.setValue(this.processId);
    this.AddCardForm.controls.processId.setValue(this.processId);
    if (this.AddCardForm.invalid) {
      return;
    }
    this.objCardNew = this.AddCardForm.value;
    this.objCardNew.accountLinkList.forEach(item => {
      return item.accountId;
    });
    if (this.cardId) {
      this.objCardNew.id = this.cardId;
      this.cardService.updateCard(this.objCardNew).subscribe(rs => {
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < rs.responseStatus.codes.length; index++) {
          if (rs.responseStatus.success) {
            if (isSendApprove) {
              const request = {
                id: this.cardId,
                typeCode: this.SERVICE_NAME.CARD
              };
              this.helpService.callApi({
                method: HTTPMethod.POST,
                url: '/process/process/sendApproveOne',
                data: request,
                progress: true,
                // tslint:disable-next-line:no-shadowed-variable
                success: (res) => {
                  if (res && res.responseStatus.success) {
                    this.notificationService.showSuccess('Cập nhật thẻ thành công', '');
                    this.router.navigate(['./smart-form/manager/card-infor', { processId: this.processId, id: this.cardId }]);
                    // this.router.navigate(['./smart-form/manager/card', {processId: this.processId}]);
                  } else {
                    this.notificationService.showError('Gửi duyệt thẻ thất bại', 'Lỗi gửi duyệt thẻ`');
                  }
                }
              });
            } else {
              this.notificationService.showSuccess('Cập nhật thẻ thành công', '');
              this.router.navigate(['smart-form/manager/card-infor', { processId: this.processId, id: this.cardId }]);
            }
          } else if (rs.responseStatus.codes[index].code === '400') {
            this.notificationService.showError(rs.responseStatus.codes[index].detail, 'Lỗi cập nhật thẻ chính');
          } else {
            this.notificationService.showError('Chỉnh sửa thất bại', '');
          }

        }
      }, err => {
      });
    } else {
      this.cardService.createCard(this.objCardNew).subscribe(rs => {
        // tslint:disable-next-line:prefer-for-of
        for (let index = 0; index < rs.responseStatus.codes.length; index++) {
          if (rs.responseStatus.success) {
            if (isSendApprove) {
              const request = {
                id: rs.item.id,
                typeCode: this.SERVICE_NAME.CARD
              };
              this.helpService.callApi({
                method: HTTPMethod.POST,
                url: '/process/process/sendApproveOne',
                data: request,
                progress: true,
                // tslint:disable-next-line:no-shadowed-variable
                success: (res) => {
                  if (res && res.responseStatus.success) {
                    this.notificationService.showSuccess('Thêm mới thẻ thành công', '');
                    // this.router.navigate(['./smart-form/manager/card', {processId: this.processId}]);
                    this.router.navigate(['./smart-form/manager/card-infor', { processId: this.processId, id: rs.item.id }]);
                  } else {
                    this.notificationService.showError('Gửi duyệt thẻ thất bại', 'Lỗi gửi duyệt thẻ`');
                  }
                }
              });
            } else {
              this.notificationService.showSuccess('Thêm mới thẻ thành công', '');
              this.router.navigate(['./smart-form/manager/card-infor', { processId: this.processId, id: rs.item.id }]);
              // this.router.navigate(['./smart-form/manager/card', {processId: this.processId}]);
            }
          } else if (rs.responseStatus.codes[index].code === '400') {
            this.notificationService.showError(rs.responseStatus.codes[index].detail, 'Lỗi thêm mới thẻ');
          } else {
            this.notificationService.showError('Thêm mới thẻ thất bại', 'Lỗi thêm mới thẻ`');
          }
        }
      }, err => {
        this.notificationService.showError(err, 'Lỗi thêm mới thẻ`');
      });
    }
  }
  // lưu thẻ
  save(isSendApprove): void {
    if (this.customerCode) {
      this.checkEditable(isSendApprove);
    } else {
      this.actionSave(isSendApprove);
    }

  }

  // xử lý gõ chỉ tiếng việt viết hoa không dấu trên thẻ input
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
    str = str.replace(/á|à|ạ|ả|ã|â|ấ|ầ|ậ|ẩ|ẫ|ă|ắ|ằ|ặ|ẳ|ẵ/g, 'A');
    str = str.replace(/Á|À|Ạ|Ả|Ã|Â|Ấ|Ầ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/é|è|ẹ|ẻ|ẽ|ê|ế|ề|ệ|ể|ễ/g, 'E');
    str = str.replace(/É|È|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/í|ì|ị|ỉ|ĩ/g, 'I');
    str = str.replace(/Í|Ì|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/ó|ò|ọ|ỏ|õ|ô|ố|ồ|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'O');
    str = str.replace(/Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/ú|ù|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'U');
    str = str.replace(/Ú|Ù|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/y|ỳ|ỵ|ỷ|ỹ/g, 'Y');
    str = str.replace(/Ý|Ỳ|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/1|2|3|4|5|6|7|8|9|0|-|=|/g, '');
    str = str.replace(/~|`|!|@|#|%|&|(|)|_/g, '');
    str = str.replace(/,|<|>|"|;|'|:|/g, '');
    return str;
  }

  toNoNumber(value): void {
    let str1 = value;
    str1 = str1.replace('/[^a-zA-Z,.\s]/g');
  }

  //  getUser(id){
  //    const u = new SystemUsers()
  //    u.id = id
  //   //  id="d6611c5f-b0a0-401c-8384-d303fd084e72"
  //    this.userService.detail(id).subscribe(data =>
  //     {
  //       if(data.item){
  //        this.objUser = data.item
  //        console.log(this.objUser);

  //       }
  //     })
  //  }
  addAccountLink(): void {
    const group = new FormGroup({
      accountId: new FormControl('', { updateOn: 'blur' }),
    });

    this.accountLinkList.push(group);
  }

  removeAccountLink(index: number): void {
    this.accountLinkList.removeAt(index);
  }

  detail(id): void {
    this.cardService.detailCard(id).subscribe(
      data => {
        if (data.item) {
          this.customerCode = data.item.customerCode;
          this.AddCardForm.patchValue(data.item);
          // this.accountLinkList.setValue(null);
          // this.getAccountLinkedList();

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
            this.AddCardForm.disable();
            this.accountLinkList.enable();
            this.cardHolderName.enable();
          }

        }
      }, error => {
        this.errorHandler.showError(error);
      }
    );
  }

}


// tslint:disable-next-line:typedef
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
