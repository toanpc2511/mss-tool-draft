import { ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { listVerificationDocs } from 'src/app/shared/constants/constants';
import * as moment from 'moment';
import { ONLY_NUMBER_REGEX, RG_FULLNAME, STR_NOT_SPEC_CHARACTER } from 'src/app/shared/constants/regex.utils';
import { compareDate } from 'src/app/shared/constants/utils';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';

@Component({
  selector: 'app-account-owner-verify-docs',
  templateUrl: './account-owner-verify-docs.component.html',
  styleUrls: ['./account-owner-verify-docs.component.scss']
})
export class AccountOwnerVerifyDocsComponent implements OnInit, OnChanges {

  @Input() perDocNoListFromServe;
  @Input() inpDateOfBirth;  // Ngày sinh để check validate GTXM
  @Input() inpNationality; // Quốc tịch 1 để check Validate loại GTXM. Nếu Quốc tịch 1 khác Việt Nam => Loại GTXM chỉ là hộ chiếu
  @Input() provinceUser;
  @Input() isExistCore;

  lstVerifyDocs = listVerificationDocs;
  // Khối GTXM 1
  @ViewChild('dpDateSupplyFirst', { static: true }) dpDateSupplyFirst: LpbDatePickerComponent;  // Ngày cấp GTXM 1
  @ViewChild('dpExpDateFirst', { static: true }) dpExpDateFirst: LpbDatePickerComponent;  // Ngày hết hiệu lực GTXM 1
  @ViewChild('typeVerifyDocsFirst', { static: true }) typeVerifyDocsFirst: ElementRef;  // Loại GTXM 1

  isShowDocsFirst = true;
  isRequireExpDateFirst = true;
  verifyNumberDocsFirst = ''; // Số GTXM 1
  provideByFirst = '';  // Nơi cấp GTXM 1
  errMsgTypeVerifyDocsFirst = ''; // Thông báo lỗi loại GTXM 1
  errMsgVerifyNumberDocsFirst = ''; // Thông báo lỗi số GTXM 1
  errMsgSupplyDateFirst = '';   // Thông báo lỗi ngày cấp GTXM 1
  errMsgExpDateFirst = '';  // Thông báo lỗi ngày hêt hiệu lực GTXM 1
  errMsgProvideByFirst = '';  // Thông báo lỗi nơi cấp GTXM 1
  errMsgBlockVerifyDocsFirst = ''; // Thông báo lỗi chung cho khối GTXM 1

  // Khối GTXM 2
  @ViewChild('dpDateSupplySecond', { static: true }) dpDateSupplySecond: LpbDatePickerComponent;  // Ngày cấp GTXM 2
  @ViewChild('dpExpDateSecond', { static: true }) dpExpDateSecond: LpbDatePickerComponent;  //  Ngày hết hiệu lực GTXM 2
  @ViewChild('typeVerifyDocsSecond', { static: true }) typeVerifyDocsSecond: ElementRef;  // Loại GTXM 2
  isShowDocsSecond = false; // Có hiển thị khối GTXM 2?
  isRequireExpDateSecond = true;
  verifyNumberDocsSecond = '';
  provideBySecond = '';
  errMsgTypeVerifyDocsSecond = ''; // Thông báo lỗi loại GTXM 2
  errMsgVerifyNumberDocsSecond = '';
  errMsgSupplyDateSecond = '';
  errMsgExpDateSecond = '';
  errMsgProvideBySecond = '';
  errMsgBlockVerifyDocsSecond = ''; // Thông báo lỗi chung cho khối GTXM 2
  perDocNoList = [];
  // Khối GTXM 3
  @ViewChild('dpDateSupplyThird', { static: true }) dpDateSupplyThird: LpbDatePickerComponent;  // Ngày cấp GTXM 3
  @ViewChild('dpExpDateThird', { static: true }) dpExpDateThird: LpbDatePickerComponent;  // Ngày hết hiệu lực GTXM 3
  @ViewChild('typeVerifyDocsThird', { static: true }) typeVerifyDocsThird: ElementRef;  // Loại GTXM 3
  isShowDocsThird = false; // Có hiển thị khối GTXM 3?
  isRequireExpDateThird = true;
  verifyNumberDocsThird = '';
  provideByThird = '';
  errMsgTypeVerifyDocsThird = ''; // Thông báo lỗi loại GTXM 3
  errMsgVerifyNumberDocsThird = '';
  errMsgSupplyDateThird = '';
  errMsgExpDateThird = '';
  errMsgProvideByThird = '';
  errMsgBlockVerifyDocsThird = ''; // Thông báo lỗi chung cho khối GTXM 3

  currentDate = moment(); // Ngày hiện tại
  errMsgCommonVerifyDocs = '';
  constructor(
    private helpService: HelpsService,
    private ckr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  /** Đổ dữ liệu GTXM
   *
   */
  fillDataPerDocNoList(): void {
    // console.log(this.perDocNoList);
    if (this.perDocNoList.length > 0) {
      let count = 0;
      this.perDocNoList.forEach(el => {
        if (count === 0) {
          this.isShowDocsFirst = true;
          this.typeVerifyDocsFirst.nativeElement.value = el.perDocTypeCode;
          this.expDateChecking('FIRST');
          this.verifyNumberDocsFirst = el.perDocNo;
          this.dpDateSupplyFirst.setValue(el.issueDate);
          this.provideByFirst = el.issuePlace ? el.issuePlace : '';
          this.dpExpDateFirst.setValue(el.expireDate ? el.expireDate : '');
        }
        if (count === 1) {
          this.isShowDocsSecond = true;
          this.typeVerifyDocsSecond.nativeElement.value = el.perDocTypeCode;
          this.expDateChecking('SECOND');
          this.verifyNumberDocsSecond = el.perDocNo;
          this.dpDateSupplySecond.setValue(el.issueDate);
          this.provideBySecond = el.issuePlace ? el.issuePlace : '';
          this.dpExpDateSecond.setValue(el.expireDate ? el.expireDate : '');
        }
        if (count === 2) {
          this.isShowDocsThird = true;
          this.typeVerifyDocsThird.nativeElement.value = el.perDocTypeCode;
          this.expDateChecking('THIRD');
          this.verifyNumberDocsThird = el.perDocNo;
          this.dpDateSupplyThird.setValue(el.issueDate);
          this.provideByThird = el.issuePlace ? el.issuePlace : '';
          this.dpExpDateThird.setValue(el.expireDate ? el.expireDate : '');
        }
        count += 1;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.perDocNoListFromServe) {
      this.perDocNoList = this.getCopyList(this.perDocNoListFromServe);
      this.fillDataPerDocNoList();
      this.ckr.detectChanges();
    }
    if (changes.inpDateOfBirth && changes.inpDateOfBirth.previousValue) {
      this.validateTypeVerifyDocsFirst();
      this.validateSupplytDateFirst();
      this.setExpDateFirstByBirthDate();
      this.validateExpDateFirst();
      if (this.isShowDocsSecond) {
        this.validateTypeVerifyDocsSecond();
        this.validateSupplyDateSecond();
        this.setExpDateSecondByBirthDate();
        this.validateExpDateSecond();
      }
      if (this.isShowDocsThird) {
        this.validateTypeVerifyDocsThird();
        this.validateSupplyDateThird();
        this.setExpDateThirdByBirthDate();
        this.validateExpDateThird();
      }
    }
    if (changes.inpNationality && !changes.inpNationality.firstChange) {
      this.expDateChecking('FIRST');
      this.validateTypeVerifyDocsFirst();
      this.supplyDateFirstBlur();
      this.supplyDateFirstChange();
      if (this.isShowDocsSecond) {
        this.expDateChecking('SECOND');
        this.validateTypeVerifyDocsSecond();
        this.supplyDateSecondBlur();
        this.supplyDateSecondChange();
      }
      if (this.isShowDocsThird) {
        this.expDateChecking('THIRD');
        this.validateTypeVerifyDocsThird();
        this.supplyDateThirdBlur();
        this.supplyDateThirdChange();
      }
    }
  }
  /**
   * Xử lý Khối GTXM 1
   */
  onChangeDocsTypeFirst(val): void {
    this.typeVerifyDocsFirst.nativeElement.value = val;
    this.provideByFirst = '';
    this.expDateChecking('FIRST');
    this.validateTypeVerifyDocsFirst();
    this.validateVerifyNumberDocsFirst();
    this.validateSupplytDateFirst();
    this.setProvideByFirst();
    this.setExpDateFirstByBirthDate();
    if (this.dpDateSupplyFirst.haveValidDate()) {
      this.setExpDateBysupplyDateFirst();
    }
    this.validateExpDateFirst();
  }
  validateTypeVerifyDocsFirst(): void {
    this.errMsgTypeVerifyDocsFirst = '';
    if (!this.isExistCore) {
      if (!this.typeVerifyDocsFirst.nativeElement.value) {
        this.errMsgTypeVerifyDocsFirst = 'Loại GTXM không được để trống';
        return;
      }
      const typeDocs = this.typeVerifyDocsFirst.nativeElement.value;
      if (this.inpNationality !== 'VN' && typeDocs !== 'HO CHIEU') {
        this.errMsgTypeVerifyDocsFirst = 'Vui lòng chọn Loại GTXM là Hộ chiếu';
        return;
      }
      if (this.inpDateOfBirth && moment().diff(this.inpDateOfBirth, 'years') < 14 && (typeDocs === 'CAN CUOC CONG DAN' || typeDocs === 'CHUNG MINH NHAN DAN')) {
        this.errMsgTypeVerifyDocsFirst = 'GTXM phải là Hộ chiếu hoặc Giấy khai sinh';
        return;
      }
    }
  }
  validateVerifyNumberDocsFirst(): void {
    const typeVerifyDocsFirst = this.typeVerifyDocsFirst.nativeElement.value;
    this.errMsgVerifyNumberDocsFirst = '';
    if (this.verifyNumberDocsFirst === '') {
      this.errMsgVerifyNumberDocsFirst = 'Số GTXM không được để trống';
      return;
    }
    if (this.verifyNumberDocsFirst.match(STR_NOT_SPEC_CHARACTER)) {
      this.errMsgVerifyNumberDocsFirst = 'Số GTXM không được chứa ký tự đặc biệt';
      return;
    }
    if (typeVerifyDocsFirst === 'CHUNG MINH NHAN DAN') {
      if ((this.verifyNumberDocsFirst.length !== 9 && this.verifyNumberDocsFirst.length !== 12)
        || this.verifyNumberDocsFirst.match(ONLY_NUMBER_REGEX)) {
        this.errMsgVerifyNumberDocsFirst = 'Chứng minh nhân dân phải là 9 hoặc 12 ký tự số';
        return;
      }
    }
    if (typeVerifyDocsFirst === 'CAN CUOC CONG DAN') {
      if (this.verifyNumberDocsFirst.length !== 12 || this.verifyNumberDocsFirst.match(ONLY_NUMBER_REGEX)) {
        this.errMsgVerifyNumberDocsFirst = 'Căn cước công dân phải là 12 ký tự số';
        return;
      }
    }
    if (typeVerifyDocsFirst === 'HO CHIEU' && typeVerifyDocsFirst === 'GIAY KHAI SINH') {
      if (this.verifyNumberDocsFirst.match(RG_FULLNAME)) {
        this.errMsgVerifyNumberDocsFirst = 'GTXM không chứa ký tự đặc biệt';
        return;
      }
    }
    if (this.verifyNumberDocsFirst === this.verifyNumberDocsThird) {
      this.errMsgVerifyNumberDocsFirst = 'GTXM 1 trùng GTXM 3';
      return;
    }
    if (this.verifyNumberDocsSecond === this.verifyNumberDocsFirst) {
      this.errMsgVerifyNumberDocsFirst = 'GTXM 1 trùng GTXM 2';
      return;
    }
    this.searchNumberVerifyDocs(this.verifyNumberDocsFirst, data => {
      if (data.length > 0 && !this.isExistCore) {
        this.errMsgVerifyNumberDocsFirst = 'GTXM số ' +
          this.verifyNumberDocsFirst +
          ' trùng với KH: ' +
          (data[0].FULL_NAME ? data[0].FULL_NAME : '') +
          ' - CIF: ' +
          (data[0].CUSTOMER_NO ? data[0].CUSTOMER_NO : '') +
          ' - CN: ' +
          (data[0].BRANCH_NAME ? data[0].BRANCH_NAME : '') +
          ' - Loại GTXM: ' +
          (data[0].UID_NAME ? data[0].UID_NAME : '');
      }
      return;
    });
  }
  setExpDateFirstByBirthDate(): void {

    if (this.inpDateOfBirth) {
      const tempcurentDate = moment(this.currentDate, 'DD/MM/YYYY').format('DD/MM/YYYY');

      // tslint:disable-next-line:align
      const tempDateOne = moment(this.inpDateOfBirth, 'DD/MM/YYYY').add(25, 'years').format('DD/MM/YYYY');
      const tempDateTwo = moment(this.inpDateOfBirth, 'DD/MM/YYYY').add(40, 'years').format('DD/MM/YYYY');
      const tempDateThird = moment(this.inpDateOfBirth, 'DD/MM/YYYY').add(60, 'years').format('DD/MM/YYYY');
      const dateOfBirth = moment(this.inpDateOfBirth, 'DD/MM/YYYY');
      if (this.typeVerifyDocsFirst.nativeElement.value === 'CAN CUOC CONG DAN' && this.inpNationality === 'VN') {
        if (compareDate(tempcurentDate, tempDateOne) === -1) {
          this.dpExpDateFirst.setValue(moment(dateOfBirth.add(25, 'years')).format('DD/MM/YYYY'));
          return;
        }
        if (compareDate(tempcurentDate, tempDateTwo) === -1) {
          this.dpExpDateFirst.setValue(moment(dateOfBirth.add(40, 'years')).format('DD/MM/YYYY'));
          return;
        }
        if (compareDate(tempcurentDate, tempDateThird) === -1) {
          this.dpExpDateFirst.setValue(moment(dateOfBirth.add(60, 'years')).format('DD/MM/YYYY'));
          return;
        }
      }
    }
    this.validateExpDateFirst();
  }
  setExpDateBysupplyDateFirst(): void {
    const supplyDateFirst = moment(this.dpDateSupplyFirst.getValue(), 'DD/MM/YYYY');
    if (!supplyDateFirst) { return; }
    const getIssueYear = moment(supplyDateFirst, 'DD/MM/YYYY');

    const issueYear = getIssueYear.year();
    if (this.dpDateSupplyFirst.getValue() === '') {
      this.dpExpDateFirst.setValue('');
      return;
    }
    if (this.typeVerifyDocsFirst.nativeElement.value === 'CHUNG MINH NHAN DAN') {
      this.dpExpDateFirst.setValue(moment(supplyDateFirst.year(issueYear + 15)).format('DD/MM/YYYY'));
      return;
    }
    if (this.typeVerifyDocsFirst.nativeElement.value === 'HO CHIEU' && this.inpNationality === 'VN') {
      this.dpExpDateFirst.setValue(moment(supplyDateFirst).year(issueYear + 10).format('DD/MM/YYYY'));
      return;
    }
  }
  supplyDateFirstBlur(): void {
    this.validateSupplytDateFirst();
    this.setProvideByFirst();
    this.setExpDateBysupplyDateFirst();
    this.validateExpDateFirst();
  }
  supplyDateFirstChange(): void {
    this.validateSupplytDateFirst();
    this.setProvideByFirst();
    this.setExpDateBysupplyDateFirst();
    this.validateExpDateFirst();
  }
  validateSupplytDateFirst(): void {
    this.dpDateSupplyFirst.setErrorMsg('');
    const contentInput = this.dpDateSupplyFirst.haveValue() ? this.dpDateSupplyFirst.getValue() : '';
    if (!this.isExistCore) {
      if (contentInput === '') {
        this.dpDateSupplyFirst.setErrorMsg('Ngày cấp không được để trống');
        return;
      }
      if (!this.dpDateSupplyFirst.haveValidDate()) {
        this.dpDateSupplyFirst.setErrorMsg('Ngày cấp sai định dạng');
        return;
      }
      const tmpDate = moment(this.dpDateSupplyFirst.getSelectedDate(), 'DD/MM/YYYY');
      if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
        this.dpDateSupplyFirst.setErrorMsg('Ngày cấp không được chọn ngày tương lai');
        return;
      }
      if (tmpDate.toDate().getTime() < moment('01/01/1920').toDate().getTime()) {
        this.dpDateSupplyFirst.setErrorMsg('Ngày cấp không được xa hơn 01/01/1920');
        return;
      }
      const typeVerifyDocsFirst = this.typeVerifyDocsFirst.nativeElement.value;
      if ((typeVerifyDocsFirst === 'CAN CUOC CONG DAN' || typeVerifyDocsFirst === 'CHUNG MINH NHAN DAN') && tmpDate &&
        this.inpDateOfBirth && tmpDate.diff(this.inpDateOfBirth, 'years') < 14) {
        this.dpDateSupplyFirst.setErrorMsg('Ngày cấp không hợp lệ');
        return;
      }
      if (typeVerifyDocsFirst === 'CAN CUOC CONG DAN' && compareDate(moment('01/01/2016', 'DD/MM/YYYY'), tmpDate) === 1) {
        this.errMsgSupplyDateFirst = 'Ngày cấp không được xa hơn 01/01/2016';
        this.dpDateSupplyFirst.setErrorMsg('Ngày cấp không được xa hơn 01/01/2016');
        return;
      }
    }
  }
  /**
   * Fill giá trị nơi cấp mặc định
   * Nếu người dùng chọn loại giấy tờ xác minh
   */
  setProvideByFirst(): void {
    const typeVerifyDocsFirst = this.typeVerifyDocsFirst.nativeElement.value;
    if (typeVerifyDocsFirst === 'CAN CUOC CONG DAN') {
      if (this.dpDateSupplyFirst.haveValue() !== '') {
        const spDate = this.dpDateSupplyFirst.getValue();
        // tslint:disable-next-line:max-line-length
        if (compareDate(spDate, moment('01/01/2016', 'DD/MM/YYYY')) > -1 && compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) === 1) {
          this.provideByFirst = 'CCS ĐKQL CT và DLQG về DC';
        }
        // console.log(compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate));
        if (compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) <= 0) {
          this.provideByFirst = 'CCS QLHC về TTXH';
        }
      }
    } else {
      if (typeVerifyDocsFirst === 'CHUNG MINH NHAN DAN' || typeVerifyDocsFirst === 'GIAY KHAI SINH') {
        if (this.provideByFirst === '') {
          this.provideByFirst = 'Công an ' + (this.provinceUser ? this.provinceUser : '');
        }
      } else {
        if (this.provideByFirst === '') {
          this.provideByFirst = 'Cục Quản lý XNC';
        }
      }
    }
    this.validateProvideByFirst();
  }
  validateProvideByFirst(): void {
    this.errMsgProvideByFirst = '';
    if (this.provideByFirst === '') {
      this.errMsgProvideByFirst = 'Nơi cấp không được để trống';
      return;
    }
  }
  validateExpDateFirst(): void {
    this.dpExpDateFirst.setErrorMsg('');
    const contentInputDate = this.dpExpDateFirst.haveValue() ? this.dpExpDateFirst.getValue() : '';
    if (!this.isExistCore) {
      if (contentInputDate === '' && !this.isRequireExpDateFirst) {
        this.dpExpDateFirst.setErrorMsg('Ngày hết hiệu lực không được để trống');
        return;
      }
      if (this.dpExpDateFirst.haveValue() && !this.dpExpDateFirst.haveValidDate()) {
        this.dpExpDateFirst.setErrorMsg('Ngày hết hiệu lực sai định dạng');
        return;
      }
      if (this.dpDateSupplyFirst.haveValidDate() &&
        this.dpExpDateFirst.haveValidDate() &&
        compareDate(this.dpDateSupplyFirst.getSelectedDate(), this.dpExpDateFirst.getSelectedDate()) === 1) {
        this.dpExpDateFirst.setErrorMsg('Ngày hết hiệu lực phải lớn hơn ngày cấp');
        return;
      }
    }
  }
  /**
   * Xử lý Khối GTXM 2
   */
  supplyDateSecondBlur(): void {
    this.validateSupplyDateSecond();
    this.setProvideBySecond();
    this.setExpDateBysupplyDateSecond();
    this.validateExpDateSecond();
  }
  supplyDateSecondChange(): void {
    this.validateSupplyDateSecond();
    this.setProvideBySecond();
    this.setExpDateBysupplyDateSecond();
    this.validateExpDateSecond();
  }
  validateSupplyDateSecond(): void {
    this.dpDateSupplySecond.setErrorMsg('');
    const contentInput = this.dpDateSupplySecond.haveValue() ? this.dpDateSupplySecond.getValue() : '';
    if (!this.isExistCore) {
      if (contentInput === '') {
        this.dpDateSupplySecond.setErrorMsg('Ngày cấp không được để trống');
        return;
      }
      if (!this.dpDateSupplySecond.haveValidDate()) {
        this.dpDateSupplySecond.setErrorMsg('Ngày cấp sai định dạng');
        return;
      }
      const tmpDate = moment(this.dpDateSupplySecond.getSelectedDate(), 'DD/MM/YYYY');
      if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
        this.dpDateSupplySecond.setErrorMsg('Ngày cấp không được chọn ngày tương lai');
        return;
      }
      if (tmpDate.toDate().getTime() < moment('01/01/1920').toDate().getTime()) {
        this.dpDateSupplySecond.setErrorMsg('Ngày cấp không được xa hơn 01/01/1920');
        return;
      }
      const typeVerifyDocsSecond = this.typeVerifyDocsSecond.nativeElement.value;
      if ((typeVerifyDocsSecond === 'CAN CUOC CONG DAN' || typeVerifyDocsSecond === 'CHUNG MINH NHAN DAN') && tmpDate &&
        this.inpDateOfBirth && tmpDate.diff(this.inpDateOfBirth, 'years') < 14) {
        this.dpDateSupplySecond.setErrorMsg('Ngày cấp không hợp lệ');
        return;
      }
      if (typeVerifyDocsSecond === 'CAN CUOC CONG DAN' && compareDate(moment('01/01/2016', 'DD/MM/YYYY'), tmpDate) === 1) {
        this.dpDateSupplySecond.setErrorMsg('Ngày cấp không được xa hơn 01/01/2016');
        return;
      }
    }
  }
  onChangeDocsTypeSecond(val): void {
    this.typeVerifyDocsSecond.nativeElement.value = val;
    this.provideBySecond = '';
    this.expDateChecking('SECOND');
    this.validateTypeVerifyDocsSecond();
    this.validateVerifyNumberDocsSecond();
    this.validateSupplyDateSecond();
    this.setProvideBySecond();
    this.setExpDateSecondByBirthDate();
    this.validateExpDateSecond();
    if (this.dpDateSupplySecond.haveValidDate()) {
      this.setExpDateBysupplyDateSecond();
    }
    // this.compareTypeVerifyDocs();
  }
  validateTypeVerifyDocsSecond(): void {
    this.errMsgTypeVerifyDocsSecond = '';
    if (!this.isExistCore) {
      if (!this.typeVerifyDocsSecond.nativeElement.value) {
        this.errMsgTypeVerifyDocsSecond = 'Loại GTXM không được để trống';
        return;
      }
      const typeDocs = this.typeVerifyDocsSecond.nativeElement.value;
      // tslint:disable-next-line: no-string-literal
      if (this.inpNationality !== 'VN' && typeDocs !== 'HO CHIEU') {
        this.errMsgTypeVerifyDocsSecond = 'Vui lòng chọn Loại GTXM là Hộ chiếu với Quốc tịch khác Việt Nam';
        return;
      }
      if (this.inpDateOfBirth && moment().diff(this.inpDateOfBirth, 'years') < 14 && (typeDocs === 'CAN CUOC CONG DAN' || typeDocs === 'CHUNG MINH NHAN DAN')) {
        this.errMsgTypeVerifyDocsSecond = 'GTXM phải là Hộ chiếu hoặc Giấy khai sinh';
        return;
      }
    }
  }
  validateVerifyNumberDocsSecond(): void {
    const typeVerifyDocsSecond = this.typeVerifyDocsSecond.nativeElement.value;
    this.errMsgVerifyNumberDocsSecond = '';
    if (this.verifyNumberDocsSecond === '') {
      this.errMsgVerifyNumberDocsSecond = 'Số GTXM không được để trống';
      return;
    }
    if (this.verifyNumberDocsSecond.match(STR_NOT_SPEC_CHARACTER)) {
      this.errMsgVerifyNumberDocsSecond = 'Số GTXM không được chứa ký tự đặc biệt';
      return;
    }
    if (typeVerifyDocsSecond === 'CHUNG MINH NHAN DAN') {
      if ((this.verifyNumberDocsSecond.length !== 9 && this.verifyNumberDocsSecond.length !== 12)
        || this.verifyNumberDocsSecond.match(ONLY_NUMBER_REGEX)) {
        this.errMsgVerifyNumberDocsSecond = 'Chứng minh nhân dân phải là 9 hoặc 12 ký tự số';
        return;
      }
    }
    if (typeVerifyDocsSecond === 'CAN CUOC CONG DAN') {
      if (this.verifyNumberDocsSecond.length !== 12 || this.verifyNumberDocsSecond.match(ONLY_NUMBER_REGEX)) {
        this.errMsgVerifyNumberDocsSecond = 'Căn cước công dân phải là 12 ký tự số';
        return;
      }
    }
    if (typeVerifyDocsSecond === 'HO CHIEU' && typeVerifyDocsSecond === 'GIAY KHAI SINH') {
      if (this.verifyNumberDocsFirst.match(RG_FULLNAME)) {
        this.errMsgVerifyNumberDocsSecond = 'GTXM không chứa ký tự đặc biệt';
        return;
      }
    }
    if (this.verifyNumberDocsFirst === this.verifyNumberDocsSecond) {
      this.errMsgVerifyNumberDocsSecond = 'GTXM 2 trùng GTXM 1';
      return;
    }
    if (this.verifyNumberDocsSecond === this.verifyNumberDocsThird) {
      this.errMsgVerifyNumberDocsSecond = 'GTXM 2 trùng GTXM 3';
      return;
    }
    this.searchNumberVerifyDocs(this.verifyNumberDocsSecond, data => {
      if (data.length > 0 && !this.isExistCore) {
        this.errMsgVerifyNumberDocsSecond = 'GTXM số ' +
          this.verifyNumberDocsSecond +
          ' trùng với KH: ' +
          (data[0].FULL_NAME ? data[0].FULL_NAME : '') +
          ' - CIF: ' +
          (data[0].CUSTOMER_NO ? data[0].CUSTOMER_NO : '') +
          ' - CN: ' +
          (data[0].BRANCH_NAME ? data[0].BRANCH_NAME : '') +
          ' - Loại GTXM: ' +
          (data[0].UID_NAME ? data[0].UID_NAME : '');
      }
      return;
    });
  }
  setExpDateSecondByBirthDate(): string {
    if (this.inpDateOfBirth) {
      const tempcurentDate = moment(this.currentDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
      // tslint:disable-next-line:align
      const tempDateOne = moment(this.inpDateOfBirth, 'DD/MM/YYYY').add(25, 'years').format('DD/MM/YYYY');
      const tempDateTwo = moment(this.inpDateOfBirth, 'DD/MM/YYYY').add(40, 'years').format('DD/MM/YYYY');
      const tempDateThird = moment(this.inpDateOfBirth, 'DD/MM/YYYY').add(60, 'years').format('DD/MM/YYYY');
      const dateOfBirth = moment(this.inpDateOfBirth, 'DD/MM/YYYY');
      if (this.typeVerifyDocsSecond.nativeElement.value === 'CAN CUOC CONG DAN' && this.inpNationality === 'VN') {
        if (compareDate(tempcurentDate, tempDateOne) === -1) {
          this.dpExpDateSecond.setValue(moment(dateOfBirth.add(25, 'years')).format('DD/MM/YYYY'));
          return;
        }
        if (compareDate(tempcurentDate, tempDateTwo) === -1) {
          this.dpExpDateSecond.setValue(moment(dateOfBirth.add(40, 'years')).format('DD/MM/YYYY'));
          return;
        }
        if (compareDate(tempcurentDate, tempDateThird) === -1) {
          this.dpExpDateSecond.setValue(moment(dateOfBirth.add(60, 'years')).format('DD/MM/YYYY'));
          return;
        }
      }
    }
    this.validateExpDateSecond();
  }
  setExpDateBysupplyDateSecond(): void {
    const supplyDateSecond = moment(this.dpDateSupplySecond.getValue(), 'DD/MM/YYYY');
    if (!supplyDateSecond) { return; }
    const getIssueYear = moment(supplyDateSecond, 'DD/MM/YYYY');

    const issueYear = getIssueYear.year();
    if (this.dpDateSupplySecond.getValue() === '' && this.typeVerifyDocsSecond.nativeElement.value !== 'CAN CUOC CONG DAN') {
      this.dpExpDateSecond.setValue('');
      return;
    }
    if (this.typeVerifyDocsSecond.nativeElement.value === 'CHUNG MINH NHAN DAN') {
      this.dpExpDateSecond.setValue(moment(supplyDateSecond).year(issueYear + 15).format('DD/MM/YYYY'));
      return;
    }
    if (this.typeVerifyDocsSecond.nativeElement.value === 'HO CHIEU' && this.inpNationality === 'VN') {
      this.dpExpDateSecond.setValue(moment(supplyDateSecond).year(issueYear + 10).format('DD/MM/YYYY'));
      return;
    }
  }
  /**
   * Fill giá trị nơi cấp mặc định
   * Nếu người dùng chọn loại giấy tờ xác minh
   */
  setProvideBySecond(): void {
    const typeVerifyDocsSecond = this.typeVerifyDocsSecond.nativeElement.value;
    if (typeVerifyDocsSecond === 'CAN CUOC CONG DAN') {
      if (this.dpDateSupplySecond.haveValue() !== '') {
        const spDate = this.dpDateSupplySecond.getValue();
        // tslint:disable-next-line:max-line-length
        if (compareDate(spDate, moment('01/01/2016', 'DD/MM/YYYY')) > -1 && compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) === 1) {
          this.provideBySecond = 'CCS ĐKQL CT và DLQG về DC';
        }
        if (compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) <= 0) {
          this.provideBySecond = 'CCS QLHC về TTXH';
        }
      }
    } else {
      if (typeVerifyDocsSecond === 'CHUNG MINH NHAN DAN' || typeVerifyDocsSecond === 'GIAY KHAI SINH') {
        if (this.provideBySecond === '') {
          this.provideBySecond = 'Công an ' + (this.provinceUser ? this.provinceUser : '');
        }

      } else {
        if (this.provideBySecond === '') {
          this.provideBySecond = 'Cục Quản lý XNC';
        }

      }
    }
    this.validateProvideBySecond();
  }
  validateProvideBySecond(): void {
    this.errMsgProvideBySecond = '';
    if (this.provideBySecond === '') {
      this.errMsgProvideBySecond = 'Nơi cấp không được để trống';
      return;
    }
  }
  validateExpDateSecond(): void {
    this.dpExpDateSecond.setErrorMsg('');
    const contentInputDate = this.dpExpDateSecond.haveValue() ? this.dpExpDateSecond.getValue() : '';
    if (!this.isExistCore) {
      if (contentInputDate === '' && !this.isRequireExpDateSecond) {
        this.dpExpDateSecond.setErrorMsg('Ngày hết hiệu lực không được để trống');
        return;
      }
      if (this.dpExpDateSecond.haveValue() && !this.dpExpDateSecond.haveValidDate()) {
        this.dpExpDateSecond.setErrorMsg('Ngày hết hiệu lực sai định dạng');
        return;
      }
      if (this.dpDateSupplySecond.haveValidDate() &&
        this.dpExpDateSecond.haveValidDate() &&
        compareDate(this.dpDateSupplySecond.getSelectedDate(), this.dpExpDateSecond.getSelectedDate()) === 1) {
        this.dpExpDateSecond.setErrorMsg('Ngày hết hiệu lực phải lớn hơn ngày cấp');
        return;
      }
    }
  }


  /**
   * Xử lý Khối GTXM 3
   */
  supplyDateThirdBlur(): void {
    this.validateSupplyDateThird();
    this.setProvideByThird();
    this.setExpDateBysupplyDateThird();
    this.validateExpDateThird();
  }
  supplyDateThirdChange(): void {
    this.validateSupplyDateThird();
    this.setProvideByThird();
    this.setExpDateBysupplyDateThird();
    this.validateExpDateThird();
  }
  validateSupplyDateThird(): void {
    this.dpDateSupplyThird.setErrorMsg('');
    const contentInput = this.dpDateSupplyThird.haveValue() ? this.dpDateSupplyThird.getValue() : '';
    if (!this.isExistCore) {
      if (contentInput === '') {
        this.dpDateSupplyThird.setErrorMsg('Ngày cấp không được để trống');
        return;
      }
      if (!this.dpDateSupplyThird.haveValidDate()) {
        this.dpDateSupplyThird.setErrorMsg('Ngày cấp sai định dạng');
        return;
      }
      const tmpDate = moment(this.dpDateSupplyThird.getSelectedDate(), 'DD/MM/YYYY');
      if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
        this.dpDateSupplyThird.setErrorMsg('Ngày cấp không được chọn ngày tương lai');
        return;
      }
      if (tmpDate.toDate().getTime() < moment('01/01/1920').toDate().getTime()) {
        this.dpDateSupplyThird.setErrorMsg('Ngày cấp không được xa hơn 01/01/1920');
        return;
      }
      const typeVerifyDocsThird = this.typeVerifyDocsThird.nativeElement.value;
      if ((typeVerifyDocsThird === 'CAN CUOC CONG DAN' || typeVerifyDocsThird === 'CHUNG MINH NHAN DAN') && tmpDate &&
        this.inpDateOfBirth && tmpDate.diff(this.inpDateOfBirth, 'years') < 14) {
        this.dpDateSupplyThird.setErrorMsg('Ngày cấp không hợp lệ');
        return;
      }
      if (typeVerifyDocsThird === 'CAN CUOC CONG DAN' && compareDate(moment('01/01/2016', 'DD/MM/YYYY'), tmpDate) === 1) {
        this.dpDateSupplyThird.setErrorMsg('Ngày cấp không được xa hơn 01/01/2016');
        return;
      }
    }
  }
  onChangeDocsTypeThird(val): void {
    this.typeVerifyDocsThird.nativeElement.value = val;
    this.provideByThird = '';
    this.expDateChecking('THIRD');
    this.validateTypeVerifyDocsThird();
    this.validateVerifyNumberDocsThird();
    this.validateSupplyDateThird();
    this.setProvideByThird();
    this.setExpDateThirdByBirthDate();
    if (this.dpDateSupplyThird.haveValidDate()) {
      this.setExpDateBysupplyDateThird();
    }
    this.validateExpDateThird();
    // this.compareTypeVerifyDocs();
  }
  validateTypeVerifyDocsThird(): void {
    this.errMsgTypeVerifyDocsThird = '';
    if (!this.isExistCore) {
      if (!this.typeVerifyDocsThird.nativeElement.value) {
        this.errMsgTypeVerifyDocsThird = 'Loại GTXM không được để trống';
        return;
      }
      const typeDocs = this.typeVerifyDocsThird.nativeElement.value;
      if (this.inpNationality !== 'VN' && typeDocs !== 'HO CHIEU') {
        this.errMsgTypeVerifyDocsThird = 'Vui lòng chọn Loại GTXM là Hộ chiếu với Quốc tịch khác Việt Nam';
        return;
      }
      if (this.inpDateOfBirth && moment().diff(this.inpDateOfBirth, 'years') < 14 && (typeDocs === 'CAN CUOC CONG DAN' || typeDocs === 'CHUNG MINH NHAN DAN')) {
        this.errMsgTypeVerifyDocsThird = 'GTXM phải là Hộ chiếu hoặc Giấy khai sinh';
        return;
      }
    }
  }
  validateVerifyNumberDocsThird(): void {
    const typeVerifyDocsThird = this.typeVerifyDocsThird.nativeElement.value;
    this.errMsgVerifyNumberDocsThird = '';
    if (this.verifyNumberDocsThird === '') {
      this.errMsgVerifyNumberDocsThird = 'Số GTXM không được để trống';
      return;
    }
    if (this.verifyNumberDocsThird.match(STR_NOT_SPEC_CHARACTER)) {
      this.errMsgVerifyNumberDocsThird = 'Số GTXM không được chứa ký tự đặc biệt';
      return;
    }
    if (typeVerifyDocsThird === 'CHUNG MINH NHAN DAN') {
      if ((this.verifyNumberDocsThird.length !== 9 && this.verifyNumberDocsThird.length !== 12)
        || this.verifyNumberDocsThird.match(ONLY_NUMBER_REGEX)) {
        this.errMsgVerifyNumberDocsThird = 'Chứng minh nhân dân phải là 9 hoặc 12 ký tự số';
        return;
      }
    }
    if (typeVerifyDocsThird === 'CAN CUOC CONG DAN') {
      if (this.verifyNumberDocsThird.length !== 12 || this.verifyNumberDocsThird.match(ONLY_NUMBER_REGEX)) {
        this.errMsgVerifyNumberDocsThird = 'Căn cước công dân phải là 12 ký tự số';
        return;
      }
    }
    if (typeVerifyDocsThird === 'HO CHIEU' && typeVerifyDocsThird === 'GIAY KHAI SINH') {
      if (this.verifyNumberDocsFirst.match(RG_FULLNAME)) {
        this.errMsgVerifyNumberDocsThird = 'GTXM không chứa ký tự đặc biệt';
        return;
      }
    }
    if (this.verifyNumberDocsFirst === this.verifyNumberDocsThird) {
      this.errMsgVerifyNumberDocsThird = 'GTXM 3 trùng GTXM 1';
      return;
    }
    if (this.verifyNumberDocsSecond === this.verifyNumberDocsThird) {
      this.errMsgVerifyNumberDocsThird = 'GTXM 3 trùng GTXM 2';
      return;
    }
    this.searchNumberVerifyDocs(this.verifyNumberDocsThird, data => {
      if (data.length > 0 && !this.isExistCore) {
        this.errMsgVerifyNumberDocsThird = 'GTXM số ' +
          this.verifyNumberDocsThird +
          ' trùng với KH: ' +
          (data[0].FULL_NAME ? data[0].FULL_NAME : '') +
          ' - CIF: ' +
          (data[0].CUSTOMER_NO ? data[0].CUSTOMER_NO : '') +
          ' - CN: ' +
          (data[0].BRANCH_NAME ? data[0].BRANCH_NAME : '') +
          ' - Loại GTXM: ' +
          (data[0].UID_NAME ? data[0].UID_NAME : '');
      }
      return;
    });
  }
  setExpDateThirdByBirthDate(): void {
    if (this.inpDateOfBirth) {
      const tempcurentDate = moment(this.currentDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
      // tslint:disable-next-line:align
      const tempDateOne = moment(this.inpDateOfBirth, 'DD/MM/YYYY').add(25, 'years').format('DD/MM/YYYY');
      const tempDateTwo = moment(this.inpDateOfBirth, 'DD/MM/YYYY').add(40, 'years').format('DD/MM/YYYY');
      const tempDateThird = moment(this.inpDateOfBirth, 'DD/MM/YYYY').add(60, 'years').format('DD/MM/YYYY');
      const dateOfBirth = moment(this.inpDateOfBirth, 'DD/MM/YYYY');
      if (this.typeVerifyDocsThird.nativeElement.value === 'CAN CUOC CONG DAN' && this.inpNationality === 'VN') {
        if (compareDate(tempcurentDate, tempDateOne) === -1) {
          this.dpExpDateThird.setValue(moment(dateOfBirth.add(25, 'years')).format('DD/MM/YYYY'));
          return;
        }
        if (compareDate(tempcurentDate, tempDateTwo) === -1) {
          this.dpExpDateThird.setValue(moment(dateOfBirth.add(40, 'years')).format('DD/MM/YYYY'));
          return;
        }
        if (compareDate(tempcurentDate, tempDateThird) === -1) {
          this.dpExpDateThird.setValue(moment(dateOfBirth.add(60, 'years')).format('DD/MM/YYYY'));
          return;
        }
      }
    }
    this.validateExpDateThird();
  }
  setExpDateBysupplyDateThird(): void {
    const supplyDateThird = moment(this.dpDateSupplyThird.getValue(), 'DD/MM/YYYY');
    if (!supplyDateThird) {
      return;
    }
    const getIssueYear = moment(supplyDateThird, 'DD/MM/YYYY');
    const issueYear = getIssueYear.year();
    if (this.dpDateSupplyThird.getValue() === '' && this.typeVerifyDocsThird.nativeElement.value !== 'CAN CUOC CONG DAN') {
      this.dpExpDateThird.setValue('');
      return;
    }
    if (this.typeVerifyDocsThird.nativeElement.value === 'CHUNG MINH NHAN DAN') {
      this.dpExpDateThird.setValue(moment(supplyDateThird).year(issueYear + 15).format('DD/MM/YYYY'));
      return;
    }
    if (this.typeVerifyDocsThird.nativeElement.value === 'HO CHIEU' && this.inpNationality === 'VN') {
      this.dpExpDateThird.setValue(moment(supplyDateThird).year(issueYear + 10).format('DD/MM/YYYY'));
      return;
    }
  }
  /**
   * Fill giá trị nơi cấp mặc định
   * Nếu người dùng chọn loại giấy tờ xác minh
   */
  setProvideByThird(): void {
    const typeVerifyDocsThird = this.typeVerifyDocsThird.nativeElement.value;
    if (typeVerifyDocsThird === 'CAN CUOC CONG DAN') {
      if (this.dpDateSupplyThird.haveValue() !== '') {
        const spDate = this.dpDateSupplyThird.getValue();
        // tslint:disable-next-line:max-line-length
        if (compareDate(spDate, moment('01/01/2016', 'DD/MM/YYYY')) > -1 && compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) === 1) {
          this.provideByThird = 'CCS ĐKQL CT và DLQG về DC';
        }
        if (compareDate(moment('10/10/2018', 'DD/MM/YYYY'), spDate) <= 0) {
          this.provideByThird = 'CCS QLHC về TTXH';
        }
      }
    } else {
      if (typeVerifyDocsThird === 'CHUNG MINH NHAN DAN' || typeVerifyDocsThird === 'GIAY KHAI SINH') {
        if (this.provideByThird === '') {
          this.provideByThird = 'Công an ' + (this.provinceUser ? this.provinceUser : '');
        }
      } else {
        if (this.provideByThird === '') {
          this.provideByThird = 'Cục Quản lý XNC';
        }
      }
    }
    this.validateProvideByThird();
  }
  validateProvideByThird(): void {
    this.errMsgProvideByThird = '';
    if (this.provideByThird === '') {
      this.errMsgProvideByThird = 'Nơi cấp không được để trống';
      return;
    }
  }
  validateExpDateThird(): void {
    this.dpExpDateThird.setErrorMsg('');
    const contentInputDate = this.dpExpDateThird.haveValue() ? this.dpExpDateThird.getValue() : '';
    if (!this.isExistCore) {
      if (contentInputDate === '' && !this.isRequireExpDateThird) {
        this.dpExpDateThird.setErrorMsg('Ngày hết hiệu lực không được để trống');
        return;
      }
      if (this.dpExpDateThird.haveValue() && !this.dpExpDateThird.haveValidDate()) {
        this.dpExpDateThird.setErrorMsg('Ngày hết hiệu lực sai định dạng');
        return;
      }
      if (this.dpDateSupplyThird.haveValidDate() &&
        this.dpExpDateThird.haveValidDate() &&
        compareDate(this.dpDateSupplyThird.getSelectedDate(), this.dpExpDateThird.getSelectedDate()) === 1) {
        this.dpExpDateThird.setErrorMsg('Ngày hết hiệu lực phải lớn hơn ngày cấp');
        return;
      }
    }
  }
  /**
   * Xử lý thông tin Component
   */

  addOrRemoveNation(action: string, position?: string): void {
    if (action === 'ADD') {
      if (this.isShowDocsSecond) {
        this.isShowDocsThird = true;
      } else {
        this.isShowDocsSecond = true;
      }
    }
    if (action === 'REMOVE') {
      if (position === 'SECOND' && this.isShowDocsThird) {
        this.isRequireExpDateSecond = this.isRequireExpDateThird;
        this.verifyNumberDocsSecond = this.verifyNumberDocsThird;
        this.provideBySecond = this.provideByThird;
        this.errMsgTypeVerifyDocsSecond = this.errMsgTypeVerifyDocsThird; // Thông báo lỗi loại GTXM 2
        this.errMsgVerifyNumberDocsSecond = this.errMsgVerifyNumberDocsThird;
        this.errMsgSupplyDateSecond = this.errMsgSupplyDateThird;
        this.errMsgExpDateSecond = this.errMsgExpDateThird;
        this.errMsgProvideBySecond = this.errMsgProvideByThird;
        this.dpDateSupplySecond.setValue(this.dpDateSupplyThird.getValue());
        this.dpExpDateSecond.setValue(this.dpExpDateThird.getValue());
        this.typeVerifyDocsSecond.nativeElement.value = this.typeVerifyDocsThird.nativeElement.value;
        this.resetBlockVerifyDocs('THIRD');
      } else {
        this.resetBlockVerifyDocs(position);
      }
    }

  }

  /**
   * Clear data trong mỗi block khi người dùng chọn remove
   * @param pos : Khối thông tin cần reset 'SECOND' 'THIRD'
   */
  resetBlockVerifyDocs(position: string): void {
    //  reset lại validate gtxm 2
    if (position === 'SECOND') {
      this.isShowDocsSecond = false;
      this.typeVerifyDocsSecond.nativeElement.value = '';
      this.dpDateSupplySecond.setValue('');
      this.dpExpDateSecond.setValue('');
      this.verifyNumberDocsSecond = '';
      this.provideBySecond = '';
      this.errMsgTypeVerifyDocsSecond = '';
      this.errMsgVerifyNumberDocsSecond = '';
      this.errMsgSupplyDateSecond = '';
      this.errMsgExpDateSecond = '';
      this.errMsgProvideBySecond = '';
      this.dpDateSupplySecond.setErrorMsg('');
      this.dpExpDateSecond.setErrorMsg('');
      // this.compareTypeVerifyDocs();
      // this.errMsgBlockVerifyDocsSecond = '';
    }
    //  reset lại validate gtxm 3
    if (position === 'THIRD') {
      this.isShowDocsThird = false;
      this.typeVerifyDocsThird.nativeElement.value = '';
      this.dpDateSupplyThird.setValue('');
      this.dpExpDateThird.setValue('');
      this.verifyNumberDocsThird = '';
      this.provideByThird = '';
      this.errMsgTypeVerifyDocsThird = '';
      this.errMsgVerifyNumberDocsThird = '';
      this.errMsgSupplyDateThird = '';
      this.errMsgExpDateThird = '';
      this.errMsgProvideByThird = '';
      this.dpDateSupplyThird.setErrorMsg('');
      this.dpExpDateThird.setErrorMsg('');
      // this.compareTypeVerifyDocs();
    }
  }

  getPerDocsList(): any[] {
    // tslint:disable-next-line:prefer-const
    let result = [];
    let GTXM1;
    let GTXM2;
    let GTXM3;
    if (this.isShowDocsFirst) {
      if (!this.isExistCore) {
        this.validateTypeVerifyDocsFirst();
        this.validateVerifyNumberDocsFirst();
        this.validateSupplytDateFirst();
        this.validateProvideByFirst();
        this.validateExpDateFirst();
      }
      if (this.errMsgTypeVerifyDocsFirst === '' && this.errMsgVerifyNumberDocsFirst === '' &&
        this.dpDateSupplyFirst.errorMsg === '' && this.dpExpDateFirst.errorMsg === '' &&
        this.errMsgProvideByFirst === '') {
        GTXM1 = {
          id: this.perDocNoList[0] ? this.perDocNoList[0].id : null,
          perDocIndex: 0,
          perDocTypeCode: this.typeVerifyDocsFirst.nativeElement.value,
          perDocNo: this.verifyNumberDocsFirst,
          issuePlace: this.provideByFirst,
          issueDate: this.dpDateSupplyFirst.getValue(),
          expireDate: this.dpExpDateFirst.getValue()
        };
        result.push(GTXM1);

      }
    }
    if (this.isShowDocsSecond) {
      if (!this.isExistCore) {
        this.validateTypeVerifyDocsSecond();
        this.validateVerifyNumberDocsSecond();
        this.validateSupplyDateSecond();
        this.validateProvideBySecond();
        this.validateExpDateSecond();
      }
      if (this.errMsgTypeVerifyDocsSecond === '' && this.errMsgVerifyNumberDocsSecond === '' &&
        this.dpDateSupplySecond.errorMsg === '' && this.dpExpDateSecond.errorMsg === '' &&
        this.errMsgProvideBySecond === '') {
        GTXM2 = {
          id: this.perDocNoList[1] ? this.perDocNoList[1].id : null,
          perDocIndex: 1,
          perDocTypeCode: this.typeVerifyDocsSecond.nativeElement.value,
          perDocNo: this.verifyNumberDocsSecond,
          issuePlace: this.provideBySecond,
          issueDate: this.dpDateSupplySecond.getValue(),
          expireDate: this.dpExpDateSecond.getValue()
        };
        result.push(GTXM2);
      }
    }
    if (this.isShowDocsThird) {
      if (!this.isExistCore) {
        this.validateTypeVerifyDocsThird();
        this.validateVerifyNumberDocsThird();
        this.validateSupplyDateThird();
        this.validateProvideByThird();
        this.validateExpDateThird();
      }
      if (this.errMsgTypeVerifyDocsThird === '' && this.errMsgVerifyNumberDocsThird === '' &&
        this.dpDateSupplySecond.errorMsg === '' && this.dpExpDateSecond.errorMsg === '' &&
        this.errMsgProvideByThird === '') {
        GTXM3 = {
          id: this.perDocNoList[2] ? this.perDocNoList[2].id : null,
          perDocIndex: 2,
          perDocTypeCode: this.typeVerifyDocsThird.nativeElement.value,
          perDocNo: this.verifyNumberDocsThird,
          issuePlace: this.provideByThird,
          issueDate: this.dpDateSupplyThird.getValue(),
          expireDate: this.dpExpDateThird.getValue()
        };
        result.push(GTXM3);
      }
    }
    // tslint:disable-next-line:align
    const objectResult: any = {
      isResultValid: true,
      result
    };
    // check open khối giấy tờ xác mình 2 nhưng không nhập
    if (this.isShowDocsSecond && !this.isShowDocsThird) {
      if (result.length === 1) {
        objectResult.isResultValid = false;
      }
    }
    // check open khối giấy tờ xác mình 3 nhưng không nhập khối 1 và 2
    if (this.isShowDocsThird) {
      if (result.length === 2 || result.length === 1) {
        objectResult.isResultValid = false;
      }
    }
    return objectResult;
  }
  // search Thông tin số GTXM
  searchNumberVerifyDocs(numberVerifyDoc, callback?: any): void {
    const body = {
      uidValue: numberVerifyDoc
    };
    this.helpService.callApi(
      {
        method: HTTPMethod.POST,
        url: '/process/customerSearch/searchCustomer',
        data: body,
        progress: false,
        success: (res) => {
          if (res && res.responseStatus.success) {
            if (callback) {
              callback(res.items);
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
  /* Kiểm tra trạng thái field ngày hết hiệu lực GTXM được phép sửa / bắt buộc nhập
 * CMND và CCCD tự động tính toán ngày hết hiệu lực:
 * CMND hiệu lực 15 năm kể từ ngày cấp
 * CCCD tính theo độ tuổi khi KH đủ 25,40 và 60 tuổi.
 * HC công dân VN có hiệu lực 10 năm
 * HC người nước ngoài, GKS cho phép tự nhập
 * pos: FIRST, SECOND, THIRD
 */
  expDateChecking(pos: string): void {
    switch (pos) {
      case 'FIRST':
        this.isRequireExpDateFirst = this.typeVerifyDocsFirst.nativeElement.value === 'GIAY KHAI SINH';
        break;
      case 'SECOND':
        this.isRequireExpDateSecond = this.typeVerifyDocsSecond.nativeElement.value === 'GIAY KHAI SINH';
        break;
      case 'THIRD':
        this.isRequireExpDateThird = this.typeVerifyDocsThird.nativeElement.value === 'GIAY KHAI SINH';
        break;
      default:
        break;
    }
  }

  getCopyList(lstInput: any[]): any[] {
    // tslint:disable-next-line:prefer-const
    let ret = [];
    lstInput.forEach(val => ret.push(Object.assign({}, val)));
    return ret;
  }
}
