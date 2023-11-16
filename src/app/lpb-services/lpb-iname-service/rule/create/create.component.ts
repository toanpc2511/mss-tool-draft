import {Component, OnInit} from '@angular/core';
import {DEPOSIT_PRODUCTS} from '../../../lpb-deposit-service/shared/constants/deposit-common';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {isHoiSo} from '../../../../shared/utilites/role-check';
import {RuleService} from '../../shared/services/rule.service';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  actions: ActionModel[] = [
    {
      actionName: 'Lưu',
      actionIcon: 'send',
      actionClick: () => this.onSave(),
    }
  ];
  form = this.fb.group({
    code: [null, [Validators.required, Validators.maxLength(10)]],
    name: [null, [Validators.required, Validators.maxLength(100)]],
    ruleTypeId: [null, Validators.required],
    customerTypeId: [null, Validators.required]
  });
  id = '';
  mode = '';
  constructor(private fb: FormBuilder,
              private ruleService: RuleService,
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
    });

  }

  get registerForm(): any {
    return this.form.controls;
  }

  onFetch(id, mode): void {
    this.ruleService.getById(id).subscribe(
      (res) => {
        this.form.patchValue(res.data);
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
      },
      () => {

        if (mode === 'view') {
          this.form.disable();
        }
        // this.customNotificationService.success('Thông báo', message);

      }
    );
  }
  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    // this.dialogService.openDialog(dialogParams, () => {
    //   handleSave();
    // });

    this.ruleService.createOrUpdate(this.id, this.form.value).subscribe(
      (res) => {
        this.customNotificationService.handleResponse(res);
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
      },
      () => {
        // this.customNotificationService.success('Thông báo', message);
        this.form.disable();
      }
    );
    // console.log(this.form.value);
  }

}
