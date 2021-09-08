import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ConfigurationManagementService, IRankStock } from '../configuration-management.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { SortState } from '../../../_metronic/shared/crud-table';
import { SortService } from '../../../shared/services/sort.service';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
  selector: 'app-points-config',
  templateUrl: './points-config.component.html',
  styleUrls: ['./points-config.component.scss'],
  providers: [SortService, FilterService, DestroyService]
})
export class PointsConfigComponent implements OnInit {
  configRankStockFormArray: FormArray = new FormArray([]);
  searchFormControl: FormControl;
  dataSource: Array<IRankStock>;
  dataSourceTemp: Array<IRankStock>;
  sorting: SortState;

  constructor(
    private fb: FormBuilder,
    private configManagement: ConfigurationManagementService,
    private sortService: SortService<IRankStock>,
    private filterService: FilterService<IRankStock>,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
  ) {
    this.dataSource = this.dataSourceTemp = [];
    this.sorting = sortService.sorting;
    this.searchFormControl = new FormControl();
  }

  ngOnInit() {
    this.getListRankStock();
  }

  getListRankStock() {
    this.configManagement.getListRankStock()
      .subscribe((res) => {
        this.configRankStockFormArray = this.fb.array(
          res.data.map((x) => {
            return this.fb.group({
              nameRank: [x.nameRank],
              nameProduct: [x.nameProduct],
              scoreExportInvoice: [x.scoreExportInvoice, [Validators.required, Validators.min(1)]],
              scoreNoInvoice: [x.scoreNoInvoice, [Validators.required, Validators.min(1)]],
              discount: [x.discount]
            });
          })
        );
        this.cdr.detectChanges();
      });
  }

  sort(column: string) {
    this.dataSource = this.sortService.sort(this.dataSourceTemp, column);
  }
}
