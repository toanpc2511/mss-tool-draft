import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { ISortData } from '../customer-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.scss']
})
export class ListCustomerComponent implements OnInit {
  searchFormControl: FormControl = new FormControl();
  sortData: ISortData;
  paginatorState = new PaginatorState();
  dataSource = [];

  constructor(
    private router: Router
  ) {
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
        name: 'Phạm Công Toán',
        accName: 'toanpc',
        rank: 'Conqueror',
        address: 'Hải Hậu - Nam Định',
        statusContract: 'ACCEPTED',
        status: 'WAITING_ACCEPT'
      },
      {
        id: 1998,
        name: 'Phạm Công Toán',
        accName: 'toanpc',
        rank: 'Conqueror',
        address: 'Hải Hậu - Nam Định',
        statusContract: 'ACCEPTED',
        status: 'WAITING_ACCEPT'
      },
      {
        id: 1521,
        name: 'Phạm Công Toán',
        accName: 'toanpc',
        rank: 'Conqueror',
        address: 'Hải Hậu - Nam Định',
        statusContract: 'ACCEPTED',
        status: 'WAITING_ACCEPT'
      }
    ];
  }

  ngOnInit() {
    this.getListCustomer();
  }

  getListCustomer() {
    console.log('danh sách khach hang');
  }

  async viewDetalCustomer($event: Event, item) {
    await this.router.navigate([`/khach-hang/danh-sach/chi-tiet/${item.id}`]);
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
