import { Component, Input, OnInit, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IDENTITY_DOC_TYPES, PAYMENT_METHODS } from '../../constants/tuition.constant';
import { ICifSearch, IFee, IFilterCifSearch, ITransaction } from '../../models/tuition.interface';
import { HandleErrorService } from '../../services/handleError.service';
import { TuitionService } from '../../services/tuition.service';
import { LpbDatePickerComponent } from 'src/app/shared/components/lpb-date-picker/lpb-date-picker.component';
import * as moment from 'moment';
import { FormHelpers } from 'src/app/shared/utilites/form-helpers';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit, AfterViewInit {
  FormHelpers = FormHelpers;
  @Input() type = "";
   @Output() paymentMethodChange = new EventEmitter<string>();
  paymentMethods = PAYMENT_METHODS;
  customerAccounts: ICifSearch[] = [];
  identityDocTypes = IDENTITY_DOC_TYPES;
  rootData: ITransaction;
  feeData: IFee;

  formPayment = this.fb.group({
    accountNumberCredit: ["", Validators.required],
    accountCreditBranch: [""],
    paymentMethod: ["CP03", Validators.required],
     accountNameCredit: ["", Validators.required],
     paymentAmount: [0, Validators.required],
     paymentContent: ["", Validators.required],
     identityDocType: [this.identityDocTypes[0]["value"]],
     numberDocType: ["", Validators.required],
     accountDebit: [null, Validators.required],
     accountNameDebit: ["", Validators.required],
     accountBranchCodeDebit: ["", Validators.required],
     accountBalance: [0],
     feeAmount:[0],
     feeAmountvat:[0],
     feeAmount_ct:[0],
     feeAmountvat_ct:[0],
     customerName:  ["", Validators.required],
     gtttnumber:["", Validators.required],
     dateGttt:[null, Validators.required],
     accVat:[""],
     accFee:[""],
     univerCode:[""],
     univerName:[""]
  })
  isLoading = false;
  transferFirst = false;
  init = true;

  @ViewChild('dpDateGttt', { static: false })
  dpDateGttt: LpbDatePickerComponent;

  constructor(public matdialog: MatDialog,
    private tuitionService: TuitionService, private fb: FormBuilder, private handleErrorService: HandleErrorService) { }

  ngOnInit(): void {
    this.valueFormChange();
    this.formPayment.valueChanges.subscribe((value) => {
      console.log(value);
    });
  }

  ngAfterViewInit() {
    if (this.type === "view") {
      this.formPayment.disable();
    }
  }

  valueFormChange() {
    this.formPayment.controls.accountDebit.valueChanges.subscribe(value => {
      if (this.init && (this.type === "edit" || this.type === "view")) {
        this.formPayment.patchValue({
          accountBalance: this.rootData["preBalance"]
        })
        return;
      }
      this.accountDebitChange(value);
    })
    this.formPayment.controls.paymentMethod.valueChanges.subscribe(value => {

      if (this.type === "view") {
        return;
      }

      this.tuitionService
      .getFee(this.formPayment.controls.accountCreditBranch.value ,value,'VND',this.formPayment.controls.accountNumberCredit.value ,this.formPayment.controls.paymentAmount.value)
      .pipe()
      .subscribe((res) => {
        if (res.data) {
          let feeData = res['data'];
          // console.log('fee');
          // console.log(feeData);
          // console.log(feeData["feeAmount"]);
          this.formPayment.patchValue({
            feeAmount: Number(feeData["feeDvTh"]),
            feeAmountvat: Number(feeData["vatFeeDvTh"]),
            feeAmount_ct: Number(feeData["feeAmount"]),
            feeAmountvat_ct: Number(feeData["vat"])
          });
        }
      });

      this.paymentMethodChange.emit(value);
      // console.log('Paymentggg:'+value);
    })
  }

  async setValueForm(data, type) {

    this.rootData = data;
    this.formPayment.patchValue({
      accountNumberCredit: data["accNumber"],
      paymentMethod: data["paymentType"],
      accountNameCredit: data["accName"],
      paymentAmount: data["totalAmount"],
      paymentContent: data["tranDesc"],  
      numberDocType:data["cif"]    

    })
    if (data["paymentType"].startsWith("CP")) {     
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


      this.formPayment.patchValue({
        customerName: data["customerName"],
        gtttnumber: data["soGttt"],
        dateGttt: moment(data["gtttDate"] , 'YYYY-MM-DD' ).format('DD/MM/YYYY'),
        feeAmount: Number(data["feeDvTh"]),
        feeAmountvat: Number(data["vatFeeDvTh"]),
        feeAmount_ct: Number(data["feeAmount"]),
        feeAmountvat_ct: Number(data["vat"])  
      })
    }
    this.init = false;
  }

  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  

  resetFormPayment() {
    this.formPayment.controls["numberDocType"].reset();
    this.formPayment.patchValue({
      paymentAmount: 0,
      paymentMethod: "CP03",
      feeAmount:0,
      feeAmountvat:0,
      feeAmount_ct:0,
      feeAmountvat_ct:0,
      customerName:"",
      gtttnumber:"",
      dpDateGttt:null,
      paymentContent: "",
      numberDocType: "",
      accountDebit: "",
      accountNameDebit: "",
      accountBranchCodeDebit: "",
      accountBalance: 0
    });
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
    await this.tuitionService.getAccountCustomers(params.customerCifNumber, params.pageNumber, params.recordPerPage).toPromise().then(res => {
      if (res["data"]) {
        this.customerAccounts = res["data"];
        if (this.init && this.type === "edit") {
          return;
        }
        this.formPayment.patchValue({
          accountDebit: this.customerAccounts[0]["accountNumber"],
          accountNameDebit: this.customerAccounts[0]["accountName"],
          accountBranchCodeDebit: this.customerAccounts[0]["branchCode"],
          accountBalance: this.customerAccounts[0]["acyCurr_Balance"] // Chờ API để cập nhật availableBalance
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
        //accountDebit: rowAccountDebit["accountNumber"],
        accountNameDebit: rowAccountDebit["accountName"],
        accountBranchCodeDebit: rowAccountDebit["branchCode"],
        accountBalance: rowAccountDebit["acyCurr_Balance"], // Chờ API để cập nhật availableBalance

      })
      return;
    }
    this.formPayment.patchValue({
      accountNameDebit: "",
      accountBranchCodeDebit: "",
      accountBalance: 0 // Chờ API để cập nhật
    })
  }



  // onChange(): void {
  //   console.log('Paymnww');
  //   console.log(this.paymentMethods);
  //   // if (this.idTrans) {
  //   //   this.tuitionService.getTransactionByID(this.idTrans).subscribe((res) => {
  //   //     if (res.data) {
  //   //       this.rootData = res.data;
  //   //       this.handleData();
  //   //     }
  //   //   })
  //   // }
  // }

}
