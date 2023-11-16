import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { addressDefaultVietNam } from '../../../../shared/constants/cif/cif-constants';
import { LpbDatePickerComponent } from '../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import { LpbSingleAddressComponent } from '../../../../shared/components/lpb-single-address/lpb-single-address.component';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { PREFIX_MOBILE_NUMBER } from '../../../../shared/constants/constants';
import { NotificationService } from '../../../../_toast/notification_service';
import { Location } from '@angular/common';
import { MissionService } from '../../../../services/mission.service';
import { PermissionConst } from 'src/app/_utils/PermissionConst';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { docStatus } from 'src/app/shared/models/documents';
declare var $: any;

@Component({
  selector: 'app-account-authority-update',
  templateUrl: './account-authority-update.component.html',
  styleUrls: ['./account-authority-update.component.scss']
})
export class AccountAuthorityUpdateComponent implements OnInit, AfterViewInit {
  readonly prefixIssuePlace = {
    DLQG: 'CCS ĐKQL CT và DLQG về DC',
    CSTTXH: 'CCS QLHC về TTXH',
    CA: 'CÔNG AN ',
    CXNC: 'Cục Quản lý XNC'
  };
  readonly prefixGenderCode = {
    MALE: 'M',
    FEMALE: 'F',
    OTHERS: 'O'
  };
  readonly prefixPerDocsCode = {
    HC: 'HO CHIEU',
    CMND: 'CHUNG MINH NHAN DAN',
    CCCD: 'CAN CUOC CONG DAN'
  };
  readonly perDocsType = [
    { code: '', name: 'Chọn loại GTXM' },
    { code: 'CAN CUOC CONG DAN', name: 'Căn cước công dân' },
    { code: 'CHUNG MINH NHAN DAN', name: 'Chứng minh nhân dân' },
    { code: 'HO CHIEU', name: 'Hộ chiếu' }
  ];
  readonly prefixTypeSearch = {
    GTXM: 'GTXM',
    CIF: 'CIF',
    PHONE: 'PHONE'
  };
  defaultLegalNational = addressDefaultVietNam;
  @ViewChild('dpDateOfBirth', { static: false }) dpDateOfBirth: LpbDatePickerComponent; // Ngày sinh
  @ViewChild('dpIssueDate', { static: false }) dpIssueDate: LpbDatePickerComponent; // Ngày cấp GTXM
  @ViewChild('dpFromDateVisaFree', { static: false }) dpFromDateVisaFree: LpbDatePickerComponent; // Miễn thị từ ngày
  @ViewChild('dpToDateVisaFree', { static: false }) dpToDateVisaFree: LpbDatePickerComponent; // Miễn thị từ ngày
  @ViewChild('dpFromDateAuthority', { static: false }) dpFromDateAuthority: LpbDatePickerComponent; // Miễn thị từ ngày
  @ViewChild('dpToDateAuthority', { static: false }) dpToDateAuthority: LpbDatePickerComponent; // Miễn thị từ ngày
  @ViewChild('address', { static: false }) address: LpbSingleAddressComponent; // khối địa chỉ
  customerInfo: any;
  accountInfo: any;
  authorityInfo: any;
  processId = '';
  accountId = '';
  authorityId = '';
  accountType = '';
  accountNumber = '';
  formUpdateAuthority: FormGroup;
  lstCountry = [];
  maxDateOfBirth = moment().subtract(120, 'years'); // Người ủy quyền không được quá 120 tuổi.
  minDateOfBirth = moment().subtract(15, 'years'); // Người ủy quyền phải lớn hơn 15 tuổi.
  lstAuthorType = [];
  authorTypes = [];
  lstAuthorExpire = [];
  lstIndustry = [];
  expireAuthorCode = '';
  authorTypeFreeText = '';
  limitAmount = '';
  errAuthorType = '';
  userInfo: any;
  objCurrentAddress = null;
  // Show hide control
  isDisableAuthorType = false;
  isShowFreeText = false;
  isDisableInputAmount = false;
  isShowToDateAuthority = false;
  isShowPopupApprove = false;
  noteApprove = '';
  isFillDataFromSearch = false;
  roleLogin: any = [];
  isSendApprove = false;
  isSave = false;
  isCheckGenderOther = false;
  createdBy: any;
  branchCode: any;
  statusCode: any;
  customerCode: any;
  statusCif: any;
  processIntegrated: any;

  constructor(
    private route: ActivatedRoute,
    private helpService: HelpsService,
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private _LOCATION: Location,
    private missionService: MissionService,
    private authenticationService: AuthenticationService
  ) {
    this.initFormAuthority();
  }

  ngOnInit(): void {
    $('.childName').html('Cập nhật ủy quyền');
    this.getAccountDetail();
    this.getAuthorType();
    this.getAuthorExpire();
    this.mobilePhoneChanged();
    // this.getAuthorityDetail();
    this.getCountry();
    this.perDocTypeCodeChanged();
    this.visaExemptionChanged();
    // this.getIndustry();
  }

