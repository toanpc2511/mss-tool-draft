import {Component, OnInit} from '@angular/core';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {FormBuilder} from '@angular/forms';
import {API_BASE_URL} from '../../../lpb-money-transfer-limit-service/shared/constants/Constants';
import {FilterOperator} from '../../../../shared/constants/filter-operator';
import * as moment from 'moment';
import {FileService} from '../../../../shared/services/file.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  protected readonly API_BASE_URL = API_BASE_URL;
  datatableConfig: LpbDatatableConfig = {
    hasNoIndex: true,
    hasPaging: true,
    hasSelection: false,
    filterDefault: '',
    defaultSort: '',
    hasAddtionButton: true,
    hiddenActionColumn: true
  };
  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];

  columns = [
    {
      headerName: 'CARD_ID',
      headerProperty: 'cardId',
      headerIndex: 0,
      className: 'w-100-px',
    },
    {
      headerName: 'CR_LCY_AMOUNT',
      headerProperty: 'crLcyAmount',
      headerIndex: 1,
      className: 'w-200-px',
      type: 'currency'
    },
    {
      headerName: 'TRN_REF_NO',
      headerProperty: 'trnRefNo',
      headerIndex: 2,
      className: 'w-200-px',
    },
    {
      headerName: 'CARD_REF_NUM',
      headerProperty: 'cardRefNum',
      headerIndex: 3,
      className: 'w-100-px'
    },
    {
      headerName: 'CARD_TRN_DATE',
      headerProperty: 'cardTrnDate',
      headerIndex: 4,
      className: 'w-100-px',
    },
    {
      headerName: 'ACCOUNT_ID',
      headerProperty: 'accountId',
      headerIndex: 5,
      className: 'w-200-px text-break',
    },
    {
      headerName: 'ACCOUNT_NUMBER',
      headerProperty: 'accountNumber',
      headerIndex: 6,
      className: 'w-200-px'
    }
  ];

  formSearch = this.fb.group({
    fromDate: [moment().subtract(1, 'days').format('DD/MM/yyyy')],
    toDate: [moment().subtract(1, 'days').format('DD/MM/yyyy')],
    trnRefNo: []
  });

  constructor(private fb: FormBuilder,
              private fileService: FileService) {
  }

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch(): void {
    this.buildSearchCondition();
  }

  buildSearchCondition(): void {
    // this.uniStorageService.setItem(SessionStorageKey.TRANSACTION_STATUS, this.formSearch.get('status').value);
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      let operator = FilterOperator.EQUAL;
      let value = this.formSearch.controls[key].value;
      let propertyKey = key;
      if (this.formSearch.controls[key].value) {
        if (key === 'fromDate') {
          operator = FilterOperator.GREATER_THAN_EQUAL;
          propertyKey = 'cardTrnDate';
          value = this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00' : '';
        } else if (key === 'toDate') {
          operator = FilterOperator.LESSER_THAN_EQUAL;
          propertyKey = 'cardTrnDate';
          value = this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59' : '';
        }

        condition.push({
          property: propertyKey,
          operator,
          value
        });
      }

      // console.log(key, this.formSearch.controls[key].value);
    });

    this.searchCondition = condition;
  }

  exportExcel(): void {
    this.onSearch();
    const params = {
      filter: this.fileService.handleValueFilter(this.searchCondition)
    };
    this.fileService.downloadFileMethodGet(
      'cross-checking-credit-card-service/credit-card-payment/export',
      params
    );
  }
}
