import { BaseComponent } from '../../../shared/components/base/base.component';
import { AuthService } from '../../auth/services/auth.service';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { CustomerManagementService, ICustomers, ISortData } from '../customer-management.service';
import { Router } from '@angular/router';
import { debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IError } from '../../../shared/models/error.model';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TValidators } from '../../../shared/validators';
import { ConfigurationManagementService, IRank } from '../../configuration-management/configuration-management.service';

@Component({
	selector: 'app-list-customer',
	templateUrl: './list-customer.component.html',
	styleUrls: ['./list-customer.component.scss'],
	providers: [DestroyService, NgbActiveModal]
})
export class ListCustomerComponent extends BaseComponent implements OnInit {
  @ViewChild('settingRank') settingRank: TemplateRef<any>;
	searchFormControl: FormControl = new FormControl();
	sortData: ISortData;
	paginatorState = new PaginatorState();
	dataSource: Array<ICustomers> = [];
  listRank: IRank[] = [];
  rankControl: FormControl;
  dataCustomer: ICustomers;
  activeModal: NgbActiveModal;

	constructor(
		private router: Router,
		private customerManagementService: CustomerManagementService,
		private configurationManagementService: ConfigurationManagementService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private authService: AuthService,
    private modalService: NgbModal,
    private toastr: ToastrService,
	) {
		super();
		this.init();
    this.rankControl = new FormControl(null, [TValidators.required]);
    this.modalService.activeInstances
      .pipe(
        tap((modalRefs) => (this.activeModal = modalRefs[0])),
        takeUntil(this.destroy$)
      )
      .subscribe();
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

  settingRankModal($event: Event, data: ICustomers) {
    $event.stopPropagation();
    this.rankControl.reset();
    this.dataCustomer = data;
    this.rankControl.patchValue(this.dataCustomer.rank.id);

    this.modalService.open(this.settingRank, {
      size: 'xs',
      backdrop: 'static'
    });

    this.configurationManagementService.getRankHighers(data.rank.code)
      .subscribe((res) => {
        this.listRank = res.data;
      })
  }

  confirmChange(data: ICustomers) {
    this.rankControl.markAllAsTouched();
    if (this.rankControl.invalid) {
      return
    }

    const dataReq = {
      rankId: Number(this.rankControl.value),
      driverId: data.id
    }
    this.customerManagementService.changeRank(dataReq)
      .subscribe((res) => {
        if (res.data) {
          this.toastr.success('Cập nhật hạng khách hàng thành công!')
          this.activeModal.close(true);
          this.getListCustomer();
        }
      }, (error: IError) => this.checkerror(error))
  }

  checkerror(error: IError) {
    this.toastr.error(error.code);
  }
}
