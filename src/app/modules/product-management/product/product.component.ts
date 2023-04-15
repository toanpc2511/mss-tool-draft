import { SharedService } from 'src/app/shared/services/shared.service';
import { IError } from 'src/app/shared/models/error.model';
import { AngularEditorConfig } from './../../../shared/components/editor-config/config';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { takeUntil, tap } from 'rxjs/operators';
import { FileService, EFileType } from './../../../shared/services/file.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { getConfigEditor } from 'src/app/shared/components/editor-config/config-editor';
import { IProduct } from 'src/app/shared/models/shared.interface';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss'],
	providers: [DestroyService]
})
export class ProductComponent implements OnInit {
	productForm: FormGroup;
	id: string;
	categories: any[] = [];
	files: File[];
	url: any;
	urls = [];
	config: AngularEditorConfig = getConfigEditor(this.toastr, this.fileService);

	imageSrc = '';
	imageSrcs: any[] = [];
	brands: any[] = [];
	properties: any[] = [];
	propertyGroup: FormArray = new FormArray([]);

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private toastr: ToastrService,
		private sharedService: SharedService,
		private fileService: FileService,
		private destroy$: DestroyService,
		private cdr: ChangeDetectorRef,
		private activeRoute: ActivatedRoute
	) {
		this.initForm();
	}

	initForm(): void {
		this.productForm = this.fb.group({
			model: ['', [Validators.required]],
			name: ['', [Validators.required]],
			category: ['', [Validators.required]],
			price: ['', [Validators.required]],
			sales: ['', [Validators.required]],
			description: ['', [Validators.required]],
			brand: ['', [Validators.required]],
			warranty: ['']
		});
	}

	ngOnInit(): void {
		this.activeRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
			this.id = params.id;
			if (this.id) {
				this.sharedService
					.getDetailProduct(this.id)
					.pipe(
						tap((res: IProduct) => {
							this.urls = res.images.split(',');
							this.productForm.get('model').disable;
							console.log(res);

							this.productForm.patchValue({
								model: res.model,
								name: res.name,
								category: res.category.id,
								price: res.price,
								description: res.description,
								sales: res.sales,
								brand: '21444e71-9ed5-41a2-abc9-c32a6eb689e5'
							});
						})
					)
					.subscribe();
			}
		});
		this.getListCategory();
		this.handleChangeCategory();
	}

	handleChangeCategory(): void {
		this.productForm.controls['category'].valueChanges.subscribe((value: string) => {
			if (value) {
				console.log(value);

				const category = this.categories.find((category) => category.id === value);

				this.brands = category?.categoryBrands;
				this.propertyGroup = this.convertToFormArray(category?.categoryProductAttributes);

				this.cdr.detectChanges();
			}
		});
	}

	convertToFormArray(data: any[]): FormArray {
		console.log(data);
		this.properties = data;
		const controls = data.map((p) => {
			return this.fb.group({
				id: [p.id],
				value: ['', [Validators.required]]
			});
		});
		return this.fb.array(controls);
	}

	getListCategory(): void {
		this.sharedService.getListCategory().subscribe((res) => {
			if (res) {
				this.categories = res.map((category) => ({
					...category,
					categoryBrands: category.categoryBrands.map((item) => {
						return item.brand;
					}),
					categoryProductAttributes: category.categoryProductAttributes.map((item) => {
						return item.productAttribute;
					})
				}));
				console.log(this.categories);

				this.cdr.detectChanges();
			}
		});
	}

	onBack() {
		this.router.navigate(['san-pham']);
	}

	onSave(): void {
		this.productForm.markAllAsTouched();
		if (this.productForm.invalid) {
			this.toastr.warning('Vui lòng nhập đủ thông tin', 'Cảnh báo');
			return;
		}
		if (Number(this.productForm.get('sales').value) > 100) {
			this.productForm.get('sales').setErrors({ maxSale: true });
		}

		this.uploadImageFile(this.files);
	}

	addImage($event) {
		this.files = [];
		const inputElement = $event.target as HTMLInputElement;
		this.files = Array.from(inputElement.files);

		this.files.forEach((file) => {
			if (file.size > 15360000) {
				this.toastr.error('Dung lượng ảnh quá lớn. Vui lòng chọn ảnh có dung lượng thấp hơn 15MB');
				return;
			}
			if (file.type.split('/')[0] !== 'image') {
				this.files = [];
				this.toastr.warning('Không phải định dạng ảnh!');
				return;
			}
		});

		inputElement.value = null;

		this.files.forEach((item) => {
			this.readAndPreview(item);
		});
	}

	readAndPreview = (file) => {
		this.urls = [];
		if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
			const reader = new FileReader();
			reader.onload = (event) => {
				this.urls.push(event.target.result);
				this.cdr.detectChanges();
			};

			reader.readAsDataURL(file);
		}
	};

	uploadImageFile(files: File[]) {
		const formData = new FormData();
		if (!files || files.length <= 0) {
			this.toastr.warning('Vui lòng chọn ảnh và thử lại!', 'Thông báo');
			return;
		}
		files.forEach((file) => formData.append('images', file));
		this.fileService
			.uploadFile(formData, EFileType.IMAGE)
			.pipe(takeUntil(this.destroy$))
			.subscribe((urlImgs: any) => {
				if (urlImgs) {
					this.createProduct(urlImgs);
				}
				this.cdr.detectChanges();
			});
	}

	createProduct(urlImage) {
		let valueForm = this.productForm.value;
		valueForm = {
			...valueForm,
			images: urlImage.join(','),
			quantity: 100,
			price: Number(valueForm.price.split(',').join('')),
			sales: Number(valueForm.sales.split(',').join('')),
			productAttributes: this.propertyGroup.value
		};

		console.log(valueForm);

		if (this.id) {
			this.sharedService.updateProduct(valueForm, this.id).subscribe(
				(res) => {
					if (res) {
						this.router.navigate(['/san-pham']);
						this.toastr.success('Cập nhật sản phẩm thành công', 'Thông báo');
					}
				},
				(err: IError) => this.checkError(err)
			);
		} else {
			this.sharedService.createProduct(valueForm).subscribe(
				(res) => {
					if (res) {
						this.router.navigate(['/san-pham']);
						this.toastr.success('Thêm sản phẩm thành công', 'Thông báo');
					}
				},
				(err: IError) => this.checkError(err)
			);
		}
	}

	checkError(error: IError) {
		console.log(error);
	}
}
