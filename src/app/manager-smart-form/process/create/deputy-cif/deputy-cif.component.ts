import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { Category } from 'src/app/_models/category/category';
import { CategoryList } from 'src/app/_models/category/categoryList';
import { GuardianList } from 'src/app/_models/deputy';
import { PopupSearchComponent } from 'src/app/_popup-search/popup.search.component';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { CategoryService } from 'src/app/_services/category/category.service';
import { RelationshipListService } from 'src/app/_services/relationshipList.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { ObjConfigPopup } from 'src/app/_utils/_objConfigPopup';
import { ObjCif } from 'src/app/_utils/_returnObjCif';
import { TextMessage } from 'src/app/_utils/_textMessage';
import { ValidatorSpace } from 'src/app/_validator/otp.validator';
import { ErrorMessage } from '../../../../_utils/ErrorMessage';
import { GlobalConstant } from '../../../../_utils/GlobalConstant';
import { checkPhonesNumber, futureDate, is18YearOld, IssueDate, pastDate } from '../../../../_validator/cif.register.validator';

declare var $: any;

@Component({
  selector: 'app-deputy-cif',
  templateUrl: './deputy-cif.component.html',
  styleUrls: ['./deputy-cif.component.scss']
})
export class DeputyCifComponent implements OnInit {
  CUSTOMER_TYPE = GlobalConstant.CUSTOMER_TYPE;
  ERROR_MESSAGE = ErrorMessage;
  ITEM_STATUS = GlobalConstant.ITEM_STATUS;
  textMessage: TextMessage = new TextMessage();
  ErrorMessage = ErrorMessage;
  deputyForm: FormGroup;
  searchForm: FormGroup;
  categories: CategoryList = new CategoryList();
  objConfigPopup: ObjConfigPopup = new ObjConfigPopup();
  viewCountry: any = [];
  submitted: boolean;
  searchButton = false;
  hiddenInfomation: boolean;
  hiddenEdit: boolean;
  hiddenButtonUPdate: boolean;
  hiddenSave = true;
  hiddenStatus = false;
  checkDateOfBirth: boolean;
  objDeputyCif: GuardianList = new GuardianList();
  lstDeputyCif: GuardianList[] = [];
  disableForm: boolean;
  // searchCustomer: any;
  // typeSearchCustomer: any;
  lstRelationShip: Category[] = [];
  showVisa = false;
  // valueVisaExemption: boolean;
  booleanVisaExpireDate: boolean;
  relationshipName: string = null;
  dupplicateNumberGTXM: boolean;
  flatUpdate = false;
  isViewMode = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private dialogRef: MatDialogRef<DeputyCifComponent>,
    private category: CategoryService,
    private relationshipListService: RelationshipListService) {
  }

  ngOnInit(): void {

    this.getForm();
    this.searchForm = new FormGroup({
      searchCustomer: new FormControl({ value: null, disabled: false }, Validators.required),
      customerType: new FormControl('CHUNG MINH NHAN DAN')
    });
    if (this.data.data.length > 0) {
      // console.log('this.data.data', this.data.data);
      this.lstDeputyCif = this.data.data;
    }
    this.isViewMode = this.data.isViewMode;
    this.categoriesLoader();
    this.getRelationShipList();
    this.onChangeCurrentAddress();
    this.onChangeVisaExemption();
    this.onChangeNational();
    // this.f.currentCountryCode.valueChanges.subscribe(x => {
    //   if (x === 'VN') {
    //     this.category.getCities().subscribe(data => {
    //       this.categories.cites = data;
    //       // if (x !== this.process.item.customer.person.currentCountryCode) {
    //       //   this.f.currentCityName.setValue(null);
    //       //   this.f.currentDistrictName.setValue(null);
    //       //   this.f.currentWardName.setValue(null);
    //       // }
    //     });
    //   } else {
    //     this.categories.cites = [];
    //     this.categories.currentDistricts = [];
    //     this.categories.currentWards = [];
    //     this.f.currentCityName.setValue(null);
    //     this.f.currentDistrictName.setValue(null);
    //     this.f.currentWardName.setValue(null);
    //   }
    //
    // });
    // console.log('lstDeputyCif', this.lstDeputyCif);
  }

  addOption = (term) => ({ code: term, name: term });

  getRelationShipList(): void {
    this.relationshipListService.getRelationshipList().subscribe(rs => {
      this.lstRelationShip = rs.items;
    });
  }

  getRelationName(code): string {
    if (this.lstRelationShip.find(x => x.code === code)) {
      return this.lstRelationShip.find(x => x.code === code).name;
    }

  }
  // tslint:disable-next-line:typedef
  get s() {
    return this.searchForm.controls;
  }

  // tslint:disable-next-line:typedef
  get f() {
    return this.deputyForm.controls;
  }

  // changeTypeSearchCustomer(value: any) {
  //   this.typeSearchCustomer = value
  // }

  validateGTXM(group: FormGroup): ValidationErrors | null {
    if (group.controls.perDocTypeCode.value === 'CHUNG MINH NHAN DAN') {
      group.controls.perDocNo.setValidators([Validators.required, Validators.minLength(9) || Validators.maxLength(12)]);

    } else if (group.controls.perDocTypeCode.value === 'CAN CUOC CONG DAN') {
      group.controls.perDocNo.setValidators([Validators.required, Validators.maxLength(12), Validators.minLength(12)]);
    } else if (group.controls.perDocTypeCode.value === 'HO CHIEU') {
      group.controls.perDocNo.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9]\d*$/)]);
    } else if (group.controls.perDocTypeCode.value === 'GIAY KHAI SINH') {
      group.controls.perDocNo.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9]\d*$/)]);
    }

    return null;
  }

  getForm(): void {
    this.deputyForm = new FormGroup({
      id: new FormControl(null),
      customerId: new FormControl(null),
      personId: new FormControl(null),
      perDocNoId: new FormControl(null),
      perDocTypeCode: new FormControl('', Validators.required),
      customerCode: new FormControl(''),
      fullName: new FormControl({ value: null, disabled: false }, Validators.required),
      residentStatus: new FormControl({ value: true, disabled: false }, Validators.required),
      dateOfBirth: new FormControl({ value: null, disabled: false }, [Validators.required, futureDate, is18YearOld]),
      perDocNo: new FormControl({ value: null, disabled: false }, [Validators.required, ValidatorSpace.cannotContainSpace]),
      genderCode: new FormControl({ value: 'M', disabled: false }, Validators.required),
      issuePlace: new FormControl({ value: null, disabled: false }, Validators.required),
      mobileNo: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.minLength(10), checkPhonesNumber]),
      issueDate: new FormControl({ value: null, disabled: false }, [Validators.required, futureDate]),
      guardianRelationCode: new FormControl({ value: null, disabled: false }, Validators.required),
      nationality1Code: new FormControl({ value: null, disabled: false }, Validators.required),
      status: new FormControl({ value: null, disabled: false }),
      visaExemption: new FormControl({ value: false, disabled: false }),
      visaIssueDate: new FormControl({ value: null, disabled: false }),
      visaExpireDate: new FormControl({ value: null, disabled: false }),
      taxCode: new FormControl({ value: null, disabled: false }, Validators.required),
      inEffect: new FormControl(null),
      currentCountryCode: new FormControl({ value: null, disabled: false }, Validators.required),
      currentCityName: new FormControl({ value: null, disabled: false }, Validators.required),
      currentDistrictName: new FormControl({ value: null, disabled: false }, Validators.required),
      currentWardName: new FormControl({ value: null, disabled: false }, Validators.required),
      currentStreetNumber: new FormControl({ value: null, disabled: false }, Validators.required)
    }, { validators: [IssueDate('dateOfBirth', 'issueDate'), this.validateGTXM] });
  }

  // tslint:disable-next-line:typedef
  get perDocTypeCode() {
    return this.deputyForm.get('perDocTypeCode') as FormControl;
  }

  search(): void {
    this.searchButton = true;
    const data = {
      px: '',
      position_top: '',
      data: {
        customerCode: this.searchForm.controls.searchCustomer.value,
        type: this.searchForm.controls.customerType.value,
      },
      index: 0
    };
    if (this.searchForm.valid) {
      const dialogRef = this.dialog.open(PopupSearchComponent, DialogConfig.configDialogSearch(data));
      dialogRef.afterClosed().subscribe(rs => {
        // console.log('tsssss', rs);
        if (rs === 1) {
          this.hiddenInfomation = true;
          this.deputyForm.reset();
          this.deputyForm.enable();
          this.hiddenSave = true;
          this.deputyForm.get('currentCountryCode').setValue(this.viewCountry[0].code);
          this.deputyForm.get('nationality1Code').setValue(this.viewCountry[0].code);
          // this.deputyForm.markAsUntouched();
        } else if (rs === 0) {
          this.hiddenInfomation = false;
        } else {
          this.hiddenInfomation = true;
          this.hiddenSave = true;
          // console.log('rs', rs);
          const valueForm = {
            fullName: rs.fullName,
            perDocTypeCode: rs.perDocTypeCode,
            perDocNo: rs.identifyNumber,
            dateOfBirth: rs.dateOfBirth,
            issuePlace: rs.identifyAddress,
            genderCode: rs.gender,
            issueDate: rs.identifyDate,
            mobileNo: rs.phoneNumber,
            // residentStatus: true,
            customerCode: rs.customerCode,
            currentCityName: rs.currentCityName,
            currentDistrictName: rs.currentDistrictName,
            currentWardName: rs.currentWardName,
            currentStreetNumber: rs.currentStreetNumber,
            taxCode: rs.taxCode
          };
          this.deputyForm.patchValue(valueForm);
          this.deputyForm.markAsUntouched();
          // this.deputyForm.disable();
          // this.deputyForm.get('id').setValue(-2);
          // this.deputyForm.get('currentCountryCode').reset({value: this.viewCountry[0].code, disabled: false});
          // // this.deputyForm.get('issueDate').reset({value: null, disabled: false});
          // this.deputyForm.get('taxCode').reset({value: null, disabled: false});
          // this.deputyForm.get('guardianRelationCode').reset({value: null, disabled: false});
          // this.deputyForm.get('nationality1Code').reset({value: this.viewCountry[0].code, disabled: false});
          // this.deputyForm.get('residentStatus').reset({value: true, disabled: false});
          // this.deputyForm.get('currentWardName').reset({value: null, disabled: false});
          // this.deputyForm.get('currentCityName').reset({value: null, disabled: false});
          // this.deputyForm.get('currentStreetNumber').reset({value: null, disabled: false});
          // this.deputyForm.get('currentDistrictName').reset({value: null, disabled: false});
          // Object.keys(this.deputyForm.controls).forEach(key => {
          //   if (key === 'visaIssueDate' || key === 'visaExpireDate') {
          //     this.deputyForm.controls[key].reset({value: this.deputyForm.get(key).value, disabled: keyCheck})
          //   }
          // });
          // this.relationshipType.enable();
          // this.deputyForm.controls.relationshipType.setValue(null);
          // this.deputyForm.controls.nationality.enable();
          // this.deputyForm.controls.editable.setValue(0);
        }
        // this.deputyForm.get('perDocNo').setValue(this.searchForm.controls.searchCustomer.value);

      });
    }
  }

  categoriesLoader(): void {
    this.category.getIndustries().subscribe(data => this.categories.industries = data);
    this.category.getGenders().subscribe(data => this.categories.genders = data);
    this.category.getPerDocTypes().subscribe(data => this.categories.perDocTypes = data.filter(a => a.statusCode === 'A'));
    // this.category.getMaritalStatus().subscribe(data => this.categories.maritalStatus = data)
    this.category.getCountries().subscribe(data => {
      this.categories.countries = data;
      this.viewCountry = this.categories.countries.filter(e => e.code === 'VN');
      this.deputyForm.get('nationality1Code').setValue(this.viewCountry[0].code);
      this.deputyForm.get('currentCountryCode').setValue(this.viewCountry[0].code);
    });
    this.category.getCities().subscribe(data => {
      this.categories.cites = data;
    });
  }

  changeRelationship(): void {
    this.lstRelationShip.filter(element => {
      if (element.code === this.deputyForm.get('guardianRelationCode').value) {
        this.relationshipName = element.name;
      }
    });
  }

  onChangeVisaExemption(): void {
    this.deputyForm.get('visaExemption').valueChanges.subscribe(x => {
      if (x) {
        this.deputyForm.get('visaIssueDate').reset();
        this.deputyForm.get('visaIssueDate').disable();
        this.deputyForm.get('visaExpireDate').reset();
        this.deputyForm.get('visaExpireDate').disable();

      } else {
        this.deputyForm.get('visaIssueDate').enable();
        this.deputyForm.get('visaExpireDate').enable();
        this.deputyForm.get('visaIssueDate').setValidators([Validators.required, futureDate]);
        this.deputyForm.get('visaExpireDate').setValidators([Validators.required, pastDate]);
      }
    });
  }

  onChangeNational(): void {
    // console.log(this.deputyForm.get('nationality1Code').value);
    this.deputyForm.get('nationality1Code').valueChanges.subscribe(data => {
      if (data === 'VN') {
        // console.log('vao day roi');
        this.deputyForm.get('visaIssueDate').clearValidators();
        this.deputyForm.get('visaExpireDate').clearValidators();
        this.deputyForm.get('visaExemption').setValue(true);
      } else {
        this.deputyForm.get('visaIssueDate').setValidators([Validators.required, futureDate]);
        this.deputyForm.get('visaExpireDate').setValidators([Validators.required, pastDate]);
        this.deputyForm.get('visaExemption').setValue(false);
      }
      // for (let i = 0; i < this.perDocNoList.length; i++) {
      //   this.perDocNoList.at(i).updateValueAndValidity({onlySelf: true, emitEvent: true});
      // }
    });
  }

  onChangeCurrentAddress(): void {
    this.f.currentCountryCode.valueChanges.subscribe(x => {
      if (x === 'VN') {
        this.category.getCities().subscribe(data => {
          this.categories.cites = data;
          if (x !== this.f.nationality2) {
            this.f.currentCityName.setValue(null);
            this.f.currentDistrictName.setValue(null);
            this.f.currentWardName.setValue(null);
          }
        });
      } else {
        this.categories.cites = [];
        this.categories.currentDistricts = [];
        this.categories.currentWards = [];
        this.f.currentCityName.setValue(null);
        this.f.currentDistrictName.setValue(null);
        this.f.currentWardName.setValue(null);
      }
    });

    this.f.currentCityName.valueChanges.subscribe(x => {
      this.category.getDistrictByCityId(x).subscribe(data => {
        this.categories.currentDistricts = data;
        if (x !== this.f.currentCityName) {
          this.f.currentDistrictName.setValue(null);
          this.f.currentWardName.setValue(null);
        }
      });
    });

    this.f.currentDistrictName.valueChanges.subscribe(x => {
      this.category.getWardByDistrictId(x).subscribe(data => {
        this.categories.currentWards = data;
        if (x !== this.f.currentDistrictName) {
          this.f.currentWardName.setValue(null);
        }
      });
    });
  }

  // onVisaExemptionChange() {
  //   // this.submitted = false
  //   if (this.deputyForm.get('visaExemption').value === '1') {
  //     this.valueVisaExemption = true
  //     this.setFalseVisaIssueDateAndVisaExpireDate(true)
  //     this.clearValidatorVisaIssueDateAndVisaExpireDate()
  //   } else {
  //     this.booleanVisaExpireDate = false
  //     this.valueVisaExemption = false
  //     this.setFalseVisaIssueDateAndVisaExpireDate(false)
  //     this.setValidatorVisaIssueDateAndVisaExpireDate()
  //   }
  // }

  // changeVisaExpireDate() {
  //   let visaIssueDate = this.deputyForm.get('visaIssueDate').value
  //   let visaExpireDate = this.deputyForm.get('visaExpireDate').value
  //   this.booleanVisaExpireDate = visaExpireDate !== null && visaIssueDate !== null
  // && visaExpireDate.getTime() < visaIssueDate.getTime() ? true : false
  // }

  // ChangeNationality() {
  //   this.showVisa = this.deputyForm.get('nationality1Code').value === 'VN' ? false : true
  //   if (this.showVisa) {
  //     // this.setFalseVisaIssueDateAndVisaExpireDate(true)
  //     this.deputyForm.get('visaExemption').setValue('2');
  //     this.setValidatorVisaIssueDateAndVisaExpireDate();
  //   } else {
  //     this.clearValidatorVisaIssueDateAndVisaExpireDate()
  //   }
  // }
  //
  // setValidatorVisaIssueDateAndVisaExpireDate() {
  //   this.f.visaIssueDate.setValidators([Validators.required, futureDate])
  //   this.f.visaExpireDate.setValidators([Validators.required, pastDate])
  //
  //   this.f.visaIssueDate.updateValueAndValidity()
  //   this.f.visaExpireDate.updateValueAndValidity()
  // }
  //
  // clearValidatorVisaIssueDateAndVisaExpireDate() {
  //   this.f.visaIssueDate.clearValidators()
  //   this.f.visaExpireDate.clearValidators()
  //
  //   this.f.visaIssueDate.updateValueAndValidity()
  //   this.f.visaExpireDate.updateValueAndValidity()
  // }
  //
  // setFalseVisaIssueDateAndVisaExpireDate(keyCheck: boolean) {
  //   Object.keys(this.deputyForm.controls).forEach(key => {
  //     if (key === 'visaIssueDate' || key === 'visaExpireDate') {
  //       this.deputyForm.controls[key].reset({value: this.deputyForm.get(key).value, disabled: keyCheck})
  //     }
  //   });
  // }

  // createNew() {
  //   this.submitted = false
  //   this.searchButton = false
  //   this.searchForm.get('searchCustomer').setValue(null)
  //   this.hiddenSave = true
  //   this.hiddenEdit = false
  //   this.hiddenButtonUPdate = false
  //   this.disableForm = false
  //   this.resetForm()
  //   this.flatUpdate = false
  // }

  // resetForm() {
  //   Object.keys(this.deputyForm.controls).forEach(key => {
  //     if (key != 'nationality1Code' && key != 'currentCountryCode') {
  //       this.deputyForm.controls[key].reset({value: null, disabled: false})
  //     } else {
  //       this.deputyForm.controls[key].reset({value: this.viewCountry[0].code, disabled: false})
  //     }
  //   });
  //   // Object.keys(this.searchForm.controls).forEach(key => {
  //   //   this.searchForm.controls[key].reset({value: null, disabled: false})
  //   // });
  // }

  clickViewDetail(item: GuardianList): void {
    // this.objDeputyCif = item
    this.flatUpdate = true;
    this.hiddenEdit = true;
    this.hiddenButtonUPdate = false;
    this.hiddenSave = false;
    this.hiddenInfomation = true;
    this.objDeputyCif = item;
    this.fillDataInForm(item);
  }

  fillDataInForm(item: GuardianList): void {
    // console.log('item', item);
    this.deputyForm.patchValue(item.customer.person, { emitEvent: false });
    this.deputyForm.get('id').setValue(item.id);
    this.deputyForm.get('guardianRelationCode').setValue(item.guardianRelationCode);
    this.deputyForm.get('perDocTypeCode').setValue(item.customer.person.perDocNoList[0].perDocTypeCode);
    this.deputyForm.get('perDocNo').setValue(item.customer.person.perDocNoList[0].perDocNo);
    this.deputyForm.get('issuePlace').setValue(item.customer.person.perDocNoList[0].issuePlace);
    this.deputyForm.get('issueDate').setValue(new Date(item.customer.person.perDocNoList[0].issueDate));
    this.deputyForm.get('inEffect').setValue(item.inEffect);
    this.deputyForm.get('customerId').setValue(item.customer.id);
    this.deputyForm.get('personId').setValue(item.customer.person.id);
    this.deputyForm.get('perDocNoId').setValue(item.customer.person.perDocNoList[0].id);
    this.deputyForm.get('customerCode').setValue(item.customer.customerCode);
    // if (item.customer.person.visaExemption !== null || item.customer.person.visaIssueDate !== null) {
    //   this.showVisa = true
    // }
    // if (item.customer.person.currentCityName !== null) {
    //   this.category.getDistrictByCityId(this.f.currentCityName.value).subscribe(data => {
    //     this.categories.currentDistricts = data
    //   })
    // }
    // if (item.customer.person.currentDistrictName !== null) {
    //   this.category.getWardByDistrictId(this.f.currentDistrictName.value).subscribe(data => {
    //     this.categories.currentWards = data
    //   })
    // }
    Object.keys(this.deputyForm.controls).forEach(key => {
      this.deputyForm.controls[key].reset({ value: this.deputyForm.get(key).value, disabled: true }, { emitEvent: false });
    });
  }
  //
  // checkWhenSave() {
  //   this.submitted = true
  //   let dateOfBirth = this.deputyForm.get('dateOfBirth').value
  //   // this.checkDateOfBirth = dateOfBirth !== null && dateOfBirth.getTime() > new Date().getTime() ? true : false
  //   this.changeVisaExpireDate()
  //   let value: string
  //   if (this.deputyForm.get('perDocNo').value !== null) {
  //     value = this.deputyForm.get('perDocNo').value.toString().trim()
  //   }
  //   let arr = this.lstDeputyCif.filter(e => e.customer.person.perDocNoList[0].perDocNo === value)
  //   // nêu thêm mới mà flatupdate = false
  //   if (arr.length > 0 && !this.flatUpdate) {
  //     this.notificationService.showError(this.textMessage.contentNumberGTXMExist, '')
  //     this.dupplicateNumberGTXM = true
  //   }
  //   // nếu update mà flatupdate = true
  //   else if (arr.length > 0 && this.flatUpdate) {
  //     let arrUpdate = arr.filter(e => e.customer.person.perDocNoList[0].perDocNo ===
  // value && this.objDeputyCif.customer.person.idIndex !== e.customer.person.idIndex)
  //     this.dupplicateNumberGTXM = arrUpdate.length > 0 ? true : false
  //     if (this.dupplicateNumberGTXM) {
  //       this.notificationService.showError(this.textMessage.contentNumberGTXMExist, '')
  //     }
  //   } else {
  //     this.dupplicateNumberGTXM = false
  //   }
  // }

  // showDisableDeputyOrSearchForm(deputy: boolean, search: boolean) {
  //   Object.keys(this.deputyForm.controls).forEach(key => {
  //     this.deputyForm.controls[key].reset({value: this.deputyForm.get(key).value, disabled: deputy})
  //   });
  //   Object.keys(this.searchForm.controls).forEach(key => {
  //     this.searchForm.controls[key].reset({value: this.searchForm.get(key).value, disabled: search})
  //   });
  // }

  save(): void {
    // tslint:disable-next-line:no-debugger
    debugger;
    if (this.deputyForm.invalid) {
      this.deputyForm.markAllAsTouched();
      return;
    }

    this.deputyForm.get('fullName').setValue(this.deputyForm.get('fullName').value.toUpperCase());
    const obj = ObjCif.returnGuardianList(this.deputyForm.controls);
    obj.customer.mnemonicName = obj.customer.person.fullName + ' ' + obj.customer.person.perDocNoList[0].perDocNo;
    obj.customer.person.relationshipName = this.relationshipName;
    // this.objDeputyCif = obj;

    const index = this.lstDeputyCif.findIndex(x => x.id === this.deputyForm.get('id').value);
    if (index >= 0) {
      this.lstDeputyCif[index] = obj;
    } else {
      // obj.id = String(this.lstDeputyCif.length - 1);
      // this.registerForm.get('status').setValue('Thêm mới');
      this.lstDeputyCif.push(obj);
    }
    // this.showDisableDeputyOrSearchForm(true, true);
    this.hiddenEdit = true;
    this.hiddenButtonUPdate = false;
    this.hiddenSave = false;
    this.disableForm = true;
    this.deputyForm.disable({ emitEvent: false });

    // console.log('this.lstDeputyCif', this.lstDeputyCif);
    // this.lstDeputyCif.push(obj)
    // this.clearData(1)
  }

  closeDialog(index: any): void {
    const item = {
      number: 0
    };
    item.number = 17;
    const dialogRefConfirm = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRefConfirm.afterClosed().subscribe(rs => {
      if (rs === 1) {
        // console.log(this.lstDeputyCif);
        this.dialogRef.close({
          data: this.lstDeputyCif
        });
      }
    });


  }

  delete(index): void {
    this.submitted = false;
    this.searchButton = false;
    this.disableForm = false;
    const item = [];
    // tslint:disable-next-line:no-string-literal
    item['number'] = 18;
    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRef.afterClosed().subscribe(rs => {

      if (rs === 1) {
        // console.log('abcxyz' , rs);
        this.lstDeputyCif.splice(index, 1);
        // this.lstDeputyCif[index].actionCode = 'D';
        // this.deputyForm.get('actionCode').setValue('D');
        this.deputyForm.reset();
        this.deputyForm.enable();
      }
      // console.log('actionCode-Deputy', this.lstDeputyCif);
    }
    );
  }

  edit(item): void {
    // console.log('item', item);
    this.hiddenStatus = true;
    this.hiddenSave = true;
    this.hiddenInfomation = true;

    this.fillDataInForm(item);
    this.deputyForm.enable({ emitEvent: false });

    this.deputyForm.get('visaExemption').updateValueAndValidity({ onlySelf: true, emitEvent: true });
  }

  inputLatinUppercase(event): void {
    event.target.value = this.toNoSign(event.target.value);
  }
  toNoSign(value): any {
    if (value === '') {
      return '';
    }
    let str = value;
    str = str.replace(/Á|À|Ạ|Ả|Ã|Â|Ấ|Ầ|Ậ|Ẩ|Ẫ|Ă|Ắ|Ằ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/É|È|Ẹ|Ẻ|Ẽ|Ê|Ế|Ề|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Í|Ì|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ó|Ò|Ọ|Ỏ|Õ|Ô|Ố|Ồ|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ú|Ù|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ý|Ỳ|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/1|2|3|4|5|6|7|8|9|0|-|=|/g, '');
    str = str.replace(/~|`|!|@|#|%|&|(|)|_/g, '');
    str = str.replace(/,|<|>|'|;|'|:|/g, '');
    // console.log('after ', str);
    return str;
  }
}
