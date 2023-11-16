import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { LpbDatatableConfig } from 'src/app/shared/models/LpbDatatableConfig';
import { ACCOUNTING_COLUMNS } from '../../../shared/constants/by-file.constant';

@Component({
  selector: 'app-approved-file-step-one',
  templateUrl: './approved-file-step-one.component.html',
  styleUrls: ['./approved-file-step-one.component.scss']
})
export class ApprovedFileStepOneComponent implements OnInit, OnChanges {

  @Input() dataRoot;
  dataSource: any[] = [];
  config: LpbDatatableConfig = {
    hasNoIndex: true,
    hasSelection: false,
    hiddenActionColumn: true,    
  };
  columns = ACCOUNTING_COLUMNS;

  dataTransfer: any = {};
  creditInfo: any = {};
  debitInfo: any = {};
  transactionInfo: any = {};
  payerInfo: any = {};
  preBalance = 0;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataRoot && this.dataRoot) {            
      
      const dataSource = this.dataRoot.transferTransactionResponses;
      if (dataSource) {
        this.dataSource = dataSource;
        this.creditInfo = this.dataSource.find(x => x.drcrType === "C");
        this.debitInfo = this.dataSource.find(x => x.drcrType === "D");
      }                  
      this.payerInfo.payerName = this.dataRoot?.transactionResponses[0]?.payerName;
      this.payerInfo.payerAddress = this.dataRoot?.transactionResponses[0]?.payerAddress;
      this.payerInfo.payerPhoneNumber = this.dataRoot?.transactionResponses[0]?.payerPhoneNumber;       
      this.preBalance = this.dataRoot?.transactionResponses[0]?.preBalance;
    }
  }

  setDataSource() {    
    const dataSource = [];
    this.dataSource = dataSource;
  }
}
