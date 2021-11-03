import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IPromotionalRevenue, ShiftService } from '../../../shift.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { convertMoney } from '../../../../../shared/helpers/functions';
import { IError } from '../../../../../shared/models/error.model';

@Component({
	selector: 'app-promotion-detail',
	templateUrl: './promotion-detail.component.html',
	styleUrls: ['./promotion-detail.component.scss'],
	providers: [DestroyService]
})
export class PromotionDetailComponent implements OnInit {
  @Output() stepSubmitted = new EventEmitter();
  lockShiftId: number;
  dataSourceForm: FormArray = new FormArray([]);
  dataSourceTemp: FormArray = new FormArray([]);
  statusLockShift: string;
  dataSource: IPromotionalRevenue[] = [];

	constructor(
		private shiftService: ShiftService,
		private activeRoute: ActivatedRoute,
		private destroy$: DestroyService,
		private cdr: ChangeDetectorRef,
		private toastr: ToastrService,
		private fb: FormBuilder
	) {}

	ngOnInit(): void {
		this.activeRoute.params.subscribe((res) => {
			this.lockShiftId = res.lockShiftId;
		});

		this.activeRoute.queryParams.subscribe((x) => {
			this.statusLockShift = x.status;
		});

		this.shiftService
			.getPromotionalRevenue(this.lockShiftId)
			.pipe(
				tap((res) => {
					if (this.statusLockShift === 'CLOSE') {
						this.dataSource = res.data;
						this.cdr.detectChanges();
					} else {
						this.dataSourceForm = this.dataSourceTemp = this.convertToFormArray(res.data);
						this.cdr.detectChanges();
					}
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	convertToFormArray(data: IPromotionalRevenue[]): FormArray {
		const controls = data.map((d) => {
			return this.fb.group({
				actualInventoryQuantity: [d.actualInventoryQuantity, Validators.required],
				compensateQuantity: [d.compensateQuantity],
				exportQuantity: [{ value: d.exportQuantity, disabled: d.hasChip }, Validators.required],
				finalInventory: [d.finalInventory],
				hasChip: [d.hasChip],
				headInventory: [d.headInventory],
				importQuantity: [d.importQuantity, Validators.required],
				productName: [d.productName],
				unit: [d.unit],
				id: [d.id]
			});
		});

		return this.fb.array(controls);
	}

	totalScore(index: number) {
		const headInventory: number = convertMoney(
			this.dataSourceForm.at(index).get('headInventory').value.toString()
		);
		const valueImport: number = convertMoney(
			this.dataSourceForm.at(index).get('importQuantity').value.toString()
		);
		const valueExport: number = convertMoney(
			this.dataSourceForm.at(index).get('exportQuantity').value.toString()
		);
		const actualInventoryQuantity: number = convertMoney(
			this.dataSourceForm.at(index).get('actualInventoryQuantity').value.toString()
		);

		const finalInventory = headInventory + valueImport - valueExport;
		const compensateQuantity = finalInventory - actualInventoryQuantity;

		this.dataSourceTemp.at(index).get('finalInventory').patchValue(finalInventory);

		this.dataSourceTemp
			.at(index)
			.get('compensateQuantity')
			.patchValue(compensateQuantity < 0 ? 0 : compensateQuantity);
	}

	onSubmit() {
		this.dataSourceForm = this.dataSourceTemp;
		this.dataSourceForm.markAllAsTouched();
		if (this.dataSourceForm.invalid) {
			return null;
		}

		const dataReq = {
			lockShiftId: this.lockShiftId,
			promotionalRevenueRequests: this.dataSourceForm.getRawValue().map((d) => ({
				promotionalId: d.id,
				importQuantity: convertMoney(d.importQuantity.toString()),
				exportQuantity: convertMoney(d.exportQuantity.toString()),
				actualInventoryQuantity: convertMoney(d.actualInventoryQuantity.toString())
			}))
		};

		this.shiftService.updatePromotionalRevenue(dataReq).subscribe(
			(res) => {
				this.checkRes(res);
			},
			(error: IError) => this.checkError(error)
		);
	}

  nextStep() {
    this.shiftService.setCurrentStep(4);
    this.stepSubmitted.emit();
  }

  checkRes(res) {
    if (res.data) {
      this.toastr.success('Lưu thông tin thành công');
      this.shiftService.setCurrentStep(4);
      this.stepSubmitted.emit();
    }
  }

	checkError(error: IError) {
		if (error.code === 'SUN-OIL-4761') {
			this.toastr.error('Không được sửa ca làm việc không phải trạng thái chờ phê duyệt');
		}
	}
}
