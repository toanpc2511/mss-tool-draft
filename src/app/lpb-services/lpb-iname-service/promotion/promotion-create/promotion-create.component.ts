import {Component, OnInit} from '@angular/core';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {FormBuilder, Validators} from '@angular/forms';
import {LimitService} from '../../shared/services/limit.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {ActivatedRoute} from '@angular/router';
import {FormHelpers} from '../../../../shared/utilites/form-helpers';
import {PromotionService} from '../../shared/services/promotion.service';
import {DecimalPipe} from '@angular/common';
import {LbpValidators} from '../../../../shared/validatetors/lpb-validators';

@Component({
  selector: 'app-promotion-create',
  templateUrl: './promotion-create.component.html',
  styleUrls: ['./promotion-create.component.scss']
})
export class PromotionCreateComponent implements OnInit {

  minDate = new Date();
  FormHelpers = FormHelpers;
  actions: ActionModel[] = [
    {
      actionName: 'Lưu',
      actionIcon: 'send',
      actionClick: () => this.onSave(),
    }
  ];
  form = this.fb.group({
    code: [null, [Validators.required, Validators.maxLength(20)]],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    packingId: [null],
    customerTypeId: [null],
    discountRate: [null, Validators.max(100)],
    discountAmount: [null],
    startDate: [null, Validators.required],
    endDate: [null]
  }, {
    validators: [LbpValidators.dateRangeValidator('startDate', 'endDate')]
  });
  id = '';
  mode = '';

  constructor(private fb: FormBuilder,
              private promotionService: PromotionService,
              private customNotificationService: CustomNotificationService,
              private numberPipe: DecimalPipe,
              private route: ActivatedRoute,
              ) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params.id;
      this.mode = params.mode;
      if (this.id) {
        this.onFetch(this.id, this.mode);
      }
    });
    this.onValuesChange();
  }

  get registerForm(): any {
    return this.form.controls;
  }

  onFetch(id, mode): void {
    this.promotionService.getById(id).subscribe(
      (res) => {
        res = {
          ... res.data,
          discountAmount: this.numberPipe.transform(res.data.discountAmount, '1.0')
        };
        this.form.patchValue(res);
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
      },
      () => {
        switch (mode) {
          case 'view':
            this.form.disable({ emitEvent: false });
            this.actions.shift();
            break;
          case 'update':
            this.registerForm.code.disable();
            break;
        }

        // this.customNotificationService.success('Thông báo', message);

      }
    );
  }

  onValuesChange(): void {
    this.registerForm.discountRate.valueChanges.subscribe(value => {
      if (value) {
        this.registerForm.discountAmount.disable({ emitEvent: false });
      } else {
        this.registerForm.discountAmount.enable({ emitEvent: false });
      }
    });
    this.registerForm.discountAmount.valueChanges.subscribe(value => {
      if (value) {
        this.registerForm.discountRate.disable({ emitEvent: false });
      } else {
        this.registerForm.discountRate.enable({ emitEvent: false });
      }
    });
  }

  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    // this.dialogService.openDialog(dialogParams, () => {
    //   handleSave();
    // });
    console.log(this.form.getRawValue());
    const request = {
      ...this.form.getRawValue(),
      discountAmount: this.form.getRawValue().discountAmount?.toString().replaceAll('.', '')
    };
    this.promotionService.createOrUpdate(this.id, request).subscribe(
      (res) => {
        this.customNotificationService.handleResponse(res);
      },
      (error) => {
        console.log(error);
        this.customNotificationService.error('Thông báo', error?.message ? error?.message : error.errors[0].description);
      },
      () => {
        // this.customNotificationService.success('Thông báo', message);
        this.form.disable({ emitEvent: false });
        this.actions.shift();
      }
    );
    // console.log(this.form.value);
  }
}
