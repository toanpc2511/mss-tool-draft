import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ActionModel } from 'src/app/shared/models/ActionModel';

import {
  ICustomerInfo,
  IFilterCreatePayment,
  IListBillInfo,
  IRuleResponses,
  ISettleAccountInfo,
  ISupplierFormGroups,
  ITranPost,
} from '../../shared/models/water.interface';
import { WaterService } from '../../shared/services/water.service';

import { LpbDatatableConfig } from '../../../../shared/models/LpbDatatableConfig';
import {
  PaymentPeroidType,
  PaymentType,
} from '../../../../shared/enums/PaymentType';
import { PaymentInfoComponent } from '../../shared/components/payment-info/payment-info.component';
import { Router } from '@angular/router';
import { COLUMNS_BILLS_CREATE } from '../../shared/constants/water.constant';
import { ultis } from 'src/app/shared/utilites/function';
import { LpbTableService } from 'src/app/shared/services/lpb-table.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormMessageService } from 'src/app/shared/services/form-message.service';

declare const $: any;

@Component({
  selector: 'app-water-create-payment',
  templateUrl: './water-create-payment.component.html',
  styleUrls: ['./water-create-payment.component.scss'],
  providers: [LpbTableService]
})
export class WaterCreatePaymentComponent implements OnInit {
  formSearch = this.fb.group({
    supplierCode: [null, Validators.required],
    customerId: ['', Validators.required],
  });

  searched = false;
  isLoading = false;
  //
  dataSource: IListBillInfo[] = [];
  customerInfo: ICustomerInfo;
  settleAccountInfo: ISettleAccountInfo;
  supplierFormGroups: ISupplierFormGroups[];
  periodPaymentType: IRuleResponses[];
  paymentRuleName = '';

  config: LpbDatatableConfig = {
    hasNoIndex: true,
    hasSelection: true,
    hiddenActionColumn: true,
    hasPaging: false
  };
  isDisableCheckRow = false;
  isDisableCheckAll = false;
  selection = new SelectionModel<any>(true, []);
  paymentRule: any = {};

  columns = COLUMNS_BILLS_CREATE;
  rowsSelected = [];
  typeServiceChangeDebt = PaymentType.PART;
  //

  paymentContentStart = '';
  @ViewChild('paymentInfo') paymentInfo: PaymentInfoComponent;

  actions: ActionModel[] = [
    {
      actionName: 'Hủy',
      actionIcon: '',
      actionClick: () => this.cancel(),
    },
    {
      actionName: 'Lưu',
      actionIcon: 'save',
      actionClick: () => this.save(),
    },
  ];
  //
  constructor(
    private router: Router,
    private waterService: WaterService,
    private fb: FormBuilder,
    private formMessageService: FormMessageService,
    private lpbTableService: LpbTableService
  ) { }

  ngOnInit() {
    $('.childName').html('Thanh toán tại quầy / Tạo thanh toán');
  }
  //
  invalid(control: AbstractControl) {
    return control.invalid && (control.dirty || control.touched);
  }
  //
  infoSearchChange() {
    this.searched = false;
  }

