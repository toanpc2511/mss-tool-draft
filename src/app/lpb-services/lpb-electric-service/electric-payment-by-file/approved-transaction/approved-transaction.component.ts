import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { compareDate } from 'src/app/shared/constants/utils';
import { BATCH_STATUS_TRANSACTION, FILE_COLUMNS } from '../../shared/constants/electric.constant';
import { ultis } from 'src/app/shared/utilites/function';
import { ActivatedRoute, Router } from '@angular/router';
import { handleBackRouter } from 'src/app/shared/utilites/handle-router';
declare const $: any;

@Component({
  selector: 'app-approved-transaction',
  templateUrl: './approved-transaction.component.html',
  styleUrls: ['./approved-transaction.component.scss']
})
export class ApprovedTransactionComponent implements OnInit {

  transactionStatus = BATCH_STATUS_TRANSACTION;
  formSearch = this.fb.group({
    batchNo: [null],
    fileName: [null],
    branchCode: [null],
    createdUser: [null],
    approvedUser: [null],
    transactionStatus: [this.transactionStatus[0].value],
  })

  @ViewChild('dpDateFrom', { static: false }) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', { static: false }) dpDateTo: LpbDatePickerComponent;

  columns = FILE_COLUMNS;
  config = {
    filterDefault: 'status|eq|IN_PROCESS',
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

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    handleBackRouter.isBackRouter(this.router, "valueFormSearchElectricFile");
  }

  ngOnInit(): void {
    this.setInit();
  }

  setInit() {
    $('.parentName').html('Thanh toán hóa đơn điện');
    $('.childName').html('Duyệt thanh toán theo file');
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
  //
  handleValueFormSearch() {
    const valueFormSearch = JSON.parse(sessionStorage.getItem("valueFormSearchElectricFile"));
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
        this.dpDateFrom.setValue(ultis.dateToString(curDate));
      });
    }
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
    this.searchConditions = this.calcSearchConditions();
    handleBackRouter.setItemStorageForm2("valueFormSearchElectricFile", this.formSearch, this.dpDateFrom.getValue(), this.dpDateTo.getValue());
  }

  retype() {
    this.formSearch.patchValue({
      batchNo: null,
      fileName: null,
      createdUser: null,
      approvedUser: null,
      transactionStatus: this.transactionStatus[0].value,
    })
  }

  calcSearchConditions() {
    let date = this.getFromDateToDate();
    const searchCondition = [
      {
        property: 'createdDate',
        operator: 'gte',
        value: date.fromDate,
      },
      {
        property: 'createdDate',
        operator: 'lte',
        value: date.toDate,
      },
      {
        property: 'batchNo',
        operator: 'like',
        value: this.formSearch.get('batchNo').value,
      },
      {
        property: 'fileName',
        operator: 'like',
        value: this.formSearch.get('fileName').value,
      },
      {
        property: 'tranBrn',
        operator: 'eq',
        value: this.formSearch.get('branchCode').value,
      },
      {
        property: 'createdBy',
        operator: 'eq',
        value: this.formSearch.get('createdUser').value,
      },
      {
        property: 'checkerId',
        operator: 'eq',
        value: this.formSearch.get('approvedUser').value,
      },
      {
        property: 'status',
        operator: 'eq',
        value: this.formSearch.get('transactionStatus').value,
      },
    ];
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

  viewTransaction(row) {
    if (
      ["REJECT_APPROVE_TRANSFER", "REJECT_APPROVE_CHANGE_DEBT"].includes(row.batchStatus)
      || (["APPROVE_TRANSFER"].includes(row.batchStatus) && ["FAIL"].includes(row.stepStatus))
      || (["APPROVE_CHANGE_DEBT"].includes(row.batchStatus) && ["FAIL"].includes(row.stepStatus))
      || (["APPROVE_ACCOUNTING"].includes(row.batchStatus) && !["ERROR"].includes(row.stepStatus))
    ) {
      this.router.navigate(["/electric-service/pay-at-file/detail"], { queryParams: { id: row.id } });
      return;
    }
    this.router.navigate(["detail"], { relativeTo: this.route, queryParams: { id: row["id"] } });
  }
}
