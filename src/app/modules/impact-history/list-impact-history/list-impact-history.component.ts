import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-impact-history',
  templateUrl: './list-impact-history.component.html',
  styleUrls: ['./list-impact-history.component.scss']
})
export class ListImpactHistoryComponent implements OnInit {
  listData;

  constructor(
    private router: Router,
    ) {
    this.listData = [
      {id: 1, value: 'Quản lý lài khoản'},
      {id: 2, value: 'Quản lý nhân viên'},
      {id: 3, value: 'Quản lý hợp đồng'},
      {id: 4, value: 'Quản lý nhân viên'},
      {id: 5, value: 'Quản lý sản phẩm'},
      {id: 6, value: 'Lịch sử sử dụng điểm'},
    ]
  }

  ngOnInit(): void {
  }

  detailImpact(item: {id: number, value: string}) {
    this.router.navigate([`/lich-su-tac-dong/chi-tiet/${item.id}`]);
  }

}
