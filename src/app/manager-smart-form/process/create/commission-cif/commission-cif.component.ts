import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryList } from 'src/app/_models/category/categoryList';
import { CommissionCif } from 'src/app/_models/commision';
import { PopupConfirmComponent } from 'src/app/_popup/popup-confirm.component';
import { CategoryService } from 'src/app/_services/category/category.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { DialogConfig } from 'src/app/_utils/_dialogConfig';
import { ObjConfigPopup } from 'src/app/_utils/_objConfigPopup';
import { ObjCommisionCif } from 'src/app/_utils/_returnObjCommisionCif';
import { TextMessage } from 'src/app/_utils/_textMessage';
import { GlobalConstant } from '../../../../_utils/GlobalConstant';
import * as _ from 'lodash';
import { checkPhonesNumber, futureDate, IssueDate } from '../../../../_validator/cif.register.validator';
import { ErrorMessage } from '../../../../_utils/ErrorMessage';

import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-commission-cif',
  templateUrl: './commission-cif.component.html',
  styleUrls: ['./commission-cif.component.scss']
})
export class CommissionCifComponent implements OnInit {
  MODE = GlobalConstant.MODE;
  ERROR_MESSAGE = ErrorMessage;
  ITEM_STATUS = GlobalConstant.ITEM_STATUS;
  textMessage: TextMessage = new TextMessage();
  objConfigPopup: ObjConfigPopup = new ObjConfigPopup();
  commisionForm: FormGroup;
  categories: CategoryList = new CategoryList();
  viewCountry: any = [];
  lstCommisionCif: CommissionCif[] = [];
  objCommisionCif: CommissionCif = new CommissionCif();
  submitted: boolean;
  showInfomationCommission: boolean;
  countPersion = 1;
  checkDateOfBirth: boolean;
  booleanBlockInformationLegalAgreement: boolean;
  hiddenSave = true;
  hiddenEdit: boolean;
  hiddenSaveUpdate: boolean;
  addLegal = false;
  disabledStatus: boolean;
  clearBlockInformationLegalAgreement: boolean;
  dupplicateNumberGTXM: boolean;
  flatUpdate = false;
  mode: string;
  hiddenAddLegal = true;
  showAll = false;
  showOne = true;
  checkInEffect = false;
  checkTA = false;
  checkFA = false;
  checkFI = false;
  checkTI = false;
  checkIn = false;
  checkAC = false;
  lstCommisionCifByIdTTPL: CommissionCif[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CommissionCifComponent>,
    private category: CategoryService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.getForm();
    if (this.data.data.length > 0) {
      // console.log(this.data.data);
      this.lstCommisionCif = this.data.data;
    }
    this.onChangeCurrentAddress();
    this.categoriesLoader();
    // this.commisionForm.get('dateOfAgreement').setValue()
    if (this.data.isViewMode) {
      this.commisionForm.disable();
    }
  }

  getForm(): void {
    this.commisionForm = this.formBuilder.group({
      id: new FormControl({ value: null }),
      dealCode: new FormControl({ value: null, disabled: false }),
      numberIdentification: new FormControl({ value: null, disabled: false }),
      description: new FormControl({ value: null, disabled: false }, Validators.required),
      status: new FormControl({ value: null, disabled: false }),
      assetValue: new FormControl({ value: null, disabled: false }, Validators.required),
      dateOfAgreement: new FormControl({ value: null, disabled: false }, [Validators.required, futureDate]),
      nationality: new FormControl({ value: null, disabled: false }, Validators.required),
      fullName: new FormControl({ value: null, disabled: false }, Validators.required),
      inEffect: new FormControl({ value: null, disabled: false }),
      PersonInEffect: new FormControl({ value: null, disabled: false }),
      PersonStatus: new FormControl({ value: null, disabled: false }),
      dateOfBirth: new FormControl({ value: null, disabled: false }, [Validators.required, futureDate]),
      phone: new FormControl({ value: null, disabled: false }, [Validators.minLength(10), checkPhonesNumber]),
      idGTXM: new FormControl({ value: null, disabled: false }),
      idPerson: new FormControl({ value: null, disabled: false }),
      idCustomer: new FormControl({ value: null, disabled: false }),
      numberGTXM: new FormControl({ value: null, disabled: false }, Validators.required),
      issuedBy: new FormControl({ value: null, disabled: false }),
      issueDate: new FormControl({ value: null, disabled: false }, [Validators.required, futureDate]),
      obj: new FormControl({ value: null, disabled: false }, Validators.required),
      nationality2: new FormControl({ value: null, disabled: false }),
      currentProvince: new FormControl({ value: null, disabled: false }),
      currentDistrict: new FormControl({ value: null, disabled: false }),
      currentWards: new FormControl({ value: null, disabled: false }),
      numberHome: new FormControl({ value: null, disabled: false }),
      idTTPL: new FormControl({ value: null, disabled: false }),
      idIndex: new FormControl({ value: null, disabled: false }),
    }, { validators: [IssueDate('dateOfBirth', 'issueDate')] });
  }

