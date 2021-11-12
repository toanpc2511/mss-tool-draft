import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IEmployees, IFilterTransaction, InventoryManagementService } from '../inventory-management.service';
import * as moment from 'moment';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { Router } from '@angular/router';
import { IStationEployee } from '../../history-of-using-points/history-of-using-points.service';
import { concatMap, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../shared/services/destroy.service';
import { NO_EMIT_EVENT } from '../../../shared/app-constants';
import { of } from 'rxjs';
import { convertDateToServer } from '../../../shared/helpers/functions';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { LIST_STATUS_ORDER_REQUEST } from '../../../shared/data-enum/list-status';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-request-list',
  templateUrl: './order-request-list.component.html',
  styleUrls: ['./order-request-list.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class OrderRequestListComponent implements OnInit {
  today: string;
  firstDayOfMonth: string;
  paginatorState = new PaginatorState();
  searchForm: FormGroup;
  dataSource;
  stationEmployee: Array<IStationEployee> = [];
  listEmployees: Array<IEmployees> = [];
  listStatus = LIST_STATUS_ORDER_REQUEST;

  constructor(
    private fb: FormBuilder,
    private inventoryManagementService: InventoryManagementService,
    private router: Router,
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
    this.buildForm();
    this.initDate();

    this.getStationEmployee();
    this.getAllEmployee();
    this.onSearch();

    this.handleStationChange();
  }

  buildForm() {
    this.searchForm = this.fb.group({
      stationId: [''],
      employeeId: [''],
      expectedDate: [],
      approvalDate: [],
      status: ['']
    })
  }

  initDate() {
    this.searchForm.get('expectedDate').patchValue(this.firstDayOfMonth);
    this.searchForm.get('approvalDate').patchValue(this.today);
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
        } else {
          return this.inventoryManagementService.getAllEmployee();
        }
        return of(null);
      }),
      tap((res) => {
        this.listEmployees = res.data;
        this.cdr.detectChanges();
      }),
      takeUntil(this.destroy$)
    )
      .subscribe();
  }

  createOrder() {
    this.router.navigate(['/kho/yeu-cau-dat-hang/them-moi']);
  }

  viewDetailOrderRequest($event: Event, id: number): void {
    $event.stopPropagation();
    this.router.navigate([`/kho/yeu-cau-dat-hang/chi-tiet/${id}`]);
  }

  getFilterData() {
    const filterFormData: IFilterTransaction = this.searchForm.value;
    return {
      ...filterFormData,
      expectedDate: convertDateToServer(filterFormData.expectedDate),
      approvalDate: convertDateToServer(filterFormData.approvalDate)
    };
  }

  onSearch() {
    const filterData: IFilterTransaction = this.getFilterData();

    this.inventoryManagementService
      .searchOrderRequest(this.paginatorState.page, this.paginatorState.pageSize, filterData)
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

  updateOrderRequest($event: Event, id: number) {
    console.log(id);
  }

  deleteOrderRequest($event: Event, item) {
    $event.stopPropagation();
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn yêu cầu đặt hàng:  ${item.code}?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };
    modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        this.inventoryManagementService.deleteOrderRequest(item.id).subscribe(
          (res) => {
            if (res.data) {
              this.init();
              this.onSearch();
            }
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
      }
    });

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
