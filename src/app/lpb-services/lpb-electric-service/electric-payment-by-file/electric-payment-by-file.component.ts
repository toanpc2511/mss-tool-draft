import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionModel } from '../../../shared/models/ActionModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';
import { STATUS_TRANSACTION_PAY_BY_FILE } from '../shared/constants/status-transaction-electric.constant';
import { TRANSACTION_PAYMENT_FILE_COLUMN } from '../shared/constants/columns-transaction-electric.constant';
import { MatDialog } from '@angular/material/dialog';
import {
  CustomConfirmDialogComponent
} from '../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { takeUntil } from 'rxjs/operators';
import { ElectricService } from '../shared/services/electric.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { CustomNotificationService } from '../../../shared/services/custom-notification.service';
import { IError } from '../../../shared/models/error.model';
import { EStatusTransactionByFile } from '../shared/constants/electric.constant';
import { BreadCrumbHelper } from '../../../shared/utilites/breadCrumb-helper';
import { ultis } from '../../../shared/utilites/function';
import { LbpValidators } from '../../../shared/validatetors/lpb-validators';
import { LpbDatepickerNewComponent } from 'src/app/shared/components/lpb-datepicker-new/lpb-datepicker-new.component';
import { compareDate } from 'src/app/shared/constants/utils';

@Component({
  selector: 'app-electric-payment-by-file',
  templateUrl: './electric-payment-by-file.component.html',
  styleUrls: ['./electric-payment-by-file.component.scss']
})
export class ElectricPaymentByFileComponent implements OnInit {
  actions: ActionModel[] = [];
  searchForm: FormGroup;
  today = new Date();
  apiServiceURL = '/electric-service/batch';
  columns = TRANSACTION_PAYMENT_FILE_COLUMN;
  statusTransactions = STATUS_TRANSACTION_PAY_BY_FILE;
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

  @ViewChild('dpDateFrom', { static: false }) dpDateFrom: LpbDatepickerNewComponent;
  @ViewChild('dpDateTo', { static: false }) dpDateTo: LpbDatepickerNewComponent;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog,
    private electricService: ElectricService,
    private destroy$: DestroyService,
    private notify: CustomNotificationService
  ) {
    this.initForm();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      batchNo: [''],
      fileName: [''],
      status: ['IN_PROCESS'],
      fromDate: [ultis.formatDate(this.today), Validators.required],
      toDate: [ultis.formatDate(this.today), Validators.required],
    }, {
      validators: [LbpValidators.dateRangeValidator('fromDate', 'toDate')]
    });
  }

  getFilterDefault(): string {
    const today = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfToday = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    return `status|eq|IN_PROCESS&createdDate|gte|${today}&createdDate|lte|${endOfToday}`;
  }

  isDisabledDelete: (row: any) => boolean = (row) => {
    return row.batchStatus !== EStatusTransactionByFile.IN_PROCESS || row.createdBy !== this.curUserName;
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Dịch vụ điện',
      'Thanh toán theo file',
    ]);
    this.curUserName = JSON.parse(localStorage.getItem("userInfo"))?.userName || "";
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
    const valueForm = this.searchForm.value;
    const fromDate = moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    this.searchConditions = [
      {
        property: 'batchNo',
        operator: 'ol',
        value: valueForm.batchNo,
      },
      {
        property: 'fileName',
        operator: 'eq',
        value: valueForm.fileName,
      },
      {
        property: 'status',
        operator: 'eq',
        value: valueForm.status,
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
  }

  resetForm(): void {
    this.initForm();
  }

  async viewDetail(value): Promise<any> {
    await this.router.navigate(['/electric-service/pay-at-file/detail'], { queryParams: { id: value.id } });
  }

  deleteTransaction($event): void {
    if ($event.batchStatus !== 'IN_PROCESS') {
      this.notify.warning('Cảnh báo', `Không thể xóa giao dịch trạng thái ${$event.batchStatusName}`);
      return;
    }
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn xóa giao dịch?',
        isReject: true,
      }
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        const body = {
          reason: confirm,
          lastModifiedDate: $event.lastModifiedDate,
          batchId: $event.id
        };
        this.electricService.deleleTransactionByFile($event.id, body)
          .pipe(
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                this.notify.success('Thông báo', 'Xóa giao dịch thành công');
                this.search();
              }
            },
            (error: IError) => this.checkError(error)
          );
      }
    });
  }

  checkError(error: IError): void {
    this.notify.error('Lỗi', error.code ? error.message : 'Lỗi hệ thống, vui lòng thử lại sau!');
  }

}
