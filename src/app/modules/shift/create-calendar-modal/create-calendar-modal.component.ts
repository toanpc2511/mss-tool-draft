import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IShiftConfig, ShiftService } from '../shift.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DestroyService } from '../../../shared/services/destroy.service';
import * as moment from 'moment';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IError } from '../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';

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
      this.cdr.detectChanges();
    });
    this.buildForm();
    this.initDate();
    this.onSubmit();
  }

  buildForm() {
    this.calenderForm = this.fb.group({
      nameCalender: ['', Validators.required],
      startAt: [],
      endAt: []
    })
  }

  initDate() {
    this.calenderForm.get('startAt').patchValue(this.today);
    this.calenderForm.get('endAt').patchValue(this.today);
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
    this.modal.close();
  }

  addItem() {
    console.log('Add');
  }

  checkError(error: IError) {
    this.toastr.error(error.code);
  }

}

export interface IDataTransfer {
  title: string;
}
