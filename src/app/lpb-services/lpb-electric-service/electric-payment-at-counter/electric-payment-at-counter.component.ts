import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { COLUMNS_TRANSACTIONS, PAYMENT_METHODS, SEARCH_TRANSACTION_TYPES, STATUS_SETTLE_ELECTRIC } from '../shared/constants/electric.constant';
import { ElectricService } from '../shared/services/electric.service';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import { compareDate } from 'src/app/shared/constants/utils';
import { ultis } from 'src/app/shared/utilites/function';
import { FormMessageService } from 'src/app/shared/services/form-message.service';
import { handleBackRouter } from 'src/app/shared/utilites/handle-router';
import { FileService } from 'src/app/shared/services/file.service';
declare const $: any;

@Component({
  selector: 'app-electric-payment-at-counter',
  templateUrl: './electric-payment-at-counter.component.html',
  styleUrls: ['./electric-payment-at-counter.component.scss']
})
export class ElectricPaymentAtCounterComponent implements OnInit {

  transactionTypes = SEARCH_TRANSACTION_TYPES;
  statusTransactions = STATUS_SETTLE_ELECTRIC;
  paymentMethods = PAYMENT_METHODS;
  formSearch = this.fb.group({
    transactionType: [this.transactionTypes[0].value],
    supplierCode: [null],
    customerId: [""],
    statusTransaction: [this.statusTransactions[0]["value"]],
    amount: [""],
    paymentMethod: [null]
  })

  isLoading = false;
  searched = false;

  @ViewChild('dpDateFrom', { static: false }) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', { static: false }) dpDateTo: LpbDatePickerComponent;
  //
  columns = COLUMNS_TRANSACTIONS;
  config = {
    filterDefault: this.getFilterDefault(),
    defaultSort: 'createdDate:DESC',
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
  openModal = false;
  curId = "";
  curUserName = "";

  constructor(private formMessageService: FormMessageService,
    private electricService: ElectricService, private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private fileService: FileService
  ) {
    handleBackRouter.isBackRouter(this.router, "valueFormSearchElectricAtCounter");
  }

  ngOnInit() {
    this.setInit();
  }

  setInit() {
    $('.parentName').html('Thanh toán hóa đơn điện');
    $('.childName').html('Thanh toán tại quầy');
    this.curUserName = JSON.parse(localStorage.getItem("userInfo"))?.userName || "";
    this.handleValueFormSearch();
  }
  //
  handleValueFormSearch() {
    const valueFormSearch = JSON.parse(sessionStorage.getItem("valueFormSearchElectricAtCounter"));
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
  //
  getFilterDefault() {
    let filterDefault = "status|eq|IN_PROCESS";
    const curDate = new Date();
    filterDefault += `&createdDate|lte|${ultis.dateToStringDate(curDate, "yyyy-mm-dd")} 23:59:59`
    filterDefault += `&createdDate|gte|${ultis.dateToStringDate(curDate, "yyyy-mm-dd")} 00:00:00`
    return filterDefault;
  }
  //
  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
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
    const valueForm = this.formSearch.value;
    this.config = {
      ...this.config,
      defaultSort: (valueForm.status === 'IN_PROCESS' || valueForm.status === 'REVERT_IN_PROCESS') ? 'createdDate:DESC' : 'createdDate:ASC'
    };
    this.searched = true;
    let date = this.getFromDateToDate();
    const searchCondition = [
      {
        property: 'status',
        operator: 'eq',
        value: this.formSearch.get('statusTransaction').value
      },
      {
        property: 'customerId',
        operator: 'eqi',
        value: this.formSearch.get('customerId').value.trim()
      },
      {
        property: 'supplierCode',
        operator: 'eq',
        value: this.formSearch.get('supplierCode').value
      },
      {
        property: 'totalAmount',
        operator: 'eq',
        value: this.formSearch.get('amount').value.replaceAll(".", "")
      },
      {
        property: 'paymentType',
        operator: 'eq',
        value: this.formSearch.get('paymentMethod').value
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
    this.searchConditions = searchCondition;
    handleBackRouter.setItemStorageForm2("valueFormSearchElectricAtCounter", this.formSearch, this.dpDateFrom.getValue(), this.dpDateTo.getValue());
  }

  viewTransaction(row) {
    this.router.navigate(["view"], { relativeTo: this.route, queryParams: { id: row["tranId"] } });
  }

  cancelTransaction(row) {
    if (row["statusCode"] !== "IN_PROCESS") {
      this.formMessageService.openMessageError("Chỉ xóa được giao dịch ở trạng thái chờ duyệt !");
      return;
    }
    const btnOk = { text: "Xác nhận", class: "btn-danger" };
    const btnCancel = { text: "Quay lại", class: "btn-secondary" };
    const message = "Bạn có chắc chắn muốn xóa giao dịch này ?";
    this.formMessageService.confirm("Xác nhận", message, btnOk, btnCancel).then(res => {
      if (res.accept) {
        this.deleteRow(row);
      }
    })
  }

  deleteRow(row) {
    this.isLoading = true;
    let body = { lastModifiedDate: row["lastModifiedDate"], transactionId: row["tranId"] };
    this.electricService.cancelTransaction(body).toPromise().then(res => {
      this.search();
      const btnOk = { text: "Giao dịch khác", class: "btn-success" };
      this.formMessageService.openMessageSuccess("Xóa giao dịch thành công !", "Thành công", btnOk);
    }).catch(err => {
      this.formMessageService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  reverseAction(row) {
    sessionStorage.setItem("electricHandleType", "revert");
    this.router.navigate(["view"], { relativeTo: this.route, queryParams: { id: row["tranId"] } });
  }

  isDisabledReverse: (row: any) => boolean = (row) => {
    return !(["APPROVE"].includes(row["statusCode"]) && ["SUCCESS"].includes(row["changeDebtStatusCode"])) || row["createdBy"] !== this.curUserName;
  }

  isDisabledDelete: (row: any) => boolean = (row) => {
    return row["statusCode"] !== "IN_PROCESS" || row["createdBy"] !== this.curUserName;
  }

  retype() {
    this.formSearch.patchValue({
      supplierCode: null,
      customerId: "",
      statusTransaction: this.statusTransactions[0]["value"],
      amount: "",
      paymentMethod: null
    });
    this.setDefaultDate();
  }

  printAction(row) {
    this.curId = row.id;
    this.openModal = true;
  }

  closeModal() {
    this.openModal = false;
  }

  printBill() {
    this.fileService.downloadFileMethodGet(`electric-service/report/bill/${this.curId}`);
  }

  printReceipt() {
    this.fileService.downloadFileMethodGet(`electric-service/report/receipt/${this.curId}`);
  }
}
