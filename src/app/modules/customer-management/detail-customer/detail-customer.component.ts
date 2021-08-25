import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerManagementService, StepData } from '../customer-management.service';
import { CustomerManagementPipe } from '../customer-management.pipe';
import { DestroyService } from '../../../shared/services/destroy.service';

@Component({
  selector: 'app-detail-customer',
  templateUrl: './detail-customer.component.html',
  styleUrls: ['./detail-customer.component.scss'],
  providers: [CustomerManagementPipe, DestroyService]
})
export class DetailCustomerComponent implements OnInit {
  stepData$: Observable<StepData>;

  constructor(
    private customerService: CustomerManagementService,
  ) {
    this.stepData$ = customerService.stepData$;
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.customerService.resetCreateData();
  }

  gotoStep(step: number) {
    const currentStepData = this.customerService.getStepDataValue();
    switch (step) {
      case 1:
        this.customerService.setStepData({ ...currentStepData, currentStep: 1 });
        break;
      case 2:
        this.customerService.setStepData({ ...currentStepData, currentStep: 2 });
        break;
      case 3:
        this.customerService.setStepData({ ...currentStepData, currentStep: 3 });
        break;
      case 4:
        this.customerService.setStepData({ ...currentStepData, currentStep: 4 });
        break;
    }
  }

}
