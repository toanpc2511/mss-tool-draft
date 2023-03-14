import { ICategory, CategoryService } from './../../../shared/services/category.service';
import { DestroyService } from './../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

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

	constructor(
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		private categoryService: CategoryService,
		private toastr: ToastrService
	) {
		this.initForm();
	}

	initForm() {
		this.dataForm = this.fb.group({
			name: ['', [Validators.required]]
			// code: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
		if (this.data) {
			this.dataForm.patchValue({ name: this.data.name });
		}
	}

	onSubmit() {
		this.dataForm.markAllAsTouched();
		if (this.dataForm.invalid) return;
		const valueForm = this.dataForm.value;
		if (this.data) {
			this.categoryService.editCategory(valueForm, this.data.id).subscribe(
				(res) => {
					if (res) {
						this.modal.close(true);
						this.toastr.success('Thêm mới thành công !');
					}
				},
				(error) => this.checkError(error)
			);
		} else {
			this.categoryService.createCategory(valueForm).subscribe(
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
