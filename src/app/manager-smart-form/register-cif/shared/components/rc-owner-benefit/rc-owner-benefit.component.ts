import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LpbCustomAddressComponent } from 'src/app/shared/components/lpb-custom-address/lpb-custom-address.component';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { addressDefaultVietNam, cifGenderOption, cifProfessionOption } from 'src/app/shared/constants/cif/cif-constants';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { ONLY_NUMBER_REGEX, RG_EMAIL, RG_FULLNAME } from 'src/app/shared/constants/regex.utils';
import { compareDate } from 'src/app/shared/constants/utils';
import { HelpsService } from 'src/app/shared/services/helps.service';

@Component({
  selector: 'app-rc-owner-benefit',
  templateUrl: './rc-owner-benefit.component.html',
  styleUrls: ['./rc-owner-benefit.component.scss']
})
export class RcOwnerBenefitComponent implements OnInit, AfterViewInit {
  readonly action = {
    CREATE: 'CREATE',
    SAVE: 'SAVE',
    CANCEL: 'CANCEL',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    VIEW: 'VIEW'
  };
  actionName = '';
  isActiveSave = false;
  inforForm: FormGroup;
  submited = false;
  isShowModal = false;
  // Khối địa chỉ
  @ViewChild('address', { static: false }) address: LpbCustomAddressComponent;
  @ViewChild('dpDateOfBirth', { static: true }) dpDateOfBirth: LpbDatePickerComponent;  // Ngày sinh
  @ViewChild('dpIndentityDate', { static: false }) dpIndentityDate: LpbDatePickerComponent; // Miễn thị từ ngày
  @ViewChild('dpFromDateVisaFree', { static: false }) dpFromDateVisaFree: LpbDatePickerComponent; // Miễn thị từ ngày
  @ViewChild('dpToDateVisaFree', { static: false }) dpToDateVisaFree: LpbDatePickerComponent; // Miễn thị từ ngày
  @ViewChild('mobileNo', { static: false }) mobileNo: ElementRef; // Số điện thoại
  @Input() inpObjCurrentAddress: any;
  @Input() inpObjResidentAddress: any;
  @Output() arrayCoOwner = new EventEmitter();
  @Output() emitCoOwnerNoId = new EventEmitter();
  @Output() closeCoOwner = new EventEmitter();
  @Input() inpListOwner = [];
  objAddress = {};
  updateObj = {};
  objCurrentAddress: any;
  objResidentAddress: any;
  userInfo: any;
  // list danh sách
  lstGender = cifGenderOption;
  lstProfession = cifProfessionOption;
  lstCountry = [];
  // khối thông tin khách hàng
  age = 0; // tuổi của khách hàng
  selectedNationality1 = addressDefaultVietNam;  // Lựa chọn quốc tịch 1
  selectedNationality2;  // Lựa chọn quốc tịch 2
  selectedNationality3;  // Lựa chọn quốc tịch 3
  selectedNationality4;  // Lựa chọn quốc tịch 4
  lstSubNationality = [
    { nationalCode: 'n2', isShow: false },
    { nationalCode: 'n3', isShow: false },
    { nationalCode: 'n4', isShow: false }
  ];
  isVisaFree = true; // Miễn thị thực Có/không
  isShowOptionVisaFree = false;
  selectedProfession;
  lstOwner = [];
  // coObject =
  // thông báo lỗi
  errMsgNationality = '';
  errMsgProfession = '';
  errMsgMobileNo = '';
  tmpTime;
  isConfirm = false;
  readonly confim = {
    CANCEL: 'CANCEL',
    CONFIM: 'CONFIM',
  };
  objrc: any;

  constructor(
    private helpService: HelpsService,
    private fb: FormBuilder
  ) { }

  ngAfterViewInit(): void {
    this.getCountry();
  }

  ngOnInit(): void {
    this.initInfoForm();
    this.getLstOwner();
    this.getDefaultAddress();
  }

  // cofirm xóa hoặc không xóa tài liệu
  confimRemoveData(param: any): void {
    switch (param) {
      case this.confim.CANCEL:
        this.isConfirm = false;
        break;
      case this.confim.CONFIM:
        this.actionName = this.action.DELETE;
        this.lstOwner = this.lstOwner.filter(e => e !== this.objrc);
        this.arrayCoOwner.emit(this.lstOwner);
        // this.resetFormOwner();
        this.actionName = '';
        this.isConfirm = false;
        break;
      default:
        break;
    }
  }