  initFormAuthority(): void {
    this.formUpdateAuthority = this.fb.group({
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required],
      residence: [false], // Người cư trú
      email: ['', Validators.email],
      industry: [''], // Nghề nghiệp
      position: [''], // Chức vụ
      genderCode: [this.prefixGenderCode.MALE], // Giới tính
      perDocTypeCode: ['', Validators.required],
      perDocNo: ['', Validators.required],
      issueDate: ['', Validators.required],
      issuePlace: ['', Validators.required],
      mobilePhone: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]], // Số ĐTDĐ
      visaExemption: [true],  // Miễn thị thực nhập cảnh
      visaIssueDate: [''], // Miễn thị thực từ ngày
      visaExpireDate: [''],  // Miễn thị thực đến ngày
      nationalityCode: this.fb.array([], this.isNationalityDup())
    });
    // this.initFormArrayNationalityCode();
  }

  get nationalityCode(): FormArray { return this.formUpdateAuthority.get('nationalityCode') as FormArray; }
  get fullName(): FormControl { return this.formUpdateAuthority.get('fullName') as FormControl; }
  get mobilePhone(): FormControl { return this.formUpdateAuthority.get('mobilePhone') as FormControl; }
  get email(): FormControl { return this.formUpdateAuthority.get('email') as FormControl; }
  get industry(): FormControl { return this.formUpdateAuthority.get('industry') as FormControl; }
  get position(): FormControl { return this.formUpdateAuthority.get('position') as FormControl; }
  get birthDate(): FormControl { return this.formUpdateAuthority.get('birthDate') as FormControl; }
  get perDocTypeCode(): FormControl { return this.formUpdateAuthority.get('perDocTypeCode') as FormControl; }
  get perDocNo(): FormControl { return this.formUpdateAuthority.get('perDocNo') as FormControl; }
  get issueDate(): FormControl { return this.formUpdateAuthority.get('issueDate') as FormControl; }
  get issuePlace(): FormControl { return this.formUpdateAuthority.get('issuePlace') as FormControl; }
  get genderCode(): FormControl { return this.formUpdateAuthority.get('genderCode') as FormControl; }
  get residence(): FormControl { return this.formUpdateAuthority.get('residence') as FormControl; }
  get visaExemption(): FormControl { return this.formUpdateAuthority.get('visaExemption') as FormControl; }
  get visaIssueDate(): FormControl { return this.formUpdateAuthority.get('visaIssueDate') as FormControl; }
  get visaExpireDate(): FormControl { return this.formUpdateAuthority.get('visaExpireDate') as FormControl; }

  ngAfterViewInit(): void {
    this.initAddress();
    this.getAuthorityDetail();
  }

  getRole(): void {
    this.isSave = this.authenticationService.isPermission(PermissionConst.TK_UY_QUYEN.UPDATE);
    this.isSendApprove = this.authenticationService.isPermission(PermissionConst.HO_SO_GIAO_DICH.SEND_APPROVE_CREATE_AUTHOR);
  }

  getProcessDetail(): void {
    this.processId = this.route.snapshot.paramMap.get('processId');
    this.missionService.setProcessId(this.processId);
    if (this.processId === '') {
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
            this.customerInfo = res.item.customer;
            this.statusCode = res.item.statusCode;
            this.createdBy = res.item.createdBy;
            this.customerCode = res.item.customerCode;
            this.statusCif = res.item.customer.statusCif;
            this.getRole();
            this.actionButton();
          }
        }
      }
    );
  }

  getAccountDetail(): void {
    this.accountId = this.route.snapshot.paramMap.get('accountId');
    if (this.accountId !== '') {
      const body = { id: this.accountId };
      this.helpService.callApi(
        {
          method: HTTPMethod.POST,
          url: '/account/account/detail',
          data: body,
          progress: false,
          success: (res) => {
            if (res && res.responseStatus.success) {
              this.accountInfo = res.item;
              this.branchCode = res.item.branchCode;
              this.getProcessDetail();
            }
          }
        }
      );
    }
  }

  getCountry(): void {
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/country/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.lstCountry = res.items.filter(item => item.statusCode === 'A');
          }
        }
      }
    );
  }
  actionButton(): void {
    if (this.statusCif !== 'Y' && this.statusCif !== 'C') {
      this.checkHiddenButton();
      this.checkProfilePending();
    } else {
      this.disableBtn();
    }
  }

  checkHiddenButton(): void {
    // tạo mới duyệt thành công hiện tại
    // tslint:disable-next-line:max-line-length
    if (this.processIntegrated && this.statusCode && this.statusCode === docStatus.APPROVED && this.processIntegrated.statusCode === docStatus.SUCCESS) {
      this.disableBtn();
    }
  }
  checkProfilePending(): void {
    // nếu là  hồ sơ pending (đã lưu, chờ duyệt , chờ bổ sung,  khởi tạo)
    // tslint:disable-next-line:max-line-length
    if (this.statusCode && (this.statusCode === docStatus.EDIT
      || this.statusCode === docStatus.WAIT
      || this.statusCode === docStatus.TEMP
      || this.statusCode === docStatus.MODIFY) && this.createdBy !== this.userInfo.userId) {
      // nếu là khác người tạo thì ẩn hết các nút  duyệt, xóa , cập nhập thông tin
    } else {
      //  trong hồ sơ  không pending check 2 trường hợp
      // 1. nếu là đã duyệt và từ chối thì ẩn hết button
      // 2. nếu ko phải thì check tới chi nhánh của dịch vụ
      if (this.statusCode && (this.statusCode === docStatus.APPROVED
        || this.statusCode === docStatus.SUCCESS
        || this.statusCode === docStatus.REJECT)) {
        this.disableBtn();
      } else {
        // nếu như không phải pendding thì check chi nhánh của dịch vụ
        // nếu khác chi nhanh => show cập nhập thông tin, không gửi duyệt, ko xóa
        if (this.branchCode !== this.userInfo.branchCode) {
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
  /*
  *Lấy chi tiết ủy quyền
  */
  getAuthorityDetail(): void {
    this.authorityId = this.route.snapshot.paramMap.get('id');
    if (this.authorityId === '') {
      return;
    }
    const body = { id: this.authorityId };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/account/accountAuthor/detail',
        data: body,
        progress: false,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.authorityInfo = res.item;
            this.processIntegrated = res.item.processIntegrated;
            this.getAuthorType();
            this.getRole();
            this.actionButton();
            this.fillDataToFormCustomer();
          }
        }
      }
    );
  }
  disableButton(): void {
    this.isSendApprove = false;
    this.isSave = false;
  }
  /*
  Lấy danh sách phạm vi ủy quyền
  * */
  getAuthorType(): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.GET,
        url: '/account/authorType/listAll',
        progress: false,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.lstAuthorType = [];
            res.items.filter(item => {
              if (item.statusCode === 'A') {
                item.selected = false;
                this.lstAuthorType.push(item);
              }
            });

            this.lstAuthorType.map(a => {
              this.authorTypes.map(b => {
                if (b.authorTypeCode === a.code) {
                  a.selected = true;
                }
              });
            });
          }
        }
      }
    );
  }

  /*
  Lấy danh sách thời gian ủy quyền*/
  getAuthorExpire(): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.GET,
        url: '/account/authorExpire/listAll',
        progress: false,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.lstAuthorExpire = res.items.filter(item => item.statusCode === 'A');
          }
        }
      }
    );
  }

  initAddress(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setTimeout(() => {
      this.objCurrentAddress = {
        currentCountryCode: this.defaultLegalNational.code,
        currentCountryName: this.defaultLegalNational.name,
        currentCityName: this.userInfo ? this.userInfo.cityName : '',
      };
    }, 5);
  }

  isNationalityDup(): any {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value);
      let count = 0;
      count = totalSelected.filter((ele, indx) => totalSelected[indx] && indx !== totalSelected.indexOf(ele)).length;
      return (count > 0) ? { duplicate: true } : null;
    };
    return validator;
  }

  initFormArrayNationalityCode(): void {
    this.nationalityCode.reset();
    this.nationalityCode.push(
      new FormControl(addressDefaultVietNam.code, Validators.required)
    );
  }

  nationalityChange(evt: any, index: number): void {
    this.validatorVerifyDocsByNational();
  }

  mobilePhoneChanged(): void {
    this.mobilePhone.valueChanges.pipe(
      debounceTime(50)
    ).subscribe(value => {
      if (this.mobilePhone.invalid) {
        return;
      } else {
        const prefixMobile = this.mobilePhone.value.toString().substring(0, 3);
        if (!PREFIX_MOBILE_NUMBER.includes(prefixMobile)) {
          this.mobilePhone.setErrors({ prefixMobileNotExist: true });
        } else {
          this.mobilePhone.setErrors(null);
        }
      }
    });
  }

  perDocTypeCodeChanged(): void {
    this.perDocTypeCode.valueChanges.subscribe(value => {
      this.issuePlace.setValue('');
      this.validatorPerDocNo();
      this.setDataIssuePlace();
      if (!this.isFillDataFromSearch && value === this.prefixPerDocsCode.CCCD &&
        this.dpIssueDate.haveValue() && this.dpIssueDate.errorMsg === '') {
        this.validatorIssueDate();
      }
    });
  }

  visaExemptionChanged(): void {
    this.visaExemption.valueChanges.subscribe(value => {
      if (value) {
        this.dpFromDateVisaFree.setValue('');
        this.dpToDateVisaFree.setValue('');
        this.dpFromDateVisaFree.setErrorMsg('');
        this.dpToDateVisaFree.setErrorMsg('');
        this.visaIssueDate.setValue('');
        this.visaExpireDate.setValue('');
      }
    });
  }

  validatorVerifyDocsByNational(): any {
    const national1 = this.nationalityCode.getRawValue()[0];
    const perdocType = this.perDocTypeCode.value;
    if (perdocType === '') {
      this.perDocTypeCode.setErrors({ required: true });
    } else if (this.nationalityCode.controls[0].valid
      && perdocType !== ''
      && national1 !== addressDefaultVietNam.code
      && perdocType !== this.prefixPerDocsCode.HC) {
      this.perDocTypeCode.setErrors({ errPerDocType: true });
    } else {
      this.perDocTypeCode.setErrors(null);
    }
  }

  addFieldNationality(): void {
    if (this.nationalityCode.length === 4) {
      return;
    }
    this.nationalityCode.push(
      new FormControl(null, Validators.required)
    );
  }

  removeFieldNationality(index: number): void {
    this.nationalityCode.removeAt(index);
  }

  validatorPerDocNo(): void {
    if (this.perDocTypeCode.invalid || this.perDocNo.value.trim().toString() === '') {
      return;
    } else {
      const pattern = /^[0-9]*$/;
      const valuePerDocsCode = this.perDocTypeCode.value.trim().toString();
      const valuePerDocsNo = this.perDocNo.value.trim().toString();
      if (valuePerDocsCode !== this.prefixPerDocsCode.HC) {
        if (!pattern.test(valuePerDocsNo)) {
          this.perDocNo.setErrors({ errOnlyNumber: true });
          return;
        }
        if (valuePerDocsCode === this.prefixPerDocsCode.CMND) {
          if (valuePerDocsNo.length !== 9 && valuePerDocsNo.length !== 12) {
            this.perDocNo.setErrors({ errLengthCMND: true });
            return;
          }
        }
        if (valuePerDocsCode === this.prefixPerDocsCode.CCCD) {
          if (valuePerDocsNo.length !== 12) {
            this.perDocNo.setErrors({ errLengthCCCD: true });
            return;
          }
        }
        this.perDocNo.setErrors(null);
      } else {
        this.perDocNo.setErrors(null);
      }
    }
  }

  setDataIssuePlace(): void {
    if (this.isFillDataFromSearch) {
      return;
    }
    if (this.perDocTypeCode.invalid) {
      this.issuePlace.setValue('');
      return;
    }
    const perDocType = this.perDocTypeCode.value.trim().toString();
    const issueDate = this.dpIssueDate.getValue();
    if (perDocType === this.prefixPerDocsCode.CCCD) {
      this.issuePlace.disable();
      if ((this.dpIssueDate.haveValue() && this.dpIssueDate.haveValidDate())) {
        if (this.compareDate(issueDate, moment('01/01/2016', 'DD/MM/YYYY')) >= 0
          && this.compareDate(moment('10/10/2018', 'DD/MM/YYYY'), issueDate) > 0) {
          this.issuePlace.setValue(this.prefixIssuePlace.DLQG);
        }
        if (this.compareDate(moment('10/10/2018', 'DD/MM/YYYY'), issueDate) <= 0) {
          this.issuePlace.setValue(this.prefixIssuePlace.CSTTXH);
        }
      }
    } else {
      this.issuePlace.enable();
      if (perDocType === this.prefixPerDocsCode.CMND) {
        if (this.issuePlace.value === '') {
          this.issuePlace.setValue(this.prefixIssuePlace.CA + (this.userInfo.cityName ? this.userInfo.cityName : ''));
        }
      } else {
        if (this.issuePlace.value === '') {
          this.issuePlace.setValue(this.prefixIssuePlace.CXNC);
        }
      }
    }
  }

  fillDataToFormCustomer(): void {
    if (!this.authorityInfo) { return; }
    this.isFillDataFromSearch = true;
    this.isCheckGenderOther = (this.authorityInfo.genderCode === 'O' ? true : false);
    this.fullName.setValue(this.authorityInfo.fullName ? this.authorityInfo.fullName : '');
    this.genderCode.setValue(this.authorityInfo.genderCode === 'M' ? this.prefixGenderCode.MALE :
      (this.authorityInfo.genderCode === 'F' ? this.prefixGenderCode.FEMALE : this.prefixGenderCode.OTHERS));
    this.dpDateOfBirth.setValue(this.authorityInfo.birthDate ? this.authorityInfo.birthDate : '');
    this.mobilePhone.setValue(this.authorityInfo.mobilePhone ? this.authorityInfo.mobilePhone : '');
    this.email.setValue(this.authorityInfo.email ? this.authorityInfo.email : '');
    this.residence.setValue(this.authorityInfo.residence ? this.authorityInfo.residence : false);
    this.perDocTypeCode.setValue(this.authorityInfo.perDocTypeCode ? this.authorityInfo.perDocTypeCode : '');
    this.perDocNo.setValue(this.authorityInfo.perDocNo ? this.authorityInfo.perDocNo : '');
    this.issuePlace.setValue(this.authorityInfo.issuePlace ? this.authorityInfo.issuePlace : '');
    this.dpIssueDate.setValue(this.authorityInfo.issueDate ? this.authorityInfo.issueDate : '');
    this.issueDate.setValue(this.authorityInfo.issueDate ? this.authorityInfo.issueDate : '');
    this.industry.setValue(this.authorityInfo.industry ? this.authorityInfo.industry : null);
    this.position.setValue(this.authorityInfo.position ? this.authorityInfo.position : '');
    // Set giá trị Quốc tịch
    const arrNational = [];
    if (this.authorityInfo.nationality1Code) {
      arrNational.push(this.authorityInfo.nationality1Code);
    } else {
      this.authorityInfo.nationality1Code = 'VN';
      arrNational.push(this.authorityInfo.nationality1Code);
    }
    if (this.authorityInfo.nationality2Code) {
      arrNational.push(this.authorityInfo.nationality2Code);
    }
    if (this.authorityInfo.nationality3Code) {
      arrNational.push(this.authorityInfo.nationality3Code);
    }
    if (this.authorityInfo.nationality4Code) {
      arrNational.push(this.authorityInfo.nationality4Code);
    }
    // Fill thông tin địa chỉ
    this.address.currentCountryChanged({ code: this.authorityInfo.currentCountryCode ? this.authorityInfo.currentCountryCode : 'VN' });
    this.objCurrentAddress = {
      currentCountryCode: this.authorityInfo.currentCountryCode ? this.authorityInfo.currentCountryCode : 'VN',
      currentCityName: this.authorityInfo.currentCityName ? this.authorityInfo.currentCityName : '',
      currentDistrictName: this.authorityInfo.currentDistrictName ? this.authorityInfo.currentDistrictName : '',
      currentWardName: this.authorityInfo.currentWardName ? this.authorityInfo.currentWardName : '',
      currentStreetNumber: this.authorityInfo.currentStreetNumber ? this.authorityInfo.currentStreetNumber : ''
    };
    arrNational.forEach(el => {
      this.nationalityCode.push(
        new FormControl(el, Validators.required)
      );
    });
    if (this.authorityInfo.nationality1Code === 'VN') {
      this.visaExemption.setValue(true);
    } else {
      this.visaExemption.setValue(false);
    }
    this.dpToDateVisaFree.setValue(this.authorityInfo.visaIssueDate);

    this.dpFromDateVisaFree.setValue(this.authorityInfo.visaExpireDate ? this.authorityInfo.visaExpireDate : '');

    // Gán giá trị nội dung ủy quyền
    this.authorTypes = this.authorityInfo.authorTypes ? this.authorityInfo.authorTypes : [];
    this.isShowFreeText = true;
    this.checkActiveFreeText();
    this.authorTypes.forEach(el => {
      if (el.authorTypeCode === 'ALL' || el.authorTypeCode === 'DEPOSIT_AND_WITHDRAW') {
        this.limitAmount = el.limitAmount;
      }
      if (el.authorTypeCode === 'OTHER') {
        this.authorTypeFreeText = el.authorTypeFreeText;
      }
    });
    this.expireAuthorCode = this.authorityInfo.expireAuthorCode ? this.authorityInfo.expireAuthorCode : '';
    this.isShowToDateAuthority = this.expireAuthorCode === 'VALID_TIME_RANGE';
    this.dpFromDateAuthority.setValue(this.authorityInfo.validFrom ? this.authorityInfo.validFrom : '');
    this.dpToDateAuthority.setValue(this.authorityInfo.validTo ? this.authorityInfo.validTo : '');
    // Gán lại giá trị check search
    this.isFillDataFromSearch = false;
  }

  authorTypeChecked(code: string): boolean {
    return this.authorTypes.some(item => item.authorTypeCode === code);
  }
  /*
  Thay đổi lựa chọn Phạm vi ủy quyền*/
  authorTypeChanged(evt: any, authorType: any): void {
    if (evt.target.checked) {
      this.authorTypes.push({
        authorTypeCode: authorType.code,
        authorTypeName: authorType.name,
        authorTypeFreeText: '',
        limitAmount: ''
      });
      this.lstAuthorType.map(e => {
        if (e.code === authorType.code) {
          e.selected = true;
        }
      });
      if (authorType.code === 'ALL') {
        this.lstAuthorType.map(e => {
          if (e.code !== 'ALL') {
            e.selected = false;
          }
        });
        this.authorTypes = this.authorTypes.filter(e => e.authorTypeCode === 'ALL');
      }
    } else {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.authorTypes.length; i++) {
        const el = this.authorTypes[i];
        if (el.authorTypeCode === authorType.code) {
          this.authorTypes.splice(i, 1);
        }
      }
    }
    this.validatorAuthorType();
    this.checkActiveFreeText();
  }

  validatorAuthorType(): void {
    if (this.authorTypes.length === 0) {
      this.errAuthorType = 'Phạm vi ủy quyền bắt buộc chọn';
    } else {
      this.errAuthorType = '';
    }
  }

  checkActiveFreeText(): void {
    this.isShowFreeText = this.authorTypes.some(item => item.authorTypeCode === 'OTHER');

    this.isDisableAuthorType = this.authorTypes.some(item => item.authorTypeCode === 'ALL');

    this.isDisableInputAmount = !this.authorTypes.some(item => (item.authorTypeCode === 'ALL' || item.authorTypeCode === 'DEPOSIT_AND_WITHDRAW'));
  }

  /*
  Thay đổi lựa chọn thời gian ủy quyền*/
  authorExpireChanged(): void {
    this.isShowToDateAuthority = this.expireAuthorCode === 'VALID_TIME_RANGE';
    if (this.isShowToDateAuthority) {
      this.dpToDateAuthority.setValue('');
      this.dpToDateAuthority.setErrorMsg('');
    }
  }

  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.formUpdateAuthority.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  hasErrorFormArray(formArrayName: string, index: any, errorName: string): boolean {
    const control = (this.formUpdateAuthority.get(formArrayName) as FormArray).controls[index];
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  actionCreate(): void {
    const body = this.getDataFormAuthority();
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/account/accountAuthor/update',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.apiAutoCreate();
            this.notificationService.showSuccess('Cập nhật Ủy quyền thành công', 'Thành công');
            // tslint:disable-next-line:max-line-length
            this.router.navigate(['./smart-form/manager/detailAuthority', { processId: this.processId, accountId: this.accountId, id: this.authorityId }]);
          } else {
            this.notificationService.showError('Cập nhật Ủy quyền thất bại', 'Thất bại');
          }
        }
      }
    );
  }
  /* Send data to server
* */
  submitAuthority(type: string): void {

    this.formUpdateAuthority.markAllAsTouched();
    this.validatorPerDocNo();
    this.validatorVerifyDocsByNational();
    this.validatorDateOfBirth();
    this.validatorIssueDate();
    this.validatorVisaIssueDate();
    this.validatorVisaExpireDate();
    this.validatorVisaDate();
    this.validatorAuthorType();
    this.validatorFromDateAuthority();
    this.validatorToDateAuthority();
    const addressResult = this.address.getDataFormAddress();
    if (!this.formUpdateAuthority.valid || this.dpDateOfBirth.errorMsg !== '' ||
      this.dpIssueDate.errorMsg !== '' || this.dpFromDateVisaFree.errorMsg !== '' ||
      this.dpToDateVisaFree.errorMsg !== '' || this.errAuthorType !== '' ||
      this.dpFromDateAuthority.errorMsg !== '' || this.dpToDateAuthority.errorMsg !== '' || !addressResult) {
      this.notificationService.showError('Dữ liệu không hợp lệ', 'Cảnh báo');
      return;
    }
    if (type === 'SAVE') {
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
                  // nếu là đúng
                  this.actionCreate();
                } else {
                  this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
                }
              }
            }
          }
        );
      } else {
        this.actionCreate();
      }
    } else {
      this.isShowPopupApprove = true;
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

  getDataFormAuthority(): any {
    this.authorTypes.forEach(el => {
      switch (el.authorTypeCode) {
        case 'ALL':
          el.limitAmount = this.limitAmount;
          el.authorTypeFreeText = el.authorTypeName;
          break;
        case 'DEPOSIT_AND_WITHDRAW':
          el.limitAmount = this.limitAmount;
          el.authorTypeFreeText = el.authorTypeName;
          break;
        case 'DEPOSIT':
          el.limitAmount = 0;
          el.authorTypeFreeText = el.authorTypeName;
          break;
        case 'OTHER':
          el.authorTypeFreeText = this.authorTypeFreeText;
          el.limitAmount = 0;
          break;
      }
    });
    const addressResult = this.address.getDataFormAddress();
    return {
      id: this.authorityId,
      accountId: this.accountId,
      authorTypes: this.authorTypes,
      birthDate: this.dpDateOfBirth.getValue(),
      currentCityName: (!this.address.isCurrentCountryForeign ? addressResult.currentProvinceName : addressResult.currentProvince),
      currentCountryCode: (!this.address.isCurrentCountryForeign ? addressResult.currentCountryCode : addressResult.currentCountry),
      currentDistrictName: (!this.address.isCurrentCountryForeign ? addressResult.currentDistrictName : addressResult.currentDistrict),
      currentStreetNumber: addressResult.currentAddress,
      currentWardName: (!this.address.isCurrentCountryForeign ? addressResult.currentWardName : addressResult.currentWardForeign),
      customerCode: this.authorityInfo.customerCode ? this.authorityInfo.customerCode : null,
      email: this.email.value,
      expireAuthorCode: this.expireAuthorCode,
      foreignAddress: null,
      fullName: this.fullName.value,
      genderCode: this.genderCode.value,
      industry: this.industry.value,
      issueDate: this.dpIssueDate.getValue(),
      issuePlace: this.issuePlace.value,
      mobilePhone: this.mobilePhone.value,
      nationality1Code: this.nationalityCode.getRawValue()[0],
      nationality2Code: this.nationalityCode.getRawValue()[1] ? this.nationalityCode.getRawValue()[1] : null,
      nationality3Code: this.nationalityCode.getRawValue()[2] ? this.nationalityCode.getRawValue()[2] : null,
      nationality4Code: this.nationalityCode.getRawValue()[3] ? this.nationalityCode.getRawValue()[3] : null,
      perDocNo: this.perDocNo.value,
      perDocTypeCode: this.perDocTypeCode.value,
      position: this.position.value,
      residence: this.residence.value,
      validFrom: this.dpFromDateAuthority.getValue(),
      validTo: this.isShowToDateAuthority ? this.dpToDateAuthority.getValue() : null,
      // tslint:disable-next-line: max-line-length
      visaExemption: this.nationalityCode.getRawValue()[0] === 'VN' ? null : (this.visaExemption.value ? true : (this.visaIssueDate.value || this.visaExpireDate.value ? false : null)),
      visaIssueDate: this.visaIssueDate.value,
      visaExpireDate: this.visaExpireDate.value
    };
  }

  actionApprove(): void {
    const body = this.getDataFormAuthority();
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/account/accountAuthor/update',
        data: body,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.apiAutoCreate();
            const bodySendApprove = {
              note: this.noteApprove,
              typeCode: 'PDG',
              userId: this.userInfo.userId,
              id: (res.item && res.item.id) ? res.item.id : ''
            };
            this.helpService.callApi(
              {
                method: HTTPMethod.POST,
                url: '/process/process/sendApproveCreateAuthor',
                data: bodySendApprove,
                progress: true,
                success: (resApprove) => {
                  if (resApprove && resApprove.responseStatus.success) {
                    this.isShowPopupApprove = false;
                    this.notificationService.showSuccess('Gửi duyệt cập nhật Ủy quyền thành công', 'Thành công');
                    // tslint:disable-next-line:max-line-length
                    this.router.navigate(['./smart-form/manager/detailAuthority', { processId: this.processId, accountId: this.accountId, id: this.authorityId }]);
                  } else {
                    this.notificationService.showError('Gửi duyệt cập nhật Ủy quyền thất bại', 'Thất bại');
                  }
                }
              }
            );
          } else {
            this.notificationService.showError('Tạo Ủy quyền thất bại', 'Thất bại');
          }
        }
      }
    );
  }
  submitApprove(): void {
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
                // nếu là đúng
                this.actionApprove();
              } else {
                this.notificationService.showError('hồ sơ đang bị khóa bởi ' + res.item.user.userName, 'Thất bại');
              }
            }
          }
        }
      );
    } else {
      this.actionApprove();
    }
  }

  /*Xử lý component calendar
  * */

  /*
  Validate thông tin ngày sinh */
  blurDateOfBirth(evt): void {
    if (!this.dpDateOfBirth.haveValue()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được để trống');
    }
  }

  dateOfBirthChanged(): void {
    this.validatorDateOfBirth();
  }

  validatorDateOfBirth(): void {
    this.dpDateOfBirth.setErrorMsg('');
    this.birthDate.setValue('');
    if (!this.dpDateOfBirth.haveValue()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được để trống');
      return;
    }
    if (this.dpDateOfBirth.haveValue() && !this.dpDateOfBirth.haveValidDate()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không đúng định dạng');
      return;
    }
    // tslint:disable-next-line:prefer-const
    let tmpDate = moment(this.dpDateOfBirth.getSelectedDate(), 'DD/MM/YYYY');
    if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được chọn ngày tương lai');
      return;
    }
    if (this.compareDate(this.maxDateOfBirth, tmpDate) === 1) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được quá 120 tuổi');
      return;
    }
    if (this.compareDate(tmpDate, this.minDateOfBirth) === 1) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh phải lớn hơn 15 tuổi');
      return;
    }
    this.birthDate.setValue(this.dpDateOfBirth.getValue());
  }

  /*
Validate thông tin ngày cấp GTXM */
  blurIssueDate(): void {
    if (!this.dpIssueDate.haveValue()) {
      this.dpIssueDate.setErrorMsg('Ngày cấp không được để trống');
    }
  }

  issueDateChanged(): void {
    this.validatorIssueDate();
  }

  validatorIssueDate(): void {
    this.dpIssueDate.setErrorMsg('');
    this.issueDate.setValue('');
    if (!this.dpIssueDate.haveValue()) {
      this.dpIssueDate.setErrorMsg('Ngày cấp không được để trống');
      return;
    }
    if (this.dpIssueDate.haveValue() && !this.dpIssueDate.haveValidDate()) {
      this.dpIssueDate.setErrorMsg('Ngày cấp không đúng định dạng');
      return;
    }
    const tmpDate = moment(this.dpIssueDate.getSelectedDate(), 'DD/MM/YYYY');
    if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
      this.dpIssueDate.setErrorMsg('Ngày cấp không được chọn ngày tương lai');
      return;
    }
    if (this.perDocTypeCode.value === this.prefixPerDocsCode.CCCD && this.compareDate(tmpDate, moment('01/01/2016', 'DD/MM/YYYY')) < 0) {
      this.dpIssueDate.setErrorMsg('Ngày cấp CCCD không được trước ngày 01/01/2016');
      return;
    }
    // tslint:disable-next-line:max-line-length
    const tempDateCompare = this.compareDate(this.dpDateOfBirth.getSelectedDate(), this.dpIssueDate.getSelectedDate());
    if (tempDateCompare === 1) {
      this.dpIssueDate.setErrorMsg('Ngày sinh không được lớn hơn ngày cấp');
      return;
    }
    this.issueDate.setValue(this.dpIssueDate.getValue());
    this.setDataIssuePlace();
  }

  /*
Validate thông tin từ ngày miễn thị thực nhập cảnh
* */
  validatorVisaIssueDate(): void {
    this.dpFromDateVisaFree.setErrorMsg('');
    if (this.dpFromDateVisaFree.haveValue() && !this.dpFromDateVisaFree.haveValidDate()) {
      this.dpFromDateVisaFree.setErrorMsg('Từ ngày sai định dạng');
      return;
    }
    this.validatorVisaDate();
    if (this.dpFromDateVisaFree.errorMsg === '') {
      this.visaIssueDate.setValue(this.dpFromDateVisaFree.getValue());
    }
  }

  visaIssueDateChanged(): void {
    this.validatorVisaIssueDate();
  }
  /*
  Validate thông tin đến ngày miễn thị thực nhập cảnh
  * */
  validatorVisaExpireDate(): void {
    this.dpToDateVisaFree.setErrorMsg('');
    if (this.dpToDateVisaFree.haveValue() && !this.dpToDateVisaFree.haveValidDate()) {
      this.dpToDateVisaFree.setErrorMsg('Từ ngày sai định dạng');
      return;
    }
    this.validatorVisaDate();
    if (this.dpToDateVisaFree.errorMsg === '') {
      this.visaExpireDate.setValue(this.dpToDateVisaFree.getValue());
    }
  }

  visaExpireDateChanged(): void {
    this.validatorVisaExpireDate();
  }

  validatorVisaDate(): void {
    if (!this.visaExemption.value) {
      if (this.dpFromDateVisaFree.haveValue() && this.dpFromDateVisaFree.errorMsg === ''
        && this.dpToDateVisaFree.haveValue() && this.dpToDateVisaFree.errorMsg === '') {
        const f = moment(this.dpFromDateVisaFree.getSelectedDate(), 'DD/MM/YYYY');
        const t = moment(this.dpToDateVisaFree.getSelectedDate(), 'DD/MM/YYYY');
        if (this.compareDate(f, t) > 0) {
          this.dpFromDateVisaFree.setErrorMsg('Từ ngày phải nhỏ hơn hoặc bằng Đến ngày');
          this.dpToDateVisaFree.setErrorMsg('Đến ngày phải lớn hơn hoặc bằng từ ngày');
        }
      }
    }
  }

  /*
Validate thông tin từ ngày Ủy quyền */
  blurFromDateAuthority(): void {
    if (!this.dpFromDateAuthority.haveValue()) {
      this.dpFromDateAuthority.setErrorMsg('Từ ngày không được để trống');
    }
  }

  validatorFromDateAuthority(): void {
    this.dpFromDateAuthority.setErrorMsg('');
    if (!this.dpFromDateAuthority.haveValue()) {
      this.dpFromDateAuthority.setErrorMsg('Từ ngày không được để trống');
    }
    if (this.dpFromDateAuthority.haveValue() && !this.dpFromDateAuthority.haveValidDate()) {
      this.dpFromDateAuthority.setErrorMsg('Từ ngày sai định dạng');
      return;
    }
  }

  fromDateAuthorityChanged(): void {
    this.validatorFromDateAuthority();
  }

  /* Validate thông tin đến ngày Ủy quyền
  *  */
  blurToDateAuthority(): void {
    if (this.isShowToDateAuthority && !this.dpToDateAuthority.haveValue()) {
      this.dpToDateAuthority.setErrorMsg('Đến ngày không được để trống');
    }
  }

  validatorToDateAuthority(): void {
    this.dpToDateAuthority.setErrorMsg('');
    if (this.isShowToDateAuthority && !this.dpToDateAuthority.haveValue()) {
      this.dpToDateAuthority.setErrorMsg('Đến ngày không được để trống');
    }
    if (this.isShowToDateAuthority && this.dpToDateAuthority.haveValue() && !this.dpToDateAuthority.haveValidDate()) {
      this.dpToDateAuthority.setErrorMsg('Đến ngày sai định dạng');
      return;
    }
  }

  toDateAuthorityChanged(): void {
    this.validatorToDateAuthority();
  }

  // tslint:disable-next-line:variable-name
  compareDate(f_date: any, t_date: any): any {
    const from = moment(f_date, 'DD/MM/YYYY').toDate().getTime();
    const to = moment(t_date, 'DD/MM/YYYY').toDate().getTime();
    if (from > to) { return 1; }
    else if (from < to) { return -1; }
    else { return 0; }
  }

  backPage(): void {
    this._LOCATION.back();
  }
}
