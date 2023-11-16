import {Component, EventEmitter, Input, LOCALE_ID, OnInit, Output} from '@angular/core';
import * as moment from "moment";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {FormControl} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DatePickerComponent implements OnInit {

  @Output() date2: EventEmitter<any> = new EventEmitter<any>();
  @Output() dateOnInput: EventEmitter<any> = new EventEmitter<any>();

  @Input() isInvalid: boolean
  @Input() message: string

  date = new FormControl('');


  constructor() { }

  ngOnInit() {
  }
  onInputChange(event: any) {
    this.dateOnInput.emit(moment(event.target.value, 'DD/MM/YYYY'))
  }

  change(dateEvent) {
    this.date2.emit(dateEvent.value)
  }
}
