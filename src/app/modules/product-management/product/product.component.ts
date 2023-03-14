import { ProductService } from './../../../shared/services/product.service';
import { CategoryService } from './../../../shared/services/category.service';
import { AngularEditorConfig } from './../../../shared/components/editor-config/config';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { takeUntil } from 'rxjs/operators';
import { FileService, EFileType } from './../../../shared/services/file.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IImage } from 'src/app/shared/models/shared.interface';
import { getConfigEditor } from 'src/app/shared/components/editor-config/config-editor';

@Component({
	selector: 'app-product',
	templateUrl: './product.component.html',
	styleUrls: ['./product.component.scss'],
	providers: [DestroyService]
})
export class ProductComponent implements OnInit {
	productForm: FormGroup;

	attachmentImg: IImage;

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
		private cdr: ChangeDetectorRef
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
			imageId: [''],
			description: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
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
		console.log(this.productForm.value);

		// this.productForm.markAllAsTouched();
		// if (this.productForm.invalid) {
		// 	this.toastr.error('Thông tin sai', 'lôix');
		// 	return;
		// }

		this.uploadImageFile(this.files);
	}

	addImage($event) {
		this.files = [];
		const preview = document.querySelector('#preview');
		const inputElement = $event.target as HTMLInputElement;
		this.files = Array.from(inputElement.files);
		console.log(this.files);
		if (this.files.length <= 0) {
			console.log('ngu');

			this.productForm.controls['imageId'].setErrors({ required: true });
		}

		this.files.forEach((file) => {
			if (file.size > 15360000) {
				this.toastr.error('Dung lượng ảnh quá lớn. Vui lòng chọn ảnh có dung lượng thấp hơn 15MB');
				this.productForm.controls['imageId'].patchValue('');
				return;
			}

			if (file.type.split('/')[0] !== 'image') {
				this.productForm.controls['imageId'].setErrors({ file: true });
				this.attachmentImg = null;
				return;
			}
		});

		this.productForm.controls['imageId'].setErrors({ file: false });
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
		delete valueForm.imageId;
		files.forEach((file) => formData.append('images', file));
		this.fileService
			.uploadFile(formData, EFileType.IMAGE)
			.pipe(takeUntil(this.destroy$))
			.subscribe((event: any) => {
				if (event) {
					valueForm = {
						...valueForm,
						images: event.join(','),
						quantity: 100
					};

					this.attachmentImg = event[0];
					this.productForm.get('imageId').patchValue(event[0], { emitModelToViewChange: false });
					console.log(valueForm);

					this.productService.createProduct(valueForm).subscribe((res) => {
						if (res) {
							this.toastr.success('Thêm sản phẩm thành công', 'Thông báo');
							this.initForm();
							this.attachmentImg = null;
							this.files = [];
						}
					});
				}
				this.cdr.detectChanges();
			});
	}
}
