import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LIST_STATUS_ORDER_REQUEST } from '../../../shared/data-enum/list-status';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { IFilterImportInventory, InventoryManagementService } from '../inventory-management.service';
import { ToastrService } from 'ngx-toastr';
import { DestroyService } from '../../../shared/services/destroy.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { IError } from '../../../shared/models/error.model';
import { convertDateToServer } from '../../../shared/helpers/functions';

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


  dataSource;
  listStatus = LIST_STATUS_ORDER_REQUEST;

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
            console.log(this.dataSource);

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
