import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LpbAddressComponent } from 'src/app/shared/components/lpb-address/lpb-address.component';
import { RcCustomerInfoComponent } from './shared/components/rc-customer-info/rc-customer-info.component';
import { RcFatcaComponent } from './shared/components/rc-fatca/rc-fatca.component';
import { RcGuardianComponent } from './shared/components/rc-guardian/rc-guardian.component';
import { RcVerifyDocsComponent } from './shared/components/rc-verify-docs/rc-verify-docs.component';
import { NotificationService } from '../../_toast/notification_service';
import { RcMisComponent } from './shared/components/rc-mis/rc-mis.component';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
// tslint:disable-next-line:quotemark
import { addressDefaultVietNam } from "../../shared/constants/cif/cif-constants";
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { PermissionConst } from '../../_utils/PermissionConst';
declare var $: any;

@Component({
  selector: 'app-register-cif',
  templateUrl: './register-cif.component.html',
  styleUrls: ['./register-cif.component.scss']
})
export class RegisterCifComponent implements OnInit, OnDestroy {

  @ViewChild('verifyDos', { static: false }) verifyDos: RcVerifyDocsComponent;
  @ViewChild('customerInfo', { static: false }) customerInfo: RcCustomerInfoComponent;
  @ViewChild('fatca', { static: false }) fatca: RcFatcaComponent;
  @ViewChild('address', { static: false }) address: LpbAddressComponent; // Tỉnh - Thành phố hiện tại (nội địa)
  @ViewChild('guardian', { static: false }) guardian: RcGuardianComponent; // Khối đại diện pháp luật
  @ViewChild('mis', { static: false }) mis: RcMisComponent; // Khối đại diện pháp luật

  isCheckValidGTXM = false;
  requestBody; // request api
  isHaveData = false;
  dateOfBirth: any;
  nationlityFirst = addressDefaultVietNam;
  mobileNo: any;
  // biến popup
  isReference = false;
  isLegal = false;
  isMis = false;
  isUdf = false;
  age = 0;
  isGuardian = false;
  isOwnerBenefit = false;
  referenceCifs = [];
  guardianList = [];
  countBlockGuardian = 0;
  countBlockReferenceCif = 0;
  isCheckError = false;
  dataAddress: any = {};
  countBlockOwnerOfBenefit = 0;
  countBlockLegal = 0;
  // user info
  userInfo: any;
  currentAddressObject = {};
  residentAddressObject = {};
  // các object trả về từ component con
  perDocsList = [];
  coOwnerList = [];
  CoOwnerListNoId = [];
  legalList = [];
  customerInfoObject: any;
  udfObject: any;
  misObject: any;
  addressObject: any;
  fatcaObject: any;
  isShowPopupApprove = false;
  idCustomer = ''; // id của customer
  note = ''; // trường ghi chú
  readonly confim = { // phân biệt hủy hay đống ý confim chờ duyệt
    CANCEL: 'CANCEL',
    CONFIM: 'CONFIM',
  };
  readonly btnPrimary = {
    SAVE: 'SAVE',
    SEND_APPROVE: 'SEND_APPROVE' // button phân biệt trường hợp  lưu hay  chờ duyệt
  };
  tempBtnPrimary = '';
  // err Mis Udf
  errMsgMis = '';
  errMsgUdf = '';
  errMsgGuardian = '';
  isShowLoadingCallApi = false;
  subLoadingCallApi: Subscription;
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  roleLogin: any;
  isGDV = false;
  isKSV = false;
  isApproveButton = false;
  isSaveButton = false;
  isDisableBtnWhenClick = false;

