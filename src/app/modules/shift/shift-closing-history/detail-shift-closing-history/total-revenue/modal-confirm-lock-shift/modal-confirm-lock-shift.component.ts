import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../../../../shared/services/destroy.service';
import { Router } from '@angular/router';
import {
	IEmployeeMoneyRevenues,
	IOffTimes,
	IShiftConfig,
	ShiftService
} from '../../../../shift.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { IError } from '../../../../../../shared/models/error.model';
import * as moment from 'moment';
import { IPumpPole } from '../../../../../gas-station/gas-station.service';

@Component({
	selector: 'app-modal-confirm-lock-shift',
	templateUrl: './modal-confirm-lock-shift.component.html',
	styleUrls: ['./modal-confirm-lock-shift.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class ModalConfirmLockShiftComponent implements OnInit {
	@ViewChild('btnSave', { static: true }) btnSave: ElementRef;
	@Input() data: IDataTransfer;
	listShifts: IShiftConfig[] = [];
	confirmForm: FormGroup;
	today: string;
	dataSource: FormArray = new FormArray([]);
	dataSourceTemp: FormArray = new FormArray([]);
	isShiftLead = false;

	constructor(
		public modal: NgbActiveModal,
		private destroy$: DestroyService,
		private router: Router,
		private fb: FormBuilder,
		private shiftService: ShiftService,
		private toastr: ToastrService,
		private cdr: ChangeDetectorRef
	) {
		this.today = moment().format('YYYY-MM-DD');
	}

	ngOnInit(): void {
		this.shiftService.getListShiftConfig().subscribe((res) => {
			this.listShifts = res.data;
			this.cdr.detectChanges();
		});

		this.buildForm();

		this.confirmForm
			.get('shiftId')
			.valueChanges.pipe(debounceTime(300), takeUntil(this.destroy$))
			.subscribe((value) => {
				if (value) {
					this.shiftService
						.getCalendarEmployeeInfos(value, this.data.stationId, this.today)
						.subscribe((res) => {
							this.dataSource = this.dataSourceTemp = this.convertToFormArray(res.data);
							this.cdr.detectChanges();
						});
				}
			});
		this.onSubmit();
	}

	buildForm() {
		this.confirmForm = this.fb.group({
			shiftId: ['', Validators.required]
		});
	}

	convertToFormArray(data): FormArray {
		const controls = data.map((d) => {
			return this.fb.group({
				name: [d.employeeName],
				id: [d.employeeId],
				pumpPole: [this.getListPumpPole(d.pumpPoleResponses)],
				offTimes: [this.getListTime(d.offTimes)]
			});
		});

		return this.fb.array(controls);
	}

	onClose() {
		this.modal.close();
	}

	onSubmit(): void {
		fromEvent(this.btnSave.nativeElement, 'click')
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.confirmForm.markAllAsTouched();
				if (this.confirmForm.invalid) {
					return;
				}

				this.dataSource.value.map((x) => {
					delete x.pumpPole;
					delete x.offTimes;
					x.id = Number(x.id);
				});

				this.data.listEmployee.map((x) => {
					delete x.moneyFromFuel;
					delete x.moneyFromOtherProduct;
					delete x.totalEmployeeMoney;
				});

				const dataReq = {
					lockShiftOldId: Number(this.data.lockShiftOldId),
					shiftId: Number(this.confirmForm.get('shiftId').value),
					stationId: Number(this.data.stationId),
					oldShiftEmployee: this.data.listEmployee,
					newShiftEmployee: this.dataSource.value,
          calendarId: ''
				};

				this.shiftService.confirmLockShift(dataReq).subscribe((res) => {
					if (res.data) {
						this.modal.close();
						this.router.navigate([`/ca-lam-viec/lich-su-chot-ca`]);
						this.toastr.success('Chốt ca thành công');
					}
				});
			});
	}

	changeShiftLead(index: number) {
		this.dataSource.value.map((x) => {
			x.shiftLead = this.isShiftLead;
		});
		this.dataSource.value[index].shiftLead = true;
	}

	checkError(error: IError) {
		this.toastr.error(error.code);
	}

	getListPumpPole(data: IPumpPole[]) {
		return data.map((x) => x.name).join(', ');
	}

	getListTime(data: IOffTimes[]) {
		return data
			.map(
				(x) =>
					`${x.start} ${x.typeStart === 'TO_DAY' ? '' : 'hôm sau'} - ${x.end} ${
						x.typeEnd === 'TO_DAY' ? '' : 'hôm sau'
					}`
			)
			.join(', ');
	}
}

export interface IDataTransfer {
	title: string;
	stationId: number;
	lockShiftOldId: number;
	listEmployee: [IEmployeeMoneyRevenues];
}
