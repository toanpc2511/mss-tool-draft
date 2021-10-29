import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreateStation } from '../../../../gas-station/gas-station.service';
import { IOtherRevenue, ShiftService } from '../../../shift.service';
import { ActivatedRoute } from '@angular/router';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-fuel-revenue-detail',
  templateUrl: './fuel-revenue-detail.component.html',
  styleUrls: ['./fuel-revenue-detail.component.scss'],
  providers: [DestroyService, FormBuilder]
})
export class FuelRevenueDetailComponent implements OnInit {
  @Output() stepSubmitted = new EventEmitter();
  @Input() step1Data: CreateStation;
  lockShiftId: number;
  statusLockShift: string;
  dataSource;
  dataSourceForm: FormArray = new FormArray([]);
  dataSourceTemp: FormArray = new FormArray([]);

  constructor(
    private shiftService: ShiftService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.lockShiftId = this.shiftService.lockShiftId;
    this.statusLockShift = this.shiftService.statusLockShift;
    this.getFuelProductRevenue();
  }

  getFuelProductRevenue() {
    this.shiftService.getFuelProductRevenue(this.lockShiftId)
      .pipe(
        tap((res) => {
          if (this.statusLockShift === 'CLOSE') {
            this.dataSource = res.data;
            this.cdr.detectChanges();
          } else  {
            console.log(res.data);
            this.dataSourceForm = this.dataSourceTemp = this.convertToFormArray(res.data);
            this.cdr.detectChanges();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  convertToFormArray(data): FormArray {
    const controls = data.map((d) => {
      return this.fb.group({
        exportQuantity: [d.exportQuantity, Validators.required],
        finalInventory: [d.finalInventory],
        headInventory: [d.headInventory],
        id: [d.id],
        importQuantity: [d.importQuantity, Validators.required],
        lockShiftId: [d.lockShiftId],
        price: [d.price],
        productId: [d.productId],
        productName: [d.productName],
        total: [d.total],
        totalMoney: [d.totalMoney],
        unit: [d.unit]
      });
    });
    return this.fb.array(controls);
  }

}
