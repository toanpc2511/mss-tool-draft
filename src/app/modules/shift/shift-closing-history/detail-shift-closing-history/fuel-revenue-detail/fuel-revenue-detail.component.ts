import { BaseComponent } from './../../../../../shared/components/base/base.component';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFuelRevenue, ShiftService } from '../../../shift.service';
import { ActivatedRoute } from '@angular/router';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import { convertMoney } from '../../../../../shared/helpers/functions';
import { IError } from '../../../../../shared/models/error.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { DataResponse } from 'src/app/shared/models/data-response.model';
import { preventLetter } from 'src/app/shared/utitlies/prevent-letter';

@Component({
	selector: 'app-fuel-revenue-detail',
	templateUrl: './fuel-revenue-detail.component.html',
	styleUrls: ['./fuel-revenue-detail.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class FuelRevenueDetailComponent extends BaseComponent implements OnInit {
	@Output() stepSubmitted = new EventEmitter();
	lockShiftId: number;
	statusLockShift: string;
	dataSource: IFuelRevenue[] = [];
	dataSourceForm: FormArray = new FormArray([]);
	dataSourceTemp: FormArray = new FormArray([]);
	dataItem: IFuelRevenue;
	sumCashMoney: number;
  sumTotalMoney: number;
  decimalPattern = /^[0-9]+(\.[0-9]+)?$/;

  hasChangeEndElectronicPermission: boolean;
  @Input() isTransition;
  preventLetter: (event: KeyboardEvent) => void = preventLetter;

	constructor(
		private shiftService: ShiftService,
		private activeRoute: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private toastr: ToastrService,
		private fb: FormBuilder,
    private authService: AuthService
	) {
		super();
	}

	ngOnInit(): void {
    this.hasChangeEndElectronicPermission = this.authService.canUseFeature(this.eAuthorize.UPDATE_PRODUCT_REVENUE_ADMIN);

    this.activeRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((param) => {
        this.lockShiftId = param.lockShiftId;
      })
    this.activeRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((queryParams) => {
        this.statusLockShift = queryParams.status;
      })

    if (this.statusLockShift !== 'CLOSE' && !this.isTransition) {
      this.refreshDetailRevenue();
    } else {
      this.getFuelProductRevenue$().subscribe();
    }
  }

  refreshDetailRevenue(): void {
    const data = { lockShiftId: this.lockShiftId };
    this.shiftService.createFuelProductRevenue(data)
      .pipe(
        switchMap((res: DataResponse<boolean>) => {
          if(res.data) {
            return this.getFuelProductRevenue$()
          }
        })
      )
      .subscribe();
  }

	getFuelProductRevenue$() {
		return this.shiftService
			.getFuelProductRevenue(this.lockShiftId)
			.pipe(
				tap((res) => {
					if (this.statusLockShift === 'CLOSE') {
						this.dataSource = res.data;
						this.dataItem = this.dataSource[0];
						this.cdr.detectChanges();
					} else {
						this.dataSourceForm = this.dataSourceTemp = this.convertToFormArray(res.data);
						this.dataItem = this.dataSourceForm?.controls[0]?.value;

            this.sumTotalMoney = this.dataSourceForm?.controls[0]?.value.totalPrice;
            this.sumCashMoney = this.dataSourceForm?.controls[0]?.value.totalCashPaid;
						this.cdr.detectChanges();
					}
				}),
				takeUntil(this.destroy$)
			)
	}

	convertToFormArray(data): FormArray {
		const controls = data.map((d: IFuelRevenue) => {
			return this.fb.group({
				chip: [d.chip],
				code: [d.code],
				electronicEnd: [{ value: d.electronicEnd, disabled: this.hasChangeEndElectronicPermission ? !this.hasChangeEndElectronicPermission : d.chip }, [Validators.required, Validators.pattern(this.decimalPattern)]],
				electronicStart: [d.electronicStart],
				employeeName: [d.employeeName],
				gaugeEnd: [ d.gaugeEnd, [Validators.required]],
				gaugeStart: [d.gaugeStart],
				id: [d.id],
				limitMoney: [d.limitMoney],
				lockShiftId: [d.lockShiftId],
				productName: [d.productName],
				provisionalMoney: [d.provisionalMoney],
				quantityElectronic: [d.quantityElectronic],
				quantityGauge: [d.quantityGauge],
				quantityTransaction: [d.quantityTransaction],
				shiftId: [d.shiftId],
				shiftName: [d.shiftName],
				stationId: [d.stationId],
				stationName: [d.stationName],
				timeEnd: [d.timeEnd],
				timeStart: [d.timeStart],
				totalCashPaid: [d.totalCashPaid],
				totalLimitMoney: [d.totalLimitMoney],
				totalLiter: [d.totalLiter],
				totalMoney: [d.totalMoney],
				totalPoint: [d.totalPoint],
				totalPoints: [d.totalPoints],
				totalPrice: [d.totalPrice],
				totalProvisionalMoney: [d.totalProvisionalMoney],
				cashMoney: [d.cashMoney],
				price: [d.price],
        dischargeE: [d.dischargeE | 0]
			});
		});
		return this.fb.array(controls);
	}

  updateQuantityGauge(index: number): void {
    const gaugeStart: number = convertMoney(
      this.dataSourceForm.at(index).get('gaugeStart').value?.toString()
    );
    const gaugeEnd: number = convertMoney(
      this.dataSourceForm.at(index).get('gaugeEnd').value?.toString()
    );

    this.dataSourceTemp.at(index).get('gaugeEnd').patchValue(gaugeEnd?.toLocaleString('en-US'));

    this.dataSourceTemp.at(index).get('quantityGauge').patchValue(gaugeEnd - gaugeStart);
  }

  calculateTotalMoney(index: number, isChip: boolean): void {
    const isElectronicEndChanged = this.dataSourceForm.at(index).get('electronicEnd').pristine;

    const electronicEnd: string = this.dataSourceForm.at(index).get('electronicEnd').value;

		const electronicStart: number = convertMoney(
			this.dataSourceForm.at(index).get('electronicStart').value?.toString()
		);

    const dischargeE = this.dataSourceForm.at(index).get('dischargeE').value;

		const quantityElectronic = Number(electronicEnd) - electronicStart;

    const price: number = convertMoney(
      this.dataSourceForm.at(index).get('price').value?.toString()
    );

    const totalMoney = price * (quantityElectronic -  Number(dischargeE));
    // if (isElectronicEndChanged && this.hasChangeEndElectronicPermission && isChip || isChip && !this.hasChangeEndElectronicPermission) {
    //   totalMoney = price * (quantityTransaction -  Number(dischargeE));
    // } else {
    //   totalMoney = price * (quantityElectronic -  Number(dischargeE));
    // }

    const provisionalMoney: number = convertMoney(
      this.dataSourceForm.at(index).get('provisionalMoney').value?.toString()
    );
    const limitMoney: number = convertMoney(
      this.dataSourceForm.at(index).get('limitMoney').value?.toString()
    );
    const totalPoint: number = convertMoney(
      this.dataSourceForm.at(index).get('totalPoint').value?.toString()
    );
    const cashMoney: number = totalMoney - provisionalMoney - limitMoney - totalPoint;

    if (!isChip) {
      this.dataSourceTemp.at(index).get('quantityTransaction').patchValue(quantityElectronic?.toLocaleString('en-US'));
    }

    this.dataSourceTemp.at(index).patchValue({
      totalMoney: totalMoney > 0 ? totalMoney?.toLocaleString('en-US') : 0,
      cashMoney: cashMoney > 0 ? cashMoney?.toLocaleString('en-US') : 0,
      quantityElectronic: quantityElectronic?.toLocaleString('en-US'),
      electronicEnd,
      dischargeE
    })

    this.sumCashMoney = 0;
    this.sumTotalMoney = 0;
    for (let i = 0; i < this.dataSourceForm.value.length; i++) {
      this.sumCashMoney += convertMoney(this.dataSourceForm.value[i].cashMoney?.toString());
      this.sumTotalMoney += convertMoney(this.dataSourceForm.value[i].totalMoney?.toString());
    }
	}

	onSubmit() {
		this.dataSourceForm = this.dataSourceTemp;
		this.dataSourceForm.markAllAsTouched();
		if (this.dataSourceForm.invalid) {
			return null;
		}

		const dataReq = this.dataSourceForm.getRawValue().map((d) => ({
			code: d.code,
			gaugeEnd: convertMoney(d.gaugeEnd?.toString()),
			electronicEnd: Number(d.electronicEnd),
      stationId: d.stationId,
      totalLiter: d.totalLiter,
      limitMoney: d.limitMoney,
      totalPoint: d.totalPoint,
      totalMoney: convertMoney(d.totalMoney?.toString()),
      quantityElectronic: convertMoney(d.quantityElectronic?.toString()),
      quantityGauge: d.quantityGauge,
      dischargeE: Number(d.dischargeE),
      cashMoney: convertMoney(d.cashMoney?.toString()),
      quantityTransaction: convertMoney(d.quantityTransaction?.toString()),
		}));

    const data = { productOilInfos: dataReq };

		this.shiftService.updateFuelProductRevenue(this.lockShiftId, data, this.hasChangeEndElectronicPermission, this.dataItem?.chip).subscribe(
			(res) => {
				this.checkRes(res);
			},
			(error: IError) => this.checkError(error)
		);
	}

  nextStep() {
    this.shiftService.setCurrentStep(2);
    this.stepSubmitted.emit();
  }

  checkRes(res) {
    if (res.data) {
      this.toastr.success('Lưu thông tin thành công');
      this.shiftService.setCurrentStep(2);
      this.stepSubmitted.emit();
    }
  }

	checkError(error: IError) {
		if (error?.code === 'SUN-OIL-4894') {
			this.toastr.error('Không tồn tại ca cần chốt.');
		}
	}
}
