import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { TValidators } from 'src/app/shared/validators';
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
  isUpdate = false;
  constructor(
    private gasStationService: GasStationService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const step1Data = this.gasStationService.getStepDataValue().step1;
    this.stationForm = this.initForm(step1Data?.data);
  }

  initForm(data?) {
    if (data) {
      this.isUpdate = true;
      return this.fb.group({
        stationCode: [
          data.stationCode || 'ST',
          [Validators.required, TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)]
        ],
        name: [data.name || '', [Validators.required]],
        address: [data.address || ''],
        status: [data.status || this.listStatus.ACTIVE]
      });
    } else {
      return this.fb.group({
        stationCode: [
          'ST',
          [Validators.required, TValidators.patternNotWhiteSpace(/^[A-Za-z0-9]*$/)]
        ],
        name: ['', [Validators.required]],
        address: [''],
        status: [this.listStatus.ACTIVE]
      });
    }
  }

  onSubmit() {
    this.stationForm.markAllAsTouched();

    if (this.stationForm.invalid) {
      return;
    }

    if (!this.isUpdate) {
      this.gasStationService.createStation(this.stationForm.value).subscribe(
        (res) => {
          if (res.data) {
            // Đưa vào subscribe
            this.stepSubmitted.next({
              currentStep: 1,
              step1: { data: this.stationForm.value, isValid: true }
            });
            this.gasStationService.gasStationId = res.data.id;
            this.gasStationService.gasStationStatus = res.data.status;
          } else {
          }
        },
        (err: IError) => {
          if (err.code === 'SUN-OIL-4517') {
            this.stationForm.get('stationCode').setErrors({ codeExisted: true });
          }
          if (err.code === 'SUN-OIL-4516') {
            this.stationForm.get('name').setErrors({ nameExisted: true });
          }
          this.cdr.detectChanges();
        }
      );
    } else {
      // Đưa vào subscribe
      this.stepSubmitted.next({
        currentStep: 1,
        step1: { data: null, isValid: true }
      });
    }
  }

  backToList() {
    this.router.navigate(['/tram-xang']);
  }
}
