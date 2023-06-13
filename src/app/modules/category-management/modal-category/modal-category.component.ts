import { SharedService } from 'src/app/shared/services/shared.service';
import { DestroyService } from './../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ICategory } from 'src/app/shared/models/shared.interface';
import { EFileType, FileService } from 'src/app/shared/services/file.service';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-modal-category',
	templateUrl: './modal-category.component.html',
	styleUrls: ['./modal-category.component.scss'],
	providers: [FormBuilder, DestroyService]
})
export class ModalCategoryComponent implements OnInit {
	@Input() data: any;

	dataForm: FormGroup;
	categorys: ICategory[] = [];

	files: File[];
	url: any;
	urls = [];

	constructor(
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		private sharedService: SharedService,
		private toastr: ToastrService,
		private fileService: FileService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService
	) {
		this.initForm();
	}

	initForm() {
		this.dataForm = this.fb.group({
			name: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
		if (this.data) {
			this.dataForm.patchValue({ name: this.data.name });
		}
	}
	onSave(): void {
		this.dataForm.markAllAsTouched();
		if (this.dataForm.invalid) {
			this.toastr.warning('Vui lòng nhập đủ thông tin', 'Cảnh báo');
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
					this.onSubmit(urlImgs);
				}
				this.cdr.detectChanges();
			});
	}

	onSubmit(imgs: string[]) {
		this.dataForm.markAllAsTouched();
		if (this.dataForm.invalid) return;
		const valueForm = {
			name: this.dataForm.value.name,
			image: imgs[0]
		};
		if (this.data) {
			this.sharedService.editCategory(valueForm, this.data.id).subscribe(
				(res) => {
					if (res) {
						this.modal.close(true);
						this.toastr.success('Cập nhật mới thành công !');
					}
				},
				(error) => this.checkError(error)
			);
		} else {
			this.sharedService.createCategory(valueForm).subscribe(
				(res) => {
					if (res) {
						this.modal.close(true);
						this.toastr.success('Thêm mới thành công !');
					}
				},
				(error) => this.checkError(error)
			);
		}
	}

	checkError(error) {
		console.log(error);
	}
}
