import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { FormMessageComponent } from '../../shared/components/form-message/form-message.component';
import { IDENTITY_DOC_TYPES, PAYMENT_TYPES, RECURRING_PAYMENT_DATES } from '../../shared/constants/water.constant';
import { ICifSearch, ICustomerInfo, IFilterCifSearch, IFilterCreateAutoPayment } from '../../shared/models/water.interface';
import { HandleErrorService } from '../../shared/services/handleError.service';
import { WaterService } from '../../shared/services/water.service';
declare const $: any;

@Component({
  selector: 'app-water-auto-pay-sign-up',
  templateUrl: './water-auto-pay-sign-up.component.html',
  styleUrls: ['./water-auto-pay-sign-up.component.scss']
})
export class WaterAutoPaySignUpComponent implements OnInit {

  formSearch = this.fb.group({
    supplierCode: [null, Validators.required],
    customerId: ["", Validators.required]
  })

  searched = false;
  isLoading = false;
  //
  customerInfo: ICustomerInfo
  supplierAccNumber = "";

  identityDocTypes = IDENTITY_DOC_TYPES;
  paymentTypes = PAYMENT_TYPES;
  recurringPaymentDates = RECURRING_PAYMENT_DATES;

  customerAccounts: ICifSearch[] = [];

  formSignup = this.fb.group({
    identityDocType: [this.identityDocTypes[0]["value"]],
    numberDocType: ["", Validators.required],
    accountDebit: [null, Validators.required],
    accountNameDebit: ["", Validators.required],
    accountBranchCodeDebit: ["", Validators.required],
    custClass: ["", Validators.required],
    recurringPaymentDate: [null, Validators.required],
    paymentType: [this.paymentTypes[0]["value"], Validators.required],
    email: ["", [Validators.email]],
  });
  //
  actions: ActionModel[] = [
    {
      actionName: "Lưu thông tin",
      actionIcon: "save",
      actionClick: () => this.save()
    },
  ]

  constructor(private fb: FormBuilder, public matdialog: MatDialog, private handleErrorService: HandleErrorService,
    private waterService: WaterService, private router: Router) { }

  ngOnInit(): void {
    this.setInit();
  }

  setInit() {
    this.valueFormChange();
    $('.parentName').html('Thanh toán hóa đơn nước');
    $('.childName').html('Thanh toán tự động / Tạo đăng ký thanh toán tự động');
  }

  resetFormSignUp() {
    this.formSignup.reset();
    this.formSignup.patchValue({
      identityDocType: this.identityDocTypes[0]["value"],
      numberDocType: "",
      accountDebit: null,
      accountNameDebit: "",
      accountBranchCodeDebit: "", //
      custClass: "",
      recurringPaymentDate: null,
      paymentType: this.paymentTypes[0]["value"],
      email: ""
    })
    
    this.formSignup.get("accountDebit").reset();
    this.formSignup.get("recurringPaymentDate").reset();
    this.customerAccounts = [];
  }

  valueFormChange() {
    this.formSignup.get("accountDebit").valueChanges.subscribe(value => {
      let rowAccountDebit = this.customerAccounts.find(x => x.accountNumber === value);
      if (rowAccountDebit) {
        this.formSignup.patchValue({
          accountNameDebit: rowAccountDebit["accountName"],
          accountBranchCodeDebit: rowAccountDebit["branchCode"],
          custClass: rowAccountDebit["custClass"],
        })
      }
    })
  }

  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  invalid2(control: AbstractControl, typeError: string) {
    return (control.dirty || control.touched) && control.hasError(typeError);
  }

  infoSearchChange() {
    this.searched = false;
  }

