import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { takeUntil, tap } from 'rxjs/operators';
import { convertDateToServer } from 'src/app/shared/helpers/functions';
import { FileService } from 'src/app/shared/services/file.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { GasStationResponse, GasStationService } from '../../gas-station/gas-station.service';
import { IProduct, ProductService } from '../../product/product.service';
import {
	IDataTransfer,
	TransactionHistoryModalComponent
} from '../transaction-history-modal/transaction-history-modal.component';
import {
	IFilterTransaction,
	IPaymentMethod,
	ITransaction,
	TransactionService
} from '../transaction.service';

@Component({
	selector: 'app-transaction-history',
	templateUrl: './transaction-history.component.html',
	styleUrls: ['./transaction-history.component.scss'],
	providers: [DestroyService]
})
export class TransactionHistoryComponent implements OnInit {
	dataProduct: Array<IProduct> = [];
	paymentMethods: Array<IPaymentMethod> = [];
	stations: Array<GasStationResponse> = [];

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
	categoryId = 0;

	constructor(
		private modalService: NgbModal,
		private productService: ProductService,
		private gasStationService: GasStationService,
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
		this.getStations();

		this.buildForm();
		this.initDate();
		this.onSearch();
	}

	buildForm() {
		this.searchForm = this.fb.group({
			orderCode: [''],
			product: [''],
			station: [''],
			payMethod: [''],
			phone: [''],
			accountType: [''],
			userName: [''],
			endAt: [],
			startAt: []
		});
	}

	initDate() {
		this.searchForm.get('startAt').patchValue(this.firstDayOfMonth);
		this.searchForm.get('endAt').patchValue(this.today);
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

	getStations() {
		this.gasStationService
			.getAllStations()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.stations = res.data;
				this.cdr.detectChanges();
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
						console.log(res);
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
