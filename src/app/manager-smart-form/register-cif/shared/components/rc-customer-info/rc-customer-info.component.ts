import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { addressDefaultVietNam, cifGenderOption, cifProfessionOption } from 'src/app/shared/constants/cif/cif-constants';
import * as moment from 'moment';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { ONLY_NUMBER_REGEX, RG_EMAIL, RG_FULLNAME, RG_FULLNAME_CORE } from 'src/app/shared/constants/regex.utils';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { PREFIX_MOBILE_NUMBER } from 'src/app/shared/constants/constants';
import { fnValidateEmail } from 'src/app/shared/constants/utils';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';

@Component({
  selector: 'app-rc-customer-info',
  templateUrl: './rc-customer-info.component.html',
  styleUrls: ['./rc-customer-info.component.scss']
})
export class RcCustomerInfoComponent implements OnInit, AfterViewInit {

  @ViewChild('f') form: any;
  @ViewChild('fullName', { static: false }) fullName: ElementRef; // Họ và tên
  @ViewChild('mobileNo', { static: false }) mobileNo: ElementRef; // Số điện thoại
  @ViewChild('email', { static: false }) email: ElementRef; // Email
  @ViewChild('position', { static: false }) position: ElementRef; // Chức vụ
  @ViewChild('workPlace', { static: false }) workPlace: ElementRef; // Nơi công tác
  @ViewChild('dpDateOfBirth', { static: true }) dpDateOfBirth: LpbDatePickerComponent;  // Ngày sinh
  @ViewChild('visaIssueDate', { static: true }) visaIssueDate: ElementRef; // Miễn thị từ ngày
  @ViewChild('visaExpireDate', { static: true }) visaExpireDate: ElementRef; // Miễn thị đến ngày
  @ViewChild('dpFromDateVisaFree', { static: false }) dpFromDateVisaFree: LpbDatePickerComponent; // Miễn thị từ ngày
  @ViewChild('dpToDateVisaFree', { static: false }) dpToDateVisaFree: LpbDatePickerComponent; // Miễn thị từ ngày

