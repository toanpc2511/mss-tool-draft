import { Router } from '@angular/router';
import { compareDate } from 'src/app/shared/constants/utils';
import { LpbDatePickerComponent } from './../../../../shared/components/lpb-date-picker/lpb-date-picker.component';
import { ActionModel } from './../../../../shared/models/ActionModel';
import { LpbDatatableComponent } from './../../../../shared/components/lpb-datatable/lpb-datatable.component';
import {
  IActionToast,
  ISearchFilter,
} from './../../../../shared/models/shared.interface';
import { IError } from 'src/app/system-configuration/shared/models/error.model';
import { DestroyService } from './../../../../shared/services/destroy.service';
import { takeUntil, finalize } from 'rxjs/operators';
import { CustomNotificationService } from './../../../../shared/services/custom-notification.service';
import { WaterService } from './../../shared/services/water.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  IStatusTransactionReject,
  IStatusTransApprove,
  ISupplier,
  ITransaction,
} from '../../shared/models/water.interface';
import {
  CHANGE_DEBTS_TRANSACTION_TELLER_KSV_COLUMN, STATUS_APPROVE_TRANSACTION_SUCCESS,
  STATUS_TRANSACTION,
  TRANSACTION_TELLER_KSV_COLUMN,
  TRANSACTION_TYPES,
} from '../../shared/constants/water.constant';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { ModalStatusTransactionComponent } from '../../shared/components/modal-status-transaction/modal-status-transaction.component';
import * as moment from 'moment';
import {ultils} from '../../shared/utilites/function';
import {isHoiSo} from '../../../../shared/utilites/role-check';
declare var $: any;

@Component({
  selector: 'app-water-approve-payment',
  templateUrl: './water-approve-payment.component.html',
  styleUrls: ['./water-approve-payment.component.scss'],
  providers: [DestroyService],
})
export class WaterApprovePaymentComponent implements OnInit {
  searchForm: FormGroup;
  suppliers: ISupplier[];
  transactions: ITransaction[];
  isLoading: boolean = false;

  statusTransaction = STATUS_TRANSACTION;
  columnsTeller: any[] = TRANSACTION_TELLER_KSV_COLUMN;
  transactionTypes = TRANSACTION_TYPES;
  transactionTypeValue: string = 'IN_PROCESS';
  apiServiceURL: string = '/water-service/transaction';

  transactionRejectError: IStatusTransactionReject[];
  transactionApproves: IStatusTransApprove[];
  actions: ActionModel[] = [];

  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;
  @ViewChild('dpFromDate', { static: false }) dpFromDate: LpbDatePickerComponent;
  @ViewChild('dpToDate', { static: false }) dpToDate: LpbDatePickerComponent;
  fromDate: string = moment().format('YYYY-MM-DD') + ' 00:00:00';
  configTellerTb = {
    filterDefault: `status|eq|IN_PROCESS&createdDate|gte|${this.fromDate}`,
    defaultSort: '',
    hasSelection: true,
    hasNoIndex: false,
    hasPaging: true,
    hiddenActionColumn: false
  };

  constructor(
    public matdialog: MatDialog,
    private fb: FormBuilder,
    private waterService: WaterService,
    private notifiService: CustomNotificationService,
    private destroy$: DestroyService,
    private router: Router
  ) {
    this.initFormSearch();
  }

  initFormSearch() {
    this.searchForm = this.fb.group({
      supplierCode: [''],
      customerId: [''],
      transactionType: ['IN_PROCESS'],
      status: ['IN_PROCESS'],
      accountingStatus: [''],
      changeDebtStatus: [''],
      addChangeDebtCreatedDate: ['']
    });
  }

