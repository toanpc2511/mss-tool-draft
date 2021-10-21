import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IOtherRevenue, ShiftService } from '../../../shift.service';
import { ActivatedRoute } from '@angular/router'
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { convertMoney } from '../../../../../shared/helpers/functions';
import { IError } from '../../../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-other-revenue-detail',
  templateUrl: './other-revenue-detail.component.html',
  styleUrls: ['./other-revenue-detail.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class OtherRevenueDetailComponent implements OnInit {
  lockShiftId: number;
  totalMoney: number;
  dataSource: FormArray = new FormArray([]);
  dataSourceTemp: FormArray = new FormArray([]);

  constructor(
    private shiftService: ShiftService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.totalMoney = 0;
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res) => {
      this.lockShiftId = res.lockShiftId;
    });

    this.shiftService.getOtherProductRevenue(this.lockShiftId)
      .pipe(
        tap((res) => {
          this.dataSource = this.dataSourceTemp = this.convertToFormArray(res.data);
          this.cdr.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  convertToFormArray(data: IOtherRevenue[]): FormArray {
    const controls = data.map((d) => {
      return this.fb.group({
        exportQuantity: ['', Validators.required],
        finalInventory: [0],
        headInventory: [d.headInventory],
        id: [d.id],
        importQuantity: ['', Validators.required],
        lockShiftId: [d.lockShiftId],
        price: [d.price],
        productId: [d.productId],
        productName: [d.productName],
        total: [d.total],
        totalMoney: [0],
        unit: [d.unit]
      });
    });
    return this.fb.array(controls);
  }

  countFinalInventory(index: number) {
    const valueExport: number = convertMoney(this.dataSource.at(index).get('exportQuantity').value.toString());
    const valueImport: number = convertMoney(this.dataSource.at(index).get('importQuantity').value.toString());
    const valueHeadInventory: number = convertMoney(this.dataSource.at(index).get('headInventory').value.toString());
    const price: number = convertMoney(this.dataSource.at(index).get('price').value.toString());
    const totalFinalInventory = valueHeadInventory + valueImport - valueExport;
    const totalMoney = valueExport * price;

    this.dataSourceTemp
      .at(index)
      .get('finalInventory')
      .patchValue(totalFinalInventory);

    this.dataSourceTemp
      .at(index)
      .get('totalMoney')
      .patchValue(totalMoney);

    this.dataSource.value.map((x) => {
      this.totalMoney += x.total;
    });
  }

  onSubmit() {
    this.dataSource = this.dataSourceTemp;
    this.dataSource.markAllAsTouched();
    if (this.dataSource.invalid) {
      return null;
    }

    const dataReq = {
      lockShiftId: this.lockShiftId,
      productRevenueRequests: this.dataSource.value.map((d) => ({
        otherProductRevenueId: d.id,
        importQuantity: convertMoney(d.importQuantity.toString()),
        exportQuantity: convertMoney(d.exportQuantity.toString())
      }))
    }

    this.shiftService.updateOtherProductRevenue(dataReq).subscribe(
      (res) => {
        this.checkRes(res);
      },
      (error: IError) => this.checkError(error)
    )
  }

  checkRes(res) {
    if (res.data) {
      this.toastr.success('Lưu thông tin thành công');
    }
  }

  checkError(error: IError) {
    this.toastr.error(error.code);
  }

}
