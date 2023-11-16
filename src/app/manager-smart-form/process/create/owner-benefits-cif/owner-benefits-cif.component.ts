import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryList } from 'src/app/_models/category/categoryList';
import { OwnerBenefitsCif } from 'src/app/_models/ownerBenefitsCif';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { CategoryService } from 'src/app/_services/category/category.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { ObjConfigPopup } from 'src/app/_utils/_objConfigPopup';
import { ObjCif } from 'src/app/_utils/_returnObjCif';
import { TextMessage } from 'src/app/_utils/_textMessage';
import { ValidatorSpace } from 'src/app/_validator/otp.validator';
import { GlobalConstant } from '../../../../_utils/GlobalConstant';
import {
  BiggerDate,
  checkPhonesNumber,
  dateValidator,
  dateValidator2,
  futureDate, IssueDate,
  pastDate
} from '../../../../_validator/cif.register.validator';

declare var $: any;

@Component({
  selector: 'app-owner-benefits-cif',
  templateUrl: './owner-benefits-cif.component.html',
  styleUrls: ['./owner-benefits-cif.component.scss']
})
export class OwnerBenefitsCifComponent implements OnInit {
  PERMANENT_ADDRESS = GlobalConstant.PERMANENT_ADDRESS;
  CURRENT_ADDRESS = GlobalConstant.CURRENT_ADDRESS;
  ITEM_STATUS = GlobalConstant.ITEM_STATUS;
  MODE = GlobalConstant.MODE;
  mode: string;
  textMessage: TextMessage = new TextMessage();
  objConfigPopup: ObjConfigPopup = new ObjConfigPopup();
  ownerBenefitsCifForm: FormGroup;
  categories: CategoryList = new CategoryList();
  viewCountry: any = [];
  lstOwnerBenefitsCif: OwnerBenefitsCif[] = [];
  objOwnerBenefitsCif: OwnerBenefitsCif = new OwnerBenefitsCif();
  submitted: boolean;
  showInfomation: boolean;
  checkDateOfBirth: boolean;
  tmpCountries: any;
  hiddenEdit: boolean;
  hiddenButtonUPdate: boolean;
  hiddenSave = true;
  hiddenNational2: boolean;
  hiddenNational3: boolean;
  hiddenNational4: boolean;
  disabledBoolean: boolean;
  nationalBoolean2: boolean;
  nationalBoolean3: boolean;
  nationalBoolean4: boolean;
  nationalDuplicationBoolean: boolean;
  nationalDuplicationBoolean2: boolean;
  nationalDuplicationBoolean3: boolean;
  nationalDuplicationBoolean4: boolean;
  strName: string;
  showVisa = false;
  valueVisaExemption: boolean;
  booleanVisaExpireDate: boolean;
  flatUpdate = false;
  dupplicateNumberGTXM: boolean;
  hiddenSaveUpdate: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private dialogRef: MatDialogRef<OwnerBenefitsCifComponent>,
    private category: CategoryService,
    private notificationService: NotificationService, private el: ElementRef) {
  }

  ngOnInit(): void {
    // this.onChangeNational();
    this.getForm();
    // this.mode = this.MODE.CREATE;
    this.onChangeNational();
    if (this.data.data.length > 0) {
      this.lstOwnerBenefitsCif = this.data.data;
    }
    this.onChangeCurrentAddress('nationalityPresent', 'currentProvincePresent', 'currentDistrictPresent', 'currentWardsPresent', true);
    this.onChangeCurrentAddress('nationalityResident', 'currentProvinceResident', 'currentDistrictResident', 'currentWardsResident', false);
    this.categoriesLoader();
    // this.ownerBenefitsCifForm.get('nationalityPresent').valueChanges.subscribe(data => {
    //   if(data === 'VN') {
    //     this.category.getCities().subscribe(data => {
    //       this.categories.cites = data;
    //     });
    //   } else {
    //     this.categories.cites = [];
    //     this.categories.currentDistricts = [];
    //     this.categories.currentWards = [];
    //     this.ownerBenefitsCifForm.get('currentProvincePresent').setValue(null);
    //     this.ownerBenefitsCifForm.get('currentDistrictPresent').setValue(null);
    //     this.ownerBenefitsCifForm.get('currentWardsPresent').setValue(null);
    //   }
    // });
    // this.ownerBenefitsCifForm.get('nationalityResident').valueChanges.subscribe(data => {
    //   if(data === 'VN') {
    //     this.category.getCities().subscribe(data => {
    //       this.categories.permanentCites = data;
    //     });
    //   } else {
    //     this.categories.permanentCites = [];
    //     this.categories.permanentDistricts = [];
    //     this.categories.permanentWards = [];
    //     this.ownerBenefitsCifForm.get('currentProvinceResident').setValue(null);
    //     this.ownerBenefitsCifForm.get('currentDistrictResident').setValue(null);
    //     this.ownerBenefitsCifForm.get('currentWardsResident').setValue(null);
    //   }
    // })
    if (this.data.isViewMode) {
      this.ownerBenefitsCifForm.disable();
    }
  }
  getName(code): string {
    if (this.categories.countries && this.categories.countries.find(x => x.code === code)) {
      return this.categories.countries.find(x => x.code === code).name;
    }

  }

  getForm(): void {
    this.ownerBenefitsCifForm = new FormGroup({
      id: new FormControl(null),
      inEffect: new FormControl(null),
      fullName: new FormControl({ value: null, disabled: false }, Validators.required),
      numberGTXM: new FormControl({ value: null, disabled: false }, [Validators.required, ValidatorSpace.cannotContainSpace]),
      dateOfBirth: new FormControl({ value: null, disabled: false }, [Validators.required, futureDate]),
      issuedBy: new FormControl({ value: null, disabled: false }, [Validators.required]),
      nationality: new FormControl({ value: null, disabled: false }, Validators.required),
      nationality2: new FormControl({ value: null, disabled: false }),
      nationality3: new FormControl({ value: null, disabled: false }),
      nationality4: new FormControl({ value: null, disabled: false }),
      dateOfAgreement: new FormControl({ value: null, disabled: false }, [Validators.required, futureDate]),
      resident: new FormControl({ value: true, disabled: false }, Validators.required),
      phone: new FormControl({ value: null, disabled: false }, [Validators.maxLength(11), Validators.minLength(11), checkPhonesNumber]),
      job: new FormControl({ value: null, disabled: false }, [Validators.required]),
      smartPhone: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.maxLength(10), checkPhonesNumber,
      Validators.minLength(10)]),
      regency: new FormControl({ value: null, disabled: false }, [Validators.required]),
      placeOfBirth: new FormControl({value: null, disabled: false}),
      genderCode: new FormControl('M', [Validators.required]),
      email: new FormControl({ value: null, disabled: false }, [Validators.email]),
      nationalityResident: new FormControl({ value: null, disabled: false }),
      nationalityPresent: new FormControl({ value: null, disabled: false }, Validators.required),
      currentProvinceResident: new FormControl({ value: null, disabled: false }, Validators.required),
      currentProvincePresent: new FormControl({ value: null, disabled: false }, Validators.required),
      currentDistrictResident: new FormControl({ value: null, disabled: false }, Validators.required),
      currentDistrictPresent: new FormControl({ value: null, disabled: false }, Validators.required),
      currentWardsResident: new FormControl({ value: null, disabled: false }, Validators.required),
      currentWardsPresent: new FormControl({ value: null, disabled: false }, Validators.required),
      numberHomeResident: new FormControl({ value: null, disabled: false }, Validators.required),
      numberHomePresent: new FormControl({ value: null, disabled: false }, Validators.required),
      visaExemption: new FormControl({ value: null, disabled: false }),
      visaIssueDate: new FormControl({ value: null, disabled: false }, [futureDate]),
      visaExpireDate: new FormControl({ value: null, disabled: false }, [pastDate]),
    }, { validators: [IssueDate('dateOfBirth', 'dateOfAgreement')] });
  }

  get f(): any {
    return this.ownerBenefitsCifForm.controls;
  }

  onChangeNational(): void {
    // console.log(this.ownerBenefitsCifForm.get('nationality').value);
    this.ownerBenefitsCifForm.get('nationality').valueChanges.subscribe(data => {
      if (data === 'VN') {
        // console.log('vao day roi');
        this.ownerBenefitsCifForm.get('visaIssueDate').clearValidators();
        this.ownerBenefitsCifForm.get('visaExpireDate').clearValidators();
        this.ownerBenefitsCifForm.get('visaExemption').setValue(true);
      } else {
        // console.log('vào đây nữa thì chịu');
        this.ownerBenefitsCifForm.get('visaIssueDate').setValidators([Validators.required, futureDate]);
        this.ownerBenefitsCifForm.get('visaExpireDate').setValidators([Validators.required, pastDate]);
        this.ownerBenefitsCifForm.get('visaExemption').setValue(false);
      }
      // for (let i = 0; i < this.perDocNoList.length; i++) {
      //   this.perDocNoList.at(i).updateValueAndValidity({onlySelf: true, emitEvent: true});
      // }
    });
  }

  onAddressChange(controlName: string): void {
    switch (controlName) {
      case 'currentProvincePresent':

        // will get list of district on city id
        if (this.f.currentProvincePresent.value !== '' &&
          this.f.currentProvincePresent.value != null) {
          this.category.getDistrictByCityId(this.f.currentProvincePresent.value).subscribe
            (data => this.categories.currentDistricts = data);
          this.f.currentDistrictPresent.setValue(null);
          this.f.currentWardsPresent.setValue(null);
        } else {
          this.categories.currentDistricts = [];
          this.f.currentDistrictPresent.setValue(null);
          this.categories.currentWards = [];
          this.f.currentWardsPresent.setValue(null);
        }
        break;
      case 'currentDistrictPresent':
        // will get list of ward on district id
        if (this.f.currentDistrictPresent.value !== '' &&
          this.f.currentDistrictPresent.value != null) {
          this.category.getWardByDistrictId(this.f.currentDistrictPresent.value).subscribe
            (data => this.categories.currentWards = data);
          this.f.currentWardsPresent.setValue(null);
        } else {
          this.categories.currentWards = [];
          this.f.currentWardsPresent.setValue(null);
        }
        break;
      case 'currentProvinceResident':
        // will get list of district on city id
        if (this.f.currentProvinceResident.value !== '' && this.f.currentProvinceResident.value != null) {
          this.category.getDistrictByCityId(this.f.currentProvinceResident.value).subscribe
            (data => this.categories.permanentDistricts = data);
          this.f.currentDistrictResident.setValue(null);
          this.f.currentWardsResident.setValue(null);
        } else {
          this.categories.permanentDistricts = [];
          this.f.currentDistrictResident.setValue(null);
          this.categories.permanentWards = [];
          this.f.currentWardsResident.setValue(null);
        }
        break;
      case 'currentDistrictResident':
        // will get list of ward on district id
        if (this.f.currentDistrictResident.value !== '' && this.f.currentDistrictResident.value != null) {
          this.category.getWardByDistrictId(this.f.currentDistrictResident.value).subscribe(data => this.categories.permanentWards = data);
          this.f.currentWardsResident.setValue(null);
        } else {
          this.categories.permanentWards = [];
          this.f.currentWardsResident.setValue(null);
        }
        break;
      default:
        // to do
        break;
    }
  }

  onSubmit(): void {
    if (this.ownerBenefitsCifForm.valid) {
      this.ownerBenefitsCifForm.get('fullName').setValue(this.ownerBenefitsCifForm.get('fullName').value.toUpperCase());
      // console.log(this.ownerBenefitsCifForm.value);
      const index = this.lstOwnerBenefitsCif.findIndex(x => x.id === this.ownerBenefitsCifForm.get('id').value);
      // console.log(index, this.ownerBenefitsCifForm.get('id').value);

      if (index >= 0) {
        this.lstOwnerBenefitsCif[index] = this.ownerBenefitsCifForm.value;
      } else {
        // this.ownerBenefitsCifForm.get('id').setValue(this.lstOwnerBenefitsCif.length - 1);
        // this.registerForm.get('status').setValue('Thêm mới');
        this.lstOwnerBenefitsCif.push(this.ownerBenefitsCifForm.value);
      }
      this.ownerBenefitsCifForm.disable();
      this.mode = this.MODE.VIEW;
      // this.mode = this.MODE.VIEW;
    } else {
      this.ownerBenefitsCifForm.markAllAsTouched();
      this.findInvalidControlsRecursive(this.ownerBenefitsCifForm).forEach((item) => {
        // console.log('item invalid', item);
      });
    }
  }
  // categoriesLoader(): void {
  //   this.category.getIndustries().subscribe(data => this.categories.industries = data);
  //   this.category.getGenders().subscribe(data => this.categories.genders = data);
  //   this.category.getCountries().subscribe(data => {
  //     this.categories.countries = data;
  //     // this.viewCountry = this.categories.countries.filter(e => e.code === 'VN' || e.id === 'VN');
  //   });
  //   this.category.getApiFATCA().subscribe(data => this.categories.fatca = data);
  //   this.category.getPerDocTypes().subscribe(data => {
  //     if (this.isUpdateCif && this.processId) {
  //       this.categories.perDocTypes = data;
  //     } else {
  //       this.categories.perDocTypes = data.filter(a => a.statusCode === 'A');
  //     }

  //   });
  //   this.category.getCities().subscribe(data => {
  //     this.categories.cites = data;
  //     this.categories.permanentCites = data;
  //   });
  //   this.category.getPerDocPlace().subscribe(data => {
  //     this.options = data;
  //     // this.categories.perDocPlaces = data;
  //   });
  // }

  categoriesLoader(): void {
    this.category.getIndustries().subscribe(data => this.categories.industries = data);
    this.category.getGenders().subscribe(data => this.categories.genders = data);
    // this.category.getMaritalStatus().subscribe(data => this.categories.maritalStatus = data)
    this.category.getCountries().subscribe(data => {
      this.categories.countries = data;
      this.viewCountry = this.categories.countries.filter(e => e.code === 'VN');
      this.ownerBenefitsCifForm.get('nationality').setValue(this.viewCountry[0].code);
      this.ownerBenefitsCifForm.get('nationalityResident').setValue(this.viewCountry[0].code);
      this.ownerBenefitsCifForm.get('nationalityPresent').setValue(this.viewCountry[0].code);
    });
    this.category.getCities().subscribe(data => {
      this.categories.cites = data;
      this.categories.permanentCites = data;
    });

  }

  onChangeCurrentAddress(region, city, district, ward, isCurrent): void {

    this.ownerBenefitsCifForm.get(region).valueChanges.subscribe(x => {
      // console.log('x', x);
      if (x === 'VN') {
        this.category.getCities().subscribe(data => {
          if (isCurrent) {
            this.categories.cites = data;
          } else {
            this.categories.permanentCites = data;
          }
          if (x !== this.ownerBenefitsCifForm.get(region).value) {
            this.ownerBenefitsCifForm.get(city).setValue(null);
            this.ownerBenefitsCifForm.get(district).setValue(null);
            this.ownerBenefitsCifForm.get(ward).setValue(null);
          }
        });
      } else {
        if (isCurrent) {
          this.categories.cites = [];
          this.categories.currentDistricts = [];
          this.categories.currentWards = [];
        } else {
          this.categories.permanentCites = [];
          this.categories.permanentDistricts = [];
          this.categories.permanentWards = [];
        }
        this.ownerBenefitsCifForm.get(city).setValue(null);
        this.ownerBenefitsCifForm.get(district).setValue(null);
        this.ownerBenefitsCifForm.get(ward).setValue(null);
      }

    });

    this.ownerBenefitsCifForm.get(city).valueChanges.subscribe(x => {
      // console.log('testtt');
      this.category.getDistrictByCityId(x).subscribe(data => {
        if (isCurrent) {
          this.categories.currentDistricts = data;
        } else {
          this.categories.permanentDistricts = data;
        }
        if (x !== this.ownerBenefitsCifForm.get(city).value) {
          this.ownerBenefitsCifForm.get(district).setValue(null);
          this.ownerBenefitsCifForm.get(ward).setValue(null);
        }
      });
    });

    this.ownerBenefitsCifForm.get(district).valueChanges.subscribe(x => {
      this.category.getWardByDistrictId(x).subscribe(data => {
        if (isCurrent) {
          this.categories.currentWards = data;
        } else {
          this.categories.permanentWards = data;
        }
        if (x !== this.ownerBenefitsCifForm.get(district).value) {
          this.ownerBenefitsCifForm.get(ward).setValue(null);
        }
      });
    });

  }

  createNew(): void {
    this.submitted = false;
    this.hiddenSave = true;
    this.hiddenEdit = false;
    this.hiddenButtonUPdate = false;
    this.flatUpdate = false;
    this.disabledBoolean = false;

    if (!this.showInfomation) {
      this.showInfomation = true;
    } else {
      this.categories.currentDistricts = [];
      this.categories.currentWards = [];
      this.categories.permanentDistricts = [];
      this.categories.permanentWards = [];
      Object.keys(this.ownerBenefitsCifForm.controls).forEach(key => {
        if (key === 'nationalityResident' || key === 'nationalityPresent' || key === 'nationality') {
          this.ownerBenefitsCifForm.controls[key].reset({ value: this.viewCountry[0].code, disabled: false });
        } else if (key === 'resident') {
          this.ownerBenefitsCifForm.controls[key].reset({ value: true, disabled: false });
        } else {
          this.ownerBenefitsCifForm.controls[key].reset({ value: null, disabled: false });
        }
      });
    }
    this.mode = this.MODE.CREATE;
  }

  editForm(item): void {
    this.detailOwnerBenefitsCif(item);
    // this.disabledBoolean = false;
    // this.flatUpdate = true;
    // Object.keys(this.ownerBenefitsCifForm.controls).forEach(key => {
    //   this.ownerBenefitsCifForm.controls[key].reset({value: this.ownerBenefitsCifForm.get(key).value, disabled: false});
    // });
    // console.log('item', item);

    this.mode = this.MODE.EDIT;
    this.showInfomation = true;
    this.ownerBenefitsCifForm.enable();
    this.ownerBenefitsCifForm.patchValue(item);
    this.onVisaExemptionChange();
    // this.hiddenEdit = false;
    // this.hiddenSave = false;
    // this.hiddenButtonUPdate = true;
  }

  checkNationalDuplicate(index: any): void {
    const national = this.ownerBenefitsCifForm.get('nationality').value;
    const national2 = this.ownerBenefitsCifForm.get('nationality2').value;
    const national3 = this.ownerBenefitsCifForm.get('nationality3').value;
    const national4 = this.ownerBenefitsCifForm.get('nationality4').value;

    if (index === 1) {
      this.nationalDuplicationBoolean = national === national2 || national === national3 || national === national4
        ? true : false;
      if (national === null) {
        this.nationalDuplicationBoolean2 = national2 !== null && (national2 === national3 || national2 === national4) ? true : false;
        this.nationalDuplicationBoolean3 = national3 !== null && (national3 === national2 || national3 === national4) ? true : false;
        this.nationalDuplicationBoolean4 = national4 !== null && (national4 === national2 || national4 === national3) ? true : false;
      }
    }
    if (index === 2) {
      this.nationalBoolean2 = national2 === null ? true : false;
      this.nationalDuplicationBoolean2 = national2 !== null && (national2 === national || national2 === national3 ||
        national2 === national4) ? true : false;
      if (national2 === null) {
        this.nationalDuplicationBoolean = national !== null && (national === national3 || national === national4) ? true : false;
        this.nationalDuplicationBoolean3 = national3 !== null && (national3 === national || national3 === national4) ? true : false;
        this.nationalDuplicationBoolean4 = national4 !== null && (national4 === national || national4 === national3) ? true : false;
      }
    }
    if (index === 3) {
      this.nationalBoolean3 = national3 === null ? true : false;
      this.nationalDuplicationBoolean3 = national3 !== null && (national3 === national || national3 === national2 ||
        national3 === national4) ? true : false;
      if (national3 === null) {
        this.nationalDuplicationBoolean = national !== null && (national === national2 || national === national4) ? true : false;
        this.nationalDuplicationBoolean2 = national2 !== null && (national2 === national || national2 === national4) ? true : false;
        this.nationalDuplicationBoolean4 = national4 !== null && (national4 === national2 || national4 === national) ? true : false;
      }
    }
    if (index === 4) {
      this.nationalBoolean4 = national4 === null ? true : false;
      this.nationalDuplicationBoolean4 = national4 !== null && (national4 === national || national4 === national2 ||
        national4 === national3) ? true : false;
      if (national4 === null) {
        this.nationalDuplicationBoolean = national !== null && (national === national2 || national === national3) ? true : false;
        this.nationalDuplicationBoolean2 = national2 !== null && (national2 === national || national2 === national2) ? true : false;
        this.nationalDuplicationBoolean3 = national3 !== null && (national3 === national2 || national3 === national) ? true : false;
      }
    }
  }

  resetBoolean(): void {
    this.nationalDuplicationBoolean = false;
    this.nationalDuplicationBoolean2 = false;
    this.nationalDuplicationBoolean3 = false;
    this.nationalDuplicationBoolean4 = false;
    this.nationalBoolean2 = false;
    this.nationalBoolean3 = false;
    this.nationalBoolean4 = false;
  }

  checkNationalNotSelect(): void {
    if (this.hiddenNational2) {
      this.nationalBoolean2 = this.ownerBenefitsCifForm.get('nationality2').value === null ? true : false;
    }
    if (this.hiddenNational3) {
      this.nationalBoolean3 = this.ownerBenefitsCifForm.get('nationality3').value === null ? true : false;
    }
    if (this.hiddenNational4) {
      this.nationalBoolean4 = this.ownerBenefitsCifForm.get('nationality4').value === null ? true : false;
    }
  }

  // checkWhenSave(): void {
  //   this.submitted = true;
  //   const issueDate = this.ownerBenefitsCifForm.get('dateOfBirth').value;
  //   // this.checkDateOfBirth = issueDate !== null ? (issueDate.getTime() > new Date().getTime() ? true : false) : false;
  //   this.checkNationalNotSelect();
  //   let value: string;
  //   if (this.ownerBenefitsCifForm.get('numberGTXM').value !== null) {
  //     value = this.ownerBenefitsCifForm.get('numberGTXM').value.toString().trim();
  //   }
  //   const arr = this.lstOwnerBenefitsCif.filter(e => e.numberGTXM === value);
  //   if (arr.length > 0 && !this.flatUpdate) {
  //     this.notificationService.showError('Dữ liệu đã tồn tại', '');
  //     this.dupplicateNumberGTXM = true;
  //   } else {
  //     this.dupplicateNumberGTXM = false;
  //   }
  // }
  public findInvalidControls(): any[] {
    const invalid = [];
    const controls = this.ownerBenefitsCifForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
        // console.log(name);
      }
    }
    return invalid;
  }
  save(): void {
    this.findInvalidControls();
    // this.checkWhenSave();
    // if (this.ownerBenefitsCifForm.invalid || this.checkDateOfBirth || this.nationalBoolean2 || this.nationalBoolean3
    //   || this.nationalBoolean4 || this.nationalDuplicationBoolean || this.nationalDuplicationBoolean2 ||
    //   this.nationalDuplicationBoolean3 || this.nationalDuplicationBoolean4 || this.dupplicateNumberGTXM) {
    //   return;
    // }
    // console.log(this.ownerBenefitsCifForm.valid, this.ownerBenefitsCifForm.errors);
    if (this.ownerBenefitsCifForm.valid) {
      this.hiddenEdit = true;
      this.hiddenSave = false;
      this.hiddenButtonUPdate = false;
      this.disabledBoolean = true;
      // Object.keys(this.ownerBenefitsCifForm.controls).forEach(key => {
      //   this.ownerBenefitsCifForm.controls[key].reset({value: this.ownerBenefitsCifForm.get(key).value, disabled: true});
      // });
      const obj = ObjCif.returnOwnerBenefitsCif(this.ownerBenefitsCifForm.controls);
      // if (this.lstOwnerBenefitsCif.length > 0) {
      //   const max = this.lstOwnerBenefitsCif.filter(e => Math.max(e.idIndex));
      //   obj.idIndex = max[0].idIndex + 1;
      // } else {
      //   obj.idIndex = 1;
      // }
      this.getNational(obj);
      obj.nationalityName = this.strName;
      this.objOwnerBenefitsCif = obj;
      this.lstOwnerBenefitsCif.push(obj);
    }

  }


  addNational(): void {
    this.submitted = false;
    this.resetBoolean();
    this.tmpCountries = this.categories.countries;
    if (!this.hiddenNational2) {
      this.hiddenNational2 = true;
    } else if (!this.hiddenNational3) {
      this.hiddenNational3 = true;
    } else if (!this.hiddenNational4) {
      this.hiddenNational4 = true;
    }
  }

  changeNationality(): any {
    this.showVisa = this.ownerBenefitsCifForm.get('nationality').value === 'VN' ? false : true;
    if (this.showVisa) {
      // this.setFalseVisaIssueDateAndVisaExpireDate(false);
      this.ownerBenefitsCifForm.get('visaExemption').setValue(false);
      this.setValidatorVisaIssueDateAndVisaExpireDate();
    } else {
      this.clearValidatorVisaIssueDateAndVisaExpireDate();
    }
  }

  onVisaExemptionChange(): any {
    // this.submitted = false
    if (this.ownerBenefitsCifForm.get('visaExemption').value) {
      this.valueVisaExemption = true;
      this.setFalseVisaIssueDateAndVisaExpireDate(true);
      this.clearValidatorVisaIssueDateAndVisaExpireDate();
    } else {
      this.booleanVisaExpireDate = false;
      this.valueVisaExemption = false;
      this.setFalseVisaIssueDateAndVisaExpireDate(false);
      this.setValidatorVisaIssueDateAndVisaExpireDate();
    }
  }

  setValidatorVisaIssueDateAndVisaExpireDate(): void {
    this.f.visaIssueDate.setValidators([Validators.required, futureDate]);
    this.f.visaExpireDate.setValidators([Validators.required, pastDate]);
    this.f.visaIssueDate.updateValueAndValidity();
    this.f.visaExpireDate.updateValueAndValidity();
  }

  clearValidatorVisaIssueDateAndVisaExpireDate(): void {
    this.f.visaIssueDate.clearValidators();
    this.f.visaExpireDate.clearValidators();
    this.f.visaIssueDate.reset();
    this.f.visaIssueDate.updateValueAndValidity();
    this.f.visaExpireDate.reset();
    this.f.visaExpireDate.updateValueAndValidity();
  }

  setFalseVisaIssueDateAndVisaExpireDate(keyCheck: boolean): void {
    Object.keys(this.ownerBenefitsCifForm.controls).forEach(key => {
      if (key === 'visaIssueDate' || key === 'visaExpireDate') {
        this.ownerBenefitsCifForm.controls[key].reset({
          value: this.ownerBenefitsCifForm.get(key).value,
          disabled: keyCheck
        });
      }
    });
  }

  removeNational(index: any): void {
    if (index === '2') {
      this.hiddenNational2 = false;
      this.ownerBenefitsCifForm.get('nationality2').setValue(null);
    } else if (index === '3') {
      this.hiddenNational3 = false;
      this.ownerBenefitsCifForm.get('nationality3').setValue(null);
    } else {
      this.hiddenNational4 = false;
      this.ownerBenefitsCifForm.get('nationality4').setValue(null);
    }
  }

  closeDialog(index: any): void {
    const item = {
      number: 0
    };
    item.number = 17;
    // if (this.showInfomation) {
    const dialogRefConfirm = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRefConfirm.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.objConfigPopup.data = this.lstOwnerBenefitsCif;
        this.dialogRef.close(this.objConfigPopup);
      }
    });
    // } else {
    //   this.dialogRef.close(index);
    // }
  }

  getNational(value: any): void {
    const nationality = value.nationality !== null ? this.categories.countries.filter(e => e.code === value.nationality) : [];
    const nationality2 = value.nationality2 !== null ? this.categories.countries.filter(e => e.code === value.nationality2) : [];
    const nationality3 = value.nationality3 !== null ? this.categories.countries.filter(e => e.code === value.nationality3) : [];
    const nationality4 = value.nationality4 !== null ? this.categories.countries.filter(e => e.code === value.nationality4) : [];
    const name2 = nationality2.length > 0 ? nationality2[0].name : null;
    const name3 = nationality3.length > 0 ? nationality3[0].name : null;
    const name4 = nationality4.length > 0 ? nationality4[0].name : null;

    this.strName = nationality[0].name +
      (name2 != null ? ',' + name2 : '') +
      (name3 != null ? ',' + name3 : '') +
      (name4 != null ? ',' + name4 : '');
  }

  deleteOwnerBenefitsCif(index): void {
    this.submitted = false;
    this.disabledBoolean = false;
    const item = {
      number: 0
    };
    item.number = 18;

    const dialogRef = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRef.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.lstOwnerBenefitsCif.splice(index, 1);
        this.ownerBenefitsCifForm.reset();
        this.ownerBenefitsCifForm.enable();
      }
    }
    );
  }


  detailOwnerBenefitsCif(item: OwnerBenefitsCif): void {
    // console.log(item);
    this.objOwnerBenefitsCif = item;
    this.flatUpdate = true;
    this.hiddenEdit = false;
    this.hiddenButtonUPdate = false;
    this.hiddenSave = false;
    this.showInfomation = true;
    this.disabledBoolean = true;
    this.mode = this.MODE.VIEW;
    this.ownerBenefitsCifForm.disable({ emitEvent: false });
    this.ownerBenefitsCifForm.patchValue(item, { emitEvent: false });
    // if (item.currentProvincePresent !== null) {
    //   this.category.getDistrictByCityId(this.f.currentProvincePresent.value).subscribe(data => {
    //     this.categories.currentDistricts = data;
    //   });
    // }
    // if (item.currentDistrictPresent !== null) {
    //   this.category.getWardByDistrictId(this.f.currentDistrictPresent.value).subscribe(data => {
    //     this.categories.currentWards = data;
    //   });
    // }
    // if (item.currentProvinceResident !== null) {
    //   this.category.getDistrictByCityId(this.f.currentProvinceResident.value).subscribe(data => {
    //     this.categories.permanentDistricts = data;
    //   });
    // }
    // if (item.currentDistrictResident !== null) {
    //   this.category.getWardByDistrictId(this.f.currentDistrictResident.value).subscribe(data => {
    //     this.categories.permanentWards = data;
    //   });
    // }
  }

  closePopup(): void {
    // this.objConfigPopup.index = index;
    this.objConfigPopup.data = this.lstOwnerBenefitsCif;
    this.dialogRef.close(this.objConfigPopup);
  }

  public findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): string[] {
    const invalidControls: string[] = [];
    const recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) {
          invalidControls.push(field);
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

  addOption = (term) => ({ code: term, name: term });

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
