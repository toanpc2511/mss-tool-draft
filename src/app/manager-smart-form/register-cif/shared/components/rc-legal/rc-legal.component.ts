import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { addressDefaultVietNam, cifCategoryOption } from 'src/app/shared/constants/cif/cif-constants';
import { HTTPMethod } from 'src/app/shared/constants/http-method';
import { HelpsService } from 'src/app/shared/services/helps.service';
import { LpbCustomSingleAddressComponent } from 'src/app/shared/components/lpb-custom-single-address/lpb-custom-single-address.component';
import * as moment from 'moment';
import { compareDate } from 'src/app/shared/constants/utils';

@Component({
  selector: 'app-rc-legal',
  templateUrl: './rc-legal.component.html',
  styleUrls: ['./rc-legal.component.scss']
})
export class RcLegalComponent implements OnInit {
  formLegal: FormGroup;
  formCustomer: FormGroup;
  readonly action = {
    VIEW: 'VIEW_DETAIL',
    CREATE_LEGAL: 'CREATE_LEGAL',
    EDIT_LEGAL: 'EDIT_LEGAL',
    ADD_CUS_LEGAL: 'ADD_CUS_LEGAL'
  };
  @Input() lstLegal = [];
  @Input() customerCode = '';
  @Output() ListLegal = new EventEmitter();
  @Output() closeLegal = new EventEmitter();
  @ViewChild('legalBeginDate', { static: false }) legalBeginDate: LpbDatePickerComponent;
  @ViewChild('dpCusDateOfBirth', { static: false }) dpCusDateOfBirth: LpbDatePickerComponent;
  @ViewChild('dpCusVerifyDocIssueDate', { static: false }) dpCusVerifyDocIssueDate: LpbDatePickerComponent;
  @ViewChild('customAddress', { static: false }) customAddress: LpbCustomSingleAddressComponent;
  listCusCategoryOption = cifCategoryOption;
  selectedLegalNational = { code: 'VN' }; // Lựa chọn quốc tịch, default Việt Nam;
  lstCountry = [];
  actionName = '';
  isActiveBtnSave = false;
  selectedLegal: any;
  selectedCustomer: any;
  objCurrentAddress: any;
  userInfo: any;
  defaultLegalNational = addressDefaultVietNam;
  indexLegalSelected: any;
  indexCustomerSelected: any;
  isShowDeleteConfirm = false;
  age: number;
  constructor(private helpService: HelpsService,
    private ckr: ChangeDetectorRef,
    private fb: FormBuilder) {
    this.initFormLegal();
    this.initFormCustomer();
  }
  ngOnInit(): void {
    this.getCountry();
    this.initAddress();
    // console.log(JSON.stringify(this.lstLegal));
  }

  initAddress(): void {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.objCurrentAddress = {
      currentCountryCode: this.defaultLegalNational.code,
      currentCountryName: this.defaultLegalNational.name,
      currentCityName: this.userInfo ? this.userInfo.cityName : '',
    };
    this.ckr.detectChanges();
  }

  initFormLegal(): void {
    this.formLegal = this.fb.group({
      legalIdentifyNumber: [''],
      legalContent: ['', [Validators.required]],
      legalAmount: ['', [Validators.required]]
    });
  }

  setValueFormLegal(objLegal: any): void {
    this.formLegal.patchValue(objLegal);
    this.selectedLegalNational = objLegal ? { code: objLegal.nationalityCode } : { code: 'VN' };
    this.legalBeginDate.setValue(objLegal ? objLegal.beginDate : '');
  }

  initFormCustomer(): void {
    this.formCustomer = this.fb.group({
      cusFullName: ['', [Validators.required]],
      cusPhoneNumber: [''],
      cusVerifyDocsNumber: ['', [Validators.required]],
      cusVerifyDocIssuePlace: [''],
      cusSelectedCategory: [null, [Validators.required]]
    });
  }

