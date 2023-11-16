import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { LpbDatatableConfig } from 'src/app/shared/models/LpbDatatableConfig';
import { CHANGE_DEBT_COLUMNS } from '../../../shared/constants/by-file.constant';

@Component({
  selector: 'app-approved-file-step-two',
  templateUrl: './approved-file-step-two.component.html',
  styleUrls: ['./approved-file-step-two.component.scss']
})
export class ApprovedFileStepTwoComponent implements OnInit, OnChanges {

  @Input() dataRoot;
  dataSource: any[] = [];
  config: LpbDatatableConfig = {
    hasNoIndex: true,
    hasSelection: false,
    hiddenActionColumn: true
  };
  columns = CHANGE_DEBT_COLUMNS;
  creditAccInfo: any[] = [];
  totalAmount = 0;

  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataRoot && this.dataRoot) {
      let totalAmount = 0;
      const dataSource = this.dataRoot.transactionResponses.reduce((data, x) => {
        data.push(...x.billInfos);
        totalAmount += x.billInfos.reduce((total, row) => {
          total += +row.billAmount;          
          return total;
        }, 0)
        return data;
      }, []);
      this.totalAmount = totalAmount;
      if (dataSource) {
        this.dataSource = dataSource;
      }
      
    }
  }
}
