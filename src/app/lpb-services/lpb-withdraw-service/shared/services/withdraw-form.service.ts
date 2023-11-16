import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { WithdrawService } from './withdraw.service';
import { TextHelper } from 'src/app/shared/utilites/text';
import { AccountRelationRequest, Withdraw } from '../model/withdraw';
import { CustomNotificationService } from 'src/app/shared/services/custom-notification.service';
import {
  ILpbDialog,
  LpbDialogService,
} from 'src/app/shared/services/lpb-dialog.service';
import { CHARGE_TYPES, CURRENCIES } from 'src/app/shared/constants/finance';

@Injectable({
  providedIn: 'root',
})
export class WithdrawFormService {
  private withdrawForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    private withdrawService: WithdrawService,
    private dialogService: LpbDialogService
  ) {
    this.dialogService.setDialog(this.dialog);
  }

  setForm(fb: FormGroup): void {
    this.withdrawForm = fb;
  }

  isMoneyListEmpty(): boolean {
    const frmValues = this.withdrawForm.getRawValue();
    const emptyRows = frmValues.moneyList.filter(
      (row) => row.quantity === null
    );
    return emptyRows?.length === frmValues.moneyList?.length;
  }

  validateMoney(next: () => void): void {
    const frmValue = this.withdrawForm.getRawValue();
    const dialogParams: ILpbDialog = {
      messages: [],
      title: 'Thông báo',
      buttons: {},
    };

    if (frmValue.curCode !== CURRENCIES.VND) {
      next();
      return;
    }

    if (frmValue.curCode === CURRENCIES.VND && this.isMoneyListEmpty()) {
      next();
      return;
    }

    let fee = Number(frmValue.fee);
    let vat = Number(frmValue.feeVAT);
    if (frmValue.curCode !== 'VND') {
      fee = Number(frmValue.feeEx);
      vat = Number(frmValue.feeVATEx);
    }

    let diff = Math.abs(frmValue.moneyListSum - frmValue.totalAmount);
    if (frmValue.feeType === CHARGE_TYPES.INCLUDING) {
      diff = Math.abs(frmValue.totalAmount - fee - vat - frmValue.moneyListSum);
    }

    if (diff === 0) {
      next();
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
        next();
      });
    }
  }

  checkAccountRelation(next: () => void): void{
    const frmValues = this.withdrawForm.getRawValue();
    const req : AccountRelationRequest = {
      acn: frmValues.acn?.trim(),
      cif: frmValues.cifNo?.trim(),
      docTypeOfOwner: frmValues.docType?.trim(),
      docIssueDate: frmValues.docIssueDate?.trim(),
      docNum: frmValues.negotiatorDocNum?.trim(),
      docType: frmValues.negotiatorDocType?.trim(),
    }

    const dialogParams: ILpbDialog = {
      messages: [],
      title: 'Thông báo',
      buttons: {
        confirm: { display: false, label: 'Tiếp tục' },
        dismiss: { display: false, label: 'Đóng' },
      },
    };

    this.withdrawService.getAccountRelation(req).subscribe(
      (res) => {
        if (res.data && res.data.relWarningMessage) {
          if (res.data?.relType === 'NOTFOUND') {
            let message =
              'Khách hàng không phải chủ tài khoản, đề nghị kiểm tra lại thông tin Người rút tiền';
            dialogParams.messages = [message];
            dialogParams.buttons.dismiss.display = true;
            dialogParams.catchDismiss = true;

            this.dialogService.openDialog(dialogParams, (result) => {
              let message =
                'ĐVKD xác nhận thông tin Người rút tiền và Khách hàng được phép thực hiện giao dịch';
              dialogParams.messages = [message];
              dialogParams.buttons.dismiss.display = true;
              dialogParams.buttons.confirm.display = true;
              dialogParams.catchDismiss = false;

              this.dialogService.openDialog(dialogParams, (result) => {
                next();
              });
            });
          } else {
            dialogParams.messages = [res.data.relWarningMessage];
            dialogParams.buttons.dismiss.display = true;
            dialogParams.buttons.confirm.display = true;
            this.dialogService.openDialog(dialogParams, () => {
              next();
            });
          }
        } else {
          next();
        }
      },
      (error) => {
        console.error(error);
      }
    );

  }
}