  // tslint:disable-next-line:typedef
  get f() {
    return this.commisionForm.controls;
  }
  // tslint:disable-next-line:typedef

  categoriesLoader(): void {
    this.category.getIndustries().subscribe(data => this.categories.industries = data);
    // this.category.getMaritalStatus().subscribe(data => this.categories.maritalStatus = data)
    this.category.getCountries().subscribe(data => {
      this.categories.countries = data;
      this.viewCountry = this.categories.countries.filter(e => e.code === 'VN');
      this.commisionForm.get('nationality').setValue('VN');
      this.commisionForm.get('nationality2').setValue('VN');
    });
    this.category.getCities().subscribe(data => {
      this.categories.cites = data;
    });
    this.category.getRelationShipLegalList().subscribe(data => {
      this.categories.lstRelationShip = data;
    });
  }

  addOption = (term) => ({ code: term, name: term });

  // tslint:disable-next-line:variable-name
  changeStatus(number: any): void {
    if (number === 1) {
      this.commisionForm.get('status').setValue(true);
    } else {
      this.commisionForm.get('status').setValue(false);
    }
  }

  checkNumberGTXM(): void {
    let value: string;
    if (this.commisionForm.get('numberGTXM').value !== null) {
      value = this.commisionForm.get('numberGTXM').value.toString().trim();
    }
    const arr = this.lstCommisionCif.filter(e => e.numberGTXM === value);
    // nêu thêm mới mà flatupdate = false
    if (arr.length > 0 && !this.flatUpdate) {
      this.notificationService.showError(this.textMessage.contentNumberGTXMExist, '');
      this.dupplicateNumberGTXM = true;
    }
    // nếu update mà flatupdate = true
    else if (arr.length > 0 && this.flatUpdate) {
      const arrUpdate = arr.filter(e => e.numberGTXM === value && this.objCommisionCif.idIndex !== e.idIndex);
      this.dupplicateNumberGTXM = arrUpdate.length > 0 ? true : false;
      if (this.dupplicateNumberGTXM) {
        this.notificationService.showError(this.textMessage.contentNumberGTXMExist, '');
      }
    } else {
      this.dupplicateNumberGTXM = false;
    }
  }

  success(index: any): void {
    this.objConfigPopup.index = index;
    this.objConfigPopup.data = this.lstCommisionCif;
    this.dialogRef.close(this.objConfigPopup);
  }

  clearData(): void {
    this.submitted = false;
    Object.keys(this.commisionForm.controls).forEach(key => {
      if (key === 'nationality2' || key === 'nationality') {
        this.commisionForm.controls[key].reset({ value: this.viewCountry[0].code, disabled: false });
      } else {
        this.commisionForm.controls[key].reset({ value: null, disabled: false });
      }
    });
  }

  clearDataBlockPeopleInvolved(): void {
    this.submitted = false;
    Object.keys(this.commisionForm.controls).forEach(key => {
      if (key === 'nationality2') {
        this.commisionForm.controls[key].reset({ value: this.viewCountry[0].code, disabled: false });
      }
      if (key === 'fullName' || key === 'dateOfBirth' || key === 'phone' || key === 'numberGTXM'
        || key === 'issuedBy' || key === 'issueDate' || key === 'obj' || key === 'currentProvince' ||
        key === 'currentDistrict' || key === 'currentWards' || key === 'numberHome') {
        this.commisionForm.controls[key].reset({ value: null, disabled: false });
      }
    });
  }