  setValueFormCustomer(objCustomer): void {
    this.formCustomer.patchValue(objCustomer);
    this.dpCusDateOfBirth.setValue(objCustomer ? objCustomer.dateOfBirth : '');
    this.dpCusVerifyDocIssueDate.setValue(objCustomer ? objCustomer.issueDate : '');
    this.objCurrentAddress = {
      currentCountryCode: objCustomer ? objCustomer.currentCountryCode : '',
      currentCityName: objCustomer ? objCustomer.currentCityName : '',
      currentDistrictName: objCustomer ? objCustomer.currentDistrictName : '',
      currentWardName: objCustomer ? objCustomer.currentWardName : '',
      currentStreetNumber: objCustomer ? objCustomer.currentStreetNumber : '',
    };
  }

  nationalityChange(evt): void {
    this.selectedLegalNational = { code: evt.code };
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

  blurBeginDate(): void {
    if (!this.legalBeginDate.haveValue()) {
      this.legalBeginDate.setErrorMsg('Ngày lập thỏa thuận không được để trống');
    }
  }

  legalBeginDateChanged(): void {
    this.validateLegalBeginDate();
  }

  validateLegalBeginDate(): void {
    this.legalBeginDate.setErrorMsg('');
    if (!this.legalBeginDate.haveValue()) {
      this.legalBeginDate.setErrorMsg('Ngày lập thỏa thuận không được để trống');
      return;
    }
    if (!this.legalBeginDate.haveValidDate()) {
      this.legalBeginDate.setErrorMsg('Ngày lập thỏa thuận không hợp lệ');
      return;
    }
  }

  dpDateOfBirthChanged(): void {
    this.validateDateOfBirth();
  }

  dpDateOfBirthBlur(): void {
    if (!this.dpCusDateOfBirth.haveValue()) {
      this.dpCusDateOfBirth.setErrorMsg('Ngày sinh không được để trống');
    }
    const tmpDate = moment(this.dpCusDateOfBirth.getSelectedDate(), 'DD/MM/YYYY');
    if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
      this.dpCusDateOfBirth.setErrorMsg('Ngày sinh không được chọn ngày tương lai');
      return;
    }
    this.age = moment().diff(tmpDate, 'years');
    if (this.age > 120) {
      this.dpCusDateOfBirth.setErrorMsg('Ngày sinh không được quá 120 tuổi');
      return;
    } else if (this.age === 120) {
      if (tmpDate.month() < new Date().getMonth() || tmpDate.date() < new Date().getDate()) {
        this.dpCusDateOfBirth.setErrorMsg('Ngày sinh không được quá 120 tuổi');
        return;
      }
    }
  }

  validateDateOfBirth(): void {
    this.dpCusDateOfBirth.setErrorMsg('');
    if (!this.dpCusDateOfBirth.haveValue()) {
      this.dpCusDateOfBirth.setErrorMsg('Ngày sinh không được để trống');
      return;
    }
    if (!this.dpCusDateOfBirth.haveValidDate()) {
      this.dpCusDateOfBirth.setErrorMsg('Ngày sinh không hợp lệ');
    }
    const tmpDate = moment(this.dpCusDateOfBirth.getSelectedDate(), 'DD/MM/YYYY');
    if (moment().toDate().getTime() < tmpDate.toDate().getTime()) {
      this.dpCusDateOfBirth.setErrorMsg('Ngày sinh không được chọn ngày tương lai');
      return;
    }
  }

