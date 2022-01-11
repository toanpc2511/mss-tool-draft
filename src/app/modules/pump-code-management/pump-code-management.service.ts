import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { BehaviorSubject, Observable } from 'rxjs';

export class StepData {
  currentStep: number;
  step1: {
    isValid: boolean;
    // data: UpdateCustomer;
  };
  step2: {
    isValid: boolean;
  }
}


@Injectable({
  providedIn: 'root'
})
export class PumpCodeManagementService {
  private stepDataSubject: BehaviorSubject<StepData>;
  stepData$: Observable<StepData>;

  constructor(private http: HttpService) {
    this.stepDataSubject = new BehaviorSubject<StepData>({
      currentStep: 1,
      step1: { isValid: false },
      step2: { isValid: false }
    });
    this.stepData$ = this.stepDataSubject.asObservable();
  }

  resetCreateData() {
    this.stepDataSubject.next({
      currentStep: 1,
      step1: { isValid: false},
      step2: { isValid: false }
    });
  }

  setStepData(stepData: StepData) {
    this.stepDataSubject.next(stepData);
  }

  getStepDataValue(): StepData {
    return this.stepDataSubject.value;
  }


}
