import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { LpbAddressComponent } from 'src/app/shared/components/lpb-address/lpb-address.component';
import { AccountOwnerCustomerComponent } from '../account-owner-customer/account-owner-customer.component';
import { AccountOwnerVerifyDocsComponent } from '../account-owner-verify-docs/account-owner-verify-docs.component';
// tslint:disable-next-line:quotemark
import { addressDefaultVietNam } from "../../../../shared/constants/cif/cif-constants";
import { AccountOwnFatcaComponent } from '../account-owner-fatca/account-owner-fatca.component';
import { AccountOwnerMisComponent } from '../account-owner-mis/account-owner-mis.component';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { Location } from '@angular/common';
import { compareDate } from 'src/app/shared/constants/utils';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
import { docStatus } from 'src/app/shared/models/documents';
declare var $: any;

@Component({
  selector: 'app-account-owner-create',
  templateUrl: './account-owner-create.component.html',
  styleUrls: ['./account-owner-create.component.scss']
})
export class AccountOwnerCreateComponent implements OnInit {

  @ViewChild('address', { static: false }) address: LpbAddressComponent; // Tỉnh - Thành phố hiện tại (nội địa)
  @ViewChild('customerInfo', { static: false }) customerInfo: AccountOwnerCustomerComponent;
  @ViewChild('verifyDos', { static: false }) verifyDos: AccountOwnerVerifyDocsComponent;
  @ViewChild('mis', { static: false }) mis: AccountOwnerMisComponent;
  @ViewChild('fatca', { static: false }) fatca: AccountOwnFatcaComponent;
  @ViewChild('toDate', { static: false }) toDate: LpbDatePickerComponent;  // từ ngày
  @ViewChild('fromDate', { static: false }) fromDate: LpbDatePickerComponent;  // Đến ngày
  @Input() isExistCore: any;
  requestBody;
  isHaveData = false;
  isCheckValidGTXM = false;
  isShowPopupApprove = false;
  note = ''; // trường ghi chú
  customerCode = null; // mã cif tìm kiếm
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
  isOnlyView = false;
  isCheckDate = false;
  fatcaObject: any;
  cachePerDocNoList = [];
  perDocNoList: any = [];
  customerCodeHs: any; // mã cif của hồ sơ
  readonly btnPrimary = {
    SAVE: 'SAVE',
    SEND_APPROVE: 'SEND_APPROVE' // button phân biệt trường hợp  lưu hay  chờ duyệt
  };
  readonly confim = { // phân biệt hủy hay đống ý confim chờ duyệt
    CANCEL: 'CANCEL',
    CONFIM: 'CONFIM',
  };
  paramDate = '';
  accountId = '';
  itemId = '';
  // err Mis Udf
  errMsgMis = '';
  errMsgUdf = '';
  errMsgDate = '';
  perDocsList = [];
  // tslint:disable-next-line:max-line-length
  objCurrentAddress: { currentCountryCode: any; currentCityName: any; currentDistrictName: any; currentWardName: any; currentStreetNumber: any; currentCountryName?: string; currentAddress?: string };
  typeCustomer = ''; // loại tìm kiếm khách hàng
  codeCustomer = ''; // mã loại tìm kiếm khách hàng
  customers = []; // danh sách khách hàng
  errMsgSearchCustomer = ''; // Thông báo lỗi tìm kiếm khách hàng
  msgEmpty: string; // hiện thỉ nếu không có dữ liệu
  udfObject: any;
  misObject: any;
  userInfo: any;
  isInfoCore = false;
  isListCustomer = false;
  currentAddressObject = {};
  residentAddressObject = {};
  processId = '';
  nationlityFirst = addressDefaultVietNam;
  detailId; // khởi tạo id của view detail đồng sở hữu
  roleLogin: any = [];
  isGDV = false;
  isKSV = false;
  isDisableButton = false;
  listSignature: any;
  isApprove = false;
  isSave = false;
  accountName: any;
  statusCode: any;
  detailCownerId: any;
  createdBy: any;
  branchCode: any;
  statusCif: any;

