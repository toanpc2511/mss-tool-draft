import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormHelpers} from '../../../shared/utilites/form-helpers';
import {KBNN_STATUS, RECEIVING_OBJECT, TCT_STATUS} from '../shared/constants/tax.constant';
import * as moment from 'moment/moment';
import {Router} from '@angular/router';
import {ISearchConditions} from '../../../shared/models/LpbDatatableConfig';
import {APPROVE_TRANSACTION_EXTRAL_COLUMNS} from '../shared/constants/columns-tax.constant';
import {ultis} from '../../../shared/utilites/function';
import {BreadCrumbHelper} from '../../../shared/utilites/breadCrumb-helper';
import { MatDialog } from '@angular/material/dialog';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { TaxService } from '../shared/services/tax.service';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { IError } from 'src/app/shared/models/error.model';

@Component({
  selector: 'app-approve-transaction-extral',
  templateUrl: './approve-transaction-extral.component.html',
  styleUrls: ['./approve-transaction-extral.component.scss']
})
export class ApproveTransactionExtralComponent implements OnInit {
  searchForm: FormGroup;
  formHelpers = FormHelpers;
  today = new Date();
  tctStatus = TCT_STATUS;
  kbnnStatus = KBNN_STATUS;
  columns = APPROVE_TRANSACTION_EXTRAL_COLUMNS;
  receivingObjects = RECEIVING_OBJECT;
  receivingObjectControl: FormControl = new FormControl();
  apiServiceURL = '/tax-service/transaction';
  searchConditions: ISearchConditions[] = [];
  rowSelected: any[] = [];
  isDisableSend = true;
  clearSelected = false;
  dataSource: any;

  config = {
    filterDefault: this.getFilterDefault(),
    defaultSort: '',
    hasSelection: true,
    hasPaging: true,
    hasAddtionButton: false,
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private matdialog: MatDialog,
    private taxService: TaxService,
    private notify: CustomNotificationService

  ) {
    this.initSearchForm();
    this.receivingObjectControl.patchValue(RECEIVING_OBJECT[0].value);
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      createdDate: [ultis.formatDate(this.today), [Validators.required]],
      // tctStatus: [this.tctStatus[0].value, [Validators.required]],
      // kbnnStatus: [this.kbnnStatus[0].value, [Validators.required]],
      tctStatus: [this.tctStatus[0].value],
      kbnnStatus: [this.kbnnStatus[0].value],
      keySearch: ['']
    });
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán dịch vụ thuế',
      'Duyệt giao dịch bổ sung',
    ]);
  }

  getFilterDefault(): string {
    const today = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
    const endOfToday = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
    return `status|eq|IN_PROCESS&createdDate|gte|${today}&createdDate|lte|${endOfToday}`;
  }

  get searchControls(): { [key: string]: AbstractControl } {
    return this.searchForm.controls;
  }

  search(): void {
    this.clearSelected = true;
    this.searchForm.markAllAsTouched();
    if (this.searchForm.invalid) {
      return;
    }
    const valueForm = this.searchForm.value;
    const createdDate = moment(valueForm.createdDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
    this.searchConditions = [
      {
        property: 'kbnnStatus',
        operator: 'eq',
        value: valueForm.kbnnStatus,
      },
      {
        property: 'tctStatus',
        operator: 'eq',
        value: valueForm.tctStatus,
      },
      {
        property: 'keySearch',
        operator: 'eq',
        value: valueForm.keySearch,
      },
      {
        property: 'createdDate',
        operator: 'gte',
        value: createdDate + ' 00:00:00'
      },
      {
        property: 'createdDate',
        operator: 'lte',
        value: createdDate + ' 23:59:59' 
      }
    ];
  }

  resetForm(): void {}

  async viewDetail($event: any): Promise<any> {
    await this.router.navigate(['/tax-service/personal-tax/detail'], {queryParams: {id: $event}});
  }

  getRowSelected($event: any): void {
    this.rowSelected = $event.map((item) => item.id);
    this.isDisableSend = this.rowSelected.length <= 0;
  }

  getRawData($event: any): void {
    this.dataSource = $event?.data.map((item) => item.id);
  }

  onSend(isSendAll: boolean = false): void {
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '45%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Xác nhận gửi duyệt hóa đơn. Bạn có muốn tiếp tục?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const req = {
          sendType: this.receivingObjectControl.value,
          tranIds: isSendAll ? this.dataSource : this.rowSelected
        };
        console.log(req);
        
        this.taxService
          .sendTransactionApprove(req)
          .subscribe(
            (res) => {
              if (res.data) {
                console.log(
                  res.data
                );
                
                // this.notify.success(
                //   'Thông báo',
                //   'Từ chối duyệt giao dịch thành công'
                // );
                this.search();
              }
            },
            (error: IError) => this.notify.handleErrors(error)
          );
      }
    });
  }
}
