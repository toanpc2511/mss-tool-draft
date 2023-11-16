import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ActionModel } from 'src/app/shared/models/ActionModel';

import { LpbDatatableConfig } from '../../../../shared/models/LpbDatatableConfig';
import { Router } from '@angular/router';
import { IBills, ICifSearch, ICustomerInfo, IFilterCifSearch, IFilterCreatePayment, IListBillInfo, ISupplierRule, ITtranRequest } from '../../shared/models/electric.interface';
import { BILLS_CREATE_COLUMNS, PAYMENT_METHODS } from '../../shared/constants/electric.constant';
import { ElectricService } from '../../shared/services/electric.service';
import { ultis } from 'src/app/shared/utilites/function';
import { SelectionModel } from '@angular/cdk/collections';
import { LpbTableService } from 'src/app/shared/services/lpb-table.service';
import { FormMessageService } from 'src/app/shared/services/form-message.service';

declare const $: any;

@Component({
  selector: 'app-electric-create-payment',
  templateUrl: './electric-create-payment.component.html',
  styleUrls: ['./electric-create-payment.component.scss'],
  providers: [LpbTableService]
})
export class ElectricCreatePaymentComponent implements OnInit {
  formSearch = this.fb.group({
    supplier: [null, Validators.required],
    customerId: ["", Validators.required]
  })

  searched = false;
  isLoading = false;
  //

  //
  dataSource: IListBillInfo[] = [];
  customerInfo: ICustomerInfo;

  isDisableCheckRow = false;
  isDisableCheckAll = false;
  selection = new SelectionModel<any>(true, []);

  config: LpbDatatableConfig = {
    hasNoIndex: true,
    hasSelection: true,
    hiddenActionColumn: true,
    hasPaging: false
  };

  columns = BILLS_CREATE_COLUMNS;
  paymentRuleName = "";
  supplierRules: ISupplierRule[] = [];
  paymentRule: any = {};
  //

  paymentContentStart = "";
  paymentMethods = PAYMENT_METHODS;
  customerAccounts: ICifSearch[] = [];
  formPayment = this.fb.group({
    paymentMethod: [this.paymentMethods[0].value, Validators.required],
    paymentAmount: [0, Validators.required],
    paymentContent: ["", Validators.required],
    cifNumber: [null, Validators.required],
    debitAccountNumber: [null, Validators.required],
    debitAccountName: [null, Validators.required],
    debitAccountPreBalance: [null, Validators.required],
    debitAccountBrnCode: [null, Validators.required],
    payerName: [null],
    payerAddress: [null],
    payerPhoneNumber: [null],
    receiptNumber: [null]
  })
  hasInputReceiptNumber = false;
  creditInfos: any[] = [];
  creditInfosAll: any[] = [];

  actions: ActionModel[] = [
    {
      actionName: "Lưu",
      actionIcon: "save",
      actionClick: () => this.save()
    }
  ]
  //
  constructor(public matdialog: MatDialog, private router: Router, private lpbTableService: LpbTableService, private formMessageService: FormMessageService,
    private electricService: ElectricService, private fb: FormBuilder) {
  }

