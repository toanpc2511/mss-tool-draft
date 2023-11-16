import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LIST_STATUS, TRANSACTION_TABLE_VIETTEL_POST} from '../shared/constants/viettel-post.constant';
import {LpbDatatableColumn} from '../../../shared/models/LpbDatatableColumn';
import {LIST_TRANS_SERVICE} from '../shared/constants/url.viettel-post.service';
import {Router} from '@angular/router';
import {FormMessageComponent} from '../../lpb-water-service/shared/components/form-message/form-message.component';
import {takeUntil} from 'rxjs/operators';
import {IError} from '../../../shared/models/error.model';
import {ViettelPostService} from '../shared/services/viettelpost.service';
import {MatDialog} from '@angular/material/dialog';
import {DestroyService} from '../../../shared/services/destroy.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {HandleErrorService} from '../../../shared/services/handleError.service';
import {ultis} from '../../../shared/utilites/function';
import {FormHelpers} from '../../../shared/utilites/form-helpers';
import * as moment from 'moment';
import {LbpValidators} from '../../../shared/validatetors/lpb-validators';

@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.scss'],
  providers: [DestroyService]
})
export class ListTransactionComponent implements OnInit {
  formsSearch: FormGroup;
  listStatus = LIST_STATUS;
  urlTrans = LIST_TRANS_SERVICE;
  columns: LpbDatatableColumn [] = TRANSACTION_TABLE_VIETTEL_POST;
  today = new Date();
  formHelpers = FormHelpers;
  configs = {
    filterDefault: 'status|eq|IN_PROCESS',
    defaultSort: 'makerDt:DESC',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hasAddtionButton: true,
    hiddenActionColumn: false,
  };
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];

  constructor(
    private fb: FormBuilder,
    private viettelPostService: ViettelPostService,
    private matDialog: MatDialog,
    private destroy$: DestroyService,
    private notify: CustomNotificationService,
    private router: Router,
    private handleErrorService: HandleErrorService,
  ) {
    this.initFormGroup();
  }

  initFormGroup(): void {
    this.formsSearch = this.fb.group({
      billCode: [''],
      status: ['IN_PROCESS'],
      fromDate: [ultis.formatDate(this.today), [Validators.required]],
      toDate: [ultis.formatDate(this.today), [Validators.required]]
    }, {validators: [LbpValidators.dateRangeValidator('fromDate', 'toDate')]});
  }

  ngOnInit(): void {
  }

  search(): void {
    this.searchConditions = this.calcSearchConditions();
    console.log('searchConditions', this.searchConditions);
  }

  calcSearchConditions(): any {
    const valueForm = this.formsSearch.value;
    const fromDate = moment(valueForm.fromDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(valueForm.toDate, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    return [
      {
        property: 'billCode',
        operator: 'eq',
        value: this.formsSearch.get('billCode').value
      },
      {
        property: 'status',
        operator: 'eq',
        value: this.formsSearch.get('status').value
      },
      {
        property: 'makerDt',
        operator: 'gte',
        value: fromDate
      },
      {
        property: 'makerDt',
        operator: 'lte',
        value: toDate
      }
    ];
  }

  onViewDetail(value: any): void {
    console.log('viewDetail', value.id);
    this.router.navigate(['viettel-post-service/list-transaction/view'], {queryParams: {id: value.id}});
  }

  cancelTrans(row): void {
    if (row.status !== 'IN_PROCESS') {
      this.handleErrorService.openMessageError('Không được xóa giao dịch ở trạng thái đã duyệt/từ chối !');
      return;
    }
    const message = 'Bạn có chắc chắn muốn xóa giao dịch này ?';
    const dialog = this.matDialog.open(FormMessageComponent, {
      data: {
        type: 'cancel',
        text: message,
        title: 'Xác nhận',
        btnOk: {text: 'Xác nhận', class: 'btn-danger'},
        btnCancel: {text: 'Quay lại', class: 'btn-secondary'}
      }, hasBackdrop: true, disableClose: true, backdropClass: 'bg-none'
    });

    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.deleteRow(row);
      }
    });
  }

  deleteRow($event): void {
    if (!$event.id) {
      return;
    }
    this.viettelPostService.cancelTrans($event.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        res.data.message === 'Fail'
          ? this.notify.error('Thông báo', `Xóa giao dịch thất bại`)
          : this.notify.success('Thông báo', `Xóa giao dịch thành công`);
        this.search();
      }
    }, (error: IError) => this.notify.error('Lỗi', error.message));
    this.matDialog.closeAll();
  }

  isDisabledDelete: (row: any) => boolean = (row) => {
    return row.status !== 'IN_PROCESS';
  }
}
