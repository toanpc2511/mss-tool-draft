import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';
import { GasStationService, IPumpHose, IPumpPole } from '../../gas-station.service';
import { PumpHoseModalComponent } from './pump-hose-modal/pump-hose-modal.component';
@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss'],
  providers: [FilterService, SortService, DestroyService]
})
export class Step4Component implements OnInit {
  @Output() stepSubmitted: EventEmitter<any>;
  dataSource: Array<IPumpHose>;
  dataSourceTemp: Array<IPumpHose>;
  sorting: SortState;
  searchFormControl: FormControl;
  filterField: FilterField<{
    code: string;
    name: string;
    description: string;
    gasFieldName: string;
    pumpPoleName: string;
    status: string;
  }>;
  listStatus = LIST_STATUS;

  constructor(
    private filterService: FilterService<IPumpHose>,
    private sortService: SortService<IPumpHose>,
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
      gasFieldName: null,
      pumpPoleName: null,
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
          this.filterField.setFilterFieldValue(value.trim());
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

  initDatasource(dataSource: Array<IPumpHose>) {
    console.log(dataSource);

    return dataSource.map((data) => ({
      ...data,
      gasFieldName: data.gasField.name,
      pumpPoleName: data.pumpPole.name
    }));
  }

  getData() {
    // Get data
    this.gasStationService
      .getPumpHosesByGasStation(this.gasStationService.gasStationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res?.data?.length > 0) {
          this.dataSource = this.dataSourceTemp = this.initDatasource(res.data);
          // Set data after filter and apply current sorting
          this.dataSource = this.sortService.sort(
            this.filterService.filter(this.dataSourceTemp, this.filterField.field)
          );
          const currentStepData = this.gasStationService.getStepDataValue();
          this.gasStationService.setStepData({ ...currentStepData, step4: { isValid: true } });
        } else {
          const currentStepData = this.gasStationService.getStepDataValue();
          this.gasStationService.setStepData({ ...currentStepData, step4: { isValid: false } });
        }
        this.cdr.detectChanges();
      });
  }

  // Sort
  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSourceTemp, column);
  }

  create() {
    if (!this.gasStationService.gasStationId && !this.gasStationService.gasStationStatus) {
      return this.toastr.error('Không thể thêm vì trạm xăng không hoạt động');
    }
    const modalRef = this.modalService.open(PumpHoseModalComponent, {
      backdrop: 'static',
      size: 'xl'
    });
    modalRef.result.then((result) => {
      if (result) {
        this.gasStationService
          .getPumpHosesByGasStation(this.gasStationService.gasStationId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            if (res.data) {
              this.dataSource = this.dataSourceTemp = this.initDatasource(res.data);
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
    const modalRef = this.modalService.open(PumpHoseModalComponent, {
      backdrop: 'static',
      size: 'xl'
    });
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      if (result) {
        this.gasStationService
          .getPumpHosesByGasStation(this.gasStationService.gasStationId)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res) => {
            if (res.data) {
              this.dataSource = this.dataSourceTemp = this.initDatasource(res.data);
              this.searchFormControl.patchValue(null);
              this.sort(null);
              this.cdr.detectChanges();
            }
          });
      }
    });
  }

  delete(pumpHose: IPumpHose) {
    if (
      !this.gasStationService.gasStationId ||
      this.gasStationService.gasStationStatus !== 'ACTIVE'
    ) {
      return this.toastr.error('Không xóa thêm vì trạm xăng không hoạt động');
    }
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xóa thông tin vòi ${pumpHose.code} - ${pumpHose.name} ?`,
      button: {
        class: 'btn-primary',
        title: 'Xác nhận'
      }
    };
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      if (result) {
        this.gasStationService.deletePumpHose(pumpHose.id).subscribe(
          (res) => {
            if (res.data) {
              this.getData();
            }
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
      }
    });
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4208') {
      this.toastr.error('Mã vòi không tồn tại');
    }
  }

  submit() {
    if (this.dataSource.length <= 0) {
      return this.toastr.error('Vui lòng thêm vòi trước khi xác nhận');
    }
    this.stepSubmitted.next({
      currentStep: 4,
      step4: {
        isValid: true
      }
    });
  }

  back() {
    const currentStepData = this.gasStationService.getStepDataValue();
    this.gasStationService.setStepData({ ...currentStepData, currentStep: 3 });
  }
}
