import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import {compareDate} from '../../../shared/constants/utils';
import {FormBuilder} from '@angular/forms';
import {Pagination} from '../../../_models/pager';
import {ReportCifToSvboService} from '../shared/services/report-cif-to-svbo.service';
import {saveAs} from 'file-saver';
import {NotificationService} from '../../../_toast/notification_service';
declare var $: any;

@Component({
  selector: 'app-report-update-cif-to-svbo',
  templateUrl: './report-update-cif-to-svbo.component.html',
  styleUrls: ['./report-update-cif-to-svbo.component.scss']
})
export class ReportUpdateCifToSvboComponent implements OnInit {
  @ViewChild('dpDateFrom', {static: false}) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', {static: false}) dpDateTo: LpbDatePickerComponent;
  pageIndex = 1;
  pageSize = 10;
  listUpdated = [];
  branchesData = [];
  isClick = false;
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  isLoading = false;
  userInfoNow: any = [];
  userRole: any;
  pagination: Pagination = new Pagination();
  reportCardForm = this.fb.group({
      branchCode: [null],
      customerCode: [null],
      serviceResultStatusCode: [null],
      page: [this.pageIndex],
      size: [this.pageSize]
    }
  );

  constructor(private fb: FormBuilder,
              private cifToSvbo: ReportCifToSvboService,
              private notification: NotificationService) {
    this.userInfoNow = JSON.parse(localStorage.getItem('userInfo'));
    this.userRole = JSON.parse(localStorage.getItem('role'));
  }

  ngOnInit(): void {
    $('.parentName').html('Hỗ trợ thẻ');
    $('.childName').html('Báo cáo');
    this.getBranches();
  }
  get branchCode(): any { return this.reportCardForm.get('branchCode'); }
  get customerCode(): any { return this.reportCardForm.get('customerCode'); }
  get serviceResultStatusCode(): any { return this.reportCardForm.get('serviceResultStatusCode'); }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }
  getFromDate(): any {
    this.dpDateFrom.getValue();
    this.dpDateFrom.focus();
  }
  getToDate(): any {
    this.dpDateTo.getValue();
    this.dpDateTo.focus();
  }
  dateToChanged(): any {
    this.validateToDate();
    this.validateFromDate();
  }
  dateFromChanged(): any {
    this.validateFromDate();
    this.validateToDate();
  }

  validateFromDate(): void{
    if (this.dpDateFrom.haveValue() && !this.dpDateFrom.isValid) {
      this.dpDateFrom.setErrorMsg('Từ ngày không hợp lệ');
    }
    else if (!this.dpDateFrom.haveValue()) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được để trống');
    }
    else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
    }
    else {
      this.dpDateFrom.setErrorMsg('');
    }
  }
  validateToDate(): void {
    if (this.dpDateTo.haveValue() && !this.dpDateTo.isValid) {
      this.dpDateTo.setErrorMsg('Đến ngày không hợp lệ');
    }
    else if (!this.dpDateTo.haveValue()) {
      return this.dpDateTo.setErrorMsg('Đến ngày không được để trống');
    }
    else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateTo.setErrorMsg('Đến ngày không được nhỏ hơn Từ ngày');
    }
    else {
      this.dpDateTo.setErrorMsg('');
    }
  }

  getBranches(): any {
    this.cifToSvbo.listBranches().subscribe(rs => {
      if (this.userInfoNow.branchCode !== '001' && this.userInfoNow.branchCode !== '000') {
        this.branchCode.patchValue(this.userInfoNow.branchCode, {enable: false});
        this.branchCode.disable();
      }
      if (rs && rs.responseStatus.success) {
        this.branchesData = rs.items;
      } else {
        this.branchesData = [];
      }
    }, error => {
      this.branchesData = [];
    });
  }

  findList(): any {
    this.isClick = true;
    this.validateToDate();
    this.validateFromDate();

    const req = {
      branchCode: this.reportCardForm.getRawValue().branchCode,
      customerCode: this.reportCardForm.getRawValue().customerCode,
      serviceResultStatusCode: this.reportCardForm.getRawValue().serviceResultStatusCode,
      page: this.pageIndex,
      size: this.pageSize,
      fromDate: this.dpDateFrom.getValue().trim(),
      toDate: this.dpDateTo.getValue().trim()
    };
    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '') {
      this.cifToSvbo.listReportCifToSvbo(req).subscribe(
        res => {
          if (res.items) {
            this.listUpdated = res.items;
            this.pagination = new Pagination(res.count, this.pageIndex, this.pageSize);
          } else {
            this.listUpdated = [];
          }
        }
      );
    }
  }
  downloadFile(): any {
    this.isClick = true;
    this.validateToDate();
    this.validateFromDate();
    const req = {
      branchCode: this.reportCardForm.getRawValue().branchCode,
      customerCode: this.reportCardForm.getRawValue().customerCode,
      serviceResultStatusCode: this.reportCardForm.getRawValue().serviceResultStatusCode,
      fromDate: this.dpDateFrom.getValue(),
      toDate: this.dpDateTo.getValue()
    };
    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '') {
      this.isLoading = true;
      this.cifToSvbo.exportFile(req).subscribe(res => {
        this.isLoading = false;
        let fileName = moment().format('yyyyMMDD');
        const contentDisposition = res.headers.get('Content-Disposition');
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        }
        saveAs(res.body, 'Updated_Cif-Svbo_' + fileName + '.xlsx');
        this.notification.showSuccess('Tải xuống thành công', 'Thông báo');
      }, err => {
        this.isLoading = false;
        this.notification.showError('Export thẻ thất bại', 'Lỗi');
      });
    }
  }
  changePageSize(pageSize: number): void {
    if (this.pageSize < 0) {
      return;
    }
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.findList();
  }
  setPage(pageIndex: number): void {
    if (pageIndex < 1 || pageIndex > this.pagination.pager.totalPages) {
      return;
    }
    this.pageIndex = pageIndex;
    this.findList();
  }

}
