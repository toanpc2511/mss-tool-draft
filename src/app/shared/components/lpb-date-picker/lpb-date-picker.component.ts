import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_MAT_DATE_FORMATS } from '../../constants/utils';
import { DateAdapterService } from '../../services/date.adapter.service';
import * as moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-lpb-date-picker',
  templateUrl: './lpb-date-picker.component.html',
  styleUrls: ['./lpb-date-picker.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: DateAdapterService},
    {provide: MAT_DATE_FORMATS, useValue: CUSTOM_MAT_DATE_FORMATS}
  ]
})
export class LpbDatePickerComponent implements OnInit {

  @ViewChild('matDatePicker', { static: false }) matDatePicker: MatDatepicker<Date>;
  @ViewChild('txtMainInput', { static: true }) txtMainInput: ElementRef;
  @ViewChild('txtHiddenInput', { static: true }) txtHiddenInput: ElementRef;
  @Input() placeholder = 'DD/MM/YYYY';
  isValid = false;
  errorMsg = '';
  minYear = 1000;
  maxYear = 3000;
  isClick = false;
  isDisable = false;

  @Input() minDate: any = null;
  @Input() maxDate: any = null;
  @Output() dateChanged = new EventEmitter<any>();
  @Output() blurInput = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  /** Bật calendar khi click vào icon
   *
   */
  openDatePicker(): void {
    // console.log('openDatePicker()');
    if (this.isValid) {
      this.matDatePicker.select(moment(this.txtMainInput.nativeElement.value, 'DD/MM/YYYY').toDate());
    } else {
      this.matDatePicker.select(null);
    }
    this.matDatePicker.open();
  }

  txtMainInputKeydown(event): void {
    // tslint:disable-next-line:prefer-const
    let input = this.txtMainInput.nativeElement;
    // tslint:disable-next-line:prefer-const
    let key = event.keyCode || event.which;
    if (key <= 46) { // kí tự điều khiển
    } else if (key === 191) { // slash
      // tslint:disable-next-line:prefer-const
      let oldValue = input.value;
      if (!oldValue) { // nếu chưa có gì thì không cho nhập slash
        event.preventDefault();
      } else if (oldValue.endsWith('/') && this.isCursorEnd(input)) { // không cho nhập 2 kí tự slash liên tiếp
        event.preventDefault();
      } else if (oldValue.split('/').length >= 3) { // nếu có 2 kí tự slash rồi thì không cho nhập slash nữa
        event.preventDefault();
      }
    } else if (key < 48 || (key > 57 && key < 96) || key > 105) { // not a number
      event.preventDefault();
    } else { // number
    }
  }

  txtMainInputKeyup(event): void {
    // tslint:disable-next-line:prefer-const
    let input = this.txtMainInput.nativeElement;
    // tslint:disable-next-line:prefer-const
    let key = event.keyCode || event.which;
    if (key <= 46) { // kí tự điều khiển
    } else if (key === 191) { // slash
    } else if (key < 48 || (key > 57 && key < 96) || key > 105) { // not a number
    } else { // is a number
      // tslint:disable-next-line:prefer-const
      let value = input.value;
      // tslint:disable-next-line:prefer-const
      let parts = value.split('/');
      // tslint:disable-next-line:prefer-const
      let slashCount = parts.length - 1;
      if (slashCount === 0) { // đang nhập ngày
        // tslint:disable-next-line:prefer-const
        let day = parts[0];
        if (day.length === 2) {
          input.value += '/';
        } else if (day.length === 1 && Number(day) > 3) {
          input.value += '/';
        }
      } else if (slashCount === 1 && this.isCursorEnd(input)) { // đang nhập tháng
        // tslint:disable-next-line:prefer-const
        let month = parts[1];
        if (month.length === 2) {
          input.value += '/';
        } else if (month.length === 1 && Number(month) > 1) {
          input.value += '/';
        }
      } else if (slashCount === 2 && parts[2].length > 4) { // độ dài năm lớn hơn 4 thì cắt đi
        input.value = parts[0] + '/' + parts[1] + '/' + parts[2].substring(0, 4);
      }
    }
  }

