import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import { getHours, getMinutes, IHour, IMinute } from '../../../shared/helpers/functions';
import { combineLatest, fromEvent, Observable, of } from 'rxjs';
import { concatMap, debounceTime, startWith, takeUntil, tap } from 'rxjs/operators';
import { log } from 'util';

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
      nameShift: ['1', Validators.required],
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
      .valueChanges.pipe(startWith(1), takeUntil(this.destroy$)) as Observable<number>;

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

    // this.configForm.get('timeBreak').valueChanges

    this.configForm.get('timeBreak').valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.getListTimeBreak(value);
        this.cdr.detectChanges();
      });

    combineLatest([nameShift$, hourStart$, minuteStart$, hourEnd$, minuteEnd$])
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
          const name: string = this.shifts.find((p) => p.id === Number(data.nameShift))?.name;
          const hourStart: string = this.configForm.get('hourStart').value;
          const minutesStart: string = this.configForm.get('minutesStart').value;
          const hourEnd: string = this.configForm.get('hourEnd').value;
          const minutesEnd: string = this.configForm.get('minutesEnd').value;
          const isHour = Number(data.hourEnd) < 24;

          this.timeStart = `${hourStart}:${minutesStart}`;
          this.timeEnd = `${isHour ? hourEnd : Number(hourEnd) - 24 }:${minutesEnd} ${!isHour?'hôm sau':''}`;

          const shiftDetail = `${name} (${this.timeStart} - ${this.timeEnd})`;

          this.configForm.get('shiftDetail').patchValue(shiftDetail);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getListTimeBreak(data: any) {
    // const valuePromotion = item.promotionProducts
    //   ?.map((x) => `${x.quantity.toLocaleString('en-US')} ${x.productName}`)
    //   .join(' + ');
    // item.listPromotion = valuePromotion;
    // return valuePromotion;
    const valueList = data.map((x) => x.hourEnd)
    console.log(valueList);
    return valueList;
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
    // this.modal.close();
    console.log(this.configForm.get('timeBreak').value);
  }

  onSubmit(): void {
    fromEvent(this.btnSave.nativeElement, 'click')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.configForm.markAllAsTouched();
        if (this.configForm.invalid || this.configForm.invalid) {
          return;
        }
        console.log(this.configForm.value);
      });
  }
}

export interface IDataTransfer {
  title: string;
  shiftConfig?: any;
}
