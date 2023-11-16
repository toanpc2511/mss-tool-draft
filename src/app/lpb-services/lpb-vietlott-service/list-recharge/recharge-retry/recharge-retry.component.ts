import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {compareDate} from '../../../../shared/constants/utils';
import {HandleErrorService} from '../../../lpb-water-service/shared/services/handleError.service';
import {MatDialog} from '@angular/material/dialog';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {LpbDatePickerComponent} from '../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {
  LIST_AGENT_TYPE,
  LIST_STATUS_KSV,
  LIST_STATUS_RETRY,
  TRANSACTION_RETRY_TABLE
} from '../../shared/constants/vietlott.constant';
import {Router} from '@angular/router';
import {VietlottService} from '../../shared/services/vietlott.service';
import {FormMessageComponent} from '../../../lpb-water-service/shared/components/form-message/form-message.component';
import {TRANS_SERVICE} from '../../shared/constants/url.vietlott.service';
import {ultis} from '../../../../shared/utilites/function';
import {takeUntil} from 'rxjs/operators';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {IError} from '../../../../shared/models/error.model';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';

declare const $: any;

@Component({
  selector: 'app-recharge-retry',
  templateUrl: './recharge-retry.component.html',
  styleUrls: ['./recharge-retry.component.scss'],
  providers: [DestroyService]
})
export class RechargeRetryComponent implements OnInit {
  formSearch: FormGroup;
  listType = LIST_AGENT_TYPE;
  isLoading = false;
  clearSelected = false;
  selectedRows = [];
  urlSearch = `/${TRANS_SERVICE}`;
  columns = TRANSACTION_RETRY_TABLE;
  config = {
    filterDefault: 'recordStatus|eq|APPROVE&htStatus|eq|SUCCESS&gnStatus|eq|FAIL',
    defaultSort: 'makerDt:DESC',
    hasSelection: true,
    hasNoIndex: true,
    hasAddtionButton: false,
    hasPaging: true,
    hiddenActionColumn: false
  };
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];
  actions: ActionModel[] = [{
    actionName: 'Tăng hạn mức bổ sung',
    actionIcon: 'save',
    actionClick: () => this.transRetry()
  }];

  @ViewChild('dpDateFrom', {static: false}) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', {static: false}) dpDateTo: LpbDatePickerComponent;

  constructor(
    private matdialog: MatDialog,
    private fb: FormBuilder,
    private handleErrorService: HandleErrorService,
    private notify: CustomNotificationService,
    private router: Router,
    private vietlottService: VietlottService,
    private destroy$: DestroyService,
  ) {
    this.initFormGroup();
  }

  ngOnInit(): void {
    $('.parentName').html('Danh sách giao dịch');
    $('.childName').html('Danh sách giao dịch tăng hạn mức bổ sung');
    this.setToday();
  }

  initFormGroup(): void {
    this.formSearch = this.fb.group({
      agentCode: ['', [Validators.required]],
      agentType: ['V2VL']
    });
  }

  search(): void {
    const fromDate = moment(this.dpDateFrom?.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(this.dpDateTo?.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    const posId = this.formSearch.get('agentCode').value ? `${this.formSearch.get('agentType').value}${this.formSearch.get('agentCode').value}` : '';
    this.searchConditions = [
      {
        property: 'posId',
        operator: 'eq',
        value: posId
      },
      {
        property: 'recordStatus',
        operator: 'eq',
        value: 'APPROVE'
      },
      {
        property: 'htStatus',
        operator: 'eq',
        value: 'SUCCESS'
      },
      {
        property: 'gnStatus',
        operator: 'eq',
        value: 'FAIL'
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
    console.log('searchConditions', this.searchConditions);
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }

  setToday(): void {
    const curDate = new Date();
    setTimeout(() => {
      this.dpDateTo.setValue(ultis.dateToString(curDate));
      this.dpDateFrom.setValue(ultis.dateToString(curDate));
    });
  }

  checkValidateDate(): void {
    this.validateFromDate();
    this.validateToDate();
  }

  getFromDate(): any {
    this.dpDateFrom.getValue();
    this.dpDateFrom.focus();
  }

  getToDate(): any {
    this.dpDateTo.getValue();
    this.dpDateTo.focus();
  }

  validateFromDate(): void {
    if (this.dpDateFrom.haveValue() && !this.dpDateFrom.isValid) {
      this.dpDateFrom.setErrorMsg('Từ ngày không hợp lệ');
    } else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
    } else {
      this.dpDateFrom.setErrorMsg('');
    }
  }

  validateToDate(): void {
    if (this.dpDateTo.haveValue() && !this.dpDateTo.isValid) {
      this.dpDateTo.setErrorMsg('Đến ngày không hợp lệ');
    } else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateTo.setErrorMsg('Đến ngày không được nhỏ hơn Từ ngày');
    } else {
      this.dpDateTo.setErrorMsg('');
    }
  }

  transRetry(): void {
    this.clearSelected = false;
    if (this.isLoading) {
      return;
    }
    const selecteds = this.selectedRows;
    if (selecteds.length === 0) {
      this.handleErrorService.openMessageError('Bạn chưa đánh dấu dòng cần gạch nợ bổ sung !');
      return;
    }
    const body = {
      statusTopUpLimit:
        selecteds.map(x => {
          return {transactionId: x.id};
        })
      ,
      status: 'APPROVE',
      htStatus: 'SUCCESS',
      gnStatus: 'IN_PROCESS',
      numSettleBill: 1
    };
    console.log('body--', body);
    this.vietlottService.changeDebts(body).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.data) {
        (res.data.message === 'SUCCESS')
          ? this.notify.success('Thành công', 'Tạo tăng hạn mức bổ sung giao dịch thành công')
          : this.notify.error('Thất bại', 'Tạo tăng hạn mức bổ sung giao dịch thất bại');
      }
      this.isLoading = false;
      this.clearSelected = true;
    }, (error: IError) => this.notify.handleErrors(error));
  }

  onViewDetail(value: any): void {
    console.log('viewDetail', value.id);
    this.router.navigate(['vietlott-service/list-recharge/view'], {queryParams: {id: value.id}});
  }

  getRowSelected(selectedRows): void {
    this.selectedRows = selectedRows;
  }

  chkAll(selectedRows): void {
    this.selectedRows = selectedRows;
  }

  isDisabledDelete: (row: any) => boolean = (row) => {
    return true;
  }
}
