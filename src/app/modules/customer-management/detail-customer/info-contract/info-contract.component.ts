import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ISortData } from '../../customer-management.service';
import { IPaginatorState, PaginatorState } from '../../../../_metronic/shared/crud-table';

@Component({
  selector: 'app-info-contract',
  templateUrl: './info-contract.component.html',
  styleUrls: ['./info-contract.component.scss']
})
export class InfoContractComponent implements OnInit {
  searchFormControl: FormControl = new FormControl();
  sortData: ISortData;
  paginatorState = new PaginatorState();
  dataSource = [];

  constructor() {
    this.init();
  }

  init() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 10;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;
    this.sortData = null;

    this.dataSource = [
      {
        id: 1000,
        type: 'Hợp đồng trả trước',
        code: 'HDTT251669',
        name: 'Xuất hàng',
        totalMoney: 168110000
      },
      {
        id: 1000,
        type: 'Hợp đồng trả trước',
        code: 'HDTT225888',
        name: 'Xuất dầu',
        totalMoney: 99988000000
      },
      {
        id: 1000,
        type: 'Hợp đồng dự trù',
        code: 'HDDT598841',
        name: 'Tích trữ hàng cấm',
        totalMoney: 1988800000000
      },
      {
        id: 1000,
        type: 'Hợp đồng trả trước',
        code: 'HDTT225888',
        name: 'Xuất dầu',
        totalMoney: 99988000000
      },
      {
        id: 1000,
        type: 'Hợp đồng dự trù',
        code: 'HDDT598841',
        name: 'Tích trữ hàng cấm',
        totalMoney: 1988800000000
      }
    ];
  }

  ngOnInit() {
    this.getListCustomer();
  }

  getListCustomer() {
    console.log('danh sách khach hang');
  }

  sort(column: string) {
    if (this.sortData && this.sortData.fieldSort === column) {
      if (this.sortData.directionSort === 'ASC') {
        this.sortData = { fieldSort: column, directionSort: 'DESC' };
      } else {
        this.sortData = null;
      }
    } else {
      this.sortData = { fieldSort: column, directionSort: 'ASC' };
    }
    this.getListCustomer();
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.getListCustomer();
  }
}

