import {Component, OnInit} from '@angular/core';
import {API_BASE_URL} from '../shared/constants/Constants';
import {FormBuilder} from '@angular/forms';
import {ILpbDialog, LpbDialogService} from '../../../shared/services/lpb-dialog.service';
import {CountryLimitService} from '../shared/services/country-limit.service';
import {MatDialog} from '@angular/material/dialog';
import {CustomNotificationService} from '../../../shared/services/custom-notification.service';
import {NavigationExtras, Router} from '@angular/router';
import {LpbDatatableConfig} from '../../../shared/models/LpbDatatableConfig';
import {ViewMode} from '../../../shared/constants/view-mode';
import {CurrencyRateRejectComponent} from '../currency-rate/currency-rate-reject/currency-rate-reject.component';
import {DialogConfig} from '../../../_utils/_dialogConfig';
import {TransactionStatus} from '../shared/constants/transaction-status';
import {FilterOperator} from '../../../shared/constants/filter-operator';
import {TransactionService} from '../shared/services/transaction.service';
import * as moment from 'moment';
import {FileService} from '../../../shared/services/file.service';
import {UniStorageService} from '../../../shared/services/uni-storage.service';
import {SessionStorageKey} from '../../../shared/constants/session-storage-key';
import {LpbDatatableColumn} from '../../../shared/models/LpbDatatableColumn';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  API_BASE_URL = API_BASE_URL;

  formSearch = this.fb.group({
    transId: [],
    customerPassport: [],
    transType: [],
    status: [this.uniStorageService.getItem(SessionStorageKey.TRANSACTION_STATUS)],
    fromDate: [],
    toDate: []
  });
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
  selectConfig = {
    isNewApi: true,
    isSort: true
  };
  columns: LpbDatatableColumn[] = [
    {
      headerName: 'Mã giao dịch',
      headerProperty: 'transId',
      headerIndex: 0,
      className: 'w-200-px',
    },
    {
      headerName: 'Chi nhánh',
      headerProperty: 'branchCode',
      headerIndex: 0,
      className: 'w-100-px',
    },
    {
      headerName: 'Loại giao dịch',
      headerProperty: 'transTypeName',
      headerIndex: 1,
      className: 'w-200-px text-break',
    },
    {
      headerName: 'Ngày giao dịch',
      headerProperty: 'transDate',
      headerIndex: 2,
      className: 'w-200-px',
    },

    {
      headerName: 'Tên khách hàng',
      headerProperty: 'customerName',
      headerIndex: 3,
      className: 'w-200-px text-break',
    },
    {
      headerName: 'Số Hộ chiếu',
      headerProperty: 'customerPassport',
      headerIndex: 4,
      className: 'w-100-px font-weight-bold',
    },
    {
      headerName: 'Số tiền',
      headerProperty: 'amount',
      headerIndex: 5,
      className: 'w-150-px',
      type: 'currency'
    },
    {
      headerName: 'Loại tiền',
      headerProperty: 'transCurrencyType',
      headerIndex: 6,
      className: 'w-150-px',
    },
    {
      headerName: 'Mã quốc gia',
      headerProperty: 'countryCode',
      headerIndex: 7,
      className: 'w-100-px',
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'statusName',
      headerIndex: 8,
      className: 'w-200-px font-weight-bold text-break text-uppercase',
    },
    {
      headerName: 'Mô tả',
      headerProperty: 'description',
      headerIndex: 8,
      className: 'w-400-px text-break',
      innerHtml: true
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 9,
      className: 'w-100-px',
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 10,
      className: 'w-100-px',
    },
    {
      headerName: 'Người duyệt',
      headerProperty: 'approveBy',
      headerIndex: 13,
      className: 'w-100-px',
    },
    {
      headerName: 'Ngày duyệt',
      headerProperty: 'approveDate',
      headerIndex: 14,
      className: 'w-100-px',
    },
    {
      headerName: 'Người sửa',
      headerProperty: 'lastModifiedBy',
      headerIndex: 11,
      className: 'w-100-px',
    },
    {
      headerName: 'Ngày sửa',
      headerProperty: 'lastModifiedDate',
      headerIndex: 12,
      className: 'w-100-px',
    },
    // {
    //   headerName: 'Nguồn dữ liệu',
    //   headerProperty: 'sourceData',
    //   headerIndex: 13,
    //   className: 'w-50-px',
    // },
  ];
  filterDefault = 'deleted|eq|0';
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
    rowBgColor: (row) => {
      let bgColor = '';
      if (row.statusCode === 'TRANS_REJECT') {
        bgColor = 'bg-grey';
      }
      // console.log(row);
      return bgColor;
    }
  };

  isDisabledUpdate: (row: any) => boolean = (row) => {
    return !row.edit;
  };

  constructor(private fb: FormBuilder,
              private dialogService: LpbDialogService,
              private transactionService: TransactionService,
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
    this.searchCondition = this.buildSearchCondition();

  }

  buildSearchCondition(): any {
    this.uniStorageService.setItem(SessionStorageKey.TRANSACTION_STATUS, this.formSearch.get('status').value);
    const condition = [];
    Object.keys(this.formSearch.controls).forEach(key => {
      let operator = FilterOperator.EQUAL;
      let value = this.formSearch.controls[key].value;
      let propertyKey = key;
      if (this.formSearch.controls[key].value) {
        if (key === 'transType') {
          operator = FilterOperator.IN;
        } else if (key === 'fromDate') {
          operator = FilterOperator.GREATER_THAN_EQUAL;
          propertyKey = 'transDate';
          value = this.formSearch.controls[key].value ? moment(this.formSearch.controls[key].value, 'DD/MM/YYYY').format('YYYY-MM-DD') + ' 00:00:00' : '';
        } else if (key === 'toDate') {
          operator = FilterOperator.LESSER_THAN_EQUAL;
          propertyKey = 'transDate';
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
    condition.push({
      property: 'deleted',
      operator: FilterOperator.EQUAL,
      value: '0'
    });
    return condition;
  }

  chkAll(rowSelected): void {
    this.rowSelected = rowSelected;
  }

  edit(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: ViewMode.UPDATE},
      fragment: 'anchor'
    };
    this.router.navigate([API_BASE_URL + '/transaction/create'], navigationExtras);
  }

  view(rowData): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {id: rowData.id, mode: ViewMode.VIEW},
      fragment: 'anchor'
    };
    this.router.navigate([API_BASE_URL + '/transaction/create'], navigationExtras);
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

    this.transactionService.approve(request).subscribe(
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
          this.transactionService.reject(request).subscribe(
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
      filter: this.fileService.handleValueFilter(this.buildSearchCondition())
    };
    this.fileService.downloadFileMethodGet(
      'money-transfer-limit-service/transaction/export/excel',
      params
    );
  }

  downloadTemplate(): void {
    this.fileService.downloadFileMethodGet('money-transfer-limit-service/transaction/download/template');
  }

  downloadError(): void {
    this.fileService.downloadFileMethodGet('money-transfer-limit-service/transaction/export/error');
  }

  delete(rowData): void {
    const dialogParams: ILpbDialog = {
      messages: ['Bạn có chắc muốn xóa bản ghi?'],
      title: 'Xác nhận xóa',
    };
    this.dialogService.openDialog(dialogParams, () => {
      this.transactionService
        .delete(rowData.id)
        .pipe(
          finalize(() => {
            // this is called on both success and error
            this.buildSearchCondition();
          })
        )
        .subscribe(
          (res) => {
            if (res && res.meta.message) {
              this.customNotificationService.success(
                'Thông báo',
                res.meta.message
              );
            } else {
              if (res.meta) {
                this.customNotificationService.warning('Thông báo', res.meta.message);
              } else {
                this.customNotificationService.handleErrors();
              }
            }
          },
          (error) => {
            if (error) {
              this.customNotificationService.handleErrors(error);
            } else {
              this.customNotificationService.handleErrors();
            }
          },
          () => {
          }
        );
    });
  }
}
