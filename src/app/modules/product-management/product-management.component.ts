import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { IConfirmModalData } from 'src/app/shared/models/confirm-delete.interface';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { Router } from '@angular/router';
import {
	PaginatorState,
	IPaginatorState
} from './../../_metronic/shared/crud-table/models/paginator.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { ICategory, IProduct } from 'src/app/shared/models/shared.interface';

@Component({
	selector: 'app-product-management',
	templateUrl: './product-management.component.html',
	styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
	categories: ICategory[] = [];
	products: IProduct[] = [];
	now = moment();
	isLoading: boolean;
	paginatorState = new PaginatorState();
	images: string[];

	@ViewChild('modal_image', { static: true }) modalImage: ElementRef;

	searchForm: FormGroup;
	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
		private router: Router,
		private sharedService: SharedService,
		private cdr: ChangeDetectorRef,
		private toastr: ToastrService
	) {
		this.initPaginator();
		this.initSearchForm();
	}

	initSearchForm(): void {
		this.searchForm = this.fb.group({
			model: [''],
			name: [''],
			category: ['']
		});
	}

	initPaginator() {
		this.paginatorState.page = 1;
		this.paginatorState.pageSize = 10;
		this.paginatorState.pageSizes = [5, 10, 15, 20];
		this.paginatorState.total = 0;
	}

	ngOnInit(): void {
		this.getListCategory();
		this.onSearch();
	}

	getListCategory(): void {
		this.sharedService.getListCategory().subscribe((res) => {
			this.categories = res;
			this.cdr.detectChanges();
		});
	}

	onSearch() {
		const valueForm = this.searchForm.value;
		const params = {
			page: this.paginatorState.page,
			size: this.paginatorState.pageSize,
			...valueForm
		};
		this.sharedService.getListProduct(params).subscribe((res) => {
			this.products = res.data.map((item) => ({
				...item,
				images: item.images.split(',')
			}));

			this.paginatorState.total = res.meta.total;

			this.cdr.detectChanges();
		});
	}

	onReset(): void {
		this.initSearchForm();
	}

	create(id?: string) {
		id
			? this.router.navigate([`san-pham/sua-san-pham/${id}`])
			: this.router.navigate(['san-pham/them-moi']);
	}

	delete(product: IProduct) {
		const modalRef = this.modalService.open(ConfirmDeleteComponent, {
			backdrop: 'static'
		});
		const data: IConfirmModalData = {
			title: 'Xác nhận',
			message: `Bạn có chắc chắn muốn xoá sản phẩm ${product.name} ?`,
			button: { class: 'btn-primary', title: 'Xác nhận' }
		};
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				this.sharedService.deleteProduct(product.id).subscribe(
					() => {
						this.onSearch();
						this.toastr.success('Xoá sản phẩm thành công!', 'Thông báo');
					},
					(error) => {
						console.log(error);
					}
				);
			}
		});
	}

	viewImages(product) {
		this.images = product.images;
		this.modalService.open(this.modalImage, {
			backdrop: true,
			size: 'xs',
			animation: true
		});
	}

	pagingChange($event: IPaginatorState) {
		this.paginatorState = $event as PaginatorState;
		this.onSearch();
	}
}
