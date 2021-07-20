import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { GasStationService } from '../../gas-station.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {
  @Output() stepSubmitted = new EventEmitter();
  stationForm: FormGroup;
  listStatus = LIST_STATUS;

  constructor(
    private gasStationService: GasStationService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.stationForm = this.initForm();
  }

  initForm() {
    const CODE_PATTERN = '^[A-Za-z0-9]*$';
    return this.fb.group({
      stationCode: ['ST', [Validators.required, Validators.pattern(CODE_PATTERN)]],
      name: [null, [Validators.required]],
      address: [null, []],
      status: [this.listStatus.ACTIVE, []]
    });
  }

  onSubmit() {
    this.stationForm.markAllAsTouched();

    if (this.stationForm.invalid) {
      return;
    }

    this.gasStationService.createStation(this.stationForm.value).subscribe((res) => {
      // Đưa vào subscribe
      this.stepSubmitted.next({
        currentStep: 1,
        step1: null
      });
      this.gasStationService.gasStationId = res.data.id;
      this.gasStationService.gasStationStatus = res.data.status;
    });
  }

  backToList() {
    this.router.navigate(['/tram-xang']);
  }
}