  validateVerifyDocIssueDate(): void {
    this.dpCusVerifyDocIssueDate.setErrorMsg('');
    if (this.dpCusVerifyDocIssueDate.haveValue() && !this.dpCusVerifyDocIssueDate.haveValidDate()) {
      this.dpCusVerifyDocIssueDate.setErrorMsg('Ngày cấp không hợp lệ');
    }
    if (!this.dpCusVerifyDocIssueDate.haveValidDate()) {
      this.dpCusVerifyDocIssueDate.setErrorMsg('Ngày cấp sai định dạng');
      return;
    }
    if (this.dpCusDateOfBirth.haveValue() && this.dpCusVerifyDocIssueDate.haveValue()) {
      if (compareDate(this.dpCusVerifyDocIssueDate.getValue(), this.dpCusDateOfBirth.getValue()) === -1) {
        this.dpCusVerifyDocIssueDate.setErrorMsg('Ngày cấp không được nhỏ hơn ngày sinh');
        return;
      }
    }
  }

  viewDetail(legal, customer, iLegal, iCus): void {
    this.selectedLegal = legal;
    this.selectedCustomer = customer;
    this.editCustomerAndLegal(legal, customer, iLegal, iCus);
    this.actionName = this.action.VIEW;
  }

  resetBlockLegal(): void {
    this.legalBeginDate.setValue('');
    this.legalBeginDate.setErrorMsg('');
    this.formLegal.reset();
  }

  resetBlockCustomer(): void {
    this.dpCusDateOfBirth.setValue('');
    this.dpCusDateOfBirth.setErrorMsg('');
    this.dpCusVerifyDocIssueDate.setValue('');
    this.dpCusVerifyDocIssueDate.setErrorMsg('');
    this.initAddress();
    this.formCustomer.reset();
  }

  resetAddress(): void {
    this.customAddress.selectedCurrentCountry = null;
    this.customAddress.selectedCurrentProvince = null;
    this.customAddress.selectedCurrentDistrict = null;
    this.customAddress.selectedCurrentWard = null;
    this.customAddress.currentProvinceForeign.nativeElement.value = '';
    this.customAddress.currentDistrictForeign.nativeElement.value = '';
    this.customAddress.currentWardForeign.nativeElement.value = '';
    this.customAddress.currentAddress.nativeElement.value = '';
    this.customAddress.errMsgCurrentCountry = '';
    this.customAddress.errMsgCurrentProvice = '';
    this.customAddress.errMsgCurrentDistrict = '';
    this.customAddress.errMsgCurrentWard = '';
    this.customAddress.errMsgCurrentAddress = '';
  }

  editCustomerAndLegal(legal, cus, indexLegal, indexCus): void {
    this.selectedCustomer = cus;
    this.selectedLegal = legal;
    this.indexLegalSelected = indexLegal;
    this.indexCustomerSelected = indexCus;
    this.setValueFormLegal({
      legalIdentifyNumber: legal ? legal.legalCode : '',
      legalContent: legal ? legal.content : '',
      legalAmount: legal ? legal.amount : '',
      nationalityCode: legal ? legal.nationalityCode : '',
      beginDate: legal ? legal.beginDate : ''
    });
    this.setValueFormCustomer({
      cusFullName: (cus && cus.person) ? cus.person.fullName : '',
      cusPhoneNumber: (cus && cus.person) ? cus.person.mobileNo : '',
      cusSelectedCategory: cus ? cus.legalObjectTypeCode : null,
      cusVerifyDocsNumber: (cus && cus.person && cus.person.perDocNoList.length > 0) ? cus.person.perDocNoList[0].perDocNo : '',
      cusVerifyDocIssuePlace: (cus && cus.person && cus.person.perDocNoList.length > 0) ? cus.person.perDocNoList[0].issuePlace : '',
      issueDate: (cus && cus.person && cus.person.perDocNoList.length > 0) ? cus.person.perDocNoList[0].issueDate : '',
      dateOfBirth: (cus && cus.person) ? cus.person.dateOfBirth : '',
      currentCityName: (cus && cus.person) ? cus.person.currentCityName : '',
      currentCountryCode: (cus && cus.person) ? cus.person.currentCountryCode : '',
      currentDistrictName: (cus && cus.person) ? cus.person.currentDistrictName : '',
      currentStreetNumber: (cus && cus.person) ? cus.person.currentStreetNumber : '',
      currentWardName: (cus && cus.person) ? cus.person.currentWardName : '',
    });
    this.actionName = this.action.EDIT_LEGAL;
  }

