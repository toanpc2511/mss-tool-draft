import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {CurrencyRateService} from '../../shared/services/currency-rate.service';
import {CountryLimitService} from '../../shared/services/country-limit.service';
import {IError} from '../../../../system-configuration/shared/models/error.model';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {CustomConfirmDialogComponent} from '../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-country-limit-import',
  templateUrl: './country-limit-import.component.html',
  styleUrls: ['./country-limit-import.component.scss']
})
export class CountryLimitImportComponent implements OnInit {
  fileName!: string;
  dataSource: any = [];
  filesUpload: any;
  dragAreaClass: string;
  actions: ActionModel[] = [
    {
      actionName: 'Gửi duyệt',
      actionIcon: 'send',
      actionClick: () => this.onSubmit()
    },
  ];
  datatableConfig: LpbDatatableConfig = {
    filterDefault: ``,
    defaultSort: '',
    hasSelection: false,
    hasNoIndex: true,
    hasPaging: false,
    hiddenActionColumn: true,
  };

  columns = [
    {
      headerName: 'Loại tiền',
      headerProperty: 'countryCode',
      headerIndex: 0,
      className: 'w-50-px',
    },
    {
      headerName: 'Số tiền GDP',
      headerProperty: 'countryGdpTotalLimit',
      headerIndex: 1,
      className: 'w-100-px',
    },
    {
      headerName: 'Loại tiền GDP',
      headerProperty: 'countryGdpCurrencyType',
      headerIndex: 2,
      className: 'w-100-px',
    },
  ];

  constructor(private fb: FormBuilder,
              private customNotificationService: CustomNotificationService,
              private matDialog: MatDialog,
              private countryLimitService: CountryLimitService) {
  }

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
    this.countryLimitService.import(formData).pipe().subscribe((res) => {
      if (res) {
        this.dataSource = res.data;
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
        this.countryLimitService.saveAll(this.dataSource).subscribe(
          (res) => {

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
