import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {LpbDialogService} from '../../../shared/services/lpb-dialog.service';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {NavigationExtras, Router} from '@angular/router';
import {FilterOperator} from '../../../shared/constants/filter-operator';
import * as moment from 'moment';
import {CurrencyRateService} from '../shared/services/currency-rate.service';
import {API_BASE_URL} from '../shared/constants/Constants';
import {LpbDatatableConfig} from '../../../shared/models/LpbDatatableConfig';
import {ViewMode} from '../../../shared/constants/view-mode';
import {CurrencyRateStatus} from '../shared/constants/currency-rate-status';
import {PopupSystemAddActionComponent} from '../../../manager-admin/popup-system-add-action/popup-system-add-action.component';
import {DialogConfig} from '../../../_utils/_dialogConfig';
import {CurrencyRateRejectComponent} from './currency-rate-reject/currency-rate-reject.component';
import {MatDialog} from '@angular/material/dialog';
import {FormHelpers} from '../../../shared/utilites/form-helpers';
import {FileService} from '../../../shared/services/file.service';
import {UniStorageService} from '../../../shared/services/uni-storage.service';
import {SessionStorageKey} from '../../../shared/constants/session-storage-key';
import {LpbDatatableColumn} from '../../../shared/models/LpbDatatableColumn';

