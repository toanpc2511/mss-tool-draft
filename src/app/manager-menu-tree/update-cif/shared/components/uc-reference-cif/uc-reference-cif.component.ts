import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import * as moment from 'moment';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { addressDefaultVietNam, cifGenderOption } from 'src/app/shared/constants/cif/cif-constants';
import { listRelationships, listVerificationDocs, PREFIX_MOBILE_NUMBER } from 'src/app/shared/constants/constants';
import { ONLY_NUMBER_REGEX, RG_FULLNAME, RG_FULLNAME_CORE, STR_NOT_SPEC_CHARACTER } from 'src/app/shared/constants/regex.utils';
import { compareDate } from 'src/app/shared/constants/utils';

@Component({
  selector: 'app-uc-reference-cif',
  templateUrl: './uc-reference-cif.component.html',
  styleUrls: ['./uc-reference-cif.component.scss']
})
export class UcReferenceCifComponent implements OnInit {

  @ViewChild('dpDateOfBirth', { static: false }) dpDateOfBirth: LpbDatePickerComponent;  // Ngày sinh
  @ViewChild('dpDateSupplyFirst', { static: false }) dpDateSupplyFirst: LpbDatePickerComponent;
  @ViewChild('refScroll', { static: false }) refScroll: ElementRef; // scroll nếu edit
  @ViewChild('refocus', { static: false }) refocus: ElementRef; // focus nếu edit

  isDeleteRow = false; // kiểm tra nếu row cần xóa
  positionDelete = -1; // khởi tạo vị trí cấn xóa trên bảng
  prositonEdit = -1; // khởi tạo vị trí cần edit trên bảng
  referenceCifs = []; // danh sách người đại diện pháp luật thêm mới
  cifCode = ''; // mã cif
  lstRelationship = listRelationships;
  typeCustomer = ''; // loại tìm kiếm khách hàng
  codeCustomer = ''; // mã loại tìm kiếm khách hàng
  lstCountry = [];
  errMsgSearchCustomer = ''; // Thông báo lỗi tìm kiếm khách hàng
  isListCustomer = false;
  customers = []; // danh sách khách hàng
  isShowAddReferenceCif = false; // hiển thỉ form tạo mới
  msgEmpty: string; // hiện thỉ nếu không có dữ liệu
  typeParamSearch = {  // select loại tìm kiếm customer
    cif: 'CIF',
    phone: 'PHONE'
  };
  initValueVerifyDocs = '' || null; // khởi tạo  giá trị ban đầu của giấy tờ xác minh
  inEffect = false;
  isShowEffect = false;
  readonly confim = {  //  thực hiện xóa hay là hủy xóa trên bảng
    CANCEL: 'CANCEL',
    CONFIM: 'CONFIM',
  };
  objRelationship: any = {};
  errMsgProvideByFirst = '';  // Thông báo lỗi nơi cấp GTXM
  identifyAddress = '';  // Nơi cấp GTXM
  allowEditProvideByFirst = true;
  verifyNumberDocsFirst = ''; // Số GTXM
  errMsgVerifyNumberDocsFirst = ''; // Thông báo lỗi số GTXM
  inpDateOfBirth: moment.MomentInput;  // Ngày sinh để check validate GTXM
  inpNationality: string; // Quốc tịch 1 để check Validate loại GTXM. Nếu Quốc tịch  khác Việt Nam => Loại GTXM chỉ là hộ chiếu
  errMsgTypeVerifyDocsFirst = ''; // loại giấy tờ xác minh
  perDocTypeCode = '' || null; // Loại GTXM
  selectedNationality: any = addressDefaultVietNam; // Lựa chọn quốc tịch 1, default Việt Nam
  fullName = ''; // Họ và tên
  typeRelationship = '';  // Mã mối quan hệ
  genderCode = 'M'; // Giới tính
  age = 0; // khởi tạo tuổi ban đầu
  mobileNo = ''; // số Điện thoại
  errMsgFullName = ''; // Thông báo lỗi họ tên
  errMsgMobileNo = ''; // Thông báo lỗi số điện thoại
  isOnlyView = false; // tham số check edit và chỉ view
  objTypeCustomer: { cif?: any; uidValue?: any; phone?: any; uidName?: any; };
  isCheckError: boolean; //  kiểm tra  giá trị hợp lệ của
  lstGender = cifGenderOption;  // Danh sách giới tính
  errMsgRelationship = ''; // thông báo lỗi mối quan hệ
  errMsgSupplyDateFirst = '';   // Thông báo lỗi ngày cấp GTXM
  readonly lstVerifyDocs = [
    { code: 'CAN CUOC CONG DAN', name: 'Căn cước công dân' },
    { code: 'CHUNG MINH NHAN DAN', name: 'Chứng minh nhân dân' },
    { code: 'HO CHIEU', name: 'Hộ chiếu' },
    { code: 'GIAY KHAI SINH', name: 'Giấy khai sinh' },
    { code: 'QUYET DINH THANH LAP', name: 'Quyết định thành lập' }
  ];
  @Output() nationnalityChange = new EventEmitter<any>();
  @Output() complateReferenceCif = new EventEmitter<any>();
  @Output() sendData = new EventEmitter<any>();
  @Input() inputData: any;

