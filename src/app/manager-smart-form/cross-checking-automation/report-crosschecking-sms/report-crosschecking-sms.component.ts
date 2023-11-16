import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {NotificationService} from '../../../_toast/notification_service';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import {compareDate} from '../../../shared/constants/utils';
import {saveAs} from 'file-saver';
import {CrossCheckingService} from '../cross-checking.service';
declare var $: any;

@Component({
  selector: 'app-report-crosschecking-sms',
  templateUrl: './report-crosschecking-sms.component.html',
  styleUrls: ['./report-crosschecking-sms.component.scss']
})
export class ReportCrosscheckingSmsComponent implements OnInit {
  private blob: Blob;
  constructor(private fb: FormBuilder,
              private notify: NotificationService,
              private smsServices: CrossCheckingService) { }

  @ViewChild('dpDateFrom', {static: false}) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', {static: false}) dpDateTo: LpbDatePickerComponent;
  mode = 'indeterminate';
  value = 50;
  color = 'primary';
  isLoading = false;
  reportSMS = this.fb.group({
    smsType: ['smsbranch'],
    formatExport: ['excel']
    }
  );

  ngOnInit(): void {
    $('.parentName').html('Đối soát');
    $('.childName').html('Báo cáo đối soát SMS');
  }
  // ---date---
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

  limitDate(): void {
    const dateFrom = moment(this.dpDateFrom.getValue(), 'DD.MM.YYYY');
    const dateTo = moment(this.dpDateTo.getValue(), 'DD.MM.YYYY');
    const distance = dateTo.diff(dateFrom, 'months');
    if (distance >= 1) {
      this.dpDateFrom.setErrorMsg('Phạm vi báo cáo tối đa trong vòng 1 tháng');
      this.dpDateTo.setErrorMsg('Phạm vi báo cáo tối đa trong vòng 1 tháng');
    }
  }
  defaultFormat(): void {
    this.reportSMS.controls.formatExport.setValue('excel');
  }
  defaultType(): void {
    this.reportSMS.controls.smsType.setValue('smsbranch');
  }
  getFile(): void {
    this.validateToDate();
    this.validateFromDate();
    this.limitDate();
    const req = {
      fromDate: this.dpDateFrom.getValue(),
      toDate: this.dpDateTo.getValue(),
      smsType: this.reportSMS.getRawValue().smsType,
      formatExport: this.reportSMS.getRawValue().formatExport
    };
    if ( this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '') {
      this.isLoading = true;
      this.smsServices.listReportSms(req).subscribe((data) => {
        this.isLoading = false;

        this.blob = new Blob([data], {type: 'application/pdf'});

        const downloadURL = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = downloadURL;
        const fileName = moment().format('yyyyMMDD');
        if (this.reportSMS.getRawValue().formatExport === 'excel') {
          link.download = 'CrossChecking-SMS-' + fileName + '.xlsx';
          this.notify.showSuccess('Tải xuống thành công', 'Thông báo');
        } else {
          link.download = 'CrossChecking-SMS-' + fileName + '.pdf';
          this.notify.showSuccess('Tải xuống thành công', 'Thông báo');
        }
        link.click();
      }, err => {
        this.isLoading = false;
        this.notify.showError('Export thẻ thất bại', 'Lỗi');
      });
    }
  }
}