  async search() {
    if (this.formSearch.invalid) {
      this.formSearch.markAllAsTouched();
      return;
    }
    this.searched = false;
    this.selection.clear();
    this.isLoading = true;
    let params = {
      customerId: this.formSearch.value.customerId.trim(),
      serviceType: 'WATER_SERVICE',
      supplierCode: this.formSearch.value.supplierCode.trim(),
    };

    forkJoin([
      this.waterService.getSupplierFromCode(this.formSearch.value.supplierCode),
      this.waterService.getBills(
        params.customerId,
        params.serviceType,
        params.supplierCode
      ),
    ])
      .toPromise()
      .then((res) => {
        let supplier = res[0]['data'];
        this.supplierFormGroups = supplier['supplierFormGroups'];
        if (this.checkRules()) {
          return;
        }
        this.setRuleConfig();
        //
        let bills = res[1]['data'];
        let dataSource = bills[0]['listBillInfo'];
        dataSource = dataSource.map((x) => {
          return {
            ...x,
            billYearMonth: `${x.billCode}/${ultis.formatDay(x.billId)}`,
            billPeriod: `Tháng ${x.billId}/${x.billCode}`,
            custName: bills[0].customerInfo.custName,
            custDesc: bills[0].customerInfo.custDesc,
          };
        });

        this.order(dataSource);
        this.dataSource = dataSource;
        //
        this.customerInfo = bills[0]['customerInfo'];
        this.settleAccountInfo = bills[0]['settleAccountInfo'][0];
        this.paymentContentStart = bills[0]['prefix'];
        this.autoCheckRow(this.paymentRule);
        this.searched = true;
        setTimeout(() => {
          this.paymentInfo.formPayment.patchValue({
            accountNumberCredit: this.settleAccountInfo['settleAcNo'],
            accountNameCredit: this.settleAccountInfo['settleAcDesc'],
          });
        });

      })
      .catch((err) => {
        this.formMessageService.handleError(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  checkRules() {
    let formGroup1 = this.supplierFormGroups.find(
      (x) => x['code'] === 'UNI-FORMGROUP1'
    );
    if (!formGroup1) {
      let message = 'Nhà cung cấp này không có quy tắc loại kỳ thanh toán !';
      this.formMessageService.openMessageError(message);
      return true;
    }
    const paymentRuleGroup1 = formGroup1['ruleResponses'].find(
      (x) => x.selected
    );
    if (!paymentRuleGroup1) {
      let message =
        'Nhà cung cấp này không có quy tắc kỳ thanh toán cụ thể nào !';
      this.formMessageService.openMessageError(message);
      return true;
    }

    let formGroup2 = this.supplierFormGroups.find(
      (x) => x['code'] === 'UNI-FORMGROUP2'
    );
    if (!formGroup2) {
      let message = 'Nhà cung cấp này không có quy tắc loại hình thanh toán !';
      this.formMessageService.openMessageError(message);
      return true;
    }
    const paymentRuleGroup2 = formGroup2['ruleResponses'].find(
      (x) => x.selected
    );
    if (!paymentRuleGroup2) {
      let message =
        'Nhà cung cấp này không có quy tắc loại hình thanh toán cụ thể nào !';
      this.formMessageService.openMessageError(message);
      return true;
    }
    this.periodPaymentType = [];
    this.periodPaymentType.push(paymentRuleGroup1, paymentRuleGroup2);
    this.paymentRuleName = `${paymentRuleGroup1.name}, ${paymentRuleGroup2.name}`;
    return false;
  }

  setRuleConfig() {
    let formGroup3 = this.supplierFormGroups.find(x => x["code"] === "UNI-FORMGROUP3");
    if (formGroup3) {
      const paymentRuleGroup3 = formGroup3["ruleResponses"].find(x => x.selected);
      if (paymentRuleGroup3 && paymentRuleGroup3.code === "UNI-RULE7") {
        this.typeServiceChangeDebt = PaymentType.ALL
      }
    }

    if (this.periodPaymentType[0].code === 'UNI-RULE1') {
      this.paymentRule.paymentPeroidType = PaymentPeroidType.NEAR_TO_FAR;
    }
    if (this.periodPaymentType[0].code === 'UNI-RULE2') {
      this.paymentRule.paymentPeroidType = PaymentPeroidType.FAR_TO_NEAR;
    }
    if (this.periodPaymentType[0].code === 'UNI-RULE3') {
      this.paymentRule.paymentPeroidType = PaymentPeroidType.ANY;
    }
    if (this.periodPaymentType[1].code === 'UNI-RULE4') {
      // Một kỳ
      this.paymentRule.paymentType = PaymentType.PART;
    }
    if (this.periodPaymentType[1].code === 'UNI-RULE5' || this.typeServiceChangeDebt === PaymentType.ALL) {
      // Toàn bộ
      this.paymentRule.paymentType = PaymentType.ALL;
    }
    if (this.periodPaymentType[1].code === 'UNI-RULE6') {
      this.paymentRule.paymentType = PaymentType.ALL_OR_PART;
    }
  }
  //
  order(dataSource) {
    if (this.paymentRule.paymentPeroidType === PaymentPeroidType.NEAR_TO_FAR) {
      ultis.order(dataSource, "billYearMonth desc")
    }
    if (this.paymentRule.paymentPeroidType === PaymentPeroidType.FAR_TO_NEAR) {
      ultis.order(dataSource, "billYearMonth")
    }
  }
  //
  setDisable(paymentRule) {
    this.isDisableCheckAll = false;
    this.isDisableCheckRow = false;
    if (paymentRule.paymentType === PaymentType.PART) {
      this.isDisableCheckAll = true;
      if (paymentRule.paymentPeroidType !== PaymentPeroidType.ANY) {
        this.isDisableCheckRow = true;
      }
    }
    if (paymentRule.paymentType === PaymentType.ALL) {
      this.isDisableCheckAll = true;
      this.isDisableCheckRow = true;
    }
  }
  //
  save(): void {
    let valueForm = this.paymentInfo.formPayment.value;
    if (this.disabledSave() || this.isLoading) {
      if (this.disabledSave()) {
        this.formMessageService.openMessageError('Bạn nhập chưa đủ thông tin !');
      }
      return;
    }
    if (valueForm.accountDebit === this.settleAccountInfo['settleAcNo']) {
      this.formMessageService.openMessageError('Tài khoản ghi nợ không được trùng với tài khoản ghi có !');
      return;
    }
    this.isLoading = true;
    const tranDetails = this.selection.selected.map((item) => {
      return {
        ...item,
        tranDesc: `${this.paymentContentStart} ${item.billInfo}`,
      };
    });
    let tranPostDebit: ITranPost = {
      acBrn: valueForm.accountBranchCodeDebit,
      acNumber: valueForm.accountDebit,
      acName: valueForm.accountNameDebit,
      drcrType: 'D',
    };
    let tranPostCredit: ITranPost = {
      acBrn: this.settleAccountInfo['settleAcBrn'],
      acNumber: this.settleAccountInfo['settleAcNo'],
      acName: this.settleAccountInfo['settleAcDesc'],
      drcrType: 'C',
    };

    let body: IFilterCreatePayment = {
      accBrn: this.settleAccountInfo['settleAcBrn'],
      accName: this.settleAccountInfo['settleAcDesc'],
      accNumber: this.settleAccountInfo['settleAcNo'],
      availableBalance: valueForm.accountBalance,
      cif: valueForm.paymentMethod === 'CK' ? valueForm.numberDocType : '',
      customerId: this.customerInfo['custId'],
      customerName: this.customerInfo['custName'],
      customerAddress: this.customerInfo['custDesc'],
      customerPhone: this.customerInfo['custMobile'],
      paymentType: valueForm.paymentMethod,
      supplierCode: this.formSearch.value.supplierCode,
      totalAmount: valueForm.paymentAmount,
      tranBrn: '',
      tranDesc: valueForm.paymentContent,
      tranName: '',
      ccy: 'VND',
      tranDetails: tranDetails,
      tranPostDebit: tranPostDebit,
      tranPostCredit: tranPostCredit,
    };
    this.waterService
      .createPaymentBill(body)
      .toPromise()
      .then((res) => {
        const message = 'Lưu giao dịch thành công !';
        const title = 'Thành công';
        const btnOk = { text: 'Xem chi tiết', class: 'lpb-btn-primary' };
        this.formMessageService.openMessageSuccess(message, title, btnOk).then(x => {
          this.infoSearchChange();
          if (x) {
            sessionStorage.setItem('waterDataRow', JSON.stringify(res['data']));
            this.router.navigate(['/water-service/pay-at-counter/view']);
          }
        })
      })
      .catch((err) => {
        this.formMessageService.handleError(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  cancel() {
    const message = 'Các dữ liệu bạn vừa tạo sẽ bị xóa, bạn có muốn tiếp tục ?';
    const title = 'Xác nhận';
    const btnOk = { text: 'Xác nhận', class: 'btn-danger' };
    const btnCancel = { text: 'Quay lại', class: 'btn-secondary' };
    this.formMessageService.confirm(title, message, btnOk, btnCancel).then(res => {
      if (res.accept) {
        this.removeContentPayment();
      }
    })
  }

  removeContentPayment() {
    const value = this.paymentInfo.formPayment.value.paymentMethod;
    if (value === "CK") {
      if (!this.isChangeCheck()) {
        this.paymentInfo.resetFormPayment(false);
      } else {
        this.selection.clear();
        this.paymentInfo.resetFormPayment();
      }
    }
  }
  //
  invalidValue(control: AbstractControl) {
    return control.invalid;
  }

  disabledSave() {
    let formPayment = this.paymentInfo.formPayment;
    if (formPayment.value.paymentMethod === 'TTTM') {
      return (
        formPayment.controls['paymentAmount'].invalid ||
        formPayment.controls['paymentContent'].invalid ||
        formPayment.controls['accountNumberCredit'].invalid ||
        formPayment.controls['accountNameCredit'].invalid
      );
    }
    return formPayment.invalid;
  }

  paymentMethodChange(value) {
    if (this.isChangeCheck()) {
      if (value === "TTTM") {
        if (this.selection.selected.length > 1) {
          this.selection.clear();
        }
        const rulePaymentCash = this.getRulePaymentCash();
        this.autoCheckRow(rulePaymentCash);
      } else {
        this.autoCheckRow(this.paymentRule);
      }
    }
  }

  getRulePaymentCash() {
    const rulePaymentCash = JSON.parse(JSON.stringify(this.paymentRule));
    rulePaymentCash.paymentType = PaymentType.PART;
    return rulePaymentCash;
  }

  autoCheckAll() {
    return this.typeServiceChangeDebt === PaymentType.ALL;
  }

  autoCheckOne(paymentRule) {
    return paymentRule.paymentType === PaymentType.PART && paymentRule.paymentPeroidType !== PaymentPeroidType.ANY
  }

  isChangeCheck() {
    return !(this.autoCheckAll() || this.autoCheckOne(this.paymentRule));
  }
  // Xử lý output handle check

  autoCheckRow(paymentRule) {
    this.setDisable(paymentRule);
    if (paymentRule.paymentType === PaymentType.ALL) {
      this.selection.clear();
      this.selection.select(...this.dataSource);
      this.setPaymentInfoAutoCheck();
    }
    if (this.autoCheckOne(paymentRule)) {
      this.selection.clear();
      this.selection.select(this.dataSource[0]);
      this.setPaymentInfoAutoCheck();
    }
  }

  setPaymentInfoAutoCheck() {
    const paymentInfo = this.lpbTableService.getTotalAmountAndPaymentContent(
      this.selection.selected,
      this.paymentContentStart,
      'billAmount',
      'billInfo'
    );
    this.setPaymentInfo(paymentInfo);
  }

  clickCheckRow(event: any) {
    let paymentRule = this.paymentRule;
    if (this.paymentInfo.formPayment.getRawValue().paymentMethod === "TTTM") {
      paymentRule = this.getRulePaymentCash();
    }
    this.lpbTableService.handleClickCheckRow2(
      event.origin,
      event.row,
      this.selection,
      this.dataSource,
      paymentRule,
      'billYearMonth',
    );
  }

  checkAllChange(event: any) {
    const paymentInfo = this.lpbTableService.getTotalAmountAndPaymentContent(
      this.selection.selected,
      this.paymentContentStart,
      'billAmount',
      'billInfo'
    );
    this.setPaymentInfo(paymentInfo);
  }

  setPaymentInfo(paymentInfo: any) {
    setTimeout(() => {
      this.paymentInfo.formPayment.patchValue({
        paymentAmount: paymentInfo.totalAmount,
        paymentContent: paymentInfo.paymentContent
      })
    });
  }

  checkRowChange(event: any) {
    const paymentInfo = this.lpbTableService.handleCheckedRowChange(
      this.paymentInfo.formPayment.get("paymentAmount").value,
      this.paymentInfo.formPayment.get("paymentContent").value,
      event.checked,
      event.row,
      'billAmount',
      'billInfo',
      this.paymentContentStart
    );
    this.setPaymentInfo(paymentInfo);
  }

}
