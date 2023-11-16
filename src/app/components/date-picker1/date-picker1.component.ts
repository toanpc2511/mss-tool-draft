import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {MY_FORMATS} from '../../_datepicker/date-picker.component';
import {FormControl} from '@angular/forms';
import * as moment from 'moment';
declare var $ : any
@Component({
  selector: 'app-date-picker1',
  templateUrl: './date-picker1.component.html',
  styleUrls: ['./date-picker1.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DatePicker1Component implements OnInit {
  @Output() date2: EventEmitter<any> = new EventEmitter<any>();
  @Output() dateOnInput: EventEmitter<any> = new EventEmitter<any>();

  @Input() isInvalid: boolean
  @Input() isTouched: boolean
  @Input() message: string
  @Input() date: string
  @Input() disable: boolean = false
  constructor() { }

  ngOnInit(): void {
  }
  onInputChange(event: any) {
    this.dateOnInput.emit(moment(event.target.value, 'DD/MM/YYYY'))
  }

  change(dateEvent) {
    this.date2.emit(dateEvent.value)
  }
  getDisable() {
    if (this.disable == true) {
      $('.main-visa-input .main-input').val("");
    }
    return this.disable
  }
}
