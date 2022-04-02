import { takeUntil, tap, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { Observable, forkJoin } from 'rxjs';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { CustomShiftPipe } from '../../shift.pipe';
import { ShiftService } from '../../shift.service';

@Component({
	selector: 'app-detail-shift-closing-history',
	templateUrl: './detail-shift-closing-history.component.html',
	styleUrls: ['./detail-shift-closing-history.component.scss'],
	providers: [CustomShiftPipe, DestroyService]
})
export class DetailShiftClosingHistoryComponent implements OnInit, AfterViewInit, OnDestroy {
	currentStep$: Observable<number>;
	step = 1;
	lockShiftId: number;
	statusLockShift: string;
  stationId: number;
  isTransitionStep: boolean;

	constructor(
		private subheader: SubheaderService,
		private shiftService: ShiftService,
		private toastr: ToastrService,
		private activeRoute: ActivatedRoute,
		private destroy$: DestroyService
	) {
		this.currentStep$ = shiftService.currentStep$;
	}
	ngOnInit(): void {
		this.activeRoute.params.pipe(
			switchMap((queryParams) => {
				this.lockShiftId = queryParams.lockShiftId;
				this.statusLockShift = queryParams.statusLockShift;
        this.stationId = queryParams.stationId;
				return forkJoin([
					this.shiftService.getOtherProductRevenue(this.lockShiftId),
					this.shiftService.getPromotionalRevenue(this.lockShiftId)
				]);
			}),
			tap(([step2Data, step3Data]) => {
				if (step3Data?.data?.length > 0) {
					this.shiftService.setCurrentStep(3);
				}
				if (step2Data?.data?.length > 0) {
					this.shiftService.setCurrentStep(2);
				}
			}),
			takeUntil(this.destroy$)
		).subscribe();
	}

	ngAfterViewInit() {
		const subBreadcump = {
			title: 'Chi tiết',
			linkText: 'Chi tiết',
			linkPath: '/ca-lam-viec/lich-su-chot-ca/chi-tiet'
		};

		setTimeout(() => {
			this.subheader.setBreadcrumbs([
				{
					title: 'Quản lý ca làm việc',
					linkText: 'Quản lý ca làm việc',
					linkPath: '/ca-lam-viec/lich-su-chot-ca'
				},
				{
					title: 'Lịch sử chốt ca',
					linkText: 'Lịch sử chốt ca',
					linkPath: '/ca-lam-viec/lich-su-chot-ca'
				},
				subBreadcump
			]);
		}, 1);
	}

	ngOnDestroy() {
		this.shiftService.resetCreateData();
	}

	gotoStep(step: number) {
		const currentStep = this.shiftService.getCurrentStepValue();
    this.isTransitionStep = true;
		switch (step) {
			case 1:
				this.step = step;
				break;
			case 2:
				if (currentStep >= 2) {
					this.step = step;
				} else {
					this.toastr.error('Bạn cần phải hoàn thành bước trước đó');
				}
				break;
			case 3:
				if (currentStep >= 3) {
					this.step = step;
				} else {
					this.toastr.error('Bạn cần phải hoàn thành bước trước đó');
				}
				break;
			case 4:
				if (currentStep >= 3) {
					this.step = step;
				} else {
					this.toastr.error('Bạn cần phải hoàn thành bước trước đó');
				}
				break;
		}
	}
}
