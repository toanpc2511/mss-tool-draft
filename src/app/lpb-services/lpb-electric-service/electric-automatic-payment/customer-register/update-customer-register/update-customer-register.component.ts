import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tap, takeUntil } from 'rxjs/operators';
import { ElectricService } from './../../../shared/services/electric.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { DestroyService } from 'src/app/shared/services/destroy.service';
import {
  ICifSearch,
  IInfoCustomerRegister,
} from '../../../shared/models/electric.interface';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { EStatusActive } from '../../../shared/constants/status-transaction-electric.constant';
import { IError } from 'src/app/shared/models/error.model';
import { ultis } from 'src/app/shared/utilites/function';
import { BreadCrumbHelper } from 'src/app/shared/utilites/breadCrumb-helper';

@Component({
  selector: 'app-update-customer-register',
  templateUrl: './update-customer-register.component.html',
  styleUrls: ['./update-customer-register.component.scss'],
})
export class UpdateCustomerRegisterComponent implements OnInit {
  customerId: string;
  dataCustomer: IInfoCustomerRegister;
  settleDates = ultis.calcRecurringPaymentDate();
  infoForm: FormGroup;
  actions: ActionModel[] = [];
  accNumbers: ICifSearch[];
  isEmailRequired = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private electricService: ElectricService,
    private notify: CustomNotificationService,
    private destroy$: DestroyService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initInfoForm();
  }

  initInfoForm(): void {
    this.infoForm = this.fb.group({
      cif: ['', [Validators.required]],
      acNumber: [null, [Validators.required]],
      debitAccountPreBalance: [''],
      settleDate: [null, [Validators.required]],
      sendMail: [true],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    BreadCrumbHelper.setBreadCrumb([
      'Thanh toán hóa đơn điện',
      'Thanh toán tự động',
      'Danh sách KH đăng ký TTTĐ',
      'Chỉnh sửa thông tin',
    ]);
    this.activatedRoute.queryParams
      .pipe(
        tap((params) => {
          if (params.id) {
            this.customerId = params.id;
            this.getDetailCustomer();
          } else {
            this.router.navigate([
              '/electric-service/auto-payment/list-customer',
            ]);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  getDetailCustomer(): void {
    this.electricService
      .getDetailCustomerRegister(this.customerId)
      .pipe(
        tap((res) => {
          if (res.data) {
            this.dataCustomer = res.data;
            this.handePathValueCifForm(res.data);
            this.actions = [
              {
                actionName: 'Lưu thông tin',
                actionIcon: 'save',
                hiddenType:
                  res.data.status !== EStatusActive.ACTIVE ? 'disable' : 'none',
                actionClick: () => this.updateCustomer(),
              },
            ];
            this.infoForm.get('cif').patchValue(res.data.cif);
            this.onSearchCif(res.data.acNumber);
          }
        })
      )
      .subscribe();
  }

  handePathValueCifForm(data: IInfoCustomerRegister): void {
    this.infoForm.patchValue({
      settleDate: data?.settleDate,
      sendMail: data?.sendMail,
      email: data?.email,
      phone: data?.phone,
    });
  }

  changeCif(): void {
    this.accNumbers = [];
    this.infoForm.get('acNumber').reset();
  }

  onSearchCif(acNumber?: string): void {
    this.infoForm.get('cif').markAllAsTouched();
    if (this.infoForm.get('cif').invalid) {
      return;
    }
    const cifValue = this.infoForm.get('cif').value;
    this.electricService.getAccountCustomers(cifValue, 9999, 1).subscribe(
      (res) => {
        if (res.data) {
          this.accNumbers = res.data;
          this.infoForm.patchValue({
            acNumber: acNumber
              ? this.accNumbers.find((item) => item.accountNumber === acNumber)
              : this.accNumbers[0],
          });
        }
      },
      (error: IError) => this.notify.handleErrors(error)
    );
  }

  updateCustomer(): void {
    this.infoForm.markAllAsTouched();
    if (this.infoForm.invalid) {
      return;
    }
    const valueForm = this.infoForm.value;
    const body = {
      acName: valueForm.acNumber?.accountName,
      acNumber: valueForm.acNumber?.accountNumber,
      branchCode: valueForm.acNumber?.branchCode,
      cif: valueForm.cif,
      email: valueForm.email,
      id: this.customerId,
      phone: valueForm.phone,
      sendMail: valueForm.sendMail,
      settleDate: valueForm.settleDate,
    };
    this.electricService
      .updateCustomerRegister(this.customerId, body)
      .subscribe(
        (res) => {
          if (res.data) {
            this.notify.success('Thông báo', 'Đăng ký chỉnh sửa thành công!');
          }
        },
        (error: IError) => this.notify.handleErrors(error)
      );
  }
  
  onChangeEmail($event: any): void {
    this.isEmailRequired = $event.value;
    $event.value
      ? this.infoForm.controls.email.setValidators([Validators.required, Validators.email])
      : this.infoForm.controls.email.clearValidators();
    this.infoForm.controls.email.updateValueAndValidity();
  }
}
