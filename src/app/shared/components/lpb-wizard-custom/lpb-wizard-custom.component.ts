import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {StepData, WizardCustomService} from '../../services/wizard-custom.service';
import {Observable} from 'rxjs';
import {CanActiveStepPipe} from '../../pipes/can-active-step.pipe';

@Component({
  selector: 'lpb-wizard-custom',
  templateUrl: './lpb-wizard-custom.component.html',
  styleUrls: ['./lpb-wizard-custom.component.scss'],
  providers: [CanActiveStepPipe]
})
export class LpbWizardCustomComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() steps: any[];
  @Input() stepDataConfig: any;

  stepData$: Observable<StepData>;

  constructor(
    private wizardService: WizardCustomService,
    private canActiveStep: CanActiveStepPipe
  ) {
    this.stepData$ = wizardService.stepData$;
  }

  ngOnInit(): void {
    console.log()
  }

  ngAfterViewInit(): void {
    this.wizardService.setStepData(this.stepDataConfig)
  }

  ngOnDestroy(): void {
    this.wizardService.resetStepData();
  }

  gotoStep(step: number): void {
    const currentStepData = this.wizardService.getStepDataValue();
    console.log(currentStepData)
    switch (step) {
      case 1:
        this.wizardService.setStepData({...currentStepData, currentStep: 1});
        break;
      case 2:
        this.wizardService.setStepData({...currentStepData, currentStep: 2});
        break;
      case 3:
        this.wizardService.setStepData({...currentStepData, currentStep: 3});
        break;
      case 4:
        this.wizardService.setStepData({...currentStepData, currentStep: 4});
        break;
    }
  }

}
