import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export interface PeriodicElement {
  code: string;
  name: string;
  location: string;
  status: boolean;
}

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

/**
 * @title Table with sorting
 */
@Component({
  selector: 'app-list-station',
  styleUrls: ['list-station.component.scss'],
  templateUrl: 'list-station.component.html'
})
export class ListStationComponent {
  dataSource: PeriodicElement[] = ELEMENT_DATA;

  constructor(private modalService: NgbModal) {}
}
