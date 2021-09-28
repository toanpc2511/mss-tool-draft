import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LIST_STATUS } from '../../../shared/data-enum/list-status';
import { IProductOther, ProductService } from '../product.service';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import { fromEvent } from 'rxjs';
import { IError } from '../../../shared/models/error.model';
import { TValidators } from '../../../shared/validators';

@Component({
	selector: 'app-list-product-other-modal',
	templateUrl: './list-product-other-modal.component.html',
	providers: [DestroyService, FormBuilder]
})
export class ListProductOtherModalComponent implements OnInit {
	@ViewChild('btnSave', { static: true }) btnSave: ElementRef;
	@Input() data: IDataTransfer;

	listStatus = LIST_STATUS;
	productTypes;
	productForm: FormGroup;

	constructor(
		public modal: NgbActiveModal,
		private productService: ProductService,
		private toastr: ToastrService,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService
	) {}

	ngOnInit(): void {
		this.productService
			.getListProductTypeOther()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productTypes = res.data;
				this.cdr.detectChanges();
			});

		this.buildForm();
		this.onSubmit();
	}

	buildForm() {
		const dataProduct = this.data.product;
		if (dataProduct) {
			this.productForm = this.fb.group({
				name: [dataProduct.name, Validators.required],
				categoryId: [dataProduct.categoryId, Validators.required],
				price: [this.formatMoney(dataProduct.price || 0), Validators.required],
				entryPrice: [this.formatMoney(dataProduct.entryPrice || 0), Validators.required],
				valueAddedTax: [
					typeof dataProduct.valueAddedTax !== 'object'
						? this.formatMoney(dataProduct.valueAddedTax || 0)
						: ''
				],
				unit: [dataProduct.unit, Validators.required],
				description: [dataProduct.description],
				status: [dataProduct.status],
				createQrCode: [dataProduct.createQrCode]
			});
		} else {
			this.productForm = this.fb.group({
				name: ['', Validators.required],
				categoryId: ['', Validators.required],
				price: ['', Validators.required],
				entryPrice: ['', Validators.required],
				valueAddedTax: [''],
				unit: ['', Validators.required],
				description: [''],
				status: ['ACTIVE'],
				createQrCode: [false]
			});
		}
	}

	onSubmit(): void {
		fromEvent(this.btnSave.nativeElement, 'click')
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.productForm.markAllAsTouched();
				if (this.productForm.invalid) {
					return;
				}

				const valueForm = { ...this.productForm.getRawValue() };
				valueForm.entryPrice = Number(valueForm.entryPrice.split(',').join(''));
				valueForm.price = Number(valueForm.price.split(',').join(''));
				valueForm.valueAddedTax =
					valueForm.valueAddedTax !== '' ? Number(valueForm.valueAddedTax) : '';

				if (this.data.product) {
					this.productService.updateProductOther(this.data.product.id, valueForm).subscribe(
						() => {
							this.modal.close(true);
						},
						(error: IError) => {
							this.checkError(error);
						}
					);
				} else {
					this.productService.createProductOther(valueForm).subscribe(
						() => {
							this.modal.close(true);
						},
						(error: IError) => {
							this.checkError(error);
						}
					);
				}
			});
	}

	onClose() {
		this.modal.close();
	}

	formatMoney(n) {
		if (n !== '' && n > 0) {
			return (Math.round(n * 100) / 100).toLocaleString().split('.').join(',');
		}
	}

	checkError(err: IError) {
		if (err.code === 'SUN-OIL-4710') {
      this.productForm.get('name').setErrors({ nameExisted: true });
		}
		if (err.code === 'SUN-OIL-4711') {
			this.toastr.error('Mã sản phẩm không được trùng');
		}
		if (err.code === 'SUN-OIL-4790') {
			this.toastr.error('Nhập thuế k nằm trong khoảng 0-100');
		}
	}
}

export interface IDataTransfer {
	title: string;
	product?: IProductOther;
}
