import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { concatMap, takeUntil, tap } from 'rxjs/operators';
import { NO_EMIT_EVENT } from '../../../shared/app-constants';
import { convertDateToServer } from '../../../shared/helpers/functions';
import { IError } from '../../../shared/models/error.model';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { IStationEployee } from '../../history-of-using-points/history-of-using-points.service';
import { EWarehouseOrderStatus, IEmployees, IFilterWarehouseOrder, InventoryManagementService, IWarehouseOrderRequest } from '../inventory-management.service';
import { BaseComponent } from './../../../shared/components/base/base.component';

@Component({
  selector: 'app-warehouse-order-list',
  templateUrl: './warehouse-order-list.component.html',
  styleUrls: ['./warehouse-order-list.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class WareHouseOrderListComponent extends BaseComponent implements OnInit {
  today: string;
  firstDayOfMonth: string;
  paginatorState = new PaginatorState();
  searchForm: FormGroup;
  dataSource: IWarehouseOrderRequest[];
  stationEmployee: Array<IStationEployee> = [];
  listEmployees: Array<IEmployees> = [];
  eStatus = EWarehouseOrderStatus;

  constructor(
    private fb: FormBuilder,
    private inventoryManagementService: InventoryManagementService,
    private router: Router,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {
    super();
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
    this.buildForm();
    this.getStationEmployee();
    this.getAllEmployee();
    this.onSearch();

    this.handleStationChange();
  }

  buildForm() {
    this.searchForm = this.fb.group({
      stationId: [''],
      employeeId: [''],
      dateFrom: [''],
      dateTo: [''],
      status: ['']
    })
  }

  getStationEmployee() {
    this.inventoryManagementService
      .getStationEmployee()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.stationEmployee = res.data;
        this.cdr.detectChanges();
      });
  }

  getAllEmployee() {
    this.inventoryManagementService
      .getAllEmployee()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.listEmployees = res.data;
        this.cdr.detectChanges();
      });
  }

  handleStationChange() {
    this.searchForm
      .get('stationId')
      .valueChanges.pipe(
      concatMap((stationName: string) => {
        this.listEmployees = [];
        this.searchForm.get('employeeId').reset('', NO_EMIT_EVENT);
        if (stationName) {
          return this.inventoryManagementService.getEmployeeStation(stationName);
        }
        return this.inventoryManagementService.getAllEmployee();
      }),
      tap((res: any) => {
        this.listEmployees = res.data;
        this.cdr.detectChanges();
      }),
      takeUntil(this.destroy$)
    )
      .subscribe();
  }

  getFilterData(): IFilterWarehouseOrder {
    const filterFormData: IFilterWarehouseOrder = this.searchForm.value;
    return {
      ...filterFormData,
      dateFrom: convertDateToServer(filterFormData.dateFrom) || '',
      dateTo: convertDateToServer(filterFormData.dateTo) || ''
    };
  }

  onSearch() {
    const filterData: IFilterWarehouseOrder = this.getFilterData();

    this.inventoryManagementService
      .searchWarehouseOrderRequest(this.paginatorState.page, this.paginatorState.pageSize, filterData)
      .subscribe((res) => {
        if (res.data) {
          console.log(res.data);
          
          this.dataSource = res.data;

          this.paginatorState.recalculatePaginator(res.meta.total);
          this.cdr.detectChanges();
        }
      },
        (err: IError) => {
          this.checkError(err);
        });
  }

  updateOrderRequest($event: Event, id: number) {
    console.log(id);
  }

  deleteOrderRequest($event: Event, item) {
    console.log(item);
  }

  onReset() {
    this.ngOnInit();
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.onSearch();
  }

  checkError(error: IError) {
    this.toastr.error(error.code);
  }

}
