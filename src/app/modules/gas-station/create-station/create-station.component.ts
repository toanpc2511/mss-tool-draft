import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActiveStepPipe } from '../gas-station.pipe';
import { GasStationService, StepData } from '../gas-station.service';

@Component({
  selector: 'app-create-station',
  templateUrl: './create-station.component.html',
  styleUrls: ['./create-station.component.scss'],
  providers: [CanActiveStepPipe, AsyncPipe]
})
export class CreateStationComponent implements OnInit, AfterViewInit, OnDestroy {
  stepData$: Observable<StepData>;
  constructor(
    private gasStationService: GasStationService,
    private router: Router,
    private canActive: CanActiveStepPipe,
    private asyncPipe: AsyncPipe
  ) {
    this.stepData$ = gasStationService.stepData$;
  }

  ngOnInit() {}

  ngAfterViewInit(): void {}

  ngOnDestroy() {
    this.gasStationService.resetCreateData();
  }

  gotoStep(step: number) {
    const currentStepData = this.gasStationService.getStepDataValue();
    switch (step) {
      case 1:
        const canActiveStep1 = this.canActive.transform(
          this.asyncPipe.transform(this.stepData$),
          1
        );
        if (canActiveStep1) {
          this.gasStationService.setStepData({ ...currentStepData, currentStep: 1 });
        }
        break;
      case 2:
        const canActiveStep2 = this.canActive.transform(
          this.asyncPipe.transform(this.stepData$),
          2
        );
        if (canActiveStep2) {
          this.gasStationService.setStepData({ ...currentStepData, currentStep: 2 });
        }
        break;
      case 3:
        const canActiveStep3 = this.canActive.transform(
          this.asyncPipe.transform(this.stepData$),
          3
        );
        if (canActiveStep3) {
          this.gasStationService.setStepData({ ...currentStepData, currentStep: 3 });
        }
        break;
      case 4:
        const canActiveStep4 = this.canActive.transform(
          this.asyncPipe.transform(this.stepData$),
          4
        );
        if (canActiveStep4) {
          this.gasStationService.setStepData({ ...currentStepData, currentStep: 4 });
        }
        break;
    }
  }

  stepSubmitted($event) {
    if ($event.currentStep === 4) {
      this.router.navigate(['/tram-xang']);
      return;
    }
    const nextStep = $event.currentStep + 1;
    const currentStepData = this.gasStationService.getStepDataValue();
    switch ($event.currentStep) {
      case 1:
        currentStepData.step1.data = $event.step1?.data || currentStepData.step1.data;
        currentStepData.step1.isValid = $event.step1.isValid;
        break;
      case 2:
        currentStepData.step2.isValid = $event.step2.isValid;
        break;
      case 3:
        currentStepData.step3.isValid = $event.step3.isValid;
        break;
      case 4:
        currentStepData.step4.isValid = $event.step4.isValid;
        break;
    }
    this.gasStationService.setStepData({ ...currentStepData, currentStep: nextStep });
  }
}
