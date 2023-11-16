import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IDENTITY_DOC_TYPES, PAYMENT_METHODS } from '../../constants/water.constant';
import { ICifSearch, IFilterCifSearch } from '../../models/water.interface';
import { HandleErrorService } from '../../services/handleError.service';
import { WaterService } from '../../services/water.service';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit, AfterViewInit {

  @Input() type = "";
  @Output() paymentMethodChange = new EventEmitter<string>();
  paymentMethods = PAYMENT_METHODS;
  customerAccounts: ICifSearch[] = [];
  identityDocTypes = IDENTITY_DOC_TYPES;

  formPayment = this.fb.group({
    accountNumberCredit: ["", Validators.required],
    paymentMethod: ["CK", Validators.required],
    accountNameCredit: ["", Validators.required],
    paymentAmount: [0, Validators.required],
    paymentContent: ["", Validators.required],
    identityDocType: [this.identityDocTypes[0]["value"]],
    numberDocType: ["", Validators.required],
    accountDebit: [null, Validators.required],
    accountNameDebit: ["", Validators.required],
    accountBranchCodeDebit: ["", Validators.required],
    accountBalance: [0],
  })
  isLoading = false;
  transferFirst = false;
  init = true;

  constructor(public matdialog: MatDialog,
    private waterService: WaterService, private fb: FormBuilder, private handleErrorService: HandleErrorService) { }

  ngOnInit(): void {
    this.valueFormChange();
  }

  ngAfterViewInit() {
    if (this.type === "view") {
      this.formPayment.disable();
    }
  }

  valueFormChange() {
    this.formPayment.controls.accountDebit.valueChanges.subscribe(value => {
      if (this.init && this.type === "edit") {
        return;
      }
      this.accountDebitChange(value);
    })
    this.formPayment.controls.paymentMethod.valueChanges.subscribe(value => {
      this.paymentMethodChange.emit(value);
    })
  }

  async setValueForm(data, type) {
    this.formPayment.patchValue({
      accountNumberCredit: data["accNumber"],
      paymentMethod: data["paymentTypeCode"],
      accountNameCredit: data["accName"],
      paymentAmount: data["totalAmount"],
      paymentContent: data["tranDesc"],
      numberDocType: data["cif"] || "",
    })
    if (data["paymentTypeCode"] === "CK") {
      this.formPayment.patchValue({
        accountDebit: data["tranPostResponses"].find(x => x.drcrType === "D").acNumber,
        accountNameDebit: data["tranPostResponses"].find(x => x.drcrType === "D").acName,
        accountBranchCodeDebit: data["tranPostResponses"].find(x => x.drcrType === "D").acBrn,
        accountBalance: data["preBalance"],
      })
      if (type === "edit") {
        await this.searchAccountCustomers();
        this.transferFirst = true;
      }
    }
    if (type === "view") {
      let valueForm = this.formPayment.value;
      this.customerAccounts = [{
        accountName: valueForm["accountNameDebit"],
        accountNumber: valueForm["accountDebit"],
        branchCode: valueForm["accountBranchCodeDebit"],
        availableBalance: valueForm["accountBalance"],
      }];
    }
    this.init = false;
  }

  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  resetFormPayment(resetPaymentAmount = true) {
    this.formPayment.controls["numberDocType"].reset();
    this.formPayment.patchValue({
      numberDocType: "",
      accountDebit: "",
      accountNameDebit: "",
      accountBranchCodeDebit: "",
      accountBalance: 0
    });
    if (resetPaymentAmount) {
      this.formPayment.patchValue({
        paymentAmount: 0,
        paymentContent: "",
      });
    }
    this.customerAccounts = [];
  }

  numberDocTypeChange() {
    this.formPayment.patchValue({
      accountDebit: "",
      accountNameDebit: "",
      accountBranchCodeDebit: "",
      accountBalance: 0
    })
    this.customerAccounts = [];
  }

  async searchAccountCustomers() {
    if (this.formPayment.value["numberDocType"].trim() === "") {
      this.formPayment.controls["numberDocType"].markAsTouched();
      return;
    }
    this.isLoading = true;
    let params: IFilterCifSearch = {
      customerCifNumber: this.formPayment.value["numberDocType"].trim(),
      pageNumber: 999999,
      recordPerPage: 1,
    }
    await this.waterService.getAccountCustomers(params.customerCifNumber, params.pageNumber, params.recordPerPage).toPromise().then(res => {
      if (res["data"]) {
        this.customerAccounts = res["data"];
        if (this.init && this.type === "edit") {
          return;
        }
        this.formPayment.patchValue({
          accountDebit: this.customerAccounts[0]["accountNumber"],
          accountNameDebit: this.customerAccounts[0]["accountName"],
          accountBranchCodeDebit: this.customerAccounts[0]["branchCode"],
          accountBalance: this.customerAccounts[0]["availableBalance"] // Chờ API để cập nhật availableBalance
        })
      }
    }).catch(err => {
      this.handleErrorService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  accountDebitChange(value) {
    let rowAccountDebit = this.customerAccounts.find(x => x.accountNumber === value);
    if (rowAccountDebit) {
      this.formPayment.patchValue({
        accountNameDebit: rowAccountDebit["accountName"],
        accountBranchCodeDebit: rowAccountDebit["branchCode"],
        accountBalance: rowAccountDebit["availableBalance"] // Chờ API để cập nhật availableBalance
      })
      return;
    }
    this.formPayment.patchValue({
      accountNameDebit: "",
      accountBranchCodeDebit: "",
      accountBalance: 0 // Chờ API để cập nhật
    })
  }
}
