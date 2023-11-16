import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LpbAddressComponent } from 'src/app/shared/components/lpb-address/lpb-address.component';
import { Location } from '@angular/common';
import { AccountOwnerCustomerComponent } from '../account-owner-customer/account-owner-customer.component';
import { AccountOwnerVerifyDocsComponent } from '../account-owner-verify-docs/account-owner-verify-docs.component';
import { addressDefaultVietNam } from '../../../../shared/constants/cif/cif-constants';
import { AccountOwnFatcaComponent } from '../account-owner-fatca/account-owner-fatca.component';
import { AccountOwnerMisComponent } from '../account-owner-mis/account-owner-mis.component';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { compareDate } from 'src/app/shared/constants/utils';
import { docStatus } from 'src/app/shared/models/documents';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
import { AuthenticationService } from 'src/app/_services/authentication.service';
declare var $: any;

@Component({
  selector: 'app-account-owner-update',
  templateUrl: './account-owner-update.component.html',
  styleUrls: ['./account-owner-update.component.scss']
})
export class AccountOwnerUpdateComponent implements OnInit {

  @ViewChild('address', { static: false }) address: LpbAddressComponent; // Tỉnh - Thành phố hiện tại (nội địa)
  @ViewChild('customerInfo', { static: false }) customerInfo: AccountOwnerCustomerComponent;
  @ViewChild('verifyDos', { static: false }) verifyDos: AccountOwnerVerifyDocsComponent;
  @ViewChild('mis', { static: false }) mis: AccountOwnerMisComponent;
  @ViewChild('fatca', { static: false }) fatca: AccountOwnFatcaComponent;
  @ViewChild('toDate', { static: false }) toDate: LpbDatePickerComponent;  // từ ngày
  @ViewChild('fromDate', { static: false }) fromDate: LpbDatePickerComponent;  // Đến ngày

