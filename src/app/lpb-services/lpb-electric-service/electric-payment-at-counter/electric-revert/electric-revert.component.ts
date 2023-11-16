import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { COLUMNS_TRANSACTIONS, PAYMENT_METHODS, SEARCH_TRANSACTION_TYPES, STATUS_TRANSACTION } from '../../shared/constants/electric.constant';
import { HandleErrorService } from 'src/app/shared/services/handleError.service';
import { FrmMessageComponent } from 'src/app/shared/components/form-message/form-message.component';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import { compareDate } from 'src/app/shared/constants/utils';
import { ultis } from 'src/app/shared/utilites/function';
import { ElectricService } from '../../shared/services/electric.service';
declare const $: any;

@Component({
  selector: 'app-electric-revert',
  templateUrl: './electric-revert.component.html',
  styleUrls: ['./electric-revert.component.scss']
})
export class ElectricRevertComponent implements OnInit {

  transactionTypes = SEARCH_TRANSACTION_TYPES;
  statusTransactions = STATUS_TRANSACTION;
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

  //
  columns = COLUMNS_TRANSACTIONS;
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

  constructor(public matdialog: MatDialog,
    private electricService: ElectricService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private handleErrorService: HandleErrorService) {
  }

  ngOnInit() {
    this.setInit();
  }

  setInit() {
    $('.parentName').html('Thanh toán hóa đơn điện');
    $('.childName').html('Revert giao dịch');
  }
  //
  getFilterDefault() {
    let filterDefault = "status|eq|IN_PROCESS";
    return filterDefault;
  }
  //
  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }
  //
  search(): any {
    this.searched = true;
    const searchCondition = [
      {
        property: 'status',
        operator: 'eq',
        value: this.formSearch.get('statusTransaction').value
      },
      {
        property: 'customerId',
        operator: 'eq',
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
    ];
    this.searchConditions = searchCondition;
  }

  viewTransaction(row) {
    this.router.navigate(["view"], { relativeTo: this.route, queryParams: { id: row["tranId"] } });
  }

}
