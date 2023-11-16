import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { INFO_ORDER_IN_PAY_BY_FILE_COLUMNS } from '../../../shared/constants/columns-transaction-electric.constant';
import { LpbDatatableConfig } from '../../../../../shared/models/LpbDatatableConfig';
import { LpbDatatableComponent } from '../../../../../shared/components/lpb-datatable/lpb-datatable.component';
import { takeUntil } from 'rxjs/operators';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { Observable } from 'rxjs';
import { FileService } from 'src/app/shared/services/file.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-transaction-change-debt',
  templateUrl: './transaction-change-debt.component.html',
  styleUrls: ['./transaction-change-debt.component.scss']
})
export class TransactionChangeDebtComponent implements OnInit, OnChanges {
  @Input() dataSource: any[] = [];
  @Input() ruleContent: string;
  @Input() clearSelected: Observable<void>;
  @Input() eventCompleted: Observable<void>;
  @Output() dataChange: EventEmitter<any> = new EventEmitter(null);
  selection = new SelectionModel<any>(true, []);

  rowSelected: any[] = [];
  totalPrice = 0;
  configs: LpbDatatableConfig = {
    filterDefault: ``,
    defaultSort: '',
    hasSelection: true,
    hasNoIndex: false,
    hasPaging: true,
    hiddenActionColumn: true,
    isDisableRow: (row) => {
      return row.resultCode !== 'SUCCESS';
    },
    disableCheck: false
  };
  columns: any = INFO_ORDER_IN_PAY_BY_FILE_COLUMNS;
  @ViewChild(LpbDatatableComponent) datatable: LpbDatatableComponent;

  constructor(
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.clearSelected.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.clearSection();
    });
    this.handleCompleted();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["dataSource"]) {
      this.selection.select(...this.dataSource.filter(row => row.resultCode === 'SUCCESS'));
      this.getRowSelected(this.selection.selected);
    }
  }

  handleCompleted(): void {
    this.eventCompleted
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.configs.disableCheck = true;
      });
  }

  downloadFileCheck(): void {
    if (!this.dataSource) {
      return;
    }
    this.fileService.downloadFile('electric-service/payment/export-error', this.dataSource);
  }

  getRowSelected($event): void {
    let totalPricePay = 0;
    this.rowSelected = $event;
    this.rowSelected.forEach((item) => {
      totalPricePay += item.totalAmount;
    });
    this.totalPrice = totalPricePay;
    this.dataChange.emit({
      totalPrice: this.totalPrice,
      data: $event
    });
    this.cdr.detectChanges();
  }

  clearSection(): void {
    this.datatable.clearSection();
  }

}
