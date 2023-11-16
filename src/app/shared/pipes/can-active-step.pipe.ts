import { Pipe, PipeTransform } from '@angular/core';
import {StepData} from '../services/wizard-custom.service';

@Pipe({
  name: 'canActiveStep'
})
export class CanActiveStepPipe implements PipeTransform {

  transform(stepData: StepData, step: number): boolean {
    // console.log(step)
    // console.log(stepData)
    // stepData.steps.forEach((stepD, index) => {
    //   switch (step) {
    //     case index:
    //       return stepD.isValid || stepData.currentStep >= (index + 1);
    //   }
    // });
    return true;
  }

}
