import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {FileService} from '../../../shared/services/file.service';
import {ultis} from '../../../shared/utilites/function';
import * as moment from 'moment';
import {compareDate} from '../../../shared/constants/utils';
import {VietlottService} from '../shared/services/vietlott.service';
import {LIST_CHANEL, LIST_REPORT_TYPE} from '../shared/constants/vietlott.constant';
import {AUTHORIZE_MANAGE, URL_REPORT} from '../shared/constants/url.vietlott.service';
import {BreadCrumbHelper} from '../../../shared/utilites/breadCrumb-helper';
import {isHoiSo} from '../../../shared/utilites/role-check';
import {FormHelpers} from '../../../shared/utilites/form-helpers';
import {LbpValidators} from '../../../shared/validatetors/lpb-validators';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  forms: FormGroup;
  listChanel = LIST_CHANEL;
  urlBranch = AUTHORIZE_MANAGE;
  listReportType = LIST_REPORT_TYPE;
  today = new Date();
  formHelpers = FormHelpers;
  userInfo = JSON.parse(localStorage.getItem('userInfo'));
  constructor(
    private fb: FormBuilder,
    private vietlottService: VietlottService,
    private fileService: FileService,
  ) {
    this.initFormGroup();
    this.initBranch();
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Báo cáo',
    ]);
  }

  initFormGroup(): void {
    this.forms = this.fb.group({
      reportType: ['BC01'],
      listDVKD: [''],
      chanel: ['ALL'],
      fromDate: [ultis.formatDate(this.today), [Validators.required]],
      toDate: [ultis.formatDate(this.today), [Validators.required]]
    }, {validators: [LbpValidators.dateRangeValidator('fromDate', 'toDate', 15)]});
  }

  initBranch(): void {
    // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!isHoiSo()) {
      this.forms.get('listDVKD').setValue(this.userInfo.branchCode);
      this.forms.get('listDVKD').disable();
    }
  }

  reportTransaction(type: 'EXCEL' | 'PDF'): void {
    const body = this.getParams(type);
    console.log('body--', body);
    const url = URL_REPORT;
    this.fileService.downloadFileMethodGet(url, body);
  }

  getParams(type: 'EXCEL' | 'PDF'): any {
    const valueForm = this.forms.value;
    const fromDate = moment(valueForm.fromDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    const toDate = moment(valueForm.toDate, 'DD/MM/YYYY').format('DD/MM/YYYY');
    const params = {
      startDate: fromDate,
      endDate: toDate,
      branchCode: valueForm.listDVKD || this.userInfo.branchCode,
      channel: valueForm.chanel,
      typeFile: type,
      typeReport: valueForm.reportType
    };
    return params;
  }

  // exportFile(type: 'EXCEL' | 'PDF'): void {
  //   const valueForm = this.forms.getRawValue();
  //   const fromDate = valueForm.fromDate
  //     ? moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') +
  //     ' 00:00:00'
  //     : '';
  //   const toDate = valueForm.toDate
  //     ? moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') +
  //     ' 23:59:59'
  //     : '';
  //   const apiPath = `${valueForm.reportType.apiExport}?fromDate=${fromDate}&toDate=${toDate}&fileType=${type}`;
  //
  //   const params = {
  //     filter: ultis.handleValueFilter(this.getParams()),
  //   };
  //   this.fileService.downloadFileMethodGet(apiPath, params);
  // }

}
