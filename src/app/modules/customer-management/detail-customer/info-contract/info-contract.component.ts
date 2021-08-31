import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CustomerManagementService, IContract, ISortData } from '../../customer-management.service';
import { IPaginatorState, PaginatorState } from '../../../../_metronic/shared/crud-table';
import { EContractStatus } from '../../../contract/contract.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { IError } from '../../../../shared/models/error.model';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-info-contract',
  templateUrl: './info-contract.component.html',
  styleUrls: ['./info-contract.component.scss'],
  providers: [DestroyService]
})
export class InfoContractComponent implements OnInit {
  searchFormControl: FormControl = new FormControl();
  sortData: ISortData;
  paginatorState = new PaginatorState();
  dataSource: Array<IContract> = [];
  contractStatus = EContractStatus;
  customerId: number;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private customerManagementService: CustomerManagementService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService
  ) {
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
    // Lấy id khách hàng
    this.activeRoute.params.subscribe((res) => {
      this.customerId = res.customerId;
    });

    this.getListContractByCustomer();

    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(400),
        switchMap(() => {
          return this.customerManagementService.getListContractByCustomer(
            this.paginatorState.page,
            this.paginatorState.pageSize,
            this.searchFormControl.value,
            this.sortData,
            this.customerId
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

  async viewDetalContract(id: number) {
    await this.router.navigate([`/khach-hang/danh-sach/chi-tiet/${this.customerId}/chi-tiet-hop-dong/${id}`]);
  }

  getListContractByCustomer() {
    this.customerManagementService
      .getListContractByCustomer(
        this.paginatorState.page,
        this.paginatorState.pageSize,
        this.searchFormControl.value,
        this.sortData,
        this.customerId
      )
      .subscribe(
        (res) => {
          if (res.data) {
            this.dataSource = res.data;
            this.paginatorState.recalculatePaginator(res.meta.total);
            this.cdr.detectChanges();
          }
        },
        (err: IError) => {
          this.checkError(err);
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
    this.getListContractByCustomer();
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.getListContractByCustomer();
  }

  checkError(err: IError) {
    console.log(err);
  }
}

