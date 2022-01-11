import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of, Subject } from 'rxjs';
import {
	catchError,
	concatMap,
	debounceTime,
	finalize,
	skipUntil,
	switchMap,
	takeUntil,
	tap
} from 'rxjs/operators';
import { pathValueWithoutEvent } from 'src/app/shared/data-enum/patch-value-without-event';
import { convertMoney } from 'src/app/shared/helpers/functions';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { IProduct } from '../../product/product.service';
import { EPartnerStatus, IPartnerData, IVehicle, PartnerService } from '../partner.service';

@Component({
	selector: 'app-partner-modal',
	templateUrl: './partner-modal.component.html',
	styleUrls: ['./partner-modal.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class PartnerModalComponent implements OnInit {
	@Input() partnerId: number;
	@Input() viewDetail: number;
	eStatus = EPartnerStatus;
	vehicles: IVehicle[] = [];
	partnerForm: FormGroup;
	cashLimitOilFormArray: FormArray;
	isLoadingFormSubject = new Subject<boolean>();
	isLoadingForm$ = this.isLoadingFormSubject.asObservable();
  dataDetail: IPartnerData;

	isUpdate = false;
	cashLimitMoneyChild = 0;
	cashLimitMoneyMaster = 0;
	oils: IProduct[] = [];
	constructor(
		public modal: NgbActiveModal,
		private fb: FormBuilder,
		private partnerService: PartnerService,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService
	) {}

	ngOnInit(): void {
		this.partnerService
			.getAllVehicles()
			.pipe(takeUntil(this.destroy$))
			.subscribe((res) => {
				this.vehicles = res.data;
				this.cdr.detectChanges();
			});

		this.buildForm();

		this.partnerService
			.getCashLimit()
			.pipe(
				tap((res) => {
					if (res.data) {
						const vehicleFormArray = this.fb.array(
							res.data.cashLimitOilAccount?.map((cashLimit) => {
								return this.fb.group({
									productId: [cashLimit.productId],
									productName: [cashLimit.productName],
									cashLimitOil: [
										null,
										[TValidators.min(1), TValidators.max(cashLimit.cashLimitOil)]
									],
									maxCashLimitOil: [cashLimit.cashLimitOil],
									unitCashLimitOil: [cashLimit.unitCashLimitOil]
								});
							}) || []
						);
						this.partnerForm.setControl('cashLimitOil', vehicleFormArray);
						this.cashLimitOilFormArray = this.partnerForm.get('cashLimitOil') as FormArray;
						this.cashLimitMoneyMaster = res.data.cashLimitMoney;
						this.partnerForm
							.get('cashLimitMoney')
							.setValidators([TValidators.min(1), TValidators.max(this.cashLimitMoneyMaster)]);
						this.partnerForm.updateValueAndValidity();
						this.isLoadingFormSubject.next(true);
					}
				}),
				switchMap(() => {
					if (this.partnerId) {
						this.isUpdate = true;
						return this.partnerService
							.getPartnerById(this.partnerId)
							.pipe(takeUntil(this.destroy$));
					}
					return of(null);
				}),
				tap((res) => {
					if (res) {
						this.patchInfoParterUpdate(res.data);
            this.dataDetail = res.data;
					}
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	patchInfoParterUpdate(partnerData: IPartnerData) {
		this.partnerForm.get('phone').patchValue(partnerData.driverInfo.phone, pathValueWithoutEvent);
		this.partnerForm.get('phone').disable(pathValueWithoutEvent);
		this.partnerForm.get('name').patchValue(partnerData.driverInfo.name, pathValueWithoutEvent);
		this.partnerForm.get('driverId').patchValue(partnerData.driverInfo.id, pathValueWithoutEvent);

		this.partnerForm.get('vehicleIds').patchValue(
			partnerData.vehicles?.map((v) => v.id),
			pathValueWithoutEvent
		);

		const cashLimitOils = partnerData.cashLimitOilChildNmaster;

		for (let i = 0; i < cashLimitOils.length; i++) {
			const group = this.cashLimitOilFormArray.at(i);
			group
				.get('cashLimitOil')
				.patchValue(cashLimitOils[i].cashLimitOilChild, pathValueWithoutEvent);
			group.get('maxCashLimitOil').patchValue(cashLimitOils[i].cashLimitOilMaster);
		}

		this.partnerForm
			.get('cashLimitMoney')
			.patchValue(
				partnerData.cashLimitMoneyChildNmaster.cashLimitMoneyChild,
				pathValueWithoutEvent
			);
		this.cashLimitMoneyChild = partnerData.cashLimitMoneyChildNmaster.cashLimitMoneyChild;
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
			vehicleIds: [null, Validators.required],
			cashLimitOil: this.fb.array([]),
			cashLimitMoney: [null]
		});

		this.partnerForm.get('name').disable(pathValueWithoutEvent);

		this.partnerForm
			.get('phone')
			.valueChanges.pipe(
				debounceTime(300),
				concatMap((phoneNumber: string) => {
					if (phoneNumber) {
						return this.partnerService.getPartnerByPhone(phoneNumber).pipe(
							catchError((err: IError) => {
								this.partnerForm.get('name').patchValue(null, pathValueWithoutEvent);
								this.checkError(err);
								return of(err);
							}),
							takeUntil(this.destroy$)
						);
					}
					this.partnerForm.get('name').patchValue(null, pathValueWithoutEvent);
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

		const formValue = this.partnerForm.getRawValue();

		const data = {
			...formValue,
			driverId: this.partnerForm.value.driverId,
			cashLimitOil: formValue.cashLimitOil.map((c) => ({
				...c,
				cashLimitOil: convertMoney(c.cashLimitOil)
			})),
			cashLimitMoney: convertMoney(formValue.cashLimitMoney)
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
		if (err?.code === 'SUN-OIL-4870' || err?.code === 'SUN-OIL-4869') {
			this.partnerForm.get('phone').setErrors({ existed: true });
		}
		this.cdr.detectChanges();
	}

	onClose(): void {
		this.modal.close();
	}
}
