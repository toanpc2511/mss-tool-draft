import {Component, OnInit} from '@angular/core';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {
  CUSTOMER_REGISTER_COLUMNS
} from '../../shared/constants/columns-transaction-electric.constant';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ElectricService} from '../../shared/services/electric.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {FormHelpers} from '../../../../shared/utilites/form-helpers';
import {ultis} from '../../../../shared/utilites/function';
import {STATUS_ACTIVE} from '../../shared/constants/electric.constant';
import {Router} from '@angular/router';
import {BreadCrumbHelper} from '../../../../shared/utilites/breadCrumb-helper';
import * as moment from 'moment';
import { IError } from 'src/app/shared/models/error.model';
import { EStatusActive } from '../../shared/constants/status-transaction-electric.constant';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {LbpValidators} from '../../../../shared/validatetors/lpb-validators';

@Component({
  selector: 'app-customer-register',
  templateUrl: './customer-register.component.html',
  styleUrls: ['./customer-register.component.scss']
})
export class CustomerRegisterComponent implements OnInit {
  statusCustomer = STATUS_ACTIVE;

  settleDates = ultis.calcRecurringPaymentDate();
  today = new Date();
  searchForm: FormGroup;
  formHelpers = FormHelpers;
  actions: ActionModel[] = [];
  columns = CUSTOMER_REGISTER_COLUMNS;
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

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private electricService: ElectricService,
    private notify: CustomNotificationService,
    private matDialog: MatDialog
  ) {
    this.initForm();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      supplierCode: [''],
      custId: [''],
      cif: [''],
      acNumber: [''],
      settleDateFrom: [''],
      settleDateTo: [''],
      phone: [''],
      email: [''],
      status: [STATUS_ACTIVE[0].value],
      fromDate: [ultis.formatDate(this.today)],
      toDate: [ultis.formatDate(this.today)]
    }, {
      validators: [LbpValidators.dateRangeValidator('fromDate', 'toDate')]
    });
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán hóa đơn điện',
      'Thanh toán tự động',
      'Danh sách KH đăng ký TTTĐ'
    ]);
  }

  get searchControls(): any {
    return this.searchForm.controls;
  }

  getFilterDefault(): string {
    const today = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfToday = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    return `status|eq|ACTIVE&createdDate|gte|${today}&createdDate|lte|${endOfToday}`;
  }

  checkValidateSearchForm(): boolean {
    const valueForm = this.searchForm.value;
    if (valueForm.settleDateTo && valueForm.settleDateFrom && (valueForm.settleDateTo < valueForm.settleDateFrom)) {
      this.searchForm.controls.settleDateTo.setErrors({invalidSettleDate: true});
      return true;
    }
    this.searchForm.controls.settleDateTo.setErrors(null);
    return false;
  }

  search(): void {
    if (this.checkValidateSearchForm() || this.searchForm.invalid) {
      return;
    }
    const valueForm = this.searchForm.value;
    const fromDate = moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    const conditions = [
      {
        property: 'supplierCode',
        operator: 'eq',
        value: valueForm.supplierCode,
      },
      {
        property: 'custId',
        operator: 'eqi',
        value: valueForm.custId,
      },
      {
        property: 'cif',
        operator: 'ol',
        value: valueForm.cif,
      },
      {
        property: 'acNumber',
        operator: 'eq',
        value: valueForm.acNumber,
      },
      {
        property: 'custEmail',
        operator: 'ol',
        value: valueForm.email,
      },
      {
        property: 'email',
        operator: 'ol',
        value: valueForm.email,
      },
      {
        property: 'phone',
        operator: 'ol',
        value: valueForm.phone,
      },
      {
        property: 'custMobile',
        operator: 'ol',
        value: valueForm.phone,
      },
      {
        property: 'status',
        operator: 'eq',
        value: valueForm.status,
      },
      {
        property: 'settleDate',
        operator: 'gte',
        value: valueForm.settleDateFrom ? valueForm.settleDateFrom :  ''
      },
      {
        property: 'settleDate',
        operator: 'lte',
        value: valueForm.settleDateTo ? valueForm.settleDateTo :  ''
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

  viewDetail($event): void {
    this.router.navigate(['/electric-service/auto-payment/list-customer/detail'], {queryParams: {id: $event.id}});
  }


  cancelRegister($event): void {
    if ($event.status !== EStatusActive.ACTIVE) {
      return;
    }

    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn hủy đăng ký thanh toán tự động?',
        isReject: true,
      }
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        const body = {
          lastModifiedDate: $event.lastModifiedDate,
          settleId: $event.id,
          transactionType: 'CANCEL_AUTO_SETTLE'
        };
        this.electricService.cancelRegisterAutoPayment(body)
        .subscribe((res) => {
          if (res.data) {
            this.notify.success('Thông báo', 'Tạo giao dịch hủy thành công');
            this.search();
          }
        }, (error: IError) => this.notify.handleErrors(error));
      }
    });
  }

  isDisabledCancel: (row: any) => boolean = (row) => {
    return row.status !== EStatusActive.ACTIVE;
  }

  isDisabledUpdate: (row: any) => boolean = (row) => {
    return row.status !== EStatusActive.ACTIVE;
  }

  async updateRegister($event): Promise<any> {
    if (!$event.id || $event.status === 'INACTIVE') {
      return;
    }
    await this.router.navigate(['/electric-service/auto-payment/list-customer/update'], {queryParams: {id: $event.id}});
  }
}
