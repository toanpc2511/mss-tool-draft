import {Component, OnInit, ViewChild} from '@angular/core';
import {COLUMNS_REPORT_CROSS_CHECKING, CROSS_CHECKING_RESULTS} from '../shared/constants/water.constant';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {LpbDatatableConfig} from '../../../shared/models/LpbDatatableConfig';
import {AbstractControl, FormBuilder} from '@angular/forms';
import {NotificationService} from '../../../_toast/notification_service';
import {FileService} from '../../../shared/services/file.service';
import {ultils} from '../shared/utilites/function';
import * as moment from 'moment';
import {compareDate} from '../../../shared/constants/utils';
import {ultis} from '../../../shared/utilites/function';
declare const $: any;
@Component({
  selector: 'app-crosschecking-report',
  templateUrl: './cross-checking-report.component.html',
  styleUrls: ['./cross-checking-report.component.scss']
})
export class CrossCheckingReportComponent implements OnInit {


  crossCheckingResults = CROSS_CHECKING_RESULTS;
  params = "";

  formSearch = this.fb.group({
    supplierCode: [null],
    transNo: [""],
    customerId: [""],
    crossCheckingResult: [""],
  })

  searched = false;
  isLoading = false;

  @ViewChild('dpDateFrom', { static: false }) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', { static: false }) dpDateTo: LpbDatePickerComponent;
  //
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];

  config: LpbDatatableConfig = {
    filterDefault: '',
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasAddtionButton: false,
    hasPaging: true,
    hiddenActionColumn: true
  }
  columns = COLUMNS_REPORT_CROSS_CHECKING;
  totalRecords = 0;
  trueRecords = 0;
  falseRecords = 0;

  constructor(private fb: FormBuilder, private notify: NotificationService, private fileService: FileService) { }

  ngOnInit(): void {
    this.setInit();
  }

  setInit() {
    $('.parentName').html('Đối soát nước');
    $('.childName').html('Báo cáo');
    this.formSearchValueChange();
    const curDate = new Date();
    setTimeout(() => {
      this.dpDateTo.setValue(ultils.dateToString(curDate));
      const firstDate = new Date(curDate.setDate(1));
      this.dpDateFrom.setValue(ultils.dateToString(firstDate))
    });
  }
  //
  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  formSearchValueChange() {
    this.formSearch.valueChanges.subscribe(value => {
      this.searched = false;
    })
  }
  //
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

  checkValidateDate() {
    this.validateFromDate();
    this.validateToDate();
  }

  validateFromDate(): void {
    if (!this.dpDateFrom.getValue()) {
      this.dpDateFrom.setErrorMsg('Bạn phải nhập từ ngày');
      return;
    }

    if (this.dpDateFrom.haveValue() && !this.dpDateFrom.isValid) {
      this.dpDateFrom.setErrorMsg('Từ ngày không hợp lệ');
    }
    else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
    }
    else {
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

  search(): void {
    this.checkValidateDate();
    if (!(this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '')) {
      return;
    }
    this.searchConditions = this.calcSearchConditions();
    this.searched = true;
  }

  getRawData(data) {
    this.totalRecords = data.meta.total;
    this.falseRecords = data.meta.totalErrors;
    this.trueRecords = this.totalRecords - this.falseRecords;
  }

  calcSearchConditions(exportExcel = false) {
    const searchCondition = [
      {
        property: 'supplierCode',
        operator: 'eq',
        value: this.formSearch.get('supplierCode').value
      },
      {
        property: 'tranNo',
        operator: 'eq',
        value: this.formSearch.get('transNo').value.trim()
      },
      {
        property: 'custId',
        operator: 'eq',
        value: this.formSearch.get('customerId').value.trim()
      },
      {
        property: 'forControlResult',
        operator: 'eq',
        value: this.formSearch.get('crossCheckingResult').value
      },
    ];
    if (!exportExcel) {
      let date = this.getFromDateToDate();
      searchCondition.push(
        {
          property: 'createdDate',
          operator: 'gte',
          value: date.fromDate
        },
        {
          property: 'createdDate',
          operator: 'lte',
          value: date.toDate
        },
      )
    }
    return searchCondition;
  }

  getFromDateToDate() {
    let fromDate = "";
    let toDate = "";
    if (this.dpDateFrom.getValue()) {
      fromDate = moment(this.dpDateFrom.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    }
    if (this.dpDateTo.getValue()) {
      toDate = moment(this.dpDateTo.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    }
    return { fromDate: fromDate, toDate: toDate };
  }

  calcParams() {
    let params = "";
    let date = this.getFromDateToDate();
    params = `?fromDate=${date.fromDate}&toDate=${date.toDate}`
    return params;
  }

  exportExcel() {
    this.checkValidateDate();
    if (!(this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '')) {
      return;
    }
    const params = {
      filter: ultis.handleValueFilter(this.calcSearchConditions(true))
    }

    this.params = this.calcParams();
    this.isLoading = true;
    this.fileService.downloadFileMethodGet("water-service/cross-check/export-for-control" + this.params, params);
  }


}
