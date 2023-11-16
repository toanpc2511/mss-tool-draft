import {Component, OnInit} from '@angular/core';
import {ActionModel} from '../../../../shared/models/ActionModel';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
  PERIOD_DETAILS_ELECTRIC,
  PREFIXS_ELECTRIC,
  STATUS_SUPPLIER
} from '../../../shared/contants/system-constant';
import {ElectricServiceConfigService} from '../../electric-service-config.service';
import {IPaymentRule, ISupplierElectric} from '../../../shared/models/lvbis-config.interface';
import {DestroyService} from '../../../../shared/services/destroy.service';
import {takeUntil} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {IError} from '../../../shared/models/error.model';
import {BreadCrumbHelper} from '../../../../shared/utilites/breadCrumb-helper';


@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.scss'],
  providers: [DestroyService]
})
export class CreateSupplierComponent implements OnInit {
  actions: ActionModel[] = [];
  paymentRules: IPaymentRule[];
  statusSuppliers = STATUS_SUPPLIER;
  prefixs = PREFIXS_ELECTRIC;
  periodDetails = PERIOD_DETAILS_ELECTRIC;
  supplierForm: FormGroup;
  supplierFormGroups: FormArray = new FormArray([]);
  supplierFormGroupsTemp: FormArray = new FormArray([]);
  isShared = true;
  dataSupplier: ISupplierElectric;
  billTypes: string[] = [];
  isNoPriority = false;

  selectConfig = {
    isNewApi: true,
    isSort: true,
    clearable: true,
    closeOnSelect: false
  };

  constructor(
    private electricService: ElectricServiceConfigService,
    private fb: FormBuilder,
    private destroy$: DestroyService,
    private route: ActivatedRoute,
    private notypfy: CustomNotificationService,
    private router: Router
  ) {
    this.initSupplierForm();
    this.actions = [
      {
        actionName: 'Lưu thông tin',
        actionIcon: 'save',
        actionClick: () => this.onSave(),
      },
    ];
  }

