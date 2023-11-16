import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
  LIST_AGENT_TYPE,
  LIST_STATUS, LIST_STATUS_KSV, LIST_STATUS_RETRY, LIST_TRANS_TYPE,
  TRANSACTION_TABLE,
  TRANSACTION_TABLE_KSV
} from '../../shared/constants/vietlott.constant';
import {LpbDatatableColumn} from '../../../../shared/models/LpbDatatableColumn';
import {TRANS_RETRY_SERVICE, TRANS_SERVICE} from '../../shared/constants/url.vietlott.service';
import {LpbDatePickerComponent} from '../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import {HandleErrorService} from '../../../../shared/services/handleError.service';
import {MatDialog} from '@angular/material/dialog';
import {VietlottService} from '../../shared/services/vietlott.service';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {Router} from '@angular/router';
import {BreadCrumbHelper} from '../../../../shared/utilites/breadCrumb-helper';
import * as moment from 'moment';
import {ultis} from '../../../../shared/utilites/function';
import {compareDate} from '../../../../shared/constants/utils';
import {IError} from "../../../../shared/models/error.model";

@Component({
  selector: 'app-recharge-approve',
  templateUrl: './recharge-approve.component.html',
  styleUrls: ['./recharge-approve.component.scss'],
  providers: [DestroyService]
})
export class RechargeApproveComponent implements OnInit {

  formsSearch: FormGroup;
  listStatus = LIST_STATUS_KSV;
  listType = LIST_AGENT_TYPE;
  listTransType = LIST_TRANS_TYPE;
  columns: LpbDatatableColumn [] = TRANSACTION_TABLE_KSV;
  urlSearch = `/${TRANS_SERVICE}`; // TRANS_SERVICE
  transId: string;
  isTypeTrans: boolean;
  configs = {
    filterDefault: 'recordStatus|eq|IN_PROCESS&htStatus|eq|IN_PROCESS',
    defaultSort: 'makerDt:DESC',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hasAddtionButton: true,
    hiddenActionColumn: false,
    buttonOther: [
      {
        icon: 'fa-eye',
        tooltip: 'Xem chi tiết',
        action: (row) => this.onViewDetail(row),
        isDisable: (row) => false
      }
    ]
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
    this.isTypeTrans = true;
  }

  initFormGroup(): void {
    this.formsSearch = this.fb.group({
      agentType: ['V2VL'],
      agentCode: [''],
      status: ['IN_PROCESS'],
      trans_type: ['TRANS']
    });
  }

  ngOnInit(): void {
    // $('.parentName').html('Danh sách giao dịch');
    BreadCrumbHelper.setBreadCrumb([
      'Danh sách giao dịch',
    ]);
    this.setToday();
    this.handleChangeTransType();
  }

  onViewDetail(value: any): void {
    console.log('viewDetail', value.id);
    this.router.navigate(['vietlott-service/approve-recharge/view'], {queryParams: {id: value.id}});
  }

  handleChangeTransType(): void {
    this.formsSearch.get('trans_type').valueChanges.subscribe((value) => {
      switch (value) {
        case 'TRANS':
          this.isTypeTrans = true;
          break;
        case 'TRANS_RETRY':
          this.isTypeTrans = false;
          break;
        case 'TRANS_TIMEOUT':
          this.isTypeTrans = false;
          break;
      }
    });
  }

  search(): void {
    this.searchConditions = this.calcSearchConditions();
    console.log('searchConditions', this.searchConditions);
  }

