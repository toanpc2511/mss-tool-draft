import { Component, OnInit } from '@angular/core';
import {API_BASE_URL} from '../../shared/constants/Constants';
import {FormHelpers} from '../../../../shared/utilites/form-helpers';
import {FormBuilder, Validators} from '@angular/forms';
import {LbpValidators} from '../../../../shared/validatetors/lpb-validators';
import {CurrencyRateService} from '../../shared/services/currency-rate.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {ActivatedRoute} from '@angular/router';
import {ViewMode} from '../../../../shared/constants/view-mode';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {CountryLimitService} from '../../shared/services/country-limit.service';
import * as moment from 'moment';

@Component({
  selector: 'app-country-limit-create',
  templateUrl: './country-limit-create.component.html',
  styleUrls: ['./country-limit-create.component.scss']
})
export class CountryLimitCreateComponent implements OnInit {
  API_BASE_URL = API_BASE_URL;
  FormHelpers = FormHelpers;
  ViewMode = ViewMode;
  form = this.fb.group({
    countryCode: [null, [Validators.required]],
    countryGdpTotalLimit: [null, [Validators.required, Validators.maxLength(15)]],
    countryGdpCurrencyType: [{value: 'USD', disabled: true}],
    startDate: [moment(new Date()).format('DD/MM/yyyy'), Validators.required],
    endDate: [null],
  }, {
    validators: [LbpValidators.dateRangeValidator('startDate', 'endDate')]
  });
  actions: ActionModel[] = [
    {
      actionName: 'Gửi duyệt',
      actionIcon: 'send',
      actionClick: () => this.onSave(),
    }
  ];
  minDate = new Date();
  mode = '';
  id = '';
  dataSource = [];
  columns = [
    {
      headerName: 'Mã quốc gia',
      headerProperty: 'countryCode',
      headerIndex: 0,
      className: 'w-50-px',
    },
    {
      headerName: 'Tên quốc gia',
      headerProperty: 'countryName',
      headerIndex: 1,
      className: 'w-50-px',
    },
    {
      headerName: 'Loại tiền GDP',
      headerProperty: 'countryGdpCurrencyType',
      headerIndex: 2,
      className: 'w-100-px',
    },
    {
      headerName: 'Số tiền GDP',
      headerProperty: 'countryGdpTotalLimit',
      headerIndex: 3,
      className: 'w-100-px',
    },
    {
      headerName: 'Trạng thái',
      headerProperty: 'statusName',
      headerIndex: 4,
      className: 'w-50-px font-weight-bold',
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
  constructor(private fb: FormBuilder,
              private countryLimitService: CountryLimitService,
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
  }

  onFetch(id, mode): void {
    if (mode === ViewMode.VIEW) {
      this.form.disable();
      this.actions.shift();
    } else if (mode === ViewMode.UPDATE) {
      this.form.get('countryCode').disable();
    }
    // let infoMessage = '';
    this.countryLimitService.getById(id).subscribe(
      (res) => {
        const data = {
          ...res.data
        };
        this.dataSource = data.histories;
        this.form.patchValue(data);
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

    this.countryLimitService.createOrUpdate(this.id, request).subscribe(
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

}
