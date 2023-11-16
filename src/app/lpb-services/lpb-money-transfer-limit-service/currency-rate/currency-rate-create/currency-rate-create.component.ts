import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {LbpValidators} from '../../../../shared/validatetors/lpb-validators';
import {LimitService} from '../../../lpb-iname-service/shared/services/limit.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {DecimalPipe} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {CurrencyRateService} from '../../shared/services/currency-rate.service';
import {FormHelpers} from '../../../../shared/utilites/form-helpers';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {API_BASE_URL} from '../../shared/constants/Constants';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {ViewMode} from '../../../../shared/constants/view-mode';
import * as moment from 'moment';
@Component({
  selector: 'app-currency-rate-create',
  templateUrl: './currency-rate-create.component.html',
  styleUrls: ['./currency-rate-create.component.scss']
})
export class CurrencyRateCreateComponent implements OnInit {
  API_BASE_URL = API_BASE_URL;
  ViewMode = ViewMode;
  FormHelpers = FormHelpers;
  minDate = new Date();
  id = '';
  mode = '';
  actions: ActionModel[] = [
    {
      actionName: 'Gửi duyệt',
      actionIcon: 'send',
      actionClick: () => this.onSave(),
    }
  ];
  columns = [
    {
      headerName: 'Loại tiền',
      headerProperty: 'currencyCode',
      headerIndex: 0,
      className: 'w-50-px',
    },
    {
      headerName: 'Tỉ Giá USD/Nguyên tệ',
      headerProperty: 'exchangeRate',
      headerIndex: 1,
      className: 'w-100-px',
    },
    {
      headerName: 'Mô tả',
      headerProperty: 'description',
      headerIndex: 5,
      className: 'w-100-px',
    },
    {
      headerName: 'Người tạo',
      headerProperty: 'createdBy',
      headerIndex: 6,
      className: 'w-50-px',
    },
    {
      headerName: 'Ngày tạo',
      headerProperty: 'createdDate',
      headerIndex: 7,
      className: 'w-50-px',
    },
    {
      headerName: 'Người duyệt',
      headerProperty: 'approveBy',
      headerIndex: 8,
      className: 'w-50-px',
    },
    {
      headerName: 'Ngày duyệt',
      headerProperty: 'approveDate',
      headerIndex: 9,
      className: 'w-50-px',
    },
  ];
  datatableConfig: LpbDatatableConfig = {
    hasNoIndex: true,
    hasSelection: false,
    hiddenActionColumn: true,
    hasPaging: true
  };
  form = this.fb.group({
    currencyCode: [null, [Validators.required, Validators.maxLength(5)]],
    currencyName: [],
    exchangeRate: [null, [Validators.required, Validators.maxLength(15)]],
    startDate: [moment(new Date()).format('DD/MM/yyyy'), Validators.required],
    endDate: [null],
  }, {
    validators: [LbpValidators.dateRangeValidator('startDate', 'endDate')]
  });
  dataSource = [];

  constructor(private fb: FormBuilder,
              private currencyRateService: CurrencyRateService,
              private customNotificationService: CustomNotificationService,
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
    this.onChange();
  }

  onFetch(id, mode): void {
    if (mode === ViewMode.VIEW) {
      this.form.disable();
      this.actions.shift();
    } else if (mode === ViewMode.UPDATE) {
      this.form.get('currencyCode').disable();
    }
    this.currencyRateService.getById(id).subscribe(
      (res) => {

        res = {
          ...res.data
        };
        this.dataSource = res.histories;
        this.form.patchValue(res);
        // this.form.patchValue(res.data);
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
      },
      () => {
      }
    );
  }

  onChange(): void {

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

    this.currencyRateService.createOrUpdate(this.id, request).subscribe(
      (res) => {
        console.log(res);
        this.customNotificationService.handleResponse(res);
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
      },
      () => {
        // this.customNotificationService.success('Thông báo', message);
        this.form.disable();
        this.actions.shift();
      }
    );
    // console.log(this.form.value);
  }


}
