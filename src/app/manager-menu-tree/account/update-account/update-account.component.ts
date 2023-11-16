import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { DetailProcess } from 'src/app/_models/process';
import { AccountModel, CreateAccount } from 'src/app/_models/account';
import { MissionService } from 'src/app/services/mission.service';
import { AccountService } from 'src/app/_services/account.service';
import { ResponseStatus } from '../../../_models/response';
import { ConstantUtils } from 'src/app/_utils/_constant';
import { forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/_toast/notification_service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
import { docStatus } from 'src/app/shared/models/documents';

declare var $: any;
@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.scss'],
})
export class UpdateAccountComponent implements OnInit {

  readonly docStatus = docStatus;
  tempBtnPrimary = '';
  readonly btnPrimary = {
    SAVE: 'SAVE',
    SEND_APPROVE: 'SEND_APPROVE' // button phân biệt trường hợp  lưu hay  chờ duyệt
  };
  readonly confim = { // phân biệt hủy hay đống ý confim chờ duyệt
    CANCEL: 'CANCEL',
    CONFIM: 'CONFIM',
  };
  isCheckDisable = false;
  note = '';
  isShowPopupApprove = false;
  updateAccountForm: FormGroup;
  submitted: boolean;
  processId: any;
  detailProcess: DetailProcess = new DetailProcess(null);
  branchName: string;
  accountNumber: any;
  lstCurrencyRoot: [] = [];
  lstAccountProductRoot: any[] = [];
  lstAccountClassRoot: any[] = [];
  lstCurrency: [] = [];
  lstAccountProduct: any[] = [];
  lstAccountClass: any[] = [];
  accountId: any;
  constant: ConstantUtils = new ConstantUtils();
  detailAccount: AccountModel = new AccountModel();
  response: ResponseStatus;
  lstDefineMinBalance = [];
  roleLogin: any = [];
  userInfo: any;
  isSendApproveCreate = false;
  isSendApproveUpdate = false;
  isSendApprove = false;
  isSave = true;
  customerCode: any;
  bodyReq: any;
  integratedId: any;
  createdBy: any;
  branchCode: any;
  statusCode = '';
  processIntegrated: any;
  selectedMaCBNVLPB;
  lstMACBNVLPB = [];
  statusCif: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private missionService: MissionService,
    private accountService: AccountService,
    private notificationService: NotificationService,
    private helpService: HelpsService,
    private authenticationService: AuthenticationService
  ) { }
  ngOnInit(): void {
    $('.childName').html('Cập nhật tài khoản');
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('id');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.missionService.setProcessId(this.processId);
    this.branchName = this.userInfo.branchName;
    this.accountNumber =
      'Tài khoản mới - ' + Math.floor(100000 + Math.random() * 900000);
    this.updateAccountForm = new FormGroup({
      id: new FormControl(this.accountId),
      accountName: new FormControl(''),
      acountNumber: new FormControl(''),
      currencyCode: new FormControl(''),
      accountProductCode: new FormControl(''),
      accountClassCode: new FormControl(''),
      packageAccount: new FormControl(''),
      minBalance: new FormControl('', Validators.required),
      employeeId: new FormControl(''),
      accountDescription: new FormControl('', Validators.required),
      branchCode: new FormControl(this.branchName),
      accountTypeCode: new FormControl('S'),
    });
  }
  onChangeMaCbnvLpbCode(evt): void {
    this.selectedMaCBNVLPB = evt;
  }

  get getTypeCurrency(): AbstractControl {
    return this.updateAccountForm.get('currencyCode');
  }
  get acountNumber(): AbstractControl {
    return this.updateAccountForm.get('acountNumber');
  }
  get getAccountClassCode(): AbstractControl {
    return this.updateAccountForm.get('accountClassCode');
  }
  get getAccountProductCode(): AbstractControl {
    return this.updateAccountForm.get('accountProductCode');
  }
  get getMinBalance(): AbstractControl {
    return this.updateAccountForm.get('minBalance');
  }

  disableForm(): void {
    this.isCheckDisable = false;
    if (this.detailAccount.currentStatusCode === 'ACTIVE') {
      this.isCheckDisable = true;
    }
  }
  getAllData(): void {
    this.accountService.getDetailAccount({ id: this.accountId }).subscribe(res => {
      this.detailAccount = res.item;
      this.branchCode = this.detailAccount.branchCode;
      this.processIntegrated = res.processIntegrated;
      const bodyAcProduct = {
        currencyCode: this.detailAccount.currencyCode
      };
      const bodyAcClass = {
        currencyCode: this.detailAccount.currencyCode,
        accountProductCode: this.detailAccount.accountProductCode,
        processId: this.processId
      };
      forkJoin([
        this.accountService.getLstAllCurrency(),
        this.accountService.getLstAccountProduct(bodyAcProduct),
        this.accountService.getLstAccountClass(bodyAcClass),
        this.accountService.getDetailAccount({ id: this.accountId }),
      ]).subscribe((result) => {
        if (result) {
          this.lstCurrencyRoot = result[0].items.filter(
            (e) => e.statusCode === 'A'
          );
          // Account Product
          this.lstAccountProductRoot = result[1].items.filter(e => e.currencyCodes !== null);
          // Account Class
          this.lstAccountClassRoot = result[2].items;
          // Account Detail
        }
        if (this.detailAccount.accountNumber === null) {
          this.acountNumber.setValue('Số tài khoản mới - ' + this.detailAccount.accountIndex);
        } else {
          this.acountNumber.setValue(this.detailAccount.accountNumber);
        }
        // Fill Dữ liệu account detail lên form
        this.updateAccountForm.patchValue(this.detailAccount);
        // this.selectedMaCBNVLPB = this.detailAccount.employeeId;
        this.selectedMaCBNVLPB = this.detailAccount.employeeId ?
          {
            code: this.detailAccount.employeeId,
            name: this.detailAccount.employeeId + ' - ' + this.detailAccount.employeeName
          } : null;
        this.updateAccountForm
          .get('minBalance')
          .setValue(this.formatMoney(this.getMinBalance.value));
        // Xử lý dữ liệu dropdown khi init
        this.lstCurrency = this.lstCurrencyRoot;
        // Trong trường hợp update, currency đã có trong account deatail (đã được fill form bước trước)
        // => currency sẽ lấy ở hàm getTypeCurrency() để filter giá trị account Product
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.lstAccountProductRoot.length; i++) {
          const el = this.lstAccountProductRoot[i];
          let lstTempCurrency = [];
          lstTempCurrency = el.currencyCodes.split(',');
          if (
            lstTempCurrency.length > 0 &&
            lstTempCurrency.includes(this.getTypeCurrency.value)
          ) {
            this.lstAccountProduct.push(el);
          }
          this.getRole();
          this.actionButton();
        }
        // Trong trường hợp update, đã có currency và account product (đã đc fill lên form bước trước)
        // => Lấy 2 giá trị này getTypeCurrency() và accountProductCode() để filter account class
        // tslint:disable-next-line:prefer-for-of
        let arrayCurrency = [];
        this.lstAccountClassRoot.forEach(e => {
          if (e.currencyCodes !== null && e.currencyCodes.includes(',')) {
            arrayCurrency = e.currencyCodes.split(',');
          } else {
            arrayCurrency = e.currencyCodes;
          }
          if (arrayCurrency.includes(this.detailAccount.currencyCode)) {
            this.lstAccountClass.push(e);
          }
        });
        this.disableForm();
      });
    });
  }

  apiAutoCreate(): void {
    const body = {
      processId: this.processId,
    };
    if (!body) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/attachment/autoCreate',
        data: body,
        progress: true,
        success: (res) => {
          if (!(res && res.responseStatus.success)) {
            this.notificationService.showError('Cập nhật thất bại', 'Thất bại');
          }
        }
      }
    );
  }

  getRole(): void {
    this.isSave = this.authenticationService.isPermission(PermissionConst.TAI_KHOAN.UPDATE);
    // tslint:disable-next-line:align
    this.isSendApproveUpdate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_UPDATE_ACCOUNT);
    this.isSendApproveCreate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_ACCOUNT);
    this.isSendApprove = (this.detailAccount.actionCode === 'C' ? this.isSendApproveCreate : this.isSendApproveUpdate);
  }

  checkHiddenButton(): void {
    // tạo mới duyệt thành công hiện tại
    if (this.detailAccount.currentStatusCode === 'NEW' && this.detailAccount.changeStatusCode === 'ACTIVE') {
      this.disableBtn();
    }
  }

  actionButton(): void {
    if (this.statusCif === 'Y' || this.statusCif === 'C') {
      this.disableBtn();
    } else {
      this.checkHiddenButton();
      this.checkProfilePendding();
    }
  }

  checkProfilePendding(): void {
    // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
    // tslint:disable-next-line:max-line-length
    if ((this.statusCode === docStatus.EDIT
      || this.statusCode === docStatus.WAIT
      || this.statusCode === docStatus.TEMP
      || this.statusCode === this.docStatus.MODIFY) && this.createdBy !== this.userInfo.userId) {
      // nếu là khác người tạo thì ẩn hết các nút
      this.disableBtn();
    } else {
      //  trong hồ sơ  không pending check 2 trường hợp
      // 1. nếu là đã duyệt và từ chối thì ẩn hết button
      // 2. nếu ko phải thì check tới chi nhánh của dịch vụ
      if (this.statusCode === docStatus.APPROVED
        || this.statusCode === docStatus.SUCCESS
        || this.statusCode === docStatus.REJECT) {
        this.disableBtn();
      } else {
        // nếu như không phải pendding thì check chi nhánh của dịch vụ
        // nếu khác chi nhanh => show cập nhập thông tin, không gửi duyệt, ko xóa
        if (this.branchCode && this.branchCode !== this.userInfo.branchCode) {
          this.showBtnSave();
        }
      }
    }
  }
  showBtnSave(): void {
    this.isSendApprove = false;
    this.isSave = this.isSave ? true : false;
  }
  disableBtn(): void {
    this.isSendApprove = false;
    this.isSave = false;
  }

  getAccountMinBal(): void {
    this.lstDefineMinBalance = [];
    this.accountService.getAccountMinBal().subscribe((rs) => {
      if (rs && rs.items) {
        this.lstDefineMinBalance = rs.items;
      }
    });
  }
  get f(): any {
    return this.updateAccountForm.controls;
  }
  onBlurMethod(): any {
    const regex = /[.,\s]/g;
    this.updateAccountForm.get('minBalance').setValue(this.formatMoney(this.getMinBalance.value.replace(regex, '')));
  }

  getDetail(event): void {
    this.customerCode = event?.customerCode;
    this.statusCode = event?.statusCode;
    this.createdBy = event?.createdBy;
    this.statusCif = event.customer.statusCif;

    this.getAllData();
    this.getAccountMinBal();
  }
  formatMoney(val: any): any {
    // console.log(val);
    // tslint:disable-next-line:one-variable-per-declaration
    let str = val.toString(), output = [], i = 1, formatted = null;
    str = str.split('').reverse();
    if (str.indexOf('.') < 0) {
      for (let j = 0, len = str.length; j < len; j++) {
        if (str[j] !== ',') {
          output.push(str[j]);
          if (i % 3 === 0 && j < len - 1) {
            output.push('.');
          }
          i++;
        }
      }
    } else {
      output = val;
    }
    formatted = output.reverse().join('');
    return formatted;
  }

  approveProcess(param): void {
    this.submitted = true;
    this.removeText();
    this.updateAccountForm.get('minBalance').setValue(this.accountService.minBalanceBuilder(
      this.updateAccountForm.get('minBalance').value
    ));
    this.bodyReq = this.updateAccountForm.value;
    // call api
    this.tempBtnPrimary = param;
    // check với hồ sơ của người dùng tạo hiện tại
    if (this.bodyReq) {
      switch (this.tempBtnPrimary) {
        case this.btnPrimary.SAVE:
          if (this.customerCode) {
            // nều là hiện hữu phải check người tạo hồ sơ
            this.checkEditable();
          } else {
            this.sendApiUpdateAccount();
          }
          break;
        case this.btnPrimary.SEND_APPROVE:
          this.note = '';
          this.isShowPopupApprove = true;
          break;
        default:
          break;
      }
    } else {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
  }
  /**
   *  điều hướng đến page detail
   */
  routerDetailAccount(): void {
    this.router.navigate(['./smart-form/manager/detailAccount', {
      processId: this.processId,
      id: this.accountId
    }]);
  }
  /**
   * confim đồng ý hay hủy trên popup
   */
  confimApproveProcess(params): void {
    switch (params) {
      case this.confim.CANCEL:
        this.isShowPopupApprove = false;
        break;
      case this.confim.CONFIM:
        if (this.isSave) {
          if (this.customerCode) {
            this.checkEditable();
          } else {
            this.sendApiUpdateAccount();
          }
        } else {
          this.notificationService.showError('kiểm tra lại quyền thực hiện', 'Cảnh báo');
        }
        break;
      default:
        break;
    }
  }
  /**
   * api xử lý tạo mới tài khoản
   */
  sendApiUpdateAccount(): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/account/account/update',
        data: this.bodyReq,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.integratedId = res.processIntegrated.id;
            this.apiAutoCreate();
            switch (this.tempBtnPrimary) {
              case this.btnPrimary.SAVE:
                this.notificationService.showSuccess('cập nhập tài khoản thành công', 'Thành công');
                this.routerDetailAccount();
                break;
              case this.btnPrimary.SEND_APPROVE:
                this.sendApiApproveUpdateAccount();
                break;
              default:
                break;
            }
          } else {
            this.notificationService.showError('Cập nhập tài khoản thất bại', 'Thất bại');
          }
          this.isShowPopupApprove = false;
        }
      }
    );
  }

  /**
   *  kiểm tra hồ sơ ấy có phải là người tạo hay ko
   */
  checkEditable(): void {
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
              this.sendApiUpdateAccount();
            } else {
              this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }
  /**
   * api xử lý gửi duyệt tài khoản
   */
  sendApiApproveUpdateAccount(): void {
    const body = {
      note: this.note,
      id: this.integratedId
    };
    if (!body) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: (this.detailAccount.actionCode !== 'C' ? '/process/process/sendApproveUpdateAccount' : '/process/process/sendApproveCreateAccount'),
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Gửi duyệt tài khoản thành công', 'Thành công');
            this.routerDetailAccount();
          } else {
            this.notificationService.showError('Gửi duyệt tài khoản thất bại', 'Thất bại');
          }
        }
      }
    );
  }
  // tslint:disable-next-line:typedef

  backPage(): void {
    this.location.back();
  }

  removeText(): void {
    const tempMinBalance = this.updateAccountForm.get('minBalance').value;
    this.updateAccountForm.get('minBalance').setValue(tempMinBalance);
  }

  onChangeAccountClass(value): void {
    this.updateAccountForm.get('accountClassCode').setValue(value);
    this.lstDefineMinBalance.forEach((el) => {
      if (el.accountClassCode.includes(this.getAccountClassCode.value)) {
        if (el.minBalance !== null && el.minBalance !== '' && el !== undefined
        ) {
          this.updateAccountForm.get('minBalance').setValue(this.formatMoney(el.minBalance));
        }
      }
    });
  }

  onChangeAccountProduct(value): void {
    this.updateAccountForm.get('accountProductCode').setValue(value);
    this.getAccountDescription();
    this.lstAccountClass = [];
    let arrayCurrency = [];
    const bodyAcClass = {
      currencyCode: this.updateAccountForm.get('currencyCode').value,
      accountProductCode: value,
      processId: this.processId
    };
    this.accountService.getLstAccountClass(bodyAcClass).subscribe(res => {
      if (res.responseStatus.success) {
        this.lstAccountClassRoot = res.items;
        if (this.lstAccountClassRoot.length > 0) {
          this.lstAccountClassRoot.forEach(e => {
            if (e.currencyCodes !== null) {
              arrayCurrency = e.currencyCodes.split(',');
            }
            if (arrayCurrency.includes(this.updateAccountForm.get('currencyCode').value)) {
              this.lstAccountClass.push(e);
            }
          });
        }
        this.updateAccountForm.get('accountClassCode').setValue('');
        this.updateAccountForm.get('minBalance').setValue(0);
      }
    });
  }

  onChangeAccountCurrency(value): void {
    this.updateAccountForm.get('accountProductCode').setValue('');
    this.updateAccountForm.get('accountClassCode').setValue('');
    this.updateAccountForm.get('minBalance').setValue(0);
    this.updateAccountForm.get('currencyCode').setValue(value);
    this.getAccountDescription();
    this.lstAccountProduct = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.lstAccountProductRoot.length; i++) {
      const el = this.lstAccountProductRoot[i];
      let lstTempCurrency = [];
      lstTempCurrency = el.currencyCodes.split(',');
      if (
        lstTempCurrency.length > 0 &&
        lstTempCurrency.includes(this.getTypeCurrency.value)
      ) {
        this.lstAccountProduct.push(el);
      }
    }
  }

  getAccountDescription(): void {
    this.updateAccountForm.get('accountDescription').setValue('');
    let description = '';
    let accProductName = '';
    let curr = '';
    if (this.getAccountProductCode.value !== '') {
      accProductName = ' - ' + this.lstAccountProduct.find(item => item.code === this.getAccountProductCode.value).name;
    }
    if (this.getTypeCurrency.value !== '') {
      curr = ' - ' + this.getTypeCurrency.value;
    }
    description = this.detailAccount.accountName + accProductName + curr;
    this.updateAccountForm.get('accountDescription').setValue(description);
  }
}
