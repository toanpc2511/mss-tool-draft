import { BaseComponent } from './../../../../shared/components/base/base.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CustomerManagementService, IAccountChild, ISortData } from '../../customer-management.service';
import { IPaginatorState, PaginatorState } from '../../../../_metronic/shared/crud-table';
import { ActivatedRoute } from '@angular/router';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-info-account-child',
  templateUrl: './info-account-child.component.html',
  styleUrls: ['./info-account-child.component.scss'],
  providers: [DestroyService]
})
export class InfoAccountChildComponent extends BaseComponent implements OnInit {
  searchFormControl: FormControl = new FormControl();
  sortData: ISortData;
  paginatorState = new PaginatorState();
  dataSource: Array<IAccountChild> = [];
  driverId: string;
  listVehicle;
  listLimitOils = [];

  constructor(
    private customerManagementService: CustomerManagementService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
  ) {
    super();
    this.init();
  }

  init() {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 10;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;
    this.sortData = null;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((res) => {
      this.driverId = res.customerId;
    });

    this.getListChildAccounts();

    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(400),
        switchMap(() => {
          return this.customerManagementService.getListChildAccounts(
            this.paginatorState.page,
            this.paginatorState.pageSize,
            this.searchFormControl.value,
            this.sortData,
            this.driverId
          );
        }),
        tap((res) => {
          this.dataSource = res.data;
          this.paginatorState.recalculatePaginator(res.meta.total);
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getListChildAccounts() {
    this.customerManagementService
      .getListChildAccounts(
        this.paginatorState.page,
        this.paginatorState.pageSize,
        this.searchFormControl.value,
        this.sortData,
        this.driverId
      )
      .subscribe(
        (res) => {
          if (res.data) {
            this.dataSource = res.data;

            this.paginatorState.recalculatePaginator(res.meta.total);
            this.cdr.detectChanges();
          }
        }
      );
  }

  sort(column: string) {
    if (this.sortData && this.sortData.fieldSort === column) {
      if (this.sortData.directionSort === 'ASC') {
        this.sortData = { fieldSort: column, directionSort: 'DESC' };
      } else {
        this.sortData = null;
      }
    } else {
      this.sortData = { fieldSort: column, directionSort: 'ASC' };
    }
    this.getListChildAccounts();
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.getListChildAccounts();
  }
}
