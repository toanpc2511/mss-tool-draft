import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IShiftConfig, ShiftService } from '../shift.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import * as moment from 'moment';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { LIST_DAY_OF_WEEK, TYPE_LOOP } from '../../../shared/data-enum/list-status';
import { convertTimeToString } from '../../../shared/helpers/functions';

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
  today: string;
  typeLoop = TYPE_LOOP;
  listDayOfWeek = LIST_DAY_OF_WEEK;
  listOffTime;

  currentDate = new Date();
  minDate: NgbDateStruct = {
    day: this.currentDate.getDate(),
    month: this.currentDate.getMonth() + 1,
    year: this.currentDate.getFullYear()
  };

  listDay = [];

  assignFormArray: FormArray;


  constructor(
    public modal: NgbActiveModal,
    private shiftService: ShiftService,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastr: ToastrService,
    ) {
    this.today = moment().format('DD/MM/YYYY');
  }

  ngOnInit(): void {
    this.shiftService.getListShiftConfig().subscribe((res) => {
      this.dataShiftConfig = res.data;
      console.log(this.dataShiftConfig);
      this.cdr.detectChanges();
    });

    this.buildForm();
    this.initDate();
    this.onSubmit();
  }

  buildForm() {
    this.calenderForm = this.fb.group({
      shiftId: ['', Validators.required],
      startAt: [],
      endAt: [],
      type: ['NO_LOOP'],
      employee: this.fb.array([
        this.fb.group({
          employeeId: ['', Validators.required],
          pumpPoles: ['', Validators.required],
          shifOff: ['', Validators.required]
        })
      ])
    })

    this.assignFormArray = this.calenderForm.get('employee') as FormArray;
    this.cdr.detectChanges();
  }

  addDay(item: any) {
    this.listDay.push(item);
    console.log(this.listDay);
  }

  initDate() {
    this.calenderForm.get('startAt').patchValue(this.today);
    this.calenderForm.get('endAt').patchValue(this.today);
  }

  getListOffTime() {
    this.shiftService.getListOffTime(this.calenderForm.get('shiftId').value).subscribe((res) => {
      this.listOffTime = res.data;
      this.cdr.detectChanges();
    });
  }

  shiftConfigChange($event) {
    this.assignFormArray.reset();
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

        console.log(this.calenderForm.value);
      });
  }

  onClose() {
    // this.modal.close();
    console.log(this.assignFormArray.controls);
  }

  deleteItem(index: number): void {
    this.assignFormArray.removeAt(index);
  }

  addItem() {
    this.assignFormArray.push(
      this.fb.group({
        employeeId: ['', Validators.required],
        pumpPoles: ['', Validators.required],
        shifOff: ['', Validators.required]
      })
    );
  }

  checkError(error: IError) {
    this.toastr.error(error.code);
  }

}

export interface IDataTransfer {
  title: string;
}
