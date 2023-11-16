import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {CountryLimitService} from '../../shared/services/country-limit.service';
import {TransactionService} from '../../shared/services/transaction.service';
import {IError} from '../../../../system-configuration/shared/models/error.model';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {CustomConfirmDialogComponent} from '../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {LpbDatatableColumn} from '../../../../shared/models/LpbDatatableColumn';

@Component({
  selector: 'app-transaction-import',
  templateUrl: './transaction-import.component.html',
  styleUrls: ['./transaction-import.component.scss']
})
export class TransactionImportComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private customNotificationService: CustomNotificationService,
              private matDialog: MatDialog,
              private transactionService: TransactionService) {
  }

  totalValid = 0;
  totalInvalid = 0;
  fileName!: string;
  dataSource: any = [];
  filesUpload: any;
  dragAreaClass: string;
  actions: ActionModel[] = [];
  datatableConfig: LpbDatatableConfig = {
    filterDefault: ``,
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: false,
    hiddenActionColumn: true,
  };

  getBgColor = (row, columnName) => {
    let bgColor = '';
    if (row?.errorColumn?.includes(columnName)) {
      bgColor = 'bg-warning';
    }
    // console.log(row);
    return bgColor;
  };


  columns: LpbDatatableColumn[] = [
    {
      headerName: 'Mã giao dịch',
      headerProperty: 'transId',
      headerIndex: 0,
      className: 'w-80-px',
      bgColor: this.getBgColor
    },
    {
      headerName: 'Ngày giao dịch',
      headerProperty: 'transDate',
      headerIndex: 1,
      className: 'w-100-px',
      bgColor: this.getBgColor
    },
    {
      headerName: 'Số tiền',
      headerProperty: 'amount',
      headerIndex: 2,
      className: 'w-60-px',
      bgColor: this.getBgColor
    },
    {
      headerName: 'Loại tiền',
      headerProperty: 'transCurrencyType',
      headerIndex: 3,
      className: 'w-40-px',
      bgColor: this.getBgColor
    },
    {
      headerName: 'Tên khách hàng',
      headerProperty: 'customerName',
      headerIndex: 4,
      className: 'w-50-px font-weight-bold',
      bgColor: this.getBgColor
    },
    {
      headerName: 'Số Hộ chiếu',
      headerProperty: 'customerPassport',
      headerIndex: 5,
      className: 'w-50-px font-weight-bold',
      bgColor: this.getBgColor
    },
    {
      headerName: 'Mã quốc gia',
      headerProperty: 'countryCode',
      headerIndex: 6,
      className: 'w-50-px',
      bgColor: this.getBgColor
    },
    // {
    //   headerName: 'Mã Loại giao dịch',
    //   headerProperty: 'transTypeCode',
    //   headerIndex: 7,
    //   className: 'w-50-px',
    //   bgColor: this.getBgColor
    // },
    {
      headerName: 'Loại giao dịch',
      headerProperty: 'transTypeCode',
      headerIndex: 8,
      className: 'w-50-px',
      bgColor: this.getBgColor
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'transStatus',
      headerIndex: 9,
      className: 'w-50-px',
      bgColor: this.getBgColor
    },
    {
      headerName: 'Mô tả',
      headerProperty: 'errorDes',
      headerIndex: 10,
      className: 'w-300-px',
      innerHtml: true
    }
  ];


  ngOnInit(): void {
  }

  onSelectedFile($event): void {
    const inputElement = $event.target as HTMLInputElement;
    const files = Array.from(inputElement.files);
    if (files.length <= 0) {
      return;
    }
    if (files[0].size > 10485760) {
      this.customNotificationService.error('Lỗi', 'File vượt quá 10MB!');
      return;
    }
    if (files[0].type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      this.customNotificationService.error('Lỗi', 'File không đúng định dạng, vui lòng thử lại!');
      return;
    }
    this.fileName = files[0].name;

    this.uploadFile(files);
    $event.target.value = null;
  }

  uploadFile(files): void {
    this.filesUpload = files;
    this.dataSource = [];
    const formData = new FormData();
    formData.append('file', files[0]);
    this.transactionService.getDataImport(formData).pipe().subscribe((res) => {
      this.actions = [];
      if (res) {
        this.dataSource = res.data;
        this.totalValid = res.data.filter(e => !e.errorColumn)?.length;
        this.totalInvalid = res.data.filter(e => e.errorColumn)?.length;

        if (this.totalInvalid > 0) {
          this.actions.push({
            actionName: 'Gửi duyệt',
            actionIcon: 'send',
            actionClick: () => this.onSubmit(),
            hiddenType: 'disable'
          });
          // this.actions[0].hiddenType = 'disable';
        } else {
          this.actions.push({
            actionName: 'Gửi duyệt',
            actionIcon: 'send',
            actionClick: () => this.onSubmit(),
            hiddenType: 'none'
          });
        }
        this.customNotificationService.handleResponse(res);
      }
    }, (error: IError) => this.customNotificationService.handleErrors(error));
  }

  onSubmit(): void {
    if (!this.filesUpload) {
      this.customNotificationService.warning('Cảnh báo', 'Vui lòng chọn file đối soát');
      return;
    } else {
      if (this.dataSource.length === 0) {
        this.customNotificationService.warning('Cảnh báo', 'File phải có ít nhất 1 bản ghi');
        return;
      }
    }
    const confirmDialog = this.matDialog.open(CustomConfirmDialogComponent, {
      width: '40%',
      autoFocus: false,
      data: {
        type: '',
        title: 'Xác nhận',
        message: `Bạn chắc chắn muốn gửi duyệt không ?`,
      },
    });
    confirmDialog.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.transactionService.saveDataImport(this.dataSource).subscribe(
          (res) => {

            console.log('test');
            this.customNotificationService.handleResponse(res);
          },
          (error) => {
            if (error?.message) {
              this.customNotificationService.error('Thông báo', error?.message);
            }

          },
          () => {
            // this.customNotificationService.success('Thông báo', message);
            this.actions.shift();

          }
        );
      }
    });

  }
}
