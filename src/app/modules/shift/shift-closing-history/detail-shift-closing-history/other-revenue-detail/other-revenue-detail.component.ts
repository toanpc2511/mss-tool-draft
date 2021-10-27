import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IOtherRevenue, ShiftService } from '../../../shift.service';
import { ActivatedRoute } from '@angular/router'
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { convertMoney } from '../../../../../shared/helpers/functions';
import { IError } from '../../../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { IPaginatorState, PaginatorState } from '../../../../../_metronic/shared/crud-table';

@Component({
  selector: 'app-other-revenue-detail',
  templateUrl: './other-revenue-detail.component.html',
  styleUrls: ['./other-revenue-detail.component.scss'],
  providers: [FormBuilder, DestroyService]
})
export class OtherRevenueDetailComponent implements OnInit {
  lockShiftId: number;
  dataSourceForm: FormArray = new FormArray([]);
  dataSourceTemp: FormArray = new FormArray([]);
  paginatorState = new PaginatorState();
  statusLockShift: string;
  dataSource


  constructor(
    private shiftService: ShiftService,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.paginatorState.page = 1;
    this.paginatorState.pageSize = 10;
    this.paginatorState.pageSizes = [5, 10, 15, 20];
    this.paginatorState.total = 0;
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res)  => {
      this.lockShiftId = res.lockShiftId;
    });

    this.activeRoute.queryParams.subscribe((x) => {
      this.statusLockShift = x.status;
    })

    this.getOtherProductRevenue();
  }

  getOtherProductRevenue() {
    this.shiftService.getOtherProductRevenue(
      this.lockShiftId,
      this.paginatorState.page,
      this.paginatorState.pageSize
    )
      .pipe(
        tap((res) => {
          if (this.statusLockShift === 'CLOSE') {
            this.dataSource = res.data;
            this.cdr.detectChanges();
          } else  {
            this.dataSourceForm = this.dataSourceTemp = this.convertToFormArray(res.data);
            this.paginatorState.recalculatePaginator(res.meta.total);
            this.cdr.detectChanges();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  pagingChange($event: IPaginatorState) {
    this.paginatorState = $event as PaginatorState;
    this.getOtherProductRevenue();
  }

  convertToFormArray(data: IOtherRevenue[]): FormArray {
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

  countFinalInventory(index: number) {
    const valueExport: number = convertMoney(this.dataSourceForm.at(index).get('exportQuantity').value.toString());
    const valueImport: number = convertMoney(this.dataSourceForm.at(index).get('importQuantity').value.toString());
    const valueHeadInventory: number = convertMoney(this.dataSourceForm.at(index).get('headInventory').value.toString());
    const price: number = convertMoney(this.dataSourceForm.at(index).get('price').value.toString());
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
  }

  onSubmit() {
    this.dataSourceForm = this.dataSourceTemp;
    this.dataSourceForm.markAllAsTouched();
    if (this.dataSourceForm.invalid) {
      return null;
    }

    const dataReq = {
      lockShiftId: this.lockShiftId,
      productRevenueRequests: this.dataSourceForm.value.map((d) => ({
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
    if (error.code === 'SUN-OIL-4761') {
      this.toastr.error('Không được sửa ca làm việc không phải trạng thái chờ phê duyệt')
    }
    if (error.code === 'SUN-OIL-4894') {
      this.toastr.error('Không tồn tại ca cần chốt.')
    }
  }

}