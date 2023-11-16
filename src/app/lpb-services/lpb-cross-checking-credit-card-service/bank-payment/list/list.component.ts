import {Component, OnInit} from '@angular/core';
import {API_BASE_URL} from '../../../lpb-money-transfer-limit-service/shared/constants/Constants';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {LpbDatatableColumn} from '../../../../shared/models/LpbDatatableColumn';
import {SessionStorageKey} from '../../../../shared/constants/session-storage-key';
import {FormBuilder} from '@angular/forms';
import {FilterOperator} from '../../../../shared/constants/filter-operator';
import * as moment from 'moment/moment';
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
      headerName: 'TRN_DT',
      headerProperty: 'trnDt',
      headerIndex: 0,
      className: 'w-100-px',
    },
    {
      headerName: 'TRN_REF_NO',
      headerProperty: 'refNo2',
      headerIndex: 1,
      className: 'w-200-px',
    },
    {
      headerName: 'TRN_REF_NO',
      headerProperty: 'trnRefNo',
      headerIndex: 2,
      className: 'w-200-px',
    },
    {
      headerName: 'BRANCH',
      headerProperty: 'branch',
      headerIndex: 3,
      className: 'w-100-px'
    },
    {
      headerName: 'GL_CODE',
      headerProperty: 'glCode',
      headerIndex: 4,
      className: 'w-100-px',
    },
    {
      headerName: 'GL_DESC',
      headerProperty: 'glDesc',
      headerIndex: 5,
      className: 'w-200-px text-break',
    },
    {
      headerName: 'CR_LCY_AMOUNT',
      headerProperty: 'crLcyAmount',
      headerIndex: 6,
      className: 'w-200-px',
      type: 'currency'
    },
    {
      headerName: 'AC_CCY',
      headerProperty: 'acCcy',
      headerIndex: 7,
      className: 'w-100-px',
    },
    {
      headerName: 'DRCR_IND',
      headerProperty: 'drcrInd',
      headerIndex: 8,
      className: 'w-100-px',
    },

    {
      headerName: 'CRFCY_AMOUNT',
      headerProperty: 'crfcyAmount',
      headerIndex: 9,
      className: 'w-200-px',
    },
    {
      headerName: 'EVENT_DESC',
      headerProperty: 'eventDescr',
      headerIndex: 10,
      className: 'w-300-px',
    },
    {
      headerName: 'USER_ID',
      headerProperty: 'userId',
      headerIndex: 11,
      className: 'w-150-px',
    },
    {
      headerName: 'CUSTOMER_NUMBER',
      headerProperty: 'customerNumber',
      headerIndex: 12,
      className: 'w-200-px',
    },
    {
      headerName: 'CARD_NUMBER',
      headerProperty: 'cardNumber',
      headerIndex: 13,
      className: 'w-200-px',
    },
    {
      headerName: 'CARD_ID',
      headerProperty: 'cardId',
      headerIndex: 14,
      className: 'w-150-px',
    },
    {
      headerName: 'TRN_CHANNEL',
      headerProperty: 'trnChannel',
      headerIndex: 15,
      className: 'w-200-px',
    },

    {
      headerName: 'REV_REF_NO',
      headerProperty: 'revRefNo',
      headerIndex: 16,
      className: 'w-150-px',
    },
  ];

  formSearch = this.fb.group({
    trnRefNo: [],
    branch: [],
    fromDate: [moment().subtract(1, 'days').format('DD/MM/yyyy')],
    toDate: [moment().subtract(1, 'days').format('DD/MM/yyyy')],
    glCode: [],
    eventDescr: []
  });

  constructor(private fb: FormBuilder,
              private fileService: FileService) {
  }

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch(): void {
    this.searchCondition = this.buildSearchCondition();
  }

  buildSearchCondition(): any {
    // this.uniStorageService.setItem(SessionStorageKey.TRANSACTION_STATUS, this.formSearch.get('status').value);
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      let operator = FilterOperator.EQUAL;
      let value = this.formSearch.controls[key].value;
      let propertyKey = key;
      if (this.formSearch.controls[key].value) {
        if (key === 'fromDate') {
          operator = FilterOperator.GREATER_THAN_EQUAL;
          propertyKey = 'trnDt';
          value = this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00' : '';
        } else if (key === 'toDate') {
          operator = FilterOperator.LESSER_THAN_EQUAL;
          propertyKey = 'trnDt';
          value = this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59' : '';
        } else if (key === 'branch') {
          operator = FilterOperator.IN;
        } else if (key === 'eventDescr') {
          operator = FilterOperator.LIKE;
        }

        condition.push({
          property: propertyKey,
          operator,
          value
        });
      }

      // console.log(key, this.formSearch.controls[key].value);
    });

    return condition;
  }

  exportExcel(): void {
    // this.onSearch();
    const params = {
      filter: this.fileService.handleValueFilter(this.buildSearchCondition())
    };
    this.fileService.downloadFileMethodGet(
      'cross-checking-credit-card-service/bank-payment/export',
      params
    );
  }
}
