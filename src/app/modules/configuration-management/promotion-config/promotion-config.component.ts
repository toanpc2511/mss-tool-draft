import { BaseComponent } from './../../../shared/components/base/base.component';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FilterField, SortState } from '../../../_metronic/shared/crud-table';
import { SortService } from '../../../shared/services/sort.service';
import { FilterService } from '../../../shared/services/filter.service';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IError } from '../../../shared/models/error.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
	ConfigurationManagementService,
	IConfigPromotion
} from '../configuration-management.service';
import { debounceTime, takeUntil } from 'rxjs/operators';
import {
	IDataTransfer,
	PromotionConfigModalComponent
} from '../promotion-config-modal/promotion-config-modal.component';

@Component({
	selector: 'app-promotion-config',
	templateUrl: './promotion-config.component.html',
	styleUrls: ['./promotion-config.component.scss'],
	providers: [SortService, FilterService, DestroyService]
})
export class PromotionConfigComponent extends BaseComponent implements OnInit {
	searchFormControl: FormControl;
	dataSource: Array<IConfigPromotion>;
	dataSourceTemp: Array<IConfigPromotion>;

	sorting: SortState;

	filterField: FilterField<{
		nameProduct: null;
		amountLiterOrder: null;
		listPromotion: null;
	}>;

	constructor(
		private configManagementService: ConfigurationManagementService,
		private sortService: SortService<IConfigPromotion>,
		private filterService: FilterService<IConfigPromotion>,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private modalService: NgbModal,
		private toastr: ToastrService
	) {
		super();
		this.dataSource = this.dataSourceTemp = [];
		this.sorting = sortService.sorting;
		this.filterField = new FilterField({
			nameProduct: null,
			amountLiterOrder: null,
			listPromotion: null
		});
		this.searchFormControl = new FormControl();
	}

	ngOnInit(): void {
		this.getListConfigPromotion();

		this.searchFormControl.valueChanges
			.pipe(debounceTime(500), takeUntil(this.destroy$))
			.subscribe((value) => {
				if (value.trim()) {
					this.filterField.setFilterFieldValue(value.trim());
				} else {
					this.filterField.setFilterFieldValue(null);
				}

				this.dataSource = this.sortService.sort(
					this.filterService.filter(this.dataSourceTemp, this.filterField.field)
				);
				this.cdr.detectChanges();
			});
	}

	getListConfigPromotion() {
		this.configManagementService.getListConfigPromotion().subscribe((res) => {
			this.dataSource = this.dataSourceTemp = res.data;
			this.dataSource = this.sortService.sort(
				this.filterService.filter(this.dataSourceTemp, this.filterField.field)
			);
			this.cdr.detectChanges();
		});
	}

	createModal($event?: Event, data?: IDataTransfer): void {
		if ($event) {
			$event.stopPropagation();
		}
		const modalRef = this.modalService.open(PromotionConfigModalComponent, {
			backdrop: 'static',
			size: 'xl'
		});

		modalRef.componentInstance.data = {
			title: data ? 'Sửa khuyến mại' : 'Thêm khuyến mại',
			promoConfig: data
		};

		modalRef.result.then((result) => {
			if (result) {
				this.getListConfigPromotion();
			}
		});
	}

	deleteConfig($event: Event, item: IConfigPromotion) {
		$event.stopPropagation();
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		modalRef.componentInstance.data = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xoá cấu hình khuyến mại?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};

		modalRef.result.then((result) => {
			if (result) {
				this.configManagementService.deleteConfigPromotion(item.promotionId).subscribe(
					(res) => {
						if (res.data) {
							this.getListConfigPromotion();
						}
					},
					(err: IError) => {
						this.checkError(err);
					}
				);
			}
		});
	}

	getListPromotions(item: IConfigPromotion) {
		const valuePromotion = item.promotionProducts?.map((x) => `${x.quantity?.toLocaleString('en-US')} ${x.productName}`)
			.join(' + ');
		item.listPromotion = valuePromotion;
		return valuePromotion;
	}

	checkError(error: IError) {
		this.toastr.error(error.code);
	}

	sort(column: string) {
		this.dataSource = this.sortService.sort(this.dataSourceTemp, column);
	}
}
