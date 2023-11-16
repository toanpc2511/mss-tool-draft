import {DestroyService} from '../../../../shared/services/destroy.service';
import {
  CustomConfirmDialogComponent
} from '../../../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import {CustomNotificationService} from '../../../../shared/services/custom-notification.service';
import {WaterServiceConfigService} from '../../water-service-config.service';
import {IPaymentRule} from '../../../shared/models/lvbis-config.interface';
import {
  FORM_TYPES,
  PERIOD_DETAILS,
  PREFIXS,
  STATUS_SUPPLIER,
} from '../../../shared/contants/system-constant';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {Component, OnInit, Inject, ChangeDetectorRef} from '@angular/core';
import {IError} from 'src/app/system-configuration/shared/models/error.model';
import {ToastrService} from 'ngx-toastr';
import {ultis} from 'src/app/shared/utilites/function';

@Component({
  selector: 'app-supplier-modal',
  templateUrl: './supplier-modal.component.html',
  styleUrls: ['./supplier-modal.component.scss'],
  providers: [DestroyService],
})
export class SupplierModalComponent implements OnInit {
  supplierForm: FormGroup;
  serviceBankInfoGroup: FormGroup;
  statusSuppliers = STATUS_SUPPLIER;
  prefixs = PREFIXS;
  periodDetails = PERIOD_DETAILS;
  titleModal!: string;
  formTypes = FORM_TYPES;

  supplierFormGroups: FormArray = new FormArray([]);
  supplierFormGroupsTemp: FormArray = new FormArray([]);

