import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';
import { GasStationService, IPumpPole } from '../../gas-station.service';
import { PumpPoleModalComponent } from './pump-pole-modal/pump-pole-modal.component';
@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss'],
  providers: [FilterService, SortService, DestroyService]
})
export class Step3Component implements OnInit {
  @Output() stepSubmitted: EventEmitter<any>;
  dataSource: Array<IPumpPole>;
  dataSourceTemp: Array<IPumpPole>;
  sorting: SortState;
  searchFormControl: FormControl;
  filterField: FilterField<{
    code: string;
    name: string;
    description: string;
    status: string;
  }>;
  constructor(
    private filterService: FilterService<IPumpPole>,
    private sortService: SortService<IPumpPole>,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private gasStationService: GasStationService,
    private toastr: ToastrService
  ) {
    this.stepSubmitted = new EventEmitter();
    this.dataSource = this.dataSourceTemp = [];
    this.sorting = sortService.sorting;
    this.searchFormControl = new FormControl();
    this.filterField = new FilterField({
      code: null,
      name: null,
      description: null,
      status: null
    });
  }

  ngOnInit(): void {
    this.getData();

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
  }

  // Get data
  getData() {
    this.gasStationService
      .getPumpPolesByGasStation(this.gasStationService.gasStationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.data) {
          this.dataSource = this.dataSourceTemp = res.data;
          // Set data after filter and apply current sorting
          this.dataSource = this.sortService.sort(
            this.filterService.filter(this.dataSourceTemp, this.filterField.field)
          );
          this.cdr.detectChanges();
        }
      });
  }

  // Sort
  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSource, column);
  }

  create() {
    if (
      !this.gasStationService.gasStationId ||
      this.gasStationService.gasStationStatus !== 'ACTIVE'
    ) {
      return this.toastr.error('Không thể thêm vì trạm xăng không hoạt động');
    }
    const modalRef = this.modalService.open(PumpPoleModalComponent, {
      backdrop: 'static',
      size: 'xl'
    });
    modalRef.result.then((result) => {
      if (result) {
        this.gasStationService
          .getPumpPolesByGasStation(this.gasStationService.gasStationId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            if (res.data) {
              this.dataSource = this.dataSourceTemp = res.data;
              this.searchFormControl.patchValue(null);
              this.sort(null);
              this.cdr.detectChanges();
            }
          });
      }
    });
  }

  update(data) {
    if (
      !this.gasStationService.gasStationId ||
      this.gasStationService.gasStationStatus !== 'ACTIVE'
    ) {
      return this.toastr.error('Không thể sửa vì trạm xăng không hoạt động');
    }
    const modalRef = this.modalService.open(PumpPoleModalComponent, {
      backdrop: 'static',
      size: 'xl'
    });
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      if (result) {
        this.gasStationService
          .getPumpPolesByGasStation(this.gasStationService.gasStationId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            if (res.data) {
              this.dataSource = this.dataSourceTemp = res.data;
              this.searchFormControl.patchValue(null);
              this.sort(null);
              this.cdr.detectChanges();
            }
          });
      }
    });
  }

  delete(pumpPole: IPumpPole) {
    if (
      !this.gasStationService.gasStationId ||
      this.gasStationService.gasStationStatus !== 'ACTIVE'
    ) {
      return this.toastr.error('Không thể xóa vì trạm xăng không hoạt động');
    }
    const modalRef = this.modalService.open(ConfirmDeleteComponent);
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xóa thông tin cột ${pumpPole.name}`,
      button: {
        class: 'btn-primary',
        title: 'Xác nhận'
      }
    };
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      if (result) {
        // Call api delete
      }
    });
  }

  submit() {
    this.stepSubmitted.next({
      currentStep: 3,
      step3: {
        isValid: true
      }
    });
  }

  back() {
    const currentStepData = this.gasStationService.getStepDataValue();
    this.gasStationService.setStepData({ ...currentStepData, currentStep: 2 });
  }
}
