import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { convertMoney } from 'src/app/shared/helpers/functions';
import { IError } from 'src/app/shared/models/error.model';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
import { TValidators } from 'src/app/shared/validators';
import { FilterField, SortState } from 'src/app/_metronic/shared/crud-table';
import { ConfigurationManagementService, IDiscount } from '../configuration-management.service';

@Component({
	selector: 'app-discount-config',
	templateUrl: './discount-config.component.html',
	styleUrls: ['./discount-config.component.scss'],
	providers: [DestroyService, SortService, FilterService]
})
export class DiscountConfigComponent implements OnInit {
	searchFormControl = new FormControl();
	dataSource: FormArray = new FormArray([]);
	dataSourceTemp: FormArray = new FormArray([]);
	sorting: SortState;
	filterField = new FilterField({ nameRank: null, nameProduct: null, discount: null });
	constructor(
		private sortService: SortService<IDiscount>,
		private filterService: FilterService<IDiscount>,
		private cdr: ChangeDetectorRef,
		private fb: FormBuilder,
		private configurationManagementService: ConfigurationManagementService,
		private toastr: ToastrService,
		private destroy$: DestroyService
	) {
		this.sorting = sortService.sorting;
	}

	ngOnInit(): void {
		this.configurationManagementService
			.getListDiscount()
			.pipe(
				tap((res) => {
					this.dataSource = this.dataSourceTemp = this.convertToFormArray(res.data);
					this.cdr.detectChanges();
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();

		this.searchFormControl.valueChanges
			.pipe(debounceTime(500), takeUntil(this.destroy$))
			.subscribe((value) => {
				if (value.trim()) {
					this.filterField.setFilterFieldValue(value.trim());
				} else {
					this.filterField.setFilterFieldValue(null);
				}

				// Set data after filter and apply current sorting
				this.sortAndFilter();
			});

		this.dataSource.valueChanges
			.pipe(
				tap(() => {
					this.dataSourceTemp = this.dataSource;
				}),
				takeUntil(this.destroy$)
			)
			.subscribe();
	}

	sortAndFilter(column?: string) {
		this.dataSource = this.convertToFormArray(
			this.sortService.sort(
				this.filterService.filter(this.dataSourceTemp.value, this.filterField.field),
				column
			)
		);
		this.cdr.detectChanges();
	}

	convertToFormArray(data: IDiscount[]): FormArray {
		const controls = data.map((d) => {
			return this.fb.group({
				id: [d.id],
				nameRank: [d.nameRank],
				nameProduct: [d.nameProduct],
				discount: [d.discount, [TValidators.min(0), TValidators.max(499999)]]
			});
		});
		return this.fb.array(controls);
	}

	onInputDiscount(index: number) {
		this.dataSourceTemp
			.at(index)
			.get('discount')
			.patchValue(this.dataSource.at(index).get('discount').value);
	}

	onSubmit() {
		this.dataSource = this.dataSourceTemp;
		this.onReset(false);
		if (this.dataSource.invalid) {
			return null;
		}
		this.configurationManagementService
			.updateDiscountConfig({
				discountRequests: this.dataSource.value.map((d) => ({
					id: d.id,
					discount: convertMoney(d.discount)
				}))
			})
			.subscribe(
				(res) => {
					this.checkRes(res);
				},
				(error: IError) => this.checkError(error)
			);
	}

	onReset(reInit: boolean) {
		if (reInit) {
			this.ngOnInit();
		}
		this.sortService.sorting.column = '';
		this.sortService.sorting.direction = 'asc';
		this.searchFormControl.patchValue(null, {
			emitEvent: false,
			onlySelf: true
		});
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
