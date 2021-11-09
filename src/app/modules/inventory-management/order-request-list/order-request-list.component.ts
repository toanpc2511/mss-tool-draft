import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { InventoryManagementService } from '../inventory-management.service';
import * as moment from 'moment';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-request-list',
  templateUrl: './order-request-list.component.html',
  styleUrls: ['./order-request-list.component.scss'],
  providers: [FormBuilder]
})
export class OrderRequestListComponent implements OnInit {
  today: string;
  firstDayOfMonth: string;
  paginatorState = new PaginatorState();
  searchForm: FormGroup;
  dataSource;

  constructor(
    private fb: FormBuilder,
    private inventoryManagementService: InventoryManagementService,
    private router: Router,
  ) {
    this.firstDayOfMonth = moment().startOf('month').format('DD/MM/YYYY');
    this.today = moment().format('DD/MM/YYYY');
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
    this.buildForm();
    this.initDate();
  }

  buildForm() {
    this.searchForm = this.fb.group({
      stationName: [''],
      nguoiYeuCau: [''],
      startAt: [],
      endAt: [],
      status: ['']
    })
  }

  initDate() {
    this.searchForm.get('startAt').patchValue(this.firstDayOfMonth);
    this.searchForm.get('endAt').patchValue(this.today);
  }

  createOrder() {
    this.router.navigate(['/kho/yeu-cau-dat-hang/them-moi']);
  }

  onSearch() {}

  onReset() {
    this.ngOnInit();
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }

}
