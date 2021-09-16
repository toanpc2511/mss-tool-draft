import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LIST_STATUS } from '../../../shared/data-enum/list-status';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	IDataTransfer,
	TransactionHistoryModalComponent
} from '../transaction-history-modal/transaction-history-modal.component';
import { takeUntil } from 'rxjs/operators';
import { IProductType, ProductService } from '../../product/product.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransactionService } from '../transaction.service';

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
	paymentMethods;
	stationEmployee;

	hoveredDate: NgbDate | null = null;

	startDate: NgbDate | null;
	endDate: NgbDate | null;
	firstDayOfMonth: NgbDate | null;

	searchForm: FormGroup;
	totalLiters: number;
	totalMoney: number;
	pointSunoil: number;
	limitOil: number;
	limitMoney: number;

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

		this.totalLiters = 155555000;
		this.totalMoney = 88911110;
		this.pointSunoil = 544200000;
		this.limitOil = 988121210;
		this.limitMoney = 55587800;
	}

	ngOnInit(): void {
		this.productService
			.getListProductType()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productTypes = res.data;
				this.cdr.detectChanges();
			});

		this.transactionService
			.getPaymentMethods()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.paymentMethods = res.data;
        console.log(this.paymentMethods);
				this.cdr.detectChanges();
			});

		this.transactionService
      .getStationEmployee()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.stationEmployee = res.data;
        console.log(this.stationEmployee);
        this.cdr.detectChanges();
      });

		this.buildForm();
	}

	buildForm() {
		this.searchForm = this.fb.group({
			code: [null],
			typeOil: [null],
			station: [null],
			payMethod: [null],
			staff: [null],
			phone: [null],
			nameUser: [null]
		});
	}

	onSearch() {
		if (this.endDate === null) {
			this.toastr.error('Thời gian đến ngày không được để trống');
		} else {
			this.searchForm.value.startDate = this.formatDate(this.startDate);
			this.searchForm.value.endDate = this.formatDate(this.endDate);
			console.log(this.searchForm.value);
		}
	}

	onReset() {
		this.ngOnInit();
		this.startDate = this.firstDayOfMonth;
		this.endDate = this.calendar.getToday();
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
			product: data
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
