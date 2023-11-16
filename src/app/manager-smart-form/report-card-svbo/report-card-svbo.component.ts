import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl} from '@angular/forms';
import * as moment from 'moment';
import {LpbDatePickerComponent} from '../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {ReportCardSvboService} from './core/report-card-svbo.service';
import {Pagination} from '../../_models/pager';
import {compareDate} from '../../shared/constants/utils';
// import {GlobalConstant} from '../../_utils/GlobalConstant';
declare var $: any;

@Component({
  selector: 'app-report-card-svbo',
  templateUrl: './report-card-svbo.component.html',
  styleUrls: ['./report-card-svbo.component.scss']
})
export class ReportCardSvboComponent implements OnInit {
  @ViewChild('dpCreatedDateFrom', {static: false}) dpCreatedDateFrom: LpbDatePickerComponent;
  @ViewChild('dpCreatedDateTo', {static: false}) dpCreatedDateTo: LpbDatePickerComponent;
  statusUpdateCif = [
    {statusCode: '', statusName: 'Tất cả'},
    {statusCode: 'SUCCESS', statusName: 'Thành Công'},
    {statusCode: 'FAIL', statusName: 'Thất Bại'},
    {statusCode: 'TIMEOUT', statusName: 'Timeout'}
  ];
  // role = GlobalConstant.ROLE;
  userRole: any;
  userInfoNow: any = [];
  activePage = 1;
  pageSize = 10;
  pagination: Pagination = new Pagination();
  branchesData: any [] = [];
  submitted = false;
  cardReportOut: any [] = [];
  reportCardForm = this.fb.group({
      branchCode: [null],
      customerCode: [null],
      serviceStatus: [null],
      page: [this.activePage],
      size: [this.pageSize]
    }
  );

  ngOnInit(): void {
    this.getAllBranches();
    this.label();
  }
  label(): void {
    $('.parentName').html('Quản lý Thẻ');
    $('.childName').html('Báo cáo CIF sang SVBO');
  }

  constructor(
    private fb: FormBuilder,
    private reportCardSvboService: ReportCardSvboService,
  ) {
    this.userInfoNow = JSON.parse(localStorage.getItem('userInfo'));
    this.userRole = JSON.parse(localStorage.getItem('role'));
  }

  // tslint:disable-next-line:typedef
  get branchCode() {
    return this.reportCardForm.get('branchCode');
  }

  // tslint:disable-next-line:typedef
  get customerCode() {
    return this.reportCardForm.get('customerCode');
  }

  // tslint:disable-next-line:typedef
  get serviceStatus() {
    return this.reportCardForm.get('serviceStatus');
  }

  // tslint:disable-next-line:typedef
  get page(): FormControl {
    return this.reportCardForm.get('page') as FormControl;
  }

  // tslint:disable-next-line:typedef
  get size() {
    return this.reportCardForm.get('size');
  }

  updatedDateFromChanged(): void {
    if (this.dpCreatedDateFrom.haveValue() && !this.dpCreatedDateFrom.isValid) {
      this.dpCreatedDateFrom.setErrorMsg('Từ ngày không hợp lệ');
    } else {
      this.dpCreatedDateFrom.setErrorMsg('');
    }
  }

  updatedDateToChanged(): void {
    if (this.dpCreatedDateTo.haveValue() && !this.dpCreatedDateTo.isValid) {
      this.dpCreatedDateTo.setErrorMsg('Đến ngày không hợp lệ');
    } else {
      this.dpCreatedDateTo.setErrorMsg('');
    }
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }

  dateValidator(): boolean {
    if ((this.dpCreatedDateFrom.haveValue() && this.dpCreatedDateFrom.isValid)
      && (this.dpCreatedDateTo.haveValue() && this.dpCreatedDateTo.isValid)) {
      this.dpCreatedDateFrom.setErrorMsg('');
      if (compareDate(this.dpCreatedDateFrom.getValue(), this.dpCreatedDateTo.getValue()) === 1) {
        this.dpCreatedDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
        return false;
      } else {
        return true;
      }
    }
    return true;
  }

  // tslint:disable-next-line:typedef
  getAllBranches() {
    this.reportCardSvboService.getListBranch().subscribe(res => {
      if (this.userInfoNow.branchCode !== '001' && this.userInfoNow.branchCode !== '000') {
        this.branchCode.patchValue(this.userInfoNow.branchCode, {enable: false});
        this.branchCode.disable();
      }
      // Kiểm tra dữ liệu trả về có thành công và giá trị hay không
      if (res && res.responseStatus.success) {
        this.branchesData = res.items;
      } else {
        this.branchesData = [];
      }
    }, error => {
      this.branchesData = [];
    });
  }

  // tslint:disable-next-line:typedef
  searchList() {
    this.submitted = true;
    if (this.reportCardForm.valid
      && this.dpCreatedDateFrom.errorMsg === ''
      && this.dpCreatedDateTo.errorMsg === ''
      && this.dateValidator()) {
      const body = {
        branchCode: this.reportCardForm.getRawValue().branchCode,
        customerCode: this.reportCardForm.getRawValue().customerCode,
        serviceStatus: this.reportCardForm.getRawValue().serviceStatus,
        page: this.activePage,
        size: this.pageSize,
        updatedDateFrom: this.dpCreatedDateFrom.getValue().trim(),
        updatedDateTo: this.dpCreatedDateTo.getValue().trim()
      };
      this.reportCardSvboService.listCiftoSvbo(body).subscribe(
        res => {
          if (res.items) {
            this.cardReportOut = res.items;
            this.pagination = new Pagination(res.count, this.activePage, this.pageSize);
          } else {
            this.cardReportOut = [];
          }
        }
      );
    }
  }

  // tslint:disable-next-line:typedef
  exportFile() {
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
    this.searchList();
  }

  setPage(pageNumber: any): void {
    if (pageNumber < 1 || pageNumber > this.pagination.pager.totalPages) {
      return;
    } else {
      this.activePage = pageNumber;
      this.page.patchValue(pageNumber);
      this.searchList();
    }
  }
}
