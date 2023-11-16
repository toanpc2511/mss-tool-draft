import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';
import { REQUEST_TYPES_AUTO_PAYMENT_SEARCH, STATUS_SETTLE } from '../../shared/constants/electric.constant';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import { compareDate } from 'src/app/shared/constants/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { ultis } from 'src/app/shared/utilites/function';
import { TRANSACTION_AUTO_PAY_APPROVE_COLUMNS } from '../../shared/constants/auto-pay.constant';
import { handleBackRouter } from 'src/app/shared/utilites/handle-router';

@Component({
  selector: 'app-electric-auto-pay-approve',
  templateUrl: './electric-auto-pay-approve.component.html',
  styleUrls: ['./electric-auto-pay-approve.component.scss']
})
export class ElectricAutoPayApproveComponent implements OnInit {

  transactionTypes = REQUEST_TYPES_AUTO_PAYMENT_SEARCH;
  transactionStatuss = STATUS_SETTLE;
  today = new Date();
  formHelpers = FormHelpers;
  formSearch = this.fb.group({
    transactionType: [null],
    supplierCode: [null],
    branchCode: [null],
    createdUser: [null],
    customerId: [""],
    transactionStatus: [null],
  })

  @ViewChild('dpDateFrom', { static: false }) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', { static: false }) dpDateTo: LpbDatePickerComponent;

  isLoading = false;
  //
  columns = TRANSACTION_AUTO_PAY_APPROVE_COLUMNS;
  config = {
    filterDefault: this.getFilterDefault(),
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasAddtionButton: true,
    hasPaging: true
  }
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];
  //

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    handleBackRouter.isBackRouter(this.router, "valueFormSearchElectricAutoApprove");
  }

  ngOnInit(): void {
    this.setInit();
  }

  setInit() {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán hóa đơn điện',
      'Duyệt thanh toán tự động',
    ]);
    this.handleBrn();
    this.handleValueFormSearch();
  }

  handleBrn() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!['000', '001'].includes(userInfo?.branchCode)) {
      this.formSearch.get('branchCode').setValue(userInfo.branchCode);
      this.formSearch.get('branchCode').disable();
    }
  }

  handleValueFormSearch() {
    const valueFormSearch = JSON.parse(sessionStorage.getItem("valueFormSearchElectricAutoApprove"));
    if (valueFormSearch) {
      setTimeout(() => {
        this.dpDateFrom.setValue(valueFormSearch.fromDate);
        this.dpDateTo.setValue(valueFormSearch.toDate);
        this.formSearch.setValue(valueFormSearch.form);
        this.search();
      });
    } else {
      this.setDefaultDate();
    }
  }

  setDefaultDate() {
    const curDate = new Date();
    setTimeout(() => {
      this.dpDateTo.setValue(ultis.dateToString(curDate));
      this.dpDateFrom.setValue(ultis.dateToString(curDate))
    });
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
    // if (!this.dpDateFrom.getValue()) {
    //   this.dpDateFrom.setErrorMsg('Bạn phải nhập từ ngày');
    //   return;
    // }

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
    // if (!this.dpDateTo.getValue()) {
    //   this.dpDateTo.setErrorMsg('Bạn phải nhập đến ngày');
    //   return;
    // }

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
      this.dpDateFrom.setErrorMsg('Phạm vi tra cứu tối đa trong vòng 1 tháng');
      this.dpDateTo.setErrorMsg('Phạm vi tra cứu tối đa trong vòng 1 tháng');
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
        value: this.formSearch.get('transactionType').value
      },
      {
        property: 'auditStatus',
        operator: 'eq',
        value: this.formSearch.get('transactionStatus').value
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
        property: 'brnCode',
        operator: 'eq',
        value: this.formSearch.get('branchCode').value
      },
      {
        property: 'createdBy',
        operator: 'eq',
        value: this.formSearch.get('createdUser').value
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
    handleBackRouter.setItemStorageForm2("valueFormSearchElectricAutoApprove", this.formSearch, this.dpDateFrom.getValue(), this.dpDateTo.getValue());
  }

  viewTransaction(row) {
    this.router.navigate(['/electric-service/auto-payment/approve/view'], { queryParams: { id: row.id } });
  }

  retype() {
    this.formSearch.reset();
    this.formSearch.patchValue({
      customerId: "",
    })
    this.setDefaultDate();
  }
}
