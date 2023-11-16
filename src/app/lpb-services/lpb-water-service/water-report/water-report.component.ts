import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { compareDate } from 'src/app/shared/constants/utils';
import { LpbDatatableConfig } from 'src/app/shared/models/LpbDatatableConfig';
import { FileService } from 'src/app/shared/services/file.service';
import { ultis } from 'src/app/shared/utilites/function';
import { NotificationService } from 'src/app/_toast/notification_service';
import {
  PAYMENT_CHANNELS,
  REPORT_TYPES,
  STATUS_TRANSACTION_SEARCH,
} from '../shared/constants/water.constant';
import { ultils } from '../shared/utilites/function';
import { HandleErrorService } from 'src/app/shared/services/handleError.service';
declare const $: any;

@Component({
  selector: 'app-water-report',
  templateUrl: './water-report.component.html',
  styleUrls: ['./water-report.component.scss'],
})
export class WaterReportComponent implements OnInit {
  reportTypes = REPORT_TYPES;
  paymentChannels = PAYMENT_CHANNELS;
  statusTransactionSearchs = STATUS_TRANSACTION_SEARCH;
  params = '';
  paramsExport = '';

  formSearch = this.fb.group({
    supplierCode: [null],
    customerId: [''],
    reportType: [this.reportTypes[0]['value']],
    branchCode: [''],
    paymentChannel: [''],
    statusTransactionSearch: [''],
  });

  searched = false;
  isLoading = false;

  @ViewChild('dpDateFrom', { static: false })
  dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', { static: false }) dpDateTo: LpbDatePickerComponent;
  //
  searchConditions: {
    property: string;
    operator: string;
    value: string;
  }[] = [];

  config: LpbDatatableConfig = {
    filterDefault: '',
    defaultSort: "lastModifiedDate:DESC",
    hasSelection: false,
    hasNoIndex: true,
    hasAddtionButton: false,
    hasPaging: true,
  };
  columns = this.reportTypes[0].columns;
  curApi = this.reportTypes[0].api;
  curApiReport = this.reportTypes[0].apiReport;
  rowCount = 0;

  showDetail = false;
  curRow = {};

  constructor(
    private fb: FormBuilder,
    private notify: NotificationService,
    private fileService: FileService,
    private handleErrorService: HandleErrorService
  ) { }

  ngOnInit(): void {
    this.setInit();
  }

  setInit() {
    $('.parentName').html('Thanh toán hóa đơn nước');
    $('.childName').html('Báo cáo');
    this.formSearchValueChange();
    this.handleBrn();
    const curDate = new Date();
    setTimeout(() => {
      this.dpDateTo.setValue(ultils.dateToString(curDate));
      const firstDate = new Date(curDate.setDate(1));
      this.dpDateFrom.setValue(ultils.dateToString(firstDate));
    });
  }
  //
  handleBrn() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!['000', '001'].includes(userInfo?.branchCode)) {
      this.formSearch.get('branchCode').setValue(userInfo.branchCode);
      this.formSearch.get('branchCode').disable();
    }
  }

  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  formSearchValueChange() {
    this.formSearch.valueChanges.subscribe((value) => {
      this.searched = false;
    });
    this.formSearch.controls['reportType'].valueChanges.subscribe((value) => {
      if (value) {
        const curReport = this.reportTypes.find((x) => x.value === value);
        if (curReport) {
          this.curApi = curReport.api;
          this.curApiReport = curReport.apiReport;
          this.columns = curReport.columns;
          if (curReport.value === "1") {
            this.config.hiddenActionColumn = false;
          } else {
            this.config.hiddenActionColumn = true;
          }
        }
      }
    });
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
    } else if (
      compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1
    ) {
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
    } else if (
      compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1
    ) {
      this.dpDateTo.setErrorMsg('Đến ngày không được nhỏ hơn Từ ngày');
    } else {
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
    this.params = this.calcParams();
    this.searchConditions = this.calcSearchConditions();
    this.searched = true;
  }

  calcSearchConditions(exportExcel = false) {
    const searchCondition = [
      {
        property: 'supplierCode',
        operator: 'eq',
        value: this.formSearch.get('supplierCode').value,
      },
    ];
    if (this.formSearch.value.reportType === '1') {
      searchCondition.push(
        {
          property: 'customerId',
          operator: 'eq',
          value: this.formSearch.get('customerId').value.trim(),
        },
        {
          property: 'transactionEntity.paymentChannelType',
          operator: 'eq',
          value: this.formSearch.get('paymentChannel').value,
        }
      );
    }
    if (this.formSearch.value.reportType === '2') {
      searchCondition.push(
        {
          property: 'auditStatus',
          operator: 'eq',
          value: 'APPROVED',
        },
        {
          property: 'transactionType',
          operator: 'in',
          value: 'APPROVE_REGISTER_AUTO_SETTLE,APPROVE_CANCEL_AUTO_SETTLE',
        }
      );
    }
    return searchCondition;
  }

  getFromDateToDate() {
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

  calcParams() {
    let params = '';
    let date = this.getFromDateToDate();
    params = `?fromDate=${date.fromDate}&toDate=${date.toDate}`;
    if (this.formSearch.value.reportType === '1') {
      let status = this.formSearch.get('statusTransactionSearch').value;
      if (status) {
        params += `&status=${status}`;
      }
      let tranBrn = this.formSearch.get('branchCode').value;
      if (tranBrn) {
        params += `&tranBrn=${tranBrn}`;
      }
    }
    return params;
  }

  showReport(id: string) {
    return this.formSearch.value.reportType === id;
  }

  exportExcel() {
    this.checkValidateDate();
    if (!(this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '')) {
      return;
    }
    if (this.rowCount === 0) {
      this.handleErrorService.openMessageError("Không xuất được báo cáo");
      return;
    }
    this.params = this.calcParams();

    const params = {
      filter: ultis.handleValueFilter(this.calcSearchConditions(true)),
    };

    this.isLoading = true;
    this.fileService.downloadFileMethodGet(
      this.curApiReport + this.params,
      params
    );
  }

  getRawData(dataSource) {
    this.rowCount = dataSource && dataSource.data ? dataSource.data.length : 0;
  }

  viewAction(row) {
    if (this.formSearch.value.reportType === '1') {
      this.curRow = row;
      this.showDetail = true;
    }
  }

  closeModal() {
    this.curRow = null;
    this.showDetail = false;
  }
}
