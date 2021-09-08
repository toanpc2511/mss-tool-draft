import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import { FilterService } from 'src/app/shared/services/filter.service';
import { SortService } from 'src/app/shared/services/sort.service';
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
	filterField = new FilterField({ name: null, productName: null, moneyDiscount: null });
	constructor(
		private sortService: SortService<IDiscount>,
		private filterService: FilterService<IDiscount>,
		private cdr: ChangeDetectorRef,
		private fb: FormBuilder,
		private configurationManagementService: ConfigurationManagementService,
		private destroy$: DestroyService
	) {
		this.sorting = sortService.sorting;
	}

	ngOnInit(): void {
		this.configurationManagementService
			.getListDiscount()
			.pipe(
				tap((res) => {
					const controls = res.data.map((d) => {
						return this.fb.group({
							id: d.id,
							name: d.name,
							productName: d.productName,
							moneyDiscount: d.moneyDiscount
						});
					});

					this.dataSource = this.dataSourceTemp = this.fb.array(controls);
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
				this.dataSource = this.convertToFormArray(
					this.sortService.sort(
						this.filterService.filter(this.dataSourceTemp.value, this.filterField.field)
					)
				);
				this.cdr.detectChanges();
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

	sort(column: string) {
		this.dataSource = this.convertToFormArray(
			this.sortService.sort(this.dataSourceTemp.value, column)
		);
	}

	convertToFormArray(data: IDiscount[]): FormArray {
		const controls = data.map((d) => {
			return this.fb.group({
				id: d.id,
				name: d.name,
				productName: d.productName,
				moneyDiscount: d.moneyDiscount
			});
		});
		return this.fb.array(controls);
	}
}
