import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {LpbDialogService} from '../../../shared/services/lpb-dialog.service';
import {CurrencyRateService} from '../shared/services/currency-rate.service';
import {MatDialog} from '@angular/material/dialog';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {NavigationExtras, Router} from '@angular/router';
import {CurrencyRateStatus} from '../shared/constants/currency-rate-status';
import {API_BASE_URL} from '../shared/constants/Constants';
import {LpbDatatableConfig} from '../../../shared/models/LpbDatatableConfig';
import {ViewMode} from '../../../shared/constants/view-mode';
import {CurrencyRateRejectComponent} from '../currency-rate/currency-rate-reject/currency-rate-reject.component';
import {DialogConfig} from '../../../_utils/_dialogConfig';
import {FilterOperator} from '../../../shared/constants/filter-operator';
import * as moment from 'moment/moment';
import {CountryLimitService} from '../shared/services/country-limit.service';
import {FileService} from '../../../shared/services/file.service';
import {SessionStorageKey} from '../../../shared/constants/session-storage-key';
import {UniStorageService} from '../../../shared/services/uni-storage.service';

@Component({
  selector: 'app-country-limit',
  templateUrl: './country-limit.component.html',
  styleUrls: ['./country-limit.component.scss']
})
export class CountryLimitComponent implements OnInit {
  API_BASE_URL = API_BASE_URL;

  formSearch = this.fb.group({
    countryCode: [],
    'status.code': [this.uniStorageService.getItem(SessionStorageKey.COUNTRY_STATUS)],
  });

  selectConfig = {
    isNewApi: true,
    isSort: true,
    clearable: true,
    closeOnSelect: false
  };

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
  searchCondition: {
    property: string;
    operator: string;
    value: string;
  }[];
  rowSelected = [];

  columns = [
    {
      headerName: 'Mã quốc gia',
      headerProperty: 'countryCode',
      headerIndex: 0,
      className: 'w-50-px',
    },
    // {
    //   headerName: 'Tên quốc gia',
    //   headerProperty: 'countryName',
    //   headerIndex: 1,
    //   className: 'w-80-px',
    // },
    {
      headerName: 'Loại tiền GDP',
      headerProperty: 'countryGdpCurrencyType',
      headerIndex: 2,
      className: 'w-50-px',
    },
    {
      headerName: 'Số tiền GDP',
      headerProperty: 'countryGdpTotalLimit',
      headerIndex: 3,
      className: 'w-100-px',
      type: 'currency'
    },
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
      className: 'w-300-px',
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

  isDisabledUpdate: (row: any) => boolean = (row) => {
    return row.statusCode === 'REJECT';
  };

  constructor(private fb: FormBuilder,
              private dialogService: LpbDialogService,
              private countryLimitService: CountryLimitService,
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
    this.checkboxConfig = {
      clearSelected: true
    };
    this.buildSearchCondition();

  }

  buildSearchCondition(): void {
    this.uniStorageService.setItem(SessionStorageKey.COUNTRY_STATUS, this.formSearch.controls['status.code'].value);
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      console.log('key', key);
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
        } else if (key === 'countryCode') {
          condition.push({
            property: key,
            operator: FilterOperator.IN,
            value: this.formSearch.controls[key].value.toString().trim()
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

  edit(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: ViewMode.UPDATE},
      fragment: 'anchor'
    };
    this.router.navigate([API_BASE_URL + '/country-limit/create'], navigationExtras);
  }

  view(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: ViewMode.VIEW},
      fragment: 'anchor'
    };
    this.router.navigate([API_BASE_URL + '/country-limit/create'], navigationExtras);
  }

  approve(): void {
    this.checkboxConfig = {
      clearSelected: false
    };
    if (this.rowSelected.length === 0) {
      this.customNotificationService.error('Lỗi', 'Bạn phải chọn ít nhất 1 bản ghi');
      return;
    }
    const request = {
      ids: this.rowSelected.map(item => item.id)
    };

    this.countryLimitService.approve(request).subscribe(
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
          this.countryLimitService.reject(request).subscribe(
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
    console.log(this.searchCondition);
    const params = {
      filter: this.fileService.handleValueFilter(this.searchCondition)
    };
    this.fileService.downloadFileMethodGet(
      'money-transfer-limit-service/country-limit/export/excel',
      params
    );
  }
}
