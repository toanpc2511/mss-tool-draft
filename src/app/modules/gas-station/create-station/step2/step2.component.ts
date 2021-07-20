import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';
import { GasBinResponse, GasStationService } from '../../gas-station.service';
import { CreateGasBinComponent } from './create-gas-bin/create-gas-bin.component';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
  providers: [SortService, FilterService, DestroyService]
})
export class Step2Component implements OnInit {
  @Output() stepSubmitted = new EventEmitter();
  dataSource: GasBinResponse[] = [];
  dataSourceTemp: GasBinResponse[] = [];
  sorting: SortState;
  searchFormControl: FormControl;
  filterField: FilterField<GasBinResponse>;
  stationId: number;
  listStatus = LIST_STATUS;

  constructor(
    private sortService: SortService<GasBinResponse>,
    private filterService: FilterService<GasBinResponse>,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private gasStationService: GasStationService,
    private toastr: ToastrService
  ) {
    this.sorting = sortService.sorting;
    this.filterField = new FilterField({
      code: null,
      name: null,
      description: null,
      height: null,
      length: null,
      capacity: null,
      status: null,
      productName: null
    });
    this.searchFormControl = new FormControl();
  }

  ngOnInit() {
    // Filter
    this.searchFormControl.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value?.trim()) {
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

    this.stationId = this.gasStationService.gasStationId;

    this.gasStationService.afterCreatedBinSubject.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.gasStationService.getListGasBin(this.stationId).subscribe((res) => {
        this.dataSource = this.dataSourceTemp = res.data;
        this.cdr.detectChanges();
      });
    });
  }

  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSource, column);
  }

  openCreateModal() {
    if (this.gasStationService.gasStationStatus !== 'ACTIVE') {
      return this.toastr.error('Không thể thêm vì trạm xăng không hoạt động');
    }
    this.modalService.open(CreateGasBinComponent, { size: 'xl' });
  }

  onSubmit() {
    // Đưa vào subscribe
    this.stepSubmitted.next({
      currentStep: 2,
      step2: {
        isValid: true
      }
    });
  }

  back() {
    const currentStepData = this.gasStationService.getStepDataValue();
    this.gasStationService.setStepData({ ...currentStepData, currentStep: 1 });
  }
}
