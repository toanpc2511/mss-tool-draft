import {Component, OnInit} from '@angular/core';
import {ViewMode} from '../../../../shared/constants/view-mode';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import * as moment from 'moment/moment';
import {LbpValidators} from '../../../../shared/validatetors/lpb-validators';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {ActivatedRoute} from '@angular/router';
import {TransactionService} from '../../shared/services/transaction.service';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {FormHelpers} from '../../../../shared/utilites/form-helpers';
import {API_BASE_URL} from '../../shared/constants/Constants';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {DecimalPipe} from '@angular/common';
import {LpbStringUtil} from '../../../../shared/utilites/LpbStringUtil';
import { isKSPAdmin } from 'src/app/shared/utilites/role-check';
@Component({
  selector: 'app-transaction-edit',
  templateUrl: './transaction-edit.component.html',
  styleUrls: ['./transaction-edit.component.scss']
})
export class TransactionEditComponent implements OnInit {
  FormHelpers = FormHelpers;
  API_BASE_URL = API_BASE_URL;
  ViewMode = ViewMode;
  mode = '';
  id = '';
  dataSource = [];
  form = this.fb.group({
    transId: [{value: '', disabled: true}],
    transTypeName: [{value: '', disabled: true}],
    transDate: [{value: '', disabled: true}],
    transCurrencyType: [{value: '', disabled: true}],
    customerPassport: [{value: '', disabled: isKSPAdmin}, [Validators.required, Validators.maxLength(20)]],
    amount: [{value: '', disabled: !isKSPAdmin}],
    countryCode: [{value: '', disabled: isKSPAdmin}, [Validators.required]],
  });

  actions: ActionModel[] = [
    {
      actionName: 'Gửi duyệt',
      actionIcon: 'send',
      actionClick: () => this.onSave(),
    }
  ];
  columns = [
    {
      headerName: 'Mã giao dịch',
      headerProperty: 'transId',
      headerIndex: 0,
      className: 'w-200-px',
    },
    // {
    //   headerName: 'Loại giao dịch',
    //   headerProperty: 'transTypeName',
    //   headerIndex: 1,
    //   className: 'w-50-px',
    // },
    // {
    //   headerName: 'Ngày giao dịch',
    //   headerProperty: 'transDate',
    //   headerIndex: 2,
    //   className: 'w-100-px',
    // },
    // {
    //   headerName: 'Loại tiền',
    //   headerProperty: 'transCurrencyType',
    //   headerIndex: 3,
    //   className: 'w-40-px',
    // },
    {
      headerName: 'Số Hộ chiếu',
      headerProperty: 'customerPassport',
      headerIndex: 4,
      className: 'w-200-px font-weight-bold',
    },
    // {
    //   headerName: 'Số tiền',
    //   headerProperty: 'amount',
    //   headerIndex: 5,
    //   className: 'w-100-px',
    // },
    {
      headerName: 'Mã quốc gia',
      headerProperty: 'countryCode',
      headerIndex: 5,
      className: 'w-100-px',
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'statusName',
      headerIndex: 6,
      className: 'w-100-px font-weight-bold',
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
      headerIndex: 7,
      className: 'w-100-px',
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 8,
      className: 'w-100-px',
    },
    {
      headerName: 'Người sửa',
      headerProperty: 'lastModifiedBy',
      headerIndex: 9,
      className: 'w-100-px',
    },
    {
      headerName: 'Ngày sửa',
      headerProperty: 'lastModifiedDate',
      headerIndex: 10,
      className: 'w-100-px',
    },
    {
      headerName: 'Người duyệt',
      headerProperty: 'approveBy',
      headerIndex: 11,
      className: 'w-100-px',
    },
    {
      headerName: 'Ngày duyệt',
      headerProperty: 'approveDate',
      headerIndex: 12,
      className: 'w-100-px',
    },
    {
      headerName: 'Nguồn dữ liệu',
      headerProperty: 'sourceData',
      headerIndex: 13,
      className: 'w-100-px',
    },
  ];
  datatableConfig: LpbDatatableConfig = {
    hasNoIndex: true,
    hasSelection: false,
    hiddenActionColumn: true,
    hasPaging: true
  };

  constructor(private fb: FormBuilder,
              private transactionService: TransactionService,
              private customNotificationService: CustomNotificationService,
              private numberPipe: DecimalPipe,
              private route: ActivatedRoute) {

  }

  get registerForm(): any {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.mode = params.mode;
      if (this.id) {
        this.onFetch(this.id, this.mode);
      }
    });
  }

  onFetch(id, mode): void {
    if (mode === ViewMode.VIEW) {
      this.form.disable();
      this.actions.shift();

    } else if (mode === ViewMode.UPDATE) {
      // this.form.get('countryCode').disable();
    }
    // let infoMessage = '';
    this.transactionService.getById(id).subscribe(
      (res) => {
        const data = {
          ...res.data
        };
        this.dataSource = data.histories;
        this.form.patchValue(data);
        this.form.get('amount').setValue(this.numberPipe.transform(this.form.get('amount').value, '1.0-10'));
        this.customNotificationService.handleResponse(res);
        // this.form.patchValue(res.data);
      },
      (error) => {
        this.customNotificationService.error('Lỗi', error?.message);
      },
      () => {
        // this.customNotificationService.success('Thông báo', infoMessage);
      }
    );
  }

  onSave(): void {
    console.log('test', this.form.invalid);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const request = {
      ...this.form.getRawValue()
    };

    this.transactionService.update(this.id, request).subscribe(
      (res) => {
        console.log(res);
        this.customNotificationService.handleResponse(res);
      },
      (error) => {
        this.customNotificationService.error('Lỗi', error?.message);
      },
      () => {
        // this.customNotificationService.success('Thông báo', message);
        this.form.disable();
        this.actions.shift();
      }
    );
    // console.log(this.form.value);
  }

  onInput(event, control: FormControl): void {
    let str = event.target.value;
    str = LpbStringUtil.removeUnicodeAndSpace(str);
    console.log(str);
    control.setValue(str.toUpperCase());
    // event.preventDefault();

  }

}
