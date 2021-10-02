import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	IDataTransfer,
	TransactionHistoryModalComponent
} from '../transaction-history-modal/transaction-history-modal.component';
import { concatMap, takeUntil, tap } from 'rxjs/operators';
import { IProduct, ProductService } from '../../product/product.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
	IEmployees,
	IPaymentMethod,
	IStationEployee,
	ITransaction,
	IFilterTransaction,
	TransactionService
} from '../transaction.service';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { NO_EMIT_EVENT } from '../../../shared/app-constants';
import { of } from 'rxjs';
import * as moment from 'moment';
import { convertDateToServer } from 'src/app/shared/helpers/functions';
import { FileService } from 'src/app/shared/services/file.service';

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

	today: string;
	firstDayOfMonth: string;

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
		private fb: FormBuilder,
		private fileService: FileService
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
		this.initDate();
		this.onSearch();
		this.handleStationChange();
	}

	initDate() {
		this.searchForm.get('startAt').patchValue(this.firstDayOfMonth);
		this.searchForm.get('endAt').patchValue(this.today);
	}

	buildForm() {
		this.searchForm = this.fb.group({
			orderCode: [''],
			product: [''],
			station: [''],
			payMethod: [''],
			employee: [''],
			phone: [''],
			userName: [''],
			endAt: [],
			startAt: []
		});
	}

	getFilterData() {
		const filterFormData: IFilterTransaction = this.searchForm.value;
		return {
			...filterFormData,
			startAt: convertDateToServer(filterFormData.startAt),
			endAt: convertDateToServer(filterFormData.endAt)
		};
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
		const filterData: IFilterTransaction = this.getFilterData();

		this.transactionService
			.searchTransaction(this.paginatorState.page, this.paginatorState.pageSize, filterData)
			.subscribe((res) => {
				if (res.data) {
					this.dataSource = res.data;
					if (this.dataSource.length > 0) {
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
		const filterData: IFilterTransaction = this.getFilterData();
		this.transactionService
			.exportFileExcel(filterData)
			.pipe(
				tap((res) => {
					if (res) {
						this.fileService.downloadFromUrl(res.data);
					}
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	onReset() {
		this.ngOnInit();
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
}