  addNew(): void {

    this.hiddenSave = true;
    this.hiddenEdit = false;
    this.hiddenAddLegal = true;
    this.hiddenSaveUpdate = false;
    this.countPersion = 1;
    this.addLegal = false;
    this.clearBlockInformationLegalAgreement = true;

    if (this.showInfomationCommission) {
      this.booleanBlockInformationLegalAgreement = true;
    } else {
      this.showInfomationCommission = true;
    }
    this.showOne = true;
    this.showAll = false;
    // this.commisionForm.reset();
    // let control: AbstractControl = null;
    // this.commisionForm.markAsUntouched();
    // Object.keys(this.commisionForm.controls).forEach((name) => {
    //   control = this.commisionForm.controls[name];
    //   control.setErrors(null);
    // });
    // this.commisionForm.setErrors({invalid: true});
    this.commisionForm.reset();
    this.commisionForm.enable();
    this.commisionForm.get('nationality').setValue('VN');
    this.commisionForm.get('nationality2').setValue('VN');
    this.commisionForm.get('dateOfAgreement').setValue(moment());
    this.mode = this.MODE.CREATE;
  }

  addLegalItem(): void {
    // this.disabledStatus = false;
    this.hiddenSave = true;
    this.hiddenEdit = false;
    this.hiddenSaveUpdate = false;
    this.addLegal = true;
    this.commisionForm.controls.fullName.setValue(null);
    this.commisionForm.controls.fullName.enable();
    this.commisionForm.controls.nationality2.setValue(null);
    this.commisionForm.controls.nationality2.enable();
    this.commisionForm.controls.dateOfBirth.setValue(null);
    this.commisionForm.controls.dateOfBirth.enable();
    this.commisionForm.controls.currentProvince.setValue(null);
    this.commisionForm.controls.currentProvince.enable();
    this.commisionForm.controls.currentDistrict.setValue(null);
    this.commisionForm.controls.currentDistrict.enable();
    this.commisionForm.controls.numberGTXM.setValue(null);
    this.commisionForm.controls.numberGTXM.enable();
    this.commisionForm.controls.phone.setValue(null);
    this.commisionForm.controls.phone.enable();
    this.commisionForm.controls.currentWards.setValue(null);
    this.commisionForm.controls.currentWards.enable();
    this.commisionForm.controls.issuedBy.setValue(null);
    this.commisionForm.controls.issuedBy.enable();
    this.commisionForm.controls.numberHome.setValue(null);
    this.commisionForm.controls.numberHome.enable();
    this.commisionForm.controls.issueDate.setValue(null);
    this.commisionForm.controls.issueDate.enable();
    this.commisionForm.controls.obj.setValue(null);
    this.commisionForm.controls.obj.enable();
  }

  save(): void {
    this.submitted = true;

    const issueDate = this.commisionForm.get('dateOfBirth').value;

    this.checkNumberGTXM();
    if (this.commisionForm.invalid || this.checkDateOfBirth || this.dupplicateNumberGTXM) {
      this.commisionForm.markAllAsTouched();
      return;
    }
    this.commisionForm.get('fullName').setValue(this.commisionForm.get('fullName').value.toUpperCase());
    this.commisionForm.get('status').setValue('NEW');
    this.commisionForm.get('PersonStatus').setValue('NEW');
    const obj = ObjCommisionCif.returnObjCommisionCif(this.commisionForm.controls);
    // console.log('obj', obj);

    this.countPersion = this.countPersion + 1;
    this.hiddenSave = true;
    this.hiddenEdit = false;
    this.hiddenSaveUpdate = false;
    this.flatUpdate = false;
    this.clearBlockInformationLegalAgreement = false;
    this.clearDataBlockPeopleInvolved();
    this.lstCommisionCif.push(obj);
    this.commisionForm.controls.numberIdentification.disable();
    this.commisionForm.controls.assetValue.disable();
    this.commisionForm.controls.description.disable();
    this.commisionForm.controls.nationality.disable();
    this.disabledStatus = true;
    this.addLegal = false;
  }

