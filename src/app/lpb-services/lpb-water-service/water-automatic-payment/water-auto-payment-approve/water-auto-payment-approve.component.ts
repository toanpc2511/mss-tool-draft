import { WaterService } from '../../shared/services/water.service';
import {
  PAYMENT_AUTO_KSV_COLUMNS,
  STATUS_SETTLE,
  TRANSACTION_TYPES_AUTO_PAYMENT
} from '../../shared/constants/water.constant';
import { IReqApproveAutoPayment, ISupplier } from '../../shared/models/water.interface';
import { LpbDatatableComponent } from 'src/app/shared/components/lpb-datatable/lpb-datatable.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../../../_services/authentication.service';
import { LpbSelect2Component } from '../../../../shared/components/lpb-select2/lpb-select2.component';
import { CustomNotificationService } from '../../../../shared/services/custom-notification.service';
import {
  CustomConfirmDialogComponent
} from '../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { IError } from '../../../../system-configuration/shared/models/error.model';
import { Router } from '@angular/router';
import { isHoiSo } from "../../../../shared/utilites/role-check";
import { ActionModel } from "../../../../shared/models/ActionModel";
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import { compareDate } from 'src/app/shared/constants/utils';
import { ultis } from 'src/app/shared/utilites/function';
import {handleBackRouter} from '../../../../shared/utilites/handle-router';
declare const $: any;

@Component({
  selector: 'app-water-auto-payment-approve',
  templateUrl: './water-auto-payment-approve.component.html',
  styleUrls: ['./water-auto-payment-approve.component.scss'],
})
export class WaterAutoPaymentApproveComponent implements OnInit {
  searchForm: FormGroup;
  transactionTypes = TRANSACTION_TYPES_AUTO_PAYMENT;
  suppliers: ISupplier[];
  branchCodes: any[] = [];
  statusSettles: any[] = STATUS_SETTLE;
  userInfo: any;
  isHoiSo = false;
  apiUrlUserListAll = '/water-service/branch/accounts?roleType=ALL';
  @ViewChild('dpDateFrom', { static: false }) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', { static: false }) dpDateTo: LpbDatePickerComponent;

  createBysState: {
    data: any;
    setData: any;
  };
  configs = {
    filterDefault: this.getFilterDefault(),
    defaultSort: '',
    hasSelection: true,
    hasNoIndex: false,
    hasPaging: true,
    hiddenActionColumn: false
  };
  actions: ActionModel[] = [
    {
      actionName: 'Duyệt đăng ký',
      actionIcon: 'save',
      hiddenType: isHoiSo() ? 'disable' : 'none',
      actionClick: () => this.openModalApprove(),
    },
    {
      actionName: 'Từ chối duyệt',
      actionIcon: 'cancel',
      hiddenType: isHoiSo() ? 'disable' : 'none',
      actionClick: () => this.openModalRejectApprove(),
    }
  ];

  columns = PAYMENT_AUTO_KSV_COLUMNS;

  @ViewChild(LpbDatatableComponent) child: LpbDatatableComponent;
  @ViewChild('selectCreatedBy') selectCreatedBy: LpbSelect2Component;

  constructor(
    private fb: FormBuilder,
    private waterService: WaterService,
    private authenticationService: AuthenticationService,
    private notifiService: CustomNotificationService,
    private matdialog: MatDialog,
    private router: Router
  ) {
    this.initSearchForm();
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (this.userInfo?.branchCode === '001') {
      this.isHoiSo = true;
    }

    this.authenticationService
      .getUserByUserName(this.userInfo.userName)
      .subscribe((result) => {
        let isKSV = false;
        if (result.data?.roles?.length) {
          result.data.roles.forEach((e) => {
            if (e.code === 'UNIFORM.BANK.KSV') {
              isKSV = true;
            }
          });
        }

        if (!this.isHoiSo) {
          this.searchForm.get('branchCode').setValue(this.userInfo.branchCode);
          this.searchForm.get('branchCode').disable();

          if (!isKSV) {
            this.searchForm.get('createdBy').setValue(this.userInfo.userCore);
            this.searchForm.get('createdBy').disable();
          }
        }
      });
  }

  initSearchForm(): void {
    this.searchForm = this.fb.group({
      transactionType: ['APPROVE_REGISTER_AUTO_SETTLE'],
      supplierCode: [''],
      auditStatus: ['IN_PROCESS'],
      branchCode: [''],
      custId: [''],
      createdBy: [''],
    });
  }

