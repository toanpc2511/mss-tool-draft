import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import { convertTimeToString, getHours, getMinutes, IHour, IMinute } from '../../../shared/helpers/functions';
import { combineLatest, fromEvent, Observable, of } from 'rxjs';
import { concatMap, debounceTime, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-shift-work-config-modal',
  templateUrl: './shift-work-config-modal.component.html',
  styleUrls: ['./shift-work-config-modal.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class ShiftWorkConfigModalComponent implements OnInit {
  @ViewChild('btnSave', { static: true }) btnSave: ElementRef;
  @Input() data: IDataTransfer;

  shifts: Array<any> = [
    {
      id: 1,
      name: 'Ca sáng'
    },
    {
      id: 2,
      name: 'Ca đêm'
    },
    {
      id: 3,
      name: 'Ca ngày'
    },
    {
      id: 4,
      name: 'Ca gãy'
    },
  ]
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
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.hours = getHours(48);
    this.minutes = getMinutes();

    this.combineShiftDetail();

    this.onSubmit();
  }

  buildForm() {
    this.configForm = this.fb.group({
      nameShift: ['', Validators.required],
      hourStart: ['00'],
      hourEnd: ['00'],
      minutesStart: ['00'],
      minutesEnd: ['00'],
      timeBreak: this.fb.array([
        this.fb.group({
          hourStart: ['00'],
          hourEnd: ['00'],
          minutesStart: ['00'],
          minutesEnd: ['00']
        })
      ]),
      shiftDetail: ['']
    })

    this.timeBreakArray = this.configForm.get('timeBreak') as FormArray;
    this.cdr.detectChanges();
  }

  combineShiftDetail() {
    const nameShift$ = this.configForm
      .get('nameShift')
      .valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

    const hourStart$ = this.configForm
      .get('hourStart')
      .valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

    const minuteStart$ = this.configForm
      .get('minutesStart')
      .valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

    const hourEnd$ = this.configForm
      .get('hourEnd')
      .valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

    const minuteEnd$ = this.configForm
      .get('minutesEnd')
      .valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

    const timeBreak$ = this.configForm
      .get('timeBreak')
      .valueChanges.pipe(startWith(''), takeUntil(this.destroy$)) as Observable<number>;

    combineLatest([nameShift$, hourStart$, minuteStart$, hourEnd$, minuteEnd$, timeBreak$])
      .pipe(
        debounceTime(300),
        concatMap(([nameShift, hourStart, minuteStart, hourEnd, minuteEnd]) =>
          of({
            nameShift,
            hourStart,
            minuteStart,
            hourEnd,
            minuteEnd
          })
        ),
        tap((data) => {
          const name: string = this.configForm.get('nameShift').value;
          const hourStart: number = this.configForm.get('hourStart').value;
          const minutesStart: number = this.configForm.get('minutesStart').value;
          const hourEnd: number = this.configForm.get('hourEnd').value;
          const minutesEnd: number = this.configForm.get('minutesEnd').value;
          const valueTimeBreak: string = this.getListTimeBreak(this.configForm.get('timeBreak').value);

          this.timeStart = convertTimeToString(hourStart, minutesStart);
          this.timeEnd = convertTimeToString(hourEnd, minutesEnd);

          const shiftDetail = `${name} ( ${this.timeStart} - ${this.timeEnd}), Nghỉ (${valueTimeBreak})`;

          for (const control in this.configForm.controls) {
            this.configForm.controls[control].setErrors(null);
          }

          if (hourStart > hourEnd) {
            this.configForm.get('hourStart').setErrors({existed: true});
            this.configForm.get('hourEnd').setErrors({existed: true});
          }

          this.configForm.get('shiftDetail').patchValue(shiftDetail);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getListTimeBreak(data: any) {
    return data.map((x) => `${convertTimeToString(x.hourStart, x.minutesStart)} - ${convertTimeToString(x.hourEnd, x.minutesEnd)}`).join(', ');
  }

  addItem() {
    this.timeBreakArray.push(
      this.fb.group({
        hourStart: ['00'],
        hourEnd: ['00'],
        minutesStart: ['00'],
        minutesEnd: ['00']
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
        console.log(this.configForm.getRawValue())
      });
  }
}

export interface IDataTransfer {
  title: string;
  shiftConfig?: any;
}
