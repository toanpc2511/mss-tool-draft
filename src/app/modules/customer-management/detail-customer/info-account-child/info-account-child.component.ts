import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ISortData } from '../../customer-management.service';
import { IPaginatorState, PaginatorState } from '../../../../_metronic/shared/crud-table';

@Component({
  selector: 'app-info-account-child',
  templateUrl: './info-account-child.component.html',
  styleUrls: ['./info-account-child.component.scss']
})
export class InfoAccountChildComponent implements OnInit {
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
        phone: '0355162255',
        seaOfControl: '19H16999',
        moneyLimit: 1548844440000,
        fuelLimit: 'tetet',
        status: 'ACCEPTED'
      },
      {
        phone: '039684221',
        seaOfControl: '19H16999',
        moneyLimit: 1548844440000,
        fuelLimit: 'tetet',
        status: 'REJECT'
      },
      {
        phone: '0388492255',
        seaOfControl: '19H16999',
        moneyLimit: 1548844440000,
        fuelLimit: 'tetet',
        status: 'REJECT'
      },
      {
        phone: '08445454581',
        seaOfControl: '19H16999',
        moneyLimit: 1548844440000,
        fuelLimit: 'tetet',
        status: 'ACCEPTED'
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

