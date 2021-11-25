import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import {
  IExportInventory,
  IFilterImportInventory,
  InventoryManagementService, ISupplier,
  LIST_WAREHOUSE_ORDER_FORM
} from '../inventory-management.service';
import { ToastrService } from 'ngx-toastr';
import { DestroyService } from '../../../shared/services/destroy.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { IError } from '../../../shared/models/error.model';
import { convertDateToServer } from '../../../shared/helpers/functions';
import { LIST_STATUS_EXPORT } from '../../../shared/data-enum/list-status';

@Component({
  selector: 'app-export-inventory',
  templateUrl: './export-inventory.component.html',
  styleUrls: ['./export-inventory.component.scss'],
  providers: [FormBuilder]
})
export class ExportInventoryComponent implements OnInit {
  today: string;
  firstDayOfMonth: string;
  paginatorState = new PaginatorState();
  dataSource: IExportInventory[] = [];
  dataSupplier: ISupplier[] = [];
  listWarehouseOrderForm = LIST_WAREHOUSE_ORDER_FORM;
  listStatus = LIST_STATUS_EXPORT;

  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private inventoryManagementService: InventoryManagementService,
    private toart: ToastrService,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private modalService: NgbModal,
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
    this.builForm();
    this.initDate();

    this.onSearch();
    this.hanldChangeOrderInfo();
  }

  builForm() {
    this.searchForm = this.fb.group({
      orderForm: [''],
      idStoreExport: [''],
      expectedDateStart: [''],
      expectedDateEnd: [''],
      status: [''],
    })
  }

  initDate() {
    this.searchForm.get('expectedDateStart').patchValue(this.firstDayOfMonth);
    this.searchForm.get('expectedDateEnd').patchValue(this.today);
  }

  hanldChangeOrderInfo() {
    this.searchForm.get('orderForm').valueChanges
      .subscribe((x) => {
        this.dataSupplier = [];
        if (x) {
          this.searchForm.get('idStoreExport').patchValue('');
          this.inventoryManagementService.getListSuppliers(x)
            .subscribe((res) => {
              this.dataSupplier = res.data;
              this.cdr.detectChanges();
            })
        }
      });
  }

  onSearch() {
    if (this.searchForm.invalid) {
      return;
    }

    const filterData: IFilterImportInventory = this.getFilterData();

    this.inventoryManagementService
      .searchExportInventory(this.paginatorState.page, this.paginatorState.pageSize, filterData)
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
