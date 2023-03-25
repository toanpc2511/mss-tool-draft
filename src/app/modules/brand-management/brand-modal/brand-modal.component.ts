import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ICategory } from 'src/app/shared/models/shared.interface';

@Component({
	selector: 'app-brand-modal',
	templateUrl: './brand-modal.component.html',
	styleUrls: ['./brand-modal.component.scss'],
	providers: [FormBuilder]
})
export class BrandModalComponent implements OnInit {
	@Input() data: any;

	dataForm: FormGroup;
	categories: ICategory[] = [];

	constructor(
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		private sharedService: SharedService,
		private toastr: ToastrService,
		private cdr: ChangeDetectorRef
	) {
		this.initForm();
	}

	initForm() {
		this.dataForm = this.fb.group({
			name: ['', [Validators.required]],
			categoryIds: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
		this.getListCategory();
		if (this.data) {
			this.dataForm.patchValue({ name: this.data.name });
		}
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
		console.log(valueForm);

		if (this.data) {
			this.sharedService.editBrand(valueForm, this.data.id).subscribe(
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
	}
}