  txtMainInputChange(): void {
    // console.log('txtMainInputChange()');
    this.checkValid();
    // console.log('isValid: ' + this.isValid);
    // tslint:disable-next-line:prefer-const
    let value = this.txtMainInput.nativeElement.value;
    if (this.isValid && value.length < 10) {
      // console.log('auto format date');
      // tslint:disable-next-line:prefer-const
      let parts = value.split('/');
      this.txtMainInput.nativeElement.value = parts[0].padStart(2, '0') + '/' + parts[1].padStart(2, '0') + '/' + parts[2].padStart(4, '0');
    }
    this.dateChanged.emit();
  }

  /** Gán giá trị mặc định cho ô input lịch
   *
   * @param d : Giá trị ngày truyền vào
   */
  setSelectedDate(d): void {
    // console.log('setSelectedDate: ' + d);
    if (d) {
      this.txtMainInput.nativeElement.value = moment(d).format('DD/MM/YYYY');
      this.isValid = true;
    } else {
      this.txtMainInput.nativeElement.value = '';
      this.isValid = false;
    }
  }

  getSelectedDate(): any {
    if (!this.isValid) {
      return null;
    } else {
      return moment(this.txtMainInput.nativeElement.value, 'DD/MM/YYYY').toDate();
    }
  }

  getValue(): any {
    return this.txtMainInput.nativeElement.value;
  }

  setValue(value): void {
    this.txtMainInput.nativeElement.value = value;
    this.txtMainInputChange();
  }

  focus(): void {
    this.txtMainInput.nativeElement.focus();
  }

  private isCursorEnd(input): any {
    // tslint:disable-next-line:prefer-const
    let length = input && input.value ? input.value.length : 0;
    // tslint:disable-next-line:prefer-const
    let selectionStart = input ? input.selectionStart : 0;
    return selectionStart === length;
  }

  private checkValid(): void {
    // tslint:disable-next-line:prefer-const
    let value = this.txtMainInput.nativeElement.value;
    if (!value) {
      this.isValid = false;
      return;
    }
    // tslint:disable-next-line:prefer-const
    let parts = value.split('/');
    if (parts.length !== 3) {
      this.isValid = false;
      return;
    }
    // tslint:disable-next-line:prefer-const
    let day = parts[0];
    // tslint:disable-next-line:prefer-const
    let month = parts[1];
    // tslint:disable-next-line:prefer-const
    let year = parts[2];
    if (!day || !month || !year || year.length < 4 || Number(year) < this.minYear || Number(year) > this.maxYear) {
      this.isValid = false;
      return;
    }
    // tslint:disable-next-line:prefer-const
    let m = moment(value, 'DD/MM/YYYY');
    if (!m || !m.isValid()) {
      this.isValid = false;
      return;
    }

    if (this.minDate && m.isBefore(this.minDate, 'day')) {
      this.isValid = false;
      return;
    }

    if (this.maxDate && m.isAfter(this.maxDate, 'day')) {
      this.isValid = false;
      return;
    }

    this.isValid = true;
  }

  // tslint:disable-next-line:typedef
  datePickerChange(evt) {
    // console.log(evt);
    const selectedDate = evt.value;
    if (selectedDate && this.txtMainInput.nativeElement.value !== this.txtHiddenInput.nativeElement.value) {
      this.txtMainInput.nativeElement.value = moment(selectedDate).format('DD/MM/YYYY');
      this.checkValid();
      this.dateChanged.emit();
    }
  }

  haveValue(): any {
    return this.txtMainInput.nativeElement.value ? true : false;
  }

  haveValidDate(): any {
    return this.isValid;
  }

  isOpen(): any {
    return this.matDatePicker && this.matDatePicker.opened;
  }

  setErrorMsg(msg): any {
    this.errorMsg = msg;
  }

  blurMainInput(): void {
    this.blurInput.emit(this.txtMainInput.nativeElement.value);
  }

  disable(): void {
    this.isDisable = true;
  }

  enable(): void {
    this.isDisable = false;
  }

  @HostListener('click', ['$event'])
  // tslint:disable-next-line:typedef
  onClickInput(event: MouseEvent) {
    this.isClick = true;
  }

  clearDate(): void{
    this.txtMainInput.nativeElement.value = '';
  }

}
