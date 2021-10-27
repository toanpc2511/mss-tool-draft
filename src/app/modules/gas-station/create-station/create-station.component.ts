/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-case-declarations */
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable, of } from 'rxjs';
import { filter, map, pluck, switchMap, takeUntil } from 'rxjs/operators';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { CanActiveStepPipe } from '../gas-station.pipe';
import {
	CreateStation,
	GasStationResponse,
	GasStationService,
	StepData
} from '../gas-station.service';

@Component({
	selector: 'app-create-station',
	templateUrl: './create-station.component.html',
	styleUrls: ['./create-station.component.scss'],
	providers: [CanActiveStepPipe, DestroyService]
})
export class CreateStationComponent implements OnInit, AfterViewInit, OnDestroy {
	stepData$: Observable<StepData>;
	gasStationUpdateData: CreateStation;
	constructor(
		private gasStationService: GasStationService,
		private router: Router,
		private canActive: CanActiveStepPipe,
		private subheader: SubheaderService,
		private activeRoute: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private toastr: ToastrService
	) {
		this.stepData$ = gasStationService.stepData$;
	}

	ngOnInit() {
		this.activeRoute.params
			.pipe(
				pluck('id'),
				filter((gasStationId: number) => !!gasStationId),
				switchMap((gasStationId: number) => {
					this.gasStationService.gasStationId = gasStationId;
					return this.gasStationService.getStationById(gasStationId);
				}),
				switchMap((res: DataResponse<GasStationResponse>) => {
					if (res?.data) {
						this.gasStationUpdateData = {
							...res.data,
							stationCode: res.data.code
						};
						this.gasStationService.gasStationStatus = res.data.status;
						const step2$ = this.gasStationService.getListGasBin(
							this.gasStationService.gasStationId
						);
						const step3$ = this.gasStationService.getPumpPolesByGasStation(
							this.gasStationService.gasStationId
						);
						const step4$ = this.gasStationService.getPumpHosesByGasStation(
							this.gasStationService.gasStationId
						);
						return forkJoin([of(res.data), step2$, step3$, step4$]);
					}
					return of(null);
				}),
				map((data) => {
					if (data) {
						return { step1: data[0], step2: data[1], step3: data[2], step4: data[3] };
					}
					return null;
				}),
				takeUntil(this.destroy$)
			)
			.subscribe((res) => {
				if (res) {
					this.gasStationService.setStepData({
						currentStep: 1,
						step1: {
							isValid: !!res.step1,
							data: { ...res.step1, stationCode: res.step1.code }
						},
						step2: {
							isValid: res.step2.data.length > 0
						},
						step3: {
							isValid: res.step3.data.length > 0
						},
						step4: {
							isValid: res.step4.data.length > 0
						}
					});
				}
				this.cdr.detectChanges();
			});
	}

	ngAfterViewInit(): void {
		let subBreadcump = {
			title: 'Thêm trạm',
			linkText: 'Thêm trạm',
			linkPath: '/tram-xang/danh-sach/them-tram'
		};
		if (this.gasStationService.gasStationId) {
			subBreadcump = {
				title: 'Sửa trạm',
				linkText: 'Sửa trạm',
				linkPath: null
			};
			this.gasStationService.setStepData({
				currentStep: 1,
				step1: {
					data: null,
					isValid: true
				},
				step2: {
					isValid: true
				},
				step3: {
					isValid: true
				},
				step4: {
					isValid: true
				}
			});
		}
		setTimeout(() => {
			this.subheader.setBreadcrumbs([
				{
					title: 'Quản lý trạm xăng',
					linkText: 'Quản lý trạm xăng',
					linkPath: '/tram-xang/danh-sach'
				},
				{
					title: 'Danh sách trạm',
					linkText: 'Danh sách trạm',
					linkPath: '/tram-xang/danh-sach'
				},
				subBreadcump
			]);
		}, 1);
	}

	ngOnDestroy() {
		this.gasStationService.resetCreateData();
	}

	gotoStep(step: number) {
		const currentStepData = this.gasStationService.getStepDataValue();
		switch (step) {
			case 1:
				const canActiveStep1 = this.canActive.transform(currentStepData, 1);
				if (canActiveStep1) {
					this.gasStationService.setStepData({ ...currentStepData, currentStep: 1 });
				}
				break;
			case 2:
				const canActiveStep2 = this.canActive.transform(currentStepData, 2);
				if (canActiveStep2) {
					this.gasStationService.setStepData({ ...currentStepData, currentStep: 2 });
				} else {
					this.toastr.error('Vui lòng thêm trạm trước khi thực hiện bước tiếp theo');
				}
				break;
			case 3:
				const canActiveStep3 = this.canActive.transform(currentStepData, 3);
				if (canActiveStep3) {
					this.gasStationService.setStepData({ ...currentStepData, currentStep: 3 });
				} else {
					this.toastr.error('Vui lòng thêm bồn trước khi thực hiện bước tiếp theo');
				}
				break;
			case 4:
				const canActiveStep4 = this.canActive.transform(currentStepData, 4);
				if (canActiveStep4) {
					this.gasStationService.setStepData({ ...currentStepData, currentStep: 4 });
				} else {
					this.toastr.error('Vui lòng thêm cột trước khi thực hiện bước tiếp theo');
				}
				break;
		}
	}

	stepSubmitted($event) {
		if ($event.currentStep === 4) {
			this.router.navigate(['/tram-xang']);
			return;
		}
		const nextStep = $event.currentStep + 1;
		const currentStepData = cloneDeep(this.gasStationService.getStepDataValue());
		
		switch ($event.currentStep) {
			case 1:
				currentStepData.step1.data = $event.step1.data;
				this.gasStationUpdateData = currentStepData.step1.data;
				currentStepData.step1.isValid = $event.step1.isValid;
				break;
			case 2:
				currentStepData.step2.isValid = $event.step2.isValid;
				break;
			case 3:
				currentStepData.step3.isValid = $event.step3.isValid;
				break;
			case 4:
				currentStepData.step4.isValid = $event.step4.isValid;
				break;
		}
		this.gasStationService.setStepData({ ...currentStepData, currentStep: nextStep });
	}
}

