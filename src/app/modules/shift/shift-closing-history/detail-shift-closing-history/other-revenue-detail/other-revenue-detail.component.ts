import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IOtherRevenue, ShiftService } from '../../../shift.service';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from '../../../../../shared/services/destroy.service';
import { convertMoney } from '../../../../../shared/helpers/functions';
import { IError } from '../../../../../shared/models/error.model';
import { ToastrService } from 'ngx-toastr';
import { FilterField, IPaginatorState, PaginatorState } from '../../../../../_metronic/shared/crud-table';
import { BaseComponent } from '../../../../../shared/components/base/base.component';
import { SortService } from '../../../../../shared/services/sort.service';
import { FilterService } from '../../../../../shared/services/filter.service';

@Component({
	selector: 'app-other-revenue-detail',
	templateUrl: './other-revenue-detail.component.html',
	styleUrls: ['./other-revenue-detail.component.scss'],
	providers: [ SortService, FilterService, FormBuilder, DestroyService]
})
export class OtherRevenueDetailComponent extends BaseComponent implements OnInit {
  @Output() stepSubmitted = new EventEmitter();
  lockShiftId: number;
  dataSourceForm: FormArray = new FormArray([]);
  dataSourceTemp: FormArray = new FormArray([]);
  paginatorState = new PaginatorState();
  statusLockShift: string;
  searchFormControl: FormControl;
  dataSource: Array<IOtherRevenue>;
  dataSourceCopy: Array<IOtherRevenue>;
  filterField: FilterField<{
    productName: null;
  }>;

	constructor(
		private shiftService: ShiftService,
		private activeRoute: ActivatedRoute,
		private cdr: ChangeDetectorRef,
		private destroy$: DestroyService,
		private toastr: ToastrService,
    private sortService: SortService<IOtherRevenue>,
    private filterService: FilterService<IOtherRevenue>,
		private fb: FormBuilder
	) {
    super();
		this.paginatorState.page = 1;
		this.paginatorState.pageSize = 10;
		this.paginatorState.pageSizes = [5, 10, 15, 20];
		this.paginatorState.total = 0;
    this.searchFormControl = new FormControl();
    this.filterField = new FilterField({
      productName: null
    });

    this.dataSource = this.dataSourceCopy = [];
	}

	ngOnInit(): void {
		this.activeRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
			this.lockShiftId = res.lockShiftId;
		});

		this.activeRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
			this.statusLockShift = x.status;
		});

		this.getOtherProductRevenue();
    this.searchProduct();
	}

  searchProduct() {
    this.searchFormControl.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((value) => {
        console.log(value);
        if (value.trim()) {
          this.filterField.setFilterFieldValue(value.trim());
        } else {
          this.filterField.setFilterFieldValue(null);
        }

        this.dataSource = this.sortService.sort(
          this.filterService.filter(this.dataSourceCopy, this.filterField.field)
        );
        console.log(this.dataSourceForm.value);
        this.dataSourceForm = this.convertToFormArray(
          this.sortService.sort(
            this.filterService.filter(this.dataSourceTemp.value, this.filterField.field)
          )
        )
        this.cdr.detectChanges();
      });
  }

	getOtherProductRevenue() {
		this.shiftService
			.getOtherProductRevenue(
				this.lockShiftId
			)
			.pipe(
				tap((res) => {
					if (this.statusLockShift === 'CLOSE') {
						this.dataSource = this.dataSourceCopy = res.data;
						this.cdr.detectChanges();
					} else {
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
		const valueExport: number = convertMoney(
			this.dataSourceForm.at(index).get('exportQuantity').value.toString()
		);
		const valueImport: number = convertMoney(
			this.dataSourceForm.at(index).get('importQuantity').value.toString()
		);
		const valueHeadInventory: number = convertMoney(
			this.dataSourceForm.at(index).get('headInventory').value.toString()
		);
		const price: number = convertMoney(this.dataSourceForm.at(index).get('price').value.toString());
		const totalFinalInventory = valueHeadInventory + valueImport - valueExport;
		const totalMoney = valueExport * price;

		this.dataSourceTemp.at(index).get('finalInventory').patchValue(totalFinalInventory);

		this.dataSourceTemp.at(index).get('totalMoney').patchValue(totalMoney);
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
		};

		this.shiftService.updateOtherProductRevenue(dataReq).subscribe(
			(res) => {
				this.checkRes(res);
			},
			(error: IError) => this.checkError(error)
		);
	}

  nextStep() {
    this.shiftService.setCurrentStep(3);
    this.stepSubmitted.emit();
  }

  checkRes(res) {
    if (res.data) {
      this.toastr.success('Lưu thông tin thành công');
      this.shiftService.setCurrentStep(3);
      this.stepSubmitted.emit();
    }
  }

	checkError(error: IError) {
		if (error.code === 'SUN-OIL-4761') {
			this.toastr.error('Không được sửa ca làm việc không phải trạng thái chờ phê duyệt');
		}
		if (error.code === 'SUN-OIL-4894') {
			this.toastr.error('Không tồn tại ca cần chốt.');
		}
	}
}
