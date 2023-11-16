import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { LpbDatatableConfig } from 'src/app/shared/models/LpbDatatableConfig';
import { ACCOUNTING_COLUMNS, CHANGE_DEBT_COLUMNS } from '../../../shared/constants/by-file.constant';
import { ElectricService } from '../../../shared/services/electric.service';
import { FormMessageService } from 'src/app/shared/services/form-message.service';

@Component({
  selector: 'app-approved-file-step-three',
  templateUrl: './approved-file-step-three.component.html',
  styleUrls: ['./approved-file-step-three.component.scss']
})
export class ApprovedFileStepThreeComponent implements OnInit {
  @Input() dataRoot;
  @Output() exportXls = new EventEmitter<any>();
  @Output() dataRootChange = new EventEmitter<any>();
  @Output() totalAmountChange = new EventEmitter<any>();

  dataSource: any[] = [];
  config: LpbDatatableConfig = {
    hasNoIndex: true,
    hasSelection: false,
    hiddenActionColumn: true
  };
  columns = CHANGE_DEBT_COLUMNS;
  @Input() totalAmount = 0;
  rowsChangeDebtSuccess = 0;
  rowsChangeDebtFail = 0;
  rowsChangeDebtUnknown = 0;

  dataSource2: any[] = [];
  accountingColumns = ACCOUNTING_COLUMNS.filter(x => x.headerProperty !== "transNo");

  openModal = false;
  dataInsertChangeDebt: any[] = [];
  changedDebt = false;

  constructor(private electricService: ElectricService, private formMessageService: FormMessageService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataRoot && this.dataRoot) {
      this.totalAmount = 0;
      let totalAmount = 0;
      let rowsChangeDebtSuccess = 0;
      let rowsChangeDebtFail = 0;
      const dataSource = this.dataRoot.transactionResponses.reduce((data, x) => {
        data.push(...x.billInfos);
        totalAmount += x.billInfos.reduce((total, row) => {
          if (["SUCCESS"].includes(row.changeDebtStatus)) {
            total += +row.billAmount;
            rowsChangeDebtSuccess++;
          }
          if (["FAIL"].includes(row.changeDebtStatus)) {
            rowsChangeDebtFail++;
          }
          return total;
        }, 0)
        return data;
      }, []);
      this.totalAmount = totalAmount;
      this.totalAmountChange.emit(this.totalAmount);
      this.rowsChangeDebtSuccess = rowsChangeDebtSuccess;
      this.rowsChangeDebtFail = rowsChangeDebtFail;
      if (dataSource) {
        this.dataSource = dataSource;
        this.dataInsertChangeDebt = dataSource.filter(row => ["ERROR"].includes(row.changeDebtStatus));
      }
      this.rowsChangeDebtUnknown = this.dataSource.length - (this.rowsChangeDebtSuccess + this.rowsChangeDebtFail);
      this.dataSource2 = this.dataRoot.accountingBatchResponses;
    }
  }

  exportExcel() {
    this.exportXls.emit(this.dataSource);
  }

  openModalChangeDebt() {
    if (this.rowsChangeDebtUnknown === 0) {
      this.formMessageService.openMessageError("Không có dữ liệu cần gạch nợ bổ sung !");
      return;
    }
    this.openModal = true;
  }

  changeDebt() {
    this.electricService.insertChangeDebtByFile(this.dataRoot.id).toPromise().then(res => {
      let successRows = 0;
      let failRows = 0;
      let unknownRows = 0;
      this.dataInsertChangeDebt = res["data"];
      for (const row of this.dataInsertChangeDebt) {
        if (row.changeDebtStatus === "SUCCESS") {
          successRows++;
        }
        if (row.changeDebtStatus === "FAIL") {
          failRows++;
        }
        if (row.changeDebtStatus === "ERROR") {
          unknownRows++;
        }
      }
      let message = "";
      message += successRows > 0 ? `thành công ${successRows} hóa đơn` : ``;
      message += failRows > 0 ? (message === "" ? "" : ", ") + `thất bại ${failRows} hóa đơn` : ``;
      message += unknownRows > 0 ? (message === "" ? "" : ", ") + `không xác định ${unknownRows} hóa đơn` : ``;
      message = `Gạch nợ ${message} !`;
      this.formMessageService.openMessageSuccess(message, null, null, null);
      this.changedDebt = true;
    }).catch(err => {
      this.formMessageService.handleError(err);
    })
  }

  closeModal(updateData = false) {
    this.openModal = false;
    if (updateData) {
      this.electricService.getDetailTransactionByFile(this.dataRoot.id).toPromise().then(res => {
        this.dataRoot = res.data;
        this.changedDebt = false;
        this.dataRootChange.emit(this.dataRoot);
      }).catch(err => {
        this.formMessageService.handleError(err);
      })
    }

  }
}