  getDefaultAddress(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.objCurrentAddress =
    {
      currentCountryCode: this.selectedNationality1.code,
      currentCountryName: this.selectedNationality1.name,
      currentCityName: this.userInfo ? this.userInfo.cityName : '',
    };
    this.objResidentAddress =
    {
      residenceCountryCode: this.selectedNationality1.code,
      residenceCountryName: this.selectedNationality1.name,
      residenceCityName: this.userInfo ? this.userInfo.cityName : '',
    };
  }
  getCountry(callback?: any): void {
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/country/listAll',
        data: body,
        progress: false,
        success: (res) => {
          if (res) {
            this.lstCountry = res.items.filter(item => item.statusCode === 'A');
          }
        }
      }
    );
  }
  /**
   * đổ lại data vào sau khi ấn hoaòn thành lần 1
   */
  getLstOwner(): void {
    if (this.inpListOwner.length > 0) {
      this.lstOwner = this.inpListOwner;
    }
  }
  /**
   * mở form thêm mới
   */
  createCoOwner(): void {
    this.actionName = this.action.CREATE;
    this.resetFormOwner();
  }
  /**
   * đóng form
   */
  cancelCoOwner(): void {
    this.actionName = '';
    this.resetFormOwner();
  }
  /**
   * hiển thị chi tiết
   */
  viewCoOwner(evt): void {
    this.actionName = this.action.VIEW;
    this.fillDataToForm(evt);
  }
  /**
   * cập nhật
   */
  editCoOwner(evt): void {
    this.actionName = this.action.EDIT;
    this.fillDataToForm(evt);
    this.tmpTime = evt.tempId;
  }
  /**
   * Xóa data trong form
   */
  clearDataToForm(): void { }
  /**
   * trả data trong form về mảng
   */
  saveDataToForm(): void {
    if (this.actionName === this.action.CREATE) {
      this.pushObjectToArray();
      if (this.lstOwner.length > 0) {
        this.arrayCoOwner.emit(this.lstOwner);
      }
    } else if (this.actionName === this.action.EDIT) {
      this.editData(this.tmpTime);
      this.arrayCoOwner.emit(this.lstOwner);
    }

  }
  /**
   * đẩy object vào form
   */
  getDetailToForm(evt): void { }
  /**
   * Xoá một phần tử
   */
  removeCoOwner(evt): void {
    this.isConfirm = true;
    this.objrc = evt;
  }

  getAddressForm(): void {
    this.objAddress = this.address.getDataFormAddress();
  }

  initInfoForm(): void {
    this.inforForm = this.fb.group({
      name: ['', Validators.required], // Họ và tên
      gender: ['M'], // giới tính
      placeOfBirth: [null], // nơi sinh
      phoneNumber: [null], // điện thoại cố định
      phoneNumber2: [null, Validators.required], // điện thoại di động
      email: [null, Validators.pattern(RG_EMAIL)], // email
      identityNumber: [null, Validators.required], // số GTXM
      identityAddress: [null, Validators.required], // nơi cấp
      isResident: ['Y'], // tình trạng cư trú
      position: [null, Validators.required], // chức vụ
      isVisaFree: [true]
    });
  }
  /**
   * lấy ra value của el trong form
   */
  get getfullName(): AbstractControl { return this.inforForm.get('name'); }
  get getgender(): AbstractControl { return this.inforForm.get('gender'); }
  get getplaceOfBirth(): AbstractControl { return this.inforForm.get('placeOfBirth'); }
  get getphoneNumber(): AbstractControl { return this.inforForm.get('phoneNumber'); }
  get getphoneNumber2(): AbstractControl { return this.inforForm.get('phoneNumber2'); }
  get getEmail(): AbstractControl { return this.inforForm.get('email'); }
  get getidentityNumber(): AbstractControl { return this.inforForm.get('identityNumber'); }
  get getidentityAddress(): AbstractControl { return this.inforForm.get('identityAddress'); }
  get getisResident(): AbstractControl { return this.inforForm.get('isResident'); }
  get getposition(): AbstractControl { return this.inforForm.get('position'); }
  get getisVisaFree(): AbstractControl { return this.inforForm.get('isVisaFree'); }
  /**
   * Determines bắt lỗi Form control
   * @param controlName : Tên trường
   * @param errorName  : Tên lỗi
   * @returns true if error input
   */
  hasErrorInput(controlName: string, errorName: string): boolean {
    const control = this.inforForm.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }
  dateOfBirthChanged(): void {
    this.validateDateOfBirth();
    this.validateIndentityDate();
  }
  /**
   * hàm numberOnlys
   */
  phoneNumberInputChanged(evt): void {
    let content = (evt.target.value.length === 1) ? evt.target.value.trim() : evt.target.value;
    content = content.replace(ONLY_NUMBER_REGEX, '');
    this.getphoneNumber2.setValue(content);
  }
  validateNumber(): void {
    this.errMsgMobileNo = '';
    if (!this.mobileNo.nativeElement.value || this.mobileNo.nativeElement.value === '') {
      this.errMsgMobileNo = 'Điện thoại không được để trống';
      return;
    }
    if (this.mobileNo.nativeElement.value.length !== 10) {
      this.errMsgMobileNo = 'Số điện thoại phải đủ 10 ký tự';
      return;
    }
  }
  /**
   *
   * chặn dấu cấch
   */
  spaceInputChanged(evt, getControlName): void {
    const content = (evt.target.value.length === 1) ? evt.target.value.trim() : evt.target.value;
    // content = content.replace(RG_FULLNAME, '');
    getControlName.setValue(content);
  }
  /**
   * Bắt lỗi nhập ngày tháng năm sinh
   */
  validateDateOfBirth(): void {
    this.dpDateOfBirth.setErrorMsg('');
    const contentInputDateOfBirth = this.dpDateOfBirth.haveValue() ? this.dpDateOfBirth.getValue()
      : '';
    if (contentInputDateOfBirth === '') {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được để trống');
      return;
    }
    if (!this.dpDateOfBirth.haveValidDate()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh sai định dạng');
      return;
    }
    // tslint:disable-next-line:prefer-const
    let tmpDate = moment(this.dpDateOfBirth.getSelectedDate(), 'DD/MM/YYYY');
    if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được chọn ngày tương lai');
      return;
    }
    // if (tmpDate.toDate().getTime() < moment('01/01/1920').toDate().getTime()) {
    //   this.dpDateOfBirth.setErrorMsg('Ngày sinh không được xa hơn 01/01/1920');
    //   return;
    // }
    this.age = moment().diff(tmpDate, 'years');
    if (this.age > 120) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được quá 120 tuổi');
      return;
    } else if (this.age === 120) {
      if (tmpDate.month() < new Date().getMonth() || tmpDate.date() < new Date().getDate()) {
        this.dpDateOfBirth.setErrorMsg('Ngày sinh không được quá 120 tuổi');
        return;
      }
    }
    // this.dateOfBirthChange.emit(moment(this.dpDateOfBirth.getSelectedDate(), 'DD/MM/YYYY'));
    // this.validateProfession();
  }
  blurDateOfBirth(evt): void {
    if (!this.dpDateOfBirth.haveValue()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được để trống');
    }
  }
  /**
   * bắt lỗi ngày cấp
   */
  blurIndentityDate(evt): void {
    if (!this.dpIndentityDate.haveValue()) {
      this.dpIndentityDate.setErrorMsg('Ngày cấp không được để trống');
    }
  }
  indentityDateChanged(): void {
    this.validateIndentityDate();
  }
  validateIndentityDate(): void {
    this.dpIndentityDate.setErrorMsg('');
    const contentInputIndentityDate = this.dpIndentityDate.haveValue() ? this.dpIndentityDate.getValue()
      : '';
    if (contentInputIndentityDate === '') {
      this.dpIndentityDate.setErrorMsg('Ngày cấp không được để trống');
      return;
    }
    if (!this.dpIndentityDate.haveValidDate()) {
      this.dpIndentityDate.setErrorMsg('Ngày cấp sai định dạng');
      return;
    }
    if (this.dpDateOfBirth.haveValue() && this.dpIndentityDate.haveValue()) {
      if (compareDate(this.dpIndentityDate.getValue(), this.dpDateOfBirth.getValue()) === -1) {
        this.dpIndentityDate.setErrorMsg('Ngày cấp không được nhỏ hơn ngày sinh');
        return;
      }
    }
  }

  close(): void {
    if (this.actionName === '') {
      this.closeCoOwner.emit(false);
    } else {
      this.isShowModal = true;
    }
  }
  isTrueClose(): void {
    this.closeCoOwner.emit(false);
    this.isShowModal = false;
  }
  isFalseClose(): void {
    this.isShowModal = false;
  }
  /**
   * Nationalitys first second third fourth change
   */
  nationalityFirstChange(evt): void {
    this.selectedNationality1 = evt;
    this.checkShowVisaFree();
    this.validateNationality();
  }
  nationalitySecondChange(evt): void {
    this.selectedNationality2 = evt;
    this.validateNationality();
  }

  nationalityThirdChange(evt): void {
    this.selectedNationality3 = evt;
    this.validateNationality();
  }

  nationalityFourthChange(evt): void {
    this.selectedNationality4 = evt;
    this.validateNationality();
  }
  validateNationality(): void {
    const lstTempSelected = [];
    this.errMsgNationality = '';
    lstTempSelected.push(this.selectedNationality1.code);
    if (this.lstSubNationality[0].isShow && this.selectedNationality2) {
      lstTempSelected.push(this.selectedNationality2.code);
    }
    if (this.lstSubNationality[1].isShow && this.selectedNationality3) {
      lstTempSelected.push(this.selectedNationality3.code);
    }
    if (this.lstSubNationality[2].isShow && this.selectedNationality4) {
      lstTempSelected.push(this.selectedNationality4.code);
    }
    if (lstTempSelected.length > 0) {
      const findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index);
      if (findDuplicates(lstTempSelected).length > 0) {
        this.errMsgNationality = 'Quốc tịch không được trùng nhau';
      }
    }
  }
  /**
   * Thêmm bớt quốc tịch
   * @param type : hành động thêm
   * @param [pos] : code quốc
   */
  addOrRemoveNation(type: string, pos?: string): void {
    if (type === 'ADD') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.lstSubNationality.length; i++) {
        const el = this.lstSubNationality[i];
        if (!el.isShow) {
          el.isShow = true;
          break;
        }
      }
    }
    if (type === 'REMOVE' && pos !== '') {
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.lstSubNationality.length; i++) {
        const el = this.lstSubNationality[i];
        if (el.nationalCode === pos) {
          el.isShow = false;
        }
      }
    }
    this.validateNationality();
  }
  selectedChangeVisaFree(): void {
    this.isVisaFree = this.getisVisaFree.value;
    if (this.isVisaFree) {
      this.dpFromDateVisaFree.setValue('');
      this.dpFromDateVisaFree.setErrorMsg('');
      this.dpToDateVisaFree.setValue('');
      this.dpToDateVisaFree.setErrorMsg('');
    }
  }
  checkShowVisaFree(): void {
    if (this.selectedNationality1.code !== 'VN') {
      this.isShowOptionVisaFree = true;
    } else {
      this.isShowOptionVisaFree = false;
    }
  }
  /**
   * Bắt lỗi 'Từ ngày' miễn thị thực nhập cảnh
   */
  validateFromDateVisaFree(): void {
    if (!this.isVisaFree) {
      this.dpFromDateVisaFree.setErrorMsg('');
      this.dpToDateVisaFree.setErrorMsg('');
      if (this.dpFromDateVisaFree.haveValue() && !this.dpFromDateVisaFree.haveValidDate()) {
        this.dpFromDateVisaFree.setErrorMsg('Từ ngày sai định dạng');
        return;
      }
      // const tmpFromDateVisa = moment(contentInputDateOfBirth, 'DD/MM/YYYY');
      if (this.dpToDateVisaFree.haveValue() && this.dpToDateVisaFree.haveValidDate()) {
        if (compareDate(this.dpFromDateVisaFree.getSelectedDate(), this.dpToDateVisaFree.getSelectedDate()) === 1) {
          this.dpFromDateVisaFree.setErrorMsg('Từ ngày phải nhỏ hơn hoặc bằng Đến ngày');
        }
      }
    }
  }

  /**
   * Bắt lỗi 'Đến ngày' miễn thị thực nhập cảnh
   */
  validateToDateVisaFree(): void {
    if (!this.isVisaFree) {
      this.dpFromDateVisaFree.setErrorMsg('');
      this.dpToDateVisaFree.setErrorMsg('');
      if (this.dpToDateVisaFree.haveValue() && !this.dpToDateVisaFree.haveValidDate()) {
        this.dpToDateVisaFree.setErrorMsg('Đến ngày sai định dạng');
        return;
      }
      if (this.dpFromDateVisaFree.haveValue() && this.dpFromDateVisaFree.haveValidDate()) {
        if (compareDate(this.dpFromDateVisaFree.getSelectedDate(), this.dpToDateVisaFree.getSelectedDate()) === 1) {
          this.dpToDateVisaFree.setErrorMsg('Đến ngày phải lớn hơn hoặc bằng Từ ngày');
        }
      }
    }
  }
  professionChanged(evt): void {
    this.selectedProfession = evt;
  }
  validateProfession(): void {
    this.errMsgProfession = '';
    if (!this.selectedProfession) {
      this.errMsgProfession = 'Nghề nghiệp không được bỏ trống';
    }
  }
  /**
   * trả ra giá trị của form
   * @returns info form object
   */
  getValueInfo(): any {
    this.inforForm.markAllAsTouched();
    if (!this.inforForm.invalid) {
      return this.inforForm.value;
    }
  }
  /**
   * Selects and date of birth object
   * @returns object của các trường lpb-select và lpb-dropdown
   */
  getDataFromSelectorAndDate(): any {
    let lpbCpnObject;
    this.validateDateOfBirth();
    this.validateIndentityDate();
    this.validateNationality();
    this.validateProfession();
    this.selectedChangeVisaFree();
    this.validateToDateVisaFree();
    this.validateFromDateVisaFree();
    if (this.dpDateOfBirth.haveValidDate() && this.errMsgNationality === '' &&
      this.dpFromDateVisaFree.errorMsg === '' && this.dpToDateVisaFree.errorMsg === '' &&
      this.dpIndentityDate.haveValidDate() && this.errMsgProfession === '' && this.errMsgNationality === ''
    ) {
      lpbCpnObject = {
        dateOfBirth: this.dpDateOfBirth.getValue(),
        national: this.selectedNationality1 ? this.selectedNationality1 : '',
        national2: this.selectedNationality2 && this.lstSubNationality[0].isShow ? this.selectedNationality2 : '',
        national3: this.selectedNationality3 && this.lstSubNationality[1].isShow ? this.selectedNationality3 : '',
        national4: this.selectedNationality4 && this.lstSubNationality[2].isShow ? this.selectedNationality4 : '',
        identityDate: this.dpIndentityDate.haveValue() ? this.dpIndentityDate.getValue() : '',
        visaIssueDate: this.dpFromDateVisaFree.haveValue() ? this.dpFromDateVisaFree.getValue() : '',
        visaExpireDate: this.dpToDateVisaFree.haveValue() ? this.dpToDateVisaFree.getValue() : '',
        job: this.selectedProfession ? this.selectedProfession : ''
      };
    }

    return lpbCpnObject;
  }

  /**
   * khoi tao mot object
   */
  getCoOwner(): any {
    let dataObject;
    const infoFormValue = this.getValueInfo();
    const address = this.address.getDataFormAddress();
    const lpbCpnObject = this.getDataFromSelectorAndDate();
    if (infoFormValue && address && lpbCpnObject) {
      dataObject = Object.assign(infoFormValue, address, lpbCpnObject);
    }
    return dataObject;
  }
  /**
   * đẩy object vào bảng
   */
  pushObjectToArray(): void {
    if (this.dpDateOfBirth.errorMsg !== '') { return; }
    if (this.dpFromDateVisaFree.errorMsg !== '') { return; }
    if (this.dpToDateVisaFree.errorMsg !== '') { return; }
    this.validateNumber();
    const time = Date.now();
    const CoOwnerObject = this.getCoOwner();
    if (this.getCoOwner()) {
      const result = {// biến lưu lại thay đổi
        tempId: String(time),
        caddress: CoOwnerObject.currentAddress ? CoOwnerObject.currentAddress : '',
        caddressCity: CoOwnerObject.currentProvinceName ? CoOwnerObject.currentProvinceName :
          CoOwnerObject.currentProvince ? CoOwnerObject.currentProvince : '',
        caddressDistrict: CoOwnerObject.currentDistrictName ? CoOwnerObject.currentDistrictName :
          CoOwnerObject.currentDistrict ? CoOwnerObject.currentDistrict : '',
        caddressRegion: CoOwnerObject.currentCountryCode ? CoOwnerObject.currentCountryCode : '',
        caddressRegionName: CoOwnerObject.currentCountryName ? CoOwnerObject.currentCountryName : '',
        caddressWard: CoOwnerObject.currentWardName ? CoOwnerObject.currentWardName :
          CoOwnerObject.currentDistrict ? CoOwnerObject.currentDistrict : '',
        paddress: CoOwnerObject.residentAddress ? CoOwnerObject.residentAddress : '',
        paddressCity: CoOwnerObject.residentProvinceName ? CoOwnerObject.residentProvinceName :
          CoOwnerObject.residentProvince ? CoOwnerObject.residentProvince : '',
        paddressDistrict: CoOwnerObject.residentDistrictName ? CoOwnerObject.residentDistrictName :
          CoOwnerObject.residentDistrict ? CoOwnerObject.residentDistrict : '',
        paddressRegion: CoOwnerObject.residentCountryCode ? CoOwnerObject.residentCountryCode : '',
        paddressRegionName: CoOwnerObject.residentCountryName ? CoOwnerObject.residentCountryName : '',
        paddressWard: CoOwnerObject.residentWardName ? CoOwnerObject.residentWardName :
          CoOwnerObject.residentWard ? CoOwnerObject.residentWard : '',
        name: CoOwnerObject.name ? CoOwnerObject.name : '',
        dateOfBirth: CoOwnerObject.dateOfBirth ? CoOwnerObject.dateOfBirth : '',
        national: CoOwnerObject.national.code ? CoOwnerObject.national.code : '',
        national2: CoOwnerObject.national2.code ? CoOwnerObject.national2.code : null,
        national3: CoOwnerObject.national3.code ? CoOwnerObject.national3.code : null,
        national4: CoOwnerObject.national4.code ? CoOwnerObject.national4.code : null,
        nationalName: CoOwnerObject.national.name ? CoOwnerObject.national.name : '',
        nationalName2: CoOwnerObject.national2.name ? CoOwnerObject.national2.name : null,
        nationalName3: CoOwnerObject.national3.name ? CoOwnerObject.national3.name : null,
        nationalName4: CoOwnerObject.national4.name ? CoOwnerObject.national4.name : null,
        isResident: CoOwnerObject.isResident === 'Y' ? true : false,
        job: CoOwnerObject.job.code ? CoOwnerObject.job.code : '',
        // jobCode: CoOwnerObject.job.code ? CoOwnerObject.job.code : '',
        position: CoOwnerObject.position ? CoOwnerObject.position : '',
        identityNumber: CoOwnerObject.identityNumber ? CoOwnerObject.identityNumber : '',
        identityAddress: CoOwnerObject.identityAddress ? CoOwnerObject.identityAddress : '',
        identityDate: CoOwnerObject.identityDate ? CoOwnerObject.identityDate : '',
        phoneNumber: CoOwnerObject.phoneNumber ? CoOwnerObject.phoneNumber : '',
        phoneNumber2: CoOwnerObject.phoneNumber2 ? CoOwnerObject.phoneNumber2 : '',
        email: CoOwnerObject.email ? CoOwnerObject.email : '',
        // tslint:disable-next-line: max-line-length
        visaExemption: !this.isShowOptionVisaFree ? null : (CoOwnerObject.isVisaFree ? true : (CoOwnerObject.visaIssueDate || CoOwnerObject.visaExpireDate ? false : null)),
        visaIssueDate: CoOwnerObject.visaIssueDate ? CoOwnerObject.visaIssueDate : null,
        visaExpireDate: CoOwnerObject.visaExpireDate ? CoOwnerObject.visaExpireDate : null,
        // inEffect: CoOwnerObject.   ?  CoOwnerObject.   : '',
        genderCode: CoOwnerObject.gender ? CoOwnerObject.gender : '',
        placeOfBirth: CoOwnerObject.placeOfBirth ? CoOwnerObject.placeOfBirth : '',
      };
      this.lstOwner.push(result);
      this.resetFormOwner();
      this.actionName = '';
    } else {
      return;
    }
  }

  /**
   * Để form lại giá trị mặc định
   */
  resetFormOwner(): void {
    this.inforForm.reset();
    // set lại giá trị mặc định
    this.getgender.setValue('M');
    this.getisVisaFree.setValue(true);
    this.getisResident.setValue('Y');
    this.isShowOptionVisaFree = false;
    this.selectedNationality1 = addressDefaultVietNam;
    this.selectedNationality2 = null;
    this.selectedNationality3 = null;
    this.selectedNationality4 = null;
    this.selectedProfession = null;
    this.dpDateOfBirth.setValue(null);
    this.dpIndentityDate.setValue(null);
    this.dpFromDateVisaFree.setValue(null);
    this.dpToDateVisaFree.setValue(null);
    this.dpDateOfBirth.setErrorMsg('');
    this.dpIndentityDate.setErrorMsg('');
    this.dpFromDateVisaFree.setErrorMsg('');
    this.dpToDateVisaFree.setErrorMsg('');
    this.address.selectedCurrentCountry = '';
    this.address.selectedCurrentProvince = '';
    this.address.selectedCurrentDistrict = '';
    this.address.selectedCurrentWard = '';
    this.address.selectedResidentCountry = '';
    this.address.selectedResidentProvince = '';
    this.address.selectedResidentDistrict = '';
    this.address.selectedResidentWard = '';
    this.address.currentProvinceForeign.nativeElement.value = '';
    this.address.currentDistrictForeign.nativeElement.value = '';
    this.address.currentWardForeign.nativeElement.value = '';
    this.address.residentProvinceForeign.nativeElement.value = '';
    this.address.residentDistrictForeign.nativeElement.value = '';
    this.address.residentWardForeign.nativeElement.value = '';
    this.objCurrentAddress =
    {
      currentCountryCode: this.selectedNationality1.code,
      currentCountryName: this.selectedNationality1.name,
      currentCityName: this.userInfo ? this.userInfo.cityName : '',
    };
    this.objResidentAddress =
    {
      residenceCountryCode: this.selectedNationality1.code,
      residenceCountryName: this.selectedNationality1.name,
      residenceCityName: this.userInfo ? this.userInfo.cityName : '',
    };
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
    this.errMsgProfession = '';
    this.lstSubNationality[0].isShow = false;
    this.lstSubNationality[1].isShow = false;
    this.lstSubNationality[2].isShow = false;
  }
  /**
   * Views data
   */
  fillDataToForm(evt): void {
    // const evt = item.data;
    if (evt) {
      this.inforForm.patchValue(evt);
      this.getisVisaFree.setValue(evt.visaExemption);
      this.getisResident.setValue(evt.isResident ? 'Y' : 'N');
      this.dpDateOfBirth.setValue(evt.dateOfBirth ? evt.dateOfBirth : '');
      this.dpIndentityDate.setValue(evt.identityDate ? evt.identityDate : '');
      this.dpFromDateVisaFree.setValue(evt.visaIssueDate ? evt.visaIssueDate : '');
      this.dpToDateVisaFree.setValue(evt.visaExpireDate ? evt.visaExpireDate : '');
      this.selectedProfession = {
        code: evt.job
      };
      this.selectedNationality1 = {
        code: evt.national ? evt.national : evt.national,
        name: evt.nationalName ? evt.nationalName : evt.nationalName
      };
      this.lstSubNationality[0].isShow = evt.national2 ? true : false;
      this.selectedNationality2 = {
        code: evt.national2 ? evt.national2 : '',
        name: evt.nationalName2 ? evt.nationalName2 : ''
      };
      this.lstSubNationality[1].isShow = evt.national3 ? true : false;
      this.selectedNationality3 = {
        code: evt.national3 ? evt.national3 : '',
        name: evt.nationalName3 ? evt.nationalName3 : ''
      };
      this.lstSubNationality[2].isShow = evt.national4 ? true : false;
      this.selectedNationality4 = {
        code: evt.national4 ? evt.national4 : '',
        name: evt.nationalName4 ? evt.nationalName4 : ''
      };
      this.objCurrentAddress = {
        currentCountryCode: evt.caddressRegion ? evt.caddressRegion : '',
        currentCountryName: evt.caddressRegionName ? evt.caddressRegionName : '',
        currentCityName: evt.caddressCity ? evt.caddressCity : '',
        currentDistrictName: evt.caddressDistrict ? evt.caddressDistrict : '',
        currentWardName: evt.caddressWard ? evt.caddressWard : '',
        currentStreetNumber: evt.caddress ? evt.caddress : ''
      };
      this.objResidentAddress = {
        residenceCountryCode: evt.paddressRegion ? evt.paddressRegion : '',
        residenceCountryName: evt.paddressRegionName ? evt.paddressRegionName : '',
        residenceCityName: evt.paddressCity ? evt.paddressCity : '',
        residenceDistrictName: evt.paddressDistrict ? evt.paddressDistrict : '',
        residenceWardName: evt.paddressWard ? evt.paddressWard : '',
        residenceStreetNumber: evt.paddress ? evt.paddress : ''
      };
      this.checkShowVisaFree();
    }

  }
  /**
   * cập nhật bản ghi
   */
  editData(id: string): void {
    const CoOwnerObject = this.getCoOwner();
    this.lstOwner.forEach(el => {
      if (el.tempId === id) {
        if (CoOwnerObject) {
          el.caddress = CoOwnerObject.currentAddress ? CoOwnerObject.currentAddress : '',
            el.caddressCity = CoOwnerObject.currentProvinceName ? CoOwnerObject.currentProvinceName :
              CoOwnerObject.currentProvince ? CoOwnerObject.currentProvince : '',
            el.caddressDistrict = CoOwnerObject.currentDistrictName ? CoOwnerObject.currentDistrictName :
              CoOwnerObject.currentDistrict ? CoOwnerObject.currentDistrict : '',
            el.caddressRegion = CoOwnerObject.currentCountryCode ? CoOwnerObject.currentCountryCode : '',
            el.caddressRegionName = CoOwnerObject.currentCountryName ? CoOwnerObject.currentCountryName : '',
            el.caddressWard = CoOwnerObject.currentWardName ? CoOwnerObject.currentWardName :
              CoOwnerObject.currentDistrict ? CoOwnerObject.currentDistrict : '',
            el.paddress = CoOwnerObject.residentAddress ? CoOwnerObject.residentAddress : '',
            el.paddressCity = CoOwnerObject.residentProvinceName ? CoOwnerObject.residentProvinceName :
              CoOwnerObject.residentProvince ? CoOwnerObject.residentProvince : '',
            el.paddressDistrict = CoOwnerObject.residentDistrictName ? CoOwnerObject.residentDistrictName :
              CoOwnerObject.residentDistrict ? CoOwnerObject.residentDistrict : '',
            el.paddressRegion = CoOwnerObject.residentCountryCode ? CoOwnerObject.residentCountryCode : '',
            el.paddressRegionName = CoOwnerObject.residentCountryCode ? CoOwnerObject.residentCountryCode : '',
            el.paddressWard = CoOwnerObject.residentWardName ? CoOwnerObject.residentWardName :
              CoOwnerObject.residentWard ? CoOwnerObject.residentWard : '',
            el.name = CoOwnerObject.name ? CoOwnerObject.name : '',
            el.dateOfBirth = CoOwnerObject.dateOfBirth ? CoOwnerObject.dateOfBirth : '',
            el.national = CoOwnerObject.national.code ? CoOwnerObject.national.code : '',
            el.national2 = CoOwnerObject.national2.code ? CoOwnerObject.national2.code : '',
            el.national3 = CoOwnerObject.national3.code ? CoOwnerObject.national3.code : '',
            el.national4 = CoOwnerObject.national4.code ? CoOwnerObject.national4.code : '',
            el.nationalName = CoOwnerObject.national.name ? CoOwnerObject.national.name : '',
            el.nationalName2 = CoOwnerObject.national2.name ? CoOwnerObject.national2.name : '',
            el.nationalName3 = CoOwnerObject.national3.name ? CoOwnerObject.national3.name : '',
            el.nationalName4 = CoOwnerObject.national4.name ? CoOwnerObject.national4.name : '',
            el.isResident = CoOwnerObject.isResident === 'Y' ? true : false,
            el.job = CoOwnerObject.job.code ? CoOwnerObject.job.code : '',
            // el.=jobCode: CoOwnerObject.job.code ? CoOwnerObject.job.code : '',
            el.position = CoOwnerObject.position ? CoOwnerObject.position : '',
            el.identityNumber = CoOwnerObject.identityNumber ? CoOwnerObject.identityNumber : '',
            el.identityAddress = CoOwnerObject.identityAddress ? CoOwnerObject.identityAddress : '',
            el.identityDate = CoOwnerObject.identityDate ? CoOwnerObject.identityDate : '',
            el.phoneNumber = CoOwnerObject.phoneNumber ? CoOwnerObject.phoneNumber : '',
            el.phoneNumber2 = CoOwnerObject.phoneNumber2 ? CoOwnerObject.phoneNumber2 : '',
            el.email = CoOwnerObject.email ? CoOwnerObject.email : '',
            // tslint:disable-next-line: max-line-length
            el.visaExemption = !this.isShowOptionVisaFree ? null : (CoOwnerObject.isVisaFree ? true : (CoOwnerObject.visaIssueDate && CoOwnerObject.visaExpireDate ? false : null)),
            el.visaIssueDate = CoOwnerObject.visaIssueDate ? CoOwnerObject.visaIssueDate : '',
            el.visaExpireDate = CoOwnerObject.visaExpireDate ? CoOwnerObject.visaExpireDate : '',
            // el. =inEffect: CoOwnerObject.   ?  CoOwnerObject.   : '',
            el.genderCode = CoOwnerObject.gender ? CoOwnerObject.gender : '',
            el.placeOfBirth = CoOwnerObject.placeOfBirth ? CoOwnerObject.placeOfBirth : '';
        }
        this.resetFormOwner();
        this.actionName = '';
      }
    });
  }
}

