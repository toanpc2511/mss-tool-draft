import { IProduct, ProductService } from './../../shared/services/product.service';
import { ICategory, CategoryService } from './../../shared/services/category.service';
import { Router } from '@angular/router';
import {
	PaginatorState,
	IPaginatorState
} from './../../_metronic/shared/crud-table/models/paginator.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalProductComponent } from './modal-product/modal-product.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import * as moment from 'moment';

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

	searchForm: FormGroup;
	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
		private router: Router,
		private categorySev: CategoryService,
		private productService: ProductService,
		private cdr: ChangeDetectorRef
	) {
		this.initPaginator();
		this.initSearchForm();
	}

	initSearchForm(): void {
		this.searchForm = this.fb.group({
			code: [''],
			name: [''],
			type: ['']
		});
	}

	initPaginator() {
		this.paginatorState.page = 1;
		this.paginatorState.pageSize = 15;
		this.paginatorState.pageSizes = [5, 10, 15, 20];
		this.paginatorState.total = 0;
	}

	ngOnInit(): void {
		this.getListCategory();
		this.onSearch();
	}

	getListCategory(): void {
		this.categorySev.getListCategory().subscribe((res) => {
			this.categories = res;
			this.cdr.detectChanges();
		});
	}

	onSearch() {
		const valueForm = this.searchForm.value;
		const params = {};
		this.productService.getListProduct(params).subscribe((res) => {
			console.log(res);
			this.products = res;
			this.paginatorState.total = res.length;
			this.cdr.detectChanges();
		});
	}

	onReset(): void {
		this.initSearchForm();
	}

	create() {
		this.router.navigate(['san-pham/them-moi']);
	}

	edit(data: any) {
		const modalRef = this.modalService.open(ModalProductComponent, {
			centered: true,
			size: 'lg'
		});
		modalRef.componentInstance.data = data;

		modalRef.result.then((result) => {
			if (result) {
				console.log(result);
			}
		});
	}

	delete(id: string) {}

	pagingChange($event: IPaginatorState) {
		this.paginatorState = $event as PaginatorState;
		this.onSearch();
	}
}
