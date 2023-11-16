import { ICifSearch } from './../../models/water.interface';
import { IError } from 'src/app/system-configuration/shared/models/error.model';
import { WaterService } from './../../services/water.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IDENTITY_DOC_TYPES } from './../../constants/water.constant';
import { Component, OnInit, Input } from '@angular/core';
import { PAYMENT_METHODS } from '../../constants/water.constant';

@Component({
  selector: 'app-bill-info',
  templateUrl: './bill-info.component.html',
  styleUrls: ['./bill-info.component.scss'],
})
export class BillInfoComponent implements OnInit {
  paymentMethods = PAYMENT_METHODS;
  identityDocTypes = IDENTITY_DOC_TYPES;
  isCk: boolean = true;
  paymentContent: string;
  accountNameCredit: string;
  accountNumberCredit: string;
  paymentMethod: string;
  paymentAmount: string;
  numberDocType: string;
  accountNumber: string;
  accountNameDebit: string;

  billInfoForm: FormGroup;
  customerAccounts: ICifSearch[] = [];

  @Input() action: 'view' | 'create' | 'update';
  @Input() data?: any;

  constructor(private fb: FormBuilder, private waterService: WaterService) {
    this.initForm();
  }

  initForm() {
    this.billInfoForm = this.fb.group({
      paymentMethod: ['CK', [Validators.required]],
      paymentAmount: ['', [Validators.required]],
      identityDocType: ['CIF', [Validators.required]],
      numberDocType: [
        {
          value: '',
          disabled: this.action === 'view',
        },
        [Validators.required],
      ],
      accountDebit: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.changePaymentMethod();
    if (this.action === 'view') {
      this.billInfoForm.disable();
    }

    console.log(this.data);
    if (this.data) this.handleData(this.data);
  }

  handleData(value: any) {
    this.isCk = value.paymentType === 'CK';
    this.paymentContent = value.tranDesc;
    this.accountNameCredit = value.dataCredit?.acName;
    this.accountNumberCredit = value.dataCredit?.acNumber;
    this.paymentMethod =
      value.paymentType === 'CK' ? '(CK) Chuyển khoản' : '(TM) Tiền mặt';
    (this.paymentAmount = value.dataCredit?.lcyAmount),
      (this.numberDocType = value.cif);
    this.accountNumber = value.dataDebit?.acNumber;
    this.accountNameDebit = value.dataDebit?.acName;
  }

  changePaymentMethod(): void {
    this.billInfoForm
      .get('paymentMethod')
      .valueChanges.subscribe((value: string) => {
        this.isCk = value === 'CK';
      });
  }

  onSearch() {
    const valueForm = this.billInfoForm.value;
    this.waterService
      .getAccountCustomers(valueForm.numberDocType, 999999, 1)
      .toPromise()
      .then((res) => {
        if (res['data']) {
          this.customerAccounts = res.data;
          this.billInfoForm.patchValue({
            accountDebit: this.customerAccounts[0].accountNumber,
            accountNameDebit: this.customerAccounts[0].accountName,
          });
        }
      })
      .catch((err) => {
        this.handleError(err);
      });
  }

  handleError(error: IError) {
    console.log(error);
  }
}
