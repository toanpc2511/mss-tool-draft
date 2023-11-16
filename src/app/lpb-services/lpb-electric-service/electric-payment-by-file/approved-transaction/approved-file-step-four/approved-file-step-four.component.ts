import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-approved-file-step-four',
  templateUrl: './approved-file-step-four.component.html',
  styleUrls: ['./approved-file-step-four.component.scss']
})
export class ApprovedFileStepFourComponent implements OnInit {

  @Input() dataRoot;
  @Output() viewDetail = new EventEmitter<any>();
  @Output() exportExcel = new EventEmitter<any>();


  totalAmount = 0;
  rowsChangeDebtSuccess = 0;
  debitAccInfo: any = {};
  creditAccInfo: any = [];
  countBills = 0;
  totalAccAmount = 0;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataRoot && this.dataRoot) {
      this.totalAmount = 0;
      let totalAmount = 0;
      let totalAccAmount = 0;
      let rowsChangeDebtSuccess = 0;
      this.countBills = this.dataRoot.transactionResponses.reduce((countBills, x) => {
        totalAccAmount += x.billInfos.reduce((total, row) => {
          totalAmount += +row.billAmount;
          if (["SUCCESS"].includes(row.changeDebtStatus)) {
            total += +row.billAmount;
            rowsChangeDebtSuccess++;
          }
          return total;
        }, 0)
        return countBills + x.billInfos.length;
      }, 0);

      this.totalAccAmount = totalAccAmount;
      this.totalAmount = totalAmount;
      this.rowsChangeDebtSuccess = rowsChangeDebtSuccess;
      this.debitAccInfo = this.dataRoot.transferTransactionResponses?.find(x => x.drcrType === "D");
      this.creditAccInfo = this.dataRoot.transferTransactionResponses?.find(x => x.drcrType === "C");
    }
  }

  onViewDetail() {
    this.viewDetail.emit();
  }

  onExportExcel() {
    this.exportExcel.emit();
  }
}
