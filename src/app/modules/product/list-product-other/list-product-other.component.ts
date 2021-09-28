import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LIST_STATUS_QR, LIST_STATUS_SEARCH } from '../../../shared/data-enum/list-status';
import { IProductOther, IProductType, ProductService } from '../product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDeleteComponent } from '../../../shared/components/confirm-delete/confirm-delete.component';
import { IConfirmModalData } from '../../../shared/models/confirm-delete.interface';
import { IError } from '../../../shared/models/error.model';
import {
	IDataTransfer,
	ListProductOtherModalComponent
} from '../list-product-other-modal/list-product-other-modal.component';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';
import { ISortData } from '../../contract/contract.service';
import { SortService } from '../../../shared/services/sort.service';

@Component({
	selector: 'app-list-product-other',
	templateUrl: './list-product-other.component.html',
	styleUrls: ['./list-product-other.component.scss'],
	providers: [SortService, DestroyService, FormBuilder]
})
export class ListProductOtherComponent implements OnInit {
	searchForm: FormGroup;
	listStatus = LIST_STATUS_SEARCH;
	listStatusQr = LIST_STATUS_QR;
	dataSource;
	paginatorState = new PaginatorState();
	sortData: ISortData;

	productTypes: Array<IProductType> = [];

	constructor(
		private productService: ProductService,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private modalService: NgbModal
	) {
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
		this.productService
			.getListProductTypeOther()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productTypes = res.data;
				this.cdr.detectChanges();
			});

		this.buildForm();
		this.onSearch();
	}

	buildForm() {
		this.searchForm = this.fb.group({
			productType: [''],
			productName: [''],
			productCode: [''],
			importPriceFrom: [''],
			importPriceTo: [''],
			exportPriceFrom: [''],
			exportPriceTo: [''],
			status: [''],
			qrCode: ['']
		});
	}

	onSearch() {
		const valueForm = this.searchForm.value;

		valueForm.importPriceFrom = valueForm.importPriceFrom.split(',').join('');
		valueForm.importPriceTo = valueForm.importPriceTo.split(',').join('');
		valueForm.exportPriceFrom = valueForm.exportPriceFrom.split(',').join('');
		valueForm.exportPriceTo = valueForm.exportPriceTo.split(',').join('');

		this.productService
			.getListProductOther(
				this.paginatorState.page,
				this.paginatorState.pageSize,
				this.searchForm.value,
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

	onReset() {
		this.ngOnInit();
	}

	createModal($event?: Event, data?: IDataTransfer) {
		if ($event) {
			$event.stopPropagation();
		}
		const modalRef = this.modalService.open(ListProductOtherModalComponent, {
			backdrop: 'static',
			size: 'xl'
		});

		modalRef.componentInstance.data = {
			title: data ? 'Sửa sản phẩm' : 'Thêm sản phẩm',
			product: data
		};

		modalRef.result.then((result) => {
			if (result) {
				this.onSearch();
			}
		});
	}

	deleteProduct($event: Event, item: IProductOther) {
		$event.stopPropagation();
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});

		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xoá thông tin sản phẩm  ${item.code} - ${item.name} ?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.productService.deleteProductOther(item.id).subscribe(
					(res) => {
						if (res.data) {
							this.onSearch();
						}
					},
					(err: IError) => {
						this.checkError(err);
					}
				);
			}
		});
	}

	pagingChange($event: IPaginatorState) {
		this.paginatorState = $event as PaginatorState;
		this.onSearch();
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
		this.onSearch();
	}

	checkError(err: IError) {
		this.toastr.error(`err`);
	}
}
