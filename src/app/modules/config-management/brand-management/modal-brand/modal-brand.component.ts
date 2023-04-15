import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICategory } from 'src/app/shared/models/shared.interface';
import { IBrand } from './../../../../shared/models/shared.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'app-modal-brand',
	templateUrl: './modal-brand.component.html',
	providers: [FormBuilder]
})
export class ModalBrandComponent implements OnInit {
	@Input() data: IBrand;

	dataForm: FormGroup;
	categories: ICategory[] = [];

	constructor(
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		private sharedService: SharedService,
		private toastr: ToastrService,
		private cdr: ChangeDetectorRef
	) {}

	initForm() {
		if (!this.data) {
			this.dataForm = this.fb.group({
				name: ['', [Validators.required]],
				categoryIds: ['', [Validators.required]]
			});
		} else {
			const ids: string[] = this.data.catagories.map((item) => item.id);

			this.dataForm = this.fb.group({
				name: [this.data.name, [Validators.required]],
				categoryIds: [ids, [Validators.required]]
			});
		}
	}

	ngOnInit(): void {
		this.getListCategory();
		this.initForm();
	}

	getListCategory() {
		this.sharedService.getListCategory().subscribe((res) => {
			this.categories = res;
			this.cdr.detectChanges();
		});
	}

	onSubmit() {
		this.dataForm.markAllAsTouched();
		if (this.dataForm.invalid) return;
		const valueForm = {
			...this.dataForm.value,
			categoryIds: this.dataForm.value.categoryIds.join(',')
		};

		if (this.data) {
			this.sharedService.editBrand(this.data.id, valueForm).subscribe(
				(res) => {
					if (res) {
						this.modal.close(true);
						this.toastr.success('Cập nhật thành công !');
					}
				},
				(error) => this.checkError(error)
			);
		} else {
			this.sharedService.createBrand(valueForm).subscribe(
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
		this.toastr.error(error.message, 'Error');
	}
}
