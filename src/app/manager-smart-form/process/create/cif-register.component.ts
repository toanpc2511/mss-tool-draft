import { Component, Input, OnInit } from '@angular/core';
import { CategoryList } from '../../../_models/category/categoryList';
import { CategoryService } from '../../../_services/category/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ErrorHandlerService } from '../../../_services/error-handler.service';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { CifCondition, cifFormValidator } from '../../../_models/cif';
import { DetailProcess } from '../../../_models/process';
import { compareDate, futureDate, is120YearOld, is14YearOld, isDuplicate, pastDate, checkPhonesNumber, check120YearOld } from '../../../_validator/cif.register.validator';
// import { futureDate, is14YearOld, isDuplicate, pastDate } from '../../../_validator/cif.register.validator';
import { DialogConfig } from '../../../_utils/_dialogConfig';
import { MatDialog } from '@angular/material/dialog';
import { Category } from '../../../_models/category/category';
import * as moment from 'moment';
import { CommissionCifComponent } from './commission-cif/commission-cif.component';
import { ObjConfigPopup } from 'src/app/_utils/_objConfigPopup';
import { ReferenceCifComponent } from './reference-cif/reference-cif.component';
import { DeputyCifComponent } from 'src/app/manager-smart-form/process/create/deputy-cif/deputy-cif.component';
import { OwnerBenefitsCifComponent } from 'src/app/manager-smart-form/process/create/owner-benefits-cif/owner-benefits-cif.component';
import { NotificationService } from 'src/app/_toast/notification_service';
import { GuardianList } from 'src/app/_models/deputy';
import { OwnerBenefitsCif } from 'src/app/_models/ownerBenefitsCif';
import { CommissionCif } from 'src/app/_models/commision';
import { OwnerBenefitsCif2 } from '../../../_models/ownerBenefitsCif2';
import { MisCifComponent } from './mis-cif/mis-cif.component';
import { UdfCifComponent } from './udf-cif/udf-cif.component';
import { Legal } from '../../../_models/process/legal/Legal';
import { LegalCustomer } from '../../../_models/process/legal/LegalCustomer';
import { GlobalConstant } from '../../../_utils/GlobalConstant';
import { ErrorMessage } from '../../../_utils/ErrorMessage';
import { Process } from '../../../_models/process/Process';
import { Observable } from 'rxjs';
import { validateNationality } from '../../../_validator/common.validator';
import { ProcessService } from '../../../_services/process.service';
import { CommonService } from '../../../_services/common.service';
import { GtxmValidator } from '../../../_validator/gtxm.validator';
import { map, startWith } from 'rxjs/operators';
import { PerDocNoList } from '../../../_models/process/PerDocNoList';
import { CoOwnerAccountService } from '../../../_services/co-owner-account.service';
import { SpinnerOverlayService } from '../../../_services/spinner-overlay.service';
declare var $: any;


@Component({
  selector: 'app-cif-register',
  templateUrl: './cif-register.component.html',
  styleUrls: ['./cif-register.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.

  ],
})
export class CifRegisterComponent implements OnInit {
  @Input() accountId = '';
  @Input() processId = '';
  @Input() coOwnerId = '';
  @Input() isUpdateCif = false;
  public mask = {
    guide: true,
    showMask: true,
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  };
  ERROR_MESSAGE = ErrorMessage;
  POPUP_NAME = GlobalConstant.POPUP_NAME;
  ACTION_CODE = GlobalConstant.ACTION_CODE;
  CUSTOMER_TYPE = GlobalConstant.CUSTOMER_TYPE;
  detailProcess: DetailProcess = new DetailProcess(null);
  process: Process = new Process();
  // processId: string;
  ownerBenefitData: OwnerBenefitsCif[] = [];
  showContentFATCA = false;
  categories: CategoryList = new CategoryList();
  // auto complete data
  filteredOptions: Observable<Category[]>[] = [];
  options: Category[] = [];
  isDisplayWarning = false;
  isSameCurrentAddress = false;
  customerId = '';
  personId = '';
  misId = '';
  // actionCode = '';
  checkPhoneIsExist: false;
  invalidPhonePrefix: boolean;
  currentStatusCode: string;
  checkPhoneStatus: boolean;
  isCoOwner = true;
  PHONE_PREFIX_LIST = [];
  objConfigPopup: ObjConfigPopup = {
    px: '1024px',
    position_top: '60px',
    data: {},
    index: 0,
    isViewMode: false
  };
  index = 0;
  addStr: string = null;
  formGroup = this.fb.group({
    id: [''],
    customer: this.fb.group({
      id: [this.customerId],
      processId: [this.processId],
      accountId: [this.accountId],
      person: this.fb.group({
        id: [this.personId],
        perDocNoList: this.fb.array([]),
        fullName: [null, [Validators.required]],
        genderCode: ['M', [Validators.required]],
        dateOfBirth: [null, { updateOn: 'blur', validators: [Validators.required, futureDate, check120YearOld] }],
        mobileNo: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(11), checkPhonesNumber]],
        residentStatus: [true],
        profession: [null, [Validators.required]],
        position: [null, [Validators.required]],
        nationalityList: this.fb.array([
          this.fb.group({
            nationalityCode: ['VN', Validators.required]
          })
        ], [validateNationality()]),
        nationality1Code: [null],
        nationality2Code: [null],
        nationality3Code: [null],
        nationality4Code: [null],
        workPlace: [null, [Validators.required]],
        email: [null, [Validators.email]],
        payStatus: [null],
        creditStatus: [false],
        visaExemption: [null],
        visaIssueDate: [null],
        visaExpireDate: [null],
        residenceCountryCode: ['VN', [Validators.required]],
        residenceCityName: [null, [Validators.required]],
        residenceDistrictName: [null, [Validators.required]],
        residenceWardName: [null, [Validators.required]],
        residenceStreetNumber: [null, [Validators.required]],
        currentCountryCode: ['VN', [Validators.required]],
        currentCityName: [null, [Validators.required]],
        currentDistrictName: [null, [Validators.required]],
        currentWardName: [null, [Validators.required]],
        currentStreetNumber: [null, [Validators.required]],
        taxCode: [null, [Validators.minLength(10)]],
        language: [null],
        fatcaCode: [null],
        fatcaForm: [null],
        fatcaAnswer: [null],
        totalQuantity: ['10'],
        test: ['213123'],
        // }, {validators : [BiggerDate('visaIssueDate', 'visaExpireDate')]}),
      }, { validators: [compareDate('perDocNoList', 'dateOfBirth')] }),
      mis: this.fb.group({
        id: [null],
        cifLoaiCode: [null],
        cifLhktCode: [null],
        cifTpktCode: [null, Validators.required],
        cifTctdCode: [null],
        cifKbhtgCode: [null],
        lhnnntvayCode: [null],
        tdManktCode: [null],
        cifNganhCode: [null],
        cifKh78Code: [null],
        cifPnkhCode: [null],
        comTsctCode: [null],
        dcGhCode: [null],
        hhxnkCode: [null],
        loaiDnCode: [null],
        cifManktCode: [null],
      }),
      udf: this.fb.group({

        id: [null],
        canBoGioiThieu: [null],
        cifPnkhCode: [null, Validators.required],
        tenDoiNgoai: [null],
        website: [null],
        email: [null],
        dienThoai: [null],
        tongSoLdHienTai: [null],
        nganhNgheKinhDoanh: [null],
        tenVietTat: [null],
        hoTenVoChong: [null],
        coCmndHc: [null],
        ngayCapCmndHc: [null],
        noiCapCmndHc: [null],
        vonCoDinh: [null],
        vonLuuDong: [null],
        noPhaiThu: [null],
        noPhaiTra: [null],
        maHuyenThiXaCode: [null],
        viTriToLketVayvonCode: [null],
        maTctdCode: [null],
        tcKTctdCode: [null],
        tongnguonvon: [null],
        kyDanhGiaTvn: [null],
        khachHangCode: [null],
        loaiChuongTrinhCode: [null],
        tuNgay: [null],
        denNgay: [null],
        thuongTatCode: [null],
        khutCode: [null],
        lvUdCnCaoCifCode: [null],
        cnUtpt1483CifCode: [null],
        dbKhVayCode: [null],
        congTyNhaNuocCode: [null],
        groupCodeCode: [null],
        kenhTao: [null],
        cifDinhdanhCode: [null],
        dangkyDvGdemailDvkd: [null],
        tongDoanhThu: [null],
        khoiDonViGioiThieuCode: [null],
        diaBanNongThonCode: [null],
        maCbnvLpbCode: [null],
        cifGiamDoc: [null],
        cifKeToanTruong: [null],
        comboSanPham2018Code: [null],
        expiredDate: [null],
        pnkhKhdk: [null],
        tracuuTtstkwebVivietCode: ['Y', Validators.required],
        sdtNhanSmsGdtetkiem: [null, Validators.required],
        soSoBaoHiemXaHoi: [null],
        nguoiDaidienPhapluat: [null],
        cmndCccdHc: [null],
        nhanHdtQuaMail: [null],
      }),
      guardianList: this.fb.array([]),
      legalList: this.fb.array([]),
      cifLienQuan: this.fb.array([]),
      customerOwnerBenefit: this.fb.array([]),
      customerCode: [null],
      customerTypeCode: [null],
      customerCategoryCode: [null],
      mnemonicName: [null],
      employeeId: [null],
      branchCode: [JSON.parse(localStorage.getItem('userInfo')).branchCode],
      actionCode: [this.ACTION_CODE.C],
      currentStatusCode: [null],
      rdFatca: [null],
      rdCifRefer: ['false'],
      rdLegal: ['false'],
      rdOwnerBenefit: ['false'],
      rdGuardian: ['false'],
      jointStartDate: [null],
      jointEndDate: [null],
    }),
    branchCode: JSON.parse(localStorage.getItem('userInfo')).branchCode
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cifService: ProcessService,
    private location: Location,
    private category: CategoryService,
    private errorHandler: ErrorHandlerService,
    private notificationService: NotificationService,
    private gtxmValidator: GtxmValidator,
    private coOwnerService: CoOwnerAccountService,
    private coOwnerAccountService: CoOwnerAccountService,
    private readonly spinnerOverlayService: SpinnerOverlayService,
    private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.categoriesLoader();
    if (this.coOwnerId) {
      this.getData();
    } else if (this.isUpdateCif && this.processId) {
      this.getDetailCif(this.processId);
    } else {
      this.addIdentify();
    }
    this.checkForCoOwner();
    this.customer.get('processId').setValue(this.processId);
    this.customer.get('accountId').setValue(this.accountId);
    this.customer.get('id').setValue(this.coOwnerId);
    // this.onChangeCurrentAddress();
    // this.onChangePermanentAddress();
    this.person.get('visaExemption').valueChanges.subscribe(x => {
      if (x) {
        this.person.get('visaIssueDate').reset();
        this.person.get('visaIssueDate').disable();
        this.person.get('visaExpireDate').reset();
        this.person.get('visaExpireDate').disable();
      } else {
        this.person.get('visaIssueDate').enable();
        this.person.get('visaIssueDate').setValidators(futureDate);
        this.person.get('visaExpireDate').enable();
        this.person.get('visaExpireDate').setValidators(pastDate);
      }
    });

