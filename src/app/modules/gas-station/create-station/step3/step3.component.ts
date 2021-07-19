import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { orderBy, sortBy } from 'lodash';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';
export interface PeriodicElement {
  code: string;
  name: string;
  description: string;
  status: boolean;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    code: 'ST05',
    name: 'Sun Oil 01',
    description: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  },
  {
    code: 'ST002',
    name: 'Sun Oil 02',
    description: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  },
  {
    code: 'ST004',
    name: 'Sun Oil 04',
    description: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: false
  },
  {
    code: 'ST03',
    name: 'Sun Oil 03',
    description: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  },
  {
    code: 'ST01',
    name: 'Sun Oil 01',
    description: 'Tầng 20 Charmvit Tower, 117 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội',
    status: true
  }
];
@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
  providers: [FilterService, SortService, DestroyService]
})
export class Step3Component implements OnInit {
  @Output() stepSubmitted: EventEmitter<any>;
  periodicElement: PeriodicElement;
  dataSource: PeriodicElement[];
  dataSourceTemp: PeriodicElement[];
  sorting: SortState;
  searchFormControl: FormControl;
  filterField: FilterField<{
    code: string;
    name: string;
    location: string;
    status: string;
  }>;
  constructor(
    private filterService: FilterService<PeriodicElement>,
    private sortService: SortService<PeriodicElement>,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef
  ) {
    this.stepSubmitted = new EventEmitter();
    this.dataSource = this.dataSourceTemp = ELEMENT_DATA;
    this.sorting = sortService.sorting;
    this.searchFormControl = new FormControl();
    this.filterField = new FilterField({
      code: null,
      name: null,
      location: null,
      status: null
    });
  }

  ngOnInit(): void {
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

  //Sort
  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSource, column);
  }

  submit() {
    this.stepSubmitted.next({
      currentStep: 3,
      step3: null
    });
  }
}