  saveEdit(): void {
    this.disabledStatus = true;
    this.hiddenSave = false;
    this.hiddenEdit = true;
    this.hiddenSaveUpdate = false;
    const obj = ObjCommisionCif.returnObjCommisionCif(this.commisionForm.controls);
    // console.log(obj);
    if (this.objCommisionCif.id) {
      this.lstCommisionCif.forEach((e, index) => {
        if (this.lstCommisionCif[index].idIndex === this.objCommisionCif.idIndex) {
          obj.idIndex = e.idIndex;
          obj.idTTPL = e.idTTPL;
          obj.idCustomer = e.idCustomer;
          obj.idPerson = e.idPerson;
          obj.idGTXM = e.idGTXM;
          e.PersonInEffect = obj.PersonInEffect;
          // obj.PersonInEffect = e.PersonInEffect;
          this.lstCommisionCif[index] = obj;
          // console.log(e);
          // console.log(this.objCommisionCif.PersonInEffect);
          // if (this.objCommisionCif.PersonInEffect === true && this.objCommisionCif.PersonStatus === 'INACTIVE') {
          //   this.checkInEffect = true;
          // }

          if (this.lstCommisionCif[index].inEffect === false && this.lstCommisionCif[index].status === 'ACTIVE') {
            this.lstCommisionCif[index].PersonInEffect = false;
            this.lstCommisionCif[index].PersonStatus = 'INACTIVE';
            this.checkIn = true;
          } else if (this.lstCommisionCif[index].inEffect === true && this.lstCommisionCif[index].status === 'ACTIVE') {
            if (this.lstCommisionCif[index].PersonInEffect === true && this.lstCommisionCif[index].PersonStatus === 'ACTIVE') {
              this.checkTA = true;
            } else if (this.lstCommisionCif[index].PersonInEffect === false && this.lstCommisionCif[index].PersonStatus === 'ACTIVE') {
              this.checkFA = true;
            }
          } else if (this.lstCommisionCif[index].inEffect === false && this.lstCommisionCif[index].status === 'INACTIVE') {
            if (this.lstCommisionCif[index].PersonInEffect === false && this.lstCommisionCif[index].PersonStatus === 'INACTIVE') {
              this.checkFI = true;
            } else if (this.lstCommisionCif[index].PersonInEffect === true && this.lstCommisionCif[index].PersonStatus === 'INACTIVE') {
              this.checkTI = true;
            }
          } else if (this.lstCommisionCif[index].inEffect === true && this.lstCommisionCif[index].status === 'INACTIVE') {
            this.lstCommisionCif[index].PersonInEffect = true;
            this.lstCommisionCif[index].PersonStatus = 'ACTIVE';
            this.checkAC = true;
          }
          // if (this.objCommisionCif.PersonInEffect === true) {
          //   this.checkInEffect = true;
          // }else {
          //   this.checkInEffect = false;
          // }
          // if (this.checkInEffect === true) {
          //   this.objCommisionCif.inEffect = true;
          // } else {
          //   // tslint:disable-next-line:no-unused-expression
          //   this.objCommisionCif.inEffect = false;
          // }
        }
        if (this.lstCommisionCif[index].idTTPL === this.objCommisionCif.idTTPL) {
          this.lstCommisionCif[index].description = obj.description;
          this.lstCommisionCif[index].status = obj.status;
          this.lstCommisionCif[index].assetValue = obj.assetValue;
          this.lstCommisionCif[index].dateOfAgreement = obj.dateOfAgreement;
          this.lstCommisionCif[index].nationality = obj.nationality;
          this.lstCommisionCif[index].numberIdentification = obj.numberIdentification;
          this.lstCommisionCif[index].inEffect = this.objCommisionCif.inEffect;
        }
        // this.lstCommisionCif[index] = obj

        // check cho trường hợp tất cả về false
        if (this.checkIn === true) {
          this.lstCommisionCif[index].inEffect = false;
        }
        // check cho trường hợp tất cả về true
        else if (this.checkAC === true) {
          this.lstCommisionCif[index].inEffect = true;
        }
        // check TI và FI để đưa ra inEffect.
        else if (this.checkTI === true && this.checkTA === false && this.checkFA === false) {
          this.lstCommisionCif[index].inEffect = true;
        }
        //
        else if (this.checkTI === false && this.checkTA === false && this.checkFA === false) {
          this.lstCommisionCif[index].inEffect = false;
          this.lstCommisionCif[index].status = 'INACTIVE';
        }
        // check TA và FA để đưa ra inEffect.
        else if (this.checkTA === true) {
          this.lstCommisionCif[index].inEffect = true;
        } else if (this.checkTA === false && this.checkFA === true && this.checkTI === false && this.checkTI === false) {
          this.lstCommisionCif[index].inEffect = false;
        }


      });

      // if (this.checkInEffect === true) {
      //   this.objCommisionCif.inEffect = true;
      //   console.log(this.objCommisionCif.inEffect);
      // } else {
      //   // tslint:disable-next-line:no-unused-expression
      //   this.objCommisionCif.inEffect === false;
      // }
    }
    this.commisionForm.disable({ emitEvent: false });
    // Object.keys(this.commisionForm.controls).forEach(key => {
    //   this.commisionForm.controls[key].reset({value: this.commisionForm.get(key).value, disabled: true});
    // });
  }

