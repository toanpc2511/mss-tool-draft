import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionModel } from 'src/app/shared/models/ActionModel';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { TextHelper } from 'src/app/shared/utilites/text';
import { DepositFormComponent } from '../shared/components/deposit-form/deposit-form.component';

import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import {
  CHARGE_TYPES,
  CURRENCIES,
  DOC_TYPES,
  FETCH_STATUS,
} from '../shared/constants/deposit-common';
import { AccountStatus } from '../shared/models/common';
import { Deposit } from '../shared/models/deposit';
import { DepositService } from '../shared/services/deposit.service';
import { ValidatorHelper, NumberValidatorHelper } from 'src/app/shared/utilites/validators.helper';
declare var $: any;
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  createForm: FormGroup;

  @ViewChild('depositForm') depositForm: DepositFormComponent;
  dialogRef: any;
  statuses: AccountStatus;
  userInfo: any;
  transactionId: string;
  version: number;
  actions: ActionModel[] = [
    {
      actionIcon: 'save',
      actionName: 'Lưu thông tin',
      actionClick: () => this.onSave(),
    },
    {
      actionIcon: 'send',
      actionName: 'Gửi duyệt',
      actionClick: () => this.onSendApprove(),
    },
  ];

  constructor(
    private fb: FormBuilder,
    private depositService: DepositService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogService: LpbDialogService,
    private customNotificationService: CustomNotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dialogService.setDialog(this.dialog);
    $('.parentName').html('Nộp tiền');
    $('.childName').html('Yêu cầu nộp tiền');
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.initForm();
  }

  initForm(): void {
    this.createForm = this.fb.group({
      transactionCode: [null],
      productCode: [null, [Validators.required]],
      cifNo: [null, [ValidatorHelper.required]],
      acn: [null, [ValidatorHelper.required]],
      accountBranchCode: [{ value: null, disabled: true }],
      accountName: [{ value: null, disabled: true }],
      customerName: [{ value: null, disabled: true }],
      docNum: [null, [ValidatorHelper.required]],
      docType: [{ value: DOC_TYPES.CCCD, disabled: true }],
      docIssueDate: [{ value: null, disabled: true }],
      docIssuePlace: [{ value: null, disabled: true }],
      curCode: [{ value: null, disabled: true }],
      transactionAmount: [null, [NumberValidatorHelper.required]], // Số tiền giao dịch
      employeeId: [null],
      totalAmount: [{ value: null, disabled: true }], // Tổng số tiền
      feeType: [CHARGE_TYPES.FREE],
      fee: [0],
      feeVAT: [0],
      feeEx: [0],
      feeVATEx: [0],
      // currentBalance: [null],

      negotiatorFullName: [null, [ValidatorHelper.required]],
      negotiatorDocNum: [null, [ValidatorHelper.required]],
      negotiatorDocType: [DOC_TYPES.CCCD, [Validators.required]],

      negotiatorPhone: [null, [ValidatorHelper.required]],
      negotiatorAddress: [null, [ValidatorHelper.required]],
      note: ['', [ValidatorHelper.required]],

      moneyList: this.fb.array([]),
      moneyListSum: [null],
    });
  }

  backToSearch(): void {
    this.router.navigate(['../list'], {
      relativeTo: this.activatedRoute,
    });
  }

  navigateToDetail(id: string): void {
    this.router.navigate(['../detail'], {
      relativeTo: this.activatedRoute,
      queryParams: {
        transId: id,
      },
    });
  }

  isMoneyListEmpty(): boolean {
    const frmValues = this.createForm.getRawValue();
    const emptyRows = frmValues.moneyList.filter(
      (row) => row.quantity === null
    );
    return emptyRows?.length === frmValues.moneyList?.length;
  }

  onSave(): void {
    const frmValue = this.createForm.getRawValue();
    if (!this.depositForm.validateForm()) {
      return;
    }

    const dialogParams: ILpbDialog = {
      messages: [],
      title: 'Thông báo',
      buttons: {},
    };

    const handleSave = () => {
      this.saveDeposit({
        successMsg: 'Lưu thành công',
        callback: (data) => {
          this.navigateToDetail(data.id);
        },
      });
    };

    if (frmValue.curCode !== CURRENCIES.VND) {
      handleSave();
      return;
    }

    if (frmValue.curCode === CURRENCIES.VND && this.isMoneyListEmpty()) {
      handleSave();
      return;
    }

    const diff = Math.abs(frmValue.moneyListSum - frmValue.totalAmount);
    if (diff === 0) {
      handleSave();
      return;
    }

    if (diff >= 100) {
      dialogParams.messages = [
        'Số tiền giao dịch và số tiền trên bảng kê chênh lệch hơn 100 VND.',
      ];
      dialogParams.buttons = { dismiss: { display: true } };
      dialogParams.buttons = { confirm: { display: false } };

      this.dialogService.openDialog(dialogParams, () => {});
    }
    //
    else {
      dialogParams.messages = [
        'Số tiền giao dịch và số tiền trên bảng kê chênh lệch nhỏ hơn 100 VND.',
      ];
      dialogParams.buttons = { confirm: { display: true } };
      dialogParams.buttons = { dismiss: { display: true } };
      this.dialogService.openDialog(dialogParams, () => {
        handleSave();
      });
    }
  }

  openApproveDialog(): void {
    const dialogParams: ILpbDialog = {
      messages: [],
      title: 'Xác nhận gửi duyệt',
      buttons: {},
    };

    dialogParams.messages = [
      'Bạn có chắc chắn muốn gửi duyệt giao dịch?',
      `Số tài khoản: ${this.createForm.get('acn').value}.`,
    ];
    dialogParams.buttons = { confirm: { display: true } };
    dialogParams.buttons = { dismiss: { display: true } };
    this.dialogService.openDialog(dialogParams, () => {
      if (!this.transactionId) {
        this.saveDeposit({
          callback: () => {
            this.sendDepositApprove('Gửi duyệt thành công');
          },
        });
      } else {
        this.sendDepositApprove('Gửi duyệt thành công');
      }
    });
  }

  onSendApprove(): void {
    if (!this.depositForm.validateForm()) {
      return;
    }
    const frmValue = this.createForm.getRawValue();
    const dialogParams: ILpbDialog = {
      messages: [],
      title: 'Thông báo',
      buttons: {},
    };

    if (frmValue.curCode !== CURRENCIES.VND) {
      this.openApproveDialog();
      return;
    }

    if (frmValue.curCode === CURRENCIES.VND && this.isMoneyListEmpty()) {
      this.openApproveDialog();
      return;
    }

    const diff = Math.abs(frmValue.moneyListSum - frmValue.totalAmount);
    if (diff === 0) {
      this.openApproveDialog();
      return;
    }

    if (diff >= 100) {
      dialogParams.messages = [
        'Số tiền giao dịch và số tiền trên bảng kê chênh lệch hơn 100 VND.',
      ];
      dialogParams.buttons = { dismiss: { display: true } };
      dialogParams.buttons = { confirm: { display: false } };
      this.dialogService.openDialog(dialogParams, () => {});
    }
    //
    else {
      dialogParams.messages = [
        'Số tiền giao dịch và số tiền trên bảng kê chênh lệch nhỏ hơn 100 VND.',
      ];
      dialogParams.buttons = { confirm: { display: true } };
      dialogParams.buttons = { dismiss: { display: true } };

      this.dialogService.openDialog(dialogParams, () => {
        this.openApproveDialog();
      });
    }
  }

  saveDeposit({
    successMsg,
    callback,
  }: {
    successMsg?: string;
    callback?: (data: Deposit) => void;
  }): void {
    const frmValues = this.createForm.getRawValue();
    const isFree = frmValues.feeType === CHARGE_TYPES.FREE;
    const feeJSON = {
      exchangeAmount: isFree ? 0 : Number(frmValues.feeEx),
      exchangeVAT: isFree ? 0 : Number(frmValues.feeVATEx),
      vnAmount: isFree ? 0 : Number(frmValues.fee),
      vnVAT: isFree ? 0 : Number(frmValues.feeVAT),
    };
    const receiptJson: { total: number | string; receipts: any[] } = {
      total: 0,
      receipts: [],
    };
    frmValues.moneyList.forEach((till) => {
      receiptJson.total = Number(receiptJson.total) + Number(till.total);
      const { quantity, denomination, total } = till;
      if (quantity && denomination) {
        receiptJson.receipts.push({ quantity, denomination, amount: total });
      }
    });
    receiptJson.total = this.isMoneyListEmpty() ? '' : receiptJson.total;

    const negotiatorAddress = TextHelper.latinNormalize(
      frmValues.negotiatorAddress?.trim()?.toUpperCase()
    );
    const note = TextHelper.latinNormalize(
      frmValues.note?.trim()?.toUpperCase()
    );
    const negotiatorFullName = TextHelper.latinNormalize(
      frmValues.negotiatorFullName?.trim()?.toUpperCase()
    );

    const request: Deposit = {
      accountBranchCode: frmValues.accountBranchCode?.trim(),
      acn: frmValues.acn?.trim(),
      branchCode: this.userInfo.branchCode?.trim(),
      cifNo: frmValues.cifNo?.trim(),
      accountName: frmValues.accountName?.trim(),
      customerName: frmValues.customerName,
      curCode: frmValues.curCode?.trim(),
      docIssueDate: frmValues.docIssueDate?.trim(),
      docIssuePlace: frmValues.docIssuePlace?.trim(),
      docNum: frmValues.docNum?.trim(),
      docType: frmValues.docType?.trim(),
      employeeId: frmValues.employeeId?.trim(),
      feeJson: JSON.stringify(feeJSON),
      feeType: frmValues.feeType?.trim(),
      negotiatorAddress,
      negotiatorDocNum: frmValues.negotiatorDocNum?.trim(),
      negotiatorDocType: frmValues.negotiatorDocType?.trim(),
      negotiatorFullName,
      negotiatorPhone: frmValues.negotiatorPhone?.trim(),
      note,
      productCode: frmValues.productCode?.trim(),
      receiptJson: JSON.stringify(receiptJson),
      totalAmount: frmValues.totalAmount,
      transactionAmount: frmValues.transactionAmount,
    };

    this.depositService.saveDeposit(request).subscribe(
      (res) => {
        if (res && res.data) {
          this.transactionId = res.data.id;
          this.version = res.data.version;
          this.depositForm.disableForm();
          if (callback) {
            callback(res.data);
          }
          if (successMsg) {
            this.customNotificationService.success('Thông báo', successMsg);
          }
        }
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
      },
      () => {}
    );
  }

  sendDepositApprove(successMsg: string): void {
    this.depositService.sendApprove(this.transactionId, this.version).subscribe(
      (res) => {
        if (res && res.data) {
          this.customNotificationService.success('Thông báo', successMsg);
          this.navigateToDetail(res.data.id);
        }
      },
      (error) => {
        this.customNotificationService.error('Thông báo', error?.message);
      },
      () => {}
    );
  }

  ngOnDestroy(): void {
    this.dialogService.closeDialog();
  }
}
