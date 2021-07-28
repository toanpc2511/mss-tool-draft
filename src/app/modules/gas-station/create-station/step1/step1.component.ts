import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LIST_STATUS } from 'src/app/shared/data-enum/list-status';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { TValidators } from 'src/app/shared/validators';
import { CreateStation, GasStationService } from '../../gas-station.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
  providers: [DestroyService]
})
export class Step1Component implements OnInit, OnChanges {
  @Output() stepSubmitted = new EventEmitter();
  @Input() step1Data: CreateStation;
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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.stationForm) {
      this.stationForm = this.initForm();
    }
    if (this.step1Data) {
      this.isUpdate = true;
      this.stationForm.patchValue(this.step1Data);
    }
  }

  initForm() {
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

  onSubmit() {
    this.stationForm.markAllAsTouched();

    if (this.stationForm.invalid) {
      return;
    }

    if (!this.isUpdate) {
      this.gasStationService.createStation(this.stationForm.value).subscribe(
        (res) => {
          if (res.data) {
            this.stepSubmitted.next({
              currentStep: 1,
              step1: { data: this.stationForm.value, isValid: true }
            });
            this.gasStationService.gasStationId = res.data.id;
            this.gasStationService.gasStationStatus = res.data.status;
          }
        },
        (err: IError) => {
          this.checkError(err);
        }
      );
    } else {
      this.gasStationService
        .updateStation(this.gasStationService.gasStationId, this.stationForm.value)
        .subscribe(
          (res) => {
            if (res.data) {
              this.stepSubmitted.next({
                currentStep: 1,
                step1: { data: this.stationForm.value, isValid: true }
              });
              this.gasStationService.gasStationStatus = res.data.status;
            }
          },
          (err: IError) => {
            this.checkError(err);
          }
        );
    }
  }

  checkError(err: IError) {
    if (err.code === 'SUN-OIL-4149') {
      this.stationForm.get('stationCode').setErrors({ codeExisted: true });
    }
    if (err.code === 'SUN-OIL-4148') {
      this.stationForm.get('name').setErrors({ nameExisted: true });
    }
    this.cdr.detectChanges();
  }

  backToList() {
    this.router.navigate(['/tram-xang']);
  }
}