  closeDialog(): void {
    const item = {
      number: 0
    };
    item.number = 17;
    const dialogRefConfirm = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRefConfirm.afterClosed().subscribe(rs => {
      if (rs === 1) {
        const dataGroup = _.groupBy(this.lstCommisionCif, commision => {
          // console.log(commision);
          return commision.id + '_' + commision.assetValue
            + '_' + commision.numberIdentification + '_'
            + commision.description + '_' + commision.nationality + '_'
            + commision.dateOfAgreement.format('yyyy-MM-DD') + '_' + commision.status + '_'
            + commision.idGTXM + '_' + commision.idPerson + '_' + commision.idCustomer + '_'
            + commision.inEffect + '_' + commision.PersonInEffect;
        });
        this.dialogRef.close({
          data: dataGroup,
          dataSave: this.lstCommisionCif,
        });
      }
    });
  }

  editButton(item): void {
    this.hiddenSave = false;
    this.showAll = false;
    this.showOne = true;
    this.hiddenAddLegal = false;
    this.hiddenEdit = true;
    this.hiddenSaveUpdate = true;
    this.disabledStatus = true;
    this.countPersion = 1;
    this.showInfomationCommission = true;
    this.objCommisionCif = item;
    this.commisionForm.enable({ emitEvent: false });
    this.commisionForm.patchValue(item, { emitEvent: false });
    // Object.keys(this.commisionForm.controls).forEach(key => {
    //   this.commisionForm.controls[key].reset({value: this.commisionForm.get(key).value, disabled: false});
    // });
  }