  ngOnInit(): void {
    $('.parentName').html('Thanh toán hóa đơn nước');
    $('.childName').html('Thanh toán tự động / Phê duyệt');
    const curDate = new Date();
    setTimeout(() => {
      this.dpDateTo.setValue(ultis.dateToString(curDate));
      this.dpDateFrom.setValue(ultis.dateToString(curDate))
    });
    this.getSuppliers();
    this.handleCreatedBy();
    this.handleValueFormSearch();
  }

  handleValueFormSearch(): void {
    const valueFormSearch = JSON.parse(sessionStorage.getItem('waterAutoApprove'));
    if (valueFormSearch) {
      setTimeout(() => {
        this.dpDateFrom.setValue(valueFormSearch.fromDate);
        this.dpDateTo.setValue(valueFormSearch.toDate);
        this.searchForm.setValue(valueFormSearch.form);
        this.search();
        handleBackRouter.isBackRouter(this.router, 'waterAutoApprove');
      });
    } else {
      const curDate = new Date();
      setTimeout(() => {
        this.dpDateTo.setValue(ultis.dateToString(curDate));
        this.dpDateFrom.setValue(ultis.dateToString(curDate))
      });
    }
  }

  handleCreatedBy(): void {
    this.searchForm.get('branchCode').valueChanges.subscribe((e) => {
      if (this.isHoiSo) {
        this.apiUrlUserListAll = `/water-service/branch/accounts?roleType=ALL&tranBrn=${e ? e : ''}`;
        this.selectCreatedBy.handleClearClick();
      }
    });
  }

  getSuppliers(): void {
    this.waterService
      .getListSupplierActive()
      .pipe()
      .subscribe((res) => {
        if (res.data) {
          this.suppliers = res.data;
        }
      });
  }

  getFilterDefault() {
    let filterDefault = `transactionType|eq|APPROVE_REGISTER_AUTO_SETTLE&auditStatus|eq|IN_PROCESS`;
    const curDate = new Date();
    filterDefault += `&createdDate|gte|${ultis.dateToStringDate(curDate, "yyyy-mm-dd")} 00:00:00`
    filterDefault += `&createdDate|lte|${ultis.dateToStringDate(curDate, "yyyy-mm-dd")} 23:59:59`
    return filterDefault;
  }
  //
  getToday(): string {
    return moment().format('yyyy-MM-DD');
  }

  getFromDate(): any {
    this.dpDateFrom.getValue();
    this.dpDateFrom.focus();
  }

  getToDate(): any {
    this.dpDateTo.getValue();
    this.dpDateTo.focus();
  }

  checkValidateDate() {
    this.validateFromDate();
    this.validateToDate();
    this.limitDate();
  }

