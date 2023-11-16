import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MissionService } from 'src/app/services/mission.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { docStatus } from 'src/app/shared/models/documents';
import { CifUdfService } from 'src/app/shared/services/cif-udf.service';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { AccountService } from 'src/app/_services/account.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
import {DEPOSIT_ACCOUNT_CODE, LOAN_ACCOUNT_CODE} from "../shared/constants/account-constants";
declare var $: any;

@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent implements OnInit {
  // khoi tao form
  processId: any;
  @ViewChild('currencyCode') currencyCode: ElementRef;
  @ViewChild('accountProductCode') accountProductCode: ElementRef;
  @ViewChild('accountClassCode') accountClassCode: ElementRef;
  @ViewChild('minBalance') minBalance: ElementRef;
  @ViewChild('accountDescription') accountDescription: ElementRef;

  readonly confim = { // phân biệt hủy hay đống ý confim chờ duyệt
    CANCEL: 'CANCEL',
    CONFIM: 'CONFIM',
  };
  note = '';
  tempBtnPrimary = '';
  desCur = '';
  desProd = '';
  branchName: any;
  isShowPopupApprove = false;
  // truyền ngầm từ client
  accountName: any;
  employeeId: any;
  branchCode: any;
  accountType = 'S'; // kiểu tài khoản là single
  // bat loi form
  readonly btnPrimary = {
    SAVE: 'SAVE',
    SEND_APPROVE: 'SEND_APPROVE' // button phân biệt trường hợp  lưu hay  chờ duyệt
  };
  errAccountProductCode = '';
  errAccountClassCode = '';
  errMinBalance = '';
  errAccountDescription = '';
  errEmployeeCode = '';
  // arr root data
  lstProductRoot = [];
  lstClassRoot = [];
  // array fill data
  lstCurrency: any = [];
  lstProduct: any = [];
  lstClass: any = [];
  lstMinBal: any = [];
  // objêct request
  objRequest = {};
  // check role , check click
  statusCode: any;
  roleLogin: any = [];
  lstAccount: any;
  selectedMaCBNVLPB;
  lstMACBNVLPB = [];
  customerCode: any;
  bodyReq: any;
  isApprove = false;
  isSave = false;
  statusCif: any;
  userInfo: any;
  createdBy: any;
  isCheckDisable = false;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private router: Router,
    private notificationService: NotificationService,
    private location: Location,
    private helpService: HelpsService,
    private cifUdfService: CifUdfService,
    private authenticationService: AuthenticationService,
    private missionService: MissionService,
  ) { }
  ngOnInit(): void {
    this.cifUdfService.getlstMACBNVLPB((res) => {
      this.lstMACBNVLPB = res;
    });
    this.getLocalData();
    // this.getAccountList();
    this.getApiData();
    this.missionService.setProcessId(this.processId);
    $('.childName').html('Tạo mới tài khoản');
  }

  onChangeMaCbnvLpbCode(evt): void {
    this.selectedMaCBNVLPB = evt;
  }

  // lấy data từ local storage
  getLocalData(): void {
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.branchCode = this.userInfo.branchCode;
    this.branchName = this.userInfo.branchName;
    this.getAccountList();
  }

  disableBtn(): void {
    this.isApprove = false;
    this.isSave = false;
  }

  checkEmployeeCode(): void {
    this.errEmployeeCode = '';
    if (!this.selectedMaCBNVLPB || (this.selectedMaCBNVLPB && (this.selectedMaCBNVLPB.employeeName === '' || this.employeeId === ''))) {
      this.errEmployeeCode = 'Mã nhân viên không tồn tại trong hệ thống';
    }
  }

  checkProfilePendding(): void {
    // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
    // tslint:disable-next-line:max-line-length
    if ((this.statusCode === docStatus.EDIT
      || this.statusCode === docStatus.WAIT
      || this.statusCode === docStatus.TEMP
      || this.statusCode === docStatus.MODIFY) && this.createdBy !== this.userInfo.userId) {
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
        if (this.branchCode !== this.userInfo.branchCode) {
          this.showBtnSave();
        }
      }
    }
  }

  showBtnSave(): void {
    this.isSave = true;
    this.isApprove = false;
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

  // Tra cứu nhân viên theo mã
  searchEmployee(evt): void {
    const emplCode = evt ? evt.target.value.trim() : '';
    if (emplCode === '') {
      this.selectedMaCBNVLPB = null;
      this.errEmployeeCode = 'Mã nhân viên không được để trống';
      return;
    }
    this.selectedMaCBNVLPB = null;
    this.helpService.callApi({
      method: HTTPMethod.GET,
      url: '/account/employee/' + emplCode,
      progress: true,
      success: (res) => {
        if (res) {
          this.selectedMaCBNVLPB = {
            employeeId: res.employeeId,
            employeeName: res.employeeId + ' - ' + res.employeeName
          };
          this.checkEmployeeCode();
        } else {
          this.selectedMaCBNVLPB = null;
        }
      },
      error: e => {
        this.checkEmployeeCode();
      }
    });
  }

  // lấy danh sách tài khoản
  getAccountList(): void {
    this.accountService.getAccountList({ processId: this.processId }).subscribe(rs => {
      if (rs.items !== undefined && rs.items.length > 0) {
        this.lstAccount = rs.items;
        this.checkStateFieldEmployeeCode('');
      } else {
        this.lstAccount = null;
      }
    });
  }

  /**
   * Disable or Enable field Employee Code by accountClassCode
   * @param accountClassCode: value from dropdown
   */
  checkStateFieldEmployeeCode(accountClassCode: string): void {
    if (DEPOSIT_ACCOUNT_CODE.includes(accountClassCode) || accountClassCode === '') {
      if (this.lstAccount && this.lstAccount.length > 0) {
        this.lstAccount.forEach(e => {
          // console.log(e);
          if (e.branchCode === this.branchCode && e.accountStatusCode === 'ACTIVE' && !LOAN_ACCOUNT_CODE.includes(e.accountClassCode)) {
            this.selectedMaCBNVLPB = e.employeeId ? {employeeId: e.employeeId, employeeName: e.employeeId + ' - ' + e.employeeName} : null;
            this.isCheckDisable = true;
          }
        });
      } else {
        this.isCheckDisable = false;
      }
    }
    if (LOAN_ACCOUNT_CODE.includes(accountClassCode)) {
      this.isCheckDisable = false;
    }
  }

  getRole(): void {
    this.isSave = this.authenticationService.isPermission(PermissionConst.TAI_KHOAN.CREATE);
    this.isApprove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_ACCOUNT);
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
              this.sendApiCreateAccount();
            } else {
              this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }
  // call api
  getApiData(): void {
    const bodyAcProduct = {
      currencyCode: 'VND'
    };
    const bodyAcClass = {
      currencyCode: 'VND',
      accountProductCode: 'TKTT',
      processId: this.processId
    };
    forkJoin([
      this.accountService.getLstAllCurrency(),
      this.accountService.getLstAccountProduct(bodyAcProduct),
      this.accountService.getLstAccountClass(bodyAcClass),
      this.accountService.getAccountMinBal()
    ]).subscribe(data => {
      const statusCode = 'A';
      if (data && data[0].items) {
        this.lstCurrency = data[0].items.filter(e => e.statusCode === statusCode);
      }

      if (data && data[1].items) {
        this.lstProductRoot = data[1].items;
        // lay data luon bang gia tri khoi tao
        this.lstProductRoot.filter(e => {
          e.statusCode = statusCode;
          if (e.currencyCodes !== null) {
            const a = e.currencyCodes.split(',');
            a.includes(this.currencyCode.nativeElement.value);
          }
          this.lstProduct = this.lstProductRoot;
        });
      }
      if (data && data[2].items) {
        this.lstClassRoot = data[2].items;
      }
      if (data && data[3].items) {
        this.lstMinBal = data[3].items;
      }
    });
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
        // trước kia gửi duyệt check lưu
        if (this.isSave) {
          if (this.customerCode) {
            this.checkEditable();
          } else {
            this.sendApiCreateAccount();
          }
        } else {
          this.notificationService.showError('kiểm tra lại quyền thực hiện', 'Cảnh báo');
        }
        break;
      default:
        break;
    }
  }

  approveProcess(param): void {
    this.tempBtnPrimary = param;
    this.bodyReq = this.requestAddObj();
    // check với hồ sơ của người dùng tạo hiện tại
    if (this.bodyReq) {
      switch (this.tempBtnPrimary) {
        case this.btnPrimary.SAVE:
          if (this.customerCode) {
            // nều là hiện hữu phải check người tạo hồ sơ
            this.checkEditable();
          } else {
            this.sendApiCreateAccount();
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

  dataProduct(): void {
    this.accountProductCode.nativeElement.value = '';
    this.accountClassCode.nativeElement.value = '';
    const productLst = [];
    for (const p of this.lstProductRoot.filter(e => e.currencyCodes !== null)) {
      let lstTempCurrency = [];
      lstTempCurrency = p.currencyCodes.split(',');
      if (
        lstTempCurrency.length > 0 &&
        lstTempCurrency.includes(this.currencyCode.nativeElement.value)
      ) {
        productLst.push(p);
      }
    }
    this.lstProduct = productLst;
  }

  dataClass(): void {
    const currencyCodes = this.currencyCode.nativeElement.value;
    const productCodes = this.accountProductCode.nativeElement.value;
    this.lstClass = [];
    let arrayCurrency = [];
    const bodyAcClass = {
      currencyCode: currencyCodes,
      accountProductCode: productCodes,
      processId: this.processId
    };
    this.accountService.getLstAccountClass(bodyAcClass).subscribe(res => {
      if (res.responseStatus.success) {
        this.lstClassRoot = res.items;
        if (this.lstClassRoot.length > 0) {
          this.lstClassRoot.forEach(e => {
            if (e.currencyCodes !== null) {
              arrayCurrency = e.currencyCodes.split(',');
            }
            if (arrayCurrency.includes(currencyCodes)) {
              this.lstClass.push(e);
            }
          });
          this.desProd = productCodes;
          this.desCur = currencyCodes;
          this.getDecription();
        }
      }
    });
  }

  dataMinBa(): void {
    const currencyCodes = this.currencyCode.nativeElement.value;
    const classCodes = this.accountClassCode.nativeElement.value;
    if (currencyCodes && classCodes) {
      this.lstMinBal.filter(e => {
        if (e.accountClassCode === classCodes && e.currencyCode === currencyCodes) {
          this.minBalance.nativeElement.value = this.formatMoney(e.minBalance);
          this.checkErrBalance();
        }
      });
    }
  }

  dataProcessDetail(evt: any): void {
    this.accountName = evt.customer.person.fullName;
    this.statusCode = evt.statusCode;
    this.customerCode = evt.customerCode;
    this.createdBy = evt.createdBy;
    this.getRole();
    if (evt.customer.statusCif === 'C' || evt.customer.statusCif === 'Y') {
      this.disableBtn();
    } else {
      this.checkProfilePendding();
    }
  }

  formatMoney(val: any): any {
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

  getDecription(): void {
    this.accountDescription.nativeElement.value = '';
    let a = '';
    this.lstProduct.filter(e => { if (e.code === this.desProd) { a = e.name; } });
    if (this.accountDescription.nativeElement.value === null || this.accountDescription.nativeElement.value === '') {
      this.accountDescription.nativeElement.value = this.accountName + ' - ' + a + ' - ' + this.desCur;
    }
    this.checkErrDescription();
  }

  // validate form
  checkErrProduct(): void {
    this.errAccountProductCode = '';
    if (this.accountProductCode.nativeElement.value === '') {
      this.errAccountProductCode = 'Loại tài khoản không được để trống';
    } else {
      this.errAccountProductCode = '';
    }
  }

  checkErrClass(): void {
    this.errAccountClassCode = '';
    if (this.accountClassCode.nativeElement.value === '') {
      this.errAccountClassCode = 'Loại tài khoản không được để trống';
    } else {
      this.errAccountClassCode = '';
      // this.checkStateFieldEmployeeCode(this.accountClassCode.nativeElement.value);
    }
  }

  checkErrBalance(): void {
    this.errMinBalance = '';
    if (this.minBalance.nativeElement.value === '') { this.errMinBalance = 'Số dư duy tri tối thiểu không được để trống'; }
    else { this.errMinBalance = ''; }
  }

  checkErrDescription(): void {
    this.errAccountDescription = '';
    if (this.accountDescription.nativeElement.value === '') { this.errAccountDescription = 'Diễn giải không được để trống'; }
    else { this.errAccountDescription = ''; }
  }

  backPage(): void { this.location.back(); }

  requestAddObj(): any {
    this.checkErrProduct();
    this.checkErrClass();
    this.checkErrBalance();
    this.checkErrDescription();
    this.checkEmployeeCode();
    const regex = /[.,\s]/g;
    if (this.errAccountProductCode === '' && this.errAccountClassCode === ''
      && this.errMinBalance === '' && this.errAccountDescription === '' && this.errEmployeeCode === ''
    ) {
      this.objRequest = {
        processId: this.processId,
        accountName: this.accountName,
        currencyCode: this.currencyCode.nativeElement.value,
        accountProductCode: this.accountProductCode.nativeElement.value,
        accountClassCode: this.accountClassCode.nativeElement.value,
        minBalance: Number(this.minBalance.nativeElement.value.replace(regex, '')),
        employeeId: this.selectedMaCBNVLPB ? this.selectedMaCBNVLPB.employeeId : null,
        branchCode: this.branchCode,
        accountTypeCode: this.accountType,
        accountDescription: this.accountDescription.nativeElement.value,
      };
      return this.objRequest;
    } else {
      return null;
    }
  }

  save(): void {
    // this.isClick = true;
    this.requestAddObj();
    this.accountService.createAccount(this.objRequest).subscribe(res => {
      if (res.responseStatus.success) {
        // this.isClick = true;
        this.notificationService.showSuccess('Thêm mới tài khoản thành công', '');
        this.router.navigate(['./smart-form/manager/account', { processId: this.processId }]);
      } else { this.notificationService.showError('Có lỗi xảy ra', 'Thêm mới thất bại'); }
    });
  }

  /**
   * api xử lý tạo mới tài khoản
   */
  sendApiCreateAccount(): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/account/account/create',
        data: this.bodyReq,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.apiAutoCreate();
            switch (this.tempBtnPrimary) {
              case this.btnPrimary.SAVE:
                this.notificationService.showSuccess('Thêm mới tài khoản thành công', 'Thành công');
                this.routerDetailAccount(res.item.id);
                break;
              case this.btnPrimary.SEND_APPROVE:
                this.sendApiApproveCreateAccount(res.item.id);
                break;
              default:
                break;
            }
          } else {
            this.notificationService.showError('Thêm mới tài khoản thất bại', 'Thất bại');
          }
          this.isShowPopupApprove = false;
        }
      }
    );
  }

  /**
   *  điều hướng đến page detail
   */
  routerDetailAccount(accountId): void {
    this.router.navigate(['./smart-form/manager/detailAccount', {
      processId: this.processId,
      id: accountId
    }]);
  }

  /**
   * api xử lý gửi duyệt tài khoản
   */
  sendApiApproveCreateAccount(accountId: any): void {
    const body = {
      note: this.note,
      id: accountId,
      typeCode: 'ACC'
    };
    if (!body) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendApproveCreateAccount',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Gửi duyệt tài khoản thành công', 'Thành công');
            this.routerDetailAccount(accountId);
          } else {
            this.notificationService.showError('Gửi duyệt tài khoản thất bại', 'Thất bại');
          }
        }
      }
    );
  }
}
