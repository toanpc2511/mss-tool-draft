import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { LpbSingleAddressComponent } from 'src/app/shared/components/lpb-single-address/lpb-single-address.component';
import { addressDefaultVietNam, cifGenderOption } from 'src/app/shared/constants/cif/cif-constants';
import { listRelationships, listVerificationDocs, PREFIX_MOBILE_NUMBER } from 'src/app/shared/constants/constants';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { ONLY_NUMBER_REGEX, RG_FULLNAME, RG_FULLNAME_CORE, STR_NOT_SPEC_CHARACTER } from 'src/app/shared/constants/regex.utils';
import { compareDate } from 'src/app/shared/constants/utils';
import { HelpsService } from 'src/app/shared/services/helps.service';

@Component({
  selector: 'app-rc-guardian',
  templateUrl: './rc-guardian.component.html',
  styleUrls: ['./rc-guardian.component.scss']
})
export class RcGuardianComponent implements OnInit, AfterViewInit {
  @ViewChild('dpDateSupplyFirst', { static: false }) dpDateSupplyFirst: LpbDatePickerComponent;
  @ViewChild('supplyDateFirst', { static: false }) supplyDateFirst: ElementRef;  // Ngày cấp GTXM
  @ViewChild('dateOfBirth', { static: false }) dateOfBirth: ElementRef;  // Ngày sinh
  @ViewChild('fromDateVisaFree', { static: false }) fromDateVisaFree: ElementRef; // Miễn thị từ ngày
  @ViewChild('toDateVisaFree', { static: false }) toDateVisaFree: ElementRef; // Miễn thị đến ngày
  @ViewChild('dpDateOfBirth', { static: false }) dpDateOfBirth: LpbDatePickerComponent;  // Ngày sinh
  @ViewChild('address', { static: false }) address: LpbSingleAddressComponent; // khối địa chỉ
  @ViewChild('dpFromDateVisaFree', { static: false }) dpFromDateVisaFree: LpbDatePickerComponent; // Miễn thị từ ngày
  @ViewChild('dpToDateVisaFree', { static: false }) dpToDateVisaFree: LpbDatePickerComponent; // Miễn thị từ ngày
  @ViewChild('refScroll', { static: false }) refScroll: ElementRef; // scroll nếu edit
  @ViewChild('refocus', { static: false }) refocus: ElementRef; // focus nếu edit

  positionDelete = -1; // khởi tạo vị trí cấn xóa trên bảng
  prositonEdit = -1; // khởi tạo vị trí cần edit trên bảng
  inpNationality: string; // Quốc tịch 1 để check Validate loại GTXM. Nếu Quốc tịch 1 khác Việt Nam => Loại GTXM chỉ là hộ chiếu
  inpDateOfBirth: moment.MomentInput;  // Ngày sinh để check validate GTXM
  typeRelationship = '';  // Mã mối quan hệ
  perDocTypeCode = ''; // Loại GTXM
  mobileNo = ''; // số Điện thoại
  fullName = ''; // Họ và tên
  taxCode = ''; //  Mã số thuế
  cifCode = ''; // mã cif
  age = 0; // khởi tạo tuổi ban đầu
  isShowAddGuardian = false; // hiển thỉ form tạo mới
  objRelationship: any = {};
  isCheckError: boolean; //  kiểm tra  giá trị hợp lệ của
  perDocNoList: any = [];
  // tslint:disable-next-line:max-line-length
  objCurrentAddress: { currentCountryCode: any; currentCityName: any; currentDistrictName: any; currentWardName: any; currentStreetNumber: any; currentCountryName?: string; currentAddress?: string };
  guardians = []; // danh sách người đại diện pháp luật thêm mới
  typeCustomer = ''; // loại tìm kiếm khách hàng
  codeCustomer = ''; // mã loại tìm kiếm khách hàng
  objTypeCustomer: { cif?: any; uidValue?: any; phone?: any; uidName?: any; };
  isDeleteRow = false; // kiểm tra nếu row cần xóa
  customers = []; // danh sách khách hàng
  inEffect = null; // tình trạng f
  errMsgSearchCustomer = ''; // Thông báo lỗi tìm kiếm khách hàng
  title = 'show'; // hiển thị tile ngày hiện tại
  msgEmpty: string; // hiện thỉ nếu không có dữ liệu
  isShowOptionVisaFree = false;
  allowEditProvideByFirst = true;
  isCheckNotSave = false; // kiểm tra  hủy thao tác
  provideByFirst = '';  // Nơi cấp GTXM
  errMsgMobileNo = ''; // Thông báo lỗi số điện thoại
  errMsgSupplyDateFirst = '';   // Thông báo lỗi ngày cấp GTXM
  errMsgProvideByFirst = '';  // Thông báo lỗi nơi cấp GTXM
  errMsgRelationship = ''; // thông báo lỗi mối quan hệ
  errMsgFullName = ''; // Thông báo lỗi họ tên
  verifyNumberDocsFirst = ''; // Số GTXM
  errMsgTypeVerifyDocsFirst = ''; // loại giấy tờ xác minh
  selectedNationality1: any = addressDefaultVietNam; // Lựa chọn quốc tịch 1, default Việt Nam
  lstCountry = [];  // Danh sách Quốc gia
  lstGender = cifGenderOption;  // Danh sách giới tính
  genderCode = 'M'; // Giới tính
  residentStatus = 'Y'; // Người cư trú
  lstRelationship = listRelationships;
  lstVerifyDocs = [];
  lstSubNationality: any = [
    { nationalCode: 'n2', isShow: false },
    { nationalCode: 'n3', isShow: false },
    { nationalCode: 'n4', isShow: false }
  ];
  isDisable = false;
  detectChange = '';
  isOnlyView = false; // tham số check edit và chỉ view
  isCheckValid = false;
  actionName = '';  // VIEW_DETAIL, CREATE_LEGAL, EDIT_LEGAL, ADD_CUS_LEGAL
  typeParamSearch = {  // select loại tìm kiếm customer
    cif: 'CIF',
    phone: 'PHONE'
  };
  errMsgVerifyNumberDocsFirst = ''; // Thông báo lỗi số GTXM
  isVisaFree = true; // Miễn thị thực Có/không
  selectedNationality2: { code: any; };  // Lựa chọn quốc tịch 2
  selectedNationality3: { code: any; };  // Lựa chọn quốc tịch 3
  selectedNationality4: { code: any; };  // Lựa chọn quốc tịch 4
  errMsgNationality = ''; // Thông báo lỗi Quốc tịch
  errMsgFromDateVisaFreeDate = '';  // Thông báo lỗi thời gian 'Từ ngày' miễn thị thực nhập cảnh
  errMsgToDateVisaFreeDate = '';  // Thông báo lỗi thời gian 'Đến ngày' miễn thị thực nhập cảnh
  minSupplyDate = moment('01/01/1920', 'DD/MM/YYYY');
  isListCustomer = false;
  readonly confim = {  //  thực hiện xóa hay là hủy xóa trên bảng
    CANCEL: 'CANCEL',
    CONFIM: 'CONFIM',
  };
  @Output() nationiltyFisrtChange = new EventEmitter<any>();
  @Output() sendData = new EventEmitter<any>();
  @Input() inputData: any;
  @Output() complateGuardian = new EventEmitter<any>();
  keyCodeTab = -1;
  constructor(
    private helpService: HelpsService
  ) { }

