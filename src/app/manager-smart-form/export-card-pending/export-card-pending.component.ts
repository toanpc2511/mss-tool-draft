import {Component, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../_models/category/category';
import {Pagination} from '../../_models/pager';
import {CategoryService} from 'src/app/_services/category/category.service';
import {UserService} from 'src/app/_services/user.service';
import {SystemUsers} from 'src/app/_models/systemUsers';
import {CardService} from 'src/app/_services/card/card.service';
import {Branch} from 'src/app/_models/card/Branch';
import {CardOption, CardProduct} from 'src/app/_models/card/CardOption';
import {ExportCard, ExportCardOut} from 'src/app/_models/card/ExportCard';
import {CardPendingService} from 'src/app/services/card-pending.service';
import {FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {LpbDatePickerComponent} from '../../shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import {GlobalConstant} from '../../_utils/GlobalConstant';
import {NotificationService} from '../../_toast/notification_service';
import {saveAs} from 'file-saver';
import {AuthenticationService} from '../../_services/authentication.service';
import {PermissionConst} from '../../_utils/PermissionConst';

declare var $: any;

@Component({
  selector: 'app-export-card-pending',
  templateUrl: './export-card-pending.component.html',
  styleUrls: ['./export-card-pending.component.css']
})
export class ExportCardPendingComponent implements OnInit {
  ROLE = GlobalConstant.ROLE;
  PermissionConst = PermissionConst;
  pagination: Pagination = new Pagination();
  activePage = 1;
  pageSize = 10;

  ex: ExportCard = new ExportCard();
  // exportCard: ExportCard = new ExportCard();
  branches: Category[];

  userList: SystemUsers[];

  cardType: CardOption[];
  selectedCardType: CardOption[];
  listCardProduct: Array<string>;
  listCardProductSelected: Array<string>;
  startDate: string;
  endDate: string;
  cardExportOut: ExportCardOut[];
  userInfoNow: any = [];
  userRole: any;

  @ViewChild('dpCreatedDateFrom', {static: false}) dpCreatedDateFrom: LpbDatePickerComponent;
  @ViewChild('dpCreatedDateTo', {static: false}) dpCreatedDateTo: LpbDatePickerComponent;

  exportCardForm = this.fb.group({
    page: [this.activePage],
    size: [this.pageSize],
    createdDateFrom: [null],
    createdDateTo: [null],
    branchCode: [null],
    productCodes: [[]],
    fileId: [null],
    createdByUserName: [null],
    exportStatus: [null],
    cardTypeCode: [null]
  }, {validators: [this.dateValidator]});

  get cardTypeCode() {
    return this.exportCardForm.get('cardTypeCode');
  }

  get branchCode() {
    return this.exportCardForm.get('branchCode');
  }

  get createdDateFrom() {
    return this.exportCardForm.get('createdDateFrom');
  }

  get createdDateTo() {
    return this.exportCardForm.get('createdDateTo');
  }

  get createdByUserName() {
    return this.exportCardForm.get('createdByUserName');
  }

  get productCodes(): FormArray {
    return this.exportCardForm.get('productCodes') as FormArray;
  }

  get page() {
    return this.exportCardForm.get('page');
  }

  get size() {
    return this.exportCardForm.get('size');
  }


  async ngOnInit() {
    this.userInfoNow = JSON.parse(localStorage.getItem('userInfo'));
    this.userRole = JSON.parse(localStorage.getItem('role'));
    // this.getBranch();
    await this.getCategoryList();
    this.onChange();
    this.searchCard();
    if ($('.parentName').html('Quản lý Thẻ')) {
      $('.childName').html('Export thẻ');
    }
  }

  constructor(
    private categoryService: CategoryService,
    private cardService: CardService,
    private userService: UserService,
    private cardPendingService: CardPendingService,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    public authenticationService: AuthenticationService,
  ) {

  }

  onChange(): void {
    this.cardTypeCode.valueChanges.subscribe(x => {
      this.productCodes.reset();
      this.cardService.apiCardProduct2(x).subscribe(
        data => {
          if (data.items && data.items.length > 0) {
            this.listCardProduct = data.items;
          } else {
            this.listCardProduct = [];
          }
        }
      );
    });
  }

  async getCategoryList() {
    // lấy danh sách chi nhánh
    await this.categoryService.getBranch().toPromise().then(
      data => {
        this.branches = data;
        if (this.userInfoNow.branchCode !== '001') {
          this.branchCode.patchValue(this.userInfoNow.branchCode, {enable: false});
          this.branchCode.disable();

        }

      }
    );
    // this.categoryService.getRegisType().subscribe(data => this.regisTypeList = data)

    // Lấy dánh sách User
    await this.userService.getAllUsers().toPromise().then(data => {
      if (data.items) {
        if (this.userRole[0] === this.ROLE.GDV) {
          // .filter(e => (e.titles === 'Chuyên viên' || e.titles === 'Chuyên viên cao cấp') && e.branchIds[0] === this.userInfoNow.branchId);
          this.userList = data.items;
          this.createdByUserName.patchValue(this.userInfoNow.userName);
          this.createdByUserName.disable();

        } else if (this.userRole[0] === this.ROLE.KSV) {
          this.userList = data.items.filter(e => (e.branchIds?.length > 0 && e.branchIds[0] === this.userInfoNow.branchId));
        } else if (this.userRole[0] === this.ROLE.ADMIN) {
          this.userList = data.items;
        }
      }
    });
    // lấy list card type
    this.cardService.getTypeCard().subscribe(
      data => {
        if (data.items) {
          this.cardType = data.items;
        }
      }
    );

  }


  searchCard(): void {

    if (this.exportCardForm.valid) {
      this.cardPendingService.getListCardPending(this.exportCardForm.getRawValue()).subscribe(
        data => {
          if (data.items) {
            this.cardExportOut = data.items;
            this.pagination = new Pagination(data.count, this.activePage, this.pageSize);
            // this.notificationService.showSuccess('Tìm kiếm thành công', 'Kết quả');
          } else {
            this.cardExportOut = [];
          }
        }
      );
    }
    // else {
    //   this.notificationService.showError('Điều kiện tìm kiếm thông đúng', 'Lỗi');
    // }
  }

  // onExport(): void {
  //   this.cardPendingService.getFileExport(this.exportCard).subscribe(
  //
  //   );
  // }

  blurCreatedDateFrom(evt): void {
    if (!this.dpCreatedDateFrom.haveValue()) {
      // this.dpDateOfBirth.setErrorMsg('Ngày sinh không được để trống22');
      // this.dpCreatedDateFrom.markAsTouched();
    }
    // this.dateOfBirth.markAsTouched();
  }

  createdDateFromChanged(): void {
    this.createdDateFrom.patchValue(this.dpCreatedDateFrom.getValue());
    // this.validateDateOfBirth();
  }

  createdDateToChanged(): void {
    this.createdDateTo.patchValue(this.dpCreatedDateTo.getValue());
    // this.validateDateOfBirth();
  }

  dateValidator(form: FormGroup): ValidationErrors | null {
    let createdDateFrom = form.controls.createdDateFrom.value;
    let createdDateTo = form.controls.createdDateTo.value;
    // console.log('fromDate:' + createdDateFrom);
    if (createdDateFrom && createdDateTo) {
      createdDateFrom = moment(createdDateFrom, 'DD/MM/YYYY');
      createdDateTo = moment(createdDateTo, 'DD/MM/YYYY');
      const dayDif = moment(createdDateFrom).diff(createdDateTo, 'day');
      // console.log('dayDif:' + dayDif);
      return (dayDif >= 1) ? {validateDate: true} : null;
    }
    return null;
  }

  changePageSize(size: string): void {
    // tslint:disable-next-line:radix
    this.pageSize = parseInt(size);
    if (this.pageSize < 0) {
      return;
    }
    this.activePage = 1;
    this.page.patchValue(this.activePage);
    this.size.patchValue(this.pageSize);
    // this.condition.size = this.pageSize;
    this.searchCard();
  }

  setPage(pageNumber: any): void {
    if (pageNumber < 1 || pageNumber > this.pagination.pager.totalPages) {
      return;
    } else {
      this.activePage = pageNumber;
      this.page.patchValue(pageNumber);
      this.searchCard();
    }
  }

  exportCard(): void {
    if (this.exportCardForm.valid) {
      this.cardPendingService.exportCard(this.exportCardForm.getRawValue()).subscribe(
        response => {
          // saveAs(response);
          let fileName = this.userInfoNow.userName + '_' + moment().format('yyyyMMDD');
          console.log('headers', response.headers.get('Content-Disposition'));
          const contentDisposition = response.headers.get('Content-Disposition');
          if (contentDisposition) {
            const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = fileNameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
              fileName = matches[1].replace(/['"]/g, '');
            }
            // console.log(matches);
          }

          saveAs(response.body, 'SVAP_' + fileName);
          this.searchCard();
        },
        err => {
          this.notificationService.showError('Export thẻ thất bại', 'Lỗi');
        }
      );
    }
  }

  printSuggestion(): void {

    if (this.exportCardForm.valid) {
      this.cardPendingService.printSuggestion(this.exportCardForm.getRawValue()).subscribe(
        response => {
          // saveAs(response);
          let fileName = 'Card_Export_Report_Summary' + '_' + this.userInfoNow.userName + '_' + moment().format('yyyyMMDDhhmmss');
          const contentDisposition = response.headers.get('content-disposition');
          if (contentDisposition) {
            const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = fileNameRegex.exec(contentDisposition);
            alert(matches[1]);
            if (matches != null && matches[1]) {
              fileName = matches[1].replace(/['"]/g, '');
            }

          }

          saveAs(response.body, fileName);
          this.searchCard();
        },
        err => {
          this.notificationService.showError('In đề nghị thất bại', 'Lỗi');
        }
      );
    }
  }

  printDetail(): void {
    if (this.exportCardForm.valid) {
      this.cardPendingService.printDetail(this.exportCardForm.getRawValue()).subscribe(
        response => {
          // saveAs(response);
          let fileName = 'Card_Export_Report_Detail' + '_' +  this.userInfoNow.userName + '_' + moment().format('yyyyMMDDhhmmss');
          // console.log('headers', response.headers.get('Content-Disposition'));
          const contentDisposition = response.headers.get('Content-Disposition');

          if (contentDisposition) {
            const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = fileNameRegex.exec(contentDisposition);
            // console.log(matches);
            if (matches != null && matches[1]) {
              fileName = matches[1].replace(/['"]/g, '');
            }
          }

          saveAs(response.body, fileName);
          this.searchCard();
        },
        err => {
          this.notificationService.showError('In chi tiết thất bại', 'Lỗi');
        }
      );
    }
  }

}


