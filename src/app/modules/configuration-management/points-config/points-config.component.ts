import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ConfigurationManagementService, IRankStock } from '../configuration-management.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { FilterField, SortState } from '../../../_metronic/shared/crud-table';
import { SortService } from '../../../shared/services/sort.service';
import { FilterService } from '../../../shared/services/filter.service';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TValidators } from '../../../shared/validators';
import { IError } from '../../../shared/models/error.model';
import { convertMoney } from '../../../shared/helpers/functions';

@Component({
  selector: 'app-points-config',
  templateUrl: './points-config.component.html',
  styleUrls: ['./points-config.component.scss'],
  providers: [DestroyService, SortService, FilterService]
})
export class PointsConfigComponent implements OnInit {
  searchFormControl = new FormControl();
  dataSource: FormArray = new FormArray([]);
  dataSourceTemp: FormArray = new FormArray([]);
  sorting: SortState;
  filterField = new FilterField({ nameRank: null, nameProduct: null, scoreNoInvoice: null, scoreExportInvoice: null });

  constructor(
    private sortService: SortService<IRankStock>,
    private filterService: FilterService<IRankStock>,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private configurationManagementService: ConfigurationManagementService,
    private toastr: ToastrService,
    private destroy$: DestroyService
  ) {
    this.sorting = sortService.sorting;
  }

  ngOnInit(): void {
    this.configurationManagementService
      .getListRankStock()
      .pipe(
        tap((res) => {
          this.dataSource = this.dataSourceTemp = this.convertToFormArray(res.data);
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.searchFormControl.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value.trim()) {
          this.filterField.setFilterFieldValue(value.trim());
        } else {
          this.filterField.setFilterFieldValue(null);
        }

        // Set data after filter and apply current sorting
        this.sortAndFilter();
      });

    this.dataSource.valueChanges
      .pipe(
        tap(() => {
          this.dataSourceTemp = this.dataSource;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  sortAndFilter(column?: string) {
    this.dataSource = this.convertToFormArray(
      this.sortService.sort(
        this.filterService.filter(this.dataSourceTemp.value, this.filterField.field),
        column
      )
    );
    this.cdr.detectChanges();
  }

  convertToFormArray(data: IRankStock[]): FormArray {
    const controls = data.map((d) => {
      return this.fb.group({
        id: [d.id],
        nameRank: [d.nameRank],
        nameProduct: [d.nameProduct],
        scoreExportInvoice: [d.scoreExportInvoice.toString(), [TValidators.required]],
        scoreNoInvoice: [d.scoreNoInvoice.toString(), [TValidators.required]],
        discount: [d.discount]
      });
    });
    return this.fb.array(controls);
  }

  onInputScoreNoInvoice(index: number) {
    this.dataSourceTemp
      .at(index)
      .get('scoreNoInvoice')
      .patchValue(this.dataSource.at(index).get('scoreNoInvoice').value);
  }

  onInputScoreExportInvoice(index: number) {
    this.dataSourceTemp
      .at(index)
      .get('scoreExportInvoice')
      .patchValue(this.dataSource.at(index).get('scoreExportInvoice').value);
  }

  onSubmit() {
    this.dataSource = this.dataSourceTemp;
    this.onReset(false);
    if (this.dataSource.invalid) {
      return null;
    }

    this.configurationManagementService
      .updateRankStock({
        rankStockRequests: this.dataSource.value.map((d) => ({
          id: d.id,
          scoreNoInvoice: convertMoney(d.scoreNoInvoice),
          scoreExportInvoice: convertMoney(d.scoreExportInvoice)
        }))
      })
      .subscribe(
        (res) => {
          this.checkRes(res);
        },
        (error: IError) => this.checkError(error)
      );
  }

  onReset(reInit: boolean) {
    if (reInit) {
      this.ngOnInit();
    }
    this.sortService.sorting.column = '';
    this.sortService.sorting.direction = 'asc';
    this.searchFormControl.patchValue(null, {
      emitEvent: false,
      onlySelf: true
    });
  }

  checkRes(res) {
    if (res.data) {
      this.toastr.success('Lưu thông tin thành công');
    }
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4221') {
      this.toastr.error('Tích điểm không dùng hóa đơn không được quá 99999 điểm');
    }
  }
}