  createLegal(): void {
    this.actionName = this.action.CREATE_LEGAL;
    this.isActiveBtnSave = true;
    this.resetBlockCustomer();
    this.resetAddress();
    this.resetBlockLegal();
    this.initAddress();
    this.selectedLegalNational = { code: 'VN' };
  }

  addCustomerToLegal(legal): void {
    this.actionName = this.action.ADD_CUS_LEGAL;
    this.resetBlockCustomer();
    this.resetAddress();
    this.initAddress();
  }

  cancelAction(): void {
    this.actionName = '';
    this.indexCustomerSelected = null;
    this.indexLegalSelected = null;
    this.resetBlockCustomer();
    this.resetBlockLegal();
  }

  saveAction(): void {
    switch (this.actionName) {
      case this.action.CREATE_LEGAL:
        this.saveDataCreateLegal();
        this.ListLegal.emit(this.lstLegal);
        break;
      case this.action.EDIT_LEGAL:
        this.saveEditDataLegal();
        this.ListLegal.emit(this.lstLegal);
        break;
      case this.action.ADD_CUS_LEGAL:
        this.saveDataAddCustomerToLegal();
        break;
      default:
        break;
    }
  }

  saveDataCreateLegal(): void {
    this.formLegal.markAllAsTouched();
    this.formCustomer.markAllAsTouched();
    this.validateLegalBeginDate();
    this.validateDateOfBirth();
    const objAddress = this.customAddress.getDataCurrentFormAddress();
    if (this.formLegal.invalid
      || this.formCustomer.invalid
      || this.dpCusDateOfBirth.errorMsg !== ''
      || this.legalBeginDate.errorMsg !== ''
      || this.dpCusVerifyDocIssueDate.errorMsg !== ''
      || !objAddress) {
      return;
    } else {
      const objLegal = {
        customerList: [
          {
            legalObjectTypeCode: this.formCustomer.value.cusSelectedCategory,
            person: {
              perDocNoList: [{
                perDocNo: this.formCustomer.value.cusVerifyDocsNumber,
                issueDate: this.dpCusVerifyDocIssueDate.getValue() ? this.dpCusVerifyDocIssueDate.getValue() : null,
                issuePlace: this.formCustomer.value.cusVerifyDocIssuePlace
              }],
              fullName: this.formCustomer.value.cusFullName,
              inEffect: null,
              status: 'ACTIVE',
              dateOfBirth: this.dpCusDateOfBirth.getValue(),
              mobileNo: this.formCustomer.value.cusPhoneNumber,
              currentCountryCode: objAddress.currentCountryCode,
              currentCityName: objAddress.currentProvinceName,
              currentDistrictName: objAddress.currentDistrictName,
              currentWardName: objAddress.currentWardName,
              currentStreetNumber: objAddress.currentAddress,
              taxCode: '',
              language: 'VNM'
            },
            customerCode: 'INDIV',
            customerTypeCode: 'INDIV',
            customerCategoryCode: 'INDIV'
          }
        ],
        legalCode: this.formLegal.value.legalIdentifyNumber,
        inEffect: null,
        amount: this.formLegal.value.legalAmount,
        content: this.formLegal.value.legalContent,
        legalAgreementCode: null,
        beginDate: this.legalBeginDate.getValue(),
        nationalityCode: this.selectedLegalNational.code,
        status: 'NEW',
        actionCode: 'C',
        tempAgreementCode: 'UNIFORM' + String(Date.now())
      };
      this.lstLegal.push(objLegal);
    }
    this.actionName = '';
    this.resetBlockCustomer();
    this.resetBlockLegal();
    this.resetAddress();
    this.initAddress();
  }