  ngOnInit() {
    $('.parentName').html('Thanh toán hóa đơn điện');
    $('.childName').html('Thanh toán tại quầy / Tạo thanh toán');
    this.formValueChanges();
  }
  //
  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }

  formValueChanges() {
    this.formSearch.valueChanges.subscribe(x => {
      this.searched = false;
    })

    this.formPayment.get("debitAccountNumber").valueChanges.subscribe(value => {
      const data = this.customerAccounts.find(x => x.accountNumber === value);
      if (data) {
        this.formPayment.patchValue({
          debitAccountName: data.accountName,
          debitAccountPreBalance: data.availableBalance,
          payerAddress: data.custAddress,
          payerName: data.custName,
          payerPhoneNumber: data.custPhone,
          debitAccountBrnCode: data.branchCode
        })
      }
    })
  }
  //
  async search() {
    if (this.formSearch.invalid) {
      this.formSearch.markAllAsTouched();
      return
    }
    this.resetFormPayment();
    this.searched = false;
    this.isLoading = true;
    let params = {
      customerId: this.formSearch.value.customerId.trim(),
      serviceType: "ELECTRIC_SERVICE",
      supplierCode: this.formSearch.value.supplier.supplierCode.trim()
    }

    forkJoin([
      this.electricService.getSupplierRules(this.formSearch.value.supplier.id),
      this.electricService.getBills(params.customerId, params.serviceType, params.supplierCode),
    ]).toPromise().then(res => {
      this.supplierRules = res[0]["data"];
      if (this.checkRules(this.supplierRules)) {
        return;
      }
      this.setRuleConfig(this.supplierRules);
      //
      let bills: IBills = res[1]["data"];
      let dataSource = bills["listBillInfo"];
      dataSource = dataSource.map(x => { return { ...x, sx: this.paymentRule.priorityBillType.includes(x.billType) ? 0 : 1 } })
      ultis.order(dataSource, "sx");
      this.dataSource = dataSource;
      //
      this.customerInfo = bills["customerInfo"];
      this.paymentContentStart = bills["prefix"];
      this.searched = true;
      this.creditInfosAll = this.setInfoCreditAccount(this.dataSource);
      if (this.creditInfosAll.length === 1) {
        this.creditInfos = this.creditInfosAll;
      }
    }).catch(err => {
      this.formMessageService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  checkRules(supplierRules: ISupplierRule[]) {
    let formGroup2 = supplierRules?.find(x => x["paymentGroupCode"] === "UNI-FORMGROUP2");

    if (!formGroup2) {
      let message = "Nhà cung cấp này không có quy tắc loại kỳ thanh toán !";
      this.formMessageService.openMessageError(message);
      return true;
    }
    this.paymentRuleName = `${formGroup2["paymentRuleName"]}`;
    if (formGroup2["paymentRuleCode"] !== "PRIORITY_ELECTRIC") {
      return false;
    }
    let formGroup3 = supplierRules.filter(x => x["paymentGroupCode"] === "UNI-FORMGROUP3");
    if (formGroup3.length === 0) {
      let message = "Với loại kỳ thanh toán là thanh toán hóa đơn ưu tiên trước phải có loại hóa đơn ưu tiên !";
      this.formMessageService.openMessageError(message);
      return true;
    }

    let paymentRuleName = formGroup3.reduce((paymentRuleName, res) => {
      return paymentRuleName += res["paymentRuleName"] + ", ";
    }, "")
    paymentRuleName = paymentRuleName.substring(0, paymentRuleName.length - 2);
    this.paymentRuleName += `, ${formGroup3[0].paymentGroupName}: ` + paymentRuleName;
    return false;
  }

  getRule(formGroupCode = "UNI-FORMGROUP3", fieldName = "paymentRuleCode") {
    const formGroup = this.supplierRules.find(x => x["paymentGroupCode"] === formGroupCode);
    if (formGroup) {
      return formGroup[fieldName];
    }
    return "";
  }

  setRuleConfig(supplierRules: ISupplierRule[]) {
    // Quy tắc loại kỳ thanh toán
    let formGroup2 = supplierRules.find(x => x["paymentGroupCode"] === "UNI-FORMGROUP2");
    if (formGroup2["paymentRuleCode"] === "NO_PRIORITY") {  // Tùy chọn kỳ
      this.paymentRule.paymentPriority = "NO_PRIORITY";
    }
    if (formGroup2["paymentRuleCode"] === "PRIORITY_ELECTRIC") {  // Thanh toán hóa đơn ưu tiên trước
      this.paymentRule.paymentPriority = "PRIORITY_ELECTRIC";
    }
    if (formGroup2["paymentRuleCode"] === "PRIORITY_EVN_ELECTRIC") {  // Thanh toán theo thứ tự sắp xếp của EVN
      this.paymentRule.paymentPriority = "PRIORITY_EVN_ELECTRIC";
    }
    //
    let formGroup3 = supplierRules.filter(x => x["paymentGroupCode"] === "UNI-FORMGROUP3");
    this.paymentRule.priorityBillType = formGroup3.reduce((paymentBillPriority, res) => {
      paymentBillPriority.push(res["paymentRuleParentCode"]);
      return paymentBillPriority;
    }, [])

    // Quy tắc nhập thông tin in biên nhận
    let formGroup4 = supplierRules.find(x => x["paymentGroupCode"] === "UNI-FORMGROUP4");
    if (formGroup4 && formGroup4.paymentRuleCode === "PRINT_RECEIPT") {
      this.hasInputReceiptNumber = true;
    }
  }

  //
  setInfoCreditAccount(dataSource) {    
    const creditInfos = dataSource.reduce((creditInfos, row) => {
      if (row.extraData) {
        if (!creditInfos.find(x => x.settleBillAcNo === row.extraData.settleBillAccount.settleBillAcNo)) {
          creditInfos.push(row.extraData.settleBillAccount);
        }  
      }      
      return creditInfos;
    }, []);
    return creditInfos;
  }

  resetFormPayment() {
    this.selection.clear();
    this.hasInputReceiptNumber = false;
    this.formPayment.reset();
    this.formPayment.patchValue({
      paymentMethod: "CK",
      paymentAmount: 0,
      paymentContent: "",
    })
    this.formPayment.controls.debitAccountNumber.reset();
  }

  async searchAccountCustomers() {
    if (!this.formPayment.value["cifNumber"] || !this.formPayment.value["cifNumber"].trim()) {
      this.formPayment.controls["cifNumber"].markAsTouched();
      return;
    }
    this.isLoading = true;
    let params: IFilterCifSearch = {
      customerCifNumber: this.formPayment.value["cifNumber"].trim(),
      pageNumber: 999999,
      recordPerPage: 1,
    }
    await this.electricService.getAccountCustomers(params.customerCifNumber, params.pageNumber, params.recordPerPage).toPromise().then(res => {
      if (res["data"]) {
        this.customerAccounts = res["data"];
        this.formPayment.patchValue({
          debitAccountNumber: this.customerAccounts[0]["accountNumber"],
          debitAccountName: this.customerAccounts[0]["accountName"],
          debitAccountBrnCode: this.customerAccounts[0]["branchCode"],
          debitAccountPreBalance: this.customerAccounts[0]["availableBalance"], // Chờ API để cập nhật availableBalance
          payerAddress: this.customerAccounts[0]?.custAddress,
          payerName: this.customerAccounts[0]?.custName,
          payerPhoneNumber: this.customerAccounts[0]?.custPhone,
        })
      }
    }).catch(err => {
      this.formMessageService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }
  //
  save() {
    let valueForm = this.formPayment.value;
    if (this.disabledSave() || this.isLoading) {
      if (this.disabledSave()) {
        this.formMessageService.openMessageError("Bạn nhập chưa đủ thông tin !");
      }
      return;
    }
    this.isLoading = true;
    const tranDetails: ITtranRequest[] = this.selection.selected;

    let body: IFilterCreatePayment = {
      brnCustomer: valueForm.debitAccountBrnCode,
      cif: valueForm.paymentMethod === "CK" ? valueForm.cifNumber : "",
      custId: this.customerInfo["custId"],
      custName: this.customerInfo["custName"],
      custAddress: this.customerInfo["custDesc"],
      custType: this.customerInfo["custType"],
      paymentType: valueForm.paymentMethod,
      supplierCode: this.formSearch.value.supplier.supplierCode,
      supplierName: this.formSearch.value.supplier.supplierName,
      totalAmount: valueForm.paymentAmount,
      tranDesc: valueForm.paymentContent,
      ccy: "VND",
      tranRequests: tranDetails,
      custPhoneNumber: '',
      custAcNumber: valueForm.debitAccountNumber,
      custAcName: valueForm.debitAccountName,
      preAmount: valueForm.debitAccountPreBalance,
      payerName: valueForm.payerName,
      payerAddress: valueForm.payerAddress,
      payerPhoneNumber: valueForm.payerPhoneNumber,
      electricCode: this.customerInfo?.custType,
      receiptNumber: valueForm.receiptNumber,
      custInfo: this.customerInfo["otherInfo"],
    }

    this.electricService.createPaymentBill(body).toPromise().then((res) => {
      this.formMessageService.openMessageSuccess(`Tạo thành công ${tranDetails.length} giao dịch !`).then(_ => {
        if (tranDetails.length === 1) {
          sessionStorage.setItem("electricDataRow", JSON.stringify(res.data[0]));
          this.router.navigate(["/electric-service/pay-at-counter/view"]);
          return;
        }
        this.router.navigate(["/electric-service/pay-at-counter"]);
      })
    }).catch(err => {
      this.formMessageService.handleError(err);
    }).finally(() => {
      this.isLoading = false;
    })
  }

  //
  disabledSave() {
    const checkInvalid = ultis.checkInvalid(this.formPayment, ["paymentAmount", "paymentContent", "creditAccountNumber", "creditAccountName"]);

    let checkInvalidTransfer = false;
    if (this.formPayment.value.paymentMethod === "CK") {
      checkInvalidTransfer = ultis.checkInvalid(this.formPayment, ["cifNumber", "debitAccountNumber", "debitAccountName", "debitAccountPreBalance", "debitAccountBrnCode"]);
    }

    return checkInvalid || checkInvalidTransfer;
  }

  clickCheckRow(event: any) {
    this.lpbTableService.handleClickCheckRow(
      event.origin,
      event.row,
      this.selection,
      this.dataSource,
      this.paymentRule,
    );
  }

  checkAllChange(event: any) {
    const paymentInfo = this.lpbTableService.getTotalAmountAndPaymentContent(
      this.selection.selected,
      this.paymentContentStart,
      'billAmount',
      'billInfo'
    );
    this.handleDisplayCreditAcc();
    this.setPaymentInfo(paymentInfo);
  }

  setPaymentInfo(paymentInfo: any) {
    this.formPayment.patchValue({
      paymentAmount: paymentInfo.totalAmount,
      paymentContent: paymentInfo.paymentContent
    })
  }

  checkRowChange(event: any) {
    const paymentInfo = this.lpbTableService.handleCheckedRowChange(
      this.formPayment.get("paymentAmount").value,
      this.formPayment.get("paymentContent").value,
      event.checked,
      event.row,
      'billAmount',
      'billInfo',
      this.paymentContentStart
    );
    this.handleDisplayCreditAcc();
    this.setPaymentInfo(paymentInfo);
  }

  handleDisplayCreditAcc() {
    if (this.creditInfosAll.length < 2) {
      return;
    }
    this.creditInfos = this.setInfoCreditAccount(this.selection.selected);
  }
}
