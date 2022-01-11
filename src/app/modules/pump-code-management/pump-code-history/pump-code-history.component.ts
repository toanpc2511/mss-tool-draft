import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../shared/components/base/base.component';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pump-code-history',
  templateUrl: './pump-code-history.component.html',
  styleUrls: ['./pump-code-history.component.scss'],
  providers: [ FormBuilder ]
})
export class PumpCodeHistoryComponent extends BaseComponent  implements OnInit {
  dataSource;

  searchForm: FormGroup;

  paginatorState = new PaginatorState();

  constructor(
    private fb: FormBuilder
    ) {
    super();
    this.init();
  }

  init() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 10;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;

    this.dataSource = [];
  }

  ngOnInit(): void {
    this.buildFormSearch();
  }

  buildFormSearch() {
    this.searchForm = this.fb.group({
      stationName: [''],
      pumpPoleName: [''],
      startAt: [],
      endAt: []
    })
  }

  onSearch() {}

  onReset() {
    this.ngOnInit();
  }

  exportFileExcel() {}

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }

}
