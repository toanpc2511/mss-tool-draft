import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
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

    this.stationId = this.gasStationService.gasStationId;
    this.getListGasBin(this.stationId);
  }

  initDatasource(dataSource: Array<GasBinResponse>) {
    return dataSource.map((data) => ({ ...data, productName: data.product.name }));
  }

  getListGasBin(stationId: number) {
    this.gasStationService
      .getListGasBin(stationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.data) {
          this.dataSource = this.dataSourceTemp = this.initDatasource(res.data);
          // Set data after filter and apply current sorting
          this.dataSource = this.sortService.sort(
            this.filterService.filter(this.dataSourceTemp, this.filterField.field)
          );
          this.cdr.detectChanges();
        }
      });
  }

  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSource, column);
  }

  openCreateModal() {
    if (this.gasStationService.gasStationStatus !== 'ACTIVE') {
      return this.toastr.error('Không thể thêm vì trạm xăng không hoạt động');
    }
    const modalRef = this.modalService.open(CreateGasBinComponent, {
      size: 'xl',
      backdrop: 'static'
    });

    modalRef.result.then((result) => {
      if (result) {
        this.getListGasBin(this.stationId);
      }
    });
  }

  onSubmit() {
    if (this.dataSource.length <= 0) {
      return this.toastr.error('Vui lòng thêm bồn trước khi thực hiện bước tiếp theo');
    }

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

  deleteGasBin(item: GasBinResponse) {
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      size: 'xl',
      backdrop: 'static'
    });
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xoá bồn ${item.code} ?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };
    modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        this.gasStationService
          .deleteGasBin(item.id)
          .subscribe(() => this.getListGasBin(this.stationId));
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
    const modalRef = this.modalService.open(CreateGasBinComponent, {
      backdrop: 'static',
      size: 'xl'
    });
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      if (result) {
        this.gasStationService
          .getListGasBin(this.stationId)
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
}
