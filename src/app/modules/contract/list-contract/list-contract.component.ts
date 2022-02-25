import { AuthService } from './../../auth/services/auth.service';
import { BaseComponent } from './../../../shared/components/base/base.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { IError } from '../../../shared/models/error.model';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import {
  ContractService,
  EContractStatus,
  EContractType, IContract, ISortData
} from '../contract.service';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';

@Component({
	selector: 'app-list-contract',
	templateUrl: './list-contract.component.html',
	styleUrls: ['./list-contract.component.scss'],
	providers: [DestroyService]
})
export class ListContractComponent extends BaseComponent implements OnInit {
	eContractType = EContractType;
	contractStatus = EContractStatus;
	searchFormControl: FormControl = new FormControl();
	sortData: ISortData;
	paginatorState = new PaginatorState();
	dataSource: Array<IContract> = [];

	constructor(
		private router: Router,
		private modalService: NgbModal,
		private contractService: ContractService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private toastr: ToastrService,
		private authService: AuthService
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

	createContract() {
		this.router.navigate(['/hop-dong/danh-sach/them-moi']);
	}

	viewDetalContract(item: IContract): void {
		const canView = this.authService.getCurrentUserValue()?.actions?.includes(this.eAuthorize.VIEW_CONTRACT_DETAIL_BUTTON);
		if(!canView) {
			return;
		}
		this.router.navigate([`/hop-dong/danh-sach/chi-tiet/${item.id}`]);
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

	updateContract($event: Event, id: number): void {
		$event.stopPropagation();
		this.router.navigate([`/hop-dong/danh-sach/sua-hop-dong/${id}`]);
	}

	deleteContract($event: Event, item: IContract): void {
    $event.stopPropagation();
    const modalRef = this.modalService.open(ConfirmDeleteComponent, {
      backdrop: 'static'
    });
    const data: IConfirmModalData = {
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xoá hợp đồng  ${item.code} - ${item.name} ?`,
      button: { class: 'btn-primary', title: 'Xác nhận' }
    };
    modalRef.componentInstance.data = data;

    modalRef.result.then((result) => {
      if (result) {
        this.contractService.deleteContract(item.id).subscribe(
          (res) => {
            if (res.data) {
              this.getListContract();
            }
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
      }
    });
	}
}
