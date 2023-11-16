import { Component, OnInit, Input } from '@angular/core';
import {
  ACCOUNTING_INFO_TAB_TWO_COLUMNS, INFO_ORDER_TAB_TWO_COLUMNS
} from '../../../shared/constants/columns-transaction-electric.constant';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'app-tab-two',
  templateUrl: './tab-two.component.html',
  styleUrls: ['./tab-two.component.scss']
})
export class TabTwoComponent implements OnInit {
  @Input() data: any;
  dataSource: any[] = [];
  infoOrderColumns = INFO_ORDER_TAB_TWO_COLUMNS;
  accountingColumns = ACCOUNTING_INFO_TAB_TWO_COLUMNS;
  accountingConfig = {
    hasSelection: false,
    hasNoIndex: false,
    hasPaging: false,
    hiddenActionColumn: true
  };
  infoOrderConfig = {
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: true
  };

  constructor(
    private fileService: FileService
  ) {
  }

  ngOnInit(): void {
  }

  downloadFile(): void {
    if (this.data?.bills.length === 0 ) {
      return;
    }
    const params = { batchId: this.data.batchId };
    this.fileService.downloadFileMethodGet(
      "electric-service/report/tran-detail/export",
      params
    );
  }

}
