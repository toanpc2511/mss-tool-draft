import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { COLUMNS_AUTO_PAY_SIGN_UP, REQUEST_TYPES_AUTO_PAYMENT_SEARCH, STATUS_SETTLE_AUTO_PAYMENT_SEARCH } from '../shared/constants/water.constant';
import { HandleErrorService } from '../shared/services/handleError.service';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import { compareDate } from 'src/app/shared/constants/utils';
import { ultis } from 'src/app/shared/utilites/function';
import { handleBackRouter } from 'src/app/shared/utilites/handle-router';

declare const $: any;

@Component({
  selector: 'app-water-automatic-payment',
  templateUrl: './water-automatic-payment.component.html',
  styleUrls: ['./water-automatic-payment.component.scss']
})
export class WaterAutomaticPaymentComponent implements OnInit {

  statusSettles = STATUS_SETTLE_AUTO_PAYMENT_SEARCH;
  requestTypes = REQUEST_TYPES_AUTO_PAYMENT_SEARCH;
  formSearch = this.fb.group({
    supplierCode: [null],
    customerId: [""],
    statusSettle: [null],
    requestType: [null]
  })

  @ViewChild('dpDateFrom', { static: false }) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', { static: false }) dpDateTo: LpbDatePickerComponent;

  isLoading = false;
  //
  columns = COLUMNS_AUTO_PAY_SIGN_UP;
  config = {
    filterDefault: this.getFilterDefault(),
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: false,
    hasAddtionButton: true,
    hasPaging: true
  }
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];
  //

  constructor(
    public matdialog: MatDialog,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private handleErrorService: HandleErrorService
  ) {
    handleBackRouter.isBackRouter(this.router, "valueFormSearchWaterAuto");
  }

  ngOnInit() {
    this.setInit();
  }

  setInit() {
    $('.parentName').html('Thanh toán hóa đơn nước');
    $('.childName').html('Thanh toán tự động');
    this.handleValueFormSearch();
  }

  handleValueFormSearch() {
    const valueFormSearch = JSON.parse(sessionStorage.getItem("valueFormSearchWaterAuto"));
    if (valueFormSearch) {
      setTimeout(() => {
        this.dpDateFrom.setValue(valueFormSearch.fromDate);
        this.dpDateTo.setValue(valueFormSearch.toDate);
        this.formSearch.setValue(valueFormSearch.form);
        this.search();
      });
    } else {
      const curDate = new Date();
      setTimeout(() => {
        this.dpDateTo.setValue(ultis.dateToString(curDate));
        this.dpDateFrom.setValue(ultis.dateToString(curDate))
      });
    }
  }
  //
  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  getFilterDefault() {
    const curDate = new Date();
    let filterDefault = `createdDate|gte|${ultis.dateToStringDate(curDate, "yyyy-mm-dd")} 00:00:00`
    filterDefault += `&createdDate|lte|${ultis.dateToStringDate(curDate, "yyyy-mm-dd")} 23:59:59`
    return filterDefault;
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
    this.limitDate();
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

  search(): any {
    this.checkValidateDate();
    if (!(this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '')) {
      return;
    }
    let date = this.getFromDateToDate();
    this.searchConditions = [
      {
        property: 'transactionType',
        operator: 'eq',
        value: this.formSearch.get('requestType').value
      },
      {
        property: 'auditStatus',
        operator: 'eq',
        value: this.formSearch.get('statusSettle').value
      },
      {
        property: 'custId',
        operator: 'eq',
        value: this.formSearch.get('customerId').value
      },
      {
        property: 'supplierCode',
        operator: 'eq',
        value: this.formSearch.get('supplierCode').value
      },
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
    ];
    handleBackRouter.setItemStorageForm2("valueFormSearchWaterAuto", this.formSearch, this.dpDateFrom.getValue(), this.dpDateTo.getValue());
  }

  viewAction(row) {
    sessionStorage.setItem("waterHandleType", "view");
    this.router.navigate(["view"], { relativeTo: this.route, queryParams: { id: row["id"] } });
  }

  deleteAction(row) {
    if (!this.allowDelete(row)) {
      this.handleErrorService.openMessageError("Chỉ xóa được bản ghi có trạng thái chờ duyệt đăng ký hoặc từ chối duyệt đăng ký");
      return;
    }
    this.router.navigate(["view"], { relativeTo: this.route, queryParams: { id: row["id"] } });
  }

  allowDelete(row) {
    return ["IN_PROCESS", "REJECT"].includes(row.statusCode) && row.transactionType === "APPROVE_REGISTER_AUTO_SETTLE";
  }

}
