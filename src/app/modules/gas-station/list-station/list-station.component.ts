import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';

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
  templateUrl: 'list-station.component.html',
  providers: [SortService, FilterService]
})
export class ListStationComponent {
  dataSource: PeriodicElement[] = ELEMENT_DATA;
  dataSourceTemp: PeriodicElement[] = ELEMENT_DATA;
  sorting: SortState;
  filterField: FilterField<{
    code: string;
    name: string;
    location: string;
    status: string;
  }>;

  constructor(
    private sortService: SortService<PeriodicElement>,
    private filterService: FilterService<PeriodicElement>
  ) {
    this.sorting = sortService.sorting;
    this.filterField = new FilterField({
      code: 'ST05',
      name: null,
      location: null,
      status: null
    });
  }

  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSource, column);
  }

  filter($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    if (inputElement.value.trim()) {
      this.filterField.setFilterFieldValue(inputElement.value);
    } else {
      this.filterField.setFilterFieldValue(null);
    }
    this.dataSource = this.filterService.filter(this.dataSourceTemp, this.filterField.field);
  }
}
