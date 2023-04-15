import { toNonAccentVietnamese } from './../../../../shared/helpers/functions';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICategory } from './../../../../shared/models/shared.interface';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'app-modal-property',
	templateUrl: './modal-property.component.html'
})
export class ModalPropertyComponent implements OnInit {
	@Input() data: any;

	dataForm: FormGroup;
	valueArray: FormArray;
	categories: ICategory[] = [];

	constructor(
		private fb: FormBuilder,
		public modal: NgbActiveModal,
		private sharedService: SharedService,
		private toastr: ToastrService,
		private cdr: ChangeDetectorRef
	) {}

	initForm() {
		this.dataForm = this.fb.group({
			name: ['', [Validators.required]],
			categoryIds: ['', [Validators.required]],
			values: this.fb.array([
				this.fb.group({
					valueProperty: ['', [Validators.required]]
				})
			])
		});

		this.valueArray = this.dataForm.get('values') as FormArray;
		if (this.data) {
			this.dataForm.patchValue({
				name: this.data.name,
				categoryIds: this.data.categoryIds
			});

			this.data.values.forEach((value, i) => {
				if (i >= 1) {
					this.addItem();
				}
				this.valueArray?.at(i).get('valueProperty').patchValue(value);
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

	handlerQueryName(value: string): string {
		return toNonAccentVietnamese(value).replace(/ /g, '-').toLowerCase();
	}

	onSubmit() {
		this.dataForm.markAllAsTouched();
		this.valueArray.markAllAsTouched();
		if (this.dataForm.invalid) return;
		const valueForm = {
			...this.dataForm.value,
			categoryIds: this.dataForm.value.categoryIds.join(','),
			queryName: this.handlerQueryName(this.dataForm.value.name),
			values: this.dataForm.value.values.map((item) => {
				return item.valueProperty;
			})
		};

		if (this.data) {
			this.sharedService.updateProperty(this.data.id, valueForm).subscribe(
				(res) => {
					if (res) {
						this.modal.close(true);
						this.toastr.success('Cập nhật thành công !');
					}
				},
				(error) => this.checkError(error)
			);
		} else {
			this.sharedService.createProperty(valueForm).subscribe(
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

	addItem() {
		this.valueArray?.push(
			this.fb.group({
				valueProperty: ['', [Validators.required]]
			})
		);
	}

	deleteItem(index: number): void {
		this.valueArray.removeAt(index);
	}

	checkError(error) {
		console.log(error);
	}
}
