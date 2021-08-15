import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { ISortData, IContract, ContractService } from '../contract.service';
import { LIST_STATUS_CONTRACT } from '../../../shared/data-enum/list-status';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list-contract',
  templateUrl: './list-contract.component.html',
  styleUrls: ['./list-contract.component.scss'],
  providers: [DestroyService]
})
export class ListContractComponent implements OnInit {
  searchFormControl: FormControl = new FormControl();
  sortData: ISortData;
  paginatorState = new PaginatorState();
  dataSource: Array<IContract> = [];
  status = LIST_STATUS_CONTRACT;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private contractService: ContractService,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private toastr: ToastrService
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

  ngOnInit(): void {
    this.getListContract();
    // Filter
    this.searchFormControl.valueChanges
      .pipe(
        debounceTime(400),
        switchMap(() => {
          return this.contractService.getListContract(
            this.paginatorState.page,
            this.paginatorState.pageSize,
            this.searchFormControl.value,
            this.sortData
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
  getListContract(): void {
    this.contractService
      .getListContract(
        this.paginatorState.page,
        this.paginatorState.pageSize,
        this.searchFormControl.value,
        this.sortData
      ).subscribe(
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

  createContract() {
    this.router.navigate(['/hop-dong/danh-sach/them-moi']);
  }

  viewDetalContract($event: Event, item: IContract): void {
    this.router.navigate([`/hop-dong/danh-sach/chi-tiet/${item.id}`]);
    // const modalRef = this.modalService.open(ConfirmDeleteComponent, {
    //   backdrop: 'static'
    // });
    // const data: IConfirmModalData = {
    //   title: 'Xác nhận',
    //   message: `Bạn có muốn xem chi tiết hợp đồng ${item.name}`,
    //   button: { class: 'btn-primary', title: 'Xác nhận' }
    // };
    // modalRef.componentInstance.data = data;
    //
    // modalRef.result.then((result) => {
    //   if (result) {
    //     this.router.navigate([`/hop-dong/danh-sach/chi-tiet/${item.id}`]);
    //   }
    // });
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
    this.getListContract();
  }

  checkError(error: IError) {
    if (error.code === 'SUN-OIL-4791') {
      this.toastr.error('Trường dữ liệu cần sắp xếp của hợp đồng không đúng ');
    }
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.getListContract();
  }

  updateContract(code:string):void {
    console.log('Mã hợp đồng', code);
  }

  deleteContract(item: IContract): void {
    console.log('Hợp đồng', item);
  }

}
