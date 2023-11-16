import {Component, OnInit} from '@angular/core';
import {TransactionStatus} from '../shared/constants/transaction-status';
import {FormBuilder, Validators} from '@angular/forms';
import {LpbDialogService} from '../../../shared/services/lpb-dialog.service';
import {TransactionService} from '../shared/services/transaction.service';
import {MatDialog} from '@angular/material/dialog';
import {FileService} from '../../../shared/services/file.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {Router} from '@angular/router';
import {API_BASE_URL} from '../shared/constants/Constants';
import {QueryLimitService} from '../shared/services/query-limit.service';
import {FormHelpers} from '../../../shared/utilites/form-helpers';
import {LpbDatatableConfig} from '../../../shared/models/LpbDatatableConfig';
import {FilterOperator} from '../../../shared/constants/filter-operator';
import {LpbSelect2Config} from '../../../shared/models/LpbSelect2Config';


@Component({
  selector: 'app-query-limit',
  templateUrl: './query-limit.component.html',
  styleUrls: ['./query-limit.component.scss']
})
export class QueryLimitComponent implements OnInit {
  API_BASE_URL = API_BASE_URL;
  FormHelpers = FormHelpers;
  apiUrl = '';
  formSearch = this.fb.group({
    customerPassport: ['', [Validators.required]],
    countryCode: ['', [Validators.required]],
    currencyCode: ['', [Validators.required]]
  });

  selectConfig: LpbSelect2Config = {
    isNewApi: true,
    sort: true,
    paging: false
  };
  response = {
    totalLimitMed: null,
    totalUsed: null,
    totalRemaining: null,
    totalRemainingByCurrency: null,
    currencyType: '',
    currencyTypeUSD: ''
  };
  displayResult = false;
  columns = [
    {
      headerName: 'Mã giao dịch',
      headerProperty: 'transId',
      headerIndex: 0,
      className: 'w-80-px',
    },
    {
      headerName: 'Loại giao dịch',
      headerProperty: 'transTypeName',
      headerIndex: 1,
      className: 'w-50-px',
    },
    {
      headerName: 'Ngày giao dịch',
      headerProperty: 'transDate',
      headerIndex: 2,
      className: 'w-100-px',
    },

    {
      headerName: 'Số Hộ chiếu',
      headerProperty: 'customerPassport',
      headerIndex: 3,
      className: 'w-50-px font-weight-bold',
    },
    {
      headerName: 'Số tiền',
      headerProperty: 'amount',
      headerIndex: 4,
      className: 'w-100-px',
      type: 'currency'
    },
    {
      headerName: 'Loại tiền',
      headerProperty: 'transCurrencyType',
      headerIndex: 5,
      className: 'w-40-px',
    },
    {
      headerName: 'Mã quốc gia',
      headerProperty: 'countryCode',
      headerIndex: 6,
      className: 'w-50-px',
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'statusName',
      headerIndex: 6,
      className: 'w-100-px font-weight-bold text-break',
    },
    // {
    //   headerName: 'Người tạo',
    //   headerProperty: 'createdBy',
    //   headerIndex: 7,
    //   className: 'w-50-px',
    // },
    // {
    //   headerName: 'Ngày tạo',
    //   headerProperty: 'createdDate',
    //   headerIndex: 8,
    //   className: 'w-50-px',
    // },
    // {
    //   headerName: 'Người sửa',
    //   headerProperty: 'lastModifiedBy',
    //   headerIndex: 9,
    //   className: 'w-50-px',
    // },
    // {
    //   headerName: 'Ngày sửa',
    //   headerProperty: 'lastModifiedDate',
    //   headerIndex: 10,
    //   className: 'w-50-px',
    // },
    // {
    //   headerName: 'Người duyệt',
    //   headerProperty: 'approveBy',
    //   headerIndex: 11,
    //   className: 'w-50-px',
    // },
    // {
    //   headerName: 'Ngày duyệt',
    //   headerProperty: 'approveDate',
    //   headerIndex: 12,
    //   className: 'w-50-px',
    // },
    // {
    //   headerName: 'Nguồn dữ liệu',
    //   headerProperty: 'sourceData',
    //   headerIndex: 13,
    //   className: 'w-50-px',
    // },
  ];
  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];
  filterDefault = 'deleted|eq|0&customerPassport|eq|999999999999999999';
  datatableConfig: LpbDatatableConfig = {
    hasNoIndex: true,
    hasPaging: true,
    hasSelection: false,
    filterDefault: this.filterDefault,
    defaultSort: '',
    hasAddtionButton: false,
    isDisableRow: (row) => {
      return true;
    },
  };
  isDisabledUpdate: (row: any) => boolean = (row) => {
    return true;
  };

  constructor(private fb: FormBuilder,
              private dialogService: LpbDialogService,
              private queryLimitService: QueryLimitService,
              private dialog: MatDialog,
              private fileService: FileService,
              private customNotificationService: CustomNotificationService,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  onSearch(): void {
    this.formSearch.markAllAsTouched();
    if (this.formSearch.invalid) {
      return;
    }

    this.queryLimitService.queryLimit(this.formSearch.value).subscribe(
      (res) => {
        this.response = res.data;
        // console.log(res);
        const condition = [];
        // condition.push({
        //   property: 'deleted',
        //   operator: FilterOperator.EQUAL,
        //   value: '0'
        // });
        // condition.push({
        //   property: 'customerPassport',
        //   operator: FilterOperator.EQUAL,
        //   value: this.formSearch.value.customerPassport
        // });
        this.searchCondition = condition;
        this.apiUrl = '/money-transfer-limit-service/query-limit/transaction?customerPassport=' + this.formSearch.value.customerPassport;
        this.customNotificationService.handleResponse(res);
        this.displayResult = true;
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
      },
      () => {
      }
    );
    // this.buildSearchCondition();

  }

}
