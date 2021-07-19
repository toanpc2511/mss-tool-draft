import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from 'src/app/shared/services/http.service';

export interface IStepData<T> {
  isValid: boolean;
  data: T;
}

export interface IStep1Data {}

export interface IStep2Data {}

export interface IStep3Data {}

export interface IStep4Data {}
export class StepData {
  currentStep: number;
  step1: IStepData<IStep1Data>;
  step2: IStepData<IStep2Data>;
  step3: IStepData<IStep3Data>;
  step4: IStepData<IStep4Data>;
}
@Injectable({
  providedIn: 'root'
})
export class GasStationService {
  // List gas station

  // Create gas station
  stepDataSubject: BehaviorSubject<StepData>;
  stepData$: Observable<StepData>;

  // Step 1

  // Step 2

  // Step 3

  // Step 4

  constructor(private http: HttpService) {
    this.stepDataSubject = new BehaviorSubject<StepData>({
      currentStep: 1,
      step1: { isValid: false, data: null },
      step2: { isValid: false, data: null },
      step3: { isValid: false, data: null },
      step4: { isValid: false, data: null }
    });
    this.stepData$ = this.stepDataSubject.asObservable();
  }

  // List gas station

  // Create gas station
  setStepData(stepData) {
    this.stepDataSubject.next(stepData);
  }

  getStepDataValue(): StepData {
    return this.stepDataSubject.value;
  }

  // Step 1

  // Step 2

  // Step 3

  // Step 4
}
