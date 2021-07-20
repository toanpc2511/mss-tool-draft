import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
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
  providers: [SortService, FilterService, DestroyService]
})
export class ListStationComponent implements OnInit {
  dataSource: PeriodicElement[] = ELEMENT_DATA;
  dataSourceTemp: PeriodicElement[] = ELEMENT_DATA;
  sorting: SortState;
  searchFormControl: FormControl;
  filterField: FilterField<{
    code: string;
    name: string;
    location: string;
    status: string;
  }>;

  constructor(
    private sortService: SortService<PeriodicElement>,
    private filterService: FilterService<PeriodicElement>,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {
    this.sorting = sortService.sorting;
    this.filterField = new FilterField({
      code: null,
      name: null,
      location: null,
      status: null
    });
    this.searchFormControl = new FormControl();
  }

  ngOnInit() {
    // Filter
    this.searchFormControl.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value.trim()) {
          this.filterField.setFilterFieldValue(value);
        } else {
          this.filterField.setFilterFieldValue(null);
        }
        // Set data after filter and apply current sorting
        this.dataSource = this.sortService.sort(
          this.filterService.filter(this.dataSourceTemp, this.filterField.field)
        );
        this.cdr.detectChanges();
      });
  }

  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSource, column);
  }

  goToCreateGasStation() {
    this.router.navigate(['/tram-xang/them-tram-xang']);
  }
}
