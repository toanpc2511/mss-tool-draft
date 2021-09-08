import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfigurationManagementService, IRankStock } from '../configuration-management.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { FilterField, SortState } from '../../../_metronic/shared/crud-table';
import { SortService } from '../../../shared/services/sort.service';
import { FilterService } from '../../../shared/services/filter.service';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

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
  filterField = new FilterField({
    nameRank: null,
    nameProduct: null,
    scoreNoInvoice: null,
    scoreExportInvoice: null
  });

  constructor(
    private sortService: SortService<IRankStock>,
    private filterService: FilterService<IRankStock>,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private configManagement: ConfigurationManagementService,
    private destroy$: DestroyService
  ) {
    this.sorting = sortService.sorting;
  }

  ngOnInit(): void {
    this.getListRankStock();

    this.searchFormControl.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value.trim()) {
          this.filterField.setFilterFieldValue(value.trim());
        } else {
          this.filterField.setFilterFieldValue(null);
        }

        // Set data after filter and apply current sorting
        this.dataSource = this.convertToFormArray(
          this.sortService.sort(
            this.filterService.filter(this.dataSourceTemp.value, this.filterField.field)
          )
        );
        this.cdr.detectChanges();
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

  getListRankStock() {
    this.configManagement
      .getListRankStock()
      .pipe(
        tap((res) => {
          const controls = res.data.map((x) => {
            return this.fb.group({
              nameRank: [x.nameRank],
              nameProduct: [x.nameProduct],
              scoreExportInvoice: [x.scoreExportInvoice, [Validators.required, Validators.min(1)]],
              scoreNoInvoice: [x.scoreNoInvoice, [Validators.required, Validators.min(1)]],
              discount: [x.discount]
            });
          });

          this.dataSource = this.dataSourceTemp = this.fb.array(controls);
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onSubmit() {
    const req = {
      rankStockRequests: this.dataSource.value
    };
    console.log(req);
    this.configManagement.updateRankStock(req)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  cancel() {
    this.getListRankStock();
  }

  sort(column: string) {
    this.dataSource = this.convertToFormArray(
      this.sortService.sort(this.dataSourceTemp.value, column)
    );
  }

  convertToFormArray(data: IRankStock[]): FormArray {
    const controls = data.map((d) => {
      return this.fb.group({
        id: d.id,
        nameRank: d.nameRank,
        nameProduct: d.nameProduct,
        scoreExportInvoice: d.scoreExportInvoice,
        scoreNoInvoice: d.scoreNoInvoice,
        discount: d.discount,
      });
    });
    return this.fb.array(controls);
  }
}