  paymentRules: IPaymentRule[];
  paymentGroups;
  isChanged = false;
  isOnline = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private notifyService: CustomNotificationService,
    private waterServiceConfigService: WaterServiceConfigService,
    private destroy$: DestroyService,
    private toastr: ToastrService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.setInit();
    this.handleChangeFormType();
  }

  handleChangeFormType(): void {
    const keyControls = ['brnManager', 'service', 'serviceId', 'productCode', 'merchantId'];
    this.supplierForm.controls.formType.valueChanges
      .subscribe((value) => {
        this.isOnline = value === 'ONLINE';
        this.supplierForm.setErrors(null);
        keyControls.forEach(control => {
          if (this.isOnline) {
            if (control === 'brnManager') {
              this.supplierForm.get(control).clearValidators();
            }
            this.supplierForm.get(control).setValidators([Validators.required]);
          } else {
            if (control === 'brnManager') {
              this.supplierForm.get(control).setValidators([Validators.required]);
            }
            this.supplierForm.get(control).clearValidators();
          }
          this.supplierForm.get(control).updateValueAndValidity();
        });
      });
  }

  async setInit() {
    this.handleTitleModal();
    await this.getPaymentRules();
    this.pathValue();
    this.handleChangeForm();
  }

  handleChangeForm(): void {
    this.supplierForm.valueChanges.subscribe(value => {
      if (value) {
        this.isChanged = true;
      }
    });
  }

  handleTitleModal(): void {
    this.titleModal =
      this.data.action === 'edit'
        ? 'Cập nhật nhà cung cấp'
        : this.data.action === 'view'
          ? 'Chi tiết nhà cung cấp'
          : 'Thêm mới nhà cung cấp';
  }

  initForm(): void {
    this.supplierForm = this.fb.group({
      supplierName: ['', [Validators.required]],
      supplierCode: ['', [Validators.required]],
      service: ['', [Validators.required]],
      serviceId: ['', [Validators.required]],
      productCode: ['', [Validators.required]],
      merchantId: ['', [Validators.required]],
      status: ['ACTIVE'],
      prefix: ['', [Validators.required]],
      periodDetail: ['', [Validators.required]],
      formType: [this.formTypes[0].value],
      brnManager: [''],
    });

    this.serviceBankInfoGroup = this.fb.group({
      bankAccountNumber: ['', [Validators.required]],
      cif: ['', [Validators.required]],
      bankAccountName: ['', [Validators.required]],
      bankAccountBrnCode: ['', [Validators.required]],
      bankAccountBrnName: ['', [Validators.required]],
    });
  }

  pathValue(): void {
    if (!this.data.id) {
      return;
    }
    if (this.data.action === 'edit') {
      this.supplierForm.get('supplierCode').disable();
      this.supplierForm.get('formType').disable();
    } else {
      this.supplierForm.disable();
      this.serviceBankInfoGroup.disable();
    }
    this.waterServiceConfigService
      .getDetailSupplier(this.data.id)
      .subscribe((res) => {
        this.isOnline = res.data.serviceTypeCode === 'WATER_SERVICE';
        this.supplierForm.patchValue({
          supplierName: res.data.supplierName,
          supplierCode: res.data.supplierCode,
          service: res.data.supplierMetadata?.service,
          serviceId: res.data.supplierMetadata?.serviceId,
          productCode: res.data.supplierMetadata?.productCode,
          merchantId: res.data.supplierMetadata?.merchantId,
          status: res.data.statusCode,
          prefix: res.data.supplierMetadata?.prefixFormat,
          periodDetail: res.data.supplierMetadata?.billFormat,
          formType: res.data.serviceTypeCode === 'WATER_SERVICE' ? 'ONLINE' : 'OFFLINE',
          brnManager: res.data?.brnManager,
        });

        if (!this.isOnline) {
          this.serviceBankInfoGroup.patchValue({
            bankAccountNumber: res.data.supplierMetadata.serviceBankInfo.bankAccountNumber,
            cif: res.data.supplierMetadata.serviceBankInfo.cif,
            bankAccountName: res.data.supplierMetadata.serviceBankInfo.bankAccountName,
            bankAccountBrnCode: res.data.supplierMetadata.serviceBankInfo.bankAccountBrnCode,
            bankAccountBrnName: res.data.supplierMetadata.serviceBankInfo.bankAccountBrnName
          });
          this.supplierForm.get('brnManager').setErrors((this.data.action === 'view') ? null : {required: true});
        }

        this.supplierForm.get('brnManager').setErrors(null);
        this.pathValueSupplierFormGroups(res.data.supplierFormGroups);
      });
  }

  pathValueSupplierFormGroups(paymentRules) {
    let formGroup3, formGroup2;
    for (const paymentRule of paymentRules) {
      const formGroup = this.supplierFormGroups.controls.find(x => x.value.formGroupId === paymentRule.id);
      if (formGroup) {
        if (formGroup.value.formGroupCode === 'UNI-FORMGROUP3') {
          formGroup3 = formGroup;
        }
        if (formGroup.value.formGroupCode === 'UNI-FORMGROUP2') {
          formGroup2 = formGroup;
        }
        const rule = paymentRule.ruleResponses.find(x => x.selected);
        if (rule) {
          formGroup.patchValue({
            supplierRuleId: rule.id
          });
        }
      }
    }
    if (formGroup3 && formGroup2) {
      if (formGroup3.value.supplierRuleId === ultis.getValueFromArray(this.paymentGroups['UNI-FORMGROUP3'], 'code', 'id', 'UNI-RULE7')) {
        formGroup2.patchValue({
          supplierRuleId: ultis.getValueFromArray(this.paymentGroups['UNI-FORMGROUP2'], 'code', 'id', 'UNI-RULE5')
        });
        formGroup2.get('supplierRuleId').disable();
      }
    }
  }

  clearSelected(control: string): void {
    this.supplierForm
      .get(control)
      .patchValue(control === 'status' ? 'ACTIVE' : '');
  }

  async getPaymentRules() {
    await this.waterServiceConfigService
      .getFormGroups().toPromise()
      .then((res) => {
        this.paymentRules = res.data;
        this.paymentGroups = this.getPaymentGroup(res.data);
        this.supplierFormGroups = this.supplierFormGroupsTemp =
          this.convertToFormArray(res.data);
      });
  }

  getPaymentGroup(paymentRules) {
    const paymentGroups = {};
    for (const row of paymentRules) {
      paymentGroups[row.code] = row.ruleResponses;
    }
    return paymentGroups;
  }

  convertToFormArray(data: IPaymentRule[]): FormArray {
    const controls = data.map((p) => {
      const selectedRule = p.ruleResponses.find((rule) => rule.selected);
      return this.fb.group({
        formGroupId: [{value: p.id, disabled: this.data.action === 'view'}],
        formGroupCode: [{value: p.code, disabled: this.data.action === 'view'}],
        supplierRuleId: [
          {value: selectedRule?.id, disabled: this.data.action === 'view'},
          [Validators.required],
        ],
      });
    });

    return this.fb.array(controls);
  }

  saveForm(): void {
    // this.supplierFormGroups = this.supplierFormGroupsTemp;
    this.supplierForm.markAllAsTouched();
    this.serviceBankInfoGroup.markAllAsTouched();
    this.supplierFormGroups.markAllAsTouched();
    if (this.supplierForm.invalid || this.supplierFormGroups.invalid) {
      return null;
    }

    if (!this.isOnline && this.serviceBankInfoGroup.invalid) {
      return;
    }

    let message = '';
    if (this.supplierForm.value.prefix.length > 100) {
      message += 'Tiền tố bị nhập quá 100 ký tự !\n';
    }

    if (this.supplierForm.value.periodDetail.length > 100) {
      message += 'Chi tiết kỳ bị nhập quá 100 ký tự !';
    }

    if (message !== '') {
      this.notifyService.error('Lỗi', message);
      return;
    }

    this.handlerSave();
  }

  handlerSave(): void {
    const valueForm = this.supplierForm.value;
    const body = {
      serviceType: this.isOnline ? 'WATER_SERVICE' : 'WATER_SERVICE_OFFLINE',
      status: valueForm.status,
      supplierFormGroups: this.supplierFormGroups.getRawValue(),
      supplierMetadata: {
        type: this.isOnline ? 'WATER_SERVICE' : 'WATER_SERVICE_OFFLINE',
        service: valueForm.service,
        serviceId: valueForm.serviceId,
        productCode: valueForm.productCode,
        merchantId: valueForm.merchantId,
        prefixFormat: valueForm.prefix,
        billFormat: valueForm.periodDetail,
        serviceBankInfo: this.serviceBankInfoGroup.value,
      },
      brnManager: valueForm.brnManager,
      supplierCode: valueForm.supplierCode,
      supplierName: valueForm.supplierName,
    };

    if (this.data.action !== 'edit') {
      this.waterServiceConfigService.createSupplier(body).subscribe(
        (res) => {
          if (res.data) {
            const actions = [{
              title: 'Về danh sách',
              action: () => this.toastr.clear()
            }];
            this.notifyService.success(
              'Thành công',
              'Tạo mới nhà cung cấp thành công.',
              actions
            );
            this.dialog.closeAll();
          }
        },
        (error: IError) => this.checkError(error)
      );
    } else {
      this.waterServiceConfigService
        .updateSupplier(body, this.data.id)
        .subscribe(
          (res) => {
            if (res.data) {
              this.notifyService.success(
                'Thành công',
                'Cập nhật nhà cung cấp thành công.'
              );
              this.dialog.closeAll();
            }
          },
          (error: IError) => this.checkError(error)
        );
    }
  }

  closeDialog(): void {
    if (this.data.action === 'view' || !this.isChanged) {
      this.dialog.closeAll();
    } else {
      const confirmDialog = this.dialog.open(CustomConfirmDialogComponent, {
        width: '45%',
        autoFocus: false,
        data: {
          title: 'Xác nhận',
          message: 'Các dữ liệu bạn vừa tạo sẽ bị xoá, bạn có muốn tiếp tục?',
        },
      });

      confirmDialog.afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.initForm();
          this.dialog.closeAll();
        }
      });
    }
  }

  checkError(error: IError): void {
    console.log(error);
    if (error.code) {
      if (error.code === 'uni01-00-5055') {
        this.supplierForm.get('supplierCode').setErrors({isExist: true});
        this.notifyService.error('Lỗi', 'Trùng mã nhà cung cấp, mời nhập lại');
      } else {
        this.notifyService.error('Lỗi', error.message);
      }
    } else {
      this.notifyService.error('Lỗi hệ thống', 'Vui lòng thử lại sau!');
    }
  }

  changeValuePaymentRule($event, curFormGroup, supplierFormGroups) {
    if (curFormGroup.value.formGroupCode === 'UNI-FORMGROUP3') {
      const formGroup2 = supplierFormGroups.find(x => x.value.formGroupCode === 'UNI-FORMGROUP2');
      if (formGroup2) {
        if (curFormGroup.value.supplierRuleId === ultis.getValueFromArray(this.paymentGroups['UNI-FORMGROUP3'], 'code', 'id', 'UNI-RULE7')) {
          formGroup2.patchValue({
            supplierRuleId: ultis.getValueFromArray(this.paymentGroups['UNI-FORMGROUP2'], 'code', 'id', 'UNI-RULE5')
          });
          formGroup2.get('supplierRuleId').disable();
        } else {
          formGroup2.controls.supplierRuleId.enable();
        }
      }
    }
  }

  searchAccNumberService(): void {
    const value = this.serviceBankInfoGroup.get('bankAccountNumber').value;
    if (!value) {
      this.serviceBankInfoGroup.get('bankAccountNumber').setErrors({required: true});
      return;
    }
    this.serviceBankInfoGroup.get('bankAccountNumber').setErrors(null);
    const params = {accountNumber: value, pageNumber: 1, recordPerPage: 10};

    this.waterServiceConfigService.searchInfoCustomer(params)
      .subscribe((res) => {
        if (res.data) {
          this.serviceBankInfoGroup.patchValue({
            cif: res.data[0].accountNumber.slice(0, 8),
            bankAccountName: res.data[0].accountName,
            bankAccountBrnCode: res.data[0].branchCode,
            bankAccountBrnName: res.data[0].branchName
          });
        }
      }, (error: IError) => this.checkError(error));
  }
}