  constructor(
    private notificationService: NotificationService,
    private helpService: HelpsService,
    private router: Router,
    private _LOCATION: Location,
    private ckr: ChangeDetectorRef,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    $('.childName').html('Tạo mới khách hàng');
    this.getDataLocal();
    this.fillDataAddress();
    this.subLoadingCallApi = this.helpService.progressEvent.subscribe((isShowProgress) => {
      this.isShowLoadingCallApi = isShowProgress;
      this.ckr.detectChanges();
    });
  }
  // hàm xử lý phần quyền
  getRole(): void {
    this.isSaveButton = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.OPEN_CIF);
    // tslint:disable-next-line:align
    this.isApproveButton = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_ONE);
  }

  getDataLocal(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getRole();
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

  dateOfBirthValueChange(evt): void {
    this.dateOfBirth = evt;
  }

  showMis(): void {
    this.isMis = true;
  }

  closeMis(evt): void {
    this.isMis = evt;
  }

  showUdf(): void {
    this.isUdf = true;
  }

  closeUdf(): void {
    this.isUdf = false;
  }

  showReferenceCif(): void {
    this.isReference = true;
  }

  showOwnerBenefit(): void {
    this.isOwnerBenefit = true;
  }

  showLegalCif(): void {
    this.isLegal = true;
  }

  showGuardianCif(): void {
    this.isGuardian = true;
  }

  closeGuardianCif(evt): void {
    this.isGuardian = evt;
  }

  getGuardian(evt): void {
    this.isGuardian = evt.isGuardian;
    this.guardianList = evt.guardians;
    this.countBlockGuardian = this.guardianList.length;
    const guardianList = {
      guardianList: this.guardianList
    };
    if (this.countBlockGuardian > 0) {
      this.errMsgGuardian = '';
    }
    // // object test data ouput
    // console.log(JSON.stringify(guardianList));
  }

  closeModalLegal(evt): void {
    this.isLegal = evt;
  }

  closeOwnerBenefit(evt): void {
    this.isOwnerBenefit = evt;
  }

  closeReferenceCif(evt): void {
    this.isReference = false;
  }

  getReferenceCif(evt): void {
    this.isReference = evt.isReference;
    this.referenceCifs = evt.referenceCifs;
    this.countBlockReferenceCif = this.referenceCifs.length;
    const referenceCifs = {
      cifLienQuan: this.referenceCifs
    };
  }

  create(): void {
  }

  emitCoOwner(evt): void {
    this.coOwnerList = evt;
    this.countBlockOwnerOfBenefit = this.coOwnerList.length;
  }

  emitCoOwnerNoId(evt): void {
    this.CoOwnerListNoId = evt;
  }

  nationiltyFisrtValueChange(evt): void {
    this.nationlityFirst = evt;
  }

  mobileNoValueChange(evt): void {
    this.mobileNo = evt;
  }

  getObjUdf(evt): void {
    this.udfObject = evt;
    this.closeUdf();
    this.validateUdf();
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

  validateGuardian(): void {
    this.errMsgGuardian = '';
    this.age = moment().diff(moment(this.customerInfo.dpDateOfBirth.getValue(), 'DD/MM/YYYY'), 'years');
    if (this.guardianList && this.guardianList.length === 0 && this.age < 15) {
      this.errMsgGuardian = 'Vui lòng nhập thông tin người giám hộ';
      return;
    }
  }

  getObjMis(evt): void {
    this.misObject = evt;
    this.closeMis(false);
    this.ValidateMis();
  }

  emitLegal(evt): void {
    this.legalList = evt;
    // console.log('Khối thỏa thuận pháp lý', this.legalList);
    this.countBlockLegal = this.legalList.length;
    // console.log(this.legalList);
  }

  approveProcess(param): void {
    this.isDisableBtnWhenClick = true;
    setTimeout(() => { this.isDisableBtnWhenClick = false; }, 3000);
    // call api
    this.tempBtnPrimary = param;
    switch (this.tempBtnPrimary) {
      case this.btnPrimary.SAVE:
        this.integratedApiOpenCiF();
        break;
      case this.btnPrimary.SEND_APPROVE:
        if (this.validateBockCif() !== null) {
          this.isShowPopupApprove = true;
        } else {
          this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
          this.isShowPopupApprove = false;
        }
        break;
      default:
        break;
    }
  }

  apiAutoCreate(processId): void {
    const body = {
      processId
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/attachment/attachment/autoCreate',
        data: body,
        progress: true,
        success: (res) => {
          if (!(res && res.responseStatus.success)) {
            this.notificationService.showError('Cập nhật CIF thất bại', 'Thất bại');
          }
        }
      }
    );
  }

  /**
   *  api xử lý tạo mới cif
   */
  sendApiOpenCiF(): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/openCIF',
        data: this.requestBody,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.apiAutoCreate(res.item.id);
            switch (this.tempBtnPrimary) {
              case this.btnPrimary.SAVE:
                this.notificationService.showSuccess('Tạo mới CIF thành công', 'Thành công');
                this.router.navigate(['./smart-form/manager/fileProcessed', res.item.customer.processId]);
                break;
              case this.btnPrimary.SEND_APPROVE:
                // sau khi  click button chờ duyệt
                this.sendApiApproveOne(res.item.customer.id, res.item.customer.processId);
                break;
              default:
                break;
            }
          } else {
            this.notificationService.showError('Tạo mới CIF thất bại', 'Thất bại');
          }
        }
      }
    );
  }

  /**
   *  api xử lý chờ duyệt
   */
  sendApiApproveOne(idCustomer: any, processId: any): void {
    const body = {
      note: this.note,
      id: idCustomer,
      typeCode: 'OPEN_CIF'
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/sendApproveOne',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.notificationService.showSuccess('Gửi duyệt dịch vụ thành công', 'Thành công');
            this.router.navigate(['./smart-form/manager/fileProcessed', processId]);
          } else {
            this.notificationService.showError('Gửi duyệt dịch vụ thất bại', 'Thất bại');
          }
          this.isShowPopupApprove = false;
        }
      }
    );
  }

  /* search Thông tin số GTXM
  *
  */
  searchNumberVerifyDocs(numberVerifyDoc, callback?: any): void {
    const body = {
      perDocNo: numberVerifyDoc
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/personIdent/getApproved',
        data: body,
        // tslint:disable-next-line:object-literal-shorthand
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            if (callback) {
              const arrayInfor = [];
              if (res.item) {
                arrayInfor.push(res.item);
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
  integratedNumberVerifyDocsverifyThird(numberDocs): void {
    this.searchNumberVerifyDocs(numberDocs, data => {
      this.isHaveData = false;
      this.perDocsList.forEach(el => {
        if (numberDocs === el.perDocNo) {
          this.isHaveData = true;
        }
      });
      if (data.length > 0 && this.isHaveData) {
        this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
        return null;
      } else {
        this.createRequest();
        if (!this.requestBody) {
          this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
          return;
        }
        this.sendApiOpenCiF();
      }
    });
  }

  createRequest(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
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
      // tslint:disable-next-line: max-line-length
      visaExemption: !this.customerInfo.isShowOptionVisaFree ? null : (this.customerInfo.isVisaFree ? true : (this.customerInfo.dpFromDateVisaFree.getValue() !== '' || this.customerInfo.dpToDateVisaFree.getValue() !== '' ? false : null)),
      // visaExemption: this.customerInfo.isShowOptionVisaFree ? this.customerInfo.isVisaFree : null,
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
      fatcaCode: (this.fatcaObject ? this.fatcaObject.fatcaType : ''),
      fatcaForm: (this.fatcaObject ? this.fatcaObject.fatcaForm : ''),
      fatcaAnswer: (this.fatcaObject ? this.fatcaObject.fatcaCode : '')
    };
    const objCustomer = {
      person: persons,
      udf: this.udfObject,
      mis: this.misObject,
      cifLienQuan: this.referenceCifs,
      guardianList: this.guardianList,
      legalList: this.legalList,
      customerOwnerBenefit: this.coOwnerList,
      branchCode: userInfo.branchCode
    };
    // object  request to Api regiter
    this.requestBody = {
      customer: objCustomer,
      branchCode: userInfo.branchCode
    };
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
      if (data.length > 0 && this.isHaveData) {
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
          this.sendApiOpenCiF();
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
      if (data.length > 0 && this.isHaveData) {
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
          this.sendApiOpenCiF();
        }
      }
    });
  }

  validateBockCif(): any {
    this.getFATCAform();
    this.getDataFormAddress();
    this.getCustomerInfor();
    this.getPerDocsList();
    this.ValidateMis();
    this.validateUdf();
    this.validateGuardian();
    // tslint:disable-next-line:max-line-length
    if ((this.fatcaObject.checkedFatca && this.fatcaObject.fatcaType == null) || (!this.fatcaObject.checkedFatca && this.nationlityFirst.code === 'US') ||
      !this.dataAddress ||
      !this.isCheckValidGTXM ||
      !this.customerInfoObject ||
      this.errMsgMis !== '' ||
      this.errMsgUdf !== '' ||
      this.errMsgGuardian !== '') {
      return null;
    }
  }

  /**
   * thiết lập data request to api
   */
  integratedApiOpenCiF(): any {
    // tslint:disable-next-line:max-line-length
    if (this.validateBockCif() !== null) {
      this.integratedNumberVerifyDocs(this.verifyDos.verifyNumberDocsFirst);
    } else {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
    }
  }

  /**
   * nhận data khối customer
   */
  getCustomerInfor(): any {
    this.customerInfoObject = this.customerInfo.getDataCifCustomerForm();
    return this.customerInfoObject;
  }

  /**
   * nhận data khối giấy tờ xác minh
   */
  getPerDocsList(): any {
    const objPerDocs: any = this.verifyDos.getPerDocsList();
    this.isCheckValidGTXM = objPerDocs.isResultValid;
    if (objPerDocs.isResultValid) {
      this.perDocsList = objPerDocs.result;
    }
  }

  /**
   * nhận data khối fatca
   */
  getFATCAform(): any {
    this.fatcaObject = this.fatca.getFATCAform();
  }

  /**
   * nhận data khối address
   */
  getDataFormAddress(): any {
    this.dataAddress = this.address.getDataFormAddress();
    return this.dataAddress;
  }

  /**
   * confim đồng ý hay hủy trên popup
   */
  confimApproveProcess(params): void {
    this.isDisableBtnWhenClick = true;
    setTimeout(() => { this.isDisableBtnWhenClick = false; }, 3000);
    switch (params) {
      case this.confim.CANCEL:
        this.isShowPopupApprove = false;
        break;
      case this.confim.CONFIM:
        if (this.isSaveButton) {
          this.integratedApiOpenCiF();
        } else {
          this.notificationService.showError('kiểm tra lại quyền thực hiện', 'Cảnh báo');
        }
        break;
      default:
        break;
    }
  }

  backPage(): void {
    this._LOCATION.back();
  }

  ngOnDestroy(): void {
    if (this.subLoadingCallApi) {
      this.subLoadingCallApi.unsubscribe();
    }
  }
}
