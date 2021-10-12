import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import {
  IDataEventCalendar,
  IEmployeeByIdStation,
  IInfoCalendarEmployee,
  IShiftConfig,
  ShiftService
} from '../shift.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import * as moment from 'moment';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { LIST_DAY_OF_WEEK, TYPE_LOOP } from '../../../shared/data-enum/list-status';
import { convertDateToServer, convertTimeToString } from '../../../shared/helpers/functions';
import { GasStationService, IPumpPole } from '../../gas-station/gas-station.service';

@Component({
	selector: 'app-create-calendar-modal',
	templateUrl: './create-calendar-modal.component.html',
	styleUrls: ['./create-calendar-modal.component.scss'],
	providers: [DestroyService, FormBuilder]
})
export class CreateCalendarModalComponent implements OnInit {
	@ViewChild('btnSave', { static: true }) btnSave: ElementRef;
	@Input() data: IDataTransfer;

	dataShiftConfig: Array<IShiftConfig> = [];
	calenderForm: FormGroup;
	tomorrow: string;
	typeLoop = TYPE_LOOP;
	listDayOfWeek = LIST_DAY_OF_WEEK;
	selectedDayOfWeek: { name: string; type: string }[] = [];
	listOffTime;
	gasStationId = 5119;
	listPumpPole: Array<IPumpPole> = [];
	listEmployee: Array<IEmployeeByIdStation> = [];

	currentDate = new Date();
	minDate: NgbDateStruct = {
		day: this.currentDate.getDate() + 1,
		month: this.currentDate.getMonth() + 1,
		year: this.currentDate.getFullYear()
	};

	listDay = [];

	assignFormArray: FormArray;

	constructor(
		public modal: NgbActiveModal,
		private shiftService: ShiftService,
		private gasStationService: GasStationService,
		private destroy$: DestroyService,
		private cdr: ChangeDetectorRef,
		private fb: FormBuilder,
		private toastr: ToastrService
	) {
		this.tomorrow = moment().add(1, 'days').format('DD/MM/YYYY');
	}

	ngOnInit(): void {
		this.shiftService.getListShiftConfig().subscribe((res) => {
			this.dataShiftConfig = res.data;
			this.cdr.detectChanges();
		});

		this.gasStationService.getPumpPolesByGasStation(this.gasStationId).subscribe((res) => {
			this.listPumpPole = res.data;
			this.cdr.detectChanges();
		});

		this.shiftService.getListEmployee(this.gasStationId).subscribe((res) => {
			this.listEmployee = res.data;
			this.cdr.detectChanges();
		});

		this.buildForm();
		this.initDate();
		this.onSubmit();
	}

	buildForm() {
    if (this.data.dataEventCalendar) {
      this.calenderForm = this.fb.group({
        shiftId: ['', Validators.required],
        startDate: [],
        endDate: [],
        employeeId: [this.data.dataEventCalendar.extendedProps.employeeId, Validators.required],
        pumpPoles: [this.getListIdPumpPoles(), Validators.required],
        shiftOffIds: [this.getListIdShiftOff(), Validators.required],
        type: ['DONT_REPEAT'],
      });
    } else {
      this.calenderForm = this.fb.group({
        shiftId: ['', Validators.required],
        startDate: [],
        endDate: [],
        type: ['DONT_REPEAT'],
        employee: this.fb.array([
          this.fb.group({
            employeeId: [null, Validators.required],
            pumpPoles: ['', Validators.required],
            shiftOffIds: ['', Validators.required]
          })
        ])
      });

      this.assignFormArray = this.calenderForm.get('employee') as FormArray;
    }
		this.cdr.detectChanges();
	}

  getListIdPumpPoles() {
    return this.data.dataEventCalendar.extendedProps.pumpPoles.map(x => x.id)
  }

  getListIdShiftOff() {
    return this.data.dataEventCalendar.extendedProps.offTimes?.map(x => x.id)
  }

