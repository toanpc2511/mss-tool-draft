import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LIST_STATUS } from '../../../shared/data-enum/list-status';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	IDataTransfer,
	TransactionHistoryModalComponent
} from '../transaction-history-modal/transaction-history-modal.component';
import { concatMap, takeUntil, tap } from 'rxjs/operators';
import { IProductType, ProductService } from '../../product/product.service';
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

@Component({
	selector: 'app-transaction-history',
	templateUrl: './transaction-history.component.html',
	styleUrls: ['./transaction-history.component.scss'],
	providers: [DestroyService],
	styles: [
		`
			.custom-day {
				text-align: center;
				padding: 0.185rem 0.25rem;
				display: inline-block;
				height: 2rem;
				width: 2rem;
			}
			.custom-day.focused {
				background-color: #e6e6e6;
			}
			.custom-day.range,
			.custom-day:hover {
				background-color: rgb(2, 117, 216);
				color: white;
			}
			.custom-day.faded {
				background-color: rgba(2, 117, 216, 0.5);
			}
		`
	]
})
export class TransactionHistoryComponent implements OnInit {
	listStatus = LIST_STATUS;
	productTypes: Array<IProductType> = [];
	paymentMethods: Array<IPaymentMethod> = [];
	stationEmployee: Array<IStationEployee> = [];
	selectedStation: IStationEployee;
	listEmployees: Array<IEmployees> = [];

	hoveredDate: NgbDate | null = null;

	startDate: NgbDate | null;
	endDate: NgbDate | null;
	firstDayOfMonth: NgbDate | null;

	paginatorState = new PaginatorState();
	dataSource: Array<ITransaction>;
	result;

	searchForm: FormGroup;
	totalLiters: number;
	totalMoney: number;
	pointSunoil: number;
	limitOil: number;
	limitMoney: number;
	totalRecord: number;

	constructor(
		private modalService: NgbModal,
		private productService: ProductService,
		private transactionService: TransactionService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private calendar: NgbCalendar,
		public formatter: NgbDateParserFormatter,
		private toastr: ToastrService,
		private fb: FormBuilder
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
		this.limitMoney = 0;
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
			category: [''],
			station: [''],
			payMethod: [''],
			employee: [''],
			phone: [''],
			userName: ['']
		});
	}

	getListProductType() {
		this.productService
			.getListProductType()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productTypes = res.data;
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
		if (this.endDate === null) {
			this.toastr.error('Thời gian đến ngày không được để trống');
		} else {
			this.searchForm.value.startDate = this.formatDate(this.startDate);
			this.searchForm.value.endDate = this.formatDate(this.endDate);

			this.transactionService
				.searchTransaction(
					this.paginatorState.page,
					this.paginatorState.pageSize,
					this.searchForm.value
				)
				.subscribe((res) => {
					if (res.data) {
						this.result = res.data;
						this.dataSource = this.result.data.orderFilterResponses;

						this.totalRecord = this.result.totalRecord;
						this.totalLiters = this.result.data.orderTotalResponse.totalNumberLiters;
						this.totalMoney = this.result.data.orderTotalResponse.totalCashPaid;
						this.pointSunoil = this.result.data.orderTotalResponse.totalAccumulationPointUse;
						this.limitOil = this.result.data.orderTotalResponse.numberLiters;
						this.limitMoney = this.result.data.orderTotalResponse.totalBillMoney;

						this.paginatorState.recalculatePaginator(this.result.totalRecord);
						this.cdr.detectChanges();
					}
				});
		}
	}

	onReset() {
		this.ngOnInit();
		this.startDate = this.firstDayOfMonth;
		this.endDate = this.calendar.getToday();
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

	onDateSelection(date: NgbDate) {
		if (!this.startDate && !this.endDate) {
			this.startDate = date;
		} else if (this.startDate && !this.endDate && date && date.after(this.startDate)) {
			this.endDate = date;
		} else {
			this.endDate = null;
			this.startDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.startDate &&
			!this.endDate &&
			this.hoveredDate &&
			date.after(this.startDate) &&
			date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.endDate && date.after(this.startDate) && date.before(this.endDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.startDate) ||
			(this.endDate && date.equals(this.endDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed))
			? NgbDate.from(parsed)
			: currentValue;
	}

	formatDate(date: NgbDate) {
		const day = date.day <= 9 ? `0${date.day}` : date.day.toString();
		const month = date.month <= 9 ? `0${date.month}` : date.month.toString();
		const year = date.year.toString();
		return year + '/' + month + '/' + day;
	}
}
