import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import {
	convertTimeToString,
	getHours,
	getMinutes,
	IHour,
	IMinute
} from '../../../shared/helpers/functions';
import { combineLatest, fromEvent, Observable, of } from 'rxjs';
import { concatMap, debounceTime, startWith, takeUntil, tap } from 'rxjs/operators';
import { IShiftConfig, ITime, ShiftService } from '../shift.service';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-shift-work-config-modal',
	templateUrl: './shift-work-config-modal.component.html',
	styleUrls: ['./shift-work-config-modal.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class ShiftWorkConfigModalComponent implements OnInit {
	@ViewChild('btnSave', { static: true }) btnSave: ElementRef;
	@Input() data: IDataTransfer;

	hours: Array<IHour> = [];
	minutes: Array<IMinute> = [];
	configForm: FormGroup;
	timeBreakArray: FormArray;
	timeStart: string;
	timeEnd: string;
	valueTimeBreak: string;

	constructor(
		public modal: NgbActiveModal,
		private destroy$: DestroyService,
		private cdr: ChangeDetectorRef,
		private fb: FormBuilder,
		private toastr: ToastrService,
		private shiftService: ShiftService
	) {}

	ngOnInit(): void {
		this.buildForm();
		this.hours = getHours(48);
		this.minutes = getMinutes();
		this.combineShiftDetail();

		this.onSubmit();
	}

	buildForm() {
		const dataTransfer = this.data.shiftConfig;
		if (dataTransfer) {
			this.configForm = this.fb.group({
				nameShift: [dataTransfer.name],
				startHour: [this.customConvert(dataTransfer.startHour)],
				endHour: [this.customConvert(dataTransfer.endHour)],
				startMinute: [this.customConvert(dataTransfer.startMinute)],
				endMinute: [this.customConvert(dataTransfer.endMinute)],
				offTimes: this.fb.array([
					this.fb.group({
						startHour: [''],
						endHour: [''],
						startMinute: [''],
						endMinute: ['']
					})
				]),
				shiftDetail: [dataTransfer.description]
			});

			this.timeBreakArray = this.configForm.get('offTimes') as FormArray;

			this.data.shiftConfig.offTimes.forEach((time, i) => {
				if (i >= 1) {
					this.addItem();
				}

				this.timeBreakArray
					.at(i)
					.get('startHour')
					.patchValue(this.customConvert(dataTransfer.offTimes[i].startHour));
				this.timeBreakArray
					.at(i)
					.get('startMinute')
					.patchValue(this.customConvert(dataTransfer.offTimes[i].startMinute));
				this.timeBreakArray
					.at(i)
					.get('endHour')
					.patchValue(this.customConvert(dataTransfer.offTimes[i].endHour));
				this.timeBreakArray
					.at(i)
					.get('endMinute')
					.patchValue(this.customConvert(dataTransfer.offTimes[i].endMinute));
			});
		} else {
			this.configForm = this.fb.group({
				nameShift: [''],
				startHour: ['00'],
				endHour: ['00'],
				startMinute: ['00'],
				endMinute: ['00'],
				offTimes: this.fb.array([
					this.fb.group({
						startHour: ['00'],
						endHour: ['00'],
						startMinute: ['00'],
						endMinute: ['00']
					})
				]),
				shiftDetail: ['']
			});

			this.timeBreakArray = this.configForm.get('offTimes') as FormArray;
		}
		this.cdr.detectChanges();
	}

	customConvert(a: number) {
		return a < 10 ? `0${a}` : a;
	}

	combineShiftDetail() {
		const nameShift$ = this.configForm
			.get('nameShift')
			.valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

		const hourStart$ = this.configForm
			.get('startHour')
			.valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

		const minuteStart$ = this.configForm
			.get('startMinute')
			.valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

		const hourEnd$ = this.configForm
			.get('endHour')
			.valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

		const minuteEnd$ = this.configForm
			.get('endMinute')
			.valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

		const timeBreak$ = this.configForm
			.get('offTimes')
			.valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

		combineLatest([nameShift$, hourStart$, minuteStart$, hourEnd$, minuteEnd$, timeBreak$])
			.pipe(
				debounceTime(300),
				concatMap(([nameShift, startHour, minuteStart, endHour, minuteEnd]) =>
					of({
						nameShift,
						startHour,
						minuteStart,
						endHour,
						minuteEnd
					})
				),
				tap((data) => {
					const name: string = this.configForm.get('nameShift').value;
					const startHour = this.configForm.get('startHour').value;
					const startMinute = this.configForm.get('startMinute').value;
					const endHour = this.configForm.get('endHour').value;
					const endMinute = this.configForm.get('endMinute').value;
					const valueTimeBreak: string = this.getListTimeBreak(
						this.configForm.get('offTimes').value
					);

					this.timeStart = convertTimeToString(Number(startHour), Number(startMinute));
					this.timeEnd = convertTimeToString(Number(endHour), Number(endMinute));

					const shiftDetail = `${name} ( ${this.timeStart} - ${this.timeEnd}), Nghỉ (${valueTimeBreak})`;

					for (const control in this.configForm.controls) {
						this.configForm.controls[control].setErrors(null);
					}

					if (startHour > endHour || (startHour === endHour && startMinute > endMinute)) {
						this.configForm.get('startHour').setErrors({ existed: true });
						this.configForm.get('endHour').setErrors({ existed: true });
					}

					if (name === '') {
						this.configForm.get('nameShift').setErrors({ required: true });
					}

					this.configForm.get('shiftDetail').patchValue(shiftDetail);
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	getListTimeBreak(data: Array<ITime>) {
		return data
			.map(
				(x) =>
					`${convertTimeToString(
						Number(x.startHour),
						Number(x.startMinute)
					)} - ${convertTimeToString(Number(x.endHour), Number(x.endMinute))}`
			)
			.join(', ');
	}

	addItem() {
		this.timeBreakArray.push(
			this.fb.group({
				startHour: ['00'],
				endHour: ['00'],
				startMinute: ['00'],
				endMinute: ['00']
			})
		);
	}

	deleteItem(index: number): void {
		this.timeBreakArray.removeAt(index);
	}

	onClose() {
		this.modal.close();
	}

	onSubmit(): void {
		fromEvent(this.btnSave.nativeElement, 'click')
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.configForm.markAllAsTouched();
				if (this.configForm.invalid) {
					return;
				}

				const shiftConfigData = this.configForm.getRawValue();
				shiftConfigData.offTimes.map((x) => {
					x.startHour = Number(x.startHour);
					x.startMinute = Number(x.startMinute);
					x.endHour = Number(x.endHour);
					x.endMinute = Number(x.endMinute);
				});
				const req: any = {
					name: shiftConfigData.nameShift,
					description: shiftConfigData.shiftDetail,
					startHour: Number(shiftConfigData.startHour),
					startMinute: Number(shiftConfigData.startMinute),
					endHour: Number(shiftConfigData.endHour),
					endMinute: Number(shiftConfigData.endMinute),
					offTimes: shiftConfigData.offTimes
				};
				console.log(req);
				if (!this.data.shiftConfig) {
					this.shiftService.createShiftConfig(req).subscribe(
						() => {
							this.modal.close(true);
						},
						(error: IError) => {
							this.checkError(error);
						}
					);
				} else {
					this.shiftService.updateShiftConfig(this.data.shiftConfig.id, req).subscribe(
						() => {
							this.modal.close(true);
						},
						(error: IError) => {
							this.checkError(error);
						}
					);
				}
			});
	}

	checkError(error: IError) {
		if (error.code === 'SUN-OIL-4740') {
			this.toastr.error('Cấu hình giờ ca làm việc bị trùng lặp');
		}
		if (error.code === 'SUN-OIL-4741') {
			this.toastr.error('Tên cấu hình ca không được để trống');
		}
		if (error.code === 'SUN-OIL-4739') {
			this.configForm.get('nameShift').setErrors({ existed: true });
		}
		if (error.code === 'SUN-OIL-4738') {
			this.toastr.error('Giờ bắt đầu nghỉ không được lớn hơn giờ kết thúc nghỉ');
		}
		if (error.code === 'SUN-OIL-4747') {
			this.toastr.error('Thời gian nghỉ chọn trong khoảng thời gian làm việc');
		}
		if (error.code === 'SUN-OIL-4749') {
			this.toastr.error('Thời gian bắt đầu nghỉ trùng');
		}
		if (error.code === 'SUN-OIL-4737') {
			this.configForm.get('startHour').setErrors({ startTime: true });
			this.configForm.get('endHour').setErrors({ startTime: true });
		}
	}
}

export interface IDataTransfer {
	title: string;
	shiftConfig?: IShiftConfig;
}