  objDetail: any = {};
  isShowPopupApprove = false;
  note = ''; // trường ghi chú
  tempBtnPrimary = '';
  addressObject: any = {};
  dataAddress: any = {};
  objCustomerInfo: any;
  inpNationality: string; // Quốc tịch 1 để check Validate loại GTXM. Nếu Quốc tịch 1 khác Việt Nam => Loại GTXM chỉ là hộ chiếu
  inpDateOfBirth: moment.MomentInput;  // Ngày sinh để check validate GTXM
  mobileNo = ''; // số Điện thoại
  customerInfoObject: any = {};
  dateOfBirth: any;
  isMis = false;
  isUdf = false;
  isCheckValidGTXM = false;
  isOnlyView = false;
  isCheckDate = false;
  fatcaObject: any;
  perDocNoList = [];
  cachePerDocsList = [];
  readonly btnPrimary = {
    SAVE: 'SAVE',
    SEND_APPROVE: 'SEND_APPROVE' // button phân biệt trường hợp  lưu hay  chờ duyệt
  };
  readonly confim = { // phân biệt hủy hay đống ý confim chờ duyệt
    CANCEL: 'CANCEL',
    CONFIM: 'CONFIM',
  };
  customerCodeHs: any; // mã cif của hồ sơ
  paramDate = '';
  accountId = ''; // id tài khoản
  // err Mis Udf
  errMsgMis = '';
  errMsgUdf = '';
  errMsgDate = '';
  perDocsList = [];
  objectCustomerInfo = {};
  isHaveData = false;
  // tslint:disable-next-line:max-line-length
  objCurrentAddress: { currentCountryCode: any; currentCityName: any; currentDistrictName: any; currentWardName: any; currentStreetNumber: any; currentCountryName?: string; currentAddress?: string };
  typeCustomer = ''; // loại tìm kiếm khách hàng
  codeCustomer = ''; // mã loại tìm kiếm khách hàng
  customers = []; // danh sách khách hàng
  errMsgSearchCustomer = ''; // Thông báo lỗi tìm kiếm khách hàng
  msgEmpty: string; // hiện thỉ nếu không có dữ liệu
  udfObject: any = {};
  misObject: any = {};
  userInfo: any = {};
  isListCustomer = false;
  currentAddressObject = {};
  residentAddressObject = {};
  processId = '';
  misId = '';
  udfId = '';
  PerDocNoId = '';
  customerId = '';
  nationlityFirst = addressDefaultVietNam;
  customerCode = '';
  coowner: any = {};
  requestBody;
  roleLogin: any = [];
  objFatca: any;
  isGDV = false;
  isKSV = false;
  isSendApprove = false;
  isSave = false;
  createdBy: any;
  branchCode: any;
  statusCode = '';
  isSendApproveFastCif = false;
  isSendApproveOwner = false;
  detailId: any; // id cif của khối đồng sở hữu
  detailCownerId: any; // id  của khối đồng sở hữu;
  statusCif: any;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private helpService: HelpsService,
    private _LOCATION: Location,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getDataLocal();
    this.fillDataAddress();
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.detailId = this.route.snapshot.paramMap.get('coOwnerId');
    $('.childName').html('Cập nhật đồng sở hữu');
  }

  getRole(): void {
    this.isSave = this.isSendApproveFastCif = this.isSendApproveOwner = false;
    this.isSave = this.authenticationService.isPermission(PermissionConst.TK_DONG_SO_HUU.UPDATE);
    this.isSendApproveFastCif = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_FAST_CIF);
    this.isSendApproveOwner = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_COOWNER);
    this.isSendApprove = (this.customerCode !== null ? this.isSendApproveOwner : this.isSendApproveFastCif);
  }

  checkCoreInfo(customerCode): void {
    if (customerCode !== null && customerCode !== '') {
      this.customerCode = customerCode;
      this.isOnlyView = true;
    }
  }

  getDetailAccountInformation(): void {
    const body = {
      id: this.accountId
    };
    if (!body) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/account/account/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.branchCode = res.item.branchCode;
            this.getRole();
            if (this.statusCif === 'Y' || this.statusCif === 'C') {
              this.disableBtn();
            }
            this.actionButton();
          } else {
            this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
          }
        }
      }
    );
  }
  getCustomerDetail(): void {
    if (this.processId) {
      const body = {
        id: this.detailId
      };
      if (!body) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return;
      }
      this.helpService.callApi({
        method: HTTPMethod.POST,
        url: '/process/customer/detailCoowner',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.objDetail = res.item;
            this.accountId = res.item.accountId;
            this.detailCownerId = this.objDetail.coowner.id;
            this.cachePerDocsList = this.objDetail.person.perDocNoList;
            this.customerCode = this.objDetail.customerCode;
            this.checkCoreInfo(this.objDetail.customerCode);
            this.fillDataFatca(this.objDetail.person);
            this.udfObject = this.objDetail.udf;
            this.misObject = this.objDetail.mis;
            this.misId = this.misObject.id;
            this.udfId = this.udfObject.id;
            this.accountId = this.objDetail.accountId;
            this.fillTimeUpdateOwner(this.objDetail);
            this.coowner = this.objDetail.coowner;
            this.objCustomerInfo = this.objDetail.person;
            this.fillDataPerDocsList(this.objDetail.person);
            this.fillDataCustomerAddress(this.objDetail.person);
            this.getDetailAccountInformation();
          }
        }
      });
    }
  }

  backPage(): void {
    this._LOCATION.back();
  }

  getObjMis(evt): void {
    this.misObject = evt;
    this.closeMis(false);
    this.ValidateMis();
  }
  closeMis(evt): void {
    this.isMis = evt;
  }
  showMis(): void {
    this.isMis = true;
  }
  getObjUdf(evt): void {
    this.udfObject = evt;
    this.closeUdf();
    this.validateUdf();
  }
  showUdf(): void {
    this.isUdf = true;
  }
  closeUdf(): void {
    this.isUdf = false;
  }
  ValidateMis(): void {
    this.errMsgMis = '';
    if (!this.misObject) {
      this.errMsgMis = 'Không được để trống khối MIS';
      return;
    }
  }
  validateUdf(): void {
    this.errMsgUdf = '';
    if (!this.udfObject) {
      this.errMsgUdf = 'Không được để trống khối UDF';
      return;
    }
  }
  fillDataAddress(): void {
    if (this.userInfo) {
      this.currentAddressObject = {
        currentCountryCode: this.nationlityFirst.code,
        currentCountryName: this.nationlityFirst.name,
        currentCityName: this.userInfo ? this.userInfo.cityName : '',
      };
      this.residentAddressObject = {
        residenceCountryCode: this.nationlityFirst.code,
        residenceCountryName: this.nationlityFirst.name,
        residenceCityName: this.userInfo ? this.userInfo.cityName : '',
      };
    }
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
          this.integratedApiUpdateCoowner();
        } else {
          this.notificationService.showError('kiểm tra lại quyền thực hiện', 'Cảnh báo');
        }
        break;
      default:
        break;
    }
  }
  /**
   * api xử lý update đông chủ sở hữu
   */
  sendApiUpdateCoowner(): void {

    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customer/updateCoowner',
        data: this.requestBody,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.apiAutoCreate();
            switch (this.tempBtnPrimary) {
              case this.btnPrimary.SAVE:
                this.notificationService.showSuccess('Cập nhập Đồng sở hữu thành công', 'Thành công');
                // tslint:disable-next-line:whitespace
                this.routerDetailOwner(res.item.id);
                break;
              case this.btnPrimary.SEND_APPROVE:
                // kiểm tra nếu  nếu cif là duyệt thành công tạo mới nhưng chưa gán đồng sở hữu cho tài khoản
                if (this.customerCode !== null) {
                  // nếu là gửi duyệt hiện hữu
                  this.sendApiApproveCoowner(this.detailCownerId, 'PCO');
                } else {
                  // nếu là gửi duyệt là không hiện hữu thì duyệt cả cif
                  this.sendApiApproveFastCIF(this.detailId, 'COOWNER');
                }
                break;
              default:
                break;
            }
          } else {
            this.notificationService.showError('Cập nhập Đồng sở hữu thất bại', 'Thất bại');
          }
        }
      }
    );
  }

  /**
   *  api xử lý chờ duyệt tạo cif nhanh
   */
  sendApiApproveFastCIF(itemId: any, typeCode: string): void {
    const body = {
      note: this.note,
      id: itemId,
      typeCode
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendApproveCreateFastCIF',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.sendApiApproveCoowner(this.detailCownerId, 'PCO');
          } else {
            this.notificationService.showError('Gửi duyệt dịch vụ thất bại', 'Thất bại');
          }
          this.isShowPopupApprove = false;
        }
      }
    );
  }

  /**
   *  điều hướng đến page detail
   */
  routerDetailOwner(coOwnerId): void {
    this.router.navigate(['./smart-form/manager/co-owner/view', {
      processId: this.processId,
      accountId: this.accountId,
      coOwnerId
    }]);
  }
  /**
   *  api xử lý chờ duyệt
   */
  sendApiApproveCoowner(itemId: any, typeCode: string): void {
    const body = {
      note: this.note,
      id: itemId,
      typeCode
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendApproveCreateCoowner',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Gửi duyệt dịch vụ thành công', 'Thành công');
            this.routerDetailOwner(this.detailId);
          } else {
            this.notificationService.showError('Gửi duyệt dịch vụ thất bại', 'Thất bại');
          }
          this.isShowPopupApprove = false;
        }
      }
    );
  }

  getDetail(event): void {
    this.customerCodeHs = event.customerCode;
    this.statusCode = event.statusCode;
    this.createdBy = event.createdBy;
    this.statusCif = event.customer.statusCif;
    this.getCustomerDetail();
  }
  /**
   *  kiểm tra hồ sơ ấy có phải là người tạo hay ko
   */
  checkEditable(): void {
    const body = {
      processId: this.processId,
      customerCode: this.customerCodeHs
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
              // nếu là đúng
              this.sendApiUpdateCoowner();
            } else {
              this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }
  approveProcess(param): void {
    this.tempBtnPrimary = param;
    if (this.validateAcccountCoowner()) {
      switch (this.tempBtnPrimary) {
        case this.btnPrimary.SAVE:
          this.integratedApiUpdateCoowner();
          break;
        case this.btnPrimary.SEND_APPROVE:
          this.isShowPopupApprove = true;
          break;
        default:
          break;
      }
    } else {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
    }
  }
  validDateOfBirth(): void {
    const msg = 'Ngày sinh không được lớn hơn ngày cấp';
    // tslint:disable-next-line:semicolon
    if (this.verifyDos.dpDateSupplyFirst.errorMsg === '') {
      this.verifyDos.dpDateSupplyFirst.setErrorMsg('');
    }
    if (this.verifyDos.dpDateSupplySecond.errorMsg === '') {
      this.verifyDos.dpDateSupplySecond.setErrorMsg('');
    }
    if (this.verifyDos.dpDateSupplyThird.errorMsg === '') {
      this.verifyDos.dpDateSupplyThird.setErrorMsg('');
    }
    if (this.verifyDos.dpDateSupplyFirst.getValue() !== '') {
      // tslint:disable-next-line:max-line-length
      const tempDateFirst = compareDate(this.customerInfo.dpDateOfBirth.getSelectedDate(), this.verifyDos.dpDateSupplyFirst.getSelectedDate());
      if (tempDateFirst === 1) {
        setTimeout(() => {
          this.verifyDos.dpDateSupplyFirst.setErrorMsg(msg);
        }, 1);
        this.isCheckValidGTXM = false;
      }
    }
    if (this.verifyDos.dpDateSupplySecond.getValue() !== '') {
      // tslint:disable-next-line:max-line-length
      const tempDateSecond = compareDate(this.customerInfo.dpDateOfBirth.getSelectedDate(), this.verifyDos.dpDateSupplySecond.getSelectedDate());
      if (tempDateSecond === 1) {
        setTimeout(() => {
          this.verifyDos.dpDateSupplySecond.setErrorMsg(msg);
        }, 1);
        this.isCheckValidGTXM = false;
      }
    }
    if (this.verifyDos.dpExpDateThird.getValue() !== '') {
      // tslint:disable-next-line:max-line-length
      const tempDateThird = compareDate(this.customerInfo.dpDateOfBirth.getSelectedDate(), this.verifyDos.dpDateSupplyThird.getSelectedDate());
      if (tempDateThird === 1) {
        setTimeout(() => {
          this.verifyDos.dpDateSupplyThird.setErrorMsg(msg);
        }, 1);
        this.isCheckValidGTXM = false;
      }
    }
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
  /**
   * thiết lập data request to api
   */
  integratedApiUpdateCoowner(): any {
    if (this.isOnlyView) {
      // trường hợp là data core
      this.getDataFormAddressCore();
    }
    this.integratedNumberVerifyDocs(this.verifyDos.verifyNumberDocsFirst);
  }
  validateAcccountCoowner(): any {
    this.getCustomerInfor();
    this.getFATCAform();
    this.getPerDocsList();
    this.validDateOfBirth();
    this.validFromDate();
    this.validToDate();
    if (!this.isOnlyView) {
      this.getDataFormAddress();
      this.ValidateMis();
      this.validateUdf();
    }
    if (this.isOnlyView && !this.isCheckDate) {
      return true;
    } else {
      // tslint:disable-next-line:max-line-length
      if ((this.objFatca && this.objFatca.checkedFatca && this.objFatca.fatcaCode == null) || (!this.objFatca.checkedFatca && this.nationlityFirst.code === 'US') ||
        !this.dataAddress ||
        !this.isCheckValidGTXM ||
        !this.customerInfoObject ||
        this.errMsgMis !== '' ||
        this.errMsgUdf !== '' || this.isCheckDate
      ) {
        return false;
      } else {
        return true;
      }
    }
  }
  /*
  *kiểm tra Thông tin số GTXM bị trùng trước khi lưu
  */
  integratedNumberVerifyDocs(numberDocs): void {
    this.searchNumberVerifyDocs(numberDocs, data => {
      this.isHaveData = false;
      this.cachePerDocsList.forEach(el => {
        if (numberDocs === el.perDocNo) {
          this.isHaveData = true;

        }
      });
      if (data.length > 0 && !this.isHaveData) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return null;
      } else {
        this.createRequest();
        if (this.verifyDos.verifyNumberDocsSecond) {
          this.integratedNumberVerifyDocsSecond(this.verifyDos.verifyNumberDocsSecond);
        }
        if (!this.requestBody) {
          this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
          return;
        }
        if (!this.verifyDos.verifyNumberDocsSecond) {
          if (this.customerCodeHs) {
            this.checkEditable();
          } else {
            this.sendApiUpdateCoowner();
          }
        }
      }
    });
  }
  /* search Thông tin số GTXM
  *
  */
  searchNumberVerifyDocs(numberVerifyDoc, callback?: any): void {
    const body = {
      uidValue: numberVerifyDoc
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customerSearch/searchCustomer',
        data: body,
        // tslint:disable-next-line:object-literal-shorthand
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            if (callback) {
              let arrayInfor = [];
              if (res.items.length !== 0) {
                arrayInfor = res.items;
              }
              if (res.pendingProcessList.length !== 0) {
                arrayInfor = res.pendingProcessList;
              }
              callback(arrayInfor);
            }
          } else {
            if (callback) {
              callback([]);
            }
          }
        }
      }
    );
  }
  /*
  *kiểm tra Thông tin số GTXM bị trùng trước khi lưu
  */
  integratedNumberVerifyDocsSecond(numberDocs): void {
    this.searchNumberVerifyDocs(numberDocs, data => {
      this.isHaveData = false;
      this.cachePerDocsList.forEach(el => {
        if (numberDocs === el.perDocNo) {
          this.isHaveData = true;
        }
      });
      if (data.length > 0 && !this.isHaveData) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return null;
      } else {
        this.createRequest();
        if (this.verifyDos.verifyNumberDocsThird) {
          this.integratedNumberVerifyDocsverifyThird(this.verifyDos.verifyNumberDocsThird);
        }
        if (!this.requestBody) {
          this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
          return;
        }
        if (!this.verifyDos.verifyNumberDocsThird) {
          if (this.customerCodeHs) {
            this.checkEditable();
          } else {
            this.sendApiUpdateCoowner();
          }
        }
      }
    });
  }
  /*
  *kiểm tra Thông tin số GTXM bị trùng trước khi lưu
  */
  integratedNumberVerifyDocsverifyThird(numberDocs): void {
    this.searchNumberVerifyDocs(numberDocs, data => {
      this.isHaveData = false;
      this.cachePerDocsList.forEach(el => {
        if (numberDocs === el.perDocNo) {
          this.isHaveData = true;
        }
      });
      if (data.length > 0 && !this.isHaveData) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return null;
      } else {
        this.createRequest();
        if (!this.requestBody) {
          this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
          return;
        }
        if (this.customerCodeHs) {
          this.checkEditable();
        } else {
          this.sendApiUpdateCoowner();
        }
      }
    });
  }
  actionButton(): void {
    this.checkHiddenButton();
    this.checkProfilePendding();
  }

  checkHiddenButton(): void {
    // tạo mới duyệt thành công hiện tại
    if (this.statusCode === docStatus.APPROVED) {
      this.disableBtn();
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

  createRequest(): void {
    this.udfObject.id = this.udfId;
    this.misObject.id = this.misId;
    const persons = {
      perDocNoList: this.perDocsList,
      fullName: this.customerInfoObject.fullName,
      genderCode: this.customerInfoObject.genderCode,
      dateOfBirth: this.customerInfoObject.dateOfBirth,
      mobileNo: this.customerInfoObject.mobileNo,
      residentStatus: this.customerInfoObject.residentStatus === 'Y' ? true : false,
      profession: this.customerInfoObject.profession,
      position: this.customerInfoObject.position,
      nationality1Code: this.customerInfoObject.nationality1Code,
      nationality2Code: this.customerInfoObject.nationality2Code,
      nationality3Code: this.customerInfoObject.nationality3Code,
      nationality4Code: this.customerInfoObject.nationality4Code,
      workPlace: this.customerInfo.workPlace.nativeElement.value,
      email: this.customerInfoObject.email,
      payStatus: this.customerInfoObject.payStatus,
      creditStatus: this.customerInfoObject.creditStatus === true,
      visaExemption: this.customerInfo.isVisaFree ? null : this.customerInfo.isVisaFree,
      // tslint:disable-next-line:max-line-length
      visaIssueDate: !this.customerInfo.isVisaFree && this.customerInfo.dpFromDateVisaFree.getValue() !== '' ? this.customerInfo.dpFromDateVisaFree.getValue() : null,
      // tslint:disable-next-line:max-line-length
      visaExpireDate: !this.customerInfo.isVisaFree && this.customerInfo.dpToDateVisaFree.getValue() !== '' ? this.customerInfo.dpToDateVisaFree.getValue() : null,
      residenceCountryCode: this.dataAddress.residenceCountryCode,
      residenceCityName: this.dataAddress.residenceCityName,
      residenceDistrictName: this.dataAddress.residenceDistrictName,
      residenceWardName: this.dataAddress.residenceWardName,
      residenceStreetNumber: this.dataAddress.residenceStreetNumber,
      currentCountryCode: this.dataAddress.currentCountryCode,
      currentCityName: this.dataAddress.currentCityName,
      currentDistrictName: this.dataAddress.currentDistrictName,
      currentWardName: this.dataAddress.currentWardName,
      currentStreetNumber: this.dataAddress.currentStreetNumber,
      taxCode: this.customerInfo.taxCode,
      language: 'VIETNAMESE',
      fatcaCode: (this.objFatca ? this.objFatca.fatcaCode : ''),
      fatcaForm: (this.objFatca ? this.objFatca.fatcaForm : ''),
      fatcaAnswer: (this.objFatca ? this.objFatca.fatcaAnswer : '')
    };

    const coowner = {
      jointStartDate: this.fromDate.getValue(),
      jointEndDate: this.toDate.getValue(),
      customerCode: this.customerCode,
      id: this.coowner.id
    };
    this.requestBody = {
      customerCode: this.customerCode,
      id: this.detailId,
      accountId: this.accountId,
      branchCode: this.branchCode,
      customerTypeCode: 'INDIV',
      customerCategoryCode: 'INDIV',
      person: persons,
      // tslint:disable-next-line:object-literal-shorthand
      coowner: coowner,
      udf: this.udfObject,
      mis: this.misObject,
    };
  }

  validFromDate(): void {
    this.isCheckDate = false;
    this.fromDate.setErrorMsg('');
    const contentInputDateOfBirth = this.fromDate.haveValue() ? this.fromDate.getValue() : '';
    if (contentInputDateOfBirth === '') {
      this.fromDate.setErrorMsg('Từ ngày không được để trống');
      this.isCheckDate = true;
      return;
    }
    if (!this.fromDate.haveValidDate()) {
      this.fromDate.setErrorMsg('Từ ngày sai định dạng');
      this.isCheckDate = true;
      return;
    }
  }

  validToDate(): void {
    this.isCheckDate = false;
    this.toDate.setErrorMsg('');
    const contentInputDateOfBirth = this.toDate.haveValue() ? this.toDate.getValue() : '';
    if (contentInputDateOfBirth === '') {
      return;
    }
    if (!this.toDate.haveValidDate()) {
      this.toDate.setErrorMsg('Đến ngày sai định dạng');
      this.isCheckDate = true;
      return;
    }
    if (compareDate(moment(this.toDate.getValue(), 'DD/MM/YYYY'), moment(Date.now()).format('DD/MM/YYYY')) === -1) {
      this.toDate.setErrorMsg('Đến ngày không được nhỏ hơn ngày hiện tại');
      this.isCheckDate = true;
      return;
    }
    // tslint:disable-next-line:prefer-const
    let toDate = moment(this.toDate.getValue(), 'DD/MM/YYYY');
    // tslint:disable-next-line:prefer-const
    let fromDate = moment(this.fromDate.getValue(), 'DD/MM/YYYY');
    if (toDate.toDate().getTime() < fromDate.toDate().getTime()) {
      this.toDate.setErrorMsg('từ ngày không được lớn hơn đến ngày');
      this.isCheckDate = true;
      return;
    }
  }
  /**
   *  điền thông tin thời gian đồng sở hữu hiện hữu
   */
  fillTimeUpdateOwner(customerInfo): void {
    if (customerInfo.coowner) {
      this.fromDate.setValue(customerInfo.coowner.jointStartDate);
      this.toDate.setValue(customerInfo.coowner.jointEndDate);
    } else {
      this.fromDate.setValue('');
      this.toDate.setValue('');
    }

  }
  /**
   *  điền thông tin giấy tờ xác minh
   */
  fillDataPerDocsList(customerInfo): void {
    this.perDocsList = customerInfo.perDocNoList;
  }
  /**
   *  điền thông tin Fatca
   */
  fillDataFatca(customerInfo): void {
    this.fatcaObject = customerInfo.fatcaCode ? {
      fatcaCode: customerInfo.fatcaCode,
      fatcaAnswer: customerInfo.fatcaAnswer,
      fatcaForm: customerInfo.fatcaForm
    } : null;
  }
  /**
   *  điền thông tin địa chỉ được tìm kiếm
   */
  fillDataCustomerAddress(customerInfo): void {
    this.currentAddressObject = {
      currentCountryCode: customerInfo.currentCountryCode,
      currentCountryName: customerInfo.currentCountryName,
      currentCityName: customerInfo.currentCityName,
      currentDistrictName: customerInfo.currentDistrictName,
      currentWardName: customerInfo.currentWardName,
      currentStreetNumber: customerInfo.currentStreetNumber
    };
    this.residentAddressObject = {
      residenceCountryCode: customerInfo.residenceCountryCode,
      residenceCountryName: customerInfo.residenceCountryName,
      residenceCityName: customerInfo.residenceCityName,
      residenceDistrictName: customerInfo.residenceDistrictName,
      residenceWardName: customerInfo.residenceWardName,
      residenceStreetNumber: customerInfo.residenceStreetNumber
    };
  }

  getDataLocal(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
  }
  getInfoCustomer(): void {
    this.objCustomerInfo = this.customerInfo.getDataCifCustomerForm();
  }
  /**
   * chăn nhập space
   */
  dateInputChange(val: string, param: string): void {
    if (param === 'TU_NGAY') {
      if (val !== null && val.trim() === '') {
        this.fromDate.setValue(val.trim());
        this.fromDate.setErrorMsg('');
      }
    }
    if (param === 'DEN_NGAY') {
      if (val !== null && val.trim() === '') {
        this.toDate.setValue(val.trim());
        this.toDate.setErrorMsg('');
      }
    }
  }
  mobileNoValueChange(evt): void {
    this.mobileNo = evt;
  }
  nationiltyFisrtValueChange(evt): void {
    this.nationlityFirst = evt;
  }
  dateOfBirthValueChange(evt): void {
    this.dateOfBirth = evt;
  }
  /**
   * nhận data khối customer
   */
  getCustomerInfor(): void {
    this.customerInfoObject = this.customerInfo.getDataCifCustomerForm();
  }
  /**
   * nhận data khối giấy tờ xác minh
   */
  getPerDocsList(): void {
    const objPerDocs: any = this.verifyDos.getPerDocsList();
    this.isCheckValidGTXM = objPerDocs.isResultValid;
    if (objPerDocs.isResultValid) {
      this.perDocsList = objPerDocs.result;
    }
  }
  /**
   * nhận data khối fatca
   */
  getFATCAform(): void {
    this.objFatca = this.fatca.getFATCAform();
  }
  /**
   * nhận data khối address
   */
  getDataFormAddress(): void {
    this.dataAddress = this.address.getDataFormAddress();
  }

  getDataFormAddressCore(): void {
    let result = null;
    // địa chỉ hiện tại và địa chỉ thường trú ở Việt Nam
    if (this.address.selectedCurrentCountry.code === 'VN' && this.address.selectedResidentCountry.code === 'VN') {
      result = Object.assign(this.address.getdataAddCurrentress(), this.address.getDataResidentAddress());

    }
    // địa chỉ hiện tại khác Việt Nam và địa chỉ thường trú khác Việt Nam
    if (this.address.selectedCurrentCountry.code !== 'VN' && this.address.selectedResidentCountry.code !== 'VN') {
      result = Object.assign(this.address.getDataResidentAddressForeign(), this.address.getDataCurrentAddressForeign());

    }
    // địa chỉ hiện tại ở Việt Nam và địa chỉ thường trú khác Việt Nam
    if (this.address.selectedCurrentCountry.code === 'VN' && this.address.selectedResidentCountry.code !== 'VN') {
      result = Object.assign(this.address.getdataAddCurrentress(), this.address.getDataResidentAddressForeign());

    }
    // địa chỉ hiện tại khác Việt Nam và địa chỉ thường trú ở Việt Nam
    if (this.address.selectedCurrentCountry.code !== 'VN' && this.address.selectedResidentCountry.code === 'VN') {
      result = Object.assign(this.address.getDataCurrentAddressForeign(), this.address.getDataResidentAddress());

    }
    this.dataAddress = result;
  }
}
