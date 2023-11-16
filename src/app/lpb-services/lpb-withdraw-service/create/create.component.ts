import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { ActionModel } from 'src/app/shared/models/ActionModel';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import { TextHelper } from 'src/app/shared/utilites/text';
import { CHARGE_TYPES } from 'src/app/shared/constants/finance';
import { DOC_TYPES } from 'src/app/shared/constants/identity-certification';
import { WithdrawFormComponent } from '../shared/components/withdraw-form/withdraw-form.component';
import { Withdraw } from '../shared/model/withdraw';
import { WithdrawFormService } from '../shared/services/withdraw-form.service';
import { WithdrawService } from '../shared/services/withdraw.service';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { ValidatorHelper, NumberValidatorHelper } from 'src/app/shared/utilites/validators.helper';

declare var $: any;
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {
  createForm: FormGroup;

  @ViewChild('withdrawForm') withdrawForm: WithdrawFormComponent;
  dialogRef: any;
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
    private withdrawService: WithdrawService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialogService: LpbDialogService,
    private customNotificationService: CustomNotificationService,
    private dialog: MatDialog,
    private withdrawFormService: WithdrawFormService,
  ) {}

  ngOnInit(): void {
    this.dialogService.setDialog(this.dialog);
    $('.parentName').html('Rút tiền');
    $('.childName').html('Yêu cầu rút tiền');
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
      curCode: [{ value: null, disabled: true }],
      transactionAmount: [null, [NumberValidatorHelper.required]], // Số tiền giao dịch
      employeeId: [null],
      totalAmount: [{ value: null, disabled: true }], // Tổng số tiền
      totalWithdrawAmount: [{ value: null, disabled: true }], // Tổng số tiền chi
      feeType: [CHARGE_TYPES.FREE],
      fee: [0],
      feeVAT: [0],
      feeEx: [0],
      feeVATEx: [0],
      availableBalance: [null],

      negotiatorFullName: [null, [ValidatorHelper.required]],
      negotiatorDocNum: [null, [ValidatorHelper.required]],
      negotiatorDocType: [DOC_TYPES.CCCD, [Validators.required]],

      negotiatorPhone: [null, [ValidatorHelper.required]],
      negotiatorAddress: [null, [ValidatorHelper.required]],
      negotiatorDocIssueDate: [null, [ValidatorHelper.required]],
      negotiatorDocIssuePlace: [null, [ValidatorHelper.required]],
      note: ['', [ValidatorHelper.required]],

      moneyList: this.fb.array([]),
      moneyListSum: [null],
    });
    this.withdrawFormService.setForm(this.createForm);
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

  onSave(): void {
    if (!this.withdrawForm.validateForm()) {
      return;
    }

    this.withdrawFormService.checkAccountRelation(() => {
      this.withdrawFormService.validateMoney(() => {
        this.saveWithdraw({
          successMsg: 'Lưu thành công',
          callback: (data) => {
            this.navigateToDetail(data.id);
          },
        });
      });
    });
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
        this.saveWithdraw({
          callback: () => {
            this.sendWithdrawApprove('Gửi duyệt thành công');
          },
        });
      } else {
        this.sendWithdrawApprove('Gửi duyệt thành công');
      }
    });
  }

  onSendApprove(): void {
    if (!this.withdrawForm.validateForm()) {
      return;
    }

    this.withdrawFormService.checkAccountRelation(() => {
      this.withdrawFormService.validateMoney(() => {
        this.openApproveDialog();
      });
    })
  }

  saveWithdraw({
    successMsg,
    callback,
  }: {
    successMsg?: string;
    callback?: (data: Withdraw) => void;
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
    receiptJson.total = this.withdrawFormService.isMoneyListEmpty()
      ? ''
      : receiptJson.total;

    const negotiatorAddress = TextHelper.latinNormalize(
      frmValues.negotiatorAddress?.trim()?.toUpperCase()
    );
    const note = TextHelper.latinNormalize(
      frmValues.note?.trim()?.toUpperCase()
    );
    const negotiatorFullName = TextHelper.latinNormalize(
      frmValues.negotiatorFullName?.trim()?.toUpperCase()
    );

    const request: Withdraw = {
      accountBranchCode: frmValues.accountBranchCode?.trim(),
      acn: frmValues.acn?.trim(),
      branchCode: this.userInfo.branchCode?.trim(),
      cifNo: frmValues.cifNo?.trim(),
      accountName: frmValues.accountName?.trim(),
      customerName: frmValues.customerName,
      curCode: frmValues.curCode?.trim(),
      docNum: frmValues.docNum?.trim(),
      docType: frmValues.docType?.trim(),
      employeeId: frmValues.employeeId?.trim(),
      feeJson: JSON.stringify(feeJSON),
      feeType: frmValues.feeType?.trim(),
      negotiatorAddress,
      negotiatorDocNum: frmValues.negotiatorDocNum?.trim(),
      negotiatorDocType: frmValues.negotiatorDocType?.trim(),
      negotiatorFullName,
      negotiatorDocIssueDate: frmValues.negotiatorDocIssueDate?.trim(),
      negotiatorDocIssuePlace: frmValues.negotiatorDocIssuePlace?.trim(),
      negotiatorPhone: frmValues.negotiatorPhone?.trim(),
      note,
      productCode: frmValues.productCode?.trim(),
      receiptJson: JSON.stringify(receiptJson),
      totalAmount: frmValues.totalAmount,
      transactionAmount: frmValues.transactionAmount,
    };

    this.withdrawService.saveWithdraw(request).subscribe(
      (res) => {
        if (res && res.data) {
          this.transactionId = res.data.id;
          this.version = res.data.version;
          this.withdrawForm.disableForm();
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

  sendWithdrawApprove(successMsg: string): void {
    this.withdrawService
      .sendApprove(this.transactionId, this.version)
      .subscribe(
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
