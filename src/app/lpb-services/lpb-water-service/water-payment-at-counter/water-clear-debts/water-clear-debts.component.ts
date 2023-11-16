import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import { compareDate } from 'src/app/shared/constants/utils';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { FormMessageComponent } from '../../shared/components/form-message/form-message.component';
import { COLUMNS_CLEAR_DEBTS } from '../../shared/constants/water.constant';
import { ISupplier } from '../../shared/models/water.interface';
import { HandleErrorService } from '../../shared/services/handleError.service';
import { WaterService } from '../../shared/services/water.service';
declare const $: any;

@Component({
  selector: 'app-water-clear-debts',
  templateUrl: './water-clear-debts.component.html',
  styleUrls: ['./water-clear-debts.component.scss']
})
export class WaterClearDebtsComponent implements OnInit {

  formSearch = this.fb.group({
    supplierCode: [null],
    customerId: [""],
  })

  @ViewChild('dpDateFrom', { static: false }) dpDateFrom: LpbDatePickerComponent;
  @ViewChild('dpDateTo', { static: false }) dpDateTo: LpbDatePickerComponent;

  listSuppliers: ISupplier[] = [];
  isLoading = false;
  selectedRows = [];
  //
  columns = COLUMNS_CLEAR_DEBTS;
  config = {
    filterDefault: 'changeDebtStatus|eq|FAIL&addChangeDebtStatus|nin|IN_PROCESS,SUCCESS&transactionEntity.accountingStatus|eq|SUCCESS',
    defaultSort: '',
    hasSelection: true,
    hasNoIndex: true,
    hasAddtionButton: false,
    hasPaging: true,
    hiddenActionColumn: true
  }
  searchConditions: {
    property: string,
    operator: string,
    value: string
  }[] = [];
  clearSelected = false;

  actions: ActionModel[] = [{
    actionName: "Gạch nợ bổ sung",
    actionIcon: "save",
    actionClick: () => this.clearDebts()
  }]
  //

  constructor(public matdialog: MatDialog,
    private waterService: WaterService, private fb: FormBuilder, private handleErrorService: HandleErrorService) {
  }

  ngOnInit() {    
    $('.parentName').html('Thanh toán hóa đơn nước');
    $('.childName').html('Thanh toán tại quầy / Gạch nợ bổ sung');
  }

  //
  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
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
  }

  validateFromDate(): void {
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

  //
  search(): void {
    this.checkValidateDate();
    if (!(this.dpDateFrom.errorMsg === '' && this.dpDateTo.errorMsg === '')) {
      return;
    }
    let fromDate = "";
    let toDate = "";
    if (this.dpDateFrom.getValue()) {
      fromDate = moment(this.dpDateFrom.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00';
    }
    if (this.dpDateTo.getValue()) {
      toDate = moment(this.dpDateTo.getValue(), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59';
    }

    const searchCondition = [
      {
        property: 'changeDebtStatus',
        operator: 'eq',
        value: "FAIL"
      },
      {
        property: 'addChangeDebtStatus',
        operator: 'nin',
        value: "IN_PROCESS,SUCCESS"
      },
      {
        property: 'transactionEntity.accountingStatus',
        operator: 'eq',
        value: "SUCCESS"
      },
      {
        property: 'customerId',
        operator: 'eq',
        value: this.formSearch.get('customerId').value.trim()
      },
      {
        property: 'supplierCode',
        operator: 'eq',
        value: this.formSearch.get('supplierCode').value
      },
      {
        property: 'createdDate',
        operator: 'gte',
        value: fromDate
      },
      {
        property: 'createdDate',
        operator: 'lte',
        value: toDate
      },
    ];
    this.searchConditions = searchCondition;
  }

  clearDebts() {
    this.clearSelected = false;
    if (this.isLoading) {
      return;
    }
    let selecteds = this.selectedRows;
    if (selecteds.length === 0) {
      this.handleErrorService.openMessageError("Bạn chưa đánh dấu dòng cần gạch nợ bổ sung !")
      return
    }
    let selectedsId = selecteds.map(x => {
      return x["id"];
    })
    this.waterService.insertChangeDebts(selectedsId).toPromise().then(res => {
      this.openMessageSuccess();      
    }).catch(err => {
      this.handleErrorService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
      this.clearSelected = true;
    })
  }

  openMessageSuccess() {
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: { type: "ok", text: "Tạo gạch nợ bổ sung giao dịch thành công !", title: "Thành công", btnOk: { text: "Giao dịch khác", class: "btn-success" } }, position: { top: "0px", right: "0px" }
    })
    dialog.afterClosed().subscribe(res => {
      this.search();
    })
  }

  getRowSelected(selectedRows): void {
    this.selectedRows = selectedRows;
  }

  chkAll(selectedRows) {
    this.selectedRows = selectedRows;
  }
}
