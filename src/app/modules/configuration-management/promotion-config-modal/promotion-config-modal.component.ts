import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IProduct, ProductService } from '../../product/product.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { IError } from '../../../shared/models/error.model';
import {
	ConfigurationManagementService,
	IConfigPromotion,
	IInfoProductOther
} from '../configuration-management.service';

@Component({
	selector: 'app-promotion-config-modal',
	templateUrl: './promotion-config-modal.component.html',
	styleUrls: ['./promotion-config-modal.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class PromotionConfigModalComponent implements OnInit {
	promotionForm: FormGroup;
	configForm: FormGroup;
	promotionFormArray: FormArray;
	promotions: Array<Array<any>> = [];

	productTypeOil: Array<IProduct> = [];
	productTypeOrther;
	categoryId = 0;

	@ViewChild('btnSave', { static: true }) btnSave: ElementRef;
	@Input() data: IDataTransfer;

	constructor(
		public modal: NgbActiveModal,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private configManagementService: ConfigurationManagementService,
		private productService: ProductService,
		private toastr: ToastrService,
		private destroy$: DestroyService
	) {}

	ngOnInit(): void {
		this.productService
			.getListProduct(this.categoryId)
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productTypeOil = res.data;
				this.cdr.detectChanges();
			});

		this.productService
			.getListProductTypeOther()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.productTypeOrther = res.data;
				this.cdr.detectChanges();
			});

		this.buildConfigForm();
		this.buildPromotionForm();
		this.onSubmit();

		if (this.data.promoConfig) {
			this.data.promoConfig.promotionProducts.forEach((promotion, i) => {
				if (i >= 1) {
					this.addItem();
				}
				this.promotionFormArray.at(i).get('categoryId').patchValue(promotion.categoryId);
				this.promotionFormArray.at(i).get('productId').patchValue(promotion.productId);
				this.promotionFormArray.at(i).get('unit').patchValue(promotion.unit);
				this.promotionFormArray
					.at(i)
					.get('quantity')
					.patchValue(promotion.quantity);
				this.getListProduct(promotion.categoryId, i);
				this.patchInfoProduct(promotion.productId, i);
			});
		}
	}

	buildConfigForm() {
		const dataTransfer = this.data.promoConfig;
		if (dataTransfer) {
			this.configForm = this.fb.group({
				productOil: [dataTransfer.productId, Validators.required],
				amout: [dataTransfer.amountLiterOrder?.toLocaleString('en-US'), Validators.required]
			});
		} else {
			this.configForm = this.fb.group({
				productOil: ['', Validators.required],
				amout: ['', Validators.required]
			});
		}
	}

	buildPromotionForm() {
		this.promotionForm = this.fb.group({
			promotions: this.fb.array([
				this.fb.group({
					categoryId: ['', Validators.required],
					productId: ['', Validators.required],
					unit: [''],
					quantity: ['', [Validators.required, Validators.min(1)]]
				})
			])
		});

		this.promotionFormArray = this.promotionForm.get('promotions') as FormArray;
		this.cdr.detectChanges();
	}

	productTypeChanged($event: Event, index: number) {
		const value = ($event.target as HTMLSelectElement).value;
		this.getListProduct(value, index);
		this.promotionFormArray.at(index).get('unit').patchValue('');
		this.promotionFormArray.at(index).get('quantity').patchValue('');
	}

	getListProduct(categoryId, index: number) {
		this.productService
			.getListProduct(Number(categoryId))
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.promotions[index] = res.data;
				this.cdr.detectChanges();
			});
	}

	productChanged($event, i: number) {
		const value = ($event.target as HTMLSelectElement).value;
		this.patchInfoProduct(value, i);
	}

	patchInfoProduct(productId: string | number, i: number) {
		const allProduct = this.promotionFormArray.value as Array<any>;
		const checkExisted = allProduct.some(
			(p, index) => p.productId && i !== index && Number(p.productId) === Number(productId)
		);

		if (checkExisted) {
			this.toastr.error('Sản phẩm này đã được thêm');
			this.promotionFormArray.at(i).get('productId').patchValue('');
			return;
		}
		if (!productId) {
			this.promotionFormArray.at(i).get('unit').patchValue(0);
		}

		this.productService.getInfoProductOther(Number(productId)).subscribe((res) => {
			const dataRes: any = res.data;
			this.promotionFormArray.at(i).get('unit').patchValue(dataRes.unit);
		});
	}

	deleteItem(index: number): void {
		this.promotionFormArray.removeAt(index);
	}

	addItem() {
		this.promotionFormArray.push(
			this.fb.group({
				categoryId: ['', Validators.required],
				productId: ['', Validators.required],
				unit: [''],
				quantity: ['', [Validators.required, Validators.min(1)]]
			})
		);
	}

	onClose() {
		this.modal.close();
	}

	onSubmit(): void {
		fromEvent(this.btnSave.nativeElement, 'click')
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.configForm.markAllAsTouched();
				this.promotionForm.markAllAsTouched();
				if (this.configForm.invalid || this.promotionForm.invalid) {
					return;
				}

				this.promotionForm.value.promotions.map((p) => {
					delete p.categoryId;
					delete p.unit;
				});

				const promotionData: Array<IInfoProductOther> = (
					this.promotionForm.value.promotions as Array<IInfoProductOther>
				).map((p) => ({ ...p, quantity: Number(p.quantity), productId: Number(p.productId) }));

				const promotionReq: any = {
					productId: Number(this.configForm.value.productOil),
					amountLiterOrder: Number(this.configForm.value.amout.split(',').join('')),
					productRequests: promotionData
				};

				if (!this.data.promoConfig) {
					this.configManagementService
						.createConfigPromotion(promotionReq)
						.pipe(takeUntil(this.destroy$))
						.subscribe(
							() => {
								this.modal.close(true);
							},
							(err: IError) => {
								this.checkError(err);
							}
						);
				} else {
					this.configManagementService
						.updateConfigPromotion(promotionReq, this.data.promoConfig.promotionId)
						.pipe(takeUntil(this.destroy$))
						.subscribe(
							() => {
								this.modal.close(true);
							},
							(err: IError) => {
								this.checkError(err);
							}
						);
				}
			});
	}

	checkError(error: IError) {
		if (error.code === 'SUN-OIL-4730') {
			this.toastr.error('Khuyến mại đã tồn tại');
		}
		if (error.code === 'SUN-OIL-4732') {
			this.toastr.error('Sản phẩm không tồn tại');
		}
		if (error.code === 'SUN-OIL-4733') {
			this.toastr.error('Số lít không được bỏ trống');
		}
	}
}

export interface IDataTransfer {
	title: string;
	promoConfig?: IConfigPromotion;
}
