import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ShiftService } from '../../../shift.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-promotion-detail',
  templateUrl: './promotion-detail.component.html',
  styleUrls: ['./promotion-detail.component.scss'],
  providers: [DestroyService]
})
export class PromotionDetailComponent implements OnInit {
  lockShiftId: number;
  dataSource;
  dataSourceTemp;

  constructor(
    private shiftService: ShiftService,
    private activeRoute: ActivatedRoute,
    private destroy$: DestroyService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res) => {
      this.lockShiftId = res.lockShiftId;
    });

    this.shiftService.getPromotionalRevenue(this.lockShiftId)
      .pipe(
        tap((res) => {
          // this.dataSource = this.dataSourceTemp = this.convertToFormArray(res.data);
          console.log(res.data);
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

}
