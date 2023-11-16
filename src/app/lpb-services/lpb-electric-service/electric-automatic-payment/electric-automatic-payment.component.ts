import { Component, OnInit } from '@angular/core';
import { ActionModel } from '../../../shared/models/ActionModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TRANSACTION_TYPES_AUTO_PAYMENT } from '../shared/constants/electric.constant';
import { FormHelpers } from '../../../shared/utilites/form-helpers';
import { TRANSACTION_AUTO_PAYMENT_COLUMNS } from '../shared/constants/columns-transaction-electric.constant';
import { ultis } from '../../../shared/utilites/function';
import * as moment from "moment";
import { Router } from "@angular/router";
import { BreadCrumbHelper } from "../../../shared/utilites/breadCrumb-helper";
import { MatDialog } from "@angular/material/dialog";
import {
  CustomConfirmDialogComponent
} from "../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component";
import { IError } from "../../../system-configuration/shared/models/error.model";
import { ElectricService } from "../shared/services/electric.service";
import { CustomNotificationService } from "../../../shared/services/custom-notification.service";
import { EStatusTransactionSettleElectric, STATUS_TRANSACTION_AUTO_PAYMENT } from '../shared/constants/status-transaction-electric.constant';

@Component({
  selector: 'app-electric-automatic-payment',
  templateUrl: './electric-automatic-payment.component.html',
  styleUrls: ['./electric-automatic-payment.component.scss']
})
export class ElectricAutomaticPaymentComponent implements OnInit {
  searchForm: FormGroup;
  today = new Date();
  formHelpers = FormHelpers;
  actions: ActionModel[] = [];
  transactionTypes = TRANSACTION_TYPES_AUTO_PAYMENT;
  statusTransactions = STATUS_TRANSACTION_AUTO_PAYMENT;
  columns = TRANSACTION_AUTO_PAYMENT_COLUMNS;
  config = {
    filterDefault: this.getFilterDefault(),
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: false,
    hasAddtionButton: true,
  };
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];

  curUserName = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private electricService: ElectricService,
    private notify: CustomNotificationService
  ) {
    this.initForm();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      transactionType: [this.transactionTypes[0].value],
      supplierCode: [''],
      custId: [''],
      fromDate: [ultis.formatDate(this.today)],
      toDate: [ultis.formatDate(this.today)],
      auditStatus: [this.statusTransactions[0].value]
    });
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán hóa đơn điện',
      'Thanh toán tự động'
    ]);
    this.curUserName = JSON.parse(localStorage.getItem("userInfo"))?.userName || "";
  }

  get searchControl(): any {
    return this.searchForm.controls;
  }

  getFilterDefault(): string {
    const today = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfToday = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    return `transactionType|eq|APPROVE_REGISTER_AUTO_SETTLE&auditStatus|eq|IN_PROCESS&createdDate|gte|${today}&createdDate|lte|${endOfToday}`;
  }

  search(): void {
    const valueForm = this.searchForm.value;
    const fromDate = moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    const conditions = [
      {
        property: 'transactionType',
        operator: 'eq',
        value: valueForm.transactionType,
      },
      {
        property: 'supplierCode',
        operator: 'eq',
        value: valueForm.supplierCode,
      },
      {
        property: 'custId',
        operator: 'ol',
        value: valueForm.custId,
      },
      {
        property: 'auditStatus',
        operator: 'eq',
        value: valueForm.auditStatus,
      },
      {
        property: 'createdDate',
        operator: 'gte',
        value: valueForm.fromDate ? fromDate : ''
      },
      {
        property: 'createdDate',
        operator: 'lte',
        value: valueForm.toDate ? toDate : ''
      }
    ];

    this.searchConditions = conditions;
  }

  resetForm(): void {
    this.initForm();
  }

  async viewDetail($event): Promise<any> {
    await this.router.navigate(['/electric-service/auto-payment/detail'], { queryParams: { id: $event.id } });
  }

  isDisabledDelete: (row: any) => boolean = (row) => {
    return row.auditStatus !== EStatusTransactionSettleElectric.IN_PROCESS || row.createdBy !== this.curUserName;
  }

  deleteTransaction($event: any): void {
    if (!$event) {
      return;
    }
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận ',
        message: `Bạn có chắc chắn xóa giao dịch?`
      },
    });

    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.electricService
          .deleteTransactionSettle($event.id)
          .subscribe(
            (res) => {
              if (res.data) {
                res.data.status === 'DELETED'
                  ? this.notify.success('Thông báo', res.data.message)
                  : this.notify.warning('Thông báo', res.data.message);
                this.search();
              }
            },
            (error: IError) => this.notify.handleErrors(error)
          );
      }
    });
  }

}