	changeCheck({ name, type }: { name: string; type: string }) {
		const idx = this.selectedDayOfWeek.findIndex((d) => d.type === type);
		if (idx >= 0) {
			this.selectedDayOfWeek = [...this.selectedDayOfWeek].filter((d, index) => index !== idx);
		} else {
			this.selectedDayOfWeek = [...this.selectedDayOfWeek, { name, type }];
		}
	}

	initDate() {
    if (this.data.dataEventCalendar) {
      this.calenderForm.get('startDate').patchValue(moment(this.data.dataEventCalendar.start).format('DD/MM/YYYY'));
      this.calenderForm.get('endDate').patchValue(moment(this.data.dataEventCalendar.start).format('DD/MM/YYYY'));
    } else {
      this.calenderForm.get('startDate').patchValue(this.tomorrow);
      this.calenderForm.get('endDate').patchValue(this.tomorrow);
    }
	}

	getListOffTime() {
		this.shiftService.getListOffTime(this.calenderForm.get('shiftId').value).subscribe((res) => {
			this.listOffTime = res.data;
			this.cdr.detectChanges();
		});
	}

	shiftConfigChange() {
    if (this.data.dataEventCalendar) {
      this.calenderForm.get('shiftOffIds').patchValue('');
    } else {
      this.assignFormArray.reset();
    }
    this.getListOffTime();
  }

	formatTime(hour: number, minute: number) {
		return convertTimeToString(hour, minute);
	}

	onSubmit(): void {
		fromEvent(this.btnSave.nativeElement, 'click')
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.calenderForm.markAllAsTouched();
				if (this.calenderForm.invalid) {
					return;
				}

        if (this.data.dataEventCalendar) {
          const req = {
            shiftId: Number(this.calenderForm.get('shiftId').value),
            startDate: convertDateToServer(this.calenderForm.get('startDate').value),
            endDate: convertDateToServer(this.calenderForm.get('endDate').value),
            type: this.calenderForm.get('type').value,
            stationId: Number(this.gasStationId),
            employee: Number(this.calenderForm.get('employee').value),
            days: this.selectedDayOfWeek.map((d) => d.type)
          };

          this.calenderForm.get('type').value !== 'WEEKLY' ? delete req.days : req;

          this.shiftService.createShiftOffTime(req).subscribe(
            () => {
              this.modal.close(true);
            },
            (error: IError) => {
              this.checkError(error);
            }
          );
        } else {
          const employeeData: Array<IInfoCalendarEmployee> = (
            this.calenderForm.value.employee as Array<IInfoCalendarEmployee>
          ).map((p) => ({ ...p, employeeId: Number(p.employeeId) }));

          const req = {
            shiftId: Number(this.calenderForm.get('shiftId').value),
            startDate: convertDateToServer(this.calenderForm.get('startDate').value),
            endDate: convertDateToServer(this.calenderForm.get('endDate').value),
            type: this.calenderForm.get('type').value,
            stationId: Number(this.gasStationId),
            employee: employeeData,
            days: this.selectedDayOfWeek.map((d) => d.type)
          };

          this.calenderForm.get('type').value !== 'WEEKLY' ? delete req.days : req;

          this.shiftService.createShiftOffTime(req).subscribe(
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

	onClose() {
		// this.modal.close();
    console.log(this.data.dataEventCalendar.extendedProps.employeeId);
	}

	deleteItem(index: number): void {
		this.assignFormArray.removeAt(index);
	}

	addItem() {
		this.assignFormArray.push(
			this.fb.group({
				employeeId: [null, Validators.required],
				pumpPoles: ['', Validators.required],
				shiftOffIds: ['', Validators.required]
			})
		);
	}

	checkError(error: IError) {
		this.toastr.error(error.code);
	}
}

export interface IDataTransfer {
	title: string;
  dataEventCalendar: IDataEventCalendar;
}