  saveEditDataLegal(): void {
    this.formLegal.markAllAsTouched();
    this.formCustomer.markAllAsTouched();
    this.validateLegalBeginDate();
    this.validateDateOfBirth();
    const objAddress = this.customAddress.getDataCurrentFormAddress();
    if (this.formLegal.invalid
      || this.formCustomer.invalid
      || this.dpCusDateOfBirth.errorMsg !== ''
      || this.legalBeginDate.errorMsg !== ''
      || this.dpCusVerifyDocIssueDate.errorMsg !== ''
      || !objAddress) {
      return;
    }
    this.lstLegal.forEach((elLegal, indexLegal) => {
      if (this.indexLegalSelected === indexLegal) {
        elLegal.id = this.selectedLegal.id;
        elLegal.legalCode = this.formLegal.value.legalIdentifyNumber;
        elLegal.idTTPL = this.selectedLegal.idTTPL;
        elLegal.amount = this.formLegal.value.legalAmount;
        elLegal.content = this.formLegal.value.legalContent;
        elLegal.legalAgreementCode = this.selectedLegal.legalAgreementCode;
        elLegal.tempLegalAgreementCode = this.selectedLegal.tempLegalAgreementCode;
        elLegal.beginDate = this.legalBeginDate.getValue();
        elLegal.nationalityCode = this.selectedLegalNational.code;
        elLegal.inEffect = null;
        elLegal.status = 'EDIT';
        elLegal.customerList.forEach((elCus, indexCus) => {
          if (indexCus === this.indexCustomerSelected) {
            elCus.id = this.selectedCustomer.id;
            elCus.customerCode = this.selectedCustomer.customerCode;
            elCus.customerTypeCode = this.selectedCustomer.customerTypeCode;
            elCus.customerCategoryCode = this.selectedCustomer.customerCategoryCode;
            elCus.actionCode = '';
            elCus.legalObjectTypeCode = this.formCustomer.value.cusSelectedCategory;
            elCus.person = {
              id: this.selectedCustomer.person.id,
              perDocNoList: [{
                id: this.selectedCustomer.person.perDocNoList[0].id,
                perDocNo: this.formCustomer.value.cusVerifyDocsNumber,
                issueDate: this.dpCusVerifyDocIssueDate.getValue() ? this.dpCusVerifyDocIssueDate.getValue() : null,
                issuePlace: this.formCustomer.value.cusVerifyDocIssuePlace
              }],
              fullName: this.formCustomer.value.cusFullName,
              inEffect: null,
              status: this.selectedCustomer.person.status,
              dateOfBirth: this.dpCusDateOfBirth.getValue(),
              mobileNo: this.formCustomer.value.cusPhoneNumber,
              currentCountryCode: objAddress.currentCountryCode,
              currentCityName: objAddress.currentProvinceName,
              currentDistrictName: objAddress.currentDistrictName,
              currentWardName: objAddress.currentWardName,
              currentStreetNumber: objAddress.currentAddress,
              taxCode: this.selectedCustomer.person.taxCode,
              language: this.selectedCustomer.person.language,
              idIndex: this.selectedCustomer.person.idIndex
            };
          }
        });
      }
    });
    this.actionName = '';
    this.selectedLegal = null;
    this.selectedCustomer = null;
    this.indexCustomerSelected = null;
    this.indexLegalSelected = null;
    this.resetBlockCustomer();
    this.resetBlockLegal();
    this.resetAddress();
    this.initAddress();
  }

