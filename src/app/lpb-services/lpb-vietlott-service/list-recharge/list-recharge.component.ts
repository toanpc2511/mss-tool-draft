import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  LIST_AGENT_TYPE,
  LIST_STATUS, LIST_STATUS_KSV,
  LIST_STATUS_RETRY,
  LIST_TRANS_TYPE,
  TRANSACTION_TABLE, TRANSACTION_TABLE_KSV
} from '../shared/constants/vietlott.constant';
import {LpbDatatableColumn} from '../../../shared/models/LpbDatatableColumn';
import {TRANS_RETRY_SERVICE, TRANS_SERVICE} from '../shared/constants/url.vietlott.service';
import {FormMessageComponent} from '../../lpb-water-service/shared/components/form-message/form-message.component';
import {takeUntil} from 'rxjs/operators';
import {IError} from '../../../shared/models/error.model';
import {HandleErrorService} from '../../../shared/services/handleError.service';
import {MatDialog} from '@angular/material/dialog';
import {VietlottService} from '../shared/services/vietlott.service';
import {DestroyService} from '../../../shared/services/destroy.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {compareDate} from '../../../shared/constants/utils';
import {LpbDatePickerComponent} from '../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {ultis} from '../../../shared/utilites/function';
import {BreadCrumbHelper} from '../../../shared/utilites/breadCrumb-helper';

declare const $: any;

@Component({
  selector: 'app-list-recharge',
  templateUrl: './list-recharge.component.html',
  styleUrls: ['./list-recharge.component.scss'],
  providers: [DestroyService]
})
export class ListRechargeComponent implements OnInit {
  formsSearch: FormGroup;
  listStatus = LIST_STATUS;
  listType = LIST_AGENT_TYPE;
  columns: LpbDatatableColumn [] = TRANSACTION_TABLE;
  urlSearch = `/${TRANS_SERVICE}`; // TRANS_SERVICE
  transId: string;
  isGDV: boolean;
  configs = {
    filterDefault: 'recordStatus|eq|IN_PROCESS',
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
  @ViewChild('dpFromDate', {static: false}) dpFromDate: LpbDatePickerComponent;
  @ViewChild('dpToDate', {static: false}) dpToDate: LpbDatePickerComponent;

  constructor(
    private fb: FormBuilder,
    private handleErrorService: HandleErrorService,
    private matDialog: MatDialog,
    private vietlottService: VietlottService,
    private destroy$: DestroyService,
    private notify: CustomNotificationService,
    private router: Router,
  ) {
    this.initFormGroup();
  }

  initFormGroup(): void {
    this.formsSearch = this.fb.group({
      agentType: ['V2VL'],
      agentCode: [''],
      status: ['IN_PROCESS']
    });
  }

  ngOnInit(): void {
    // $('.parentName').html('Danh sách giao dịch');
    BreadCrumbHelper.setBreadCrumb([
      'Danh sách giao dịch',
    ]);
    this.setToday();
  }

  onViewDetail(value: any): void {
    console.log('viewDetail', value.id);
    this.router.navigate(['vietlott-service/list-recharge/view'], {queryParams: {id: value.id}});
  }

  search(): void {
    // if (this.formsSearch.value.status === 'IN_PROCESS') {
    //   this.configs = {
    //     ...this.configs,
    //     hiddenActionColumn: false
    //   };
    // } else {
    //   this.configs = {
    //     ...this.configs,
    //     hiddenActionColumn: true
    //   };
    // }
    this.searchConditions = this.calcSearchConditions();
    console.log('searchConditions', this.searchConditions);
  }

  calcSearchConditions(): any {
    const fromDate = moment(this.dpFromDate?.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(this.dpToDate?.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    console.log('date', toDate);
    const posId = this.formsSearch.get('agentCode').value ? `${this.formsSearch.get('agentType').value}${this.formsSearch.get('agentCode').value}` : '';
    const searchCondition = [
      {
        property: 'posId',
        operator: 'eq',
        value: posId
      },
      {
        property: 'recordStatus',
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
    return searchCondition;
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }

  setToday(): void {
    const curDate = new Date();
    setTimeout(() => {
      this.dpToDate.setValue(ultis.dateToString(curDate));
      this.dpFromDate.setValue(ultis.dateToString(curDate));
    });
  }

  dateValidator(): boolean {
    this.dpFromDate.setErrorMsg('');
    this.dpToDate.setErrorMsg('');
    if (this.dpFromDate.haveValue()) {
      if (!this.dpFromDate.isValid) {
        this.dpFromDate.setErrorMsg('Từ ngày không hợp lệ');
        return false;
      }
    }
    if (this.dpToDate.haveValue()) {
      if (!this.dpToDate.isValid) {
        this.dpToDate.setErrorMsg('Đến ngày không hợp lệ');
        return false;
      }
    }
    if ((this.dpFromDate.haveValue() && this.dpFromDate.isValid) && (this.dpToDate.haveValue() && this.dpToDate.isValid)) {
      if (compareDate(this.dpFromDate.getValue(), this.dpToDate.getValue()) === 1) {
        this.dpFromDate.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
        return false;
      }
    }
    return true;
  }

  cancelTrans(row): void {
    if (row.recordStatus !== 'IN_PROCESS') {
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
    this.vietlottService.cancelTrans($event.id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
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
    return row.recordStatus !== 'IN_PROCESS';
  }
}
