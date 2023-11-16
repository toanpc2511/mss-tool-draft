import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {ActivatedRoute} from '@angular/router';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {FormHelpers} from '../../../../shared/utilites/form-helpers';
import {PackingService} from '../../shared/services/packing.service';

@Component({
  selector: 'app-packing-create',
  templateUrl: './packing-create.component.html',
  styleUrls: ['./packing-create.component.scss']
})
export class PackingCreateComponent implements OnInit {
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
    unitCost: [null, [Validators.required, Validators.maxLength(16)]],
    vatRate: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
    rules: [null, Validators.required]
  });

  id = '';
  mode = '';

  get registerForm(): any {
    return this.form.controls;
  }

  constructor(private fb: FormBuilder,
              private packingService: PackingService,
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

  onFetch(id, mode): void {
    this.packingService.getById(id).subscribe(
      (res) => {
        this.form.patchValue(res.data);
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
      },
      () => {
        switch (mode) {
          case 'view':
            this.form.disable();
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

  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    // this.dialogService.openDialog(dialogParams, () => {
    //   handleSave();
    // });
    const formValue = {
      ...this.form.getRawValue(),
      unitCost: this.form.getRawValue().unitCost?.toString().replaceAll('.', '')
    };
    this.packingService.createOrUpdate(this.id, formValue).subscribe(
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
}
