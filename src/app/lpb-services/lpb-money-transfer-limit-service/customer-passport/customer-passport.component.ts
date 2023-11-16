import {Component, OnInit} from '@angular/core';
import {CurrencyRateStatus} from '../shared/constants/currency-rate-status';
import {FormBuilder} from '@angular/forms';
import {LpbDialogService} from '../../../shared/services/lpb-dialog.service';
import {MatDialog} from '@angular/material/dialog';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {NavigationExtras, Router} from '@angular/router';
import {API_BASE_URL} from '../shared/constants/Constants';
import {FilterOperator} from '../../../shared/constants/filter-operator';
import * as moment from 'moment';
import {LpbDatatableConfig} from '../../../shared/models/LpbDatatableConfig';
import {ViewMode} from '../../../shared/constants/view-mode';
import {CustomerPassportService} from '../shared/services/customer-passport.service';
import {CurrencyRateRejectComponent} from '../currency-rate/currency-rate-reject/currency-rate-reject.component';
import {DialogConfig} from '../../../_utils/_dialogConfig';
import {FileService} from '../../../shared/services/file.service';
import {UniStorageService} from '../../../shared/services/uni-storage.service';
import {SessionStorageKey} from '../../../shared/constants/session-storage-key';

@Component({
  selector: 'app-customer-passport',
  templateUrl: './customer-passport.component.html',
  styleUrls: ['./customer-passport.component.scss']
})
export class CustomerPassportComponent implements OnInit {
  API_BASE_URL = API_BASE_URL;
  rowSelected = [];
  // protected readonly FormHelpers = FormHelpers;
  formSearch = this.fb.group({
    customerName: [],
    customerPassport: [],
    'status.code': [this.uniStorageService.getItem(SessionStorageKey.CUSTOMER_PASSPORT_STATUS)],
  });

  selectConfig = {
    isNewApi: true,
    isSort: true,
    closeOnSelect: false
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
  filterDefault = 'deleted|eq|0&status.code|eq|' + CurrencyRateStatus.APPROVED;
  datatableConfig: LpbDatatableConfig = {
    hasNoIndex: true,
    hasPaging: true,
    hasSelection: true,
    filterDefault: this.filterDefault,
    defaultSort: '',
    hasAddtionButton: true,
    isDisableRow: (row) => {
      return !row.check;
    },

  };
  columns = [
    {
      headerName: 'Chi nhánh',
      headerProperty: 'branchCode',
      headerIndex: -1,
      className: 'w-100-px',
    },
    {
      headerName: 'Tên khách hàng',
      headerProperty: 'customerName',
      headerIndex: 0,
      className: 'w-200-px',
    },
    {
      headerName: 'Hộ chiếu',
      headerProperty: 'customerPassport',
      headerIndex: 1,
      className: 'w-200-px',
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
    return !row.edit;
  };

  constructor(private fb: FormBuilder,
              private dialogService: LpbDialogService,
              private customerPassportService: CustomerPassportService,
              private dialog: MatDialog,
              private customNotificationService: CustomNotificationService,
              private uniStorageService: UniStorageService,
              private fileService: FileService,
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

  chkAll(rowSelected): void {
    this.rowSelected = rowSelected;
  }


  buildSearchCondition(): void {
    this.uniStorageService.setItem(SessionStorageKey.CUSTOMER_PASSPORT_STATUS , this.formSearch.controls['status.code'].value);
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      if (this.formSearch.controls[key].value) {
        if (key === 'status.code' && this.formSearch.controls[key].value.length > 0) {
          condition.push({
            property: key,
            operator: FilterOperator.IN,
            value: this.formSearch.controls[key].value
          });
        } else if (key !== 'status.code') {
          condition.push({
            property: key,
            operator: FilterOperator.LIKE,
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

  edit(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: ViewMode.UPDATE},
      fragment: 'anchor'
    };
    this.router.navigate([API_BASE_URL + '/customer-passport/create'], navigationExtras);
  }

  view(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: ViewMode.VIEW},
      fragment: 'anchor'
    };
    this.router.navigate([API_BASE_URL + '/customer-passport/create'], navigationExtras);
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

    this.customerPassportService.approve(request).subscribe(
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
          this.customerPassportService.reject(request).subscribe(
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
      'money-transfer-limit-service/customer-passport/export/excel',
      params
    );
  }

}
