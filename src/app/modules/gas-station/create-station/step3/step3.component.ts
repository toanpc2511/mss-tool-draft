import { Component, OnInit } from '@angular/core';
import { orderBy, sortBy } from 'lodash';
import { SortService } from 'src/app/shared/services/sort.service';
import { SortState } from 'src/app/_metronic/shared/crud-table';
export interface PeriodicElement {
  code: string;
  name: string;
  description: string;
  status: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    code: 'ST01',
    name: 'Sun Oil 01',
    description: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  },
  {
    code: 'ST02',
    name: 'Sun Oil 02',
    description: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  },
  {
    code: 'ST03',
    name: 'Sun Oil 03',
    description: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: false
  },
  {
    code: 'ST04',
    name: 'Sun Oil 04',
    description: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  },
  {
    code: 'ST05',
    name: 'Sun Oil 05',
    description: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  }
];
@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
  providers: [SortService]
})
export class Step3Component implements OnInit {
  periodicElement: PeriodicElement;
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