  delete(index: number): void {

    const item = {
      number: 0
    };
    item.number = 18;
    const dialogRefConfirm = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRefConfirm.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.lstCommisionCif.splice(index, 1);
        this.showInfomationCommission = false;
      }
    });
    // this.showInfomationCommission = false;
    // this.addNew();
  }

  detail(item: CommissionCif): void {
    this.hiddenSave = false;
    this.hiddenEdit = true;
    this.hiddenAddLegal = false;
    this.hiddenSaveUpdate = false;
    this.disabledStatus = true;
    this.countPersion = 1;
    this.showOne = true;
    this.showAll = false;
    this.showInfomationCommission = true;
    this.objCommisionCif = item;
    // console.log('there', item);
    this.commisionForm.disable({ emitEvent: false });
    this.commisionForm.patchValue(item, { emitEvent: false });

    this.mode = this.MODE.VIEW;
    // if (item.currentProvince !== null) {
    //   this.category.getDistrictByCityId(this.f.currentProvince.value).subscribe(data => {
    //     this.categories.currentDistricts = data;
    //   });
    // }
    // if (item.currentDistrict !== null) {
    //   this.category.getWardByDistrictId(this.f.currentDistrict.value).subscribe(data => {
    //     this.categories.currentWards = data;
    //   });
    // }
    // Object.keys(this.commisionForm.controls).forEach(key => {
    //   this.commisionForm.controls[key].reset({value: this.commisionForm.get(key).value, disabled: true});
    // });
  }

  detailTTPL(idTTPL): void {
    this.hiddenSave = false;
    this.hiddenEdit = true;
    this.hiddenAddLegal = false;
    this.hiddenSaveUpdate = false;
    this.disabledStatus = true;
    this.countPersion = 1;
    this.showInfomationCommission = true;
    // this.objCommisionCif = item;
    // console.log(item);
    // this.commisionForm.disable({emitEvent: false});
    // this.commisionForm.patchValue(item, {emitEvent: false});
    this.lstCommisionCifByIdTTPL = this.lstCommisionCif.filter(item2 => {
      return item2.idTTPL === idTTPL;
    });
    this.commisionForm.controls.numberIdentification.setValue(this.lstCommisionCifByIdTTPL[0].numberIdentification);
    this.commisionForm.controls.numberIdentification.disable();
    this.commisionForm.controls.assetValue.setValue(this.lstCommisionCifByIdTTPL[0].assetValue);
    this.commisionForm.controls.assetValue.disable();
    this.commisionForm.controls.description.setValue(this.lstCommisionCifByIdTTPL[0].description);
    this.commisionForm.controls.description.disable();
    this.commisionForm.controls.nationality.setValue(this.lstCommisionCifByIdTTPL[0].nationality);
    this.commisionForm.controls.nationality.disable();
    this.commisionForm.controls.dateOfAgreement.setValue(this.lstCommisionCifByIdTTPL[0].dateOfAgreement);
    this.commisionForm.controls.dateOfAgreement.disable();

    // console.log(this.lstCommisionCifByIdTTPL);
    this.mode = this.MODE.VIEW;
    this.showAll = true;
    this.showOne = false;
    // if (item.currentProvince !== null) {
    //   this.category.getDistrictByCityId(this.f.currentProvince.value).subscribe(data => {
    //     this.categories.currentDistricts = data;
    //   });
    // }
    // if (item.currentDistrict !== null) {
    //   this.category.getWardByDistrictId(this.f.currentDistrict.value).subscribe(data => {
    //     this.categories.currentWards = data;
    //   });
    // }
    // Object.keys(this.commisionForm.controls).forEach(key => {
    //   this.commisionForm.controls[key].reset({value: this.commisionForm.get(key).value, disabled: true});
    // });
  }

  onChangeCurrentAddress(): void {

    this.f.nationality2.valueChanges.subscribe(x => {
      if (x === 'VN') {
        this.category.getCities().subscribe(data => {
          this.categories.cites = data;
          if (x !== this.f.nationality2) {
            this.f.currentProvince.setValue(null);
            this.f.currentDistrict.setValue(null);
            this.f.currentWards.setValue(null);
          }
        });
      } else {
        this.categories.cites = [];
        this.categories.currentDistricts = [];
        this.categories.currentWards = [];
        this.f.currentProvince.setValue(null);
        this.f.currentDistrict.setValue(null);
        this.f.currentWards.setValue(null);
      }

    });

    this.f.currentProvince.valueChanges.subscribe(x => {
      this.category.getDistrictByCityId(x).subscribe(data => {
        this.categories.currentDistricts = data;
        if (x !== this.f.currentProvince) {
          this.f.currentDistrict.setValue(null);
          this.f.currentWards.setValue(null);
        }
      });
    });

    this.f.currentDistrict.valueChanges.subscribe(x => {
      this.category.getWardByDistrictId(x).subscribe(data => {
        this.categories.currentWards = data;
        if (x !== this.f.currentDistrict) {
          this.f.currentWards.setValue(null);
        }
      });
    });

  }


  getName(index): string {
    if (this.categories.lstRelationShip.find(x => x.code === index)) {
      return this.categories.lstRelationShip.find(x => x.code === index).name;
    }

  }

  getNationalName(code): string {
    if (this.categories.countries.find(x => x.code === code)) {
      return this.categories.countries.find(x => x.code === code).name;
    }

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