  ngOnInit(): void {
    $('.parentName').html('Thanh toán hóa đơn nước');
    $('.childName').html('Thanh toán tại quầy / Phê duyệt');
    this.getSuppliers();
    this.search();
    this.handleChangeTransType();
  }

  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }

  handleChangeTransType() {
    this.searchForm.get('transactionType').valueChanges.subscribe((value) => {
      this.transactionTypeValue = value;
      if (value === 'IN_PROCESS') {
        this.apiServiceURL = '/water-service/transaction';
        this.fromDate = moment().format('YYYY-MM-DD') + ' 00:00:00';
        this.searchForm.patchValue({
          accountingStatus: '',
          changeDebtStatus: '',
          status: 'IN_PROCESS',
          addChangeDebtCreatedDate: ''
        });
      }
      if (value === 'CHANGE_DEBT') {
        const date = moment().format('YYYY-MM-DD') + ' 00:00:00';
        console.log(date);
        this.apiServiceURL = '/water-service/transaction/change-debts';
        this.fromDate = '';
        this.searchForm.patchValue({
          accountingStatus: '',
          addChangeDebtCreatedDate: date,
          changeDebtStatus: 'IN_PROCESS',
          status: '',
        });
      }
      if (value === 'CHECK') {
        this.apiServiceURL = '/water-service/transaction/doubts';
        this.fromDate = '';
        this.searchForm.patchValue({
          accountingStatus: 'ERROR',
          changeDebtStatus: '',
          status: '',
          addChangeDebtCreatedDate: ''
        });

        const curDate = new Date();
        setTimeout(() => {
          this.dpToDate?.setValue(ultils.dateToString(curDate));
          this.dpFromDate.setValue(ultils.dateToString(curDate));
        });
      }
      this.dpFromDate?.setValue('');
      this.dpToDate?.setValue('');
    });
  }

  search(): any {
    this.child?.selection?.clear();
    this.child?.selection?.deselect();
    const valueForm = this.searchForm.value;
    this.columnsTeller =
      valueForm.transactionType === 'CHANGE_DEBT'
        ? CHANGE_DEBTS_TRANSACTION_TELLER_KSV_COLUMN
        : TRANSACTION_TELLER_KSV_COLUMN;
    if (valueForm.transactionType === 'CHECK' && !this.dateValidator()) {
      return;
    }
    if (valueForm.status === 'IN_PROCESS') {
      this.configTellerTb = {
        ...this.configTellerTb,
        hasNoIndex: false,
        hasSelection: true,
        hiddenActionColumn: valueForm.transactionType === 'CHANGE_DEBT'
      };
    } else {
      this.configTellerTb = {
        ...this.configTellerTb,
        hasNoIndex: !valueForm.changeDebtStatus ? true : false,
        hasSelection: valueForm.changeDebtStatus ? true : false,
        hiddenActionColumn: valueForm.transactionType === 'CHANGE_DEBT'
      };
    }
    this.child?.search(this.handleFilter());
    this.handleAction(valueForm);
  }

  handleAction(valueForm) {
    if (valueForm.status === 'IN_PROCESS') {
      this.actions = [
        {
          actionName: 'Duyệt',
          actionIcon: 'save',
          hiddenType: isHoiSo() ? 'disable' : 'none',
          actionClick: () => this.onConfirmApprove(),
        },
        {
          actionName: 'Từ chối',
          actionIcon: 'cancel',
          hiddenType: isHoiSo() ? 'disable' : 'none',
          actionClick: () => this.onConfirmRejectApprove(),
        },
      ];
    } else if (valueForm.changeDebtStatus === 'IN_PROCESS') {
      this.actions = [
        {
          actionName: 'Duyệt gạch nợ',
          actionIcon: 'save',
          hiddenType: isHoiSo() ? 'disable' : 'none',
          actionClick: () => this.onConfirmChangeDebtApprove(),
        },
        {
          actionName: 'Từ chối gạch nợ',
          actionIcon: 'cancel',
          hiddenType: isHoiSo() ? 'disable' : 'none',
          actionClick: () => this.onConfirmChangeDebtRejectApprove(),
        },
      ];
    } else {
      this.actions = [];
    }
  }

  handleFilter() {
    const valueForm = this.searchForm.value;
    const fromDate = moment(this.dpFromDate?.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00'
    const toDate = moment(this.dpToDate?.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59'
    const searchCondition: ISearchFilter[] = [
      {
        property: 'supplierCode',
        operator: 'eq',
        value: valueForm.supplierCode,
      },
      {
        property: 'customerId',
        operator: 'eq',
        value: valueForm.customerId,
      },
      {
        property: 'status',
        operator: 'eq',
        value: valueForm.status,
      },
      {
        property: 'accountingStatus',
        operator: 'eq',
        value: valueForm.accountingStatus,
      },
      {
        property: 'addChangeDebtStatus',
        operator: 'eq',
        value: valueForm.changeDebtStatus,
      },
      {
        property: 'addChangeDebtCreatedDate',
        operator: 'gte',
        value: valueForm.addChangeDebtCreatedDate,
      },
      {
        property: 'createdDate',
        operator: 'gte',
        value: this.dpFromDate?.getValue() ? fromDate : this.fromDate
      },
      {
        property: 'createdDate',
        operator: 'lte',
        value: this.dpToDate?.getValue() ? toDate : ''
      },
    ];
    return searchCondition;
  }

  getSuppliers() {
    this.waterService
      .getListSupplierActive()
      .pipe()
      .subscribe((res) => {
        if (res.data) {
          this.suppliers = res.data;
        }
      });
  }

  showDetailModal(value: ITransaction) {
    if (this.searchForm.value.changeDebtStatus === 'IN_PROCESS') {
      return;
    }
    this.router.navigate([`water-service/pay-at-counter/view`], { queryParams: { id: value.id } })
  }

  viewTransactionApproves() {
    this.waterService.transactionApproveSubject.next(this.transactionApproves);
    this.router.navigate(['water-service/pay-at-counter/view-status'])
  }

  handleDataReqApprove(
    action?: string,
    reason?: string
  ):
    | IDataApproveTransaction
    | IDataRejectTransaction
    | IDataApproveChangeDebtTransaction
    | IDataRejectChangeDebtTransaction {
    let dataReq = this.child.getSectionSelect().map((item) => {
      if (action === 'rejectChangeDebt' || action === 'approveChangeDebt')
        return item.id;
      return {
        transactionId: item.id,
        lastModifiedDate: item.lastModifiedDate,
      };
    });

    if (action === 'reject') {
      return {
        rejectTransList: dataReq,
        reason: reason,
      };
    }
    if (action === 'approveChangeDebt') {
      return {
        tranDetailIds: dataReq,
      };
    }
    if (action === 'rejectChangeDebt') {
      return {
        tranDetailIds: dataReq,
        reason: reason,
      };
    }
    return {
      confirmRequests: dataReq,
    };
  }

  onConfirmRejectApprove() {
    if (this.isLoading) return;
    if (this.child.getSectionSelect().length <= 0) {
      this.notifiService.warning(
        'Cảnh báo',
        'Vui lòng chọn giao dịch trước khi từ chối duyệt'
      );
      return;
    }
    this.isLoading = true;
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận từ chối duyệt',
        message: `Bạn có chắc chắn từ chối duyệt ${
          this.child.getSectionSelect().length
        } giao dịch?`,
        isReject: true,
      },
    });

    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const body = this.handleDataReqApprove('reject', confirm);
        this.waterService
          .rejectTransactions(body)
          .pipe(
            finalize(() => (this.isLoading = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                this.handleStatusReject(res.data.rejectTransList);
              }
            },
            (error: IError) => this.checkError(error)
          );
      } else {
        this.isLoading = false;
      }
    });
  }

  onConfirmApprove() {
    if (this.isLoading) return;
    if (this.child.getSectionSelect().length <= 0) {
      this.notifiService.warning(
        'Cảnh báo',
        'Vui lòng chọn giao dịch trước khi duyệt'
      );
      return;
    }
    this.isLoading = true;
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Xác nhận duyệt ${
          this.child.getSectionSelect().length
        } hóa đơn. Bạn có muốn tiếp tục?`,
      },
    });

    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.waterService
          .approveTransactions(this.handleDataReqApprove())
          .pipe(
            finalize(() => (this.isLoading = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                this.handleStatusApprove(res.data.approves);
              }
            },
            (error: IError) => this.checkError(error)
          );
      } else {
        this.isLoading = false;
      }
    });
  }

  handleStatusApproveDebt(data: IStatusTransApprove[]): void {
    this.transactionApproves = data;
    this.search();
    this.child.clearSection();
    const arrDebt = [];
    this.transactionApproves.forEach((item) => {
      item.changeDebtResponses.forEach((i) => {
        arrDebt.push(i);
      });
    });
    const totalSuccess = arrDebt.filter((item) => item.status === STATUS_APPROVE_TRANSACTION_SUCCESS).length;
    const totalError = arrDebt.filter((item) => item.status !== STATUS_APPROVE_TRANSACTION_SUCCESS).length;
    const actions: IActionToast[] = [
      {
        title: 'Xem chi tiết',
        action: () => this.viewTransactionApproves(),
      },
    ];

    if (totalError <= 0) {
      this.notifiService.success(
        'Thông báo',
        `Duyệt thành công ${totalSuccess} giao dịch`,
        actions
      );
    } else {
      this.notifiService.warning(
        'Thông báo',
        `Duyệt thành công ${totalSuccess} giao dịch, lỗi ${totalError} giao dịch`,
        actions
      );
    }
  }

  handleStatusApprove(data: IStatusTransApprove[]) {
    this.transactionApproves = data;
    this.search();
    this.child.clearSection();
    const listSucces = data.filter((item) => item.status === STATUS_APPROVE_TRANSACTION_SUCCESS);
    const listError = data.filter((item) => item.status !== STATUS_APPROVE_TRANSACTION_SUCCESS);
    const actions: IActionToast[] = [
      {
        title: 'Xem chi tiết',
        action: () => this.viewTransactionApproves(),
      },
    ];

    if (listError.length <= 0) {
      this.notifiService.success(
        'Thông báo',
        `Duyệt thành công ${listSucces.length} giao dịch, lỗi ${listError.length} giao dịch`,
        actions
      );
    } else {
      this.notifiService.warning(
        'Thông báo',
        `Duyệt thành công ${listSucces.length} giao dịch, lỗi ${listError.length} giao dịch`,
        actions
      );
    }
  }

  handleStatusReject(data: IStatusTransactionReject[]) {
    this.search();
    this.child.clearSection();

    const listSucces = data.filter((item) => item.reject);
    const listError = data.filter((item) => !item.reject);
    this.transactionRejectError = listError;

    if (listError.length <= 0) {
      this.notifiService.success(
        'Thông báo',
        `Từ chối thành công ${listSucces.length} giao dịch, lỗi ${listError.length} giao dịch`,
        []
      );
    } else {
      const actions: IActionToast[] = [
        {
          title: 'Xem chi tiết',
          action: () => this.viewStatusRejectTrans(),
        },
      ];
      this.notifiService.warning(
        'Thông báo',
        `Từ chối thành công ${listSucces.length} giao dịch, lỗi ${listError.length} giao dịch`,
        actions
      );
    }
  }

  viewStatusRejectTrans() {
    this.matdialog.open(ModalStatusTransactionComponent, {
      width: '70%',
      maxHeight: '70vh',
      data: this.transactionRejectError,
    });
  }

  onConfirmChangeDebtApprove() {
    if (this.isLoading) return;
    if (this.child.getSectionSelect().length <= 0) {
      this.notifiService.warning(
        'Cảnh báo',
        'Vui lòng chọn kỳ hóa đơn trước khi duyệt'
      );
      return;
    }
    this.isLoading = true;
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận duyệt gạch nợ',
        message: `Bạn có chắc chắn duyệt gạch nợ ${
          this.child.getSectionSelect().length
        } hóa đơn?`,
      },
    });

    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.waterService
          .approveChangeDebtTrans(
            this.handleDataReqApprove('approveChangeDebt')
          )
          .pipe(
            finalize(() => (this.isLoading = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                this.handleStatusApproveDebt(res.data.approves);
              }
            },
            (error: IError) => this.checkError(error)
          );
      } else {
        this.isLoading = false;
      }
    });
  }

  onConfirmChangeDebtRejectApprove() {
    if (this.isLoading) return;
    if (this.child.getSectionSelect().length <= 0) {
      this.notifiService.warning(
        'Cảnh báo',
        'Vui lòng chọn kỳ hóa đơn trước khi từ chối duyệt gạch nợ!'
      );
      return;
    }
    this.isLoading = true;
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận từ chối duyệt gạch nợ',
        message: `Bạn có chắc chắn từ chối duyệt gạch nợ ${
          this.child.getSectionSelect().length
        } hóa đơn?`,
        isReject: true,
      },
    });

    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        const body = this.handleDataReqApprove('rejectChangeDebt', confirm);
        this.waterService
          .rejectChangeDebtTrans(body)
          .pipe(
            finalize(() => (this.isLoading = false)),
            takeUntil(this.destroy$)
          )
          .subscribe(
            (res) => {
              if (res.data) {
                this.handleStatusReject(res.data)
                console.log(res.data);
              }
            },
            (error: IError) => this.checkError(error)
          );
      } else {
        this.isLoading = false;
      }
    });
  }

  checkError(error: IError) {
    if (error.code) {
      this.notifiService.error('Lỗi', error.message);
    } else {
      this.notifiService.error('Lỗi', 'Vui lòng thử lại sau!');
    }
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
}

interface IDataApproveTransaction {
  confirmRequests: ITransactionSelected[];
}

interface IDataRejectTransaction {
  rejectTransList: ITransactionSelected[];
  reason: string;
}

interface IDataApproveChangeDebtTransaction {
  tranDetailIds: string[];
}

interface IDataRejectChangeDebtTransaction {
  tranDetailIds: string[];
  reason: string;
}

interface ITransactionSelected {
  transactionId: string;
  lastModifiedDate: number;
}
