import {Component, OnInit} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-identify-number',
  templateUrl: './identify-number.component.html',
  styleUrls: ['./identify-number.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: IdentifyNumberComponent
    }
  ]
})
export class IdentifyNumberComponent implements OnInit, ControlValueAccessor {
  myControl = new FormControl();
  value = '';
  touched = false;
  disabled = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  onChange = (value) => {
    this.myControl.setValue(value);
    // console.log(value);

  }

  onTouched = () => {
  }

  writeValue(value: string): void {
    // console.log(value, this.value);
    this.myControl.setValue(value);
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  checkIsExist() {
    if (this.value) {

    }
  }

}