  saveDataAddCustomerToLegal(): void {
    this.formCustomer.markAllAsTouched();
    this.validateDateOfBirth();
    const objAddress = this.customAddress.getDataCurrentFormAddress();
    if (this.formLegal.invalid
      || this.formCustomer.invalid
      || this.dpCusDateOfBirth.errorMsg !== ''
      || this.legalBeginDate.errorMsg !== ''
      || this.dpCusVerifyDocIssueDate.errorMsg !== ''
      || !objAddress) {
      return;
    }
    this.lstLegal.forEach((elLegal, indexLegal) => {
      if (this.indexLegalSelected === indexLegal) {
        const objNewCustomer = {
          id: null,
          legalObjectTypeCode: this.formCustomer.value.cusSelectedCategory,
          obj: this.formCustomer.value.cusSelectedCategory,
          person: {
            id: null,
            perDocNoList: [{
              id: null,
              perDocNo: this.formCustomer.value.cusVerifyDocsNumber,
              issueDate: this.dpCusVerifyDocIssueDate.getValue() ? this.dpCusVerifyDocIssueDate.getValue() : null,
              issuePlace: this.formCustomer.value.cusVerifyDocIssuePlace
            }],
            fullName: this.formCustomer.value.cusFullName,
            inEffect: null,
            status: 'ACTIVE',
            dateOfBirth: this.dpCusDateOfBirth.getValue(),
            mobileNo: this.formCustomer.value.cusPhoneNumber,
            currentCountryCode: objAddress.currentCountryCode,
            currentCityName: objAddress.currentProvinceName,
            currentDistrictName: objAddress.currentDistrictName,
            currentWardName: objAddress.currentWardName,
            currentStreetNumber: objAddress.currentAddress,
            taxCode: '',
            language: 'VNM',
            obj: this.formCustomer.value.cusSelectedCategory,
            idIndex: null
          },
          customerCode: 'INDIV',
          customerTypeCode: 'INDIV',
          customerCategoryCode: 'INDIV',
          actionCode: 'C'
        };
        elLegal.customerList.push(objNewCustomer);
      }
    });
    this.selectedCustomer = null;
    this.selectedLegal = null;
    this.indexLegalSelected = null;
    this.indexCustomerSelected = null;
    this.actionName = '';
    this.resetBlockCustomer();
    this.resetBlockLegal();
    this.resetAddress();
    this.initAddress();
  }

  deleteCustomerInLegal(legal, cus, indexLegal, indexCus): void {
    this.selectedCustomer = cus;
    this.selectedLegal = legal;
    this.indexLegalSelected = indexLegal;
    this.indexCustomerSelected = indexCus;
    if (this.selectedCustomer) {
      this.isShowDeleteConfirm = true;
    }
  }

  confirmDelete(): void {
    this.lstLegal.forEach((elLegal, indexLegal) => {
      if (this.indexLegalSelected === indexLegal) {
        elLegal.customerList.forEach((elCus, indexCus) => {
          if (indexCus === this.indexCustomerSelected) {
            elLegal.customerList.splice(indexCus, 1);
          }
        });
      }
    });
    this.checkingRemoveLegalEmpty();
    this.selectedCustomer = null;
    this.selectedLegal = null;
    this.indexLegalSelected = null;
    this.indexCustomerSelected = null;
    this.isShowDeleteConfirm = false;
    this.ListLegal.emit(this.lstLegal);
  }

  cancelDelete(): void {
    this.selectedCustomer = null;
    this.selectedLegal = null;
    this.indexLegalSelected = null;
    this.indexCustomerSelected = null;
    this.isShowDeleteConfirm = false;
  }

  checkingRemoveLegalEmpty(): void {
    if (this.lstLegal.length > 0) {
      this.lstLegal.forEach((elLegal, indexLegal) => {
        if (elLegal.customerList.length === 0) {
          this.lstLegal.splice(indexLegal, 1);
        }
      });
    }
  }

  hasErrorInput(form: FormGroup, controlName: string, errorName: string): boolean {
    const control = form.get(controlName);
    if (control == null) {
      return false;
    }
    return (control.dirty || control.touched) && control.hasError(errorName);
  }

  /*Lấy đối tượng theo mã code
* */
  getCustomerObjectByCode(objCode: any): string {
    if (objCode) {
      return cifCategoryOption.find(item => item.code === objCode).name;
    } else {
      return '';
    }
  }

  completed(): void {
    this.closeLegal.emit();
  }
}
