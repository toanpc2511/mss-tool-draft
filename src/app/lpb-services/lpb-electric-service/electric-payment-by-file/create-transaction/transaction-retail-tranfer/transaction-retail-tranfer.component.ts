import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PAYMENT_METHODS} from '../../../shared/constants/electric.constant';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {DestroyService} from '../../../../../shared/services/destroy.service';
import {ElectricService} from '../../../shared/services/electric.service';
import {CustomNotificationService} from '../../../../../shared/services/custom-notification.service';
import {Observable} from 'rxjs';
import {IError} from '../../../../../shared/models/error.model';

@Component({
  selector: 'app-transaction-retail-tranfer',
  templateUrl: './transaction-retail-tranfer.component.html',
  styleUrls: ['./transaction-retail-tranfer.component.scss']
})
export class TransactionRetailTranferComponent implements OnInit {
  @Input() clearData: Observable<void>;
  @Input() event: Observable<void>;
  @Input() eventCompleted: Observable<void>;
  @Input() data: any;
  @Output() dataChange: EventEmitter<any> = new EventEmitter(null);
  paymentMethods = PAYMENT_METHODS;
  accNumbers: any[] = [];
  isTransfer = true;
  transferForm: FormGroup;
  cifInfoForm: FormGroup;
  userTransferForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private destroy$: DestroyService,
    private electricService: ElectricService,
    private notify: CustomNotificationService
  ) {
    this.initTransferForm();
    this.initUserTransferForm();
    this.cifInfoForm = this.fb.group({
      cif: [null, [Validators.required]],
      accNumber: [null, [Validators.required]],
      custAcName: [''],
      custAcNumber: [''],
      preAmount: ['']
    });
  }

  initUserTransferForm(): void {
    this.userTransferForm = this.fb.group({
      userName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.maxLength(11)]],
    });
  }

  initTransferForm(): void {
    this.transferForm = this.fb.group({
      paymentType: [this.paymentMethods[0].value],
      detail: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.handleChangePayMethod();
    this.clearData.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.userTransferForm.reset();
      this.transferForm.get('detail').patchValue('');
      this.cifInfoForm.reset();
    });
    this.changeAccNumber();
    this.event.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getValue();
      });
    this.handleCompleted();
  }

  handleCompleted(): void {
    this.eventCompleted
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cifInfoForm.disable({onlySelf: false, emitEvent: false});
        this.userTransferForm.disable({onlySelf: false, emitEvent: false});
        this.transferForm.disable({onlySelf: false, emitEvent: false});
      });
  }

  changeCifInfo(): void {
    this.userTransferForm.reset();
    this.accNumbers = [];
    Object.keys(this.cifInfoForm.controls).forEach((control) => {
      if (control === 'cif') {
        return;
      }
      this.cifInfoForm.get(control).reset();
    })
  }

  onSearchCifInfo(): void {
    this.cifInfoForm.get('cif').markAsTouched();
    if (this.cifInfoForm.get('cif').invalid) {
      return;
    }
    const cifValue = this.cifInfoForm.get('cif').value;
    this.electricService.getAccountCustomers(cifValue, 9999, 1)
      .subscribe((res) => {
        if (res.data) {
          this.accNumbers = res.data.filter((item) => item.custClass === 'V0CNTN' || item.custClass === 'V0TKCN');
          this.cifInfoForm.get('accNumber').patchValue(this.accNumbers[0]);
          this.changeAccNumber();
        }
      }, (error: IError) => this.checkError(error));
  }

  changeAccNumber(): void {
    this.cifInfoForm.get('accNumber').valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.cifInfoForm.patchValue({
          custAcName: value?.accountName || '',
          custAcNumber: value?.accountNumber || '',
          preAmount: value?.availableBalance || '',

        });
        this.userTransferForm.patchValue({
          userName: value?.custName || '',
          address: value?.custAddress || '',
          phone: value?.custPhone || ''
        });
      });
  }

  handleChangePayMethod(): void {
    this.transferForm.get('paymentType').valueChanges.subscribe((value) => {
      this.isTransfer = value === 'CK';
      if (this.isTransfer) {
        this.cifInfoForm.enable();
      }
      this.cifInfoForm.reset();
      this.userTransferForm.reset();
    });
  }

  checkError(error: IError): void {
    this.notify.error('Lỗi', error.code ? error.message : 'Lỗi hệ thống, vui lòng thử lại sau!');
  }

  getValue(): void {
    this.cifInfoForm.markAllAsTouched();
    this.userTransferForm.markAllAsTouched();
    this.transferForm.markAllAsTouched();
    if ((this.cifInfoForm.invalid && this.isTransfer) || this.userTransferForm.invalid || this.transferForm.invalid) {
      return;
    }
    const valueCifInfoForm = this.cifInfoForm.getRawValue();
    const valueTransferForm = this.transferForm.getRawValue();
    const valueUserTransferForm = this.userTransferForm.getRawValue();
    const dataRaw = {
      cif: valueCifInfoForm.cif,
      custAcName: valueCifInfoForm.custAcName,
      custAcNumber: valueCifInfoForm.custAcNumber,
      payerAddress: valueUserTransferForm.address,
      payerName: valueUserTransferForm.userName,
      payerPhoneNumber: valueUserTransferForm.phone,
      detail: valueTransferForm.detail,
      fileName: this.data.fileName,
      listBill: this.data.data,
      paymentType: valueTransferForm.paymentType,
      preAmount: Number(valueCifInfoForm.preAmount),
      supplierCode: this.data.supplierCode,
      totalAmount: this.data.totalPrice,
      custAcBrn: valueCifInfoForm.accNumber?.branchCode,
      custAddress: valueCifInfoForm.accNumber?.custAddress,
      custName: valueCifInfoForm.accNumber?.custName,
      custPhoneNumber: valueCifInfoForm.accNumber?.custPhone,
    };
    this.dataChange.emit(dataRaw);
  }
}
