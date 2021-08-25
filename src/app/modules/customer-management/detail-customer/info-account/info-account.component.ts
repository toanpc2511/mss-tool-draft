import { Component, OnInit } from '@angular/core';
import { LIST_STATUS } from '../../../../shared/data-enum/list-status';

@Component({
  selector: 'app-info-account',
  templateUrl: './info-account.component.html',
  styleUrls: ['./info-account.component.scss']
})
export class InfoAccountComponent implements OnInit {
  isReadonly: boolean = true;
  numberPhone: string;

  listStatus = LIST_STATUS;
  dataSource = [];

  constructor() {
    this.init();
  }

  init() {
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
}
