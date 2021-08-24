import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ISortData {
  fieldSort: string;
  directionSort: string;
}
export class StepData {
  currentStep: number;
  step1: {
    isValid: boolean;
    data: UpdateCustomer;
  };
  step2: {
    isValid: boolean;
  };
  step3: {
    isValid: boolean;
  };
  step4: {
    isValid: boolean;
  };
}

export interface UpdateCustomer {
}

@Injectable({
  providedIn: 'root'
})
export class CustomerManagementService {
  private stepDataSubject: BehaviorSubject<StepData>;
  stepData$: Observable<StepData>;

  constructor() {
    this.stepDataSubject = new BehaviorSubject<StepData>({
      currentStep: 1,
      step1: { isValid: false, data: null },
      step2: { isValid: false },
      step3: { isValid: false },
      step4: { isValid: false }
    });
    this.stepData$ = this.stepDataSubject.asObservable();
  }

  setStepData(stepData: StepData) {
    this.stepDataSubject.next(stepData);
  }

  getStepDataValue(): StepData {
    return this.stepDataSubject.value;
  }

  resetCreateData() {
    this.stepDataSubject.next({
      currentStep: 1,
      step1: { isValid: false, data: null },
      step2: { isValid: false },
      step3: { isValid: false },
      step4: { isValid: false }
    });
  }

}
