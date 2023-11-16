import { Component, Input, OnInit } from '@angular/core';
import {
  ACCOUNTING_INFO_TAB_ONE_COLUMNS
} from '../../../shared/constants/columns-transaction-electric.constant';

@Component({
  selector: 'app-tab-one',
  templateUrl: './tab-one.component.html',
  styleUrls: ['./tab-one.component.scss']
})
export class TabOneComponent implements OnInit {
  @Input() data: any;
  dataSource: any[] = [];
  columns = ACCOUNTING_INFO_TAB_ONE_COLUMNS;
  config = {
    filterDefault: '',
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: false,
    hasPaging: false,
    hiddenActionColumn: true
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
