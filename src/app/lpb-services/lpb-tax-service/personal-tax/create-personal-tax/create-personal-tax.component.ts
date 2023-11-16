import {Component, OnDestroy, OnInit} from '@angular/core';
import {TaxService} from '../../shared/services/tax.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {BreadCrumbHelper} from '../../../../shared/utilites/breadCrumb-helper';
import {takeUntil} from 'rxjs/operators';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {ITaxInfo} from '../../shared/interfaces/tax.interface';

@Component({
  selector: 'app-create-personal-tax',
  templateUrl: './create-personal-tax.component.html',
  styleUrls: ['./create-personal-tax.component.scss']
})
export class CreatePersonalTaxComponent implements OnInit, OnDestroy {
  transaction: ITaxInfo;

  constructor(
    private taxService: TaxService,
    private notify: CustomNotificationService,
    private destroy$: DestroyService
  ) {
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán dịch vụ thuế',
      'Thuế cá nhân',
      'Tạo mới'
    ]);
    this.taxService.taxInfoSubject
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.transaction = value;
      });
  }

  ngOnDestroy(): void {
    this.taxService.taxInfoSubject.next(null);
  }
}