  initSupplierForm(): void {
    this.supplierForm = this.fb.group({
      supplierCode: ['', [Validators.required]],
      supplierName: ['', [Validators.required]],
      service: ['', [Validators.required]],
      serviceId: ['', [Validators.required]],
      merchantId: ['', [Validators.required]],
      productCode: ['', [Validators.required]],
      status: [null, [Validators.required]],
      prefix: ['', [Validators.required]],
      periodDetail: ['', [Validators.required]],
      paymentConfigType: ['SHARED', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.setInit();
  }

  async setInit(): Promise<any> {
    await this.getPaymentRules();
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {

        BreadCrumbHelper.setBreadCrumb([
          'Cấu hình dịch vụ',
          'Dịch vụ điện',
          params.id ? 'Sửa thông tin nhà cung cấp' : 'Thêm mới nhà cung cấp',
        ]);
        if (params.id) {
          this.getDetailSupplier(params.id);
        }
      });
  }

  getDetailSupplier(id: string): void {
    this.electricService.getDetailSupplier(id)
      .subscribe((res) => {
        if (res.data) {
          this.pathValueForm(res.data);
        }
      });
  }

  pathValueForm(data: ISupplierElectric): void {
    this.dataSupplier = data;
    this.supplierForm.get('supplierCode').disable();
    this.supplierForm.patchValue({
      supplierCode: data.supplierCode,
      supplierName: data.supplierName,
      service: data.supplierMetadata.service,
      serviceId: data.supplierMetadata.serviceId,
      merchantId: data.supplierMetadata.merchantId,
      productCode: data.supplierMetadata.productCode,
      status: data.statusCode,
      prefix: data.supplierMetadata.prefixFormat,
      periodDetail: data.supplierMetadata.billFormat,
      paymentConfigType: data.supplierMetadata.paymentConfigType,
    });
    this.pathValueSupplierFormGroups(data.supplierFormGroups);
  }

  pathValueSupplierFormGroups(paymentRules): void {
    for (const paymentRule of paymentRules) {
      const formGroup = this.supplierFormGroups.controls.find(x => x.value.formGroupId === paymentRule.id);
      if (formGroup) {
        const rule = paymentRule.ruleResponses.filter(x => x.selected).map(item => item.id);
        if (paymentRule.code === 'UNI-FORMGROUP3') {
          formGroup.patchValue({ supplierRuleId: rule });
        } else {
          formGroup.patchValue({ supplierRuleId: rule[0] });
        }
      }
    }
  }

  async getPaymentRules(): Promise<any> {
    await this.electricService
      .getFormGroups().toPromise()
      .then((res) => {
        this.paymentRules = res.data;
        this.supplierFormGroups = this.supplierFormGroupsTemp =
          this.convertToFormArray(res.data);
      });
  }

  convertToFormArray(data: IPaymentRule[]): FormArray {
    const controls = data.map((p) => {
      const selectedRule = p.ruleResponses.find((rule) => rule.selected);
      return this.fb.group({
        formGroupId: [p.id],
        supplierRuleId: [null, [Validators.required]],
      });
    });

    return this.fb.array(controls);
  }

  checkFormInvalid(): boolean {
    this.supplierFormGroups.markAllAsTouched();
    this.supplierForm.markAllAsTouched();

    if (
      this.supplierForm.invalid
      || this.supplierFormGroups.invalid
    ) {
      return true;
    }
    return false;
  }

  onChangeRule($event, paymentRules: any[], i: number): void {
    if (paymentRules[i].code !== 'UNI-FORMGROUP2') { return; }
    const index = paymentRules.indexOf(paymentRules.find((item) => item.code === 'UNI-FORMGROUP3'));
    const ruleSelect = paymentRules[i].ruleResponses.find(x => x.id === $event);
    const formGroupMul = this.supplierFormGroups.controls[index] as FormGroup;
    this.isNoPriority = ruleSelect.code !== 'PRIORITY_ELECTRIC';
    if (this.isNoPriority) {
      formGroupMul.controls.supplierRuleId.clearValidators();
    } else {
      formGroupMul.controls.supplierRuleId.setValidators([Validators.required]);
    }
    formGroupMul.controls.supplierRuleId.updateValueAndValidity();
    this.supplierFormGroups.updateValueAndValidity();
  }

  onSave(): void {
    if (this.checkFormInvalid()) {
      return;
    }
    if (this.dataSupplier) {
      this.electricService.updateSupplier(this.handleDataSave(), this.dataSupplier.id)
        .subscribe((res) => {
          if (res.data) {
            this.notypfy.success('Thành công', 'Lưu thông tin thành công');
            this.router.navigate(['/system-config/electric-service/supplier-config/detail'], { queryParams: { id: res.data.id } });
          }
        }, (error: IError) => this.checkError(error));
    } else {
      this.electricService.createSupplier(this.handleDataSave())
        .subscribe((res) => {
          if (res.data) {
            this.notypfy.success('Thành công', 'Lưu thông tin thành công');
            this.router.navigate(['/system-config/electric-service/supplier-config/detail'], { queryParams: { id: res.data.id } });
          }
        }, (error: IError) => this.checkError(error));
    }
  }

  handleDataSave(): any {
    const valueSupplierForm = this.supplierForm.getRawValue();
    const body = {
      serviceType: 'ELECTRIC_SERVICE',
      status: valueSupplierForm.status,
      supplierName: valueSupplierForm.supplierName,
      supplierCode: valueSupplierForm.supplierCode,
      supplierMetadata: {
        type: 'ELECTRIC_SERVICE',
        service: valueSupplierForm.service,
        serviceId: valueSupplierForm.serviceId,
        productCode: valueSupplierForm.productCode,
        prefixFormat: valueSupplierForm.prefix,
        billFormat: valueSupplierForm.periodDetail,
        paymentConfigType: valueSupplierForm.paymentConfigType,
        merchantId: valueSupplierForm.merchantId,
        billTypes: this.billTypes
      },
      supplierFormGroups: this.handleDataFormGroup()
    };
    return body;
  }

  handleDataFormGroup(): any {
    const valueForm = this.supplierFormGroups.getRawValue().map((item) => ({
      ...item,
      supplierRuleId: typeof item.supplierRuleId === 'string'
        ? item.supplierRuleId.split()
        : item.supplierRuleId
    }));
    return valueForm;
  }

  handleChangeRule($event: any[]): void {
    this.billTypes = $event.map((item) => (item.parentCode));
  }

  checkError(error: IError): void {
    if (error.code) {
      if (error.code === 'uni01-00-5055') {
        this.supplierForm.get('supplierCode').setErrors({isExist: true});
        this.notypfy.error('Lỗi', 'Mã nhà cung cấp đã tồn tại. Vui lòng kiểm tra lại.');
      } else {
        this.notypfy.error('Lỗi', error.message);
      }
    } else {
      this.notypfy.error('Lỗi hệ thống', 'Vui lòng thử lại sau');
    }
  }
}
