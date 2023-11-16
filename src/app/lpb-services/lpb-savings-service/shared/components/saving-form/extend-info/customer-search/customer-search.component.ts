import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import * as moment from 'moment';
import { CustomerInfo } from 'src/app/shared/models/common.interface';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { FinanceCommonService } from 'src/app/shared/services/finance-common.service';
import { DateHelper } from 'src/app/shared/utilites/date-helper';
import { ValidatorHelper } from 'src/app/shared/utilites/validators.helper';

@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: [
    './customer-search.component.scss',
    '../../../../styles/common.scss',
  ],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,
      useValue: { color: 'primary' },
    },
  ],
})
export class CustomerSearchComponent implements OnInit {
  @Output() changeCustomerInfo = new EventEmitter<CustomerInfo>();

  searchForm: FormGroup;
  INPUT_TYPES = {
    CIF: 'cif',
    GTXM: 'gtxm',
  };

  lstCifs: CustomerInfo[] = [];

  checkIndex = null;

  constructor(
    private fb: FormBuilder,
    private financeCommonService: FinanceCommonService,
    private customNotificationService: CustomNotificationService
  ) {}

  ngOnInit() {
    this.searchForm = this.fb.group({
      inputType: [this.INPUT_TYPES.CIF],
      textSearch: [null, ValidatorHelper.required],
    });
  }

  searchCustomer() {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.invalid) {
      return;
    }

    this.checkIndex = null;
    this.changeCustomerInfo.emit(null);

    const textSearch = this.searchForm.get('textSearch').value;
    const inputType = this.searchForm.get('inputType').value;
    this.financeCommonService.getCustomerInfo(textSearch, inputType).subscribe(
      (res) => {
        if (res && res?.data?.length) {
          this.lstCifs = res.data.map((item) => ({
            ...item,
            docIssueDate: moment(
              DateHelper.getDateFromString(item?.docIssueDate)
            ).format('DD/MM/YYYY'),
          }));
        } else {
          this.lstCifs = [];
        }
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error.message);
        this.lstCifs = [];
      }
    );
  }

  checkRow(item: CustomerInfo, index: string) {
    this.checkIndex = index;
    this.changeCustomerInfo.emit(item);
  }
}
