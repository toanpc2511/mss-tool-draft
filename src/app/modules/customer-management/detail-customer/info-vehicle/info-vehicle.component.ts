import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IPaginatorState, PaginatorState } from '../../../../_metronic/shared/crud-table';
import { FormControl } from '@angular/forms';
import { CustomerManagementService, ISortData, IVehicles } from '../../customer-management.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-info-vehicle',
  templateUrl: './info-vehicle.component.html',
  styleUrls: ['./info-vehicle.component.scss'],
  providers: [DestroyService]
})
export class InfoVehicleComponent implements OnInit {
  searchFormControl: FormControl = new FormControl();
  sortData: ISortData;
  paginatorState = new PaginatorState();
  dataSource: Array<IVehicles> = [];
  nameVehicle: string;
  image1: string;
  image2: string;
  driverId: string;

  constructor(
    private modalService: NgbModal,
    private customerManagementService: CustomerManagementService,
    private router: Router,
    private activeRoute: ActivatedRoute,
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
    this.activeRoute.params.subscribe((res) => {
      this.driverId = res.customerId;
    });

    this.getListVehicles();

    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(400),
        switchMap(() => {
          return this.customerManagementService.getListVehicles(
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

  getListVehicles(): void {
    this.customerManagementService
      .getListVehicles(
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

  viewImages(content, item: any) {
    this.modalService.open(content, { size: 'lg' });

    this.nameVehicle = item.licensePlates;
    this.image1 = item.credentialImages[0].url;
    this.image2 = item.credentialImages[1].url;
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
    this.getListVehicles();
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.getListVehicles();
  }
}
