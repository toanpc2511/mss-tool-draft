import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteComponent } from '../../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../../shared/models/confirm-delete.interface';
import { IError } from '../../../../shared/models/error.model';
import { LIST_STATUS } from '../../../../shared/data-enum/list-status';
import { IPaginatorState, PaginatorState } from '../../../../_metronic/shared/crud-table';
import { ISortData } from '../../customer-management.service';

@Component({
  selector: 'app-info-account',
  templateUrl: './info-account.component.html',
  styleUrls: ['./info-account.component.scss']
})
export class InfoAccountComponent implements OnInit {
  isReadonly: boolean = true;
  numberPhone: string;

  listStatus = LIST_STATUS;
  sortData: ISortData;
  paginatorState = new PaginatorState();
  dataSource = [];

  constructor(
    private router: Router,
    private modalService: NgbModal,
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
        typeHanMuc: 'trả trước',
        amount: 160000000,
        unit: 'VNĐ'
      },
      {
        typeHanMuc: 'trả sau',
        amount: 13000,
        unit: 'Lít'
      },
      {
        typeHanMuc: 'trả trước',
        amount: 1890,
        unit: 'Lít'
      },
      {
        typeHanMuc: 'trả sau',
        amount: 9800000,
        unit: 'VNĐ'
      },
      {
        typeHanMuc: 'trả sau',
        amount: 878051110,
        unit: 'VNĐ'
      },
      {
        typeHanMuc: 'trả trước',
        amount: 22001,
        unit: 'Lít'
      }
    ];
  }

  ngOnInit(): void {
    this.numberPhone = '0355162255';
  }

  editNumber($event: Event, isReadonly: any) {
    this.isReadonly = !isReadonly;
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
    // this.getListContract();
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    // this.getListContract();
  }

}