  constructor(
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private helpService: HelpsService,
    private router: Router,
    private _LOCATION: Location,
    private authenticationService: AuthenticationService
    // private ckr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getDataLocal();
    this.fillDataAddress();
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    $('.childName').html('Tạo mới đồng sở hữu');
  }

  getRole(): void {
    this.isSave = this.isApprove = false;
    this.isSave = this.authenticationService.isPermission(PermissionConst.TK_DONG_SO_HUU.CREATE);
    this.isApprove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_COOWNER);
  }
  getDetail(event): void {
    this.accountName = event.customer.person.fullName;
    this.statusCode = event.statusCode;
    this.customerCodeHs = event.customerCode;
    this.createdBy = event.createdBy;
    this.statusCif = event.customer.statusCif;
    this.getDetailAccountInformation();
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
            if (this.statusCif === 'C' || this.statusCif === 'Y') {
              this.disableBtn();
            } else {
              this.checkProfilePendding();
            }
          } else {
            this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
          }
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
              this.sendApiCreateCoowner();
            } else {
              this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }

  disableBtn(): void {
    this.isApprove = false;
    this.isSave = false;
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
   * remove messsage báo lỗi
   */
  resetMsgAttribute(): void {
    setTimeout(() => {
      this.customerInfo.errMsgFullName = '';
      this.customerInfo.errMsgMobileNo = '';
      this.customerInfo.errMsgProfession = '';
      this.customerInfo.errMsgWorkPlace = '';
      this.customerInfo.errMsgVerifyDocsNumber = '';
      this.customerInfo.errMsgNationality = '';
      this.customerInfo.errMsgDateOfBirth = '';
      this.customerInfo.errMsgFromDateVisaFreeDate = '';
      this.customerInfo.errMsgEmail = '';
      this.customerInfo.errMsgJobPosition = '';
      this.verifyDos.errMsgTypeVerifyDocsFirst = '';
      this.verifyDos.errMsgVerifyNumberDocsFirst = '';
      this.verifyDos.errMsgSupplyDateFirst = '';
      this.verifyDos.errMsgExpDateFirst = '';
      this.verifyDos.errMsgProvideByFirst = '';
      this.verifyDos.errMsgBlockVerifyDocsFirst = '';
      this.verifyDos.errMsgTypeVerifyDocsThird = '';
      this.verifyDos.errMsgVerifyNumberDocsThird = '';
      this.verifyDos.errMsgSupplyDateThird = '';
      this.verifyDos.errMsgExpDateThird = '';
      this.verifyDos.errMsgProvideByThird = '';
      this.verifyDos.errMsgBlockVerifyDocsThird = '';
      this.verifyDos.errMsgTypeVerifyDocsSecond = '';
      this.verifyDos.errMsgVerifyNumberDocsSecond = '';
      this.verifyDos.errMsgSupplyDateSecond = '';
      this.verifyDos.errMsgExpDateSecond = '';
      this.verifyDos.errMsgProvideBySecond = '';
      this.verifyDos.errMsgBlockVerifyDocsSecond = '';
      this.address.errMsgCurrentCountry = '';
      this.address.errMsgCurrentProvice = '';
      this.address.errMsgCurrentDistrict = '';
      this.address.errMsgCurrentWard = '';
      this.address.errMsgCurrentAddress = '';
      this.address.errMsgResidentCountry = '';
      this.address.errMsgResidentProvice = '';
      this.address.errMsgResidentDistrict = '';
      this.address.errMsgResidentWard = '';
      this.address.errMsgResidentAddress = '';
      this.errMsgMis = '';
      this.errMsgUdf = '';
      this.fatca.errMsgFatcaCode = '';
      this.fatca.errMsgFatcaType = '';
      this.fatca.errMsgFatcaForm = '';
      this.fatca.errMsgFatcaBlock = '';
    }, 1);
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
          this.integratedApiCreateCoowner();
        } else {
          this.notificationService.showError('kiểm tra lại quyền thực hiện', 'Cảnh báo');
        }
        break;
      default:
        break;
    }
  }
  /**
   * api xử lý tạo mới đông chủ sở hữu
   */
  sendApiCreateCoowner(): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customer/createCoowner',
        data: this.requestBody,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.apiAutoCreate();
            // lấy id view màn detail
            this.detailId = res.item.id;
            this.detailCownerId = res.item.coowner.id;
            switch (this.tempBtnPrimary) {
              case this.btnPrimary.SAVE:
                this.notificationService.showSuccess('Tạo mới Đồng sở hữu thành công', 'Thành công');
                // tslint:disable-next-line:whitespace
                this.routerDetailCoOwner(this.detailId);
                break;
              case this.btnPrimary.SEND_APPROVE:
                if (this.customerCode !== null) {
                  this.sendApiApproveCoowner(this.detailCownerId, 'PCO');
                } else {
                  this.sendApiApproveFastCIF(this.detailId, 'COOWNER');
                }
                this.customerCode = null;
                break;
              default:
                break;
            }
          } else {
            // this.notificationService.showError('CIF DSH không được trùng CIF chính', 'Thất bại');
            this.notificationService.showError('Có lỗi dữ liệu: ' + res.responseStatus.codes[0].detail, 'Thất bại');
          }
        }
      }
    );
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
  /**
   *  điều hướng đến page detail
   */
  routerDetailCoOwner(coOwnerId): void {
    this.router.navigate(['./smart-form/manager/co-owner/view', {
      processId: this.processId,
      accountId: this.accountId,
      coOwnerId
    }]);
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
            this.routerDetailCoOwner(this.detailId);
          } else {
            this.notificationService.showError('Gửi duyệt dịch vụ thất bại', 'Thất bại');
          }
          this.isShowPopupApprove = false;
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

  approveProcess(param): void {
    this.tempBtnPrimary = param;
    if (this.validateAcccountCoowner()) {
      switch (this.tempBtnPrimary) {
        case this.btnPrimary.SAVE:
          this.integratedApiCreateCoowner();
          break;
        case this.btnPrimary.SEND_APPROVE:
          this.isShowPopupApprove = true;
          break;
        default:
          break;
      }
    } else {
      // this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
    }

  }
  /**
   * thiết lập data request to api
   */
  integratedApiCreateCoowner(): any {
    if (this.isOnlyView) {
      // data core
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
      if ((this.fatcaObject && this.fatcaObject.checkedFatca && this.fatcaObject.fatcaCode == null) || (!this.fatcaObject.checkedFatca && this.nationlityFirst.code === 'US') ||
        !this.dataAddress ||
        !this.isCheckValidGTXM ||
        !this.customerInfoObject ||
        this.errMsgMis !== '' ||
        this.errMsgUdf !== '' ||
        this.isCheckDate ||
        this.fromDate.errorMsg !== '' ||
        this.toDate.errorMsg !== ''
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
  integratedNumberVerifyDocsverifyThird(numberDocs): void {
    this.searchNumberVerifyDocs(numberDocs, data => {
      this.isHaveData = false;
      this.perDocsList.forEach(el => {
        if (numberDocs === el.perDocNo) {
          this.isHaveData = true;
        }
      });
      if (data.length > 0 && this.isHaveData && !this.isOnlyView) {
        return null;
      } else {
        this.createRequest();
        if (this.customerCodeHs) {
          this.checkEditable();
        } else {
          this.sendApiCreateCoowner();
        }
      }
    });
  }

  /*
  *kiểm tra Thông tin số GTXM bị trùng trước khi lưu
  */
  integratedNumberVerifyDocs(numberDocs): void {
    this.searchNumberVerifyDocs(numberDocs, data => {
      this.isHaveData = false;
      this.perDocsList.forEach(el => {
        if (numberDocs === el.perDocNo) {
          this.isHaveData = true;
        }
      });
      if (data.length > 0 && this.isHaveData && !this.isOnlyView) {
        return null;
      } else {
        this.createRequest();
        if (this.verifyDos.verifyNumberDocsSecond) {
          this.integratedNumberVerifyDocsSecond(this.verifyDos.verifyNumberDocsSecond);
        }
        if (!this.verifyDos.verifyNumberDocsSecond) {
          if (this.customerCodeHs) {
            this.checkEditable();
          } else {
            this.sendApiCreateCoowner();
          }
        }
      }
    });
  }
  /*
 *kiểm tra Thông tin số GTXM bị trùng trước khi lưu
 */
  integratedNumberVerifyDocsSecond(numberDocs): void {
    this.searchNumberVerifyDocs(numberDocs, data => {
      this.isHaveData = false;
      this.perDocsList.forEach(el => {
        if (numberDocs === el.perDocNo) {
          this.isHaveData = true;
        }
      });
      if (data.length > 0 && this.isHaveData && !this.isOnlyView) {
        return null;
      } else {
        this.createRequest();
        if (this.verifyDos.verifyNumberDocsThird) {
          this.integratedNumberVerifyDocsverifyThird(this.verifyDos.verifyNumberDocsThird);
        }
        if (!this.verifyDos.verifyNumberDocsThird) {
          if (this.customerCodeHs) {
            this.checkEditable();
          } else {
            this.sendApiCreateCoowner();
          }
        }
      }
    });
  }
  /*
  * search Thông tin số GTXM
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

  createRequest(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    // tslint:disable-next-line:max-line-length
    // gán thông tin customer
    const persons = {
      id: '',
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
      fatcaCode: (this.fatcaObject ? this.fatcaObject.fatcaCode : ''),
      fatcaForm: (this.fatcaObject ? this.fatcaObject.fatcaForm : ''),
      fatcaAnswer: (this.fatcaObject ? this.fatcaObject.fatcaAnswer : '')
    };

    const coowner = {
      jointStartDate: this.fromDate.getValue(),
      jointEndDate: this.toDate.getValue(),
      customerCode: this.customerCode,
    };

    this.requestBody = {
      processId: this.processId,
      accountId: this.accountId,
      jointStartDate: this.fromDate.getValue(),
      jointEndDate: this.toDate.getValue(),
      customerCode: this.customerCode,
      branchCode: this.branchCode,
      customerTypeCode: 'INDIV',
      customerCategoryCode: 'INDIV',
      person: persons,
      // tslint:disable-next-line:object-literal-shorthand
      coowner: coowner,
      udf: this.udfObject,
      mis: this.misObject,
      signatures: this.listSignature ? this.listSignature : null
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
    if (this.fromDate.errorMsg !== '') {
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
    if (this.toDate.errorMsg !== '') {
      return;
    }
  }
  /**
   *  nhận thông tin tìm kiếm
   */
  getlistCustomer(event): void {
    this.isOnlyView = false;
    if (event.misObject) {
      this.misObject = event.misObject;
    }
    if (event.udfObject) {
      this.udfObject = event.udfObject;
    }
    if (event.objCustomer) {
      this.objCustomerInfo = event.objCustomer;
    }
    if (event.customerCode !== null && event.customerCode !== '') {
      this.customerCode = event.customerCode;
      this.isOnlyView = true;
    }
    if (event.signatures) {
      this.listSignature = event.signatures;
    }
    this.fillDataCustomerAddress(this.objCustomerInfo);
    this.fillDataPerDocsList(this.objCustomerInfo);
    this.resetMsgAttribute();
  }

  /**
   *  điền thông tin giấy tờ xác minh
   */
  fillDataPerDocsList(customerInfo): void {
    this.perDocsList = customerInfo.perDocNoList;
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
  backPage(): void {
    this._LOCATION.back();
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
    this.fatcaObject = this.fatca.getFATCAform();
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
