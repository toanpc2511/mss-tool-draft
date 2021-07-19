import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';

export interface ListGasTankResponse {
  code: string;
  name: string;
  description: string;
  height: string;
  length: string;
  capacity: string;
  status: string;
  product_name: string;
}
export const DATA_FAKE = [
  {
    code: 'SBBKA2',
    name: 'Bồn BKA2',
    description:
      'Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
    height: '20',
    length: '20',
    capacity: '20000',
    status: 'ACTIVE',
    product_name: 'RON 94'
  },
  {
    code: 'SBBKA1',
    name: 'Bồn BKA1',
    description: 'To',
    height: '10',
    length: '10',
    capacity: '10000',
    status: 'ACTIVE',
    product_name: 'RON 95'
  }
];

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
  providers: [SortService, FilterService, DestroyService]
})
export class Step2Component implements OnInit {
  @Output() stepSubmitted = new EventEmitter();
  dataSource: ListGasTankResponse[] = DATA_FAKE;
  dataSourceTemp: ListGasTankResponse[] = DATA_FAKE;
  sorting: SortState;
  searchFormControl: FormControl;
  filterField: FilterField<{
    code: string;
    name: string;
    location: string;
    status: string;
  }>;
  constructor(
    private sortService: SortService<ListGasTankResponse>,
    private filterService: FilterService<ListGasTankResponse>,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef
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
}
