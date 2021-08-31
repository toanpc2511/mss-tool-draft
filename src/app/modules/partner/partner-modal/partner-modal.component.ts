import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { catchError, concatMap, debounceTime, takeUntil } from 'rxjs/operators';
import { ConfirmDeleteComponent } from 'src/app/shared/components/confirm-delete/confirm-delete.component';
import { NgSelectConfig } from 'src/app/shared/components/ng-select/public-api';
import { pathValueWithoutEvent } from 'src/app/shared/data-enum/patch-value-without-event';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { EPartnerStatus, ICar, PartnerService } from '../partner.service';

@Component({
	selector: 'app-partner-modal',
	templateUrl: './partner-modal.component.html',
	styleUrls: ['./partner-modal.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class PartnerModalComponent implements OnInit {
	@Input() partnerId: number;
	eStatus = EPartnerStatus;
	cars: Array<ICar> = [];
	partnerForm: FormGroup;
	isUpdate = false;
	constructor(
		public modal: NgbActiveModal,
		private modalService: NgbModal,
		private fb: FormBuilder,
		private partnerService: PartnerService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService
	) {
	}

	ngOnInit(): void {
		this.buildForm();
		if (this.partnerId) {
			this.isUpdate = true;
			this.partnerService
				.getPartnerById(this.partnerId)
				.pipe(takeUntil(this.destroy$))
				.subscribe((res) => {
					this.partnerForm.patchValue(res.data);
				});
		}

		this.partnerService
			.getAllCars()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.cars = res.data;
				this.cdr.detectChanges();
			});
	}

	patchInfoPartner(data: { name: string }) {
		this.partnerForm.get('name').patchValue(data.name);
	}

	deleteNumberPhone(): void {
		// const modalRef = this.modalService.open(ConfirmDeleteComponent, {
		// 	backdrop: 'static'
		// });
		// modalRef.componentInstance.data = {
		// 	title: 'Xác nhận',
		// 	message: `Nếu thay đổi số điện thoại, dữ liệu khách hàng sẽ thay đổi theo. Bạn có chắc chắn muốn thay đổi không?`,
		// 	button: { class: 'btn-primary', title: 'Xác nhận' }
		// };

		// modalRef.result.then((result) => {
		// 	if (result) {
		this.partnerForm.get('phone').patchValue(null, pathValueWithoutEvent);
		this.partnerForm.get('name').patchValue(null, pathValueWithoutEvent);
		this.partnerForm.updateValueAndValidity();
		// 	}
		// });
	}

	buildForm(): void {
		this.partnerForm = this.fb.group({
			phone: [null, [Validators.required]],
			name: [null, [Validators.required]],
			carIds: [null],
			limit: [null]
		});

		this.partnerForm.get('name').disable();

		this.partnerForm
			.get('phone')
			.valueChanges.pipe(
				debounceTime(300),
				concatMap((phoneNumber: string) => {
					if (phoneNumber) {
						return this.partnerService.getPartnerByPhone(phoneNumber).pipe(
							catchError((err: IError) => {
								this.checkError(err);
								return of(err);
							})
						);
					}
					return of(null);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe((res) => {
				if (res?.data) {
					this.patchInfoPartner(res.data);
				}
			});
	}

	onSubmit(): void {
		this.partnerForm.markAllAsTouched();
		if (this.partnerForm.invalid) {
			return;
		}
		if (!this.isUpdate) {
			this.partnerService
				.createPartner(this.partnerForm.value)
				.pipe(takeUntil(this.destroy$))
				.subscribe(
					(res) => this.closeModal(res),
					(err: IError) => this.checkError(err)
				);
		} else {
			this.partnerService
				.updatePartner(this.partnerId, this.partnerForm.value)
				.pipe(takeUntil(this.destroy$))
				.subscribe(
					(res) => this.closeModal(res),
					(err: IError) => this.checkError(err)
				);
		}
	}

	closeModal(res: DataResponse<any>) {
		if (res.data) {
			this.modal.close(true);
		}
	}

	checkError(err: IError) {}

	onClose(): void {
		this.modal.close();
	}
}
