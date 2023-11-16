import {Component, OnInit, ViewChild} from '@angular/core';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import {FormBuilder, Validators} from '@angular/forms';
import {CrossCheckingService} from '../cross-checking.service';
import {compareDate} from '../../../shared/constants/utils';
import {NotificationService} from '../../../_toast/notification_service';
import {saveAs} from 'file-saver';

declare var $: any;

@Component({
  selector: 'app-report-cross-checking',
  templateUrl: './report-cross-checking.component.html',
  styleUrls: ['./report-cross-checking.component.css']
})
export class ReportCrossCheckingComponent implements OnInit {
  @ViewChild('dpCreatedDateFrom', {static: false}) dpCreatedDateFrom: LpbDatePickerComponent;
  @ViewChild('dpCreatedDateTo', {static: false}) dpCreatedDateTo: LpbDatePickerComponent;
  userInfoNow: any = [];
  branchesData: any [] = [];
  details: any;
  isSubmitted = false;
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  isDownload = false;

  reportForm = this.fb.group({
      cardType: this.fb.control({value: null, disabled: false}, Validators.required),
      dvkd: [null, [Validators.required]],
      reportType: [null, [Validators.required]],
      format: [null, [Validators.required]],
    }
  );

  constructor(private fb: FormBuilder,
              private crossCheckingService: CrossCheckingService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.label();
    this.getListBranches();
    this.userInfoNow = JSON.parse(localStorage.getItem('userInfo'));
    this.reportForm.get('reportType').valueChanges.subscribe(rs => {
      if (rs === '01') {
        this.cardType.disable();
        this.branchCode.disable();
        this.cardType.setValue('*');
        this.branchCode.setValue('*');
      } else {
        this.cardType.enable();
        this.branchCode.enable();

        if ((this.cardType.value && this.cardType.value !== '*') &&
          this.branchCode.value && this.branchCode.value !== '*') {
          return [this.cardType, this.branchCode];
        } else if (this.cardType.value === '*' || this.branchCode.value === '*') {
          this.cardType.reset();
          this.branchCode.reset();
        }
      }
    });
  }

  get cardType(): any {
    return this.reportForm.get('cardType');
  }

  get branchCode(): any {
    return this.reportForm.get('dvkd');
  }

  get reportType(): any {
    return this.reportForm.get('reportType');
  }

  get format(): any {
    return this.reportForm.get('format');
  }

  get fromDate(): any {
    return this.reportForm.get('fromDate');
  }

  get toDate(): any {
    return this.reportForm.get('toDate');
  }

  label(): void {
    $('.parentName').html('Đối soát');
    $('.childName').html('Báo cáo đối soát giao dịch thanh toán thẻ');
  }

  getListBranches(): any {
    // this.crossCheckingService.listAllBranch().subscribe(res => {
    //   this.branchesData = res.items;
    // });
  }

  // date
  limitDate(): any {
    const dateFrom = moment(this.dpCreatedDateFrom.getValue(), 'DD.MM.YYYY');
    const dateTo = moment(this.dpCreatedDateTo.getValue(), 'DD.MM.YYYY');
    const distance = dateTo.diff(dateFrom, 'days');
    if (distance >= 5) {
      this.dpCreatedDateFrom.setErrorMsg('Phạm vi báo cáo tối đa trong 5 ngày');
      this.dpCreatedDateTo.setErrorMsg('Phạm vi báo cáo tối đa trong 5 ngày');
    }
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }

  dateFromChanged(): any {
    this.validateFromDate();
  }

  dateToChanged(): any {
    this.validateToDate();
  }

  validateFromDate(): void {
    if (this.dpCreatedDateFrom.haveValue() && !this.dpCreatedDateFrom.isValid) {
      this.dpCreatedDateFrom.setErrorMsg('Từ ngày không hợp lệ');
    } else if (!this.dpCreatedDateFrom.haveValue()) {
      this.dpCreatedDateFrom.setErrorMsg('Từ ngày không được để trống');
    } else {
      this.dpCreatedDateFrom.setErrorMsg('');
    }
  }

  validateToDate(): void {
    if (this.dpCreatedDateTo.haveValue() && !this.dpCreatedDateTo.isValid) {
      this.dpCreatedDateTo.setErrorMsg('Đến ngày không hợp lệ');
    } else if (!this.dpCreatedDateTo.haveValue()) {
      return this.dpCreatedDateTo.setErrorMsg('Đến ngày không được để trống');
    } else {
      this.dpCreatedDateTo.setErrorMsg('');
    }
  }

  getFromDate(): any {
    this.dpCreatedDateFrom.getValue();
    this.dpCreatedDateFrom.focus();
  }

  getToDate(): any {
    this.dpCreatedDateTo.getValue();
    this.dpCreatedDateTo.focus();
  }

  dateValidator(): boolean {
    if ((this.dpCreatedDateFrom.haveValue() && this.dpCreatedDateFrom.isValid)
      && (this.dpCreatedDateTo.haveValue() && this.dpCreatedDateTo.isValid)) {
      this.dpCreatedDateFrom.setErrorMsg('');
      this.dpCreatedDateTo.setErrorMsg('');
      if (compareDate(this.dpCreatedDateFrom.getValue(), this.dpCreatedDateTo.getValue()) === 1) {
        this.dpCreatedDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
        this.dpCreatedDateTo.setErrorMsg('Đến ngày không được nhỏ hơn Từ ngày');
        return false;
      } else {
        return true;
      }
    }
    return true;
  }

  exportFile(): any {
    this.isSubmitted = true;
    this.validateToDate();
    this.validateFromDate();
    this.dateValidator();
    this.limitDate();
    const body = {
      cardType: this.reportForm.getRawValue().cardType,
      dvkd: this.reportForm.getRawValue().dvkd,
      format: this.reportForm.getRawValue().format,
      reportType: this.reportForm.getRawValue().reportType,
      fromDate: this.dpCreatedDateFrom.getValue(),
      toDate: this.dpCreatedDateTo.getValue()
    };
    if (this.reportForm.valid && this.dpCreatedDateTo.errorMsg === '' && this.dpCreatedDateFrom.errorMsg === '') {

      this.crossCheckingService.listReport(body).subscribe(res => {

        let fileName = moment().format('yyyyMMDD');
        const contentDisposition = res.headers.get('Content-Disposition');
        if (contentDisposition) {
          const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = fileNameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            fileName = matches[1].replace(/['"]/g, '');
          }
        }
        if (this.reportForm.getRawValue().format === 'PDF') {
          saveAs(res.body, 'crossChecking_' + fileName + '.pdf');
          this.notificationService.showSuccess('Tải xuống thành công', 'Thông báo');
        } else if (this.reportForm.getRawValue().format === 'EXCEL') {
          saveAs(res.body, 'crossChecking_' + fileName + '.xlsx');
          this.notificationService.showSuccess('Tải xuống thành công', 'Thông báo');
        }
      }, err => {
        this.notificationService.showError('In chi tiết thất bại', 'Lỗi');
      }, () => {
        // this.isDownload = false;
      });
    }
  }
}
