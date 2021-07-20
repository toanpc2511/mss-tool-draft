import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';
import { GasStationResponse, GasStationService } from '../gas-station.service';

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
  dataSource: Array<GasStationResponse>;
  dataSourceTemp: Array<GasStationResponse>;
  sorting: SortState;
  searchFormControl: FormControl;
  filterField: FilterField<GasStationResponse>;
  listStatus = LIST_STATUS;

  constructor(
    private sortService: SortService<GasStationResponse>,
    private filterService: FilterService<GasStationResponse>,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private gasStationService: GasStationService
  ) {
    this.dataSource = this.dataSourceTemp = [];
    this.sorting = sortService.sorting;
    this.filterField = new FilterField({
      id: null,
      code: null,
      name: null,
      address: null,
      status: null
    });
    this.searchFormControl = new FormControl();
  }

  ngOnInit() {
    this.gasStationService.getListStation().subscribe((res) => {
      this.dataSource = this.dataSourceTemp = res.data;
      this.cdr.detectChanges();
    });

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