  calcSearchConditions(): any {
    const fromDate = moment(this.dpFromDate?.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    const toDate = moment(this.dpToDate?.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    console.log('date', toDate);
    let searchCondition;
    const posId = this.formsSearch.get('agentCode').value ? `${this.formsSearch.get('agentType').value}${this.formsSearch.get('agentCode').value}` : '';
    switch (this.formsSearch.get('trans_type').value) {
      case 'TRANS':
        searchCondition = [
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
        this.configs = {
          ...this.configs,
          buttonOther: [
            {
              icon: 'fa-eye',
              tooltip: 'Xem chi tiết',
              action: (row) => this.onViewDetail(row),
              isDisable: (row) => false
            }
          ]
        };
        break;
      case 'TRANS_RETRY':
        searchCondition = [
          {
            property: 'posId',
            operator: 'eq',
            value: posId
          },
          {
            property: 'recordStatus',
            operator: 'in',
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
            value: 'IN_PROCESS'
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
        this.configs = {
          ...this.configs,
          buttonOther: [
            {
              icon: 'fa-eye',
              tooltip: 'Xem chi tiết',
              action: (row) => this.onViewDetail(row),
              isDisable: (row) => false
            }
          ]
        };
        break;
      case 'TRANS_TIMEOUT':
        searchCondition = [
          {
            property: 'posId',
            operator: 'eq',
            value: posId
          },
          {
            property: 'recordStatus',
            operator: 'in',
            value: 'APPROVE'
          },
          {
            property: 'htStatus',
            operator: 'in',
            value: 'ERROR,SUCCESS'
          },
          {
            property: 'gnStatus',
            operator: 'eq',
            value: 'ERROR'
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
        this.configs = {
          ...this.configs,
          buttonOther: [
            {
              icon: 'fa-check-square-o',
              tooltip: 'Kiểm tra',
              action: (row) => this.checkAction(row),
              isDisable: (row) => row.numRetryTimeout >= 1
            },
            {
              icon: 'fa-eye',
              tooltip: 'Xem chi tiết',
              action: (row) => this.onViewDetail(row),
              isDisable: (row) => false
            }
          ]
        };
        break;
    }
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

  checkAction(value: any): void {
    if (value.numRetryTimeout >= 1) {
      this.notify.error('Cảnh báo', 'Giao dịch đã thực hiện kiểm tra 1 lần, trạng thái không xác định. Vui lòng liên hệ ID để hỗ trợ !');
      return;
    }
    this.vietlottService.getTransCheck(value.id).subscribe((res) => {
      if (res.data) {
        this.openMessage(res.data);
      }
      this.search();
    }, (error: IError) => this.notify.handleErrors(error));
  }

  openMessage(data): void {
    const htStatus = data.coreStatus === 'Y' ? 'Hạch toán thành công' : 'Hạch toán thất bại';
    const gnStatus = data.billStatus === 'T' ? 'Tăng hạn mức không xác định. Vui lòng liên hệ ITSupport hỗ trợ !' : (data.billStatus === 'Y' ? ' Tăng hạn mức thành công' : 'Tăng hạn mức thất bại');
    if (data.coreStatus === 'Y' && data.billStatus === 'Y') {
      this.notify.success('Trạng thái giao dịch', htStatus + ' - ' + gnStatus);
    } else {
      this.notify.error('Trạng thái giao dịch', htStatus + ' - ' + gnStatus);
    }
  }

  // BE se tu dong cap nhat trang thai
  // updateStatusTrans(id: string, errorCode: string): void {
  //   let body;
  //   switch (errorCode) {
  //     case '00':
  //       body = {
  //         statusTopUpLimit: [{
  //           transactionId: id,
  //         }],
  //         status: 'APPROVE',
  //         htStatus: 'SUCCESS',
  //         gnStatus: 'SUCCESS',
  //         numRetryTimeout: 1
  //       };
  //       break;
  //     case 'ERR-05':
  //       body = {
  //         statusTopUpLimit: [{
  //           transactionId: id,
  //         }],
  //         status: 'APPROVE',
  //         htStatus: 'SUCCESS',
  //         gnStatus: 'FAIL',
  //         numRetryTimeout: 1
  //       };
  //       break;
  //     default:
  //       body = {
  //         statusTopUpLimit: [{
  //           transactionId: id,
  //         }],
  //         status: 'APPROVE',
  //         htStatus: 'ERROR',
  //         gnStatus: 'ERROR',
  //         numRetryTimeout: 1
  //       };
  //       break;
  //   }
  //   console.log('body--', body);
  //   this.vietlottService.changeDebts(body).toPromise().then(res => {
  //     if (res.data.message === 'SUCCESS') {
  //       this.notify.success('Thành công', 'Cập nhật trạng thái giao dịch thành công');
  //     }
  //   }).catch(err => {
  //     this.handleErrorService.handleError(err);
  //   }).finally(() => {
  //   });
  // }
}
