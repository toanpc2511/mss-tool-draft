import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LIST_STATUS_IMPORT, LIST_STATUS_ORDER_REQUEST } from '../../../shared/data-enum/list-status';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import {
  IExportInventory,
  IFilterImportInventory, IImportInventory,
  InventoryManagementService, ISupplier, LIST_WAREHOUSE_ORDER_FORM
} from '../inventory-management.service';
import { convertDateToServer } from '../../../shared/helpers/functions';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { DestroyService } from '../../../shared/services/destroy.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GasStationResponse } from '../../gas-station/gas-station.service';

@Component({
  selector: 'app-import-inventory',
  templateUrl: './import-inventory.component.html',
  styleUrls: ['./import-inventory.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class ImportInventoryComponent implements OnInit {
  today: string;
  firstDayOfMonth: string;
  paginatorState = new PaginatorState();
  dataSource: IImportInventory[] = [];
  dataSupplier: ISupplier[] = [];
  listExportWarehouse: GasStationResponse[] = [];
  listWarehouseOrderForm = LIST_WAREHOUSE_ORDER_FORM;

  listStatus = LIST_STATUS_IMPORT;

  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inventoryManagementService: InventoryManagementService,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    this.firstDayOfMonth = moment().startOf('month').format('DD/MM/YYYY');
    this.today = moment().format('DD/MM/YYYY');
    this.init();
  }

  init() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 10;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;

    this.dataSource = [];
  }

  ngOnInit(): void {
    this.getListSupplier();
    this.getGasStations();
    this.builForm();
    this.initDate();

    this.onSearch();
  }

  builForm() {
    this.searchForm = this.fb.group({
      orderForm: [''],
      idStoreExport: [''],
      idStoreImport: [''],
      expectedDateStart: [''],
      expectedDateEnd: [''],
      status: [''],
    })
  }

  initDate() {
    this.searchForm.get('expectedDateStart').patchValue(this.firstDayOfMonth);
    this.searchForm.get('expectedDateEnd').patchValue(this.today);
  }

  getListSupplier() {
    this.inventoryManagementService.getListSuppliersActive()
      .subscribe((res) => {
        this.dataSupplier = res.data;
        this.cdr.detectChanges();
      })
  }

  getGasStations() {
    this.inventoryManagementService.getGasStations()
      .subscribe((res) => {
        this.listExportWarehouse = res.data;
        this.cdr.detectChanges();
      })
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }

    const filterData: IFilterImportInventory = this.getFilterData();

    this.inventoryManagementService
      .searchImportInventory(this.paginatorState.page, this.paginatorState.pageSize, filterData)
      .subscribe((res) => {
          if (res.data) {
            this.dataSource = res.data;

            this.paginatorState.recalculatePaginator(res.meta.total);
            this.cdr.detectChanges();
          }
        },
        (err: IError) => {
          this.checkError(err);
        });

  }

  getFilterData() {
    const filterFormData: IFilterImportInventory = this.searchForm.value;
    return {
      ...filterFormData,
      expectedDateStart: convertDateToServer(filterFormData.expectedDateStart),
      expectedDateEnd: convertDateToServer(filterFormData.expectedDateEnd)
    };
  }

  checkError(error: IError) {
    this.toastr.error(error.code);
  }

  onReset() {
    this.ngOnInit();
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }

}
