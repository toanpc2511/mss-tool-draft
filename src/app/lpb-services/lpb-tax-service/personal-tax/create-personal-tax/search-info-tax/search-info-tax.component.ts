import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {SEARCH_TAX_COLUMNS} from '../../../shared/constants/columns-tax.constant';
import {ISearchConditions} from '../../../../../shared/models/LpbDatatableConfig';
import {TaxService} from '../../../shared/services/tax.service';
import {IError} from '../../../../../shared/models/error.model';
import {CustomNotificationService} from '../../../../../shared/services/custom-notification.service';
import {ITaxInfo} from '../../../shared/interfaces/tax.interface';
import {TAX_TYPES} from '../../../shared/constants/tax.constant';

@Component({
  selector: 'app-search-info-tax',
  templateUrl: './search-info-tax.component.html',
  styleUrls: ['./search-info-tax.component.scss']
})
export class SearchInfoTaxComponent implements OnInit {
  isSelfCollectionTax = false;
  isLandTax = false;
  searchForm: FormGroup;
  taxTypes = TAX_TYPES;
  columns = SEARCH_TAX_COLUMNS;
  config = {
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: true,
    hiddenActionColumn: false,
    buttonOther: [
      {
        icon: 'fa-edit',
        tooltip: 'Thanh toán',
        isDisable: (row) => this.disableCreateBill(row),
        action: (row) => this.createPayment(row)
      }
    ]
  };
  searchConditions: ISearchConditions[] = [];
  dataSource: ITaxInfo[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private taxService: TaxService,
    private notify: CustomNotificationService
  ) {
    this.initFormSearch();
  }

  initFormSearch(): void {
    this.searchForm = this.fb.group({
      taxType: [null, [Validators.required]],
      keySearch: ['', [Validators.required]],
      identifyNumber: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.searchForm.valueChanges.subscribe(() => this.dataSource = []);
  }

  handleChangeTaxType(): void {
    const taxType = this.searchForm.get('taxType').value;
    this.isSelfCollectionTax = taxType === 'TCT_QUERY_TCN';
    this.isLandTax = taxType === 'TCT_QUERY_TND';
    this.searchForm.get('identifyNumber').patchValue('');
    this.isLandTax
      ? this.searchForm.get('identifyNumber').setErrors({required: true})
      : this.searchForm.get('identifyNumber').setErrors(null);
    this.cdr.detectChanges();
  }

  onSearchTax(): void {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.invalid) {
      return;
    }
    const valueForm = this.searchForm.value;
    this.taxService.searchTax(valueForm).subscribe((res) => {
      if (res.data) {
        this.dataSource = res.data;
      }
    }, (error: IError) => this.notify.handleErrors(error));
  }

  /** Action create transaction tax */
  disableCreateBill(row): boolean {
    return row.chapter === 756;
  }

  createPayment(row): void {
    row = {
      ...row,
      subSectionResponses: row.subSectionResponses.map((item, index) => ({
        ...item,
        id: index + 1
      }))
    };
    this.taxService.taxInfoSubject.next(row);
  }

  /** Action Create Self Collection Tax */
  async onCreateSelfCollectionTax(): Promise<any> {
    await this.router.navigate(['/tax-service/personal-tax/create-self-collected-tax']);
  }
}
