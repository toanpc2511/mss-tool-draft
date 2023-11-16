import {Component, OnInit} from '@angular/core';
import {API_BASE_URL} from '../../shared/constants/Constants';
import {ViewMode} from '../../../../shared/constants/view-mode';
import {FormArray, FormBuilder, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {LbpValidators} from '../../../../shared/validatetors/lpb-validators';
import {FormHelpers} from '../../../../shared/utilites/form-helpers';
import {CountryLimitService} from '../../shared/services/country-limit.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {ActivatedRoute} from '@angular/router';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {CustomerPassportService} from '../../shared/services/customer-passport.service';
import {LpbDatatableConfig} from '../../../../shared/models/LpbDatatableConfig';
import {LpbStringUtil} from '../../../../shared/utilites/LpbStringUtil';

@Component({
  selector: 'app-customer-passport-create',
  templateUrl: './customer-passport-create.component.html',
  styleUrls: ['./customer-passport-create.component.scss']
})
export class CustomerPassportCreateComponent implements OnInit {
  API_BASE_URL = API_BASE_URL;
  FormHelpers = FormHelpers;
  ViewMode = ViewMode;
  form = this.fb.group({
    customerName: [null, [Validators.required, Validators.maxLength(100)]],
    customerPassports: this.fb.array([], this.passportDuplicate())
  });
  mode = '';
  id = '';
  dataSource = [];
  actions: ActionModel[] = [
    {
      actionName: 'Gửi duyệt',
      actionIcon: 'send',
      actionClick: () => this.onSave(),
    }
  ];

  datatableConfig: LpbDatatableConfig = {
    hasNoIndex: true,
    hasSelection: false,
    hiddenActionColumn: true,
    hasPaging: true
  };

  columns = [
    {
      headerName: 'Tên khách hàng',
      headerProperty: 'customerName',
      headerIndex: 0,
      className: 'w-50-px',
    },
    {
      headerName: 'Hộ chiếu',
      headerProperty: 'customerPassport',
      headerIndex: 1,
      className: 'w-50-px',
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

  constructor(private fb: FormBuilder,
              private customerPassportService: CustomerPassportService,
              private customNotificationService: CustomNotificationService,
              private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.mode = params.mode;
      if (this.id) {
        this.onFetch(this.id, this.mode);
      }
      if (params.mode !== ViewMode.VIEW && params.mode !== ViewMode.UPDATE) {
        this.addRow('');
      }
    });
  }

  get registerForm(): any {
    return this.form.controls;
  }

  get customerPassports(): FormArray {
    return this.form.controls.customerPassports as FormArray;
  }

  onFetch(id, mode): void {
    if (mode === ViewMode.VIEW) {
      this.form.disable();
      this.actions.shift();
    }
    // let infoMessage = '';
    this.customerPassportService.getById(id).subscribe(
      (res) => {
        const data = {
          ...res.data
        };
        this.dataSource = data.histories;
        this.form.patchValue(data);
        res.data.customerPassport.split(',').forEach(passport => {
          this.addRow(passport);
        });
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
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const request = {
      ...this.form.getRawValue(),
      customerPassport: this.form.value.customerPassports.toString()
    };


    this.customerPassportService.createOrUpdate(this.id, request).subscribe(
      (res) => {
        this.customNotificationService.handleResponse(res);
      },
      (error) => {
        this.customNotificationService.error('Lỗi', error?.message);
      },
      () => {
        // this.customNotificationService.success('Thông báo', message);
        this.form.disable();
        this.actions.shift();
        this.mode = ViewMode.VIEW;
      }
    );
    // console.log(this.form.value);
  }

  deleteRow(rowIndex: number): void {
    this.customerPassports.removeAt(rowIndex);
  }

  addRow(value = ''): void {
    if (this.customerPassports.length < 5) {
      const user = this.fb.control({
        value,
        disabled: this.mode === ViewMode.VIEW
      }, [Validators.required, Validators.maxLength(20)]);
      this.customerPassports.push(user);
    } else {
      this.customNotificationService.warning('Cảnh báo', 'Bạn chỉ thêm được tối đa 5 hộ chiếu');
    }

  }

  passportDuplicate(): any {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value);
      let count = 0;
      // console.log(totalSelected);
      count = totalSelected.filter((ele, indx) => totalSelected[indx] && indx !== totalSelected.indexOf(ele)).length;
      return (count > 0) ? {duplicate: true} : null;
    };
    return validator;
  }

  onPaste(event, control: FormControl): void {
    let str = '';
    if (!str) {
      str = event.clipboardData.getData('text/plain');
    }
    str = LpbStringUtil.removeUnicodeAndSpace(str);
    control.setValue(str.toUpperCase());
    event.preventDefault();
    // console.log(event);
  }
  onInput(event, control: FormControl): void {
    let str = event.target.value;
    str = LpbStringUtil.removeUnicodeAndSpace(str);
    control.setValue(str.toUpperCase());
    // event.preventDefault();

  }
}
