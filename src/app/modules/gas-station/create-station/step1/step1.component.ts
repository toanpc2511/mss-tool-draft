import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {
  stationForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.stationForm = this.initForm();
  }

  initForm() {
    const CODE_PATTERN = '^[A-Za-z0-9]*$';
    return this.fb.group({
      code: ['ST', [Validators.required, Validators.pattern(CODE_PATTERN)]],
      name: [null, [Validators.required]],
      location: [null, []],
      status: [true, []]
    });
  }

  onSubmit() {
    this.stationForm.markAllAsTouched();

    if (this.stationForm.invalid) {
      return;
    }

    console.log(this.stationForm.value);
  }

  controlHasError(validation, controlName): boolean {
    console.log('ádfasdf');

    const control = this.stationForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
}