  validateFromDate(): void {
    if (!this.dpDateFrom.getValue()) {
      this.dpDateFrom.setErrorMsg('Bạn phải nhập từ ngày');
      return;
    }

    if (this.dpDateFrom.haveValue() && !this.dpDateFrom.isValid) {
      this.dpDateFrom.setErrorMsg('Từ ngày không hợp lệ');
    }
    else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateFrom.setErrorMsg('Từ ngày không được lớn hơn Đến ngày');
    }
    else {
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
    }
    else if (compareDate(this.dpDateFrom.getValue(), this.dpDateTo.getValue()) === 1) {
      this.dpDateTo.setErrorMsg('Đến ngày không được nhỏ hơn Từ ngày');
    }
    else {
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

  getFromDateToDate() {
    let fromDate = "";
    let toDate = "";
    if (this.dpDateFrom.getValue()) {
      fromDate = moment(this.dpDateFrom.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    }
    if (this.dpDateTo.getValue()) {
      toDate = moment(this.dpDateTo.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    }
    return { fromDate: fromDate, toDate: toDate };
  }
  //
  search(): void {
    this.checkValidateDate();
    if (!(this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '')) {
      return;
    }
    let date = this.getFromDateToDate();
    this.child.clearSection();
    const valueForm = this.searchForm.value;
    this.configs = {
      ...this.configs,
      hasNoIndex: valueForm.auditStatus !== 'IN_PROCESS',
      hasSelection: valueForm.auditStatus === 'IN_PROCESS',
    };
    const considions = [
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
        operator: 'eq',
        value: valueForm.custId,
      },
      {
        property: 'auditStatus',
        operator: 'eq',
        value: valueForm.auditStatus,
      },
      {
        property: 'createdBy',
        operator: 'eq',
        value: valueForm.createdBy,
      },
      {
        property: 'createdDate',
        operator: 'gte',
        value: date.fromDate
      },
      {
        property: 'createdDate',
        operator: 'lte',
        value: date.toDate
      },
    ];
    handleBackRouter.setItemStorageForm2('waterAutoApprove', this.searchForm, this.dpDateFrom.getValue(), this.dpDateTo.getValue());
    this.child?.search(considions);
    this.handleActions(valueForm);
  }

  handleActions(value: any): void {
    if (value.auditStatus === 'APPROVED' || value.auditStatus === 'REJECT') {
      this.actions = [];
      return;
    } else {
      this.actions = [
        {
          actionName: value.transactionType === 'APPROVE_REGISTER_AUTO_SETTLE' ? 'Duyệt đăng ký' : 'Duyệt hủy đăng ký',
          actionIcon: 'save',
          hiddenType: isHoiSo() ? 'disable' : 'none',
          actionClick: () => this.openModalApprove(),
        },
        {
          actionName: 'Từ chối duyệt',
          actionIcon: 'cancel',
          hiddenType: isHoiSo() ? 'disable' : 'none',
          actionClick: () => this.openModalRejectApprove(),
        },
      ];
    }
  }

  openModalApprove(): void {
    if (this.child.getSectionSelect().length <= 0) {
      this.notifiService.warning(
        'Cảnh báo',
        'Vui lòng chọn giao dịch trước khi duyệt'
      );
      return;
    }
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Bạn có chắc chắn muốn duyệt ${this.child.getSectionSelect().length
          } giao dịch?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.approve();
      }
    });
  }

  approve(): void {
    this.waterService
      .approveAutoPayment(this.handleDataReq())
      .subscribe(
        (res) => {
          if (res.data) {
            this.handleStatusApprove(res.data);
          }
        },
        (error: IError) => this.checkError(error)
      );
  }


  openModalRejectApprove(): void {
    if (this.child.getSectionSelect().length <= 0) {
      this.notifiService.warning(
        'Cảnh báo',
        'Vui lòng chọn giao dịch trước khi từ chối'
      );
      return;
    }
    const confirmDialog = this.matdialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        title: 'Xác nhận',
        message: `Bạn có chắc chắn muốn từ chối duyệt ${this.child.getSectionSelect().length
          } giao dịch?`,
        isReject: true
      },
    });
    confirmDialog.afterClosed().subscribe((confirm: string) => {
      if (confirm) {
        this.reject(confirm);
      }
    });
  }

  reject(reason: string): void {
    this.waterService
      .rejectApproveAutoPayment(this.handleDataReq(reason))
      .subscribe(
        (res) => {
          if (res.data) {
            this.handleStatusReject(res.data);
          }
        },
        (error: IError) => this.checkError(error)
      );
  }

  handleDataReq(reason?: string): IReqApproveAutoPayment {
    const dataSelected = this.child.getSectionSelect().map((item) => {
      return {
        settleId: item.id,
        lastModifiedDate: item.lastModifiedDate,
      };
    });
    if (reason) {
      return {
        transactionType: this.searchForm.get('transactionType').value,
        approveSettles: dataSelected,
        reason
      };
    }
    return {
      transactionType: this.searchForm.get('transactionType').value,
      approveSettles: dataSelected,
    };
  }

  handleStatusApprove(data): void {
    this.search();
    const listSuccess = data.filter((item) => item.status === 'APPROVED');
    const listError = data.filter((item) => item.status !== 'APPROVED');
    if (listError.length <= 0) {
      this.notifiService.success(
        'Thông báo',
        `Duyệt thành công ${listSuccess.length} giao dịch, lỗi ${listError.length} giao dịch`,
      );
    } else {
      this.notifiService.warning(
        'Thông báo',
        `Duyệt thành công ${listSuccess.length} giao dịch, lỗi ${listError.length} giao dịch`,
      );
    }
  }

  handleStatusReject(data): void {
    this.search();
    const listSuccess = data.filter((item) => item.status === 'REJECT');
    const listError = data.filter((item) => item.status !== 'REJECT');
    if (listError.length <= 0) {
      this.notifiService.success(
        'Thông báo',
        `Từ chối duyệt thành công ${listSuccess.length} giao dịch, lỗi ${listError.length} giao dịch`,
      );
    } else {
      this.notifiService.warning(
        'Thông báo',
        `Từ chối duyệt thành công ${listSuccess.length} giao dịch, lỗi ${listError.length} giao dịch`,
      );
    }
  }

  viewDetail(value): void {
    this.router.navigate(['/water-service/auto-payment/view'], { queryParams: { id: value.id } });
  }

  filterSendBy({ data, setData }): void {
    const users = data?.filter((e) => e.roles === 'Giao dịch viên');
    this.createBysState = {
      data: data?.filter((e) => e === 'Giao dịch viên'),
      setData,
    };
    setData(users);
  }

  checkError(error: IError): void {
    if (error.code) {
      this.notifiService.error('Lỗi', error.message);
    } else {
      this.notifiService.error('Lỗi hệ thống', 'Vui lòng thử lại sau!');
    }
  }
}
