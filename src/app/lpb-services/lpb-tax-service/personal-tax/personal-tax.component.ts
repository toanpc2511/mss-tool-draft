import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ultis} from '../../../shared/utilites/function';
import {FormHelpers} from '../../../shared/utilites/form-helpers';
import {ETaxStatus, ETaxType, TAX_STATUS, TAX_TYPES} from '../shared/constants/tax.constant';
import * as moment from 'moment';
import {PERSONAL_TAX_COLUMNS} from '../shared/constants/columns-tax.constant';
import {Router} from '@angular/router';
import {BreadCrumbHelper} from '../../../shared/utilites/breadCrumb-helper';
import {ISearchConditions} from '../../../shared/models/LpbDatatableConfig';
import {LbpValidators} from '../../../shared/validatetors/lpb-validators';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { TaxService } from '../shared/services/tax.service';
import { IError } from 'src/app/shared/models/error.model';

@Component({
  selector: 'app-personal-tax',
  templateUrl: './personal-tax.component.html',
  styleUrls: ['./personal-tax.component.scss']
})
export class PersonalTaxComponent implements OnInit {
  searchForm: FormGroup;
  statusTaxs = TAX_STATUS;
  columns = PERSONAL_TAX_COLUMNS;
  taxTypes = TAX_TYPES;
  today = new Date();
  formHelpers = FormHelpers;
  apiServiceURL = '/tax-service/transaction';

  config = {
    filterDefault: this.getFilterDefault(),
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: false,
    hasAddtionButton: true,
  };

  searchConditions: ISearchConditions[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private matdialog: MatDialog,
    private notify: CustomNotificationService,
    private taxService: TaxService
  ) {
    this.initForm();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      taxType: [ETaxType.TCT_QUERY_TND],
      code: [''],
      taxCode: [''],
      fromDate: [ultis.formatDate(this.today)],
      toDate: [ultis.formatDate(this.today)],
      status: [this.statusTaxs[0].value]
    }, {
      validators: [LbpValidators.dateRangeValidator('fromDate', 'toDate')]
    });
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán dịch vụ thuế',
      'Thuế cá nhân',
    ]);
  }

  isDisabledDelete: (row: any) => boolean = (row) => {
    return row.status !== ETaxStatus.IN_PROCESS && row.tctStatus !== ETaxStatus.IN_PROCESS && row.kbnnStatus !== ETaxStatus.IN_PROCESS;
  }

  isDisabledReverse: (row: any) => boolean = (row) => {
    return row.status !== ETaxStatus.APPROVE || row.accountingStatus !== ETaxStatus.SUCCESS;
  }

  getFilterDefault(): string {
    const today = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfToday = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    return `status|eq|IN_PROCESS&createdDate|gte|${today}&createdDate|lte|${endOfToday}`;
  }

  get searchControls(): any {
    return this.searchForm.controls;
  }

  search(): void {
    const valueForm = this.searchForm.value;
    const fromDate = moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    this.searchConditions = [
      {
        property: 'taxType',
        operator: 'eq',
        value: valueForm.taxType,
      },
      {
        property: 'keySearch',
        operator: 'eq',
        value: valueForm.code,
      },
      {
        property: 'taxCode',
        operator: 'eq',
        value: valueForm.taxCode,
      },
      {
        property: 'status',
        operator: 'eq',
        value: valueForm.status === 'ERROR' ? 'APPROVE' : valueForm.status,
      },
      {
        property: 'accountingStatus',
        operator: 'eq',
        value: valueForm.status === 'ERROR' ? 'ERROR' : '',
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

  async viewDetail($event): Promise<any> {
    await this.router.navigate(['/tax-service/personal-tax/detail'], {queryParams: {id: $event.id}});
  }

  deleteTransaction($event): void {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Xác nhận xóa hóa đơn. Bạn có muốn tiếp tục?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const req = {
          lastModifiedDate: $event.lastModifiedDate,
          transactionId: $event.id
        };
        this.taxService
          .deleteTransactions(req)
          .subscribe(
            (res) => {
              if (res.data) {
                this.notify.success(
                  'Thông báo',
                  'Xóa giao dịch thành công'
                );
                this.search();
              }
            },
            (error: IError) => this.notify.handleErrors(error)
          );
      }
    });
  }

  reverseTransaction($event): void {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Xác nhận reverse hóa đơn. Bạn có muốn tiếp tục?`
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const req = {
          lastModifiedDate: $event.lastModifiedDate,
          id: $event.id
        };
        this.taxService
          .reverseTransactions(req)
          .subscribe(
            (res) => {
              if (res.data) {
                this.notify.success(
                  'Thông báo',
                  'Reverse giao dịch thành công'
                );
                this.search();
              }
            },
            (error: IError) => this.notify.handleErrors(error)
          );
      }
    });
  }
}
