import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GasStationService } from '../../gas-station.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {
  @Output() stepSubmitted = new EventEmitter();
  constructor(private gasStationService: GasStationService, private fb: FormBuilder) {}

  stationForm: FormGroup;

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

    // Đưa vào subscribe
    this.stepSubmitted.next({
      currentStep: 1,
      step1: null
    });
  }
}
