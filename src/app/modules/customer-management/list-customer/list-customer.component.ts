import { BaseComponent } from '../../../shared/components/base/base.component';
import { AuthService } from '../../auth/services/auth.service';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { CustomerManagementService, ICustomers, ISortData } from '../customer-management.service';
import { Router } from '@angular/router';
import { catchError, debounceTime, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IError } from '../../../shared/models/error.model';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-list-customer',
	templateUrl: './list-customer.component.html',
	styleUrls: ['./list-customer.component.scss'],
	providers: [DestroyService]
})
export class ListCustomerComponent extends BaseComponent implements OnInit {
  @ViewChild('settingRank') settingRank: TemplateRef<any>;
	searchFormControl: FormControl = new FormControl();
	sortData: ISortData;
	paginatorState = new PaginatorState();
	dataSource: Array<ICustomers> = [];
  listRank = [];

	constructor(
		private router: Router,
		private customerManagementService: CustomerManagementService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private authService: AuthService,
    private modalService: NgbModal,
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
		this.sortData = null;
	}

	ngOnInit() {
		this.getListCustomer();

		this.searchFormControl.valueChanges
			.pipe(
				debounceTime(400),
				switchMap(() => {
					return this.customerManagementService.getLisrCustomer(
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

	getListCustomer() {
		this.customerManagementService
			.getLisrCustomer(
				this.paginatorState.page,
				this.paginatorState.pageSize,
				this.searchFormControl.value,
				this.sortData
			)
			.subscribe((res) => {
				if (res.data) {
					this.dataSource = res.data;
					this.paginatorState.recalculatePaginator(res.meta.total);
					this.cdr.detectChanges();
				}
			});
	}

	async viewDetalCustomer($event: Event, item: ICustomers) {
		const canView = this.authService.getCurrentUserValue()?.actions?.includes(this.eAuthorize.VIEW_DRIVER_DETAIL_SCREEN);
		if(!canView) {
			return;
		}
		await this.router.navigate([`/khach-hang/danh-sach/chi-tiet/${item.id}`]);
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
		this.getListCustomer();
	}

	pagingChange($event: IPaginatorState) {
		this.paginatorState = $event as PaginatorState;
		this.getListCustomer();
	}

  settingRankModal() {
  }
}
