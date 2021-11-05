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
import { IFilterUsingPoints, IPaymentMethod, UsingPointsService } from '../using-points.service';

@Component({
	selector: 'app-history-using-points',
	templateUrl: './history-using-points.component.html',
	styleUrls: ['./history-using-points.component.scss'],
	providers: [FormBuilder, DestroyService]
})
export class HistoryUsingPointsComponent implements OnInit {
	dataProduct: Array<IProduct> = [];
	paymentMethods: Array<IPaymentMethod> = [];
	stations: Array<GasStationResponse> = [];

	today: string;
	firstDayOfMonth: string;

	paginatorState = new PaginatorState();
	dataSource;

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
		private usingPointsService: UsingPointsService,
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
		this.usingPointsService
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
		const filterFormData: IFilterUsingPoints = this.searchForm.value;
		return {
			...filterFormData,
			startAt: convertDateToServer(filterFormData.startAt),
			endAt: convertDateToServer(filterFormData.endAt)
		};
	}

	onSearch() {
		const filterData: IFilterUsingPoints = this.getFilterData();

		console.log(filterData);
	}

	exportFileExcel() {
		const filterData: IFilterUsingPoints = this.getFilterData();
		this.usingPointsService
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
}