    this.person.get('dateOfBirth').valueChanges.subscribe(data => {
      const age = moment().diff(data, 'years');
      if (age < 15) {
        this.guardianList.setValidators(Validators.required);
        this.guardianList.updateValueAndValidity();
        this.person.get('profession').setValue(null);
        this.person.get('profession').clearValidators();
        this.person.get('profession').updateValueAndValidity();
        this.person.get('position').setValue(null);
        this.person.get('position').clearValidators();
        this.person.get('position').updateValueAndValidity();
      } else {
        this.guardianList.clearValidators();
        this.guardianList.updateValueAndValidity();
        this.person.get('profession').setValidators([Validators.required]);
        this.person.get('profession').updateValueAndValidity();
        this.person.get('position').setValidators([Validators.required]);
        this.person.get('position').updateValueAndValidity();
      }
      for (let i = 0; i < this.perDocNoList.length; i++) {
        this.perDocNoList.at(i).updateValueAndValidity({ onlySelf: true, emitEvent: true });
      }
    });
    this.nationalityList.controls[0].get('nationalityCode').valueChanges.subscribe(data => {
      if (data && data !== 'VN') {
        this.person.get('visaIssueDate').setValidators([Validators.required, futureDate]);
        this.person.get('visaExpireDate').setValidators([Validators.required, pastDate]);
      } else {
        this.person.get('visaIssueDate').clearValidators();
        this.person.get('visaExpireDate').clearValidators();

      }
      if (data && data === 'US') {
        this.rdFatca.setValue('true');
      }
      for (let i = 0; i < this.perDocNoList.length; i++) {
        this.perDocNoList.at(i).updateValueAndValidity({ onlySelf: true, emitEvent: true });
      }
    });

    this.fatcaCode.valueChanges.subscribe(data => {
      if (data === 'US PERSON') {
        this.fatcaAnswer.setValidators([Validators.required, Validators.minLength(9)]);
        this.fatcaAnswer.updateValueAndValidity({ onlySelf: true });
      } else {
        this.fatcaAnswer.clearValidators();
        this.fatcaAnswer.setValue(null);
        this.fatcaAnswer.updateValueAndValidity({ onlySelf: true });
      }
    });
    this.disableAddress();
    // this.checkPhonesNumber();
    // this.checkIs14yearsOld();

