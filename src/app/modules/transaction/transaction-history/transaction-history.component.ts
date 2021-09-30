import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	IDataTransfer,
	TransactionHistoryModalComponent
} from '../transaction-history-modal/transaction-history-modal.component';
import { concatMap, takeUntil, tap } from 'rxjs/operators';
import { IProduct, ProductService } from '../../product/product.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
	IEmployees,
	IPaymentMethod,
	IStationEployee,
	ITransaction,
	TransactionService
} from '../transaction.service';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { NO_EMIT_EVENT } from '../../../shared/app-constants';
import { of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';

@Component({
	selector: 'app-transaction-history',
	templateUrl: './transaction-history.component.html',
	styleUrls: ['./transaction-history.component.scss'],
	providers: [DestroyService]
})
export class TransactionHistoryComponent implements OnInit {
	dataProduct: Array<IProduct> = [];
	paymentMethods: Array<IPaymentMethod> = [];
	stationEmployee: Array<IStationEployee> = [];
	listEmployees: Array<IEmployees> = [];

	startDate: NgbDate | null;
	endDate: NgbDate | null;
	firstDayOfMonth: NgbDate | null;

	paginatorState = new PaginatorState();
	dataSource: Array<ITransaction>;

	searchForm: FormGroup;
	totalLiters: number;
	totalMoney: number;
	pointSunoil: number;
	limitOil: number;
	totalPaymentMoney: number;
	totalRecord: number;

	dataFileExcel: any;
	categoryId: number = 0;

	constructor(
		private modalService: NgbModal,
		private productService: ProductService,
		private transactionService: TransactionService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private calendar: NgbCalendar,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private http: HttpClient
	) {
		this.firstDayOfMonth = calendar.getToday();
		this.firstDayOfMonth.day = 1;
		this.startDate = this.firstDayOfMonth;
		this.endDate = calendar.getToday();

		this.init();
	}

	init() {
		this.paginatorState.page = 1;
		this.paginatorState.pageSize = 10;
		this.paginatorState.pageSizes = [5, 10, 15, 20];
		this.paginatorState.total = 0;

		this.totalRecord = 0;
		this.totalLiters = 0;
		this.totalMoney = 0;
		this.pointSunoil = 0;
		this.limitOil = 0;
		this.totalPaymentMoney = 0;
	}

	ngOnInit(): void {
		this.getListProductType();
		this.getPaymentMethods();
		this.getStationEmployee();
		this.getAllEmployee();

		this.buildForm();
		this.onSearch();
		this.handleStationChange();
	}

	buildForm() {
		this.searchForm = this.fb.group({
			orderCode: [''],
			product: [''],
			station: [''],
			payMethod: [''],
			employee: [''],
			phone: [''],
			userName: ['']
		});
	}

	getListProductType() {
		this.productService
			.getListProduct(this.categoryId)
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.dataProduct = res.data;
				this.cdr.detectChanges();
			});
	}

	getPaymentMethods() {
		this.transactionService
			.getPaymentMethods()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.paymentMethods = res.data;
				this.cdr.detectChanges();
			});
	}

	getStationEmployee() {
		this.transactionService
			.getStationEmployee()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.stationEmployee = res.data;
				this.cdr.detectChanges();
			});
	}

	getAllEmployee() {
		this.transactionService
			.getAllEmployee()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.listEmployees = res.data;
				this.cdr.detectChanges();
			});
	}

	handleStationChange() {
		this.searchForm
			.get('station')
			.valueChanges.pipe(
				concatMap((stationName: string) => {
					this.listEmployees = [];
					this.searchForm.get('employee').reset('', NO_EMIT_EVENT);
					if (stationName) {
						return this.transactionService.getEmployeeStation(stationName);
					} else {
						return this.transactionService.getAllEmployee();
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

	onSearch() {
		this.searchForm.value.startDate = this.formatDate(this.startDate, 'yyyy-mm-dd');
		this.searchForm.value.endDate = this.formatDate(this.endDate, 'yyyy-mm-dd');

		this.transactionService
			.searchTransaction(
				this.paginatorState.page,
				this.paginatorState.pageSize,
				this.searchForm.value
			)
			.subscribe((res) => {
				if (res.data) {
					this.dataSource = res.data;					
					if (this.dataSource.length > 0) {
						this.exportFileExcel();

						this.totalLiters = this.dataSource[0].orderTotalResponse.totalActualityLiters;
						this.totalMoney = this.dataSource[0].orderTotalResponse.totalCashPaid;
						this.pointSunoil = this.dataSource[0].orderTotalResponse.totalAccumulationPointUse;
						this.limitOil = this.dataSource[0].orderTotalResponse.totalPaymentLimitOil;
						this.totalPaymentMoney = this.dataSource[0].orderTotalResponse.totalPaymentLimitMoney;
					} else {
						this.totalRecord = 0;
						this.totalLiters = 0;
						this.totalMoney = 0;
						this.pointSunoil = 0;
						this.limitOil = 0;
						this.totalPaymentMoney = 0;
					}

					this.totalRecord = res.meta.total;
					this.paginatorState.recalculatePaginator(res.meta.total);
					this.cdr.detectChanges();
				}
			});
	}

	exportFileExcel() {
		this.searchForm.value.startDate = this.formatDate(this.startDate, 'yyyy-mm-dd');
		this.searchForm.value.endDate = this.formatDate(this.endDate, 'yyyy-mm-dd');

		const data = this.searchForm.value;

		const params = new HttpParams()
			.set('order-code', data.orderCode)
			.set('product-name', data.product)
			.set('station-name', data.station)
			.set('payment-method', data.payMethod)
			.set('employee-id', data.employee)
			.set('phone', data.phone)
			.set('start-at', data.startDate)
			.set('end-at', data.endDate)
			.set('user-name', data.userName);

		this.http
			.get('https://sunoil-management.firecloud.live/management/orders/filters/excels', { params })
			.subscribe((res) => {
				if (res) {
					this.dataFileExcel = res;
					this.cdr.detectChanges();
				}
			});
	}

	onReset() {
		this.ngOnInit();
		this.startDate = this.firstDayOfMonth;
		this.endDate = this.calendar.getToday();
	}

	onSelectStartAt(date: NgbDate) {
		this.startDate = date;
	}

	onSelectEndAt(date: NgbDate) {
		this.endDate = date;
	}

	pagingChange($event: IPaginatorState) {
		this.paginatorState = $event as PaginatorState;
		this.onSearch();
	}

	viewModal($event?: Event, data?: IDataTransfer): void {
		if ($event) {
			$event.stopPropagation();
		}
		const modalRef = this.modalService.open(TransactionHistoryModalComponent, {
			backdrop: 'static',
			size: 'lg'
		});

		modalRef.componentInstance.data = {
			title: 'Chi tiết lịch sử đơn hàng',
			transaction: data
		};
	}

	formatDate(date: NgbDate, type: string) {
		const day = date.day <= 9 ? `0${date.day}` : date.day.toString();
		const month = date.month <= 9 ? `0${date.month}` : date.month.toString();
		const year = date.year.toString();

		if (type === 'dd/mm/yyyy') {
			return day + '/' + month + '/' + year;
		}

		if (type === 'yyyy-mm-dd') {
			return year + '-' + month + '-' + day;
		}
	}
}
