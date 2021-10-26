import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DestroyService } from '../../../../../../shared/services/destroy.service';
import { Router } from '@angular/router';
import { IShiftConfig, ShiftService } from '../../../../shift.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { IError } from '../../../../../../shared/models/error.model';
import * as moment from 'moment';

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
  shiftId: number;
  today: string;
  dataSource: FormArray = new FormArray([]);
  dataSourceTemp: FormArray = new FormArray([]);

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
    this.shiftService.getListShiftConfig()
      .subscribe((res) => {
        this.listShifts = res.data;
        this.cdr.detectChanges();
      })

    this.buildForm();

    this.confirmForm.get('shiftId').valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.shiftService.getCalendarEmployeeInfos(value, this.data.stationId, this.today)
            .subscribe((res) => {
              this.dataSource = this.dataSourceTemp = this.convertToFormArray(res.data);
              this.cdr.detectChanges();
            })
        }
      })
    this.onSubmit();
  }

  buildForm() {
    this.confirmForm = this.fb.group({
      shiftId: ['', Validators.required]
    })
  }

  convertToFormArray(data): FormArray {
    const controls = data.map((d) => {
      return this.fb.group({
        employeeName: [d.employeeName],
        pumpPole: [this.getListPumpPole(d.pumpPoleResponses)],
        offTimes: [this.getListTime(d.offTimes)],
        shiftLead: ['']
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
        this.dataSource = this.dataSourceTemp;
        this.dataSource.getRawValue().map((x) => {
          console.log(x);
        })
      });
  }

  checkError(error: IError) {
    this.toastr.error(error.code);
  }

  getListPumpPole(data) {
    return data.map((x) => x.name).join(', ')
  }

  getListTime(data) {
    return data.map((x) => `${x.start} - ${x.end}`).join(', ')
  }

}

export interface IDataTransfer {
  title: string;
  stationId: number;
}
