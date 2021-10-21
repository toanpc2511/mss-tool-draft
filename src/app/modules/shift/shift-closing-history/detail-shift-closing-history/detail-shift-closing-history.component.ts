import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { SubheaderService } from '../../../../_metronic/partials/layout';
import { Observable } from 'rxjs';
import { DestroyService } from '../../../../shared/services/destroy.service';
import { CustomShiftPipe } from '../../shift.pipe';
import { ShiftService, StepData } from '../../shift.service';

@Component({
  selector: 'app-detail-shift-closing-history',
  templateUrl: './detail-shift-closing-history.component.html',
  styleUrls: ['./detail-shift-closing-history.component.scss'],
  providers: [CustomShiftPipe, DestroyService]
})
export class DetailShiftClosingHistoryComponent implements AfterViewInit, OnDestroy {
  stepData$: Observable<StepData>;

  constructor(
    private subheader: SubheaderService,
    private shiftService: ShiftService
  ) {
    this.stepData$ = shiftService.stepData$;
  }

  ngAfterViewInit() {
    const subBreadcump = {
      title: 'Chi tiết',
      linkText: 'Chi tiết',
      linkPath: '/ca-lam-viec/lich-su-chot-ca/chi-tiet'
    };

    setTimeout(() => {
      this.subheader.setBreadcrumbs([
        {
          title: 'Quản lý ca làm việc',
          linkText: 'Quản lý ca làm việc',
          linkPath: '/ca-lam-viec/lich-su-chot-ca'
        },
        {
          title: 'Lịch sử chốt ca',
          linkText: 'Lịch sử chốt ca',
          linkPath: '/ca-lam-viec/lich-su-chot-ca'
        },
        subBreadcump
      ]);
    }, 1);
  }

  ngOnDestroy() {
    this.shiftService.resetCreateData();
  }

  gotoStep(step: number) {
    const currentStepData = this.shiftService.getStepDataValue();
    switch (step) {
      case 1:
        this.shiftService.setStepData({ ...currentStepData, currentStep: 1 });
        break;
      case 2:
        this.shiftService.setStepData({ ...currentStepData, currentStep: 2 });
        break;
      case 3:
        this.shiftService.setStepData({ ...currentStepData, currentStep: 3 });
        break;
      case 4:
        this.shiftService.setStepData({ ...currentStepData, currentStep: 4 });
        break;
    }
  }

}
