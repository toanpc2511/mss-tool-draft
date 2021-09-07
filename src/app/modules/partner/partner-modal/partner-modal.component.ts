import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subject } from 'rxjs';
import { catchError, concatMap, debounceTime, filter, takeUntil } from 'rxjs/operators';
import { pathValueWithoutEvent } from 'src/app/shared/data-enum/patch-value-without-event';
import { convertMoney, formatMoney } from 'src/app/shared/helpers/functions';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { AuthService } from '../../auth/services/auth.service';
import { IProduct, ProductService } from '../../product/product.service';
import { EPartnerStatus, IVehicle, PartnerService } from '../partner.service';

@Component({
	selector: 'app-partner-modal',
	templateUrl: './partner-modal.component.html',
	styleUrls: ['./partner-modal.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class PartnerModalComponent implements OnInit {
	currentAccountPhoneNumber: string;
	@Input() partnerId: number;
	eStatus = EPartnerStatus;
	vehicles: IVehicle[] = [];
	partnerForm: FormGroup;
	cashLimitOilFormArray: FormArray;
	isLoadingFormSubject = new Subject<boolean>();
	isLoadingForm$ = this.isLoadingFormSubject.asObservable();

	isUpdate = false;
	cashLimitMoney = 0;
	oils: IProduct[] = [];
	constructor(
		public modal: NgbActiveModal,
		private modalService: NgbModal,
		private fb: FormBuilder,
		private authService: AuthService,
		private partnerService: PartnerService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService
	) {
		this.currentAccountPhoneNumber = authService.getCurrentUserValue().driverAuth.phone;
	}

	ngOnInit(): void {
		this.buildForm();
		if (this.partnerId) {
			this.isUpdate = true;
			this.partnerService
				.getPartnerById(this.partnerId)
				.pipe(takeUntil(this.destroy$))
				.subscribe((res) => {
					console.log(res);

					// this.partnerForm.patchValue(res.data);
				});
			this.partnerForm.get('phone').disable();
		}

		this.partnerService
			.getAllVehicles()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.vehicles = res.data;
				this.cdr.detectChanges();
			});

		this.partnerService
			.getCashLimit()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				if (res.data) {
					const vehicleFormArray = this.fb.array(
						res.data.cashLimitOilAccount?.map((cashLimit) => {
							return this.fb.group({
								productId: [cashLimit.productId],
								cashLimitOil: [null, [TValidators.min(1), TValidators.max(cashLimit.cashLimitOil)]],
								maxCashLimitOil: [cashLimit.cashLimitOil],
								unitCashLimitOil: [cashLimit.unitCashLimitOil]
							});
						}) || []
					);
					this.partnerForm.setControl('cashLimitOil', vehicleFormArray);
					this.cashLimitOilFormArray = this.partnerForm.get('cashLimitOil') as FormArray;
					this.cashLimitMoney = res.data.cashLimitMoney;
					this.partnerForm
						.get('cashLimitMoney')
						.setValidators([TValidators.min(1), TValidators.max(this.cashLimitMoney)]);
					this.partnerForm.updateValueAndValidity();
					this.isLoadingFormSubject.next(true);
				}
			});
	}

	patchInfoPartner(data: { id: number; name: string }) {
		this.partnerForm.get('driverId').patchValue(data.id);
		this.partnerForm.get('name').patchValue(data.name);
	}

	deleteNumberPhone(): void {
		this.partnerForm.get('phone').patchValue(null, pathValueWithoutEvent);
		this.partnerForm.get('name').patchValue(null, pathValueWithoutEvent);
		this.partnerForm.updateValueAndValidity();
	}

	buildForm(): void {
		this.partnerForm = this.fb.group({
			phone: [null, [Validators.required]],
			name: [null, [Validators.required]],
			driverId: [null],
			vehicleIds: [null],
			cashLimitOil: this.fb.array([]),
			cashLimitMoney: [null]
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

		const data = {
			...this.partnerForm.value,
			driverId: Number(this.partnerForm.value.driverId),
			cashLimitMoney: convertMoney(this.partnerForm.value.cashLimitMoney)
		};

		if (!this.isUpdate) {
			this.partnerService
				.createPartner(data)
				.pipe(takeUntil(this.destroy$))
				.subscribe(
					(res) => this.closeModal(res),
					(err: IError) => this.checkError(err)
				);
		} else {
			this.partnerService
				.updatePartner(this.partnerId, data)
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

	checkError(err: IError) {
		if (err?.code === 'SUN-OIL-4005' || err?.code === 'SUN-OIL-4834') {
			this.partnerForm.get('phone').setErrors({ notFound: true });
		}
		if (err?.code === 'SUN-OIL-4866') {
			this.partnerForm.get('phone').setErrors({ current: true });
		}
		if (err?.code === 'SUN-OIL-4868') {
			this.partnerForm.get('phone').setErrors({ isEnterprise: true });
		}
		if (err?.code === 'SUN-OIL-4869') {
			this.partnerForm.get('phone').setErrors({ existed: true });
		}
		this.cdr.detectChanges();
	}

	onClose(): void {
		this.modal.close();
	}
}
