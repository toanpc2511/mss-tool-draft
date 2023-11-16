import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UcUdfComponent } from './shared/components/uc-udf/uc-udf.component';
import { UcVerifyDocsComponent } from './shared/components/uc-verify-docs/uc-verify-docs.component';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { UcFatcaComponent } from './shared/components/uc-fatca/uc-fatca.component';
import { UcCustomerInfoComponent } from './shared/components/uc-customer-info/uc-customer-info.component';
import { LpbAddressComponent } from 'src/app/shared/components/lpb-address/lpb-address.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/_toast/notification_service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { MissionService } from 'src/app/services/mission.service';
import { Location } from '@angular/common';
import { docStatus } from 'src/app/shared/models/documents';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
import { AuthenticationService } from 'src/app/_services/authentication.service';
declare var $: any;

@Component({
  selector: 'app-update-cif',
  templateUrl: './update-cif.component.html',
  styleUrls: ['./update-cif.component.scss']
})
export class UpdateCifComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('verifyDos', { static: false }) verifyDos: UcVerifyDocsComponent; // Tỉnh - Thành phố hiện tại (nội địa)
  @ViewChild('Udf', { static: false }) udf: UcUdfComponent;
  @ViewChild('fatca', { static: false }) fatca: UcFatcaComponent;
  @ViewChild('customerInfo', { static: false }) customerInfo: UcCustomerInfoComponent; // Thông tin khách hàng
  @ViewChild('address', { static: false }) address: LpbAddressComponent;
  processId: any;
  objCifDetail: any;   // Dữ liệu Cif detail
  perDocsList = [];
  isCheckValidGTXM = false;
  dateOfBirth: any;
  nationlity = 'VN';
  isMis = false;
  isUdf = false;
  // biến check quyền
  roleLogin: any = [];
  isReference = false;
  isLegal = false;
  isGuardian = false;
  isApprove = false;
  isSave = false;
  isUpdate = false;
  age = 0;
  requestBody; // request api
  readonly docStatus = docStatus;
  isOwnerBenefit = false;
  countBlockOwnerOfBenefit = 0;
  countBlockGuardian = 0;
  approveTypeCode;
  udfObject: any;
  fatcaObject: any;
  listLegal = [];
  objFatca: any;
  objCifUdf: any;
  objMisCif: any;
  guardianList = [];
  objCifCustomerInfo: any;
  objCifCustomerInfoCore: any;
  objCustomerMisCore: any;
  objCustomerUdfCore: any;
  lstPerDocsCore: any;
  fatcaObjectCore: any;
  lstGuardianCore = [];
  objAddress: any;
  currentAddressObject = {};
  residentAddressObject = {};
  coOwnerList = [];
  isShowPopupApprove = false;
  errMsgGuardian = '';
  userInfo: any;
  isExistCore = false;
  userCityName = '';
  statusCode = '';
  isHaveData = false;
  personId = '';
  cachePerDocsList = [];
  note = ''; // trường ghi chú
  referenceCifs = [];
  countBlockReferenceCif = 0;
  readonly confirm = { // phân biệt hủy hay đống ý confim chờ duyệt
    CANCEL: 'CANCEL',
    CONFIRM: 'CONFIRM',
  };
  customerId = '';
  readonly btnPrimary = {
    SAVE: 'SAVE',
    SEND_APPROVE: 'SEND_APPROVE' // button phân biệt trường hợp  lưu hay  chờ duyệt
  };
  tempBtnPrimary = '';
  subLoadingCallApi: Subscription;
  objErrorCore: any;
  isShowModalWarningData = false;
  customerCode: any; // mã cif hồ sơ

  constructor(
    private helpService: HelpsService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private missionService: MissionService,
    private _LOCATION: Location,
    private authenticationService: AuthenticationService
  ) {
  }
  ngAfterViewInit(): void {
  }

  // hàm xử lý phần quyền
  getRole(): void {
    this.isUpdate = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.DETAIL);
    this.isSave = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.OPEN_CIF);
    this.isApprove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_ONE);

  }

  ngOnInit(): void {
    $('.childName').html('Cập nhật thông tin khách hàng');
    this.route.paramMap.subscribe(params => {
      this.processId = params.get('processId');
      this.missionService.setProcessId(this.processId);
      this.getDetailFromData();
    });
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.userCityName = this.userInfo.cityName;
  }

  dateOfBirthValueChange(evt): void {
    this.dateOfBirth = evt;
  }

  nationlityValueChange(evt): void {
    this.nationlity = evt.code;
  }

  update(): void {
  }

  /*Lấy thông tin cif từ core*/
  getCustomerCore(cifNumber): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customerESB/getCustomerInfo',
        data: {cif: cifNumber},
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.objCifCustomerInfoCore = res.customer.person;
            this.lstPerDocsCore = res.customer.person.perDocNoList;
            this.objCustomerMisCore = res.customer.mis;
            this.objCustomerUdfCore = res.customer.udf;
            this.fatcaObjectCore = {
              fatcaCode: res.customer.person.fatcaCode,
              fatcaName: res.customer.person.fatcaName,
              fatcaAnswer: res.customer.person.fatcaAnswer,
              fatcaForm: res.customer.person.fatcaForm,
              fatcaFormName: res.customer.person.fatcaFormName
            };
          }
        }
      }
    );
  }

  getInfoCustomer(): void {
    this.objCifCustomerInfo = this.customerInfo.getDataCifCustomerForm();
  }

  getAddress(): void {
    this.objAddress = this.address.getDataFormAddress();
  }

  showMis(): void {
    this.isMis = true;
  }

  closeMis(): void {
    this.isMis = false;
  }

  showUdf(evt): void {
    this.isUdf = evt;
  }

  closeUdf(): void {
    this.isUdf = false;
  }

  showReferenceCif(): void {
    this.isReference = true;
  }

  closeReferenceCif(evt): void {
    this.isReference = false;
  }

  showLegal(): void {
    this.isLegal = true;
  }

  closeLegal(evt): void {
    this.isLegal = false;
  }

  collectListLegal(evt): void {
    this.listLegal = evt;
  }

  showCoOwnerBenefit(): void {
    this.isOwnerBenefit = true;
  }

  closeCoOwnerBenefit(evt): void {
    this.isOwnerBenefit = evt;
  }

  emitCoOwner(evt): void {
    this.coOwnerList = evt;
    this.countBlockOwnerOfBenefit = this.coOwnerList.length;
  }

  getUDF(evt): void {
    this.objCifUdf = evt;
    this.closeUdf();
  }

  getMIS(evt): void {
    this.objMisCif = evt;
    this.closeMis();
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
  }

  getReferenceCif(evt): void {
    this.isReference = evt.isReference;
    this.referenceCifs = evt.referenceCifs;
    this.countBlockReferenceCif = this.referenceCifs.length;
    const referenceCifs = {
      cifLienQuan: this.referenceCifs
    };
  }

  validateGuardian(): void {
    this.errMsgGuardian = '';
    this.age = moment().diff(moment(this.customerInfo.dpDateOfBirth.getValue(), 'DD/MM/YYYY'), 'years');
    if (this.guardianList && this.guardianList.length === 0 && this.age < 15) {
      this.errMsgGuardian = 'Vui lòng nhập thông tin người giám hộ';
      return;
    }
  }

  closeOwnerBenefit(evt): void {
    this.isOwnerBenefit = evt;
  }

  showGuardian(): void {
    this.isGuardian = true;
  }

  closeGuardian(evt): void {
    this.isGuardian = evt;
  }

  getFatca(): void {
    this.objFatca = this.fatca.getFATCAform();
    // console.log('Khối FATCA', this.objFatca);
  }

  getPerDocsList(): void {
    const objPerDocs: any = this.verifyDos.getPerDocsList();
    this.isCheckValidGTXM = objPerDocs.isResultValid;
    if (objPerDocs.isResultValid) {
      this.perDocsList = objPerDocs.result;
    }
  }

  getDetailFromData(): void {
    if (!this.processId) {
      return;
    }
    const body = {
      id: this.processId
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/detail',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.getRole();
            this.objCifDetail = res.item;
            this.statusCode = this.objCifDetail.statusCode;
            this.checkHiddenButton();
            this.customerId = this.objCifDetail.customer.id;
            this.fatcaObject = this.objCifDetail.customer.person.fatcaCode ? {
              fatcaCode: this.objCifDetail.customer.person.fatcaCode,
              fatcaAnswer: this.objCifDetail.customer.person.fatcaAnswer,
              fatcaForm: this.objCifDetail.customer.person.fatcaForm
            } : null;
            this.customerCode = res.item.customerCode;
            this.approveTypeCode = res.item.customer.actionCode === 'C' ? 'OPEN_CIF' : 'UPDATE_CIF';
            this.isExistCore = res.item.customerCode !== null ? false : true;
            this.objCifUdf = this.objCifDetail.customer.udf;
            this.objMisCif = this.objCifDetail.customer.mis;
            this.guardianList = this.objCifDetail.customer.guardianList;
            this.countBlockGuardian = this.guardianList.length; //  khởi tạo số khối đại diện pháp luật ban đầu
            this.referenceCifs = this.objCifDetail.customer.cifLienQuan;
            this.countBlockReferenceCif = this.referenceCifs.length; // khởi tạo số khối cif liên quan ban đầu
            this.listLegal = this.objCifDetail.customer.legalList;
            this.objCifCustomerInfo = this.objCifDetail.customer.person;
            this.personId = this.objCifDetail.customer.person.id;
            this.coOwnerList = this.objCifDetail.customer.customerOwnerBenefit;
            this.countBlockOwnerOfBenefit = this.coOwnerList.length;
            this.perDocsList = this.objCifDetail.customer.person.perDocNoList;
            this.cachePerDocsList = this.objCifDetail.customer.person.perDocNoList;
            this.currentAddressObject = {
              currentCountryCode: this.objCifDetail.customer.person.currentCountryCode,
              currentCountryName: this.objCifDetail.customer.person.currentCountryName,
              currentCityName: this.objCifDetail.customer.person.currentCityName,
              currentDistrictName: this.objCifDetail.customer.person.currentDistrictName,
              currentWardName: this.objCifDetail.customer.person.currentWardName,
              currentStreetNumber: this.objCifDetail.customer.person.currentStreetNumber
            };
            this.residentAddressObject = {
              residenceCountryCode: this.objCifDetail.customer.person.residenceCountryCode,
              residenceCountryName: this.objCifDetail.customer.person.residenceCountryName,
              residenceCityName: this.objCifDetail.customer.person.residenceCityName,
              residenceDistrictName: this.objCifDetail.customer.person.residenceDistrictName,
              residenceWardName: this.objCifDetail.customer.person.residenceWardName,
              residenceStreetNumber: this.objCifDetail.customer.person.residenceStreetNumber
            };

            // Hiển thị dữ liệu core
            if (this.objCifDetail && this.objCifDetail.customerCode) {
              this.getCustomerCore(this.objCifDetail.customerCode);
              const tmpLstGuardian = [...this.objCifDetail.customer.guardianList];
              if (tmpLstGuardian && tmpLstGuardian.length > 0) {
                tmpLstGuardian.forEach(el => {
                  if (el.inEffect !== null && el.inEffect !== undefined) {
                    this.lstGuardianCore.push(el);
                  }
                });
              }
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

  apiAutoCreate(): void {
    const body = {
      processId: this.processId,
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

  validateBockCif(): any {
    this.getAddress();
    this.getPerDocsList();
    this.getInfoCustomer();
    this.getFatca();
    this.validateGuardian();
    if (!this.objCifCustomerInfo || !this.objAddress || !this.objCifUdf || !this.objMisCif
      // tslint:disable-next-line: max-line-length
      || (this.objFatca.checkedFatca && this.objFatca.fatcaCode == null) ||
      (!this.objFatca.checkedFatca && this.objCifCustomerInfo.nationality1Code === 'US')
      || !this.isCheckValidGTXM || this.errMsgGuardian !== ''
    ) {
      return null;
    }
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
              // nếu là đúng
              this.sendApiUpdateCiF();
            } else {
              this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
            }
          }
        }
      }
    );
  }

  /*
   *kiểm tra Thông tin số GTXM bị trùng trước khi lưu
   */

  createRequest(): void {
    const person = Object.assign({ perDocNoList: this.perDocsList }, this.objCifCustomerInfo, this.objAddress, this.objFatca);
    this.requestBody = {
      id: this.objCifDetail.id,
      code: this.objCifDetail.code,
      customer: {
        id: this.objCifDetail.customer.id,
        processId: this.objCifDetail.id,
        person,
        mis: this.objMisCif,
        udf: this.objCifUdf,
        cifLienQuan: this.referenceCifs,
        guardianList: this.guardianList,
        legalList: this.listLegal,
        customerOwnerBenefit: this.coOwnerList,
        branchCode: this.objCifDetail.customer.branchCode,
        customerCode: this.objCifDetail.customer.customerCode,
        customerTypeCode: this.objCifDetail.customer.customerTypeCode,
        customerCategoryCode: this.objCifDetail.customer.customerCategoryCode,
        employeeId: this.objCifDetail.customer.employeeId,
        mnemonicName: this.objCifDetail.customer.mnemonicName
      }
    };
  }

  doSubmited(param): void {
    // call api
    this.tempBtnPrimary = param;
    if (this.validateBockCif() !== null) {
      switch (this.tempBtnPrimary) {
        case this.btnPrimary.SAVE:
          this.createRequest();
          if (this.customerCode) {
            this.checkEditable();
          } else {
            this.sendApiUpdateCiF();
          }
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

  sendApiUpdateCiF(): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/process/update',
        data: this.requestBody,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success && Object.keys(res.item).length !== 0) {
            this.apiAutoCreate();
            switch (this.tempBtnPrimary) {
              case this.btnPrimary.SAVE:
                this.notificationService.showSuccess('Cập nhật CIF thành công', 'Thành công');
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
            const lstTemp = [];
            if (res && res.responseStatus.codes.length > 0) {
              res.responseStatus.codes.forEach(el => {
                if (el.code === '305') {
                  lstTemp.push(el);
                }
              });
            }
            if (lstTemp.length > 0) {
              this.objErrorCore = lstTemp.reduce(
                // tslint:disable-next-line:only-arrow-functions
                function(r, a): any {
                  r[a.objTypeCode] = r[a.objTypeCode] || [];
                  r[a.objTypeCode].push(a);
                  return r;
                }, Object.create(null)
              );
            }
            this.isShowModalWarningData = !!this.objErrorCore;
            this.notificationService.showError('Cập nhật CIF thất bại', 'Thất bại');
          }
        }
      }
    );
  }

  backPage(): void {
    this._LOCATION.back();
  }

  sendApiApproveOne(idCustomer: any, processId: any): void {
    const body = {
      note: this.note,
      id: idCustomer,
      typeCode: this.approveTypeCode
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

  confimApproveProcess(params): void {
    switch (params) {
      case this.confirm.CANCEL:
        this.isShowPopupApprove = false;
        break;
      case this.confirm.CONFIRM:
        if (this.isSave) {
          // kiểm tra hồ sơ ấy có phải là người tạo hay ko
          this.createRequest();
          if (this.customerCode) {
            this.checkEditable();
          } else {
            this.sendApiUpdateCiF();
          }
        } else {
          this.notificationService.showError('kiểm tra lại quyền thực hiện', 'Cảnh báo');
        }
        break;
      default:
        break;
    }
  }

  checkHiddenButton(): void {
    // cif bị đánh dấu và cif đã đóng
    if (this.objCifDetail.customer.statusCif !== 'C' && this.objCifDetail.customer.statusCif !== 'Y') {
            // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
      // tslint:disable-next-line:max-line-length
      if ((this.statusCode === docStatus.EDIT
        || this.statusCode === docStatus.WAIT
        || this.statusCode === docStatus.TEMP
        || this.statusCode === this.docStatus.MODIFY)
        && this.objCifDetail.createdBy !== this.userInfo.userId) {
        this.disableBtn();
      } else {
        // nếu là  hồ sơ không pending (từ chối , đã duyệt)
        if (this.statusCode === docStatus.APPROVED
          || this.statusCode === docStatus.SUCCESS
          || this.statusCode === docStatus.REJECT) {
          this.disableBtn();
        } else {
          // nếu là khác chi nhánh
          if (this.objCifDetail.customer.branchCode !== this.userInfo.branchCode) {
            this.showBtnSave();
          }
        }

      }
    } else {
      this.disableBtn();
    }

  }

  showBtnSave(): void {
    this.isApprove = false;
    this.isSave = this.isSave ? true : false;
  }

  ngOnDestroy(): void {
    if (this.subLoadingCallApi) {
      this.subLoadingCallApi.unsubscribe();
    }
  }
}
