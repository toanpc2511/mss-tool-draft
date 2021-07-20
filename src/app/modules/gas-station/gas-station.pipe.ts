import { Pipe, PipeTransform } from '@angular/core';
import { StepData } from './gas-station.service';

@Pipe({
  name: 'canActiveStep'
})
export class CanActiveStepPipe implements PipeTransform {
  transform(stepData: StepData, step: number): boolean {
    switch (step) {
      case 1:
        return stepData.currentStep >= 1;
      case 2:
        return stepData.step1.isValid || stepData.currentStep >= 2;
      case 3:
        return (stepData.step1.isValid && stepData.step2.isValid) || stepData.currentStep >= 3;
      case 4:
        return (
          (stepData.step1.isValid && stepData.step2.isValid && stepData.step3.isValid) ||
          stepData.currentStep >= 4
        );
    }
  }
}
