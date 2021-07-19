import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';
import { GasStationService } from '../../gas-station.service';
import { CreateGasBinComponent } from './create-gas-bin/create-gas-bin.component';

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

export interface ListStatus {
  ACTIVE: 'ACTIVE';
  INACTIVE: 'INACTIVE';
  DELETED: 'DELETED';
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
    status: LIST_STATUS.ACTIVE,
    product_name: 'RON 94'
  },
  {
    code: 'SBBKA1',
    name: 'Bồn BKA1',
    description: 'To',
    height: '10',
    length: '10',
    capacity: '10000',
    status: LIST_STATUS.INACTIVE,
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
  listStatus = LIST_STATUS;

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
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private gasStationService: GasStationService
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

  openCreateModal() {
    this.modalService.open(CreateGasBinComponent, { size: 'xl' });
  }

  onSubmit() {
    // Đưa vào subscribe
    this.stepSubmitted.next({
      currentStep: 2,
      step2: null
    });
  }

  back() {
    const currentStepData = this.gasStationService.getStepDataValue();
    this.gasStationService.setStepData({ ...currentStepData, currentStep: 1 });
  }
}