  async search() {
    if (this.formSearch.invalid || this.isLoading) {
      this.formSearch.markAllAsTouched();
      return
    }
    this.resetFormSignUp();
    this.isLoading = true;
    this.searched = false;
    let params = {
      customerId: this.formSearch.value.customerId,
      serviceType: "WATER_SERVICE",
      supplierCode: this.formSearch.value["supplierCode"]
    }
    await this.waterService.getCustomer(params.customerId, params.serviceType, params.supplierCode).toPromise().then(async res => {
      if (res["data"].length === 0) {
        this.handleErrorService.openMessageError("Khách hàng không còn nợ hóa đơn !");
        return;
      }
      this.customerInfo = res["data"][0]["customerInfo"];
      this.supplierAccNumber = res["data"][0].settleAccountInfo[0].settleAcNo;
      this.searched = true;
    }).catch(err => {
      this.handleErrorService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  numberDocTypeChange() {
    this.formSignup.patchValue({
      accountDebit: "",
      accountNameDebit: "",
      accountBranchCodeDebit: "",
      custClass: "",
    })
    this.customerAccounts = [];
  }

  searchAccountCustomers() {
    if (this.formSignup.value["numberDocType"].trim() === "") {
      this.formSignup.controls["numberDocType"].markAsTouched();
      return;
    }
    this.isLoading = true;
    let params: IFilterCifSearch = {
      customerCifNumber: this.formSignup.value["numberDocType"].trim(),
      pageNumber: 999999,
      recordPerPage: 1,
    }
    this.waterService.getAccountCustomers(params.customerCifNumber, params.pageNumber, params.recordPerPage).toPromise().then(res => {
      if (res["data"]) {
        this.customerAccounts = res["data"];
        this.formSignup.patchValue({
          accountDebit: this.customerAccounts[0]["accountNumber"],
          accountNameDebit: this.customerAccounts[0]["accountName"],
          accountBranchCodeDebit: this.customerAccounts[0]["branchCode"],
          custClass: this.customerAccounts[0]["custClass"],
        })
      }
    }).catch(err => {
      this.handleErrorService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  disabledSave() {
    return this.formSignup.invalid;
  }

  save() {
    if (this.disabledSave() || this.isLoading) {
      if (this.disabledSave()) {
        this.formSignup.markAllAsTouched();
        this.handleErrorService.openMessageError("Bạn nhập chưa đủ thông tin hoặc email không đúng định dạng !");
      }
      return;
    }
    if (this.formSignup.value.accountDebit === this.supplierAccNumber) {
      this.handleErrorService.openMessageError("Tài khoản ghi nợ không được trùng với tài khoản ghi có !");
      return;
    }
    let customerInfo: ICustomerInfo = {
      custDesc: this.customerInfo.custDesc,
      custId: this.customerInfo.custId,
      custName: this.customerInfo.custName,
      custType: this.customerInfo.custType,
      custEmail: this.customerInfo.custEmail,
      custMobile: this.customerInfo.custMobile,
      custStatus: this.customerInfo.custStatus,
      customer_no: this.customerInfo.customer_no,
      kind_of_otp: this.customerInfo.kind_of_otp,
      otherInfo: this.customerInfo.otherInfo,
      providerId: this.customerInfo.providerId,
      uidValue: this.customerInfo.uidValue
    }

    let body: IFilterCreateAutoPayment = {
      acName: this.formSignup.value.accountNameDebit,
      acNumber: this.formSignup.value.accountDebit,
      branchCode: this.formSignup.value.accountBranchCodeDebit,
      cif: this.formSignup.value.numberDocType,
      custClass: this.formSignup.value.custClass,
      customerInfo: customerInfo,
      email: this.formSignup.value.email ? this.formSignup.value.email : null,
      paymentRule: this.formSignup.value.paymentType,
      serviceType: "WATER_SERVICE",
      settleDate: this.formSignup.value.recurringPaymentDate,
      supplierCode: this.formSearch.value.supplierCode,
    }

    this.isLoading = true;
    this.waterService.createAutoPaymentSignUp(body).toPromise().then(res => {
      this.openMessageSuccess(res["data"]);
    }).catch(err => {
      this.handleErrorService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  openMessageSuccess(data) {
    const dialog = this.matdialog.open(FormMessageComponent, {
      data: { type: "ok", text: "Lưu giao dịch thành công !", title: "Thành công", btnOk: { text: "Xem chi tiết", class: "lpb-btn-primary" } }, position: { top: "0px", right: "0px" }
    })
    dialog.afterClosed().subscribe(res => {
      this.infoSearchChange();
      if (res) {
        sessionStorage.setItem("waterDataRow", JSON.stringify({ ...data, paymentRuleName: PAYMENT_TYPES.find(x => x.value === data.paymentRule)?.label }));
        this.router.navigate(["/water-service/auto-payment/view"]);
      }
    })
  }
}