@Component({
  selector: 'app-currency-rate',
  templateUrl: './currency-rate.component.html',
  styleUrls: ['./currency-rate.component.scss']
})
export class CurrencyRateComponent implements OnInit {
  API_BASE_URL = API_BASE_URL;
  FormHelpers = FormHelpers;
  CurrencyRateStatus = CurrencyRateStatus;
  rowSelected = [];
  formSearch = this.fb.group({
    currencyCode: [null],
    'status.code': [this.uniStorageService.getItem(SessionStorageKey.CURRENCY_STATUS)],
    // startDate: [],
    // endDate: []
  });
  clearSelected = false;
  filterDefault = 'deleted|eq|0&status.code|eq|' + CurrencyRateStatus.APPROVED;
  datatableConfig: LpbDatatableConfig = {
    hasNoIndex: true,
    hasPaging: true,
    hasSelection: true,
    filterDefault: this.filterDefault,
    defaultSort: '',
    hasAddtionButton: true,
    isDisableRow: (row) => {
      return row.statusCode !== 'WAITING_APPROVE' && row.statusCode !== 'WAITING_APPROVE_UPDATE';
    },
  };
  checkboxConfig: {
    clearSelected: boolean
  } = {
    clearSelected: false
  };
  columns: LpbDatatableColumn[] = [
    {
      headerName: 'Loại tiền',
      headerProperty: 'currencyCode',
      headerIndex: 0,
      className: 'w-100-px',
    },
    {
      headerName: 'Tỷ Giá USD/Nguyên tệ',
      headerProperty: 'exchangeRate',
      headerIndex: 1,
      className: 'w-150-px',
      type: 'currency'
    },
    //
    // {
    //   headerName: 'Ngày áp dụng',
    //   headerProperty: 'startDate',
    //   headerIndex: 2,
    //   className: 'w-50-px'
    // },
    // {
    //   headerName: 'Ngày hết hiệu lực',
    //   headerProperty: 'endDate',
    //   headerIndex: 3,
    //   className: 'w-50-px'
    // },
    {
      headerName: 'Trạng thái',
      headerProperty: 'statusName',
      headerIndex: 4,
      className: 'w-100-px font-weight-bold text-break',
    },
    {
      headerName: 'Mô tả',
      headerProperty: 'description',
      headerIndex: 5,
      className: 'w-300-px'
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 6,
      className: 'w-100-px',
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 7,
      className: 'w-100-px',
    },
    {
      headerName: 'Người sửa',
      headerProperty: 'lastModifiedBy',
      headerIndex: 8,
      className: 'w-100-px',
    },
    {
      headerName: 'Ngày sửa',
      headerProperty: 'lastModifiedDate',
      headerIndex: 9,
      className: 'w-100-px',
    },
    {
      headerName: 'Người duyệt',
      headerProperty: 'approveBy',
      headerIndex: 10,
      className: 'w-100-px',
    },
    {
      headerName: 'Ngày duyệt',
      headerProperty: 'approveDate',
      headerIndex: 11,
      className: 'w-100-px',
    },
  ];

  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];
  selectConfig = {
    isNewApi: true,
    isSort: true,
    clearable: true,
    closeOnSelect: false
  };

  isDisabledUpdate: (row: any) => boolean = (row) => {
    return row.statusCode === 'REJECT';
  };

  constructor(private fb: FormBuilder,
              private dialogService: LpbDialogService,
              private currencyRateService: CurrencyRateService,
              private dialog: MatDialog,
              private fileService: FileService,
              private customNotificationService: CustomNotificationService,
              private uniStorageService: UniStorageService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch(): void {
    // console.log(this.formSearch.value);
    this.checkboxConfig = {
      clearSelected: true
    };
    this.buildSearchCondition();
  }

  delete(rowData): void {

  }

  view(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: ViewMode.VIEW},
      fragment: 'anchor'
    };
    this.router.navigate([API_BASE_URL + '/currency-rate/create'], navigationExtras);
  }

  edit(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: ViewMode.UPDATE},
      fragment: 'anchor'
    };
    this.router.navigate([API_BASE_URL + '/currency-rate/create'], navigationExtras);
  }

  buildSearchCondition(): void {
    console.log(this.formSearch.value);
    this.uniStorageService.setItem(SessionStorageKey.CURRENCY_STATUS, this.formSearch.controls['status.code'].value);
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      if (this.formSearch.controls[key].value) {
        if (key === 'startDate') {
          condition.push({
            property: key,
            operator: FilterOperator.GREATER_THAN_EQUAL,
            value: this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00' : ''
          });
        } else if (key === 'endDate') {
          condition.push({
            property: key,
            operator: FilterOperator.LESSER_THAN_EQUAL,
            value: this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 23:59:59' : ''
          });
        } else if (key === 'currencyCode') {
          condition.push({
            property: key,
            operator: FilterOperator.IN,
            value: this.formSearch.controls[key].value
          });
        } else if (key === 'status.code' && this.formSearch.controls[key].value.length > 0) {
          condition.push({
            property: key,
            operator: FilterOperator.IN,
            value: this.formSearch.controls[key].value
          });
        }
      }


      // console.log(key, this.formSearch.controls[key].value);
    });
    condition.push({
      property: 'deleted',
      operator: FilterOperator.EQUAL,
      value: '0'
    });
    this.searchCondition = condition;
  }

  chkAll(rowSelected): void {
    this.rowSelected = rowSelected;
  }

  approve(): void {
    if (this.rowSelected.length === 0) {
      this.customNotificationService.error('Lỗi', 'Bạn phải chọn ít nhất 1 bản ghi');
      return;
    }
    const request = {
      ids: this.rowSelected.map(item => item.id)
    };

    this.currencyRateService.approve(request).subscribe(
      (res) => {
        this.customNotificationService.handleResponse(res);
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
      },
      () => {
        // this.customNotificationService.success('Thông báo', message);
        this.onSearch();

      }
    );

  }

  reject(): void {
    if (this.rowSelected.length === 0) {
      this.customNotificationService.error('Lỗi', 'Bạn phải chọn ít nhất 1 bản ghi');
      return;
    }
    const data = {
      ids: this.rowSelected.map(item => item.id)
    };
    const dialogRef = this.dialog.open(CurrencyRateRejectComponent, DialogConfig.configDialog(null));
    dialogRef.afterClosed().subscribe(rs => {
        if (rs.index === 1) {
          const request = {
            ids: this.rowSelected.map(item => item.id),
            description: rs.reason
          };
          this.currencyRateService.reject(request).subscribe(
            (res) => {
              this.customNotificationService.handleResponse(res);
            },
            (error) => {
              this.customNotificationService.error('Thông báo', error?.message);
            },
            () => {
              // this.customNotificationService.success('Thông báo', message);
              this.onSearch();

            }
          );
        }
      }
    );
  }

  exportExcel(): void {
    this.onSearch();
    const params = {
      filter: this.fileService.handleValueFilter(this.searchCondition)
    };
    this.fileService.downloadFileMethodGet(
      'money-transfer-limit-service/currency-rate/export/excel',
      params
    );
  }

}