  ngOnInit(): void {
    this.initData();
  }

  detectChangeDom(params): void {
    this.detectChange = params;
  }

  confimClose(param): void {
  }

  ngAfterViewInit(): void {
    this.getCountry();
  }
  /**
   *  show khối thêm mới  người đại diện pháp luật
   */
  showNewGuardian(): void {
    this.initAddress();
    this.isShowAddGuardian = true;
  }
  /**
   * khởi tạo data binding input
   */
  initData(): void {
    // remove binding two way
    const tempListVerificationDocs = this.getCopyList(listVerificationDocs);
    this.lstVerifyDocs = tempListVerificationDocs.filter(e => e.code !== 'GIAY KHAI SINH');
    this.guardians = this.inputData.map(e => ({ ...e }));
  }
  // tslint:disable-next-line:variable-name
  getCopyList(lst_input: any[]): any[] {
    // tslint:disable-next-line:prefer-const
    let ret = [];
    lst_input.forEach(val => ret.push(Object.assign({}, val)));
    return ret;
  }

  getCountry(callback?: any): void {
    const body = {};
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/country/listAll',
        data: body,
        progress: false,
        success: (res: { items: any[]; }) => {
          if (res) {
            this.lstCountry = res.items.filter((item: { statusCode: string; }) => item.statusCode === 'A');
          }
        }
      }
    );
  }

  validateDateOfBirth(): void {
    this.dpDateOfBirth.setErrorMsg('');
    const contentInputDateOfBirth = this.dpDateOfBirth.haveValue() ? this.dpDateOfBirth.getValue().trim() : '';
    if (contentInputDateOfBirth === '') {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được để trống');
      this.isCheckError = true;
      return;
    }
    if (!this.dpDateOfBirth.haveValidDate()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh sai định dạng');
      this.isCheckError = true;
      return;
    }
    // tslint:disable-next-line:prefer-const
    let tmpDate = moment(this.dpDateOfBirth.getSelectedDate(), 'DD/MM/YYYY');
    if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được chọn ngày tương lai');
      this.isCheckError = true;
      return;
    }
    this.age = moment().diff(tmpDate, 'years');
    if (this.age > 120) {
      this.dpDateOfBirth.setErrorMsg('Người đại diện pháp luật không được lớn hơn 120 tuổi');
      this.isCheckError = true;
      return;
    } else if (this.age === 120) {
      if (tmpDate.month() < new Date().getMonth() || tmpDate.date() < new Date().getDate()) {
        this.dpDateOfBirth.setErrorMsg('Người đại diện pháp luật không được lớn hơn 120 tuổi');
        this.isCheckError = true;
        return;
      }
    }
    if (compareDate(tmpDate, moment().subtract(15, 'years')) === 1) {
      this.dpDateOfBirth.setErrorMsg('Người đại diện pháp luật phải lớn hơn 15 tuổi');
      return;
    }
  }

  addNewGuardian(): void {
    this.initAddress();
    this.isListCustomer = false;
    this.isOnlyView = false;
    this.resetAttribute();
  }
  /**
   *  mã lỗi quan hệ với chủ tài khoản
   */
  validateRelationship(): void {
    this.errMsgRelationship = '';
    if (this.typeRelationship === '') {
      this.errMsgRelationship = 'Quan hệ với chủ tài khoản không được để trống';
      this.isCheckError = true;
      return;
    }
  }

  supplyDateFirstChangeorBlur(): void {
    this.validateSupplyDateFirst();
    this.setProvideByFirst();
  }
  /**
   * Fill giá trị nơi cấp mặc định
   * Nếu người dùng chọn loại giấy tờ xác minh
   */
  setProvideByFirst(): void {
    const typeVerifyDocsFirst = this.perDocTypeCode;
    if (typeVerifyDocsFirst === 'CAN CUOC CONG DAN') {
      this.allowEditProvideByFirst = false;
      if (this.dpDateSupplyFirst.haveValue() !== '') {
        const spDate = this.dpDateSupplyFirst.getValue();
        // tslint:disable-next-line:max-line-length
        // tslint:disable-next-line:max-line-length
        if (compareDate(spDate, moment('01/01/2016', 'DD/MM/YYYY')) > -1 && compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) === 1) {
          this.provideByFirst = 'CCS ĐKQL CT và DLQG về DC';
        }
        // tslint:disable-next-line:max-line-length
        if (spDate && (compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) === -1 || compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) === 0)) {
          this.provideByFirst = 'CCS QLHC về TTXH';
        }
      }
    } else {
      this.allowEditProvideByFirst = true;
      if (typeVerifyDocsFirst === 'CHUNG MINH NHAN DAN') {
        const cityName = JSON.parse(localStorage.getItem('userInfo')).cityName;
        if (this.provideByFirst === '') {
          this.provideByFirst = 'CÔNG AN ' + cityName;
        }
      } else {
        if (this.provideByFirst === '') {
          this.provideByFirst = 'Cục Quản lý XNC';
        }
      }
    }
    this.validateProvideByFirst();
  }

  checkkeytab(evt): void {
    this.keyCodeTab = evt.keyCode;
  }

  validateProvideByFirst(): void {
    this.errMsgProvideByFirst = '';
    if (this.provideByFirst === '') {
      this.errMsgProvideByFirst = 'Nơi cấp không được để trống';
      this.isCheckError = true;
      return;
    }
  }

  validateSupplyDateFirst(): void {
    this.keyCodeTab = 9;
    this.errMsgSupplyDateFirst = '';
    const contentSupplyDateFirst = (this.supplyDateFirst.nativeElement.value.length === 1)
      ? this.supplyDateFirst.nativeElement.value.trim() : this.supplyDateFirst.nativeElement.value;
    if (contentSupplyDateFirst === '') {
      this.errMsgSupplyDateFirst = 'Ngày cấp không được để trống';
      this.isCheckError = true;
      return;
    }
    if (!moment(contentSupplyDateFirst, 'DD/MM/YYYY').isValid()) {
      this.errMsgSupplyDateFirst = 'Ngày cấp sai định dạng';
      this.isCheckError = true;
      return;
    }
    const tmpDate = moment(contentSupplyDateFirst, 'DD/MM/YYYY');
    if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
      this.errMsgSupplyDateFirst = 'Ngày cấp không được chọn ngày tương lai';
      this.isCheckError = true;
      return;
    }
    if (compareDate(this.minSupplyDate, tmpDate) === 1) {
      this.errMsgSupplyDateFirst = 'Ngày cấp không được xa hơn ' + moment(this.minSupplyDate).format('DD/MM/YYYY');
      this.isCheckError = true;
      return;
    }
    const typeVerifyDocsFirst = this.perDocTypeCode;
    // tslint:disable-next-line:max-line-length
    if ((typeVerifyDocsFirst === 'CAN CUOC CONG DAN' || typeVerifyDocsFirst === 'CHUNG MINH NHAN DAN') && this.inpDateOfBirth && tmpDate.diff(moment(this.inpDateOfBirth), 'years') < 14) {
      this.errMsgSupplyDateFirst = 'Ngày cấp không hợp lệ';
      this.isCheckError = true;
      return;
    }
    if (typeVerifyDocsFirst === 'CAN CUOC CONG DAN' && compareDate(moment('01/01/2016', 'DD/MM/YYYY'), tmpDate) === 1) {
      this.errMsgSupplyDateFirst = 'Ngày cấp không được xa hơn 01/01/2016';
      this.isCheckError = true;
      return;
    }
  }

  onChangeDocsTypeFirst(val: string): void {
    this.provideByFirst = '';
    this.perDocTypeCode = val;
    this.validateTypeVerifyDocsFirst();
    this.validateVerifyNumberDocsFirst();
    this.validateSupplytDateFirst();
    this.setProvideByFirst();
  }

  validateSupplytDateFirst(): void {
    this.dpDateSupplyFirst.setErrorMsg('');
    const contentInputDateOfBirth = this.dpDateSupplyFirst.haveValue() ? this.dpDateSupplyFirst.getValue() : '';
    if (contentInputDateOfBirth === '') {
      this.dpDateSupplyFirst.setErrorMsg('Ngày cấp không được để trống');
      this.isCheckError = true;
      return;
    }
    if (!this.dpDateSupplyFirst.haveValidDate()) {
      this.dpDateSupplyFirst.setErrorMsg('Ngày cấp sai định dạng');
      this.isCheckError = true;
      return;
    }
    const tmpDate = moment(this.dpDateSupplyFirst.getSelectedDate(), 'DD/MM/YYYY');
    if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
      this.dpDateSupplyFirst.setErrorMsg('Ngày cấp không được chọn ngày tương lai');
      this.isCheckError = true;
      return;
    }
    if (tmpDate.toDate().getTime() < moment('01/01/1920').toDate().getTime()) {
      this.dpDateSupplyFirst.setErrorMsg('Ngày cấp không được xa hơn 01/01/1920');
      this.isCheckError = true;
      return;
    }
    const typeVerifyDocsFirst = this.perDocTypeCode;
    if ((typeVerifyDocsFirst === 'CAN CUOC CONG DAN' || typeVerifyDocsFirst === 'CHUNG MINH NHAN DAN') && tmpDate &&
      this.inpDateOfBirth && tmpDate.diff(this.inpDateOfBirth, 'years') < 14) {
      this.dpDateSupplyFirst.setErrorMsg('Ngày cấp không hợp lệ');
      this.isCheckError = true;
      return;
    }
    if (typeVerifyDocsFirst === 'CAN CUOC CONG DAN' && compareDate(moment('01/01/2016', 'DD/MM/YYYY'), tmpDate) === 1) {
      this.errMsgSupplyDateFirst = 'Ngày cấp không được xa hơn 01/01/2016';
      this.dpDateSupplyFirst.setErrorMsg('Ngày cấp không được xa hơn 01/01/2016');
      this.isCheckError = true;
      return;
    }
  }
  validateTypeVerifyDocsFirst(): void {
    this.errMsgTypeVerifyDocsFirst = '';
    if (!this.perDocTypeCode) {
      this.errMsgTypeVerifyDocsFirst = 'Loại GTXM bắt buộc chọn';
      this.isCheckError = true;
      return;
    }
    const typeDocs = this.perDocTypeCode;
    this.inpNationality = this.selectedNationality1.code;
    if (this.inpNationality !== 'VN' && typeDocs !== 'HO CHIEU') {
      this.errMsgTypeVerifyDocsFirst = 'Vui lòng chọn Loại GTXM là Hộ chiếu';
      this.isCheckError = true;
      return;
    }
    if (this.inpDateOfBirth && moment().diff(this.inpDateOfBirth, 'years') < 14 && (typeDocs === 'CAN CUOC CONG DAN' || typeDocs === 'CHUNG MINH NHAN DAN')) {
      this.errMsgTypeVerifyDocsFirst = 'GTXM phải là Hộ chiếu hoặc Giấy khai sinh';
      this.isCheckError = true;
      return;
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

  nationalityFirstChange(evt: any): void {
    this.selectedNationality1 = evt;
    this.checkShowVisaFree();
    this.validateNationality();
    this.nationiltyFisrtChange.emit(evt);
  }

  nationalityThirdChange(evt: any): void {
    this.selectedNationality3 = evt;
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
          this.removeSelectNationality(i);
        }
      }
    }
    this.validateNationality();
  }

  removeSelectNationality(i): void {
    if (i === 0) {
      this.selectedNationality2 = { code: null };
    } else if (i === 1) {
      this.selectedNationality3 = { code: null };
    } else if (i === 2) {
      this.selectedNationality4 = { code: null };
    }
  }

  nationalityFourthChange(evt: any): void {
    this.selectedNationality4 = evt;
    this.validateNationality();
  }

  nationalitySecondChange(evt: any): void {
    this.selectedNationality2 = evt;
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
      const findDuplicates = (arr: any[]) => arr.filter((item: any, index: any) => arr.indexOf(item) !== index);
      if (findDuplicates(lstTempSelected).length > 0) {
        this.errMsgNationality = 'Quốc tịch không được trùng nhau';
        this.isCheckError = true;
        return;
      }
    }
  }
  /**
   * Thay đổi chọn miễn phí thị thực
   */
  selectedChangeVisaFree(evt: { target: { checked: any; }; }): void {
    this.isVisaFree = evt.target.checked ? true : false;

    this.dpFromDateVisaFree.setValue('');
    this.dpFromDateVisaFree.setErrorMsg('');
    this.dpToDateVisaFree.setValue('');
    this.dpToDateVisaFree.setErrorMsg('');

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
   * Fn so sánh date
   */
  // tslint:disable-next-line:variable-name
  // compareDate(f_date: any, t_date: any): any {
  //   const from = moment(f_date, 'DD/MM/YYYY');
  //   const to = moment(t_date, 'DD/MM/YYYY');
  //   if (from > to) { return 1; }
  //   else if (from < to) { return -1; }
  //   else { return 0; }
  // }
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
  /**
   * Bắt lỗi số giấy tờ xác minh
   */
  validateVerifyNumberDocsFirst(): void {
    const typeVerifyDocsFirst = this.perDocTypeCode;
    this.errMsgVerifyNumberDocsFirst = '';
    if (this.verifyNumberDocsFirst === '') {
      this.errMsgVerifyNumberDocsFirst = 'Số GTXM bắt buộc nhập';
      this.isCheckError = true;
      return;
    }
    if (this.verifyNumberDocsFirst.match(STR_NOT_SPEC_CHARACTER)) {
      this.errMsgVerifyNumberDocsFirst = 'Số GTXM không được chứa ký tự đặc biệt';
      this.isCheckError = true;
      return;
    }
    if (typeVerifyDocsFirst === 'CHUNG MINH NHAN DAN') {
      // tslint:disable-next-line:max-line-length
      if ((this.verifyNumberDocsFirst.length !== 12 && this.verifyNumberDocsFirst.length !== 9) || this.verifyNumberDocsFirst.match(ONLY_NUMBER_REGEX)) {
        this.errMsgVerifyNumberDocsFirst = 'Chứng minh nhân dân phải 9 hoặc 12 ký tự số';
        this.isCheckError = true;
        return;
      }
    }
    if (typeVerifyDocsFirst === 'CAN CUOC CONG DAN') {
      if (this.verifyNumberDocsFirst.length !== 12 || this.verifyNumberDocsFirst.match(ONLY_NUMBER_REGEX)) {
        this.errMsgVerifyNumberDocsFirst = 'Căn cước công dân phải là 12 ký tự số';
        this.isCheckError = true;
        return;
      }
    }
  }
  /**
   * tìm kiếm thông tin khác hàng
   */
  searchCustomer(): void {
    this.customers = [];
    this.msgEmpty = '';
    if (this.validSearchCustomer(this.codeCustomer)) {
      this.isListCustomer = true;
      this.typeCustomerChange(this.typeCustomer);
      this.getListCustomer();
    } else {
      this.isListCustomer = false;
    }
  }

  supplyDateFirstBlur(): void {
    this.validateSupplytDateFirst();
    this.setProvideByFirst();
  }

  supplyDateFirstChange(): void {
    this.validateSupplytDateFirst();
    this.setProvideByFirst();
  }

  customerChange(): void {
    this.validSearchCustomer(this.codeCustomer);
  }
  /**
   * bắt lỗi giá trị nhập
   */
  validSearchCustomer(event: string): boolean {
    if (event === '') {
      this.errMsgSearchCustomer = 'Giá trị tìm kiếm không được để trống';
      return false;
    } else {
      this.errMsgSearchCustomer = '';
    }
    return true;
  }
  /**
   * lấy danh sách khách hàng
   */
  getListCustomer(callBack?: any): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customerSearch/searchCustomer',
        data: this.objTypeCustomer,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            this.customers = res.items;
            if (this.customers && this.customers.length === 0) {
              this.msgEmpty = 'Không có dữ liệu';
            }
          }
        }
      }
    );
  }
  /**
   * thay đổi tham số đầu vào
   */
  typeCustomerChange(evt): void {
    this.objTypeCustomer = {};
    this.objTypeCustomer.cif = '';
    this.objTypeCustomer.uidValue = '';
    this.objTypeCustomer.phone = '';
    this.objTypeCustomer.uidName = '';
    switch (evt) {
      case '':
        this.objTypeCustomer.uidValue = this.codeCustomer;
        break;
      case this.typeParamSearch.cif:
        this.objTypeCustomer.cif = this.codeCustomer;
        this.objTypeCustomer.uidName = this.typeParamSearch.cif;
        break;
      case this.typeParamSearch.phone:
        this.objTypeCustomer.phone = this.codeCustomer;
        this.objTypeCustomer.uidName = this.typeParamSearch.phone;
        break;
      default:
        break;
    }
  }
  /**
   * đóng popup tìm kiếm
   */
  close(): void {
    this.isListCustomer = false;
  }
  /**
   * lựa chọn khách hàng khi tìm kiếm
   */
  selectCustomer(itemCif: any): void {
    const objCustomerInfor: any = {};
    objCustomerInfor.cif = itemCif;
    this.getDetailCustomeInfor(objCustomerInfor);
  }
  /**
   * lấy chi tiết khách hàng
   */
  getDetailCustomeInfor(objCustomer: any): void {
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customerESB/getCustomerInfo',
        data: objCustomer,
        progress: true,
        success: (res) => {
          if (res && res.responseStatus.success) {
            if (Object.keys(res.customer).length !== 0) {
              // mặc định là thêm mới => this.prositonEdit = -1
              this.prositonEdit = -1;
              // mã cif khách hàng
              this.cifCode = res.customer.customerCode;
              // hàm xử lý nạp dữ liệu vào input
              this.fillData(res.customer.person);
              this.isListCustomer = false;
              this.isOnlyView = false;
              // remove thông báo
              this.removeMsgError();
            }
          }
        }
      }
    );
  }
  /**
   * gán  giá trị tìm kiếm
   */
  fillData(customerInfo): void {
    // họ và tên
    this.fullName = customerInfo.fullName === null ? '' : customerInfo.fullName;
    // ngày sinh
    if (customerInfo.dateOfBirth !== null) {
      this.dpDateOfBirth.setValue(customerInfo.dateOfBirth);
    }
    // mã số thuê
    this.taxCode = customerInfo.taxCode === null ? '' : customerInfo.taxCode;
    // số điện thoại
    this.mobileNo = customerInfo.mobileNo === null ? '' : customerInfo.mobileNo;
    // người cư trú
    if (!customerInfo.residentStatus) {
      this.residentStatus = 'N';
    } else {
      this.residentStatus = 'Y';
    }
    // giới tính
    this.fillDataGender(customerInfo);
    // giấy tờ xác minh
    this.fillDataPerDocNoList(customerInfo);
    // quốc tịch
    this.fillDataNationality(customerInfo);
    // đỉa chỉ hiện tại
    this.fillDataAddress(customerInfo);
    // gán thị thực nhập cảnh
    this.fillDataVisa(customerInfo);
  }
  /**
   * gán giới tính
   */
  fillDataGender(customerInfo: { genderCode: any; }): void {
    this.lstGender.forEach((e: any) => {
      if (e.code === customerInfo.genderCode) {
        this.genderCode = customerInfo.genderCode;
      }
    });
  }
  /**
   * gán địa chỉ hiện tại
   */
  fillDataAddress(customerInfo): void {
    this.address.currentCountryChanged({ code: customerInfo.currentCountryCode });
    this.objCurrentAddress = {
      currentCountryCode: customerInfo.currentCountryCode,
      currentCityName: customerInfo.currentCityName,
      currentDistrictName: customerInfo.currentDistrictName,
      currentWardName: customerInfo.currentWardName,
      currentStreetNumber: customerInfo.currentStreetNumber
    };
  }
  /**
   * gán giấy tờ xác minh
   */
  fillDataPerDocNoList(customerInfo: { perDocNoList: string | any[]; }): void {
    if (customerInfo.perDocNoList !== null && customerInfo.perDocNoList.length !== 0) {
      this.perDocTypeCode = customerInfo.perDocNoList[0].perDocTypeCode;
      this.verifyNumberDocsFirst = customerInfo.perDocNoList[0].perDocNo;
      this.dpDateSupplyFirst.setValue(customerInfo.perDocNoList[0].issueDate);
      this.provideByFirst = customerInfo.perDocNoList[0].issuePlace;
    }
  }
  /**
   * gán quốc tịch
   */
  fillDataNationality(customerInfo: { nationality1Code: any; nationality2Code: any; nationality3Code: any; nationality4Code: any; }): void {
    this.selectedNationality1 = { code: customerInfo.nationality1Code };
    if (customerInfo.nationality2Code !== null) {
      this.selectedNationality2 = { code: customerInfo.nationality2Code };
      this.lstSubNationality[0].isShow = true;
    } else {
      this.lstSubNationality[0].isShow = false;
    }
    if (customerInfo.nationality3Code !== null) {
      this.selectedNationality3 = { code: customerInfo.nationality3Code };
      this.lstSubNationality[1].isShow = true;
    } else {
      this.lstSubNationality[1].isShow = false;
    }
    if (customerInfo.nationality4Code !== null) {
      this.selectedNationality4 = { code: customerInfo.nationality4Code };
      this.lstSubNationality[2].isShow = true;
    } else {
      this.lstSubNationality[2].isShow = false;
    }
  }
  /**
   * Bắt lỗi thông tin nhập số điện thoại
   */
  validatePhoneNumber(): void {
    this.errMsgMobileNo = '';
    const mobileNo = this.mobileNo.trim();
    if (mobileNo === '') {
      this.errMsgMobileNo = 'Số điện thoại không được để trống';
      this.isCheckError = true;
      return;
    } else if (this.mobileNo != null && mobileNo.length !== 10) {
      this.errMsgMobileNo = 'Số điện thoại phải đủ 10 ký tự';
      this.isCheckError = true;
      return;

    }
    // tslint:disable-next-line:variable-name
    const prefix_mobile = mobileNo.substring(0, 3);
    if (!PREFIX_MOBILE_NUMBER.includes(prefix_mobile)) {
      this.errMsgMobileNo = 'Đầu số điện thoại không đúng';
      this.isCheckError = true;
      return;
    }
  }
  /**
   * hủy thiết lập tạo mới
   */
  cancelAction(): void {
    this.isOnlyView = false;
    this.isShowAddGuardian = false;
    this.initAddress();
    this.resetAttribute();
  }
  /**
   * reset all về ban đầu
   */
  resetAttribute(): void {
    this.typeCustomer = '';
    this.codeCustomer = '';
    this.cifCode = '';
    this.fullName = '';
    this.taxCode = '';
    this.mobileNo = '';
    this.address.currentCountryChanged(addressDefaultVietNam);
    this.selectedNationality1 = addressDefaultVietNam;
    this.lstSubNationality[0].isShow = false;
    this.lstSubNationality[1].isShow = false;
    this.lstSubNationality[2].isShow = false;
    this.selectedNationality2 = { code: null };
    this.selectedNationality3 = { code: null };
    this.selectedNationality4 = { code: null };
    this.residentStatus = 'Y';
    this.genderCode = 'M';
    this.perDocTypeCode = '';
    this.verifyNumberDocsFirst = '';
    this.dpDateSupplyFirst.setValue('');
    this.dpDateOfBirth.setValue('');
    this.dpDateOfBirth.setErrorMsg('');
    this.dpDateSupplyFirst.setErrorMsg('');
    this.provideByFirst = '';
    this.typeRelationship = '';
    this.address.currentAddress.nativeElement.value = '';
    this.objCurrentAddress = {
      currentCountryCode: '',
      currentCityName: '',
      currentDistrictName: '',
      currentWardName: '',
      currentStreetNumber: ''
    };
    this.isListCustomer = false;
    this.isShowOptionVisaFree = false;
    this.isVisaFree = true;
    this.removeMsgError();
  }
  /**
   * gán thông tin thị thực nhập cảnh
   */
  // tslint:disable-next-line:max-line-length
  fillDataVisa(customerInfo: { nationality1Code: string; visaExemption: any; visaIssueDate: moment.MomentInput; visaExpireDate: moment.MomentInput; }): void {
    this.errMsgFromDateVisaFreeDate = '';
    if (customerInfo.nationality1Code !== 'VN') {
      this.isShowOptionVisaFree = true;
      this.isVisaFree = (customerInfo.visaExemption === null ? true : false);
      if (customerInfo.visaIssueDate !== null) {
        this.isVisaFree = false;
        this.dpFromDateVisaFree.setValue(customerInfo.visaIssueDate);
      }
      if (customerInfo.visaExpireDate !== null) {
        this.isVisaFree = false;
        this.dpToDateVisaFree.setValue(customerInfo.visaExpireDate);
      }
    } else {
      this.isShowOptionVisaFree = false;
    }
  }
  /**
   * lưu  dự liệu trên bảng
   */
  saveAction(): void {
    this.isShowAddGuardian = true;
    this.isCheckError = false;
    this.validFullName();
    this.validateDateOfBirth();
    this.validateNationality();
    this.validateFromDateVisaFree();
    this.validatePhoneNumber();
    this.validateRelationship();
    this.validateTypeVerifyDocsFirst();
    this.validateSupplytDateFirst();
    this.validateVerifyNumberDocsFirst();
    this.validateToDateVisaFree();
    this.validateProvideByFirst();
    this.getDataAdress();
    // nếu data không có lỗi
    if (!this.isCheckError) {
      this.objectTable();
      this.sendDataToRegister();
      this.isShowAddGuardian = false;
      this.resetAttribute();

    }
  }
  /**
   * gửi data  tơi màn hình cha
   */
  sendDataToRegister(): void {
    const guardian = {
      isGuardian: true,
      guardians: this.guardians,
    };
    this.sendData.emit(guardian);
  }
  /**
   * lấy khối thông tin địa chỉ
   */
  getDataAdress(): any {
    const address: any = this.address.getDataFormAddress();
    if (!address) {
      this.isCheckError = true;
    }
    return address;
  }
  /**
   * loại bỏ message lỗi hiện thỉ
   */
  removeMsgError(): void {
    this.errMsgTypeVerifyDocsFirst = '';
    this.errMsgNationality = '';
    this.address.errMsgCurrentCountry = '';
    this.address.errMsgCurrentDistrict = '';
    this.address.errMsgCurrentWard = '';
    this.address.errMsgCurrentProvice = '';
    this.address.errMsgCurrentAddress = '';
    this.errMsgSearchCustomer = '';
    this.errMsgSupplyDateFirst = '';
    this.errMsgProvideByFirst = '';
    this.errMsgRelationship = '';
    this.errMsgVerifyNumberDocsFirst = '';
    this.errMsgMobileNo = '';
    this.errMsgFullName = '';
  }
  /**
   * sử dụng chung để tạo request và edit data và thêm mới data và lưu data trên bảng
   */
  objectTable(): void {
    if (this.dpDateOfBirth.errorMsg !== '') { return; }
    if (this.dpFromDateVisaFree.errorMsg !== '') { return; }
    if (this.dpToDateVisaFree.errorMsg !== '') { return; }
    const relationship = this.typeRelationship;
    // lấy  object quan hệ với chủ tài khoản
    if (relationship && relationship !== '') {
      this.objRelationship = this.lstRelationship.find(e => (relationship === e.code));
    }
    // khởi tạo danh sách giấy tờ xác minh
    const perDocNoList = [];
    const objPerDocNo = {
      perDocNo: this.verifyNumberDocsFirst,
      issuePlace: this.provideByFirst,
      issueDate: this.dpDateSupplyFirst.getValue(),
      perDocTypeCode: this.perDocTypeCode,
    };
    perDocNoList.push(objPerDocNo);
    // khởi tạo object customer input component parent và hiện thỉ trên bảng
    const person = {
      perDocNoList,
      mobileNo: this.mobileNo.trim(),
      fullName: this.fullName.trim(),
      dateOfBirth: this.dpDateOfBirth.getValue(),
      taxCode: this.taxCode === '' ? null : this.taxCode.trim(),
      genderCode: this.genderCode,
      residentStatus: (this.residentStatus === 'Y' ? true : false),
      nationality1Code: (!this.selectedNationality1 ? null : this.selectedNationality1.code),
      nationality2Code: (!this.selectedNationality2 ? null : this.selectedNationality2.code),
      nationality3Code: (!this.selectedNationality3 ? null : this.selectedNationality3.code),
      nationality4Code: (!this.selectedNationality4 ? null : this.selectedNationality4.code),
      // tslint:disable-next-line: max-line-length
      visaExemption: !this.isShowOptionVisaFree ? null : (this.isVisaFree ? true : (this.dpFromDateVisaFree.getValue() || this.dpToDateVisaFree.getValue() ? false : null)),
      // tslint:disable-next-line:max-line-length
      visaIssueDate: !this.isVisaFree && this.dpFromDateVisaFree.getValue() !== '' ? this.dpFromDateVisaFree.getValue() : null,
      // tslint:disable-next-line:max-line-length
      visaExpireDate: !this.isVisaFree && this.dpToDateVisaFree.getValue() !== '' ? this.dpToDateVisaFree.getValue() : null,
      // tslint:disable-next-line:max-line-length
      currentCountryCode: !this.address.isCurrentCountryForeign ? this.getDataAdress().currentCountryCode : this.getDataAdress().currentCountry.trim(),
      // tslint:disable-next-line:max-line-length
      currentCityName: !this.address.isCurrentCountryForeign ? this.getDataAdress().currentProvinceName : this.getDataAdress().currentProvince.trim(),
      // tslint:disable-next-line:max-line-length
      currentDistrictName: !this.address.isCurrentCountryForeign ? this.getDataAdress().currentDistrictName : this.getDataAdress().currentDistrict.trim(),
      // tslint:disable-next-line:max-line-length
      currentWardName: !this.address.isCurrentCountryForeign ? this.getDataAdress().currentWardName : this.getDataAdress().currentWardForeign.trim(),
      currentStreetNumber: this.getDataAdress().currentAddress
    };
    const customer = {
      person,
      customerCode: this.cifCode,
      customerTypeCode: 'INDIV',
      customerCategoryCode: 'INDIV'
    };
    const guardian = {
      customer,
      guardianRelationCode: this.objRelationship.code,
      guardianTypeCode: 'INDIV_GUARDIAN',
      inEffect: null
    };
    // danh sách khởi tạo request
    // kiểm tra xem trong danh sách đã tòn tại hay chưa
    let isCheckEdit = false;
    this.guardians.forEach((e, index) => {
      if (index === this.prositonEdit) {
        // nêu tồn tại =>  xóa tại vị trí hiện tại
        this.guardians.splice(index, 1);
        // push object vào vị trí hiện tại
        this.guardians.splice(index, 0, guardian);
        isCheckEdit = true;
        this.prositonEdit = -1;
      }
    });

    // nếu ko phải edit => thêm mới
    if (!isCheckEdit) {
      this.guardians.push(guardian);
    }
  }
  /**
   * gán mối quan hệ vơi chủ tài khoản
   */
  fillDataRelationship(relationship: string): void {
    this.typeRelationship = relationship;
  }
  /**
   * xóa dữ liệu trên bảng
   */
  showPopupRemove(i: number): void {
    this.isDeleteRow = true;
    // gán vị trí cần delete
    this.positionDelete = i;
  }
  /**
   * thực hiện xóa hay hủy
   */
  confimRemoveData(param: any): void {
    switch (param) {
      case this.confim.CANCEL:
        this.isDeleteRow = false;
        break;
      case this.confim.CONFIM:
        if (this.guardians != null && this.guardians.length !== 0) {
          this.guardians.map((e, index) => {
            // xóa tại vị trí hiện tại
            if (this.positionDelete === index) {
              this.guardians.splice(this.positionDelete, 1);
            }
          });
          this.sendDataToRegister();
        }
        this.isDeleteRow = false;
        break;
      default:
        break;
    }
  }
  /**
   * Bắt lỗi thông tin trường họ tên
   */
  validFullName(): void {
    this.errMsgFullName = '';
    if (!this.fullName || (this.fullName && this.fullName !== null && this.fullName.trim() === '')) {
      this.errMsgFullName = 'Họ và tên không được để trống';
      this.isCheckError = true;
      return;
    }
  }
  /**
   * Dùng Regex chặn ký tự đặc biệt trường họ tên theo yêu cầu
   */
  fullNameInputChange(event: { target: { value: string; }; }): void {
    if (event.target.value && event.target.value !== null && event.target.value.trim() === '') {
      this.fullName = event.target.value = event.target.value.trim();
    } else {
      this.fullName = event.target.value.replace(RG_FULLNAME_CORE, '');
    }
    this.fullName = this.fullName.toUpperCase();
  }

  mobileInputChange(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  taxInputChange(event): void {
    if (event.target.value && event.target.value !== null) {
      this.taxCode = event.target.value = event.target.value.trim();
    }
  }
  /**
   * edit tại row cần sửa trên bảng
   */
  editData(i: number): void {
    this.fillDataToForm(i);
    this.isOnlyView = false;
  }
  /**
   * close màn hinh
   */
  complate(): void {
    this.complateGuardian.emit(false);
  }

  dateOfBirthChanged(): void {
    this.validateDateOfBirth();
  }
  /**
   * khởi tạo mặc định đỉa chỉ là viêt nam
   */
  initAddress(): void {
    setTimeout(() => {
      this.objCurrentAddress = {
        currentCountryCode: 'VN',
        currentCountryName: '',
        currentCityName: '',
        currentDistrictName: '',
        currentWardName: '',
        currentStreetNumber: ''
      };
    }, 1);
  }

  fillDataViewOnly(i: number): void {
    this.fillDataToForm(i);
    this.isOnlyView = true;
  }

  fillDataToForm(i: number): void {
    if (this.guardians != null && this.guardians.length !== 0) {
      this.prositonEdit = i;
      this.isShowAddGuardian = true;
      this.guardians.map((e, index) => {
        if (i === index) {
          this.fillDataRelationship(e.guardianRelationCode);
          this.fillData(e.customer.person);
          // mã cif khách hàng
          this.cifCode = e.customer.customerCode;
          // remove message lỗi khi fill ngược data
          this.removeMsgError();
        }
      });
    } else {
      this.isShowAddGuardian = false;
    }
  }

  blurDateOfBirth(evt: any): void {
    if (!this.dpDateOfBirth.haveValue()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được để trống');
    }
  }
}
