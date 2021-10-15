import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IEmployeeByIdStation, ShiftService } from '../../shift.service';
import * as moment from 'moment';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IError } from '../../../../shared/models/error.model';

@Component({
	selector: 'app-delete-calendar-all',
	templateUrl: './delete-calendar-all.component.html',
	providers: [DestroyService, FormBuilder]
})
export class DeleteCalendarAllComponent implements OnInit {
	@ViewChild('btnSave', { static: true }) btnSave: ElementRef;
	@Input() data: IDataTransfer;

	currentDate = new Date();
	minDate: NgbDateStruct = {
		day: this.currentDate.getDate(),
		month: this.currentDate.getMonth() + 1,
		year: this.currentDate.getFullYear()
	};

	listEmployee: Array<IEmployeeByIdStation> = [];
	today: string;
	formConfirmDelete: FormGroup;

	constructor(
		public modal: NgbActiveModal,
		private destroy$: DestroyService,
		private cdr: ChangeDetectorRef,
		private fb: FormBuilder,
		private toastr: ToastrService,
		private shiftService: ShiftService
	) {
		this.today = moment().format('DD/MM/YYYY');
	}

	ngOnInit(): void {
		this.shiftService.getListEmployee(this.data.stationId).subscribe((res) => {
			this.listEmployee = res.data;
			this.cdr.detectChanges();
		});

		this.buildForm();
		this.initDate();
		this.onSubmit();
	}

	initDate() {
		this.formConfirmDelete.get('timeStart').patchValue(this.today);
		this.formConfirmDelete.get('timeEnd').patchValue(this.today);
	}

	buildForm() {
		this.formConfirmDelete = this.fb.group({
			timeStart: [],
			timeEnd: [],
			employeeIds: ['', Validators.required]
		});
	}

	onClose() {
		this.modal.close();
	}

	onSubmit(): void {
		fromEvent(this.btnSave.nativeElement, 'click')
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				this.formConfirmDelete.markAllAsTouched();
				if (this.formConfirmDelete.invalid) {
					return;
				}

				this.shiftService.deleteCalendarAll(this.formConfirmDelete.value).subscribe(
					() => {
						this.modal.close(true);
					},
					(error: IError) => {
						this.checkError(error);
					}
				);
			});
	}

	checkError(error: IError) {
    if (error.code === 'SUN-OIL-4874') {
      this.toastr.error('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ')
    }
      if (error.code === 'SUN-OIL-4960') {
      this.toastr.error('Nhân viên chưa có lịch làm việc')
    }
	}
}

export interface IDataTransfer {
	title: string;
  stationId: number;
}