    // this.currentCityName.setValue()
    this.currentCityName.setValue(JSON.parse(localStorage.getItem('userInfo')).cityName);
    this.onAddressChange('currentCityName');
    // this.checkFatca();
  }

  get customer(): FormGroup {
    return this.formGroup.get('customer') as FormGroup;
  }

  get person(): FormGroup {
    return this.formGroup.get('customer').get('person') as FormGroup;
  }

  get perdocList(): FormGroup {
    return this.formGroup.get('customer').get('person').get('perDocNoList') as FormGroup;
  }

  get perdocNo(): FormGroup {
    return this.formGroup.get('customer').get('person').get('perDocNoList').get('perDocNo') as FormGroup;
  }

  get nationalityList(): FormArray {
    return this.formGroup.get('customer').get('person').get('nationalityList') as FormArray;
  }

  get nationality1Code(): FormControl {
    return this.formGroup.get('customer').get('person').get('nationality1Code') as FormControl;
  }

  get nationality2Code(): FormControl {
    return this.formGroup.get('customer').get('person').get('nationality2Code') as FormControl;
  }

  get nationality3Code(): FormControl {
    return this.formGroup.get('customer').get('person').get('nationality3Code') as FormControl;
  }

  get nationality4Code(): FormControl {
    return this.formGroup.get('customer').get('person').get('nationality4Code') as FormControl;
  }

  get nationality5Code(): FormControl {
    return this.formGroup.get('customer').get('nationality5Code') as FormControl;
  }

  get perDocNoList(): FormArray {
    return this.person.get('perDocNoList') as FormArray;
  }

  get perDocTypeCode(): FormControl {
    return this.perDocNoList.get('perDocTypeCode') as FormControl;
  }
  get perDocNo(): FormControl {
    return this.customer.get('person').get('perDocNoList').get('perDocNo') as FormControl;
  }

  get rdFatca(): FormControl {
    return this.customer.get('rdFatca') as FormControl;
  }

  get rdOwnerBenefit(): FormControl {
    return this.customer.get('rdOwnerBenefit') as FormControl;
  }

  get rdCifRefer(): FormControl {
    return this.customer.get('rdCifRefer') as FormControl;
  }

  get rdLegal(): FormControl {
    return this.customer.get('rdLegal') as FormControl;
  }

  get rdGuardian(): FormControl {
    return this.customer.get('rdGuardian') as FormControl;
  }

  get udf(): FormGroup {
    return this.formGroup.get('customer').get('udf') as FormGroup;
  }

  get mis(): FormGroup {
    return this.formGroup.get('customer').get('mis') as FormGroup;
  }

  get cifLienQuan(): FormArray {
    return this.formGroup.get('customer').get('cifLienQuan') as FormArray;
  }

  get legalList(): FormArray {
    return this.formGroup.get('customer').get('legalList') as FormArray;
  }

  get customerOwnerBenefit(): FormArray {
    return this.formGroup.get('customer').get('customerOwnerBenefit') as FormArray;
  }

  get guardianList(): FormArray {
    return this.formGroup.get('customer').get('guardianList') as FormArray;
  }

  get currentCountryCode(): FormControl {
    return this.formGroup.get('customer').get('person').get('currentCountryCode') as FormControl;
  }

  get currentCityName(): FormControl {
    return this.formGroup.get('customer').get('person').get('currentCityName') as FormControl;
  }

  get currentDistrictName(): FormControl {
    return this.formGroup.get('customer').get('person').get('currentDistrictName') as FormControl;
  }

  get currentWardName(): FormControl {
    return this.formGroup.get('customer').get('person').get('currentWardName') as FormControl;
  }

  get currentStreetNumber(): FormControl {
    return this.formGroup.get('customer').get('person').get('currentStreetNumber') as FormControl;
  }

  get residenceCountryCode(): FormControl {
    return this.formGroup.get('customer').get('person').get('residenceCountryCode') as FormControl;
  }

  get residenceDistrictName(): FormControl {
    return this.formGroup.get('customer').get('person').get('residenceDistrictName') as FormControl;
  }

  get residenceCityName(): FormControl {
    return this.formGroup.get('customer').get('person').get('residenceCityName') as FormControl;
  }

  get residenceWardName(): FormControl {
    return this.formGroup.get('customer').get('person').get('residenceWardName') as FormControl;
  }

  get residenceStreetNumber(): FormControl {
    return this.formGroup.get('customer').get('person').get('residenceStreetNumber') as FormControl;
  }

  get fatcaCode(): FormControl {
    return this.formGroup.get('customer').get('person').get('fatcaCode') as FormControl;
  }

  get fatcaForm(): FormControl {
    return this.formGroup.get('customer').get('person').get('fatcaForm') as FormControl;
  }

  get fatcaAnswer(): FormControl {
    return this.formGroup.get('customer').get('person').get('fatcaAnswer') as FormControl;
  }

  get actionCode(): FormControl {
    return this.formGroup.get('customer').get('actionCode') as FormControl;
  }

  checkUpdateCif(): void {
    if (this.currentStatusCode !== null) {
      this.actionCode.setValue(this.ACTION_CODE.U);
    }
  }

  checkFatca(e): void {
    const fatCa = e.target.value;
    // this.rdFatca.valueChanges.subscribe(x => {
    // tslint:disable-next-line:no-debugger
    debugger;
    if (fatCa !== 'true') {
      this.fatcaCode.setValue(null);
      this.fatcaForm.setValue(null);
      this.fatcaAnswer.setValue(null);
    } else {
      this.fatcaCode.setValidators([Validators.required]);
      this.fatcaCode.updateValueAndValidity();
      this.fatcaForm.setValidators([Validators.required]);
      this.fatcaForm.updateValueAndValidity();
    }
    // });
  }

  getData(): void {
    this.coOwnerAccountService.detailCoOwner(this.coOwnerId).subscribe(data => {
      if (data.item) {
        this.process.item.customer = data.item;
        if (data.item.person.fatcaCode != null) {
          this.showContentFATCA = true;
        }
        this.customer.patchValue(data.item, { emitEvent: false, onlySelf: true });
        this.initPerDocNoList(this.process.item.customer.person.perDocNoList);
      }
    }, error => {
      this.errorHandler.showError(error);
      // this.missionService.setLoading(false)
    }
    );
  }

  backPage(): void {
    this.location.back();
  }

  showPopup(popupName: string): void {
    const obj = {
      px: '1500px',
      position_top: '',
      data: {
        cifs: [],
        isKHHH: false
      },
      index: 0,
      isViewMode: false
    };
    // console.log('mis', this.customerOwnerBenefit);
    if (popupName === this.POPUP_NAME.MIS) {
      this.objConfigPopup.data = this.mis.value;
      const dialogRef = this.dialog.open(MisCifComponent, DialogConfig.configPopupCif(this.objConfigPopup));
      this.mis.markAsTouched({ onlySelf: true });
      dialogRef.afterClosed().subscribe(rs => {
        this.mis.patchValue(rs.data);
      }
      );
    } else if (popupName === this.POPUP_NAME.UDF) {
      this.udf.get('sdtNhanSmsGdtetkiem').setValue(this.person.get('mobileNo').value);
      this.udf.markAsTouched({ onlySelf: true });
      // sdtNhanSmsGdtetkiem
      // this.udf.get('tracuuTtstkwebVivietCode').setValue('Y');
      this.objConfigPopup.data = this.udf.value;
      const dialogRef = this.dialog.open(UdfCifComponent, DialogConfig.configPopupCif(this.objConfigPopup));
      dialogRef.afterClosed().subscribe(rs => {
        this.udf.patchValue(rs.data);
      }
      );
    } else if (popupName === this.POPUP_NAME.CIF_REFER) {
      this.rdCifRefer.setValue('true');
      obj.data = {
        cifs: this.cifLienQuan.value,
        isKHHH: this.process.item.statusCode === 'A' ? true : false
      };
      const dialog = this.dialog.open(ReferenceCifComponent, DialogConfig.configPopupCif(obj));
      dialog.afterClosed().subscribe(rs => {
        if (rs.cifs.length <= 0) {
          this.rdCifRefer.setValue('false');
        } else {
          this.initCifLienQuan(rs.cifs);
        }
      }
      );
    } else if (popupName === this.POPUP_NAME.LEGAL) {
      this.rdLegal.setValue('true');
      const legalList = [] as CommissionCif[];
      this.legalList?.value.forEach(item => {
        item.customerList.forEach(item2 => {
          const legal = new CommissionCif();
          legal.assetValue = item.amount;
          // legal.idTTPL = item.idTTPL;
          legal.id = item.id;
          legal.idTTPL = item.idTTPL;
          legal.numberIdentification = item.legalCode;
          legal.description = item.content;
          legal.nationality = item.nationalityCode;
          legal.dateOfAgreement = moment.utc(item.beginDate);
          legal.status = item.status;
          legal.legalAgreementCode = item.legalAgreementCode;
          legal.inEffect = item.inEffect;
          legal.PersonInEffect = item2.person.inEffect;
          legal.PersonStatus = item2.person.status;
          legal.idCustomer = item2.id;
          legal.idPerson = item2.person.id;
          legal.idIndex = item2.person.idIndex;
          legal.fullName = item2.person.fullName;
          legal.dateOfBirth = item2.person.dateOfBirth;
          legal.phone = item2.person.mobileNo;
          legal.nationality2 = item2.person.currentCountryCode;
          legal.currentProvince = item2.person.currentCityName;
          legal.currentDistrict = item2.person.currentDistrictName;
          legal.currentWards = item2.person.currentWardName;
          legal.numberHome = item2.person.currentStreetNumber;
          legal.idGTXM = item2.person.perDocNoList[0].id;
          legal.numberGTXM = item2.person.perDocNoList[0].perDocNo;
          legal.issueDate = item2.person.perDocNoList[0].issueDate;
          legal.issuedBy = item2.person.perDocNoList[0].issuePlace;
          legal.obj = item2.obj;
          legalList.push(legal);
        });

      });
      // objConfigPopup.data = this.process.item.legalList;
      this.objConfigPopup.data = legalList;
      const dialog = this.dialog.open(CommissionCifComponent, DialogConfig.configPopupCif(this.objConfigPopup));
      dialog.afterClosed().subscribe(rs => {
        const legalList2 = [] as Legal[];
        Object.entries(rs.data).forEach(([key, item]) => {
          const legal = new Legal();
          const values = key.split('_');
          const customerList: LegalCustomer[] = [];
          legal.id = values[0];
          legal.amount = values[1];
          legal.legalCode = values[2];
          legal.content = values[3];
          legal.nationalityCode = values[4];
          legal.beginDate = values[5];
          legal.inEffect = values[10];
          if (legal.id === 'null') {
            legal.id = null;
          }
          if (legal.inEffect === 'null') {
            legal.inEffect = null;
          } else if (legal.inEffect === 'false') {
            legal.inEffect = false;
          } else if (legal.inEffect === 'true') {
            legal.inEffect = true;
          }
          // @ts-ignore
          item.forEach((item2) => {
            // console.log('item2 aaaa', item2);
            legal.status = item2.status;
            customerList.push({
              id: item2.idCustomer,
              legalId: item2.idIndex,
              person: {
                id: item2.idPerson,
                idIndex: item2.idIndex,
                fullName: item2.fullName,
                inEffect: item2.PersonInEffect,
                status: item2.PersonStatus,
                dateOfBirth: item2.dateOfBirth,
                mobileNo: item2.phone,
                currentCountryCode: item2.nationality2,
                currentCityName: item2.currentProvince,
                currentDistrictName: item2.currentDistrict,
                currentWardName: item2.currentWards,
                currentStreetNumber: item2.numberHome,
                obj: item2.obj,
                taxCode: 'string',
                language: 'string',
                // status: item2.status,
                perDocNoList: [{
                  perDocNo: item2.numberGTXM,
                  issueDate: item2.issueDate,
                  issuePlace: item2.issuedBy,
                  id: item2.idGTXM,
                  personId: '',
                  perDocIndex: '1',
                  perDocTypeCode: '',
                  perDocTypeName: '',
                  expireDate: ''
                }],
              },
              customerCode: 'INDIV',
              customerTypeCode: 'INDIV',
              customerCategoryCode: 'INDIV',
              actionCode: 'C',
              obj: item2.obj
            });
          });
          legal.customerList = customerList;
          legalList2.push(legal);
        });
        // console.log('legalList', legalList2);
        this.initLegalList(legalList2);
        if (legalList2.length <= 0) {
          this.rdLegal.setValue('false');
        }
      });
    } else if (popupName === this.POPUP_NAME.OWNER_BENEFIT) {
      this.rdOwnerBenefit.setValue('true');
      this.ownerBenefitData = [];
      this.customerOwnerBenefit.value.forEach((item, index) => {
        this.ownerBenefitData.push({
          id: item.id,
          codeOwnerBenefits: '',
          fullName: item.name,
          numberGTXM: item.identityNumber,
          dateOfBirth: moment.utc(new Date(item.dateOfBirth)).format('yyyy-MM-DD'),
          issuedBy: item.identityAddress,
          nationality: item.national,
          nationality2: '',
          nationality3: '',
          nationality4: '',
          nationalityName: '',
          dateOfAgreement: moment.utc(new Date(item.identityDate)).format('yyyy-MM-DD'),
          resident: item.isResident,
          phone: item.phoneNumber,
          job: item.job,
          smartPhone: item.phoneNumber2,
          regency: item.position,
          email: item.email,
          inEffect: item.inEffect,
          nationalityResident: item.paddressRegion,
          nationalityPresent: item.caddressRegion,
          currentProvinceResident: item.paddressCity,
          currentProvincePresent: item.caddressCity,
          currentDistrictResident: item.paddressDistrict,
          currentDistrictPresent: item.caddressDistrict,
          currentWardsResident: item.paddressWard,
          currentWardsPresent: item.caddressWard,
          numberHomeResident: item.paddress,
          numberHomePresent: item.caddress,
          visaExemption: item.visaExemption,
          visaIssueDate: item.visaIssueDate,
          visaExpireDate: item.visaExpireDate,
          number: 0,
          currentStatusCode: item.currentStatusCode,
          status: item.status,
          ownerBenefitCode: item.ownerBenefitCode,
          genderCode: item.genderCode,
          placeOfBirth: item.placeOfBirth
        });
      });
      this.objConfigPopup.data = this.ownerBenefitData;
      const dialog = this.dialog.open(OwnerBenefitsCifComponent, DialogConfig.configPopupCif(this.objConfigPopup));
      dialog.afterClosed().subscribe(rs => {
        const customerOwnerBenefit = [] as OwnerBenefitsCif2[];
        // console.log('customerOwnerBenefit', rs.data);
        rs.data.forEach((element) => {
          customerOwnerBenefit.push({
            id: element.id,
            customerId: element.customerId,
            codeOwnerBenefits: element.codeOwnerBenefits,
            name: element.fullName,
            dateOfBirth: element.dateOfBirth,
            national: element.nationality,
            isResident: element.resident,
            job: element.job,
            inEffect: element.inEffect,
            position: element.regency,
            identityNumber: element.numberGTXM,
            identityAddress: element.issuedBy,
            identityDate: element.dateOfAgreement,
            phoneNumber: element.phone,
            phoneNumber2: element.smartPhone,
            paddressRegion: element.nationalityResident,
            paddressCity: element.currentProvinceResident,
            paddressDistrict: element.currentDistrictResident,
            paddressWard: element.currentWardsResident,
            paddress: element.numberHomeResident,
            caddressRegion: element.nationalityPresent,
            caddressCity: element.currentProvincePresent,
            caddressDistrict: element.currentDistrictPresent,
            caddressWard: element.currentWardsPresent,
            caddress: element.numberHomePresent,
            visaExemption: element.visaExemption,
            visaIssueDate: element.visaIssueDate,
            visaExpireDate: element.visaExpireDate,
            type: '1',
            email: element.email,
            customerTypeCode: '1',
            currentStatusCode: element.currentStatusCode,
            status: element.status,
            ownerBenefitCode: element.ownerBenefitCode,
            genderCode: element.genderCode,
            placeOfBirth: element.placeOfBirth
          });
        });

        if (customerOwnerBenefit.length > 0) {
          this.initCustomerOwnerBenefit(customerOwnerBenefit);
        } else {
          this.customerOwnerBenefit.clear();
          this.rdOwnerBenefit.setValue('false');
        }

      }
      );
    } else if (popupName === this.POPUP_NAME.GUARDIAN) {
      this.rdGuardian.setValue('true');
      this.objConfigPopup.data = this.guardianList.value;
      const dialog = this.dialog.open(DeputyCifComponent, DialogConfig.configPopupCif(this.objConfigPopup));
      dialog.afterClosed().subscribe(rs => {
        // console.log('rs.data', rs);
        if (rs.data.length > 0) {
          this.initGuardianList(rs.data);
        } else {
          this.rdGuardian.setValue('false');
        }
      }
      );
    }
  }

  categoriesLoader(): void {
    this.category.getIndustries().subscribe(data => this.categories.industries = data);
    this.category.getGenders().subscribe(data => this.categories.genders = data);
    this.category.getCountries().subscribe(data => {
      this.categories.countries = data;
      // this.viewCountry = this.categories.countries.filter(e => e.code === 'VN' || e.id === 'VN');
    });
    // this.category.getPhones().subscribe(data => this.categories.phone = data);
    this.category.getApiFATCA().subscribe(data => this.categories.fatca = data);
    this.category.getApiFATCAForm().subscribe(data => this.categories.fatcaForm = data);
    this.category.getPerDocTypes().subscribe(data => {
      if (this.isUpdateCif && this.processId) {
        this.categories.perDocTypes = data;
      } else {
        this.categories.perDocTypes = data.filter(a => a.statusCode === 'A');
      }

    });
    this.category.getCities().subscribe(data => {
      this.categories.cites = data;
      this.categories.permanentCites = data;
    });
    this.category.getPerDocPlace().subscribe(data => {
      this.options = data;
      // this.categories.perDocPlaces = data;
    });
  }

  managerNameControl(index: number): void {
    this.filteredOptions[index] = this.perDocNoList.at(index).get('issuePlace').valueChanges
      .pipe(
        startWith<string | Category>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );
    this.perDocNoList.at(index).valueChanges.subscribe(data => {
      let expiredDate = null;
      let isDisableIssuedate = false;
      let isDisableExpireddate = false;
      if (data.perDocTypeCode === GlobalConstant.CUSTOMER_TYPE.CMND && data.issueDate) {
        expiredDate = data.issueDate.clone().add(15, 'y');
      } else if (data.perDocTypeCode === GlobalConstant.CUSTOMER_TYPE.HO_CHIEU) {
        const nationalCode = this.nationalityList.controls[0].get('nationalityCode').value;
        if (nationalCode === 'VN') {
          if (data.issueDate) {
            expiredDate = data.issueDate.clone().add(10, 'y');
          }
        } else {
          isDisableExpireddate = false;
        }

      } else if (data.perDocTypeCode === GlobalConstant.CUSTOMER_TYPE.CCCD_2) {
        if (this.person.get('dateOfBirth').value) {
          const age = moment().diff(this.person.get('dateOfBirth').value, 'years');
          const dateOfBirth = moment.utc(new Date(this.person.get('dateOfBirth').value)).clone();
          if (age < 14) {
            isDisableIssuedate = true;
            isDisableExpireddate = true;
          } else if (age < 25 && age >= 14) {
            expiredDate = dateOfBirth.add(25, 'y');
          } else if (age >= 25 && age < 40) {
            expiredDate = dateOfBirth.add(40, 'y');
          } else if (age >= 40) {
            expiredDate = dateOfBirth.add(60, 'y');
          }
        }
      } else {
        isDisableExpireddate = true;
      }
      if (isDisableIssuedate) {
        this.perDocNoList.at(index)
          .get('issueDate').disable({ emitEvent: false, onlySelf: true });
        this.perDocNoList.at(index)
          .get('issueDate').setValue(null, { emitEvent: false, onlySelf: true });
      } else {
        this.perDocNoList.at(index)
          .get('issueDate').enable({ emitEvent: false, onlySelf: true });
      }
      if (isDisableExpireddate) {
        this.perDocNoList.at(index)
          .get('expireDate').disable({ emitEvent: false, onlySelf: true });
        this.perDocNoList.at(index)
          .get('expireDate').setValue(null, { emitEvent: false, onlySelf: true });
      } else {
        this.perDocNoList.at(index)
          .get('expireDate').enable({ emitEvent: false, onlySelf: true });
      }
      const expiredDateLeft = moment().diff(expiredDate, 'years');

      if (expiredDate && expiredDateLeft > 0) {
        this.perDocNoList.at(index)
          .get('isDisplayWarning').setValue(true, { onlySelf: true, emitEvent: false });
      } else {
        this.perDocNoList.at(index)
          .get('isDisplayWarning').setValue(false, { onlySelf: true, emitEvent: false });
      }
      this.perDocNoList.at(index)
        .get('expireDate').setValue(expiredDate, { onlySelf: true });
    });
  }

  private _filter(name: string): Category[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  addOption = (term) => ({ code: term, name: term });

  onSubmit(): void {
    if (this.formGroup.valid) {
      if (this.rdCifRefer.value === 'false') {
        this.customer.removeControl('cifLienQuan');
      }

      if (this.rdLegal.value === 'false') {
        this.customer.removeControl('legalList');
      }
      if (this.rdOwnerBenefit.value === 'false') {
        this.customer.removeControl('customerOwnerBenefit');
      }
      if (this.rdGuardian.value === 'false') {
        this.customer.removeControl('guardianList');
      }

      this.nationality1Code.setValue(this.nationalityList.controls[0].get('nationalityCode').value);
      this.nationality2Code.setValue(null);
      this.nationality3Code.setValue(null);
      this.nationality4Code.setValue(null);
      this.nationalityList.controls.forEach((element, index) => {
        this.person.get('nationality' + (index + 1) + 'Code').setValue(element.get('nationalityCode').value);
      });

      const spinnerSubscription = this.spinnerOverlayService.spinner$.subscribe();
      if (this.accountId && this.processId && !this.coOwnerId && !this.isUpdateCif) {
        this.coOwnerService.create(this.customer.getRawValue()).subscribe(
          data => {
            if (data.responseStatus.success) {
              this.notificationService.showSuccess('Thêm mới Đồng chủ sở hữu thành công', '');
              this.router.navigate(['./smart-form/manager/co-owner/view', {
                processId: this.processId,
                accountId: this.accountId,
                coOwnerId: data.item.id,
                customerId: data.item.customerId
              }]);
            } else {
              this.notificationService.showError('Thêm mới Đồng chủ sở hữu thất bại', '');
            }
          }
          , error => {
            this.errorHandler.showError(error);
          }, () => spinnerSubscription.unsubscribe()
        );
      } else if (this.coOwnerId && !this.isUpdateCif) {
        this.coOwnerService.update(this.customer.getRawValue()).subscribe(
          data => {
            if (data.responseStatus.success) {
              this.notificationService.showSuccess('Cập nhật Đồng chủ sở hữu thành công', '');
              this.router.navigate(['./smart-form/manager/co-owner/view', {
                processId: this.processId,
                accountId: this.accountId,
                coOwnerId: this.coOwnerId,
                customerId: this.coOwnerId
              }]);
            } else {
              this.notificationService.showError('Cập nhật Đồng chủ sở hữu thất bại', '');
            }
          }
          , error => {
            this.errorHandler.showError(error);
          }, () => spinnerSubscription.unsubscribe()
        );
      } else if (this.isUpdateCif && this.processId) {
        this.checkUpdateCif();
        this.cifService.updateCif(this.formGroup.getRawValue()).subscribe(rs => {
          if (rs.responseStatus.success) {
            this.notificationService.showSuccess('Cập nhật khách hàng thành công', '');
            this.router.navigate(['/smart-form/manager/fileProcessed', this.processId]);
          } else {
            this.notificationService.showError('Cập Nhật khách hàng thất bại', '');
          }
        }, error => {
          this.notificationService.showError('Cập nhật khách hàng thất bại', error);
        }, () => spinnerSubscription.unsubscribe());
      } else {
        this.cifService.regiserCif(this.formGroup.getRawValue()).subscribe(rs => {
          if (rs.responseStatus.success) {
            this.notificationService.showSuccess('Thêm mới khách hàng thành công', '');
            this.router.navigate(['/smart-form/manager/fileProcessed', rs.item.id]);
          } else {
            this.notificationService.showError('Thêm mới khách hàng thất bại', '');
          }
        }, error => {
          this.notificationService.showError('Thêm mới khách hàng thất bại', error);
        }, () => spinnerSubscription.unsubscribe());
      }

    } else {
      this.formGroup.markAllAsTouched();
      this.notificationService.showError('Dữ Liệu Không Hợp Lệ', '');
      this.findInvalidControlsRecursive(this.formGroup).every((item) => {
      });
    }
  }

  checkForCoOwner(): void {
    if (this.accountId) {
      this.formGroup.get('customer').get('person').get('dateOfBirth').setValidators(is14YearOld);
      this.isCoOwner = false;
      this.formGroup.get('customer').get('jointStartDate').setValidators([Validators.required]);
      this.formGroup.get('customer').get('jointEndDate').setValidators([Validators.required, pastDate]);
    } else {
      this.isCoOwner = true;
      this.formGroup.get('customer').get('jointStartDate').clearValidators();
      this.formGroup.get('customer').get('jointEndDate').clearValidators();
    }
  }

  onChangeRadio(popupName: string, value: string): void {
    if (popupName === this.POPUP_NAME.CIF_REFER && value === 'true') {
      this.showPopup(this.POPUP_NAME.CIF_REFER);
    } else if (popupName === this.POPUP_NAME.LEGAL && value === 'true') {
      this.showPopup(this.POPUP_NAME.LEGAL);
    } else if (popupName === this.POPUP_NAME.OWNER_BENEFIT && value === 'true') {
      this.showPopup(this.POPUP_NAME.OWNER_BENEFIT);
    } else if (popupName === this.POPUP_NAME.GUARDIAN && value === 'true') {
      this.showPopup(this.POPUP_NAME.GUARDIAN);
    }
  }

  initCifLienQuan(cifLienQuans): void {
    this.cifLienQuan.clear();
    cifLienQuans.forEach(item => {
      this.cifLienQuan.push(this.fb.group({
        id: [item.id],
        customerNo: [item.customerNo],
        customerId: [item.customerId],
        customerCode: [item.customerCode],
        fullName: [item.fullName],
        dateOfBirth: [item.dateOfBirth],
        gender: [item.gender],
        phoneNumber: [item.phoneNumber],
        relationshipType: [item.relationshipType],
        identifyCode: [item.identifyCode],
        perDocTypeCode: [item.perDocTypeCode],
        identifyDate: [item.identifyDate],
        identifyAddress: [item.identifyAddress],
        nationality: [item.nationality],
        numberDecision: [item.numberDecision],
        editable: [item.editable],
        status: [item.status],
        inEffect: [item.inEffect]
      }));
    });
  }

  initLegalList(legalList: Legal[]): void {
    this.legalList.clear();
    legalList?.forEach(item => {
      this.legalList.push(this.fb.group({
        id: [item.id],
        customerList: this.initCustomerList(item.customerList),
        legalCode: [item.legalCode],
        idTTPL: [item.idTTPL],
        amount: [item.amount],
        content: [item.content],
        legalAgreementCode: [item.legalAgreementCode],
        beginDate: [item.beginDate],
        nationalityCode: [item.nationalityCode],
        inEffect: [item.inEffect],
        status: [item.status]
      }));
    });
  }

  initPerDocNoList(perDocNoList: PerDocNoList[]): void {
    this.perDocNoList.clear();
    perDocNoList.forEach((item, index) => {
      this.perDocNoList.push(this.fb.group({
        id: [item.id],
        perDocIndex: [item.perDocIndex],
        perDocTypeCode: [item.perDocTypeCode, [Validators.required]],
        perDocTypeCodeTemp: [item.perDocTypeCode, [Validators.required]],
        perDocNo: [item.perDocNo, [Validators.required]],
        perDocNoTemp: [item.perDocNo, [Validators.required]],
        issueDate: [item.issueDate, [Validators.required, futureDate]],
        issuePlace: [item.issuePlace, [Validators.required]],
        expireDate: [item.expireDate, [Validators.required]],
        isDisplayWarning: [false]
      },
        { asyncValidators: this.gtxmValidator.validate.bind(this.gtxmValidator) }
      ));
      this.managerNameControl(index);
      this.perDocNoList.at(index).updateValueAndValidity({ onlySelf: true, emitEvent: true });
    });
  }

  changeTypeGTXM(): void {
    for (const index in this.categories.perDocTypes) {
      if (this.categories.perDocTypes[index].name ===
        this.perDocNoList.controls[0].get('perDocTypeCode').value) {
        this.perDocNoList.controls[0].get('perDocNo').setValue(null);
        this.addStr = null;
        break;
      }
    }

    const data = this.person.get('dateOfBirth').value;
    const age = moment().diff(data, 'years');

    if (age < 14) {
      if (this.perDocNoList.controls[0].get('perDocTypeCode').value === GlobalConstant.CUSTOMER_TYPE.CMND) {
        this.perDocNoList.controls[0].get('perDocNo').clearValidators();
        this.perDocNoList.controls[0].get('perDocNo').disable();
      }
    } else {
    }
  }

  addIdentify(): void {
    if (this.perDocNoList.length <= 2) {
      this.perDocNoList.push(this.fb.group({
        perDocIndex: [this.perDocNoList.length > 0 ? this.perDocNoList.length - 1 : 0],
        perDocTypeCode: ['', [Validators.required, isDuplicate(this.perDocNoList, this.perDocNoList.length)]],
        perDocNo: ['', [Validators.required]],
        issueDate: [null, [Validators.required, futureDate]],
        issuePlace: [null, [Validators.required]],
        expireDate: [null],
        isDisplayWarning: [false]
      },
        { asyncValidators: this.gtxmValidator.validate.bind(this.gtxmValidator) }
      ));
      // this.perDocNoList.at(this.perDocNoList.length - 1).setAsyncValidators(this.gtxmValidator.validate.bind(this.gtxmValidator));
      this.managerNameControl(this.perDocNoList.length - 1);

    }
  }

  initCustomerOwnerBenefit(datas: OwnerBenefitsCif2[]): void {
    this.customerOwnerBenefit.clear();
    datas.forEach(item => {
      this.customerOwnerBenefit.push(this.fb.group({
        id: [item.id],
        customerId: [item.customerId],
        caddress: [item.caddress],
        caddressCity: [item.caddressCity],
        caddressDistrict: [item.caddressDistrict],
        caddressRegion: [item.caddressRegion],
        caddressWard: [item.caddressWard],
        dateOfBirth: [item.dateOfBirth],
        identityAddress: [item.identityAddress],
        identityDate: [item.identityDate],
        identityNumber: [item.identityNumber],
        isResident: [item.isResident],
        inEffect: [item.inEffect],
        job: [item.job],
        name: [item.name],
        national: [item.national],
        paddress: [item.paddress],
        paddressCity: [item.paddressCity],
        paddressDistrict: [item.paddressDistrict],
        paddressRegion: [item.paddressRegion],
        paddressWard: [item.paddressWard],
        phoneNumber: [item.phoneNumber],
        phoneNumber2: [item.phoneNumber2],
        position: [item.position],
        status: [item.status],
        type: [item.type],
        email: [item.email],
        visaExemption: [item.visaExemption],
        visaIssueDate: [item.visaIssueDate],
        visaExpireDate: [item.visaExpireDate],
        currentStatusCode: [item.currentStatusCode],
        genderCode: [item.genderCode],
        placeOfBirth: [item.placeOfBirth]
      }));
    });
  }

  initGuardianList(datas: GuardianList[]): void {
    this.guardianList.clear();
    datas?.forEach(item => {
      this.guardianList.push(this.fb.group({
        id: [item.id],
        customer: this.fb.group({
          id: [item.customer.id],
          person: this.fb.group({
            id: [item.customer.person.id],
            perDocNoList: this.fb.array([
              this.fb.group({
                id: [item.customer.person.perDocNoList[0].id],
                perDocTypeCode: [item.customer.person.perDocNoList[0].perDocTypeCode],
                perDocNo: [item.customer.person.perDocNoList[0].perDocNo],
                issueDate: [item.customer.person.perDocNoList[0].issueDate],
                issuePlace: [item.customer.person.perDocNoList[0].issuePlace],
              })
            ]),
            fullName: [item.customer.person.fullName],
            genderCode: [item.customer.person.genderCode],
            dateOfBirth: [item.customer.person.dateOfBirth],
            mobileNo: [item.customer.person.mobileNo],
            residentStatus: [item.customer.person.residentStatus],
            nationality1Code: [item.customer.person.nationality1Code],
            currentCountryCode: [item.customer.person.currentCountryCode],
            currentCityName: [item.customer.person.currentCityName],
            currentDistrictName: [item.customer.person.currentDistrictName],
            currentWardName: [item.customer.person.currentWardName],
            currentStreetNumber: [item.customer.person.currentStreetNumber],
            taxCode: [item.customer.person.taxCode],
            visaExemption: [item.customer.person.visaExemption],
            visaIssueDate: [item.customer.person.visaIssueDate, [futureDate]],
            visaExpireDate: [item.customer.person.visaExpireDate, [pastDate]],
          }),
          customerCode: [item.customer.customerCode],
          customerTypeCode: [item.customer.customerTypeCode],
          customerCategoryCode: [item.customer.customerCategoryCode],
          actionCode: [this.ACTION_CODE.C],
        }),
        guardianTypeCode: [item.guardianTypeCode],
        guardianRelationCode: [item.guardianRelationCode],
        actionCode: [this.actionCode.value],
        inEffect: [item.inEffect],
        status: [item.status]
      }));
    });
  }

  initCustomerList(datas: LegalCustomer[]): FormArray {
    const customerList: FormArray = this.fb.array([]);
    datas.forEach(item => {
      customerList.push(this.fb.group({
        id: [item.id],
        person: this.fb.group({
          id: [item.person.id],
          perDocNoList: this.fb.array([
            this.fb.group({
              id: [item.person.perDocNoList[0].id],
              perDocNo: [item.person.perDocNoList[0].perDocNo],
              issueDate: [item.person.perDocNoList[0].issueDate],
              issuePlace: [item.person.perDocNoList[0].issuePlace],
            })
          ]),
          fullName: [item.person.fullName],
          inEffect: [item.person.inEffect],
          status: [item.person.status],
          dateOfBirth: [item.person.dateOfBirth],
          mobileNo: [item.person.mobileNo],
          currentCountryCode: [item.person.currentCountryCode],
          currentCityName: [item.person.currentCityName],
          currentDistrictName: [item.person.currentDistrictName],
          currentWardName: [item.person.currentWardName],
          currentStreetNumber: [item.person.currentStreetNumber],
          taxCode: [item.person.taxCode],
          language: [item.person.language],
          obj: [item.person.obj],
          idIndex: [item.person.idIndex],
        }),
        customerCode: [item.customerCode],
        customerTypeCode: [item.customerTypeCode],
        customerCategoryCode: [item.customerCategoryCode],
        actionCode: [this.ACTION_CODE.C],
        obj: [item.obj],
      }));
    });
    return customerList;
  }

  onChangeCurrentAddress(): void {
    this.currentCountryCode.valueChanges.subscribe(x => {
      if (x === 'VN') {
        this.category.getCities().subscribe(data => {
          this.categories.cites = data;
          if (x !== this.process.item.customer.person.currentCountryCode) {
            this.currentCityName.setValue(null);
            this.currentDistrictName.setValue(null);
            this.currentWardName.setValue(null);
          }
        });
        this.currentCityName.setValidators([Validators.required]);
        this.currentCityName.reset({ value: null, disabled: false });
        this.currentDistrictName.setValidators([Validators.required]);
        this.currentDistrictName.reset({ value: null, disabled: false });
        this.currentWardName.setValidators([Validators.required]);
        this.currentWardName.reset({ value: null, disabled: false });
      } else {
        this.categories.cites = [];
        this.categories.currentDistricts = [];
        this.categories.currentWards = [];
        this.currentCityName.clearValidators();
        this.currentCityName.reset({ value: null, disabled: true });
        this.currentDistrictName.clearValidators();
        this.currentDistrictName.reset({ value: null, disabled: true });
        this.currentWardName.clearValidators();
        this.currentWardName.reset({ value: null, disabled: true });
      }

    });
    this.currentCityName.valueChanges.subscribe(x => {
      this.category.getDistrictByCityId(x).subscribe(data => {
        this.categories.currentDistricts = data;
        if (x !== this.process.item.customer.person.currentCityName) {
          this.currentDistrictName.setValue(null);
          this.currentWardName.setValue(null);
        }
      });
    });
    this.currentDistrictName.valueChanges.subscribe(x => {

      this.category.getWardByDistrictId(x).subscribe(data => {
        this.categories.currentWards = data;
        if (x !== this.process.item.customer.person.currentDistrictName) {
          this.currentWardName.setValue(null);
        }
      });
    });
  }

  // tslint:disable-next-line:typedef
  // tslint:disable-next-line: typedef
  get f() {
    return this.formGroup.controls;
  }

  disableAddress(): void {
    this.currentCountryCode.valueChanges.subscribe(x => {
      if (x !== 'VN') {
        this.currentDistrictName.setValue(null);
        this.currentDistrictName.clearValidators();
        this.currentDistrictName.disable();
        this.currentCityName.setValue(null);
        this.currentCityName.clearValidators();
        this.currentCityName.disable();
        this.currentWardName.setValue(null);
        this.currentWardName.clearValidators();
        this.currentWardName.disable();
      } else {
        this.currentDistrictName.enable();
        this.currentDistrictName.setValidators([Validators.required]);
        this.currentCityName.enable();
        this.currentCityName.setValidators([Validators.required]);
        this.currentWardName.enable();
        this.currentWardName.setValidators([Validators.required]);
      }
    });
    this.residenceCountryCode.valueChanges.subscribe(x => {
      if (x !== 'VN') {
        this.residenceDistrictName.setValue(null);
        this.residenceDistrictName.disable();
        this.residenceDistrictName.clearValidators();
        this.residenceCityName.setValue(null);
        this.residenceCityName.disable();
        this.residenceCityName.clearValidators();
        this.residenceWardName.setValue(null);
        this.residenceWardName.disable();
        this.residenceWardName.clearValidators();
      } else {
        this.residenceDistrictName.enable();
        this.residenceDistrictName.setValidators([Validators.required]);
        this.residenceCityName.enable();
        this.residenceCityName.setValidators([Validators.required]);
        this.residenceWardName.enable();
        this.residenceWardName.setValidators([Validators.required]);
      }
    });
  }

  onAddressChange(controlName: string): void {
    switch (controlName) {
      case 'currentCityName':

        // will get list of district on city id
        if (this.formGroup.get('customer').get('person').get('currentCityName').value !== '' &&
          this.formGroup.get('customer').get('person').get('currentCityName').value != null) {
          this.category.getDistrictByCityId(this.formGroup.get('customer').get('person').get('currentCityName').value).subscribe
            (data => this.categories.currentDistricts = data);
          this.formGroup.get('customer').get('person').get('currentDistrictName').setValue(null);
          this.formGroup.get('customer').get('person').get('currentWardName').setValue(null);
        } else {
          this.categories.currentDistricts = [];
          this.formGroup.get('customer').get('person').get('currentDistrictName').setValue(null);
          this.categories.currentWards = [];
          this.formGroup.get('customer').get('person').get('currentWardName').setValue(null);
        }
        break;
      case 'currentDistrictName':
        // will get list of ward on district id
        if (this.formGroup.get('customer').get('person').get('currentDistrictName').value !== '' &&
          this.formGroup.get('customer').get('person').get('currentDistrictName').value != null) {
          this.category.getWardByDistrictId(this.formGroup.get('customer').get('person').get('currentDistrictName').value).subscribe
            (data => this.categories.currentWards = data);
          this.formGroup.get('customer').get('person').get('currentWardName').setValue(null);
        } else {
          this.categories.currentWards = [];
          this.formGroup.get('customer').get('person').get('currentWardName').setValue(null);
        }
        break;
      case 'residenceCityName':
        // will get list of district on city id
        if (this.formGroup.get('customer').get('person').get('residenceCityName').value !== '' && this.formGroup.get('customer').get('person').get('residenceCityName').value != null) {
          this.category.getDistrictByCityId(this.formGroup.get('customer').get('person').get('residenceCityName').value).subscribe
            (data => this.categories.permanentDistricts = data);
          this.formGroup.get('customer').get('person').get('residenceDistrictName').setValue(null);
          this.formGroup.get('customer').get('person').get('residenceWardName').setValue(null);
        } else {
          this.categories.permanentDistricts = [];
          this.formGroup.get('customer').get('person').get('residenceDistrictName').setValue(null);
          this.categories.permanentWards = [];
          this.formGroup.get('customer').get('person').get('residenceWardName').setValue(null);
        }
        break;
      case 'residenceDistrictName':
        // will get list of ward on district id
        if (this.formGroup.get('customer').get('person').get('residenceDistrictName').value !== '' && this.formGroup.get('customer').get('person').get('residenceDistrictName').value != null) {
          this.category.getWardByDistrictId(this.formGroup.get('customer').get('person').get('residenceDistrictName').value).subscribe
            (data => this.categories.permanentWards = data);
          this.formGroup.get('customer').get('person').get('residenceWardName').setValue(null);
        } else {
          this.categories.permanentWards = [];
          this.formGroup.get('customer').get('person').get('residenceWardName').setValue(null);
        }
        break;
      default:
        // to do
        break;
    }
  }

  onChangePermanentAddress(): void {
    this.residenceCountryCode.valueChanges.subscribe(x => {
      if (x === 'VN') {
        this.category.getCities().subscribe(data => {
          this.categories.permanentCites = data;
          if (x !== this.process.item.customer.person.residenceCountryCode) {
            this.residenceCityName.setValue(null);
            this.residenceDistrictName.setValue(null);
            this.residenceWardName.setValue(null);
          }
        });
        this.residenceCityName.setValidators([Validators.required]);
        this.residenceCityName.reset({ value: null, disabled: false });
        this.residenceDistrictName.setValidators([Validators.required]);
        this.residenceDistrictName.reset({ value: null, disabled: false });
        this.residenceWardName.setValidators([Validators.required]);
        this.residenceWardName.reset({ value: null, disabled: false });
      } else {
        this.categories.permanentCites = [];
        this.categories.permanentDistricts = [];
        this.categories.permanentWards = [];

        this.residenceCityName.clearValidators();
        this.residenceCityName.reset({ value: null, disabled: true });
        this.residenceDistrictName.reset({ value: null, disabled: true });
        this.residenceDistrictName.clearValidators();
        this.residenceWardName.reset({ value: null, disabled: true });
        this.residenceWardName.clearValidators();
      }

    });
    if (this.residenceCityName.value === null || this.residenceCityName.value === undefined) {
      this.residenceCityName.valueChanges.subscribe(x => {

        this.category.getDistrictByCityId(x).subscribe(data => {
          this.categories.permanentDistricts = data;
          if (x !== this.process.item.customer.person.residenceCityName) {
            this.residenceDistrictName.setValue(null);
            this.residenceWardName.setValue(null);
          }
        });
      });
    }
    // this.residenceCityName.valueChanges.subscribe(x => {

    //   this.category.getDistrictByCityId(x).subscribe(data => {
    //     this.categories.permanentDistricts = data;
    //     if (x !== this.process.item.customer.person.residenceCityName) {
    //       this.residenceDistrictName.setValue(null);
    //       this.residenceWardName.setValue(null);
    //     }
    //   });
    // });

    this.residenceDistrictName.valueChanges.subscribe(x => {

      this.category.getWardByDistrictId(x).subscribe(data => {
        this.categories.permanentWards = data;
        if (x !== this.process.item.customer.person.residenceDistrictName) {
          this.residenceWardName.setValue(null);
        }
      });
    });
  }

  isSameAddress(): void {
    this.residenceCountryCode.setValue(this.currentCountryCode.value, { emitEvent: false });
    this.residenceCityName.setValue(this.currentCityName.value, { emitEvent: false });
    this.residenceDistrictName.setValue(this.currentDistrictName.value, { emitEvent: false });
    this.residenceWardName.setValue(this.currentWardName.value, { emitEvent: false });
    this.residenceStreetNumber.setValue(this.currentStreetNumber.value, { emitEvent: false });
  }

  public findInvalidControls(): any {
    const invalid = [];
    const controls = this.formGroup.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  public findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): string[] {
    const invalidControls: string[] = [];
    const recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) {
          if (control instanceof FormGroup) {
            recursiveFunc(control);
          } else if (control instanceof FormArray) {
            recursiveFunc(control);
          } else {
            invalidControls.push(field);
          }

        }
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    };
    recursiveFunc(formToInvestigate);
    return invalidControls;
  }

  addNationality(): void {
    if (this.nationalityList.length <= 3) {
      this.nationalityList.push(this.fb.group({
        nationalityCode: [null, Validators.required]
      }));
    }
  }

  removeNationality(index: number): void {
    if (index !== 0) {
      this.nationalityList.removeAt(index);
    }
  }

  removeIdentify(index: number): void {
    if (index !== 0) {
      this.perDocNoList.removeAt(index);
    }

  }


  getDetailCif(processId): void {
    const condition = new CifCondition();
    condition.id = processId;
    this.cifService.detailProcess(processId).subscribe(data => {
      if (data.item) {
        this.process.item = data.item;
        this.curentAdd(data.item.customer.person.currentCityName, data.item.customer.person.currentDistrictName);
        this.permanentAdd(data.item.customer.person.residenceCityName, data.item.customer.person.residenceDistrictName);
        this.customerId = data.item.customer.id;
        this.personId = data.item.customer.person.id;
        this.misId = data.item.customer.mis.id;
        this.currentStatusCode = data.item.customer.currentStatusCode;
        this.formGroup.patchValue(data.item);
        this.nationalityList.controls[0].get('nationalityCode').setValue(this.nationality1Code.value, Validators.required);
        if (this.nationality2Code.value) {
          this.nationalityList.push(this.fb.group({
            nationalityCode: [this.nationality2Code.value, Validators.required]
          }));
        }
        if (this.nationality3Code.value) {
          this.nationalityList.push(this.fb.group({
            nationalityCode: [this.nationality3Code.value, Validators.required]
          }));
        }
        if (this.nationality4Code.value) {
          this.nationalityList.push(this.fb.group({
            nationalityCode: [this.nationality4Code.value, Validators.required]
          }));
        }

        this.initCifLienQuan(this.process.item.customer.cifLienQuan);
        this.initCustomerOwnerBenefit(this.process.item.customer.customerOwnerBenefit);
        this.initLegalList(this.process.item.customer.legalList);
        this.initGuardianList(this.process.item.customer.guardianList);
        this.initPerDocNoList(this.process.item.customer.person.perDocNoList);
        if (this.person.get('fatcaCode').value) {
          this.rdFatca.setValue('true');
        }

        if (this.cifLienQuan.length > 0) {
          this.rdCifRefer.setValue('true');
        }
        if (this.legalList?.length > 0) {
          this.rdLegal.setValue('true');
        }
        if (this.customerOwnerBenefit.length > 0) {
          this.rdOwnerBenefit.setValue('true');
        }
        if (this.guardianList?.length > 0) {
          this.rdGuardian.setValue('true');
        }
      }
    }, error => {
      this.errorHandler.showError(error);
    }, () => {

    }
    );
  }

  fillDataTest(): void {
    this.getDetailCif('69a3b20e-a39e-42f5-9375-17d3f86a348d');
  }

  inputLatinUppercase(event): void {
    event.target.value = this.toNoSign(event.target.value);
  }
  toNoSign(value): any {
    if (value === '') {
      return '';
    }
    let str = value;
    str = str.replace(/1|2|3|4|5|6|7|8|9|0|-|=|/g, '');
    str = str.replace(/~|`|!|@|#|%|&|(|)|_/g, '');
    str = str.replace(/,|<|>|"|;|'|:|/g, '');
    return str;
  }
  curentAdd(CityId, DistrtictName): void {
    this.category.getDistrictByCityId(CityId).subscribe(data => {
      this.categories.currentDistricts = data;
    });
    this.category.getWardByDistrictId(DistrtictName).subscribe(data => {
      this.categories.currentWards = data;
    });
  }
  permanentAdd(CityId, DistrtictName): void {
    this.category.getDistrictByCityId(CityId).subscribe(data => {
      this.categories.permanentDistricts = data;
    });
    this.category.getWardByDistrictId(DistrtictName).subscribe(data => {
      this.categories.permanentWards = data;
    });
  }

}
