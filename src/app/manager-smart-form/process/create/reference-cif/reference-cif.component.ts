import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryList } from 'src/app/_models/category/categoryList';
import { CategoryService } from 'src/app/_services/category/category.service';
import { NotificationService } from 'src/app/_toast/notification_service';
import { ReferenceCif } from '../../../../_models/RefernceCif/ReferenceCif';
import { PopupSearchComponent } from '../../../../_popup-search/popup.search.component';
import { DialogConfig } from '../../../../_utils/_dialogConfig';
import { PopupConfirmComponent } from '../../../../_popup/popup-confirm.component';
import { Category } from '../../../../_models/category/category';
import { RelationshipListService } from '../../../../_services/relationshipList.service';
import { TextMessage } from '../../../../_utils/_textMessage';
import { checkPhonesNumber, futureDate, IssueDate } from '../../../../_validator/cif.register.validator';
import { GlobalConstant } from '../../../../_utils/GlobalConstant';
import { ErrorMessage } from '../../../../_utils/ErrorMessage';

declare var $: any;

@Component({
  selector: 'app-commission-cif',
  templateUrl: './reference-cif.component.html',
  styleUrls: ['./reference-cif.component.scss']
})
export class ReferenceCifComponent implements OnInit {
  MODE = GlobalConstant.MODE;
  ERROR_MESSAGE = ErrorMessage;
  CUSTOMER_TYPE = GlobalConstant.CUSTOMER_TYPE;
  ITEM_STATUS = GlobalConstant.ITEM_STATUS;
  textMessage: TextMessage = new TextMessage();
  items: ReferenceCif[] = [];
  registerForm = this.formBuilder.group({
    id: [''],
    customerCode: new FormControl({ value: null, disabled: true }),
    fullName: new FormControl({ value: null, disabled: false }, [Validators.required]),
    dateOfBirth: ['', [Validators.required, futureDate]],
    identifyCode: ['', [Validators.required]],
    perDocTypeCode: ['', [Validators.required]],
    identifyAddress: ['', Validators.required],
    identifyDate: ['', [Validators.required, futureDate]],
    gender: ['M', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(11), checkPhonesNumber]],
    nationality: ['', Validators.required],
    relationshipType: ['none', Validators.required],
    editable: [1],
    status: [''],
    inEffect: [null]
  },
    {
      validators: [IssueDate('dateOfBirth', 'identifyDate'), this.validateGTXM]
    });
  searchForm: FormGroup;
  submitted = false;
  searchSubbmit = false;
  categories: CategoryList = new CategoryList();
  viewCountry: any = [];
  isHidden = true;
  isKHHH = false;
  lstRelationShip: Category[] = [];
  mode: string;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialog,
    private dialogRef: MatDialogRef<ReferenceCifComponent>,
    private category: CategoryService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private relationshipListService: RelationshipListService) {
  }

  ngOnInit(): void {
    // console.log(this.data.data.cifs);
    this.mode = this.MODE.CREATE;

    this.searchForm = new FormGroup({
      customerCode: new FormControl('', Validators.required),
      customerType: new FormControl('CHUNG MINH NHAN DAN')
    });

    this.registerForm.get('identifyCode').valueChanges.subscribe(data => {
      let isExistGTXN = false;
      this.items.forEach((item, index) => {
        if (item.identifyCode === data && item.id !== this.registerForm.get('id').value) {
          isExistGTXN = true;
        }
      });
      if (isExistGTXN && (this.mode === this.MODE.CREATE || this.mode === this.MODE.EDIT)) {
        // tslint:disable-next-line:object-literal-key-quotes
        this.registerForm.get('identifyCode').setErrors({ 'isExist': true });
      }
    });


    this.categoriesLoader();
    this.items = this.data.data.cifs;
    this.isKHHH = this.data.data.isKHHH;
    if (this.data.isViewMode) {
      this.registerForm.disable();
      this.searchForm.disable();
    }
  }
  // tslint:disable-next-line:typedef
  get perDocTypeCode() {
    return this.registerForm.get('perDocTypeCode') as FormControl;
  }

  validateGTXM(group: FormGroup): ValidationErrors | null {
    if (group.controls.perDocTypeCode.value === 'CHUNG MINH NHAN DAN') {
      group.controls.identifyCode.setValidators([Validators.required, Validators.minLength(9) || Validators.maxLength(12)]);

    } else if (group.controls.perDocTypeCode.value === 'CAN CUOC CONG DAN') {
      group.controls.identifyCode.setValidators([Validators.required, Validators.maxLength(12), Validators.minLength(12)]);
    } else if (group.controls.perDocTypeCode.value === 'HO CHIEU') {
      group.controls.identifyCode.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9]\d*$/)]);
    } else if (group.controls.perDocTypeCode.value === 'GIAY KHAI SINH') {
      group.controls.identifyCode.setValidators([Validators.required, Validators.pattern(/^[a-zA-Z0-9]\d*$/)]);
    }

    return null;
  }

  // convenience getter for easy access to form fields
  get f(): any {
    return this.registerForm.controls;
  }

  // convenience getter for easy access to form fields
  get s(): any {
    return this.searchForm.controls;
  }

  onSubmit(): void {
    // tslint:disable-next-line:no-debugger
    debugger;
    this.submitted = true;
    if (this.registerForm.valid) {
      this.registerForm.get('fullName').setValue(this.registerForm.get('fullName').value.toUpperCase());
      const index = this.items.findIndex(x => x.id === this.registerForm.get('id').value);

      if (index >= 0) {
        this.items[index] = this.registerForm.getRawValue();
      } else {
        // this.registerForm.get('id').setValue(this.items.length - 1);
        // this.registerForm.get('status').setValue('Thêm mới');
        this.items.push(this.registerForm.getRawValue());
      }
      this.registerForm.disable({ emitEvent: false });
      this.mode = this.MODE.VIEW;
      // console.log(this.items);
    } else {
      this.registerForm.markAllAsTouched();
    }


  }

  remove(index: number): void {
    const item = {
      number: 0
    };
    item.number = 18;
    const dialogRefConfirm = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRefConfirm.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.items.splice(index, 1);
        this.registerForm.reset();
        this.registerForm.enable();
        this.isHidden = true;
      }
    });
  }

  edit(): void {
    this.registerForm.enable();
    this.mode = this.MODE.CREATE;
  }

  search(): void {
    const data = {
      px: '',
      position_top: '',
      data: {
        customerCode: this.searchForm.controls.customerCode.value,
        type: this.searchForm.controls.customerType.value,
      },
      index: 0
    };
    this.searchSubbmit = true;
    if (this.searchForm.valid) {
      const dialogRef = this.dialog.open(PopupSearchComponent, DialogConfig.configDialogSearch(data));
      this.registerForm.enable();
      dialogRef.afterClosed().subscribe(rs => {
        this.isHidden = false;
        if (rs === 1) {
          this.mode = this.MODE.CREATE;
          this.registerForm.reset();
          this.registerForm.patchValue({
            nationality: this.viewCountry[0].code,
            gender: 'M',
            editable: 1
          });
          this.registerForm.markAsUntouched();
        } else if (rs === 0) {
          this.isHidden = true;
        } else {
          // console.log('vào đây', rs);
          this.mode = this.MODE.CREATE;
          this.registerForm.patchValue(rs);
          this.registerForm.markAsUntouched();
          if (rs.gender === 'Nữ') {
            this.registerForm.get('gender').setValue('F');
          } else if (rs.gender === 'Nam') {
            this.registerForm.get('gender').setValue('M');
          } else if (rs.gender === 'Khác') {
            this.registerForm.get('gender').setValue('O');
          }
          this.registerForm.controls.fullName.disable();
          this.registerForm.controls.dateOfBirth.disable();
          this.registerForm.controls.gender.disable();
          this.registerForm.controls.nationality.disable();
        }
        // this.registerForm.controls.identifyCode.setValue(this.searchForm.controls.customerCode.value);
      });
    }

  }

  categoriesLoader(): void {
    this.category.getIndustries().subscribe(data => this.categories.industries = data);
    this.category.getGenders().subscribe(data => this.categories.genders = data);
    this.category.getPerDocTypes().subscribe(data => this.categories.perDocTypes = data.filter(a => a.statusCode === 'A'));
    // this.category.getMaritalStatus().subscribe(data => this.categories.maritalStatus = data);
    this.category.getCountries().subscribe(data => {
      this.categories.countries = data;
      this.viewCountry = this.categories.countries.filter(e => e.code === 'VN' || e.id === 'VN');
    });
    this.category.getCities().subscribe(data => {
      this.categories.cites = data;
    });
    this.relationshipListService.getRelationshipList().subscribe(rs => {
      this.lstRelationShip = rs.items;
    });
  }

  getRelation(index): string {
    if (this.lstRelationShip.find(x => x.code === index)) {
      return this.lstRelationShip.find(x => x.code === index).name;
    }

  }

  closeDialog(index: any): void {
    const item = {
      number: 0
    };
    item.number = 17;
    const dialogRefConfirm = this.dialog.open(PopupConfirmComponent, DialogConfig.configDialogConfirm(item));
    dialogRefConfirm.afterClosed().subscribe(rs => {
      if (rs === 1) {
        this.dialogRef.close({
          cifs: this.items
        });
        // console.log('this, item', this.items);
      }
    });

  }

  getDetail(item, mode): void {
    this.isHidden = false;
    if (mode === this.MODE.VIEW) {
      this.registerForm.disable();
    } else {
      if (this.registerForm.get('customerCode').value) {
        this.registerForm.get('phoneNumber').enable();
        this.registerForm.get('identifyCode').enable();
        this.registerForm.get('identifyAddress').enable();
        this.registerForm.get('identifyDate').enable();
      } else {
        this.registerForm.enable();
      }
    }
    this.mode = mode;
    // console.log(item);
    this.registerForm.patchValue(item);


  }

  getAllErrors(form: FormGroup | FormArray): { [key: string]: any; } | null {
    let hasError = false;
    const result = Object.keys(form.controls).reduce((acc, key) => {
      const control = form.get(key);
      const errors = (control instanceof FormGroup || control instanceof FormArray)
        ? this.getAllErrors(control)
        : control.errors;
      if (errors) {
        acc[key] = errors;
        hasError = true;
      }
      return acc;
    }, {} as { [key: string]: any; });
    return hasError ? result : null;
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
    // console.log('after ', str);
    return str;
  }
}