  @Output() dateOfBirthChange = new EventEmitter<any>();
  @Output() nationiltyFisrtChange = new EventEmitter<any>();
  @Output() mobileNoChange = new EventEmitter<any>();
  age = 0;  // Tuổi dựa theo ngày sinh được nhập
  lstGender = cifGenderOption;  // Danh sách giới tính
  lstProfession = cifProfessionOption;  // Danh sách nghề nghiệp
  taxCode = '';
  lstCountry = [];  // Danh sách Quốc gia
  selectedNationality1 = addressDefaultVietNam; // Lựa chọn quốc tịch 1, default Việt Nam
  selectedNationality2;  // Lựa chọn quốc tịch 2
  selectedNationality3;  // Lựa chọn quốc tịch 3
  selectedNationality4;  // Lựa chọn quốc tịch 4
  lstSubNationality = [
    { nationalCode: 'n2', isShow: false },
    { nationalCode: 'n3', isShow: false },
    { nationalCode: 'n4', isShow: false }
  ];
  txtOther = ''; // trường hợp chọn nghê ngiệp khác
  selectedProfession: any;  // Lựa chọn nghề nghiệp
  gender = 'M'; // Giới tính
  residentStatus = 'Y'; // Người cư trú
  isOther = false;
  isVisaFree = true; // Miễn thị thực Có/không
  isShowOptionVisaFree = false;
  creditStatus = 'N'; // Nhu cầu sử dụng thấu chi
  payStatus = false; // Nhận lương qua LienVietPostBank
  errMsgFullName = ''; // Thông báo lỗi trường Họ và tên
  errMsgVerifyDocsNumber = ''; // Thông báo lỗi Loại GTXM
  errMsgProfession = '';  // Thông báo lỗi nghề nghiệp
  errMsgMobileNo = ''; // Thông báo lỗi số điện thoại
  errMsgWorkPlace = ''; // Nơi công tác
  errMsgJobPosition = ''; // Thông báo lỗi Chức vụ
  errMsgNationality = ''; // Thông báo lỗi Quốc tịch
  errMsgEmail = ''; // Thông báo lỗi Email
  isWanning = false;
  currentDate = moment(); // Ngày hiện tại
  errMsgTaxcode = '';
  constructor(private helpService: HelpsService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getCountry();
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

  validTaxCode(): void {
    this.errMsgTaxcode = '';
    if (this.taxCode && this.taxCode.length !== 10 && this.taxCode !== '') {
      this.errMsgTaxcode = 'Mã số thuế không đủ 10 ký tự';
      return;
    }
  }
  /**
   * Bắt lỗi thông tin trường họ tên
   */
  validateFullName(): void {
    this.errMsgFullName = '';
    if (!this.fullName.nativeElement.value || this.fullName.nativeElement.value.trim() === '') {
      this.errMsgFullName = 'Họ và tên không được để trống';
    }
    // Check validate
  }

  /**
   * Dùng Regex chặn ký tự đặc biệt trường họ tên theo yêu cầu
   */
  fullNameInputChange(evt): void {
    let content = (evt.target.value.length === 1) ? evt.target.value.trim() : evt.target.value;
    content = content.replace(RG_FULLNAME_CORE, '');
    content = content.toUpperCase();
    this.fullName.nativeElement.value = content;
  }

  dateOfBirthChanged(): void {
    this.validateDateOfBirth();
    if (this.dpDateOfBirth.errorMsg === '') {
      this.dateOfBirthChange.emit(moment(this.dpDateOfBirth.getSelectedDate(), 'DD/MM/YYYY'));
    }
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
    this.validateProfession();
  }

  blurDateOfBirth(evt): void {
    if (!this.dpDateOfBirth.haveValue()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được để trống');
    }
  }

  nationalityFirstChange(evt): void {
    this.selectedNationality1 = evt;
    this.checkShowVisaFree();
    this.validateNationality();
    this.nationiltyFisrtChange.emit(evt);
  }
  // first second third fourth
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
   * Kiểm tra nếu quốc tịch 1 khác Việt Nam => Cho phép hiển thị chọn thị thực nhập cảnh
   */
  checkShowVisaFree(): void {
    if (this.selectedNationality1.code !== 'VN') {
      this.isShowOptionVisaFree = true;
    } else {
      this.isShowOptionVisaFree = false;
    }
  }

  /**
   * Thay đổi chọn miễn phí thị thực
   */
  selectedChangeVisaFree(evt): void {
    this.isVisaFree = evt.target.checked ? true : false;
    if (this.isVisaFree) {
      this.dpFromDateVisaFree.setValue('');
      this.dpFromDateVisaFree.setErrorMsg('');
      this.dpToDateVisaFree.setValue('');
      this.dpToDateVisaFree.setErrorMsg('');
    }
  }

  /**
   * Bắt lỗi 'Từ ngày' miễn thị thực nhập cảnh
   */
  validateFromDateVisaFree(): void {
    if (!this.isVisaFree) {
      this.dpFromDateVisaFree.setErrorMsg('');
      if (this.dpToDateVisaFree.errorMsg === '') {
        this.dpToDateVisaFree.setErrorMsg('');
      }
      if (this.dpFromDateVisaFree.haveValue() && !this.dpFromDateVisaFree.haveValidDate()) {
        this.dpFromDateVisaFree.setErrorMsg('Từ ngày sai định dạng');
        return;
      }
      // const tmpFromDateVisa = moment(contentInputDateOfBirth, 'DD/MM/YYYY');
      if (this.dpToDateVisaFree.haveValue() && this.dpToDateVisaFree.haveValidDate()) {
        if (this.compareDate(this.dpFromDateVisaFree.getSelectedDate(), this.dpToDateVisaFree.getSelectedDate()) === 1) {
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
      if (this.dpFromDateVisaFree.errorMsg === '') {
        this.dpFromDateVisaFree.setErrorMsg('');
      }
      this.dpToDateVisaFree.setErrorMsg('');
      if (this.dpToDateVisaFree.haveValue() && !this.dpToDateVisaFree.haveValidDate()) {
        this.dpToDateVisaFree.setErrorMsg('Đến ngày sai định dạng');
        return;
      }
      if (this.dpFromDateVisaFree.haveValue() && this.dpFromDateVisaFree.haveValidDate()) {
        if (this.compareDate(this.dpFromDateVisaFree.getSelectedDate(), this.dpToDateVisaFree.getSelectedDate()) === 1) {
          this.dpToDateVisaFree.setErrorMsg('Đến ngày phải lớn hơn hoặc bằng Từ ngày');
        }
      }
    }
  }

  professionChanged(evt): void {
    this.txtOther = '';
    this.selectedProfession = evt;
  }

  validateProfession(): void {
    this.errMsgProfession = '';
    if (this.age >= 15 && !this.selectedProfession) {
      this.errMsgProfession = 'Nghề nghiệp không được bỏ trống';
    } else {
      if (this.selectedProfession && this.selectedProfession.code === 'OTHER') {
        this.isOther = true;
      } else {
        this.isOther = false;
      }
    }
  }

  validateWorkPlace(): void {
    this.errMsgWorkPlace = '';
    if (this.age >= 15) {
      this.errMsgWorkPlace = this.workPlace.nativeElement.value.trim() !== '' ? '' : 'Nơi công tác không được để trống';
      return;
    }
  }

  validatePosition(): void {
    this.errMsgJobPosition = '';
    if (this.age >= 15) {
      this.errMsgJobPosition = this.position.nativeElement.value.trim() !== '' ? '' : 'Chức vụ không được để trống';
      return;
    }
  }

  /**
   * Bắt lỗi thông tin nhập số điện thoại
   */
  validatePhoneNumber(): void {
    this.errMsgMobileNo = '';
    if (!this.mobileNo.nativeElement.value || this.mobileNo.nativeElement.value === '') {
      this.errMsgMobileNo = 'Điện thoại không được để trống';
      return;
    }
    if (this.mobileNo.nativeElement.value.length !== 10) {
      this.errMsgMobileNo = 'Số điện thoại phải đủ 10 ký tự';
      return;
    }
    // tslint:disable-next-line:variable-name
    const prefix_mobile = this.mobileNo.nativeElement.value.toString().substring(0, 3);
    if (!PREFIX_MOBILE_NUMBER.includes(prefix_mobile)) {
      this.errMsgMobileNo = 'Số điện thoại sai định dạng';
      return;
    }
    this.mobileNoChange.emit(this.mobileNo.nativeElement.value);
  }

  /**
   * Dùng Regex chặn ký tự đặc biệt trường số điện thoại theo yêu cầu
   */
  phoneNumberInputChanged(evt): void {
    let content = (evt.target.value.length === 1) ? evt.target.value.trim() : evt.target.value;
    content = content.replace(ONLY_NUMBER_REGEX, '');
    this.mobileNo.nativeElement.value = content;
  }

  phoneNumberChanged(evt): void {
    this.isWanning = false;
    this.searchNumberVerifyDocs(this.mobileNo.nativeElement.value, data => {
      if (data.length > 0) {
        this.isWanning = true;
        this.errMsgMobileNo = 'SĐT đã tồn tại trên hệ thống, Khách hàng có muốn nhận SMS GD tiết kiệm không';
      }
    });
  }

  /*
  *search Thông tin số điện thoại
  */
  searchNumberVerifyDocs(numberPhone, callback?: any): void {
    const body = {
      phone: numberPhone,
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customerSearch/searchCustomer',
        data: body,
        // tslint:disable-next-line:object-literal-shorthand
        progress: false,
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


  /**
   * Bắt lỗi nếu người dùng nhập email sai định dạng
   */
  validateEmail(): void {
    this.errMsgEmail = '';
    if (this.email.nativeElement.value && this.email.nativeElement.value.trim().length > 0) {
      const email = this.email.nativeElement.value.trim();
      if (!fnValidateEmail(email)) {
        this.errMsgEmail = 'Định dạng email không đúng';
        return;
      }
    }
  }

  emailInputChange(evt): void {
    let content = (evt.target.value.length === 1) ? evt.target.value.trim() : evt.target.value;
    content = content.replace(' ', '');
    this.email.nativeElement.value = content;
  }

  /**
   * Thay đổi lựa chọn nhận lương qua LPB
   */
  selectedChangePayStatus(evt): void {
    this.payStatus = evt.target.checked ? true : false;
  }

  /**
   * Fn so sánh date
   */
  // tslint:disable-next-line:variable-name
  compareDate(f_date: any, t_date: any): any {
    const from = moment(f_date, 'DD/MM/YYYY');
    const to = moment(t_date, 'DD/MM/YYYY');
    if (from > to) { return 1; }
    else if (from < to) { return -1; }
    else { return 0; }
  }

  getDataCifCustomerForm(): any {
    let infoCustomer = null;
    this.validateFullName();
    this.validateDateOfBirth();
    this.validateNationality();
    this.validateFromDateVisaFree();
    this.validateToDateVisaFree();
    this.validateProfession();
    this.validateWorkPlace();
    this.validatePosition();
    this.validatePhoneNumber();
    this.validateEmail();
    this.validTaxCode();
    if (this.errMsgFullName !== '' || this.errMsgVerifyDocsNumber !== '' || this.errMsgProfession !== '' ||
      this.errMsgMobileNo !== '' || this.errMsgWorkPlace !== '' ||
      this.errMsgJobPosition !== '' || this.errMsgNationality !== '' || this.errMsgEmail !== '' ||
      this.dpFromDateVisaFree.errorMsg !== '' || this.dpToDateVisaFree.errorMsg !== '' || this.dpDateOfBirth.errorMsg !== ''
      || this.errMsgTaxcode !== ''
    ) {
      return;
    }
    infoCustomer = {
      fullName: this.fullName.nativeElement.value ? this.fullName.nativeElement.value : null,
      genderCode: this.gender,
      dateOfBirth: this.dpDateOfBirth.getValue() ? this.dpDateOfBirth.getValue() : null,
      mobileNo: this.mobileNo.nativeElement.value ? this.mobileNo.nativeElement.value : null,
      residentStatus: this.residentStatus,
      profession: (!this.isOther ? (this.selectedProfession ? this.selectedProfession.code : null) : this.txtOther),
      position: this.position.nativeElement.value ? this.position.nativeElement.value : null,
      nationality1Code: this.selectedNationality1.code,
      nationality2Code: this.selectedNationality2 ? this.selectedNationality2.code : null,
      nationality3Code: this.selectedNationality3 ? this.selectedNationality3.code : null,
      nationality4Code: this.selectedNationality4 ? this.selectedNationality4.code : null,
      workPlace: this.workPlace.nativeElement.value ? this.workPlace.nativeElement.value : null,
      email: this.email.nativeElement.value ? this.email.nativeElement.value : null,
      payStatus: this.payStatus,
      creditStatus: (this.creditStatus === 'Y' ? true : false),
      // tslint:disable-next-line: max-line-length
      visaExemption: !this.isShowOptionVisaFree ? null : (this.isVisaFree ? true : (this.dpFromDateVisaFree.getValue() || this.dpToDateVisaFree.getValue() ? false : null)),
      visaIssueDate: this.dpFromDateVisaFree.getValue() ? this.dpFromDateVisaFree.getValue() : null,
      visaExpireDate: this.dpToDateVisaFree.getValue() ? this.dpToDateVisaFree.getValue() : null,
    };
    return infoCustomer;
  }
}