  constructor(
    private helpService: HelpsService,
  ) { }

  ngOnInit(): void {
    this.getCountry();
    this.initData();
  }
  /**
   * chăn nhập space
   */
  dateInputChange(val: string, param: string): void {
    if (param === 'NGAY_SINH') {
      if (val !== null && val.trim() === '') {
        this.dpDateOfBirth.setValue(val.trim());
        this.dpDateOfBirth.setErrorMsg('');
      }
    }
    if (param === 'NGAY_CAP') {
      if (val !== null && val.trim() === '') {
        this.dpDateSupplyFirst.setValue(val.trim());
        this.dpDateSupplyFirst.setErrorMsg('');
        this.identifyAddress = '';
      }
    }

  }
  /**
   * Bắt lỗi thông tin trường họ tên
   */
  validFullName(): void {
    this.errMsgFullName = '';
    if (this.fullName !== null && this.fullName.trim() === '') {
      this.errMsgFullName = 'Họ và tên không được để trống';
      this.isCheckError = true;
      return;
    } else {
      this.fullName = (this.fullName !== null ? this.fullName.trim() : '');
    }
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
   * Dùng Regex chặn ký tự đặc biệt trường họ tên theo yêu cầu
   */
  fullNameInputChange(event: { target: { value: string; }; }): void {
    if (event.target.value !== null && event.target.value.trim() === '') {
      this.fullName = event.target.value.trim();
    } else {
      this.fullName = event.target.value.replace(RG_FULLNAME_CORE, '');
    }
    this.fullName = this.fullName.toUpperCase();
  }
  /**
   * reset all về ban đầu
   */
  resetAttribute(): void {
    this.typeCustomer = '';
    this.codeCustomer = '';
    this.cifCode = '';
    this.fullName = '';
    this.mobileNo = '';
    this.selectedNationality = addressDefaultVietNam;
    this.genderCode = 'M';
    this.perDocTypeCode = '';
    this.verifyNumberDocsFirst = '';
    this.dpDateSupplyFirst.setValue('');
    this.dpDateOfBirth.setValue('');
    this.dpDateOfBirth.setErrorMsg('');
    this.dpDateSupplyFirst.setErrorMsg('');
    this.identifyAddress = '';
    this.typeRelationship = '';
    this.isListCustomer = false;
    this.removeMsgError();
  }
  /**
   * loại bỏ message lỗi hiện thỉ
   */
  removeMsgError(): void {
    this.errMsgTypeVerifyDocsFirst = '';
    this.errMsgSearchCustomer = '';
    this.errMsgSupplyDateFirst = '';
    this.errMsgProvideByFirst = '';
    this.errMsgRelationship = '';
    this.errMsgVerifyNumberDocsFirst = '';
    this.errMsgMobileNo = '';
    this.errMsgFullName = '';
  }
  /**
   * hủy thiết lập tạo mới
   */
  cancelAction(): void {
    this.isOnlyView = false;
    this.isShowAddReferenceCif = false;
    this.resetAttribute();
  }
  /**
   * lưu  dự liệu trên bảng
   */
  saveAction(): void {
    this.isShowAddReferenceCif = true;
    this.isCheckError = false;
    this.validFullName();
    this.validateDateOfBirth();
    this.validatePhoneNumber();
    this.validateRelationship();
    this.validateTypeVerifyDocsFirst();
    this.validateSupplytDateFirst();
    this.validateVerifyNumberDocsFirst();
    this.validateProvideByFirst();
    // nếu data không có lỗi
    if (!this.isCheckError) {
      this.objectTable();
      this.sendDataToRegister();
      this.isShowAddReferenceCif = false;
      this.resetAttribute();
    }
  }
  /**
   * khởi tạo data binding input
   */
  initData(): void {
    // remove binding two way
    this.referenceCifs = this.inputData.map(e => ({ ...e }));
  }
  /**
   * sử dụng chung để tạo request và edit data và thêm mới data và lưu data trên bảng
   */
  objectTable(): void {
    const relationship = this.typeRelationship;
    // lấy  object quan hệ với chủ tài khoản
    if (relationship && relationship !== '') {
      this.objRelationship = this.lstRelationship.find(e => (relationship === e.code));
    }
    // khởi tạo object customer input component parent và hiện thỉ trên bảng
    const referenceCif: any = {
      customerCode: this.cifCode,
      fullName: this.fullName.trim(),
      phoneNumber: this.mobileNo.trim(),
      gender: this.genderCode,
      dateOfBirth: this.dpDateOfBirth.getValue(),
      perDocTypeCode: this.perDocTypeCode,
      identifyDate: this.dpDateSupplyFirst.getValue(),
      identifyCode: this.verifyNumberDocsFirst,
      identifyAddress: this.identifyAddress,
      relationshipType: this.objRelationship.code,
      nationality: (!this.selectedNationality ? null : this.selectedNationality.code),
      inEffect: null
    };

    // kiểm tra xem trong danh sách đã tòn tại hay chưa
    let isCheckEdit = false;
    this.referenceCifs.forEach((e, index) => {
      if (index === this.prositonEdit) {
        if (e.id) {
          referenceCif.id = e.id;
          referenceCif.customerId = e.customerId;
          referenceCif.inEffect = this.inEffect;
        }
        // nêu tồn tại =>  xóa tại vị trí hiện tại
        this.referenceCifs.splice(index, 1);
        this.isShowEffect = true; // hiện thỉ trạng thái nếu là edit
        // push object vào vị trí hiện tại
        this.referenceCifs.splice(index, 0, referenceCif);
        isCheckEdit = true;
        this.prositonEdit = -1;
      }
    });
    // nếu ko phải edit => thêm mới
    if (!isCheckEdit) {
      this.referenceCifs.push(referenceCif);
    }
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
  /**
   * edit tại row cần sửa trên bảng
   */
  editData(i: number): void {
    this.fillDataToForm(i);
    this.isOnlyView = false;

  }
  customerChange(): void {
    this.validSearchCustomer(this.codeCustomer);
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

  fillDataToForm(i: number): void {
    if (this.referenceCifs != null && this.referenceCifs.length !== 0) {
      this.prositonEdit = i;
      this.isShowAddReferenceCif = true;
      setTimeout(() => {
        this.referenceCifs.map((e, index) => {
          if (i === index) {
            this.fillDataRelationship(e.relationshipType);
            this.fillData(e);
            this.fillDataInEffect(e.inEffect);
            // mã cif khách hàng
            this.cifCode = e.customerCode;
            // remove message lỗi khi fill ngược data
            this.removeMsgError();
          }
        });
      }, 1);
    } else {
      this.isShowAddReferenceCif = false;
    }
  }
  /**
   * gán mối quan hệ vơi chủ tài khoản
   */
  fillDataRelationship(relationship: string): void {
    this.typeRelationship = relationship;
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
   * Chỉ nhập số
   */
  mobileInputChange(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
  addNewReferenceCif(): void {
    this.isListCustomer = false;
    this.isOnlyView = false;
    this.isShowEffect = false;
    this.resetAttribute();
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
   *  show khối thêm mới CIF liên quan
   */
  showNewGuardian(): void {
    this.isShowAddReferenceCif = true;
  }

  blurDateOfBirth(evt: any): void {
    if (!this.dpDateOfBirth.haveValue()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được để trống');
    }
  }
  /**
   * gán  giá trị tìm kiếm
   */
  fillData(customerInfo): void {
    // họ và tên
    this.fullName = customerInfo.fullName;
    // ngày sinh
    if (customerInfo.dateOfBirth !== null) {
      this.dpDateOfBirth.setValue(customerInfo.dateOfBirth);
    }
    // số điện thoại (note, this.prositonEdit === -1 là thêm mới, !=-1 là edit )
    this.mobileNo = (this.prositonEdit === -1 ? customerInfo.mobileNo : customerInfo.phoneNumber);
    // giới tính
    this.fillDataGender(customerInfo);
    // giấy tờ xác minh
    this.fillDataPerDocNoList(customerInfo);
    // quốc tịch
    this.fillDataNationality(customerInfo);
    // trạng thái
    this.fillDataInEffect(customerInfo);
  }
  /**
   * gán giới tính
   */
  fillDataGender(customerInfo: { genderCode: any; } | any): void {
    this.lstGender.forEach((e: any) => {
      if (e.code === customerInfo.genderCode) {
        this.genderCode = (this.prositonEdit === -1 ? customerInfo.genderCode : customerInfo.gender);
      }
    });
  }

  nationalityFirstChange(evt: any): void {
    this.selectedNationality = evt;
    this.validateNationality();
    this.nationnalityChange.emit(evt);
  }

  validateNationality(): void {
    if ((this.selectedNationality.code !== 'VN' && this.perDocTypeCode === 'HO CHIEU') || this.selectedNationality.code === 'VN') {
      this.errMsgTypeVerifyDocsFirst = '';
    }
    if (this.selectedNationality.code !== 'VN' && this.perDocTypeCode !== 'HO CHIEU'
      && this.perDocTypeCode !== 'QUYET DINH THANH LAP' && this.perDocTypeCode !== '') {
      this.errMsgTypeVerifyDocsFirst = 'Vui lòng chọn Loại GTXM là Hộ chiếu';
      return;
    }
  }

  /**
   * gán quốc tịch
   */
  fillDataNationality(customerInfo: { nationality1Code: any; nationality: any }): void {
    this.selectedNationality = (this.prositonEdit === -1 ? { code: customerInfo.nationality1Code } : { code: customerInfo.nationality });
  }
  /**
   * gán giấy tờ xác minh
   */
  fillDataPerDocNoList(customerInfo: { perDocNoList: string | any[]; } | any): void {
    // trường hợp thêm mới
    if (this.prositonEdit === -1) {
      this.perDocTypeCode = customerInfo.perDocNoList[0].perDocTypeCode;
      this.verifyNumberDocsFirst = customerInfo.perDocNoList[0].perDocNo;
      this.dpDateSupplyFirst.setValue(customerInfo.perDocNoList[0].issueDate);
      this.identifyAddress = customerInfo.perDocNoList[0].issuePlace;
    } else {
      // trường hợp edit
      this.perDocTypeCode = customerInfo.perDocTypeCode;
      this.verifyNumberDocsFirst = customerInfo.identifyCode;
      this.dpDateSupplyFirst.setValue(customerInfo.identifyDate);
      this.identifyAddress = customerInfo.identifyAddress;
    }
  }

  dateOfBirthChanged(): void {
    this.validateDateOfBirth();
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
    if (tmpDate.toDate().getTime() < moment('01/01/1920').toDate().getTime()) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được xa hơn 01/01/1920');
      this.isCheckError = true;
      return;
    }
    this.age = moment().diff(tmpDate, 'years');
    if (this.age > 120) {
      this.dpDateOfBirth.setErrorMsg('Ngày sinh không được lớn hơn 120 tuổi');
      this.isCheckError = true;
      return;
    } else if (this.age === 120) {
      if (tmpDate.month() < new Date().getMonth() || tmpDate.date() < new Date().getDate()) {
        this.dpDateOfBirth.setErrorMsg('Ngày sinh không được lớn hơn 120 tuổi');
        this.isCheckError = true;
        return;
      }
    }
  }
  onChangeDocsTypeFirst(val: string): void {
    this.identifyAddress = '';
    this.perDocTypeCode = val;
    this.verifyNumberInputChange(this.verifyNumberDocsFirst);
    this.validateTypeVerifyDocsFirst();
    this.validateVerifyNumberDocsFirst();
    this.validateSupplytDateFirst();
    this.setProvideByFirst();
  }
  /**
   * Fill giá trị nơi cấp mặc định
   * Nếu người dùng chọn loại giấy tờ xác minh
   */
  setProvideByFirst(): void {
    const typeVerifyDocsFirst = this.perDocTypeCode;
    if (typeVerifyDocsFirst === 'CAN CUOC CONG DAN') {
      this.identifyAddress = '';
      this.allowEditProvideByFirst = false;
      if (this.dpDateSupplyFirst.haveValue() !== '') {
        const spDate = this.dpDateSupplyFirst.getValue();
        // tslint:disable-next-line:max-line-length
        if (compareDate(spDate, moment('01/01/2016', 'DD/MM/YYYY')) > -1 && compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) > 0) {
          this.identifyAddress = 'CCS ĐKQL CT và DLQG về DC';
        }
        if (spDate !== '' && (compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) === -1 || compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) === 0)) {
          this.identifyAddress = 'CCS QLHC về TTXH';
        }
      }
    } else {
      this.allowEditProvideByFirst = true;
      if (typeVerifyDocsFirst === 'CHUNG MINH NHAN DAN' || typeVerifyDocsFirst === 'GIAY KHAI SINH') {
        const cityName = JSON.parse(localStorage.getItem('userInfo')).cityName;
        if (this.identifyAddress === '') {
          this.identifyAddress = 'CÔNG AN ' + cityName;
        }
      } else {
        if (this.identifyAddress === '') {
          this.identifyAddress = 'Cục Quản lý XNC';
        }
      }
    }
    this.validateProvideByFirst();
  }
  /**
   * close màn hinh
   */
  complate(): void {
    this.complateReferenceCif.emit(false);
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
  /**
   * đóng popup tìm kiếm
   */
  close(): void {
    this.isListCustomer = false;
  }
  validateProvideByFirst(): void {
    this.errMsgProvideByFirst = '';
    if (this.identifyAddress === '') {
      this.errMsgProvideByFirst = 'Nơi cấp không được để trống';
      this.isCheckError = true;
      return;
    }
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

  supplyDateFirstChange(): void {
    this.validateSupplytDateFirst();
    this.setProvideByFirst();
  }

  supplyDateFirstBlur(): void {
    this.validateSupplytDateFirst();
    this.setProvideByFirst();
  }

  validateTypeVerifyDocsFirst(): void {
    this.errMsgTypeVerifyDocsFirst = '';
    if (!this.perDocTypeCode) {
      this.errMsgTypeVerifyDocsFirst = 'Loại GTXM bắt buộc chọn';
      this.isCheckError = true;
      return;
    }
    const typeDocs = this.perDocTypeCode;
    this.inpNationality = this.selectedNationality.code;
    if (this.inpNationality !== 'VN' && (typeDocs !== 'HO CHIEU' && typeDocs !== 'QUYET DINH THANH LAP')) {
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
   * thực hiện xóa hay hủy
   */
  confimRemoveData(param: any): void {
    switch (param) {
      case this.confim.CANCEL:
        this.isDeleteRow = false;
        break;
      case this.confim.CONFIM:
        if (this.referenceCifs != null && this.referenceCifs.length !== 0) {
          this.referenceCifs.map((e, index) => {
            // xóa tại vị trí hiện tại
            if (this.positionDelete === index) {
              this.referenceCifs.splice(this.positionDelete, 1);
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
   * gán tình trạng hiệu lực hay không hiệu lực
   */
  fillDataInEffect(inEffect): void {
    this.inEffect = inEffect;
    if (this.inEffect !== null) {
      this.isShowEffect = true;
    } else {
      this.isShowEffect = false;
    }
  }
  /**
   * gửi data  tơi màn hình cha
   */
  sendDataToRegister(): void {
    const referenceCif = {
      isReference: true,
      referenceCifs: this.referenceCifs,
    };
    this.sendData.emit(referenceCif);
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
   *  chỉ view data
   */
  fillDataViewOnly(i: number): void {
    this.fillDataToForm(i);
    this.isOnlyView = true;
  }
  /**
   *  loại bỏ character đặc biệt
   */
  verifyNumberInputChange(val: string): void {
    if (this.perDocTypeCode === 'CAN CUOC CONG DAN' || this.perDocTypeCode === 'CHUNG MINH NHAN DAN') {
      if (val !== null && val.trim() === '') {
        this.verifyNumberDocsFirst = val.trim();
      } else {
        this.verifyNumberDocsFirst = val.replace(RG_FULLNAME, '');
      }
    }
  }
}
