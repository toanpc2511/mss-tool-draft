import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {compareDate} from '../../../shared/constants/utils';
import * as moment from 'moment';
import {ultis} from '../../../shared/utilites/function';
import {ISchool} from '../shared/models/tuition.interface';
import {TuitionService} from '../shared/services/tuition.service';
import {FileService} from '../../../shared/services/file.service';
import {URL_REPORT_TRANSACTION, URL_REPORT_TUITION} from '../shared/constants/url.tuition.service';
import {HandleErrorService} from '../../../shared/services/handleError.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  forms: FormGroup;
  schools: ISchool[];
  tranBrn: string;
  @ViewChild('dpDateFrom', {static: false}) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', {static: false}) dpDateTo: LpbDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private tuitionService: TuitionService,
    private fileService: FileService,
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    this.getSchools();
    this.getBranch();
    const curDate = new Date();
    setTimeout(() => {
      this.dpDateTo.setValue(ultis.dateToString(curDate));
      this.dpDateFrom.setValue(ultis.dateToString(curDate));
    });
  }

  initFormGroup(): void {
    this.forms = this.fb.group({
      universityCode: ['', [Validators.required]],
      studentCode: [''],
    });
  }

  getSchools(): void {
    this.tuitionService
      .getListUniversityActive()
      .pipe()
      .subscribe((res) => {
        if (res.data) {
          this.schools = res.data;
        }
      });
  }

  checkValidateDate(): void {
    this.validateFromDate();
    this.validateToDate();
  }

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

  validateFromDate(): void {
    if (!this.dpDateFrom.getValue()) {
      this.dpDateFrom.setErrorMsg('Bạn phải nhập từ ngày');
      return;
    }

    if (this.dpDateFrom.haveValue() && !this.dpDateFrom.isValid) {
      this.dpDateFrom.setErrorMsg('Từ ngày không hợp lệ');
    } else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
    } else {
      this.dpDateFrom.setErrorMsg('');
    }
  }

  validateToDate(): void {
    if (!this.dpDateTo.getValue()) {
      this.dpDateTo.setErrorMsg('Bạn phải nhập đến ngày');
      return;
    }

    if (this.dpDateTo.haveValue() && !this.dpDateTo.isValid) {
      this.dpDateTo.setErrorMsg('Đến ngày không hợp lệ');
    } else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateTo.setErrorMsg('Đến ngày không được nhỏ hơn Từ ngày');
    } else {
      this.dpDateTo.setErrorMsg('');
    }
  }

  checkValidate(): boolean {
    this.forms.markAllAsTouched();
    if (this.forms.invalid) {
      return false;
    }
    this.checkValidateDate();
    if (!(this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '')) {
      return false;
    }
    return true;
  }

  reportTuition(): void {
    if (!this.checkValidate()) {
      return;
    }
    const body = this.getParams();
    console.log('body--', body);
    const url = URL_REPORT_TUITION;
    this.fileService.downloadFileMethodGet(url, body);
  }

  reportTransaction(): void {
    if (!this.checkValidate()) {
      return;
    }
    const body = this.getParams();
    console.log('body--', body);
    const url = URL_REPORT_TRANSACTION;
    this.fileService.downloadFileMethodGet(url, body);
  }
  getFromDateToDate(): any {
    let fromDate = '';
    let toDate = '';
    if (this.dpDateFrom.getValue()) {
      fromDate =
        moment(this.dpDateFrom.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') +
        ' 00:00:00';
    }
    if (this.dpDateTo.getValue()) {
      toDate =
        moment(this.dpDateTo.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') +
        ' 23:59:59';
    }
    return { fromDate: fromDate, toDate: toDate };
  }
  getParams(){
    const date = this.getFromDateToDate();
    const params = {
      universityCode: this.forms.get('universityCode').value,
      studentCode: this.forms.get('studentCode').value,
      tranBrn: this.tranBrn,
      startDate: date.fromDate,
      endDate: date.toDate,
    };
    return params;
  }
  getBranch(): void {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!['000', '001'].includes(userInfo?.branchCode)) {
      this.tranBrn = userInfo?.branchCode;
    }
    else {  this.tranBrn = null; }
  }
}
