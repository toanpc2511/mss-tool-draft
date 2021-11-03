import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canActiveStep'
})
export class CustomShiftPipe implements PipeTransform {
  transform(currentStep: number, step: number): boolean {
    switch (step) {
      case 2:
        return currentStep >= 2;
      case 3:
        return currentStep >= 3;
      case 4:
        return currentStep >= 3;
    }
  }
}
