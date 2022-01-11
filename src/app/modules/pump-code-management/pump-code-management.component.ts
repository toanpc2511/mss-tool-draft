import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { PumpCodeManagementService, StepData } from './pump-code-management.service';
import { SubheaderService } from '../../_metronic/partials/layout';

@Component({
  selector: 'app-pump-code-management',
  templateUrl: './pump-code-management.component.html',
  styleUrls: ['./pump-code-management.component.scss']
})
export class PumpCodeManagementComponent implements OnDestroy, AfterViewInit {
  stepData$: Observable<StepData>;

  constructor(
    private pumpCodeManagementS: PumpCodeManagementService,
    private subheader: SubheaderService
  ) {
    this.stepData$ = pumpCodeManagementS.stepData$;
  }

  ngOnDestroy() {
    this.pumpCodeManagementS.resetCreateData();
  }

  gotoStep(step: number) {
    const currentStepData = this.pumpCodeManagementS.getStepDataValue();
    switch (step) {
      case 1:
        this.pumpCodeManagementS.setStepData({ ...currentStepData, currentStep: 1 });
        break;
      case 2:
        this.pumpCodeManagementS.setStepData({ ...currentStepData, currentStep: 2 });
        break;
    }

    this.setBreadcumb(step);
  }

  ngAfterViewInit(): void {
    this.setBreadcumb(1);
  }

  setBreadcumb(value: number) {
    if (value === 1) {
      setTimeout(() => {
        this.subheader.setBreadcrumbs([
          {
            title: 'Quản lý mã bơm',
            linkText: 'Quản lý mã bơm',
            linkPath: 'quan-ly-ma-bom/danh-sach'
          },
          {
            title: 'Lịch sử mã bơm',
            linkText: 'Lịch sử mã bơm',
            linkPath: null
          }
        ]);
      }, 1);
    } else {
      setTimeout(() => {
        this.subheader.setBreadcrumbs([
          {
            title: 'Quản lý mã bơm',
            linkText: 'Quản lý mã bơm',
            linkPath: 'quan-ly-ma-bom/danh-sach'
          },
          {
            title: 'Hoạt động của vòi bơm',
            linkText: 'Hoạt động của vòi bơm',
            linkPath: null
          }
        ]);
      }, 1);
    }
  }
}
