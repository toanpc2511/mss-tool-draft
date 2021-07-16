import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {
  dataSource: PeriodicElement[] = ELEMENT_DATA;
  constructor() {}

  ngOnInit(): void {}
}
