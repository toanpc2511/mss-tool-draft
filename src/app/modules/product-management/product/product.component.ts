import { ProductService } from './../../../shared/services/product.service';
import { CategoryService } from './../../../shared/services/category.service';
import { AngularEditorConfig } from './../../../shared/components/editor-config/config';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { takeUntil } from 'rxjs/operators';
import { FileService, EFileType } from './../../../shared/services/file.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { getConfigEditor } from 'src/app/shared/components/editor-config/config-editor';
import { IPaginatorState, PaginatorState } from '../../../_metronic/shared/crud-table';

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

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private toastr: ToastrService,
		private categoryService: CategoryService,
		private productService: ProductService,
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
			priceNew: [{ value: '', disabled: true }],
			description: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
		this.activeRoute.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
			this.id = params.id;
			if (this.id) {
				this.productService.getDetailProduct(this.id).subscribe((res) => {
					console.log(res);
				});
			}
		});
		this.getListCategory();
	}

	getListCategory(): void {
		this.categoryService.getListCategory().subscribe((res) => {
			if (res) {
				this.categories = res;
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
			this.toastr.error('Thông tin sai', 'lôix');
			return;
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
		let valueForm = this.productForm.value;
		if (!files || files.length <= 0) {
			this.toastr.warning('Bạn chưa chọn ảnh cho sản phẩm, vui lòng chọn và thử lại!', 'Thông báo');
			return;
		}
		files.forEach((file) => formData.append('images', file));
		this.fileService
			.uploadFile(formData, EFileType.IMAGE)
			.pipe(takeUntil(this.destroy$))
			.subscribe((event: any) => {
				if (event) {
					valueForm = {
						...valueForm,
						images: event.join(','),
						quantity: 100,
						price: Number(valueForm.price.split(',').join(''))
					};

					this.productService.createProduct(valueForm).subscribe((res) => {
						if (res) {
							this.router.navigate(['/san-pham']);
							this.toastr.success('Thêm sản phẩm thành công', 'Thông báo');
						}
					});
				}
				this.cdr.detectChanges();
			});
	}
}
