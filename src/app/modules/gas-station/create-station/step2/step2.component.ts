import { Component, OnInit } from '@angular/core';
import { SortService } from 'src/app/shared/services/sort.service';
import { SortState } from 'src/app/_metronic/shared/crud-table';
import { PeriodicElement } from '../../list-station/list-station.component';

const ELEMENT_DATA: PeriodicElement[] = [
  {
    code: 'ST01',
    name: 'Sun Oil 01',
    location: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  },
  {
    code: 'ST02',
    name: 'Sun Oil 02',
    location: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  },
  {
    code: 'ST03',
    name: 'Sun Oil 03',
    location: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: false
  },
  {
    code: 'ST04',
    name: 'Sun Oil 04',
    location: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  },
  {
    code: 'ST05',
    name: 'Sun Oil 05',
    location: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  }
];

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
  providers: [SortService]
})
export class Step2Component implements OnInit {
  dataSource: PeriodicElement[] = ELEMENT_DATA;
  sorting: SortState;
  constructor(private sortService: SortService<PeriodicElement>) {
    this.sorting = sortService.sorting;
  }

  ngOnInit(): void {}
  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSource, column);
  }
}
