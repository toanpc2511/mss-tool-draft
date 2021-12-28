import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SubheaderService } from '../../../_metronic/partials/layout';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-detail-impact-history',
  templateUrl: './detail-impact-history.component.html',
  styleUrls: ['./detail-impact-history.component.scss'],
  providers: [FormBuilder]
})
export class DetailImpactHistoryComponent implements OnInit, AfterViewInit {
  searchForm: FormGroup;

  today: string;
  firstDayOfMonth: string;
  dataTest;

  constructor(
    private subheader: SubheaderService,
    private fb: FormBuilder
    ) {
    this.firstDayOfMonth = moment().startOf('month').format('DD/MM/YYYY');
    this.today = moment().format('DD/MM/YYYY');
    this.dataTest = [
      {id: 1, name: 'ToanPC', action: 'Xóa sản phẩm', productName: 'Ron95', time: '23:05 21/11/2021'},
      {id: 1, name: 'ToanPC', action: 'Thêm sản phẩm', productName: 'A95', time: '23:05 21/11/2021'},
    ]
  }

  ngOnInit(): void {
    this.buildFormSearch();
    this.initDate();
  }

  ngAfterViewInit(): void {
    this.setBreadcumb();
  }

  setBreadcumb() {
    setTimeout(() => {
      this.subheader.setBreadcrumbs([
        {
          title: 'Quản lý lịch sử tác động',
          linkText: 'Quản lý lịch sử tác động',
          linkPath: '/lich-su-tac-dong'
        },
        {
          title: 'Chi tiết lịch sử tác động',
          linkText: 'Chi tiết lịch sử tác động',
          linkPath: null
        }
      ]);
    }, 1);
  }

  buildFormSearch() {
    this.searchForm = this.fb.group({
      startAt: [],
      endAt: []
    })
  }

  initDate() {
    this.searchForm.get('startAt').patchValue(this.firstDayOfMonth);
    this.searchForm.get('endAt').patchValue(this.today);
  }

  onReset() {
    this.ngOnInit();
  }

  onSearch() {
    console.log(this.searchForm.value);
  }

  seeMore() {
    this.dataTest.push(
      {id: 1, name: 'ToanPC', action: 'Sửa sản phẩm', productName: 'A95', time: '23:05 11/12/2021'},
      {id: 1, name: 'ToanPC', action: 'Xóa sản phẩm', productName: 'Ron95', time: '23:05 21/09/2021'},
      {id: 1, name: 'ToanPC', action: 'Thêm sản phẩm', productName: 'A95', time: '23:05 21/11/2021'},
      {id: 1, name: 'ToanPC', action: 'Xóa sản phẩm', productName: 'Ron95', time: '23:05 21/09/2021'},
      {id: 1, name: 'ToanPC', action: 'Thêm sản phẩm', productName: 'A95', time: '23:05 21/11/2021'},
      {id: 1, name: 'ToanPC', action: 'Xóa sản phẩm', productName: 'Ron95', time: '23:05 21/09/2021'},
      {id: 1, name: 'ToanPC', action: 'Thêm sản phẩm', productName: 'A95', time: '23:05 21/11/2021'})
  }

}
