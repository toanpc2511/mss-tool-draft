import {Component, OnInit} from '@angular/core';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {FormBuilder, Validators} from '@angular/forms';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {ActivatedRoute} from '@angular/router';
import {FormHelpers} from '../../../../shared/utilites/form-helpers';
import {LimitService} from '../../shared/services/limit.service';
import {LbpValidators} from '../../../../shared/validatetors/lpb-validators';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-limit-create',
  templateUrl: './limit-create.component.html',
  styleUrls: ['./limit-create.component.scss']
})
export class LimitCreateComponent implements OnInit {
  minDate = new Date();
  FormHelpers = FormHelpers;
  limitTypes = [];
  actions: ActionModel[] = [
    {
      actionName: 'Lưu',
      actionIcon: 'send',
      actionClick: () => this.onSave(),
    }
  ];
  form = this.fb.group({
    characterName: [null, [Validators.required, Validators.maxLength(20)]],
    limitTypeId: [null, Validators.required],
    customerTypeId: [null],
    methodTypeId: [null, Validators.required],
    startDate: [null, Validators.required],
    endDate: [null],
    price: [null]
  }, {
    validators: [LbpValidators.dateRangeValidator('startDate', 'endDate')]
  });
  id = '';
  mode = '';
  isBeautyNumber = false;
  constructor(private fb: FormBuilder,
              private limitService: LimitService,
              private customNotificationService: CustomNotificationService,
              private numberPipe: DecimalPipe,
              private route: ActivatedRoute) {

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

  get registerForm(): any {
    return this.form.controls;
  }

  onFetch(id, mode): void {
    this.limitService.getById(id).subscribe(
      (res) => {
        res = {
          ...res.data,
          price: this.numberPipe.transform(res.data.price, '1.0')
        };
        this.form.patchValue(res);
        // this.form.patchValue(res.data);
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
      },
      () => {

        if (mode === 'view') {
          this.form.disable();
          this.actions.shift();
        }
        // this.customNotificationService.success('Thông báo', message);

      }
    );
  }

  onChange(): void {
    this.form.get('limitTypeId').valueChanges.subscribe(value => {
      const limitCode = this.limitTypes.find(item => item.id === value).code;

      if (limitCode === '2' || limitCode === '3') {
          this.isBeautyNumber = true;
          this.form.get('price').setValidators(Validators.required);
          this.form.get('price').updateValueAndValidity();
      } else {
          this.isBeautyNumber = false;
          this.form.get('price').clearValidators();
          this.form.get('price').updateValueAndValidity();
      }
    });
  }

  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const request = {
      ...this.form.value,
      price: this.form.value.price?.toString().replaceAll('.', '')
    };

    this.limitService.createOrUpdate(this.id, request).subscribe(
      (res) => {
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

  handleDataSelect({data, setData}): void {
    this.limitTypes = data;
    const beautyNumber = data?.filter((e) => true);
    // console.log(beautyNumber);
    setData(beautyNumber);
  }
}
